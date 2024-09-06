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

        this.soundManager.playSound('snoring', true); // true für Loop
        this.soundManager.playSound('backgroundMusic', true); // true für Loop
        this.soundManager.setVolume('backgroundMusic', 0.3);
    }

    setWorld() {
        this.character.world = this;
        this.endboss.world = this;
    }

    run() {
        setInterval(() => {
            this.jumpOnEnemy();
            this.checkCollisions();
            this.checkThrowObjects();
        }, 300);
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
            if (this.character.isColliding(enemy)) {
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
            if (this.character.isColliding(enemy) && !enemy.isDead) {
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
}
