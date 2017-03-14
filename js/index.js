// Setup API to control the initial page functions
const setup = {
	go: function go() {
		this.setDate();
		this.setupSimon();
		this.setListeners();
	},

	setListeners: function setListeners() {
		const green = document.getElementById('green');
		const red = document.getElementById('red');
		const yellow = document.getElementById('yellow');
		const blue = document.getElementById('blue');
		const startBtn = document.getElementById('start-game');
		const strictBtn = document.getElementById('strict-mode');
		const resetBtn = document.getElementsByClassName('reset-button')[0];

		green.addEventListener('click', () => {
			simon.checkInput(1);
			ui.playAudio(1);
		});
		red.addEventListener('click', () => {
			simon.checkInput(2);
			ui.playAudio(2);
		});
		yellow.addEventListener('click', () => {
			simon.checkInput(3);
			ui.playAudio(3);
		});
		blue.addEventListener('click', () => {
			simon.checkInput(4);
			ui.playAudio(4);
		});
		startBtn.addEventListener('click', () => simon.go());
		strictBtn.addEventListener('click', () => ui.toggleStrict());
		resetBtn.addEventListener('click', () => simon.reset());
	},
	
	// Setup the Simon object, allowing for custom setup if required
	setupSimon: function setupSimon(count = 1, pos = 0, seq = []) {
		simon.setCount(count);
		simon.setPosition(pos);
		simon.setSequence(seq);
		ui.updateCount(count);
	},

	setDate: function setDate() {
		document.getElementsByClassName('currentYear')[0].textContent = new Date().getFullYear();
	}
};

// UI API to control changes to the UI
const ui = {
	greenSound: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3'),
	redSound: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3'),
	yellowSound: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3'),
	blueSound: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3'),

	updateCount: function updateCount(count) {
		document.getElementsByClassName('counter')[0].textContent = count < 10 ? '0' + count : count;
	},

	notify: function notify(msg) {
		const msgBar = document.getElementsByClassName('notifications')[0];
		const h2 = document.createElement('h2');
		
		h2.textContent = msg;

		while (msgBar.children.length) {
			msgBar.removeChild(msgBar.children[0]);
		}

		msgBar.appendChild(h2);
		
		msgBar.style.display = "block";
		setTimeout(() => msgBar.style.display = "none", 2000);
	},

	// Disable the start button while the game is running
	toggleStart: function toggleStart(active) {
		const btn = document.getElementsByClassName('start-game')[0];

		btn.disabled = active;
	},

	// Toggle between strict and normal game modes
	toggleStrict: function toggleStrict() {
		const checked = document.getElementById('strict-mode').checked;

		simon.setStrict(checked);
	},

	// Disable the colour buttons while Simon is rcreating the sequence
	toggleButtons: function toggleButtons(disable) {
		const green = document.getElementsByClassName('simon-green')[0];
		const red = document.getElementsByClassName('simon-red')[0];
		const yellow = document.getElementsByClassName('simon-yellow')[0];
		const blue = document.getElementsByClassName('simon-blue')[0];

		green.disabled = disable;
		red.disabled = disable;
		yellow.disabled = disable;
		blue.disabled = disable;
	},

	playAudio: function playAudio(btn) {
		switch (btn) {
			case 1:
				this.greenSound.play();
				break;
			case 2:
				this.redSound.play();
				break;
			case 3:
				this.yellowSound.play();
				break;
			case 4:
				this.blueSound.play();
				break;
			default:
				console.error('Invalid audio request');
		}
	}
};

// Simon API to control the game
const simon = {
	count: 1,
	position: 0,
	sequence: [],
	isStrict: false,
	retry: true,

	go: function go(num = 0) {
		// Allows the game to kick off at a level above 1
		if (num) {
			this.count = num;
			ui.toggleStart(true);
			this.generateSequence(num);
			ui.toggleButtons(true);
			this.highlightSequence();
		}
		else {
			ui.toggleStart(true);
			this.generateSequence(this.count);
			ui.toggleButtons(true);
			this.highlightSequence();
		}
	},

	setCount: function setCount(num) {
		this.count = num;
	},

	setPosition: function setPosition(pos) {
		this.position = pos;
	},

	getSequence: function getSequence() {
		return this.sequence;
	},

	setSequence: function setSequence(arr) {
		this.sequence = arr;
	},

	setStrict: function setStrict(strict) {
		this.isStrict = strict;
	},

	// Add a value to the sequence
	addToSequence: function addToSequence(num) {
		this.sequence = [...this.sequence, num];
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
			if (this.position < this.count-1) {
				this.position++;
			}
			else {
				ui.notify('Correct!');

				setTimeout(() => {
					ui.notify('Next level coming up...');
					setTimeout(() => this.nextLevel(), 2500);
				}, 2000);
			}
		}
		else {
			ui.notify('Incorrect');

			if (!this.isStrict && this.retry) {
				setTimeout(() => {
					ui.notify("Let's give that another shot...");
					this.retry = false;
					ui.toggleButtons(true);
					setTimeout(() => this.highlightSequence(), 2500);
				}, 2000);
			}
			else {
				ui.notify('Game Over');
				this.reset();
			}
		}
	},

	// Reset the game
	reset: function reset() {
		this.sequence = [];
		this.count = 1;
		this.position = 0;
		this.retry = true;
		ui.updateCount(this.count);
		ui.toggleStart(false);
	},

	// Highlights the current sequence in turn - references simon properties with the 'simon' prefix due to recursion
	highlightSequence: function highlightSequence(i = 0) {
		if (i < simon.getSequence().length) {
			const current = simon.getSequence()[i];
			const btn = document.querySelectorAll('[data-value="' + current + '"]')[0];

			btn.classList.add('highlight');

			ui.playAudio(current);

			setTimeout(() => {
				btn.classList.remove('highlight');

				setTimeout(() => highlightSequence(i + 1), 200);
			}, 700);
		}

		if (i === simon.getSequence().length) {
			ui.toggleButtons(false);
		}
	},

	// Go to the next level
	nextLevel: function nextLevel() {
		this.count++;
		this.position = 0;
		//this.sequence = [];
		ui.updateCount(this.count);
		
		if (!this.isStrict) {
			this.retry = true;
		}

		//this.go(1);
		/*
		ui.toggleStart(true);
		this.generateSequence(this.count);
		ui.toggleButtons(true);
		this.highlightSequence();

		*/


		this.addToSequence(Math.floor(Math.random() * 4) + 1);
		ui.toggleButtons(true);
		this.highlightSequence();
	}
};

//Set up the game
(() => {
	setup.go();
})();	