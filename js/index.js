// Setup API to control the initial page functions
const setup = {
	go: function go() {
		this.setDate();
		this.setupSimon();
		this.setupUI();
		this.setListeners();
	},

	setListeners: function setListeners() {
		const green = document.getElementById('green');
		const red = document.getElementById('red');
		const yellow = document.getElementById('yellow');
		const blue = document.getElementById('blue');
		const startBtn = document.getElementById('start-game');

		green.addEventListener('click', () => simon.checkInput(1));
		red.addEventListener('click', () => simon.checkInput(2));
		yellow.addEventListener('click', () => simon.checkInput(3));
		blue.addEventListener('click', () => simon.checkInput(4));
		startBtn.addEventListener('click', () => simon.go());
	},
	
	// Setup the Simon object, allowing for custom setup if required
	setupSimon: function setupSimon(count = 1, pos = 0, seq = []) {
		simon.setCount(count);
		simon.setPosition(pos);
		simon.setSequence(seq);
	},

	setupUI: function setupUI() {
		// Setup the count
		ui.updateCount(simon.getCount());
	},

	setDate: function setDate() {
		document.getElementsByClassName('currentYear')[0].textContent = new Date().getFullYear();
	}
};

// UI API to control changes to the UI
const ui = {
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

	toggleStart: function toggleStart(active) {
		const btn = document.getElementsByClassName('start-game')[0];

		btn.disabled = active;
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
		// Production purposes
		if (num) {
			this.count = num;
			this.generateSequence(num);
			this.logSequence();
			this.highlightSequence();
		}
		else {
			ui.toggleStart(true);
			this.generateSequence(this.count);
			this.logSequence();
			this.highlightSequence();
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
				this.retry = false;
				this.highlightSequence();
			}
			else {
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
		this.position = 0;
		this.sequence = [];
		ui.updateCount(this.count);
		
		if (!this.isStrict) {
			this.retry = true;
		}

		this.go(this.count);
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
	setup.go();
})();	