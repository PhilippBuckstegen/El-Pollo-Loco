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
    walking_sounds = new Audio('audio/running.mp3');

    constructor() {
        super().loadImage('img/2_character_pepe/1_idle/long_idle/I-13.png');
        this.loadImages(this.IMAGES_WALKING);
        this.applyGravity();
        this.animate();
    }
    
    animate() {

        setInterval(() => {
            this.walking_sounds.pause();
            if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
                this.x += this.speed;
                this.otherDirection = false;
                this.walking_sounds.play();
            }

            if (this.world.keyboard.LEFT && this.x > 0) {
                this.x -= this.speed;
                this.otherDirection = true;
                this.walking_sounds.play();
            }
            this.world.camera_x = -this.x + 80;

        }, 1000 / 60);

        setInterval(() => {

            if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                
                // Walk animation
                this.playAnimation(this.IMAGES_WALKING);
            }
            
        }, 40);
    }
    
    jump() {
        this.speedY = 30;
    }
}