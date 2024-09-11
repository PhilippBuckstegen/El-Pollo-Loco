class ThrowableObject extends MovableObject {

    imagesFlying = [
        'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
    ];

    imagesSplash = [
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png'
    ];

    constructor(x, y) {
        super();
        this.world = world;
        this.loadImage(this.imagesFlying[0]);
        this.x = x;
        this.y = y;
        this.height = 60;
        this.width = 60;
        this.speedX = 25;
        this.speedY = 25;
        this.currentImage = 0;
        this.currentSplashImage = 0;
        this.isCollided = false;
        this.isSplash = false;
        this.interval = null;
        this.imageChangeInterval = 0;
        this.throw();
    }

    throw() { // wirft leider noch zu schnell!
        this.applyGravity();
        this.interval = setInterval(() => {
            if (!this.isCollided) {
                this.x += this.speedX;
                this.y -= this.speedY;
                //this.speedY -= 0;
                this.imageChangeInterval++;
                if (!this.isSplash && this.imageChangeInterval % 2 === 0) {
                    this.playAnimation(this.imagesFlying);
                    this.world.soundManager.playSound('throw');
                }

                if (this.y >= 440 - this.height) {
                    this.y = 440 - this.height;
                    this.speedY = 0;
                    this.speedX = 0; 
                    
                    if (!this.isSplash) {
                        this.isSplash = true;
                        this.playSplashAnimation();
                        this.world.soundManager.playSound('bottleBreak');
                    }
                }
            } else {
                clearInterval(this.interval);
                if (!this.isSplash) {
                    this.isSplash = true;
                    this.playSplashAnimation();
                }
            }
        }, 1000 / 20);
    }


    playAnimation(images) {
        if (this.isSplash) return;

        this.loadImage(images[this.currentImage]);
        this.currentImage = (this.currentImage + 1) % images.length;
    }

    playSplashAnimation() {
        if (!this.isSplash) return;

        this.loadImage(this.imagesSplash[this.currentSplashImage]);
        this.currentSplashImage = (this.currentSplashImage + 1) % this.imagesSplash.length;

        if (this.currentSplashImage === 0) {
            this.remove();
        }
    }

    checkCollision(otherObject) {
        if (this.isColliding(otherObject)) {
            this.isCollided = true;
        }
    }

    update() {
        if (this.isSplash) {
            this.playSplashAnimation();
        }
    }

    remove() {
        setTimeout(() => {
            let index = this.world.throwableObjects.indexOf(this);
            if (index > -1) {
                this.world.throwableObjects.splice(index, 1); // Flasche aus dem Array entfernen
            }
        }, 200); 
    }
}
