// scrabble.js
// Lap Yan Cheung (lyc286@nyu.edu)

//setup
const readline = require('readline');
const fs = require('fs');

const letterValues = {
  "E": 1, "A": 1, "I": 1, "O": 1, "N": 1, "R": 1, "T": 1, "L": 1, "S": 1, "U": 1,
  "D": 2, "G": 2, "B": 3, "C": 3, "M": 3, "P": 3, "F": 4, "H": 4, "V": 4, "W": 4,
  "Y": 4, "K": 5, "J": 8, "X": 8, "Q": 10, "Z": 10
};

//function that returns the numerical value of words
function getWordValue(word, letterValues){
  word = word.toUpperCase();
  let value=0;
  for (let c of word){
    value+=letterValues[c];
  }
  return value;
}

//function that prints top 5 scoring words and their values
function printResult(resultArr){
  let output = "\nThe top 5 scoring words are:\n";
  for (let r of resultArr){
    output+=r.value;
    output+='- ';
    output+=r.id;
    output+='\n';
  }
  return output;
}

//console.log(getWordValue("bandcamp",letterValues));

let words = [];
let wordsValues = [];
fs.readFile('data/enable1.txt', 'utf8', function(err, data) { //change to data/enable1.txt once done
  if (err) {
      console.log('Error in reading file:', err);
  } else {
    //console.log(typeof data);
    words = data.split("\n");
    //create an object for each word - and put them in an array
    for (let w of words){
      let wordObject = {
        id: w,
        value: getWordValue(w, letterValues),
      };
      wordsValues.push(wordObject);
    }
    //sort words by their value
    wordsValues.sort(function(a, b) {
      // if a is less than b, then a should be after b
      if(a.value < b.value) {
          return 1;
      } else if(a.value > b.value) {
          return -1;
      } else {
          return 0;
      }
    });
    //debug
    //console.log("Original array size: "+wordsValues.length);
    let userWord = "";
    let filteredWordsArray = [];
    let wordsOutput = [];
    // set up a readline object that can be used for gathering user input
    const userWordInput = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    // ask a question
    userWordInput.question("Enter letters: \n>> ", handleUserInput);

    // the callback function that's run when the readline object receives input
    function handleUserInput(response) {
        userWord = response;
        userWordInput.close();
        //filter out impossible words - words longer than length of user string
        filteredWordsArray = wordsValues.filter(word => (word.id.length <= userWord.length));
        //debug
        //console.log("Filtered array size: "+filteredWordsArray.length);
        //console.log(filteredWordsArray[1].id+" has value: "+filteredWordsArray[1].value);

        /*go through each word in the filtered list FOR-LOOP
          1. Make a copy of user-word as array
          2. For loop- length of the word in list
          3. Delete element from user-word array if char is found
          4. If user-word array has no elements - word can be used -> put to output Array
          5. Once output array has 5 elements - break loop and output results
        */
        for (let w of filteredWordsArray){
          let userWordArr = userWord.split("");
          let wordLength = w.id.length;
          for (let i=0;i<wordLength;i++){
            if (userWordArr.indexOf(w.id.charAt(i))==-1){
              //if a character of word is not found in user-word -> word can't be accounted
              break;
            } else {
              //if character is found in user-word -> remove it from user-word array
              userWordArr.splice(userWordArr.indexOf(w.id.charAt(i)),1);
            }
            if (i==wordLength-1){
              wordsOutput.push(w);
            }
          }
          //break loop if array has 5 elements
          if (wordsOutput.length==5){
            break;
          }
        }
        //output result
        console.log(printResult(wordsOutput));
    }
    //debug
    //console.log(wordsValues[wordsValues.length-1].id+" has value: "+wordsValues[wordsValues.length-1].value);

  }
});
