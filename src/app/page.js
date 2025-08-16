"use client";

import { useEffect } from "react";
import {
  getCanvasContext,
  setUseGPU,
  isWebGLAvailable,
} from "../JavaScript/renderer";

export default function Home() {
  useEffect(() => {
    // Optionally set GPU usage flag
    setUseGPU(false); // Uncomment to force 2D context

    const carCanvas = document.getElementById("myCanvas");
    carCanvas.width = 200;
    const carCtx = getCanvasContext(carCanvas);
    if (
      carCtx &&
      window.WebGLRenderingContext &&
      carCtx instanceof window.WebGLRenderingContext
    ) {
      console.log("Using WebGL context");
      import("../JavaScript/GPU/main").then((mod) => {
        if (mod && typeof mod.default === "function") mod.default();
      });
    } else if (carCtx && carCtx instanceof window.CanvasRenderingContext2D) {
      console.log("Using 2D context");
      import("../JavaScript/CPU/main").then((mod) => {
        if (mod && typeof mod.default === "function") mod.default();
      });
    } else {
      console.warn("No valid canvas context available");
    }
  }, []);

  return (
    <>
      <canvas id="myCanvas"></canvas>
    </>
  );
}
