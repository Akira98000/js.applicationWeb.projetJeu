export default class ObjectAnimator {
    constructor() {
        this.animations = new Map();
        this.lastTime = performance.now();
    }

    // AJOUTER UNE ANIMATION
    addAnimation(object, propertyName, startValue, endValue, duration, easing = 'linear') {
        const animation = {
            object,
            propertyName,
            startValue,
            endValue,
            duration,
            startTime: performance.now(),
            easing
        };
        
        if (!this.animations.has(object)) {
            this.animations.set(object, new Map());
        }
        this.animations.get(object).set(propertyName, animation);
    }

    // METTRE A JOUR TOUTES LES ANIMATIONS
    update() {
        const currentTime = performance.now();
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        for (const [object, properties] of this.animations) {
            for (const [propertyName, animation] of properties) {
                const elapsed = currentTime - animation.startTime;
                const progress = Math.min(elapsed / animation.duration, 1);

                if (progress >= 1) {
                    // ANIMATION TERMINEE
                    object[propertyName] = animation.endValue;
                    properties.delete(propertyName);
                    if (properties.size === 0) {
                        this.animations.delete(object);
                    }
                } else {
                    // METTRE A JOUR LA VALEUR DE LA PROPRIETE
                    const easedProgress = this.getEasing(progress, animation.easing);
                    object[propertyName] = animation.startValue + (animation.endValue - animation.startValue) * easedProgress;
                }
            }
        }
    }

    // FONCTIONS D'EASING
    getEasing(progress, type) {
        switch (type) {
            case 'linear':
                return progress;
            case 'easeIn':
                return progress * progress;
            case 'easeOut':
                return 1 - (1 - progress) * (1 - progress);
            case 'easeInOut':
                return progress < 0.5 
                    ? 2 * progress * progress 
                    : 1 - Math.pow(-2 * progress + 2, 2) / 2;
            default:
                return progress;
        }
    }

    // VERIFIER SI UN OBJET EST EN COURS D'ANIMATION
    isAnimating(object, propertyName = null) {
        if (!this.animations.has(object)) return false;
        if (propertyName === null) return true;
        return this.animations.get(object).has(propertyName);
    }

    // ARRETER UNE ANIMAION
    stopAnimation(object, propertyName = null) {
        if (!this.animations.has(object)) return;
        
        if (propertyName === null) {
            this.animations.delete(object);
        } else {
            const properties = this.animations.get(object);
            properties.delete(propertyName);
            if (properties.size === 0) {
                this.animations.delete(object);
            }
        }
    }
} 