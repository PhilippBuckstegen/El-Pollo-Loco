class MovableObject {
    x = 70;
    y = 280;
    img;
    imageCache = {};
    currentImage = 0;
    speed = 0.16;
    otherDirection = false;


    //height = 150;
    //width = 100;

    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
        
    }

    moveRight() {
        
    }

    moveLeft() {
        setInterval(() => {
            this.x -= this.speed;
        }, 1000 / 60);

    }
}