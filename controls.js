class Controls {
  constructor(type) {
    this.forward = false;
    this.left = false;
    this.right = false;
    this.reverse = false;

    switch (type) {
      case "AI":
        this.#addKeyboardListeners();
        break;
      case "DUMMY":
        this.forward = true;
        break;
      case "KEY":
        this.#addKeyboardListeners();
        break;
    }
  }

  #addKeyboardListeners() {
    document.onkeydown = (event) => {
      switch (event.keyCode) {
        case 37: //left
          this.left = true;
          break;
        case 65: // a
          this.left = true;
          break;
        case 39: // right
          this.right = true;
          break;
        case 68: // d
          this.right = true;
          break;
        case 38: // up
          this.forward = true;
          break;
        case 87: // d
          this.forward = true;
          break;
        case 40: // down
          this.reverse = true;
          break;
        case 83: // s
          this.reverse = true;
          break;
      }
    };
    document.onkeyup = (event) => {
      switch (event.keyCode) {
        case 37: //left
          this.left = false;
          break;
        case 65: // a
          this.left = false;
          break;
        case 39: // right
          this.right = false;
          break;
        case 68: // d
          this.right = false;
          break;
        case 38: // up
          this.forward = false;
          break;
        case 87: // d
          this.forward = false;
          break;
        case 40: // down
          this.reverse = false;
          break;
        case 83: // s
          this.reverse = false;
          break;
      }
    };
  }
}
