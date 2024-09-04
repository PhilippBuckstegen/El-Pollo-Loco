class CollectableBottle extends CollectableObject {
   
    constructor() {
        let imagePath = Math.random() < 0.5
            ? 'img/6_salsa_bottle/1_salsa_bottle_on_ground.png'
            : 'img/6_salsa_bottle/2_salsa_bottle_on_ground.png';
        
        super(imagePath, 60, 60);

        this.y = 380;
    }

    getRandomXPosition() {
        return Math.random() * 2200;
    }
}
