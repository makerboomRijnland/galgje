const WORDS = ["test", "canvas", "toets", "onvoldoende"];

const errorShapes = [
    {
        type: "triangle",
        x1: 50,
        y1: 500,
        x2: 125,
        y2: 475,
        x3: 200,
        y3: 500,
    },
    {
        type: "line",
        x1: 125,
        y1: 475,
        x2: 125,
        y2: 50,
    },
    {
        type: "line",
        x1: 125,
        y1: 50,
        x2: 300,
        y2: 50,
    },
    {
        type: "line",
        x1: 300,
        y1: 50,
        x2: 300,
        y2: 100,
    },
    {
        type: "circle",
        x1: 335,
        y1: 135,
        x2: 300,
        y2: 135,
        r: 35,
    },
    {
        type: "line",
        x1: 300,
        y1: 170,
        x2: 300,
        y2: 320,
    },
    {
        type: "line",
        x1: 300,
        y1: 320,
        x2: 250,
        y2: 380,
    },
    {
        type: "line",
        x1: 300,
        y1: 320,
        x2: 350,
        y2: 380,
    },
    {
        type: "line",
        x1: 300,
        y1: 200,
        x2: 265,
        y2: 250,
    },
    {
        type: "line",
        x1: 300,
        y1: 200,
        x2: 335,
        y2: 250,
    },
];

class Hangman {
    /**
     * @property {HTMLCanvasElement} canvas
     */
    canvas;

    /**
     * @property {CanvasRenderingContext2D} context
     */
    context;

    /**
     * @property {string} word
     */
    word;

    /**
     * @property {string[]} letters
     */
    letters;

    /**
     * @property {string} guessedLetters
     */
    guessedLetters;

    errorX;
    errors;

    constructor(id) {
        this.canvas = document.getElementById(id);
        this.context = this.canvas.getContext("2d");
        this.reset();
    }

    /**
     *
     * @param {string} key
     */
    handleKey(key) {
        if (!/^[a-zA-Z]$/.test(key)) {
            return;
        }

        if (this.isGameOver() || this.isWinner()) {
            return;
        }

        key = key.toUpperCase();
        if(this.guessedLetters.indexOf(key) >= 0) {
            return;
        }

        this.letters.push(key);

        let wordIndex = this.word.indexOf(key);

        if (wordIndex < 0) {
            this.addWrongLetter(key);
            
        } else {

            while (wordIndex !== -1) {
                this.addCorrectLetter(wordIndex);
                wordIndex = this.word.indexOf(key, wordIndex + 1);
            }
        }
    }

    /**
     * OPDRACHT 1
     * Zorg ervoor dat this.word een random woord krijgt uit WORDS
     */
    reset() {
        let wordIndex = Math.floor(Math.random() * WORDS.length);
        this.word = WORDS[wordIndex];
        

        this.word = this.word.toUpperCase()
        this.errorX = 500;
        this.errors = 0;
        this.letters = [];
        this.guessedLetters = "";
        this.draw();
    }

    draw() {
        // Clear background
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawLines();
    }

    drawLines() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const lineWidth = centerX / this.word.length;

        for (let index = 1; index <= this.word.length; index++) {
            const lineX = centerX - 200 + lineWidth * (index - 1);

            this.context.beginPath();
            this.context.moveTo(lineX, centerY + 250);
            this.context.lineTo(lineX + 10, centerY + 250);
            this.context.stroke();
        }
    }

    addCorrectLetter(index) {
        const letter = this.word[index];
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const lineWidth = centerX / this.word.length;
        const lineX = centerX - 200 + lineWidth * index;

        this.guessedLetters += letter;
        this.context.font = `26px Open Sans, sans-serif`;
        this.context.fillText(letter, lineX, centerY + 240);

        if (this.isWinner()) {
            const centerX = this.canvas.width / 2;
            const centerY = this.canvas.height / 2;
            this.context.font = "50px sans-serif";
            this.context.fillText(
                "You have won",
                centerX - 100,
                centerY - 25,
                200
            );
        }
    }

    addWrongLetter(letter) {
        this.errors++;

        this.context.font = "26px Open Sans, sans-serif";
        this.context.fillText(letter, this.errorX, 200);
        this.errorX += 35;

        this.drawHangmanPart();

        if (this.isGameOver()) {
            const centerX = this.canvas.width / 2;
            const centerY = this.canvas.height / 2;
            this.context.font = "50px sans-serif";
            this.context.fillText(
                "Game Over",
                centerX - 100,
                centerY - 25,
                200
            );
        }
    }

    /**
     * OPDRACHT 2
     * Maak van onderstaande switch, meerdere if-statements.
     */
    drawHangmanPart() {
        const errorShape = errorShapes[this.errors - 1];

        if(errorShape.type == 'triangle') {
            this.context.moveTo(errorShape.x1, errorShape.y1);
            this.context.lineTo(errorShape.x2, errorShape.y2);
            this.context.lineTo(errorShape.x3, errorShape.y3);
            this.context.closePath();
        }

        if(errorShape.type == 'line') {
            this.context.moveTo(errorShape.x1, errorShape.y1);
            this.context.lineTo(errorShape.x2, errorShape.y2);
        }

        if(errorShape.type == 'circle') {
            this.context.moveTo(errorShape.x1, errorShape.y1);
            this.context.arc(
                errorShape.x2,
                errorShape.y2,
                errorShape.r,
                0,
                Math.PI * 2,
                true
            );
        }

        this.context.stroke();
    }

    /**
     * OPDRACHT 3
     * Geef true terug als het this.errors gelijk is aan 10
     */
    isGameOver() {
        return this.errors == 10;
        // Ook goed is:
        if(this.errors == 10) {
            return true;
        }
    }

    /**
     * OPDRACHT 4
     * Geef true terug als het aantal letters in this.guessedLetters overeenkomt met het aantal letters in this.word
     */
    isWinner() {
        return this.guessedLetters.length == this.word.length;
        // Ook goed is:
        if(this.guessedLetters.length == this.word.length) {
            return true;
        }
    }
}

function setup() {
    const hangman = new Hangman("hangman-canvas");

    window.addEventListener("keydown", (event) => {
        if(event.key == "Escape") {
            hangman.reset();
        }
        hangman.handleKey(event.key);
    });
}

window.addEventListener("load", setup);

/**
 * OPDRACHT 5
 * maak een invoerveld en een knop in de html, en javascript code 
 * waarmee een woord kan worden toegevoegd aan de array WORDS
 */
