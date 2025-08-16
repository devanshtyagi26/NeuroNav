import Car from "./car.model.js";
import Road from "./road.model";
import NeuralNetwork from "./neuralNetwork.model.js";
import { getCanvasContext } from "@/JavaScript/renderer.js";
import { drawSVGOnCanvas } from "@/JavaScript/utils.js";
import { mainCarSVG, traffic1SVG } from "@/JavaScript/svgStrings.js";

const carCanvas = document.getElementById("myCanvas");
carCanvas.width = 200;
const carCtx = getCanvasContext(carCanvas);

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.93);

const N = 100;
const cars = generateCars(N);
let bestCar = cars[0];

// MongoDB brain storage helpers
async function fetchBestBrain() {
  try {
    const res = await fetch("/api/brain");
    if (!res.ok) return null;
    const data = await res.json();
    return data && data.bestBrain ? data.bestBrain : null;
  } catch (e) {
    console.error("Failed to fetch bestBrain from MongoDB:", e);
    return null;
  }
}

async function saveBestBrain(brain) {
  try {
    await fetch("/api/brain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bestBrain: brain }),
    });
    console.log("Best brain saved to MongoDB");
  } catch (e) {
    console.error("Failed to save bestBrain to MongoDB:", e);
  }
}

async function discardBestBrain() {
  try {
    await fetch("/api/brain", { method: "DELETE" });
  } catch (e) {
    console.error("Failed to discard bestBrain from MongoDB:", e);
  }
}

// Load bestBrain from MongoDB on startup
(async () => {
  const bestBrainObj = await fetchBestBrain();
  if (bestBrainObj) {
    for (let i = 0; i < cars.length; i++) {
      const brain = NeuralNetwork.fromJSON(bestBrainObj);
      if (brain) {
        cars[i].brain = brain;
        if (i != 0) {
          NeuralNetwork.mutate(cars[i].brain, 0.3);
        }
      }
    }
  }
})();

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

// Inject Save and Discard buttons
function injectButtons() {
  const controlsDiv = document.createElement("div");
  controlsDiv.style.position = "absolute";
  controlsDiv.style.top = "10px";
  controlsDiv.style.left = "10px";
  controlsDiv.style.zIndex = 1000;

  const saveBtn = document.createElement("button");
  saveBtn.textContent = "Save Brain";
  saveBtn.onclick = save;
  saveBtn.style.marginRight = "8px";

  const discardBtn = document.createElement("button");
  discardBtn.textContent = "Discard Brain";
  discardBtn.onclick = discard;

  controlsDiv.appendChild(saveBtn);
  controlsDiv.appendChild(discardBtn);
  document.body.appendChild(controlsDiv);
}

injectButtons();
animate();

export async function save() {
  // Ensure we send a plain object, not a class instance
  const brainObj =
    typeof bestCar.brain.toJSON === "function"
      ? bestCar.brain.toJSON()
      : bestCar.brain;
  await saveBestBrain(brainObj);
  console.log(bestCar.brain);
}

export async function discard() {
  await discardBestBrain();
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
