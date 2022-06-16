const carCanvas = document.getElementById('carCanvas');
carCanvas.width = 0.3 * innerWidth;
const networkCanvas = document.getElementById('networkCanvas');
networkCanvas.width = 0.5 * innerWidth;

const carCtx = carCanvas.getContext('2d');
const networkCtx = networkCanvas.getContext('2d');

const laneCount = 5;
const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9, laneCount);
var mouseDown = false;
var drawRays = true;

var death = 500;
const N = 500;
var population = N;
const cars = generateCars(N);
let bestCar = cars[0];

if (localStorage.getItem('bestBrain')) {
	for (let i = 0; i < cars.length; i++) {
		cars[i].brain = JSON.parse(localStorage.getItem('bestBrain'));
		if (i != 0) {
			NeuralNetwork.mutate(cars[i].brain, 0.2);
		}
	}
}

var traffic = [];
setInterval(() => {
	traffic.push(new Car(road.getLaneCenter(Math.floor(Math.random() * laneCount)), Math.floor(Math.random() * infinity) - 100, 30, 50, 'DUMMY', 2, getRandomColor()));
}, 100);

animate();

function save() {
	localStorage.setItem('bestBrain', JSON.stringify(bestCar.brain));
	location.reload();
}

function discard() {
	localStorage.removeItem('bestBrain');
	location.reload();
}
cars.push(new Car(road.getLaneCenter(2), 100, 30, 50, 'KEY', 15, 'red'));
function generateCars(N) {
	const cars = [];
	for (let i = 1; i <= N; i++) {
		cars.push(new Car(road.getLaneCenter(2), 100, 30, 50, 'AI'));
	}
	return cars;
}

function animate(time) {
	if (death == 0 || population == 0) {
		save();
	} else {
		death--;
	}
	carCanvas.width = 0.3 * innerWidth;
	networkCanvas.width = 0.5 * innerWidth;
	if (traffic.length > 100) {
		traffic.shift();
		console.log(traffic.length);
	}
	for (let i = 0; i < traffic.length; i++) {
		traffic[i].update(road.borders, []);
	}
	for (let i = 0; i < cars.length; i++) {
		cars[i].update(road.borders, traffic);
	}
	bestCar = cars.find(c => c.y == Math.min(...cars.map(c => c.y)));

	carCanvas.height = window.innerHeight;
	networkCanvas.height = window.innerHeight;

	carCtx.save();
	carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7);

	road.draw(carCtx);
	for (let i = 0; i < traffic.length; i++) {
		traffic[i].draw(carCtx);
	}
	carCtx.globalAlpha = 0.2;
	for (let i = 0; i < cars.length; i++) {
		cars[i].draw(carCtx);
	}
	carCtx.globalAlpha = 1;
	bestCar.draw(carCtx, drawRays);

	carCtx.restore();

	networkCtx.lineDashOffset = -time / 50;
	Visualizer.drawNetwork(networkCtx, bestCar.brain);
	requestAnimationFrame(animate);
}

function toggleRays() {
	if (drawRays) {
		drawRays = false;
	} else {
		drawRays = true;
	}
}
function multiplyAndMutate(brain) {
	for (let i = 0; i < cars.length; i++) {
		cars[i].brain = JSON.parse(localStorage.getItem('bestBrain'));
		if (i != 0) {
			NeuralNetwork.mutate(cars[i].brain, 0.1);
		}
	}
}

function getRandomLane(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return road.getLaneCenter(Math.floor(Math.random() * (max - min + 1) + min));
}

function copyBrain() {
	navigator.clipboard.writeText(JSON.stringify(bestCar.brain));
}
function pasteBrain() {
	multiplyAndMutate(navigator.clipboard.readText());
	save();
}

document.addEventListener('mousedown', e => {
	if (!mouseDown) {
		traffic.push(new Car(e.x - 100, bestCar.y - 500, 30, 50, 'DUMMY', 2, getRandomColor()));
		mouseDown = false;
	}
});

setInterval(() => {
	traffic.push(new Car(getRandomLane(0, laneCount), bestCar.y - 500, 30, 50, 'DUMMY', 2, getRandomColor()));
}, 2000);
