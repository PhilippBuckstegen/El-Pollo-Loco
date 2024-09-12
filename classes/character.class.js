class Character extends MovableObject {
    world;
    width = 120;
    height = 300;
    speed = 10;
    y = 135;
    collectedBottles = [];
    collectedCoins = [];
    isDeadAnimating = false;

    IMAGES_WALKING = [
        'img/2_character_pepe/2_walk/W-21.png',
        'img/2_character_pepe/2_walk/W-22.png',
        'img/2_character_pepe/2_walk/W-23.png',
        'img/2_character_pepe/2_walk/W-24.png',
        'img/2_character_pepe/2_walk/W-25.png',
        'img/2_character_pepe/2_walk/W-26.png',
    ];

    IMAGES_JUMPING = [
        'img/2_character_pepe/3_jump/J-31.png',
        'img/2_character_pepe/3_jump/J-32.png',
        'img/2_character_pepe/3_jump/J-33.png',
        'img/2_character_pepe/3_jump/J-34.png',
        'img/2_character_pepe/3_jump/J-35.png',
        'img/2_character_pepe/3_jump/J-36.png',
        'img/2_character_pepe/3_jump/J-37.png',
        'img/2_character_pepe/3_jump/J-38.png',
        'img/2_character_pepe/3_jump/J-39.png',
    ];

    IMAGES_DEAD = [
        'img/2_character_pepe/5_dead/D-51.png',
        'img/2_character_pepe/5_dead/D-52.png',
        'img/2_character_pepe/5_dead/D-53.png',
        'img/2_character_pepe/5_dead/D-54.png',
        'img/2_character_pepe/5_dead/D-55.png',
        'img/2_character_pepe/5_dead/D-56.png',
        'img/2_character_pepe/5_dead/D-57.png',
    ];

    IMAGES_HURT = [
        'img/2_character_pepe/4_hurt/H-41.png',
        'img/2_character_pepe/4_hurt/H-42.png',
        'img/2_character_pepe/4_hurt/H-43.png',
    ];

    constructor(world) {
        super().loadImage('img/2_character_pepe/1_idle/long_idle/I-13.png');
        this.world = world;
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.applyGravity();
        this.animate();
    }

    characterIsDead() {
        if (this.isDead() && !this.isDeadAnimating) {
            this.isDeadAnimating = true;
            this.playAnimationOnce(this.IMAGES_DEAD, 300);
            this.world.soundManager.playSound('characterDead');
            setTimeout(() => stopGame('lose'), 1000);
        }
    }
    
    animate() {
        setInterval(() => {
            if (this.world.keyboard.RIGHT && this.x < this.world.canvasWidth - this.width) {
                this.moveRight();
                this.otherDirection = false;
            }

            if (this.world.keyboard.LEFT && this.x > 0) {
                this.moveLeft();
                this.otherDirection = true;
            }

            if (this.world.keyboard.SPACE && !this.isAboveGround()) {
                this.jump();
                this.world.soundManager.playSound('characterJump');

            }

            this.world.camera_x = -this.x + 80;

        }, 1000 / 60);

        setInterval(() => {
            if (this.isDead()) {
                this.characterIsDead();
                
            } else if (this.isHurt()) {
                this.playAnimation(this.IMAGES_HURT);
                this.world.soundManager.playSound('characterHurt');
            } else if (this.isAboveGround()) {
                this.playAnimation(this.IMAGES_JUMPING);

            } else {
                if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                    this.world.soundManager.stopSound('snoring');
                    this.world.soundManager.playSound('characterRun');
                    this.playAnimation(this.IMAGES_WALKING);
                } else {
                    this.world.soundManager.stopSound('characterRun');

                }
            }
        }, 50);
    }

    collectBottle(bottle) {
        this.collectedBottles.push(bottle);
        this.world.bottleStatusBar.setPercentage(this.collectedBottles.length * 20);
    }

    collectCoin(coin) {
        this.collectedCoins.push(coin);
        this.world.coinStatusBar.setPercentage(this.collectedCoins.length * 20);
    }

}


