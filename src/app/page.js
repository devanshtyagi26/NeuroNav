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
    // setUseGPU(false); // Uncomment to force 2D context

    const canvas = document.getElementById("myCanvas");
    const ctx = getCanvasContext(canvas);
    if (
      ctx &&
      window.WebGLRenderingContext &&
      ctx instanceof window.WebGLRenderingContext
    ) {
      console.log("Using WebGL context");
      import("../JavaScript/GPU/main").then((mod) => {
        if (mod && typeof mod.default === "function") mod.default();
      });
    } else if (ctx && ctx instanceof window.CanvasRenderingContext2D) {
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
      <canvas id="myCanvas" width={800} height={600}></canvas>
    </>
  );
}
