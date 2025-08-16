class Controls {
  constructor(role) {
    this.forward = false;
    this.reverse = false;
    this.left = false;
    this.right = false;

    switch (role) {
      case "MASTER":
        this.#addKeyboardListeners();
        break;
      case "SLAVE":
        this.forward = true;
        break;
    }
  }

  #addKeyboardListeners() {
    document.onkeydown = (e) => {
      switch (e.key) {
        // w-a-s-d
        case "w":
          this.forward = true;
          break;
        case "a":
          this.left = true;
          break;
        case "s":
          this.reverse = true;
          break;
        case "d":
          this.right = true;
          break;

        // arrow
        case "ArrowLeft":
          this.left = true;
          break;
        case "ArrowRight":
          this.right = true;
          break;
        case "ArrowUp":
          this.forward = true;
          break;
        case "ArrowDown":
          this.reverse = true;
          break;
      }
    };
    document.onkeyup = (e) => {
      switch (e.key) {
        // w-a-s-d
        case "a":
          this.left = false;
          break;
        case "ArrowLeft":
          this.left = false;
          break;
        case "d":
          this.right = false;
          break;
        case "ArrowRight":
          this.right = false;
          break;
        case "w":
          this.forward = false;
          break;
        case "ArrowUp":
          this.forward = false;
          break;
        case "s":
          this.reverse = false;
          break;
        case "ArrowDown":
          this.reverse = false;
          break;
      }
    };
  }
}
export default Controls;
