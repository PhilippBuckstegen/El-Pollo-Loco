class Character extends MovableObject {

    width = 120;
    height = 300;
    speed = 10;
    y = 135;
    IMAGES_WALKING = [
        'img/2_character_pepe/2_walk/W-21.png',
        'img/2_character_pepe/2_walk/W-22.png',
        'img/2_character_pepe/2_walk/W-23.png',
        'img/2_character_pepe/2_walk/W-24.png',
        'img/2_character_pepe/2_walk/W-25.png',
        'img/2_character_pepe/2_walk/W-26.png',
    ];
    world;

    constructor() {
        super().loadImage('img/2_character_pepe/1_idle/long_idle/I-13.png');
        this.loadImages(this.IMAGES_WALKING);

        this.animate()
    }
    
    animate() {

        setInterval(() => {
            if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
                this.x += this.speed;
                this.otherDirection = false;
            }

            if (this.world.keyboard.LEFT && this.x > 0) {
                this.x -= this.speed;
                this.otherDirection = true;

            }
            this.world.camera_x = -this.x + 80;

        }, 1000 / 60);

        setInterval(() => {

            if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                
                // Walk animation
                let i = this.currentImage % this.IMAGES_WALKING.length;
                let path = this.IMAGES_WALKING[i];
                this.img = this.imageCache[path];
                this.currentImage++;

                
            }
            
        }, 40);
    }
    
    jump() {
        this.speedY = 30;
    }
}