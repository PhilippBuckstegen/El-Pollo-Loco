class CollectableCoin extends CollectableObject {
    constructor() {
        super('img/8_coin/coin_1.png', 60, 60);

        // Zufällige Y-Position für Münzen
        this.y = this.getRandomYPosition();
    }

    getRandomYPosition() {
        // Zufällige Y-Position innerhalb eines bestimmten Bereichs
        return 150 + Math.random() * 150;
    }
}
