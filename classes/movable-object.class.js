class MovableObject extends DrawableObject {
    speed = 0.16;
    otherDirection = false;
    speedY = 0;
    acceleration = 2.5;
    energy = 100;
    lastHit = 0;
    animationFinished = false;

    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 25);
    }

    isAboveGround() {
        if (this instanceof ThrowableObject) {
            return true;
        } else {
            return this.y < 135;
        }
    }

    isColliding(mo) {
        return  this.x + this.width > mo.x &&
                this.y + this.height > mo.y &&
                this.x < mo.x + mo.width &&
                this.y < mo.y + mo.height;
    }

    hit() {
        this.energy -= 5;
        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }

    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit;
        timepassed = timepassed / 1000;
        return timepassed < 1;
    }

    isDead() {
        return this.energy === 0;
    }
    
    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    moveRight() {
        this.x += this.speed;
    }

    moveLeft() {
        this.x -= this.speed;
    }

    jump() {
        this.speedY = 30;
        this.y = 135;
    }

    playAnimationOnce(images) {
        let currentFrame = 0;
        let totalFrames = images.length;


        let showNextFrame = () => {
            if (currentFrame < totalFrames) {
                this.img = this.imageCache[images[currentFrame]];
                currentFrame++;
                setTimeout(showNextFrame, 100);
            } else {
                this.img = this.imageCache['img/4_enemie_boss_chicken/5_dead/G26.png'];
            }
        };

        showNextFrame();
    }
      
}