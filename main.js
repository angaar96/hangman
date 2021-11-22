"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let wordDiv = document.querySelector(".word");
let startGameButton = document.querySelector(".game-start");
const fetchRandomWord = () => __awaiter(void 0, void 0, void 0, function* () {
    // grab a random word from the Random Word API using a fetch. 
    const response = yield fetch("https://random-word-api.herokuapp.com/word?number=1");
    const jsonResponse = yield response.json();
    const randomWord = jsonResponse[0];
    for (let i = 0; i < randomWord.length; i++) {
        // Take each letter of the random word and place it within the DOM, each letter being inside a span element, all enclosed in a div. 
        let letter = document.createElement("span");
        letter.setAttribute("class", "word-letter");
        letter.textContent = randomWord[i];
        // Hide the letter until its guessed correctly
        letter.style.color = "transparent";
        wordDiv.appendChild(letter);
    }
});
fetchRandomWord();
const startGame = () => {
    let allLetters = document.querySelectorAll(".letter");
    let wordLetters = document.querySelectorAll(".word-letter");
    wordLetters.forEach(letter => letter.style.setProperty("--background-color", "black"));
    startGameButton.style.display = "none";
    [...allLetters].forEach(button => {
        // Set animations for keypress
        button.addEventListener("mousedown", (e) => {
            const target = e.target;
            target.classList.add("pressed");
        });
        button.addEventListener("mouseup", (e) => {
            const target = e.target;
            target.classList.remove("pressed");
        });
        // Make keys visible when game is started 
        button.style.visibility = "visible";
    });
    // grab the word which was generated from the API and placed in a span element, and place it into an array. 
    let letterArr = [...wordLetters].map(span => span.innerHTML);
    console.log(letterArr);
    // initialise number of lives and display it on the screen. 
    let noOfLives = 9;
    let gameData = document.querySelector(".game-data");
    gameData.style.visibility = "visible";
    // on each key press we add an event listener to respond to the key guessed. 
    [...allLetters].forEach(chosenLetter => chosenLetter.addEventListener("click", () => {
        console.log(chosenLetter.innerHTML.toLowerCase());
        // grab the chosen letter from the span element 
        let playerLetter = chosenLetter.innerText.toLowerCase();
        // if the chosen letter exists in the word, then highlight the chosen letter as green and remove it from the letterArr. 
        if (letterArr.includes(playerLetter)) {
            console.log("matched");
            chosenLetter.style.backgroundColor = "green";
            [...wordLetters].filter(wordLetter => wordLetter.textContent == playerLetter).forEach(match => match.style.color = "white");
            letterArr = letterArr.filter(item => item !== playerLetter);
        }
        else {
            // remove a life if the guess is incorrect and update the DOM with the correct number of lives. 
            console.log("no match");
            chosenLetter.style.backgroundColor = "red";
            noOfLives -= 1;
            gameData.innerHTML = `LIVES: ${noOfLives.toString()}`;
        }
        console.log(letterArr);
        if (noOfLives <= 0) {
            // At the end of each keypress, assess whether the player has any lives left. If not, then end the game with an alert and a failure message. 
            gameData.style.visibility = "visible";
            gameData.innerHTML = "Oh no, you've lost!";
            // setTimeout ensures window alert happens after elements on page have changed
            setTimeout(() => {
                window.alert("You've ran out of lives, Spider-Man! Play again?");
                location.reload();
            }, 1000);
        }
        if (letterArr.length == 0) {
            // If all letters are successfully guessed, there will be nothing left in letterArr. In this case, end the game with an alert and a success message. 
            console.log("all matches found");
            gameData.style.visibility = "visible";
            gameData.innerHTML = "Well done, you've won!";
            // setTimeout ensures window alert happens after elements on page have changed
            setTimeout(() => {
                window.alert("Well done, you've guessed the word!");
                location.reload();
            }, 1000);
        }
    }));
};
startGameButton.addEventListener("click", startGame);
