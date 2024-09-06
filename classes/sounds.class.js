class SoundManager {
    constructor() {
        this.sounds = {};
        window.addEventListener('click', () => {
            this.playSound('backgroundMusic', true);
        });
    }

    /**
     * Loads a sound and stores it under the given name.
     * @param {string} name - The name to reference the sound.
     * @param {string} path - The path to the audio file.
     */
    loadSound(name, path) {
        const audio = new Audio(path);
        this.sounds[name] = audio;
    }

    /**
     * Plays the sound with the given name.
     * @param {string} name - The name of the sound to play.
     * @param {boolean} [loop=false] - Optional: Whether the sound should loop (default is false).
     */
    playSound(name, loop = false) {
        const sound = this.sounds[name];
        if (sound) {
            sound.loop = loop;
            sound.play();
        }
    }

    /**
     * Stops the sound with the given name.
     * @param {string} name - The name of the sound to stop.
     */
    stopSound(name) {
        const sound = this.sounds[name];
        if (sound) {
            sound.pause();
            sound.currentTime = 0; // Setzt den Sound zurück
        }
    }

    /**
     * Sets the volume for a specific sound.
     * @param {string} name - The name of the sound.
     * @param {number} volume - The volume level (value between 0.0 and 1.0).
     */
    setVolume(name, volume) {
        const sound = this.sounds[name];
        if (sound) {
            sound.volume = volume;
        }
    }

    /**
     * Stops all currently loaded sounds.
     */
    stopAllSounds() {
        for (let sound in this.sounds) {
            this.stopSound(sound);
        }
    }    
}

