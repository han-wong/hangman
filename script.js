const body = getElement('body');
const keyboard = getElements('.letters');
const life = getElement('.life');
const main = getElement('main');
const pMsg = getElement('.message');
const ulWord = getElement('.word');
const keyboardStr = 'qwertyuiopasdfghjklzxcvbnm';
const specialStr = ':.- ’♀♂';
const url = './pokemons.json';
let key;
let score = 0;

document.onload = init(url);

function export2txt() {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([JSON.stringify(arrayarray, null, 2)], { type: "text/plain" }));
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
    const keyboard = getElements('.letters');
    for (const key of keyboard) {
        key.classList.add('disabled');
    }
}
function displayKeyboard() {
    const ulKeyboard = getElement('.keyboard');
    for (let i = 0; i < keyboardStr.length + 1; i++) {
        if (i < keyboardStr.length) {
            const li = create('li', 'letters', keyboardStr[i], 'letter', `Key${keyboardStr[i].toUpperCase()}`);
            ulKeyboard.append(li);
        }
        if (i == 9 || i == 18 || i >= 25) {
            const li = create('li', 'letters hidden', '&nbsp;');
            ulKeyboard.append(li);
        }
    }
}
function displayLife() {
    life.innerHTML = `LIFE<br>&nbsp;`;
    for (let i = 0; i < life.dataset.l; i++) {
        life.innerHTML += `${'&hearts;'}`;
    }
}
function displayMessage(message, key) {
    switch (message) {
        case 'same-key-pressed': pMsg.textContent = 'This letter already been guessed';
            break;
        case 'you-guessed': pMsg.textContent = `You guessed the letter ${key}`;
            break;
        case 'no-match': pMsg.textContent = `Guess again!`;
            break;
        case 'match': pMsg.textContent = `You got one right!`;
            break;
        case 'win': pMsg.textContent = `You won! Game Over!`;
            break;
        case 'lose': pMsg.textContent = `You lost! Game Over!`;
            break;
    }
}
function displayScore() {
    const score = getElement('.score');
    const keyboard = getElements('.letters');
    let count = 0;
    for (const key of keyboard) {
        if (key.className == 'letters') {
            count++;
        }
    }
    score.innerHTML = `Score:<br>${count * life.dataset.l}`;
}
function encrypt(char) {
    let i = 0;
    for (i; i < keyboardStr.length; i++) {
        if (keyboardStr[i] == char)
            break;
    }
    return ((key + i) % keyboardStr.length).toString();
}

function getElement(selector) {
    return document.querySelector(selector);
}

function getElements(selector) {
    return document.querySelectorAll(selector);
}
function handleGameOver() {
    disableKeyboard();
    displayMessage('lose');
    sessionStorage.score = 0;
    body.removeEventListener('keypress', handleKeypress);
    body.removeEventListener('click', handleClick);
    getElement('.pokemon').classList.add('show');
}
function handleGuess(key) {
    const letterboxes = getElements('.letterbox');
    let countEmptyLetters = 0;
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
        life.dataset.l--;
        displayMessage('no-match');
        displayLife();
    }
    for (let i = 0; i < letterboxes.length; i++) {
        if (letterboxes[i].textContent == '') {
            countEmptyLetters++;
        }
    }
    if (life.dataset.l == 0) handleGameOver();
    if (countEmptyLetters == 0) {
        displayMessage('win');
        displayScore();
        disableKeyboard();
        getElement('.pokemon').classList.add('show');
        body.removeEventListener('click', handleClick);
        body.removeEventListener('keypress', handleKeypress);
        console.log('win');
    }
}
function handleClick(e) {
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
    const pokemon = randomWord(pokemons);
    life.dataset.l = 7;
    sessionStorage.pokemon = pokemon.name.toLowerCase();
    getElement('.pokemon').style.backgroundImage = `url(${pokemon.src}), url(${pokemon.src})`;
    for (let i = 0; i < sessionStorage.pokemon.length; i++) {
        const letter = sessionStorage.pokemon[i];
        if (keyboardStr.includes(letter)) {
            const li = create('li', 'letterbox', null, 'letter', encrypt(letter));
            ulWord.append(li);
        } else if (specialStr.includes(pokemon[i])) {
            const li = create('li', 'letterbox', encrypt(letter));
            li.classList.add('special');
            ulWord.append(li);
        }
    }
    displayKeyboard();
    body.addEventListener('keypress', handleKeypress);
    body.addEventListener('click', handleClick);
}

function randomWord(words) {
    key = Math.floor(Math.random() * words.length);
    return words[key];
};






