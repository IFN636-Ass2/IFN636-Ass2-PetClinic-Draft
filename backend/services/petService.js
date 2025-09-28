const mongoose = require('mongoose');
const PetModel = require('../models/Pet');
const PetEntity = require('../domain/PetEntity');
const TreatmentModel = require('../models/Treatment');
const TreatmentEntity = require('../domain/TreatmentEntity');


// service class for Pet
class PetService {
    // create pet
    async createPet(pet) {

        // check duplicate owner phone + pet name 
        const duplicatePet = await PetModel.findOne({
            name: String(pet.name).trim(),
            'owner.phone': String(pet.owner.phone).trim(),
        }).lean();
        if (duplicatePet) { throw new Error('This pet name already exists.'); }

        // create Pet through PetEntity
        const entityPet = new PetEntity(pet);
        const createdPet = await PetModel.create(entityPet.toObject());
        return createdPet.toObject();
    }

    // get all pets
    async getPets() {
        const pets = await PetModel.find({}).lean();
        if (!pets.length) throw new Error('No pet exist. Please add new pet.');
        // retrieve pets from db
        return pets;
    }

    // get pet by id
    async getPetById(id) {
        const pet = await PetModel.findById(id).lean();
        if (!pet) throw new Error('Pet not found');
        // retrieve pet from db
        return pet;
    }

    // update pet
    async updatePet(id, newInfo = {}) {
        const existInfo = await PetModel.findById(id).lean();
        if (!existInfo) throw new Error('Pet not found');

        // merge existInfo + newInfo
        const merged = {
            ...existInfo,
            ...newInfo,
            owner: { ...(existInfo.owner || {}), ...(newInfo.owner || {}) },
            _id: existInfo._id, // unchange id
        };

        // create PetEntity to validate merged data
        const entityPet = new PetEntity(merged);

        // update pet in DB
        const updatedPet = await PetModel.findByIdAndUpdate(
            id,
            entityPet.toObject(),
            { new: true, runValidators: true, overwrite: true }
        ).lean();
        return updatedPet;
    }
    // delete pet
    async deletePet(id) {
        const pet = await PetModel.findById(id).lean();
        if (!pet) throw new Error('Pet not found');
        await PetModel.deleteOne({ _id: id });
        return { message: 'Pet deleted' };
    }
}

// service class for Treatment
class TreatmentService {

    // create treatment
    async createTreatment(treatment) {
        const pet = await PetModel.findById(treatment.petId).lean();
        if (!pet) throw new Error('Pet not found');

        // create treatment instance to get treatment data
        const entityTreatment = new TreatmentEntity(treatment);
        console.log(entityTreatment)
        console.log("debug", entityTreatment.toObject())
        // remove id from object to prepare for create
        const { _id, ...payload } = entityTreatment.toObject();

        // create treatment in DB
        const createdTreatment = await TreatmentModel.create(payload);
        return createdTreatment.toObject();
    }

    // get treatments by pet
    async getTreatmentsByPet(petId) {
        const pet = await PetModel.exists({ _id: petId });
        if (!pet) throw new Error('Pet not found');

        // retrieve treatments from DB
        return await TreatmentModel.find({ petId }).sort({ date: -1, _id: -1 }).lean();
    }

    // delete treatment
    async deleteTreatment(id) {
        const treatment = await TreatmentModel.findById(id).lean();
        if (!treatment) throw new Error('Treatment not found');
        await TreatmentModel.deleteOne({ _id: id });
        return { message: 'Treatment deleted' };
    }
}

module.exports = {
    PetService: new PetService(),
    TreatmentService: new TreatmentService(),
};
