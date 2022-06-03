String.prototype.shuffle = function () {
    let string = this.split('');

    for (let i = 0; i < string.length; i++) {
        let j = Math.floor(Math.random() * i);
        let temp = string[i];
        string[i] = string[j];
        string[j] = temp;
    }
    return string.join('');
};

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
    constructor(pokedex, playerParty, chart) {
        this.playerParty = playerParty;
        this.pokedex = pokedex;
        this.chart = chart;
        const encounterButton = document.getElementById('encounter-btn');
        encounterButton.addEventListener(
            'click',
            this.encounterButtonHandler.bind(this)
        );
    }

    generateRandomPokemon() {
        const dexNum = Math.floor(Math.random() * 151);
        const pokemon = this.pokedex[dexNum];
        return pokemon;
    }

    render(wildPokemon) {
        console.log(wildPokemon);
        console.log(wildPokemon.frontSprite);
        const wildPokemonField = document.getElementById('wild-pokemon');
        this.wildPokemonImg = document.createElement('img');
        this.wildPokemonImg.src = wildPokemon.frontSprite;
        wildPokemonField.appendChild(this.wildPokemonImg);
    }

    encounterButtonHandler() {
        if (this.wildPokemonImg) {
            this.wildPokemonImg.remove();
        }
        const wildPokemon = this.generateRandomPokemon();
        this.render(wildPokemon);
        let battle = new Battle(wildPokemon, this.playerParty, this.chart);
    }
}

class PlayerSelection {
    constructor(pokedex, types, chart) {
        this.pokedex = pokedex;
        this.party = new Map();
        for (const type of types.keys()) {
            this.party.set(`${type}`, null);
        }
        this.formStartParty();
        let encounter = new Encounter(this.pokedex, this.party, chart);
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
                buttonImg.src = member.frontSprite;
                parentDiv.appendChild(button);
                button.appendChild(buttonImg);
            }
        }
    }
}

class Battle {
    constructor(wildPokemon, playerParty, chart) {
        this.playerParty = playerParty;
        this.wildPokemon = wildPokemon;
        this.typeChart = chart;
        this.opponentType = this.getWildPokemonType(wildPokemon);
        console.log(this.typeChart);
        console.log(this.opponentType);
        const oldParentDiv = document.getElementById('pokemon-selection');
        const newParentDiv = oldParentDiv.cloneNode(true);
        oldParentDiv.replaceWith(newParentDiv);
        newParentDiv.addEventListener('click', (event) => {
            if (
                event.target.tagName === 'BUTTON' ||
                event.target.tagName === 'IMG'
            ) {
                const id = event.target.closest('button').id;
                this.clickHandler(id);
            }
        });
    }

    getWildPokemonType(wildPokemon) {
        let typeArray = wildPokemon.type;
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

    battleResult(playerType, opponentType, chart) {
        const attacking = playerType;
        const defending = opponentType;
        const typeChart = chart;
        const multiplierFirstType = this.getMultiplier(
            attacking.type1,
            defending,
            typeChart
        );
        console.log(multiplierFirstType);
        const resultFirstType = this.getResult(multiplierFirstType);
        let resultSecondType;
        if (attacking.type2) {
            const multiplierSecondType = this.getMultiplier(
                attacking.type2,
                defending,
                typeChart
            );
            resultSecondType = this.getResult(multiplierSecondType);
            console.log(resultFirstType, resultSecondType);
        }
        if (
            resultFirstType === 'Super Effective' ||
            resultSecondType === 'Super Effective'
        ) {
            const result = 'WIN';
            return result;
        } else if (resultFirstType === 'Effective' && !resultSecondType) {
            const result = 'DRAW';
            return result;
        } else if (
            resultFirstType === 'Effective' &&
            resultSecondType === 'Effective'
        ) {
            const result = 'DRAW';
            return result;
        } else {
            const result = 'LOSE';
            return result;
        }
    }

    getResult(multiplier) {
        let result;
        switch (multiplier) {
            case 4:
                result = 'Super Effective';
                break;
            case 2:
                result = 'Super Effective';
                break;
            case 1:
                result = 'Effective';
                break;
            case 0.5:
                result = 'Not Very Effective';
                break;
            case 0.25:
                result = 'Not Very Effective';
                break;
            case 0:
                result = 'No Effect';
                break;
        }
        return result;
    }

    getMultiplier(attackingType, defending, chart) {
        if (defending.type2) {
            let multiplier1 =
                chart.get(attackingType).defending[`${defending.type1}`];
            let multiplier2 =
                chart.get(attackingType).defending[`${defending.type2}`];
            const multiplier = [multiplier1, multiplier2];
            for (let i = 0; i < multiplier.length; i++) {
                if (!multiplier[i]) {
                    multiplier[i] = 1;
                }
            }
            const result = multiplier[0] * multiplier[1];
            return result;
        } else {
            let result =
                chart.get(attackingType).defending[`${defending.type1}`];
            if (!result) {
                result = 1;
            }
            return result;
        }
    }

    renderPokeBall() {
        const parentDiv = document.getElementById('user-pokemon');
        parentDiv.innerHTML = '';
        const container = document.createElement('div');
        container.id = 'container';
        const pokeBallImg = document.createElement('img');
        pokeBallImg.src = 'assets/poke-ball.png';
        container.append(pokeBallImg);
        parentDiv.append(container);
        return pokeBallImg;
    }

    renderPlayerPokemon() {
        const parentDiv = document.getElementById('user-pokemon');
        parentDiv.innerHTML = '';
        const img = document.createElement('img');
        img.src = this.pokemonObj.backSprite;
        img.id = 'user-pokemon-img';
        parentDiv.appendChild(img);
        return img;
    }

    clickHandler(id) {
        const animatedBall = this.renderPokeBall();
        animatedBall.addEventListener('animationend', (event) => {
            let type = this.getPlayerType(this.playerParty, id);
            const animatedMon = this.renderPlayerPokemon();
            animatedMon.addEventListener('animationend', (event) => {
                const result = this.battleResult(
                    type,
                    this.opponentType,
                    this.typeChart
                );
                if (result === 'WIN') {
                    let response = prompt(
                        `You have defeated "${this.wildPokemon.name.shuffle()}." Unscramble the name to capture this Pokemon`
                    ).toLowerCase();
                    if (response === this.wildPokemon.name) {
                        console.log(
                            `You have captured ${this.wildPokemon.name}`
                        );
                    } else {
                        console.log('You did not name this Pokemon correctly.')
                    }
                }
            });
        });
    }
}

class Entry {
    constructor(id, name, frontSprite, backSprite, type) {
        this.id = id;
        this.name = name;
        this.frontSprite = frontSprite;
        this.backSprite = backSprite;
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
                data.sprites.back_default,
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
        const starters = new PlayerSelection(pokedex, types, chart);
        starters.renderButtons();
    }

    static renderText() {
        const animation = new AnimatedText(1);
        animation.animateText();
    }
}

App.init();
App.renderText();
