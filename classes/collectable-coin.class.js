class CollectableCoin extends CollectableObject {
    constructor() {
        super('img/8_coin/coin_1.png', 80, 80);

        this.y = this.getRandomYPosition();
    }

    getRandomYPosition() {
        return 150 + Math.random() * 150;
    }
}
