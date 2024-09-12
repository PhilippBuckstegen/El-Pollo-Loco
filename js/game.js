let canvas;
let world;
let keyboard = new Keyboard();
let keydownHandler;
let keyupHandler;

function init() {
   canvas = document.getElementById('canvas');
   world = new World(canvas, keyboard);
   addEventListenerInit();
}

function addEventListenerInit() {
    keydownHandler = (e) => {
        if (e.keyCode == 39) {
            keyboard.RIGHT = true;
        }
        if (e.keyCode == 37) {
            keyboard.LEFT = true;
        }
        if (e.keyCode == 38) {
            keyboard.UP = true;
        }
        if (e.keyCode == 40) {
            keyboard.DOWN = true;
        }
        if (e.keyCode == 32) {
            keyboard.SPACE = true;
        }
        if (e.keyCode == 68) {
            keyboard.D = true;
        }
    };

    keyupHandler = (e) => {
        if (e.keyCode == 39) {
            keyboard.RIGHT = false;
        }
        if (e.keyCode == 37) {
            keyboard.LEFT = false;
        }
        if (e.keyCode == 38) {
            keyboard.UP = false;
        }
        if (e.keyCode == 40) {
            keyboard.DOWN = false;
        }
        if (e.keyCode == 32) {
            keyboard.SPACE = false;
        }
        if (e.keyCode == 68) {
            keyboard.D = false;
        }
    };

    window.addEventListener("keydown", keydownHandler);
    window.addEventListener("keyup", keyupHandler);
}

function stopGame(result) {
    if (world) {
        playEndScreenAnimation(result)
        world.stopGameMechanics();
    }
}

function playEndScreenAnimation(result) {
    if (result === 'win') {
        showWinScreen();
        world.soundManager.playSound('win');
    } else if (result === 'lose') {
        showLoseScreen();
        world.soundManager.playSound('lose');
    }
}

function showWinScreen() {
    let winScreen = document.getElementById('winScreen');
    winScreen.classList.remove('d-none');
}

function showLoseScreen() {
    let loseScreen = document.getElementById('loseScreen');
    loseScreen.classList.remove('d-none');

}

