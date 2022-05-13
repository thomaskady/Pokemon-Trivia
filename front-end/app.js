class AnimatedText {
    constructor(elementId) {
        this.id = elementId;
        this.text = document.getElementById(`text__${this.id}`);
        this.hidden = this.text.textContent.split('');
        this.text.textContent = '';
        let parentDiv = document.querySelector('div');
        this.button = document.createElement('button');
        this.button.textContent = 'Next';
        parentDiv.appendChild(this.button);
        this.button.addEventListener(
            'click',
            this.nextTextBtnHandler.bind(this)
        );
    }

    becomeVisible(hiddenContent) {
        let i = 0;
        this.timer = setInterval(() => {
            hiddenContent[i].classList.add('visible');
            i++;
            if (i === hiddenContent.length - 1) {
                clearInterval(this.timer);
                this.timer = null;
            }
        }, 15);
    }

    completeAnimation() {
        clearInterval(this.timer);
        this.timer = null;
        this.text.textContent = this.text.textContent;
    }

    showNextText(elementId) {
        let idNumber = parseInt(elementId);
        this.text.textContent = '';
        let nextText = new AnimatedText(`${idNumber + 1}`);
        nextText.animateText();
    }

    animateText() {
        this.hiddenLetters = this.hidden.map((letter) => {
            const span = document.createElement('span');
            span.textContent = `${letter}`;
            this.text.appendChild(span);
            return span;
        });

        this.text.classList.remove('invisible');
        this.text.classList.remove('hidden');

        this.becomeVisible(this.hiddenLetters);
    }

    nextTextBtnHandler() {
        if (parseInt(this.id) === 4) {
            this.completeAnimation();
            this.button.remove();
            return;
        }
        if (this.timer === null) {
            this.showNextText(this.id);
            this.button.remove();
        }
        if (this.timer != null) {
            this.completeAnimation();
        }
    }
}

class Encounter {
    constructor(pokedex) {
        this.pokedex = pokedex;
        const encounterButton = document.getElementById('encounter-btn');
        encounterButton.addEventListener(
            'click',
            this.encounterButtonHandler.bind(this)
        );
    }

    generateRandomPokemon() {
        const dexNum = Math.floor(Math.random() * 150);
        const pokemon = this.pokedex[dexNum];
        console.log(pokemon);
        return pokemon;
    }

    render() {
        let pokemon = this.generateRandomPokemon();
        console.log(pokemon);
        console.log(pokemon.imgURL);
        const wildPokemonField = document.getElementById('wild-pokemon');
        this.wildPokemonImg = document.createElement('img');
        this.wildPokemonImg.src = pokemon.imgURL;
        wildPokemonField.appendChild(this.wildPokemonImg);
    }

    encounterButtonHandler() {
        if (this.wildPokemonImg) {
            this.wildPokemonImg.remove();
        }
        this.render();
    }
}

class PlayerSelection {
    pokemon = [];

    constructor(pokedex) {
        this.pokedex = pokedex;
    }

    formStartParty() {
        const BULBASAUR = this.pokedex[0];
        const CHARMANDER = this.pokedex[3];
        const SQUIRTLE = this.pokedex[6];
        this.pokemon.push(BULBASAUR);
        this.pokemon.push(CHARMANDER);
        this.pokemon.push(SQUIRTLE);
    }

    render() {
        this.formStartParty();
        const parentDiv = document.getElementById('pokemon-selection');
        const buttons = parentDiv.querySelectorAll('button');
        for (let i = 0; i < buttons.length; i++) {
            let userPokemonImg = document.createElement('img');
            userPokemonImg.src = this.pokemon[i].imgURL;
            buttons[i].textContent = this.pokemon[i].name.toUpperCase();
            buttons[i].appendChild(userPokemonImg);
        }
    }
}


class Entry {
    constructor(id, name, imgURL, type) {
        this.id = id;
        this.name = name;
        this.imgURL = imgURL;
        this.type = type;
    }
}

class Pokedex {
    static async createEntries(type, search) {
        Pokedex.entries = [];
        for (let i = 1; i <= 151; i++) {
            const data = await Pokedex.fetchData(type, i);
            let entry = new Entry(
                data.id,
                data.name,
                data.sprites.front_default,
                data.types
            );
            Pokedex.entries.push(entry);
        }
        console.log(Pokedex.entries);
        return Pokedex.entries;
    }

    static async fetchData(type, search) {
        const res = await fetch(`https://pokeapi.co/api/v2/${type}/${search}`);
        const data = await res.json();
        return data;
    }
}

class App {
    static async init() {
        let pokedex = await Pokedex.createEntries('pokemon');
        let encounter = new Encounter(pokedex);
        let starters = new PlayerSelection(pokedex);
        starters.render();
    }

    static renderText() {
        let animation = new AnimatedText(1);
        animation.animateText();
    }
}

App.init();
App.renderText();
