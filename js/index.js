const setup = {
	setListeners: function setListeners() {
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
	},
	
	// Setup the Simon object, allowing for custom setup if required
	setupSimon: function setupSimon(count = 1, pos = 0, seq = []) {
		simon.setCount(count);
		simon.setPosition(pos);
		simon.setSequence(seq);
	},

	setupUI: function setupUI() {
		const count = simon.getCount();

		document.getElementsByClassName('counter')[0].textContent = count < 10 ? '0' + count : count;
	}
};

const simon = {
	count: 1,
	position: 0,
	sequence: [],

	// Just for production purposes
	go: function go(num) {
		// Production purposes
		if (num) {
			this.count = num;
			this.generateSequence(num);
			this.logSequence();
			this.highlightSequence();
		}
		else {
			
		}
	},

	getCount: function getCount() {
		return this.count;
	},

	setCount: function setCount(num) {
		this.count = num;
	},

	getPosition: function getPosition() {
		return this.position;
	},

	setPosition: function setPosition(pos) {
		this.position = pos;
	},

	// Get the sequence
	getSequence: function getSequence() {
		return this.sequence;
	},

	setSequence: function setSequence(arr) {
		this.sequence = arr;
	},

	// Add a value to the current sequence
	addToSequence: function addToSequence(num) {
		this.sequence = [...this.sequence, num];
	},

	// Possibly just for production purposes - print out the colour sequence
	logSequence: function logSequence() {
		for (let i of this.sequence) {
			console.log(getColor(i));
		}
	},

	// Generate a new sequence
	generateSequence: function generateSequence(moves) {
		do {
			this.addToSequence(Math.floor(Math.random() * 4) + 1);

			moves--;
		}
		while (moves > 0);
	},

	// Check the user's button click against the sequence
	checkInput: function checkInput(num) {
		if (this.sequence[this.position] === num) {
			console.log('Correct');
			
			if (this.position < this.count-1) {
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
		this.sequence = [];
		this.count = 1;
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
		this.count++;
		this.sequence = [];
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
	setup.setListeners();
	setup.setupSimon();
	setup.setupUI();
})();	