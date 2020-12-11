const words = ['bulbasaur', 'ivysaur', 'venusaur', 'charmander', 'charmeleon', 'charizard', 'squirtle', 'wartortle', 'blastoise'];
const main = document.querySelector('main');
let word;
const ulWord = document.querySelector('.word');

newGame();

function create(type, cls, text) {
    const element = document.createElement(type);
    cls ? element.className = cls : "";
    text ? element.textContent = text : "";
    return element;
}
function newGame() {
    word = randomWord();
    for (let i = 0; i < word.length; i++) {
        console.log(word[i]);
        const li = create('li', 'letterbox', word[i].toString());
        ulWord.append(li);
    }
}

function randomWord() { return words[Math.floor(Math.random() * words.length)]; };



