class Endboss extends MovableObject {
    height = 400;
    width = 300;
    y = 45;
    speed = 4; // Geschwindigkeit des Endboss beim Bewegen
    speedY = 0; // Geschwindigkeit in Y-Richtung
    gravity = 1; // Schwerkraft
    jumpPower = 20; // Stärke des Sprungs
    isWalking = false;
    direction = 'left';
    isAngry = false;
    isAttacking = false;

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
        this.x = 2650; // Der Endboss startet weit rechts auf der Karte
        this.loadImages(this.IMAGES_ANGRY);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.animate();
    }

    animate() {
        // Bewegung und Richtung wechseln
        setInterval(() => {
            if (this.isWalking) {
                if (this.direction === 'left') {
                    this.moveLeft();
                    this.otherDirection = false;
                } else {
                    this.moveRight();
                    this.otherDirection = true;
                }

                // Begrenzung der Bewegung auf die Spielfeldgrenzen
                if (this.x <= 2000) this.direction = 'right';
                if (this.x >= 2650) this.direction = 'left';
            }

            // Schwerkraft anwenden
            this.y += this.speedY;
            if (this.y > 45) { // assuming 45 is ground level
                this.y = 45;
                this.speedY = 0;
            } else {
                this.speedY += this.gravity;
            }
        }, 1000 / 80); // 80 FPS

        // Zufällige Animation abspielen
        setInterval(() => {
            this.playRandomAnimation();
        }, 1000); // Alle 1 Sekunde Animation wechseln
    }

    playRandomAnimation() {
        const animations = [
            { images: this.IMAGES_WALKING, state: 'walking' },
            { images: this.IMAGES_ATTACK, state: 'attacking' },
            { images: this.IMAGES_ANGRY, state: 'angry' }
        ];
        const randomIndex = Math.floor(Math.random() * animations.length);
        const selectedAnimation = animations[randomIndex];

        this.playAnimation(selectedAnimation.images);

        this.isWalking = selectedAnimation.state === 'walking';
        this.isAngry = selectedAnimation.state === 'angry';
        this.isAttacking = selectedAnimation.state === 'attacking';

        // Springe, wenn der Boss angreift
        if (this.isAttacking) {
            this.jump();
        }
    }

    moveLeft() {
        this.x -= this.speed;
    }

    moveRight() {
        this.x += this.speed;
    }

    jump() {
        this.y = 45; // Setze die y-Position auf den Boden
        this.speedY = -this.jumpPower; // Höher springen
    }
}
