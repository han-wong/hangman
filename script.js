const body = getElement('body');
let words = null;
const qwerty = 'qwertyuiopasdfghjklzxcvbnm';
const special = ':.- ’♀♂';
const hidden = '';
const main = getElement('main');
let word;
const pMessage = getElement('.message');
const ulWord = getElement('.word');
const ulQwerty = getElement('.qwerty');
const ulScore = getElements('.score>li');
const url = './pokemons.json';
let key;
let pokemon;
let score = 0;
let numberOfGuesses = 10;

document.onload = init(url);

function export2txt() {
    // let pokemons = [];
    // for (let i = 0; i < words.length; i++) {
    //     const element = words[i];
    //     let pokemon = {};
    //     pokemon['pokedex'] = '#' + (i + 1);
    //     pokemon['name'] = element;
    //     pokemons.push(pokemon);

    // }
    // console.log(pokemons);
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([JSON.stringify(pokemons2, null, 2)], {
        type: "text/plain"
    }));
    a.setAttribute("download", "data.txt");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

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
    ulScore[0].textContent = `Score: ${score}`;
    ulScore[1].textContent = `Guesses left: ${numberOfGuesses}`;
}
function encrypt(char) {
    let i = 0;
    for (i; i < qwerty.length; i++) {
        if (qwerty[i] == char)
            break;
    }
    return ((key + i) % qwerty.length).toString();
}

function getElement(selector) {
    return document.querySelector(selector);
}

function getElements(selector) {
    return document.querySelectorAll(selector);
}

function handleGuess(key) {
    let letterboxes = getElements('.letterbox');
    let encryptedLetters = [];
    for (const letterbox of letterboxes) {
        encryptedLetters.push(letterbox.dataset.letter);
    }
    if (encryptedLetters.includes(encrypt(key))) {
        for (let i = 0; i < encryptedLetters.length; i++) {
            if (encryptedLetters[i] == encrypt(key)) letterboxes[i].textContent = key;
        }
        displayMessage('match');
        score += 10;
        displayScore(score);
    } else {
        displayMessage('no-match');
        score -= Math.floor(5 * word.length);
        numberOfGuesses--;
        displayScore(score);
    }
    let guess = '';
    for (const letter of letterboxes) {
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
            if (key.className.includes('invisible')) {
                displayMessage('same-key-pressed');
            } else {
                displayMessage('you-guessed', e.target.dataset.letter[3]);
                key.classList.add('invisible');
                handleGuess(e.target.dataset.letter[3].toLowerCase());
            }
        }
    }
}
function handleKeypress(e) {
    let keyboard = getElements('.letters');
    for (const key of keyboard) {
        if (key.dataset.letter == e.code) {
            if (key.className.includes('invisible')) {
                displayMessage('same-key-pressed');
            } else {
                displayMessage('you-guessed', e.code[3]);
                key.classList.add('invisible');
                handleGuess(e.code[3].toLowerCase());
            }
        }
    }
}

function init(url) {
    fetch(url)
        .then(response => response.json())
        .then(data => newGame(data))
        .catch(err => console.log(err));
}
function newGame(pokemons) {
    let pokemon = randomPokemon(pokemons);
    console.log(pokemon);
    getElement('.pokemon').src = pokemon.src;
    let name = pokemon.name.toLowerCase();
    for (let i = 0; i < name.length; i++) {
        if (qwerty.includes(name[i])) {
            const li = create('li', 'letterbox', null, 'letter', encrypt(name[i]));
            ulWord.append(li);
        } else if (special.includes(name[i])) {
            const li = create('li', 'letterbox', encrypt(name[i]));
            li.classList.add('special');
            ulWord.append(li);
        } else {
            const li = create('li', 'letterbox', encrypt(name[i]));
            li.classList.add('hidden');
            ulWord.append(li);
        }
    }
    for (let i = 0; i < qwerty.length; i++) {
        const li = create('li', 'letters', qwerty[i], 'letter', `Key${qwerty[i].toUpperCase()}`);
        ulQwerty.append(li);
    }
    body.addEventListener('keypress', handleKeypress);
    body.addEventListener('click', handleClick);
}

function randomPokemon(words) {
    key = Math.floor(Math.random() * words.length);
    return words[key];
};






