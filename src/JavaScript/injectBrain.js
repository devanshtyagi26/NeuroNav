/**
 * Saves a JSON object as a string in localStorage under the key 'bestBrain'.
 * @param {Object} jsonObj - The JSON object to save.
 */
export function injectBrain(jsonObj) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("bestBrain", JSON.stringify(jsonObj));
    return true;
  } catch (e) {
    console.error("Failed to save brain:", e);
    return false;
  }
}


