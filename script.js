const body = getElement('body');
const words = ['bulbasaur', 'ivysaur', 'venusaur',
    'charmander', 'charmeleon', 'charizard',
    'squirtle', 'wartortle', 'blastoise',
    'weedle', 'kakuna', 'beedrill'];
const qwerty = 'qwertyuiopasdfghjklzxcvbnm';
const main = getElement('main');
let word;
const pMessage = getElement('.message');
const ulWord = getElement('.word');
const ulQwerty = getElement('.qwerty');
let score = 0;
newGame();

function clearMessage() {
    pMessage.textContent = '';
}
function create(type, cls, text, key, value) {
    const element = document.createElement(type);
    cls ? element.className = cls : '';
    text ? element.textContent = text : '';
    key ? element.dataset[key] = value : '';
    return element;
}
function disableKeyboard() {
    let keyboard = getElements('.letters');
    for (const key of keyboard) {
        key.classList.add('disabled');
    }
}


function displayMessage(message, key) {
    if (message == 'same-key-pressed') {
        pMessage.textContent = 'This letter already been guessed';
    }
    if (message == 'you-guessed') {
        pMessage.textContent = `You guessed the letter ${key}`;
    }
    if (message == 'no-match') {
        pMessage.textContent = `Guess again!`;
    }
    if (message == 'match') {
        pMessage.textContent = `You got one right!`;
    }
    if (message == 'win') {
        pMessage.textContent = `You won! Game Over!`;
    }
}
function displayScore(score) {
    let pScore = getElement('.score');
    pScore.textContent = `Score: ${score}`;
}

function getElement(selector) {
    return document.querySelector(selector);
}

function getElements(selector) {
    return document.querySelectorAll(selector);
}

function handleGuess(key) {
    let letterbox = getElements('.letterbox');
    if (word.includes(key)) {
        for (let i = 0; i < word.length; i++) {
            if (word[i] == key) letterbox[i].textContent = key;
        }
        displayMessage('match');
        score += 100;
        displayScore(score);
    } else {
        displayMessage('no-match');
        score -= word.length * 10;
        displayScore(score);
    }
    let guess = '';
    for (const letter of letterbox) {
        guess += letter.textContent;
    }

    if (guess == word) {
        displayMessage('win');
        disableKeyboard();
        body.removeEventListener('keypress', handleKeypress);
        body.removeEventListener('click', handleClick);
        console.log('win');
    }
}

function handleClick(e) {
    let keyboard = getElements('.letters');
    for (const key of keyboard) {
        if (key.dataset.letter == e.target.dataset.letter) {
            if (key.className.includes('disabled')) {
                displayMessage('same-key-pressed');
            } else {
                displayMessage('you-guessed', e.target.dataset.letter[3]);
                key.classList.add('disabled');
                handleGuess(e.target.dataset.letter[3].toLowerCase());
            }
        }
    }
}
function handleKeypress(e) {
    let keyboard = getElements('.letters');
    for (const key of keyboard) {
        if (key.dataset.letter == e.code) {
            if (key.className.includes('disabled')) {
                displayMessage('same-key-pressed');
            } else {
                displayMessage('you-guessed', e.code[3]);
                key.classList.add('disabled');
                handleGuess(e.code[3].toLowerCase());
            }
        }
    }
}

function newGame() {
    word = randomWord();
    for (let i = 0; i < word.length; i++) {
        const li = create('li', 'letterbox', null, 'letter', i);
        ulWord.append(li);
    }
    for (let i = 0; i < qwerty.length; i++) {
        const li = create('li', 'letters', qwerty[i], 'letter', `Key${qwerty[i].toUpperCase()}`);
        ulQwerty.append(li);
    }
    body.addEventListener('keypress', handleKeypress);
    body.addEventListener('click', handleClick);
}

function randomWord() { return words[Math.floor(Math.random() * words.length)]; };






