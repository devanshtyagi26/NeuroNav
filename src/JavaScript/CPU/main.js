import Car from "./car.model.js";
import Road from "./road.model";
import {
  getCanvasContext,
  setUseGPU,
  isWebGLAvailable,
} from "@/JavaScript/renderer.js";
import { drawSVGOnCanvas } from "@/JavaScript/utils.js";
import { mainCarSVG, traffic1SVG } from "@/JavaScript/svgStrings.js";

const carCanvas = document.getElementById("myCanvas");
carCanvas.width = 200;
const carCtx = getCanvasContext(carCanvas);

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.93);

const N = 100;
const cars = generateCars(N);
let bestCar = cars[0];

if (localStorage.getItem("bestBrain")) {
  for (let i = 0; i < cars.length; i++) {
    cars[i].brain = JSON.parse(localStorage.getItem("bestBrain"));
    if (i != 0) {
      NeuralNetwork.mutate(cars[i].brain, 0.3);
    }
  }
}

const traffic = [
  new Car(road.getLaneCenter(1), -100, 30, 50, "SLAVE", 2),
  new Car(road.getLaneCenter(2), -300, 30, 50, "SLAVE", 2),
  new Car(road.getLaneCenter(0), -300, 30, 50, "SLAVE", 2),
  new Car(road.getLaneCenter(2), -500, 30, 50, "SLAVE", 2),
  new Car(road.getLaneCenter(1), -500, 30, 50, "SLAVE", 2),
  new Car(road.getLaneCenter(0), -600, 30, 50, "SLAVE", 2),
  new Car(road.getLaneCenter(2), -700, 30, 50, "SLAVE", 2),
  new Car(road.getLaneCenter(1), -750, 30, 50, "SLAVE", 2),
  new Car(road.getLaneCenter(0), -850, 30, 50, "SLAVE", 2),
  new Car(road.getLaneCenter(2), -900, 30, 50, "SLAVE", 2),
  new Car(road.getLaneCenter(1), -1000, 30, 50, "SLAVE", 2),
];

const mainCar = drawSVGOnCanvas(mainCarSVG);
const trafficCar1 = drawSVGOnCanvas(traffic1SVG);

const carSVGs = [mainCar, trafficCar1];

animate();

export function save() {
  localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}

export function discard() {
  localStorage.removeItem("bestBrain");
}
function generateCars(N) {
  const cars = [];

  for (let i = 0; i < N; i++) {
    cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"));
  }
  return cars;
}
function animate() {
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, []);
  }

  for (let i = 0; i < cars.length; i++) {
    cars[i].update(road.borders, traffic);
  }

  bestCar = cars.find((c) => c.y == Math.min(...cars.map((c) => c.y)));

  carCanvas.height = window.innerHeight;
  //   networkCanvas.height = window.innerHeight;

  carCtx.save();
  carCtx.translate(0, -bestCar.y + carCanvas.height * 0.75);

  road.draw(carCtx);

  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(carCtx, carSVGs[1]);
  }

  carCtx.globalAlpha = 0.2;
  for (let i = 0; i < cars.length; i++) {
    cars[i].draw(carCtx, carSVGs[0]);
  }
  carCtx.globalAlpha = 1;
  bestCar.draw(carCtx, carSVGs[0], true);

  carCtx.restore();
  requestAnimationFrame(animate);
}
