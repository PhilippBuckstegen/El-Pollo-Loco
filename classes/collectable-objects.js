class CollectableObject extends DrawableObject {
    
    constructor(imagePath, width, height) {
        super();
        this.loadImage(imagePath);
        this.width = width;
        this.height = height;
        this.setRandomPosition();
    }

    setRandomPosition() {
        this.x = 200 + this.getRandomXPosition();
        this.y = this.getRandomYPosition();
    }

    getRandomXPosition() {
        return Math.random() * 2200;
    }

    getRandomYPosition() {
        return Math.random() * 300;
     }
}
