class World {
    character;
    endboss;
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    healthStatusBar = new HealthStatusBar();
    bottleStatusBar = new BottleStatusBar();
    coinStatusBar = new CoinStatusBar();
    endbossStatusBar = new EndbossStatusBar();
    throwableObjects = [];
    collectables = [];
    canvasWidth = 2200;
    canvasHeight = 480;
    intervals = [];

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.soundManager = new SoundManager();
        this.character = new Character(this);
        this.endboss = new Endboss(this);
        this.initSounds();
        this.setWorld();
        this.addCollectables();
        this.draw();
        this.run();
    }

    initSounds () {
        this.soundManager.loadSound('jump', 'audio/jump_voice.mp3');
        this.soundManager.loadSound('chickenDead', 'audio/chicken_dead.mp3');
        this.soundManager.loadSound('babyChickenDead', 'audio/baby-chicken_dead.mp3');
        this.soundManager.loadSound('coin', 'audio/coin.mp3');
        this.soundManager.loadSound('collectBottle', 'audio/bottle_collect.mp3');
        this.soundManager.loadSound('backgroundMusic', 'audio/music/game-bg.mp3');
        this.soundManager.loadSound('snoring', 'audio/sleep.mp3');
        this.soundManager.loadSound('bottleBreak', 'audio/bottle_break.mp3');
        this.soundManager.loadSound('throw', 'audio/throw.mp3');
        this.soundManager.loadSound('endbossDead', 'audio/endboss_dead.mp3');
        this.soundManager.loadSound('endbossHurt', 'audio/endboss_hurt.mp3');
        this.soundManager.loadSound('characterHurt', 'audio/hurt.mp3');
        this.soundManager.loadSound('characterRun', 'audio/running.mp3');
        this.soundManager.loadSound('characterJump', 'audio/jump_voice.mp3');
        this.soundManager.loadSound('characterDead', 'audio/dead.mp3');
        this.soundManager.loadSound('win', 'audio/music/won.mp3');
        this.soundManager.loadSound('lose', 'audio/music/lost.mp3');

        this.soundManager.playSound('snoring', true);
        this.soundManager.playSound('backgroundMusic', true);
        this.soundManager.setVolume('backgroundMusic', 0.3);
    }

    setWorld() {
        this.character.world = this;
        this.endboss.world = this;
    }

    run() {
        this.intervals.push(setInterval(() => {
            this.jumpOnEnemy();
            this.checkCollisions();
            this.checkBottleCollisions();
        }, 40));
    
        this.intervals.push(setInterval(() => {
            this.checkThrowObjects();
        }, 150));
    }

    checkThrowObjects() {
        if (this.keyboard.D && this.character.collectedBottles.length > 0) {
            let bottle = new ThrowableObject(this.character.x + 100, this.character.y + 100);
            this.character.collectedBottles.pop();    
            this.throwableObjects.push(bottle);
            bottle.throw();
            this.character.world.bottleStatusBar.setPercentage(this.character.collectedBottles.length * 20);
        }
    }

    jumpOnEnemy() {
        this.level.enemies.forEach((enemy) => {
            if (this.character.isColliding(enemy) && !enemy.isDead && !this.character.isHurt()) {
                if (this.character.isAboveGround()) {
                    enemy.defeat();
    
                    if (enemy instanceof BabyChicken) {
                        this.soundManager.playSound('babyChickenDead');
                    } else if (enemy instanceof Chicken) {
                        this.soundManager.playSound('chickenDead');
                    }
    
                    this.character.jump();
                } else {
                    this.character.hit();
                    this.healthStatusBar.setPercentage(this.character.energy);
                }
            }
        });
    }
    

    checkCollisions() {
        this.level.enemies.forEach((enemy) => {
            if (this.character.isColliding(enemy) && !enemy.isDead && !this.character.isHurt()) {
                this.character.hit();
                this.healthStatusBar.setPercentage(this.character.energy);
            }
        });
    
        this.collectables.forEach((collectable, index) => {
            if (this.character.isColliding(collectable)) {
                if (collectable instanceof CollectableBottle) {
                    this.character.collectBottle(collectable);
                    this.soundManager.playSound('collectBottle');
                    this.collectables.splice(index, 1);
                } else if (collectable instanceof CollectableCoin) {
                    this.character.collectCoin(collectable);
                    this.soundManager.playSound('coin');
                    this.collectables.splice(index, 1);
                }
            }
        });
    }
    
    checkBottleCollisions() {
        this.throwableObjects.forEach((bottle) => {
            this.level.enemies.forEach((enemy) => {
                if (bottle.isColliding(enemy)) {
                    bottle.playSplashAnimation();
                    bottle.remove();
                    enemy.hit();
    
                    if (enemy instanceof Endboss) {
                        this.updateEndbossStatus(enemy);
    
                        if (enemy.isDead) {
                            this.endGameAfterEndbossDeath(enemy);
                        }
                    }
                }
            });
        });
    }
    
    updateEndbossStatus(endboss) {
        if (!endboss.isDead) {
            endboss.playAnimation(endboss.IMAGES_HURT);
            this.soundManager.playSound('endbossHurt');

            this.endbossStatusBar.setPercentage(endboss.energy);   
        }
    }
    
    endGameAfterEndbossDeath(enemy) {
        enemy.playAnimationOnce(enemy.IMAGES_DEAD, 500);
        this.soundManager.playSound('endbossDead');

    
        setTimeout(() => {
            this.removeEndboss(enemy);
            stopGame('win');
        }, 500); 
    }    
    

    addCollectables() {
        let numberOfBottles = 10;
        let numberOfCoins = 10;

        Array.from({ length: numberOfBottles }).forEach(() => {
            let bottle = new CollectableBottle(this.canvas.width, this.canvas.height);
            this.collectables.push(bottle);
        });

        Array.from({ length: numberOfCoins }).forEach(() => {
            let coin = new CollectableCoin(this.canvas.width, this.canvas.height);
            this.collectables.push(coin);
        });
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);

        this.ctx.translate(-this.camera_x, 0);
        // ------ Space for fixed objects ------
        this.addToMap(this.healthStatusBar);
        this.addToMap(this.bottleStatusBar);
        this.addToMap(this.coinStatusBar);
        this.addToMap(this.endbossStatusBar);
        this.ctx.translate(this.camera_x, 0);

        this.addToMap(this.character);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);
        this.addObjectsToMap(this.collectables);
        this.ctx.translate(-this.camera_x, 0);

        this.throwableObjects.forEach(throwable => throwable.update());

        let self = this;
        requestAnimationFrame(function () {
            self.draw();
        });
    }

    addObjectsToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o);
        });
    }

    addToMap(mo) {
        if (mo.otherDirection) {
            this.flipImage(mo);
        }

        mo.draw(this.ctx);

        if (mo.otherDirection) {
            this.flipImageBack(mo);
        }
    }

    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }

    
    removeEndboss(endboss) {
        let index = this.level.enemies.indexOf(endboss);
        if (index > -1) {
            this.level.enemies.splice(index, 1);
        }
    }
    
    stopGameMechanics() {
        this.intervals.forEach(clearInterval);
        this.intervals = []; 
        this.soundManager.stopSound('backgroundMusic', true);
        window.removeEventListener("keydown", keydownHandler);
        window.removeEventListener("keyup", keyupHandler);
    }    
    
}
