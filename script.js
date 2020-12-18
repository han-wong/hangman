const getElement = (selector) => document.querySelector(selector);
const getElements = (selector) => document.querySelectorAll(selector);
const print = (item) => console.log(item);
const randomWord = (words) => words[Math.floor(Math.random() * words.length)];
const removeAllChildNodes = (parent) => { while (parent.firstChild) { parent.removeChild(parent.firstChild); } };
const removeElement = (element) => element.parentNode.removeChild(element);

const liLife = getElement('.life');
const liScore = getElement('.score');
const pText = getElement('.text');
const ulWord = getElement('.word');
const ulKeyboard = getElement('.keyboard');

const LETTERS = 'abcdefghijklmnopqrstuvwxyz';
const SPECIALCHARS = ':.- ’♀♂';
let eKey;
let life;
let score = 0;
let word;
let words;

document.onload = init();

async function init() {
    words = await getData('./pokemons.json');
    newGame();
}
async function getData(url) {
    try { const response = await fetch(url); return await response.json(); }
    catch (error) { console.log(`An error has occured: ${error}`); }
}
function create(tagName, className, textContent, dataset, keyname) {
    const element = document.createElement(tagName);
    if (className) element.className = className;
    if (textContent) element.textContent = textContent;
    if (dataset) element.dataset[dataset] = keyname;
    return element;
}
function decrypt(encChar, key) {
    for (const letter of LETTERS) {
        if (encrypt(letter, key) == encChar)
            return letter;
    }
}
function disableKeys() {
    const keys = getElement('.keyboard').children;
    for (const key of keys) key.classList.add('disabled');
    document.body.removeEventListener('keypress', handleKeypress);
    ulKeyboard.removeEventListener('click', handleClick);
}
function encrypt(char, key) {
    let i = 0;
    for (i; i < LETTERS.length; i++) {
        if (LETTERS[i] == char)
            break;
    }
    return ((key + i) % LETTERS.length).toString();
}
function handleGameOver() {
    document.body.addEventListener('keypress', newGame);
    pText.addEventListener('click', newGame);
    pText.innerHTML = `${word}! Game Over!<br>Click to play again`;
    updateScore();
    disableKeys();
    getElement('.pokemon').classList.add('show');
    score = 0;
}
function handleGameWin() {
    document.body.addEventListener('keypress', newGame);
    pText.addEventListener('click', newGame);
    pText.innerHTML = `You won!<br>Click to continue playing`;
    updateScore();
    disableKeys();
    getElement('.pokemon').classList.add('show');
}
function handleGuess(key) {
    if (!LETTERS.includes(key)) return;
    const keys = getElement('.keyboard').children;
    const letters = getElements('.letter');
    let countEmptyLetters = 0;
    let encLetters = [];
    pText.innerHTML = `You guessed ${key.toUpperCase()}<br>`;
    for (const k of keys) {
        if (k.dataset.key == key) {
            if (k.className.includes('invisible')) {
                pText.innerHTML += `You've already guessed this letter`;
                return;
            } else k.classList.add('invisible');
        }
    }
    for (const letter of letters) {
        encLetters.push(letter.dataset.letter);
    }
    if (encLetters.includes(encrypt(key, eKey))) {
        for (let i = 0; i < encLetters.length; i++) {
            if (encLetters[i] == encrypt(key, eKey)) letters[i].textContent = key;
        }
        pText.innerHTML += `Which is correct!`;
    } else {
        life--;
        pText.innerHTML += `Guess again!`;
        updateLife();
    }
    for (let i = 0; i < letters.length; i++) {
        if (letters[i].textContent == '') {
            countEmptyLetters++;
        }
    }
    if (!life) handleGameOver();
    if (!countEmptyLetters) handleGameWin();
}
function handleClick(e) {
    const CHAR = e.target.dataset.key;
    handleGuess(CHAR);
}
function handleKeypress(e) {
    const CHAR = e.key.toLowerCase();
    handleGuess(CHAR);
}
function newGame() {
    const pokemon = randomWord(words);
    getElement('.pokemon').classList.remove('show');
    removeAllChildNodes(ulWord);
    updateScore();
    document.body.removeEventListener('keypress', newGame);
    eKey = pokemon.pokedex;
    life = 7;
    pText.innerHTML = 'Which Pokémon is this!<br>Click or type letter to guess';
    pText.removeEventListener('click', newGame);
    word = pokemon.name;
    getElement('.pokemon').style.backgroundImage = `url(${pokemon.src}), url(${pokemon.src})`;
    for (let i = 0; i < pokemon.name.length; i++) {
        const letter = pokemon.name[i].toLowerCase();
        if (LETTERS.includes(letter)) {
            const li = create('li', 'letter', null, 'letter', encrypt(letter, eKey));
            ulWord.append(li);
        } else {
            const li = create('li', 'special', encrypt(letter, eKey));
            ulWord.append(li);
        }
    }
    renderKeyboard();
    updateLife();
    document.body.addEventListener('keypress', handleKeypress);
    ulKeyboard.addEventListener('click', handleClick);
}
function renderKeyboard() {
    removeAllChildNodes(ulKeyboard);
    for (let i = 0; i < LETTERS.length; i++) {
        const li = create('li', 'key', LETTERS[i], 'key', `${LETTERS[i]}`);
        ulKeyboard.append(li);
    }
}
function updateLife() {
    liLife.innerHTML = `LIFE<br>`;
    for (let i = 0; i < life; i++) {
        liLife.innerHTML += `${'&hearts;'}`;
    }
}
function updateScore() {
    const keys = getElement('.keyboard').children;
    let count = 0;
    for (const key of keys) {
        if (key.className == 'key') {
            count++;
        }
    }
    if (life) score += count * life;
    liScore.innerHTML = `Score<br>${score}`;
    if (localStorage.score) {
        if (localStorage.score < score) localStorage.score = score;
        liScore.innerHTML += `<br>Hi-Score<br>${localStorage.score}`;
    } else {
        localStorage.score = score;
    }
}
