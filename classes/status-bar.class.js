class StatusBar extends DrawableObject {
    percentage = 100;  // Standardwert für eine Statusbar, die bei 100% startet

    constructor(x, y, width, height, images, startsAtZero = false) {
        super();
        this.IMAGES = images;
        this.loadImages(this.IMAGES);
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.percentage = startsAtZero ? 0 : 100; // Setzt den Startwert
        this.updateImage();
    }

    setPercentage(percentage) {
        this.percentage = Math.max(0, Math.min(percentage, 100)); // Sicherstellen, dass percentage zwischen 0 und 100 bleibt
        this.updateImage();
    }

    updateImage() {
        let path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    resolveImageIndex() {
        return Math.floor(this.percentage / 20);
    }
}
