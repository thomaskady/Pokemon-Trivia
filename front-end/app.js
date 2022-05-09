const nextTextBtn = document.getElementById('next');


class AnimateText {

    constructor(elementId) {
        this.id = elementId;
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
        }, 30);
    }

    completeAnimation() {
        clearInterval(this.timer);
        this.timer = null;
        this.text.textContent = this.originalText.textContent;
    }

    animateText() {
        this.originalText = document.getElementById(`${this.id}`);
        this.text = this.originalText;
        const textContent = this.originalText.textContent.split('');
    
        this.text.textContent = '';
    
        this.hiddenLetters = textContent.map((letter) => {
            const span = document.createElement('span');
            span.textContent = `${letter}`;
            this.text.appendChild(span);
            return span;
        });
    
        this.text.classList.remove('invisible');
    
        this.becomeVisible(this.hiddenLetters);
    };
}

let animation = new AnimateText('text__1'); 

console.log(animation)

animation.animateText();

nextTextBtn.addEventListener('click', animation.completeAnimation.bind(animation), {once: true});