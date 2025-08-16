// Flag to manually enable/disable GPU (WebGL)
let useGPU = true; // Set to false to force 2D context

export function setUseGPU(flag) {
  useGPU = flag;
}

export function isWebGLAvailable() {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch (e) {
    return false;
  }
}

export function getCanvasContext(canvas) {
  if (!canvas) return null;
  if (useGPU && isWebGLAvailable()) {
    // Use WebGL if available and flag is true
    return (
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
    );
  } else {
    // Fallback to 2D context
    return canvas.getContext("2d");
  }
}
