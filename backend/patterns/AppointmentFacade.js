const PetModel = require("../models/Pet");
const appointmentService = require("../services/appointmentService");
const { UserObserver, PetObserver, notifier } = require("../patterns/AppointmentObserver")


// Facade sub system
class PetChecker {
    async check(petId) {
        if (!petId) throw new Error("petId is required.");
        const pet = await PetModel.findById(petId).lean();
        if (!pet) throw new Error("Pet not found.");
        return pet;
    }
}

class UserValidator {
    validate(user) {
        console.log("User Validator: Validating user");
        if (!user?.id) throw new Error("Invalid user.");
        return true;
    }
}

//DB

class AppointmentCreator {
    async create(appointmentData, currentUser) {
        console.log("Appointment Creator: Creating appointment");
        const appointment = await appointmentService.createAppointment({
            ...appointmentData,
            userId: currentUser.id,
        });
        console.log("Appointment Creator: Appointment saved");
        return appointment;
    }
}


//NotificationSender(using Observer)
class NotificationSender {
    constructor() {
        // Observer
        this.notifier = notifier;
    }

    send(appointment) {
        console.log("Notification Sender: Using Observer pattern");

        // Observer registration
        const userObs = new UserObserver(appointment.userId.name);
        const petObs = new PetObserver(appointment.petId.name);

        this.notifier.subscribe(userObs);
        this.notifier.subscribe(petObs);

        // Observer sending notification
        const message = `Appointment confirmed: ${appointment.petName} on ${appointment.date}`;
        this.notifier.notify(message);

        console.log("Notification Sender: All notifications sent");
        // Observer use
        notifier.subscribe(userObs);
        notifier.subscribe(petObs);
        notifier.notify(JSON.stringify({
            type: 'APPOINTMENT_CREATED'
        }));
    }
}

// ========== FACADE  ==========
class AppointmentFacade {
    constructor() {
        this.petChecker = new PetChecker();
        this.userValidator = new UserValidator();
        this.appointmentCreator = new AppointmentCreator();
        this.notificationSender = new NotificationSender();
    }

    async createCompleteAppointment(appointmentData, currentUser) {
        console.log("\nStarting Complete Appointment Process...");

        // PetCheck(=>TV function)
        this.petChecker.check(appointmentData.petId);

        // User validation (=> SoundSystem)
        this.userValidator.validate(currentUser);

        // appointmnet (=>Lights)
        const appointment = await this.appointmentCreator.create(appointmentData, currentUser);

        // Observer notification sender (=>AC)
        this.notificationSender.send(appointment);

        console.log("Appointment process completed! 🎉\n");

        return {
            success: true,
            appointment: appointment,
            message: "Appointment created and notifications sent!"
        };
    }
}

const facade = new AppointmentFacade();
module.exports = {facade};