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
        this.character = new Character(this);
        this.endboss = new Endboss(this);
        this.setWorld();
        this.addCollectables();
        this.draw();
        this.run();
    }

    setWorld() {
        this.character.world = this;
        this.endboss.world = this;
    }

    run() {
        setInterval(() => {
            this.checkCollisions();
            this.checkThrowObjects();
        }, 200);
    }

    checkThrowObjects() {
        if (this.keyboard.D) {
            let bottle = new ThrowableObject(this.character.x + 100, this.character.y + 100);
            this.throwableObjects.push(bottle);
        }
    }

    checkCollisions() {
        this.level.enemies.forEach((enemy) => {
            if (this.character.isColliding(enemy)) {
                this.character.hit();
                this.healthStatusBar.setPercentage(this.character.energy);
            }
        });

        this.collectables.forEach((collectable, index) => {
            if (this.character.isColliding(collectable)) {
                if (collectable instanceof CollectableBottle) {
                    this.character.collectBottle(collectable);
                    this.collectables.splice(index, 1);
                } else if (collectable instanceof CollectableCoin) {
                    this.character.collectCoin(collectable);
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
