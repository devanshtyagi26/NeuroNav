import Controls from "./controls.model";
import NeuralNetwork from "./neuralNetwork.model";
import Sensor from "./sensor.model";
import { polyIntersect } from "../utils";

class Car {
  constructor(x, y, width, height, role, maxSpeed = 3) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.speed = 0;
    this.acceleration = 0.2;
    this.maxSpeed = maxSpeed;
    this.friction = 0.05;
    this.angle = 0;
    this.damaged = false;

    this.useBrain = role == "AI";

    if (role != "SLAVE") {
      this.sensor = new Sensor(this);
      this.brain = new NeuralNetwork([this.sensor.rayCount, 6, 4]);
    }

    this.controls = new Controls(role);
  }
  update(roadBorders, traffic) {
    if (!this.damaged) {
      this.#move();
      this.polygon = this.#createPolygon();
      this.damaged = this.#accessDamage(roadBorders, traffic);
    }

    if (this.sensor) {
      this.sensor.update(roadBorders, traffic);
      const offsets = this.sensor.readings.map((s) =>
        s == null ? 0 : 1 - s.offset
      );

      const outputs = NeuralNetwork.feedForward(offsets, this.brain);

      if (this.useBrain) {
        this.controls.forward = outputs[0];
        this.controls.left = outputs[1];
        this.controls.right = outputs[2];
        this.controls.reverse = outputs[3];
      }
    }
  }

  #accessDamage(roadBorders, traffic) {
    for (let i = 0; i < traffic.length; i++) {
      if (polyIntersect(this.polygon, traffic[i].polygon)) {
        return true;
      }
    }
    for (let i = 0; i < roadBorders.length; i++) {
      if (polyIntersect(this.polygon, roadBorders[i])) {
        return true;
      }
    }
    return false;
  }

  #createPolygon() {
    const points = [];

    const rad = Math.hypot(this.width, this.height) / 2;
    const alpha = Math.atan2(this.width, this.height);

    points.push({
      x: this.x - Math.sin(this.angle - alpha) * rad,
      y: this.y - Math.cos(this.angle - alpha) * rad,
    });
    points.push({
      x: this.x - Math.sin(this.angle + alpha) * rad,
      y: this.y - Math.cos(this.angle + alpha) * rad,
    });
    points.push({
      x: this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
      y: this.y - Math.cos(Math.PI + this.angle - alpha) * rad,
    });
    points.push({
      x: this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
      y: this.y - Math.cos(Math.PI + this.angle + alpha) * rad,
    });

    return points;
  }

  #move() {
    if (this.controls.forward) {
      this.speed += this.acceleration;
    }
    if (this.controls.reverse) {
      this.speed -= this.acceleration;
    }

    if (this.speed > this.maxSpeed) {
      this.speed = this.maxSpeed;
    }
    if (this.speed < -this.maxSpeed / 2) {
      this.speed = -this.maxSpeed / 2;
    }
    if (this.speed > 0) {
      this.speed -= this.friction;
    }
    if (this.speed < 0) {
      this.speed += this.friction;
    }
    if (Math.abs(this.speed) < this.friction) {
      this.speed = 0;
    }

    if (this.speed != 0) {
      const flip = this.speed > 0 ? 1 : -1;

      if (this.controls.left) {
        this.angle += 0.03 * flip;
      }
      if (this.controls.right) {
        this.angle -= 0.03 * flip;
      }
    }

    this.x -= Math.sin(this.angle) * this.speed;
    this.y -= Math.cos(this.angle) * this.speed;
  }

  draw(ctx, svgImage, drawSensor) {
    if (!this.polygon) return;

    ctx.save();

    // Fill color based on damaged state
    ctx.fillStyle = this.damaged ? "red" : "none";

    // Draw the rectangle (polygon)
    ctx.beginPath();
    ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
    for (let i = 1; i < this.polygon.length; i++) {
      ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
    }
    ctx.closePath();

    if (this.damaged) {
      ctx.fill();
    }

    // Draw the SVG aligned & rotated with the rectangle
    if (svgImage.complete) {
      // Calculate center of polygon
      const centerX = (this.polygon[0].x + this.polygon[2].x) / 2;
      const centerY = (this.polygon[0].y + this.polygon[2].y) / 2;

      // Move origin to car center and rotate
      ctx.translate(0, -1);
      ctx.translate(centerX, centerY);
      ctx.rotate(-this.angle); // Rotate extra 90° to match SVG

      // Draw SVG centered on new origin
      ctx.drawImage(
        svgImage,
        -this.width / 2,
        -this.height / 2,
        this.width,
        this.height
      );
    }

    ctx.restore();

    // Draw sensors if available
    if (this.sensor && drawSensor) {
      this.sensor.draw(ctx);
    }
  }
}
export default Car;
