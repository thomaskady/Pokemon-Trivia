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
        console.log(nextText);
        nextText.animateText();
    }

    animateText() {
        this.hiddenLetters = this.hidden.map((letter) => {
            const span = document.createElement('span');
            span.textContent = `${letter}`;
            this.text.appendChild(span);
            return span;
        });

        console.log(this.hiddenLetters);

        this.text.classList.remove('invisible');
        this.text.classList.remove('hidden');

        this.becomeVisible(this.hiddenLetters);
    }

    nextTextBtnHandler() {
        if (parseInt(this.id) === 4) {
            this.completeAnimation();
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

class CommonPokemon {
    constructor(dexNum, imgURL, species, type, stage) {
        this.dexNum = dexNum;
        this.imgURL = imgURL;
        this.species = species;
        this.type = type;
        this.stage = stage;
    }
}

class Encounter {

    generatePokemon() {
        this.dexNum = Math.floor(Math.random() * 151);
        const pokemon = new CommonPokemon (this.dexNum, this.dexNum);
    }

    render() {
        const wildPokemonField = document.getElementById('wild-pokemon');
        const wildPokemonImg = document.createElement('img');
        this.generatePokemon();
        wildPokemonImg.src = `assets/${this.dexNum}.png`
        wildPokemonField.appendChild(wildPokemonImg);
    }
}

let animation = new AnimatedText(1);

console.log(animation);

animation.animateText();

let encounter = new Encounter();

encounter.render();
