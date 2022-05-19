String.prototype.shuffle = function () {
    let string = this.split('');

    for (let i = 0; i < string.length; i++) {
        let j = Math.floor(Math.random() * i);
        let temp = string[i];
        string[i] = string[j];
        string[j] = temp;
    }
    console.log(string.join(''));
    return string.join('');
};

let zubat = 'zubat';
zubat.shuffle();

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
        if (parseInt(this.id) === 5) {
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
    constructor(pokedex, playerParty) {
        this.playerParty = playerParty;
        this.pokedex = pokedex;
        const encounterButton = document.getElementById('encounter-btn');
        encounterButton.addEventListener(
            'click',
            this.encounterButtonHandler.bind(this)
        );
    }

    getWildPokemonType() {
        let type_1 = this.pokemon.type[0].type.name;
        let type_2;
        if (this.pokemon.type[1]) {
            type_2 = this.pokemon.type[1].type.name;
        }
        let type;
        if (type_1 && type_2) {
            type = `${type_1}/${type_2}`;
        } else {
            type = type_1;
        }
        this.type = type;
        return this.type;
    }

    generateRandomPokemon() {
        const dexNum = Math.floor(Math.random() * 151);
        const pokemon = this.pokedex[dexNum];
        return pokemon;
    }

    render() {
        console.log(this.pokemon);
        console.log(this.pokemon.imgURL);
        const wildPokemonField = document.getElementById('wild-pokemon');
        this.wildPokemonImg = document.createElement('img');
        this.wildPokemonImg.src = this.pokemon.imgURL;
        wildPokemonField.appendChild(this.wildPokemonImg);
    }

    encounterButtonHandler() {
        if (this.wildPokemonImg) {
            this.wildPokemonImg.remove();
        }
        this.pokemon = this.generateRandomPokemon();
        this.render();
        this.getWildPokemonType();
        let battle = new Battle(this, this.playerParty);
    }
}

class PlayerSelection {
    constructor(pokedex, types) {
        this.pokedex = pokedex;
        this.party = new Map();
        for (const type of types.keys()) {
            this.party.set(`${type}`, null);
        }
        this.formStartParty();
        let encounter = new Encounter(this.pokedex, this.party);
    }

    formStartParty() {
        const BULBASAUR = this.pokedex[0];
        const CHARMANDER = this.pokedex[3];
        const SQUIRTLE = this.pokedex[6];
        this.party.set('grass', BULBASAUR);
        this.party.set('fire', CHARMANDER);
        this.party.set('water', SQUIRTLE);
        console.log(this.party);
    }

    renderButtons() {
        const parentDiv = document.getElementById('pokemon-selection');
        parentDiv.innerHTML = '';
        for (const [type, member] of this.party.entries()) {
            if (member) {
                let button = document.createElement('button');
                button.id = type;
                button.textContent = member.name.toUpperCase();
                let buttonImg = document.createElement('img');
                buttonImg.src = member.imgURL;
                parentDiv.appendChild(button);
                button.appendChild(buttonImg);
            }
        }
    }
}

class Battle {
    constructor(encounter, playerParty) {
        this.playerParty = playerParty;
        this.opponentType = encounter.type;
        this.playerType;
        console.log(this.opponentType);
        this.buttons = this.getButtonNodeList();
        for (const button of this.buttons) {
            button.addEventListener(
                'click',
                this.clickHandler.bind(this, button)
            );
        }
    }

    getButtonNodeList() {
        const parentDiv = document.getElementById('pokemon-selection');
        const buttons = parentDiv.querySelectorAll('button');
        return buttons;
    }

    getButtonId(button) {
        let id = button.id;
        return id;
    }

    getPlayerType(pokemon, id) {
        this.pokemonObj = pokemon.get(id);
        let typeArray = this.pokemonObj.type;
        let type;
        if (typeArray.length === 1) {
            type = { type1: typeArray[0].type.name, type2: null };
        } else if (typeArray.length === 2) {
            type = {
                type1: typeArray[0].type.name,
                type2: typeArray[1].type.name,
            };
        }
        console.log(type);
        return type;
    }

    renderPlayerPokemon() {
        const parentDiv = document.getElementById('user-pokemon');
        parentDiv.innerHTML = '';
        const img = document.createElement('img');
        img.src = this.pokemonObj.imgURL;
        parentDiv.appendChild(img);
    }

    clickHandler(button) {
        let id = this.getButtonId(button);
        let type = this.getPlayerType(this.playerParty, id);
        this.renderPlayerPokemon();
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

class TypeChart {
    static create(_types) {
        let chart = new Map();
        let types = _types;
        for (const [key, value] of types.entries()) {
            let doubleDamage = value.double_damage_to;
            let halfDamage = value.half_damage_to;
            let noDamage = value.no_damage_to;
            doubleDamage = TypeChart.setDamageInfo(doubleDamage, 2.0);
            halfDamage = TypeChart.setDamageInfo(halfDamage, 0.5);
            noDamage = TypeChart.setDamageInfo(noDamage, 0);
            const damage = { ...doubleDamage, ...halfDamage, ...noDamage };
            chart.set(key, { defending: damage });
        }
        return chart;
    }

    static setDamageInfo(damage, multiplier) {
        if (damage) {
            const defending = {};
            for (const obj of damage) {
                const name = obj.name;
                defending[name] = multiplier;
            }
            return defending;
        }
    }
}

class Pokedex {
    static async fetchTypes() {
        Pokedex.types = new Map();
        const data = await P.getTypesList();
        for (let i = 0; i <= 17; i++) {
            const res = await fetch(data.results[i].url);
            const typeInfo = await res.json();
            Pokedex.types.set(data.results[i].name, typeInfo.damage_relations);
        }
        return Pokedex.types;
    }

    static async createEntries() {
        Pokedex.entries = [];
        for (let i = 1; i <= 151; i++) {
            const data = await P.getPokemonByName(i);
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
}

class App {
    static async init() {
        const pokedex = await Pokedex.createEntries();
        const types = await Pokedex.fetchTypes();
        const chart = TypeChart.create(types);
        console.log(types);
        console.log(chart.get('water').defending.grass);
        const starters = new PlayerSelection(pokedex, types);
        starters.renderButtons();
    }

    static renderText() {
        const animation = new AnimatedText(1);
        animation.animateText();
    }
}

App.init();
App.renderText();
