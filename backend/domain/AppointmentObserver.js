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
        console.log(`User ${this.name} received notification: ${event}`);
    }
}

// observer: Pet
class PetObserver {
    constructor(petName) {
        this.petName = petName;
    }
    update(event) {
        console.log(`Pet ${this.petName} received notification: ${event}`);
    }
}
class Logger {
    update(data) {
        console.log(`Logger received: ${data}`);
    }
}

const notifier = new AppointmentNotifier();
notifier.subscribe(new Logger());

module.exports = { AppointmentNotifier, UserObserver, PetObserver, Logger, notifier };



