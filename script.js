const body = getElement('body');
const qwerty = 'qwertyuiopasdfghjklzxcvbnm';
const special = ':.- ’♀♂';
const hidden = '';
const main = getElement('main');
const ulWord = getElement('.word');
const ulQwerty = getElement('.qwerty');
const url = './pokemons.json';
let p;
let key;
let score = 0;
let numberOfGuesses = 7;

document.onload = init(url);

function export2txt() {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([JSON.stringify(arrayarray, null, 2)], {
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
function decrypt(char) {
    let i = 0;
    for (i; i < qwerty.length; i++) {
        if (qwerty[i] == char)
            break;
    }
    return ((key + i) % qwerty.length).toString();
}

function disableKeyboard() {
    let keyboard = getElements('.letters');
    for (const key of keyboard) {
        key.classList.add('disabled');
    }
}

function displayMessage(message, key) {
    const msg = getElement('.message');
    switch (message) {
        case 'same-key-pressed': msg.textContent = 'This letter already been guessed';
            break;
        case 'you-guessed': msg.textContent = `You guessed the letter ${key}`;
            break;
        case 'no-match': msg.textContent = `Guess again!`;
            break;
        case 'match': msg.textContent = `You got one right!`;
            break;
        case 'win': msg.textContent = `You won! Game Over!`;
            break;
        case 'lose': msg.textContent = `You lost! Game Over!`;
            break;
    }
}
function displayScore(lives) {
    const liScore = getElement('.score');
    const keyboard = getElements('.letters');
    let score = 0;
    for (const key of keyboard) {
        if (key.className == 'letters') {
            score++;
        }
    }
    liScore.textContent = `Score: ${score * lives}`;
}


function displayLives() {
    const lives = getElement('.life');
    lives.innerHTML = ``;
    for (let i = 0; i < numberOfGuesses; i++) {
        lives.innerHTML += `${'&hearts;'}`;
    }

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
function handleGameOver() {
    displayMessage('lose');
    disableKeyboard();
    body.removeEventListener('keypress', handleKeypress);
    body.removeEventListener('click', handleClick);
    getElement('.pokemon').classList.add('show');
}

function handleGuess(key) {
    let countEmptyLetters = 0;
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
    } else {
        numberOfGuesses--;
        displayMessage('no-match');
        displayLives();

    }
    for (let i = 0; i < letterboxes.length; i++) {
        if (letterboxes[i].textContent == '') {
            countEmptyLetters++;
        }
    }
    if (numberOfGuesses == 0) handleGameOver();
    if (countEmptyLetters == 0) {
        displayScore(numberOfGuesses);
        displayMessage('win');
        disableKeyboard();
        body.removeEventListener('keypress', handleKeypress);
        body.removeEventListener('click', handleClick);
        getElement('.pokemon').classList.add('show');
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
    p = pokemons;
    let pokemon = randomPokemon(pokemons);
    console.log(pokemon);
    getElement('.pokemon').style.backgroundImage = `url(${pokemon.src}), url(${pokemon.src})`;
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






