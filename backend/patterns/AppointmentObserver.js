const logger = require('../patterns/LoggerSingleton');

class AppointmentNotifier {
    constructor() {
        this.observers = [];
    }
    // subscribe a new observer
    subscribe(observer) {
        this.observers.push(observer);
    }
    // notify all observers of an event
    notify(event) {
        this.observers.forEach(observer => observer.update(event));
    }
}

// observer: User
class UserObserver {
    constructor(name) {
        this.name = name;
    }
    update(event) {
        logger.info(`User ${this.name} received notification: ${event}`);
    }
}

// observer: Pet
class PetObserver {
    constructor(petName) {
        this.petName = petName;
    }
    update(event) {
        logger.info(`Pet ${this.petName} received notification: ${event}`);
    }
}


const notifier = new AppointmentNotifier();

module.exports = { AppointmentNotifier, UserObserver, PetObserver, notifier };



