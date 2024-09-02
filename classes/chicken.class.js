class Chicken extends MovableObject {

    width = 100;
    height = 85;
    y = 345;
    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png',

    ];

    constructor() {
        super().loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING);
        this.x = 200 + Math.random() * 500;
        this.speed = 0.16 + Math.random() * 0.4;
        this.animate();
    }

    animate() {
        this.moveLeft();

        setInterval(() => {
            this.playAnimation(this.IMAGES_WALKING);
        }, 200);
    }
    
}