class CollectableBottle extends CollectableObject {
    constructor() {
        // Zufälliges Bild für Flaschen
        let imagePath = Math.random() < 0.5
            ? 'img/6_salsa_bottle/1_salsa_bottle_on_ground.png'
            : 'img/6_salsa_bottle/2_salsa_bottle_on_ground.png';
        
        super(imagePath, 60, 60);

        // Feste Y-Position für Flaschen
        this.y = 380; // Feste Y-Position für Flaschen
    }

    getRandomXPosition() {
        // Zufällige X-Position innerhalb des Levels (bis zur maximalen Breite)
        return Math.random() * 2200;
    }
}
