class Endboss extends MovableObject {
    height = 400;
    width = 300;
    y = 45;
    speed = 4;
    speedY = 0;
    gravity = 1;
    jumpPower = 20;
    direction = 'left';
    isWalking = false;
    isAngry = false;
    isAttacking = false;
    isDead = false;
    otherDirection = false;
    energy = 100;

    IMAGES_ANGRY = [
        'img/4_enemie_boss_chicken/2_alert/G5.png',
        'img/4_enemie_boss_chicken/2_alert/G6.png',
        'img/4_enemie_boss_chicken/2_alert/G7.png',
        'img/4_enemie_boss_chicken/2_alert/G8.png',
        'img/4_enemie_boss_chicken/2_alert/G9.png',
        'img/4_enemie_boss_chicken/2_alert/G10.png',
        'img/4_enemie_boss_chicken/2_alert/G11.png',
        'img/4_enemie_boss_chicken/2_alert/G12.png',
    ];

    IMAGES_WALKING = [
        'img/4_enemie_boss_chicken/1_walk/G1.png',
        'img/4_enemie_boss_chicken/1_walk/G2.png',
        'img/4_enemie_boss_chicken/1_walk/G3.png',
        'img/4_enemie_boss_chicken/1_walk/G4.png'
    ];

    IMAGES_ATTACK = [
        'img/4_enemie_boss_chicken/3_attack/G13.png',
        'img/4_enemie_boss_chicken/3_attack/G14.png',
        'img/4_enemie_boss_chicken/3_attack/G15.png',
        'img/4_enemie_boss_chicken/3_attack/G16.png',
        'img/4_enemie_boss_chicken/3_attack/G17.png',
        'img/4_enemie_boss_chicken/3_attack/G18.png',
        'img/4_enemie_boss_chicken/3_attack/G19.png',
        'img/4_enemie_boss_chicken/3_attack/G20.png',
    ];

    IMAGES_HURT = [
        'img/4_enemie_boss_chicken/4_hurt/G21.png',
        'img/4_enemie_boss_chicken/4_hurt/G22.png',
        'img/4_enemie_boss_chicken/4_hurt/G23.png'
    ];

    IMAGES_DEAD = [
        'img/4_enemie_boss_chicken/5_dead/G24.png',
        'img/4_enemie_boss_chicken/5_dead/G25.png',
        'img/4_enemie_boss_chicken/5_dead/G26.png'
    ];

    constructor(world) {
        super().loadImage(this.IMAGES_ANGRY[0]);
        this.world = world;
        this.x = 2650;
        this.loadImages(this.IMAGES_ANGRY);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.animate();
    }

    animate() {
        this.startMovementLogic();
        this.startAnimationCycle();
    }

    startMovementLogic() {
        setInterval(() => {
            if (this.isWalking) {
                this.walkingMovement();
            }

            this.applyGravity();

            if (this.y < 45) {
                this.horizontalJumpMovement();
            }
        }, 1000 / 60);  // Bewegungslogik
    }

    startAnimationCycle() {
        setInterval(() => {
            this.playRandomAnimation();
        }, 1000);
    }

    playRandomAnimation() {
        const animations = [
            { images: this.IMAGES_WALKING, state: 'walking', speedFactor: 0.1 },  // Geh-Animation schneller abspielen
            { images: this.IMAGES_ATTACK, state: 'attacking', speedFactor: 2 },   // Normales Tempo für Angriff
            { images: this.IMAGES_ANGRY, state: 'angry', speedFactor: 3 }         // Normales Tempo für Wut
        ];

        const randomIndex = Math.floor(Math.random() * animations.length);
        const selectedAnimation = animations[randomIndex];

        this.playAnimation(selectedAnimation.images, selectedAnimation.speedFactor);

        this.isWalking = selectedAnimation.state === 'walking';
        this.isAngry = selectedAnimation.state === 'angry';
        this.isAttacking = selectedAnimation.state === 'attacking';

        if (this.isAttacking) {
            this.jump();
        }
    }

    playAnimation(images, speedFactor = 4) {
        let i = Math.floor(this.currentImage / speedFactor) % images.length; 
        this.img = this.imageCache[images[i]];
        this.currentImage++;
    }

    walkingMovement() {
        this.otherDirection = this.direction === 'right';
        this.direction === 'left' ? this.moveLeft() : this.moveRight();

        if (this.x <= 2000) this.direction = 'right';
        if (this.x >= 2650) this.direction = 'left';
    }

    horizontalJumpMovement() {
        this.otherDirection ? this.moveRight() : this.moveLeft();
    }

    jump() {
        if (this.y === 45) {
            this.speedY = -this.jumpPower;
        }
    }

    applyGravity() {
        this.y += this.speedY;
        if (this.y > 45) {
            this.y = 45;
            this.speedY = 0;
        } else {
            this.speedY += this.gravity;
        }
    }

    moveLeft() {
        this.x -= this.speed;
    }

    moveRight() {
        this.x += this.speed;
    }
    
    hit() {
        this.energy -= 10;
        if (this.energy < 0) {
            this.energy = 0;
            this.isDead = true;
        }
        this.lastHit = new Date().getTime();
    }

    isHurt() {
        let timePassed = new Date().getTime() - this.lastHit;
        return timePassed < 1000;
    }

    isDead() {
        return super.isDead();
    }

}


