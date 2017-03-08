const simon = {
	moves: 1,
	position: 0,
	currentSequence: [],

	// Just for production purposes
	go: function(num) {
		this.moves = num;
		this.generateSequence(num);
		this.logSequence();
		//this.highlightSequence();
		this.highlightSequence();
	},

	// Get the sequence
	getSequence: function getSequence() {
		return this.currentSequence;
	},

	// Add a value to the current sequence
	addToCurrentSequence: function addToSequence(num) {
		this.currentSequence = [...this.currentSequence, num];
	},

	// Possibly just for production purposes - print out the colour sequence
	logSequence: function logSequence() {
		for (let i of this.currentSequence) {
			console.log(getColor(i));
		}
	},

	// Generate a new sequence
	generateSequence: function generateSequence(moves) {
		do {
			this.addToCurrentSequence(Math.floor(Math.random() * 4) + 1);

			moves--;
		}
		while (moves > 0);
	},

	// Check the user's button click against the sequence
	checkInput: function checkInput(num) {
		if (this.currentSequence[this.position] === num) {
			console.log('Correct');
			
			if (this.position < this.moves-1) {
				this.position++;
			}
			else {
				console.log('You win!');
				this.reset();
				console.log('Generating a new sequence');
				this.go(4);
			}
		}
		else {
			console.log('Incorrect');
			this.reset();
			console.log('Generating a new sequence');
			this.go(4);
		}
	},

	// Reset the game
	reset: function reset() {
		this.currentSequence = [];
		this.moves = 1;
		this.position = 0;
	},

	// Highlights the current sequence in turn
	highlightSequence: function highlightSequence(i = 0) {
		if (i < simon.getSequence().length) {
			let btn = document.querySelectorAll('[data-value="' + simon.getSequence()[i] + '"]')[0];
			btn.classList.add('highlight');

			setTimeout(() => {
				btn.classList.remove('highlight');

				setTimeout(() => highlightSequence(i + 1), 200);
			}, 700);
		}
	},

	// Go to the next level
	nextLevel: function nextLevel() {
		this.moves++;
		this.currentSequence = [];
		//this.go(this.moves);
	}
};

const getColor = function getColor(num) {
	switch (num) {
		case 1:
			return 'green';
		case 2:
			return 'red';
		case 3:
			return 'yellow';
		case 4:
			return 'blue';
		default:
			console.log('Invalid colour');
	}
};

//Set up the game
(() => {
	const green = document.getElementById('green');
	const red = document.getElementById('red');
	const yellow = document.getElementById('yellow');
	const blue = document.getElementById('blue');

	green.addEventListener('click', () => {
		console.log('clicked green');
		simon.checkInput(1);
	});

	red.addEventListener('click', () => {
		console.log('clicked red');
		simon.checkInput(2);
	});

	yellow.addEventListener('click', () => {
		console.log('clicked yellow');
		simon.checkInput(3);
	});

	blue.addEventListener('click', () => {
		console.log('clicked blue');
		simon.checkInput(4);
	});
})();	