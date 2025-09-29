const chai = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');

const { expect } = chai;

const {
    createPet,
    getPets,
    updatePet,
    deletePet,
} = require('../controllers/petController');

const { PetService } = require('../services/petService');
const { AdminOnlyProxy } = require('../patterns/AdminProxy');
const { UserFactory } = require('../patterns/UserFactory');

afterEach(() => sinon.restore());

//Test Create Pet

describe('Create Pet', () => {
    it('should create a new pet successfully', async() => {
        const req = { body: { name: 'Test name', species: 'Test species', owner: { name: 'Test owner', phone: '123'}}};
        const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

        sinon.stub(PetService, 'createPet').resolves({ _id: new mongoose.Types.ObjectId(), ...req.body });

        await createPet(req, res);

        expect(res.status.calledWith(201)).to.be.true;
        expect(res.json.calledOnce).to.be.true;
    });

    it('should return 400 on error', async () => {
        const req = { body: {} };
        const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

        sinon.stub(PetService, 'createPet').throws(new Error('DB Error'));

        await createPet(req, res);

        expect(res.status.calledWith(400)).to.be.true;
        expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
    });
});

// Test Get Pets
describe('Get Pets', () => {
    it('should return pets successfully', async () => {
        const req = {};
        const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
        const pets = [
            { _id: new mongoose.Types.ObjectId(), name: 'Test Name', species: 'Test Species'},
            { _id: new mongoose.Types.ObjectId(), name: 'Test Name 2', species: 'Test Species'},
        ];

        sinon.stub(PetService, 'getPets').resolves(pets);

        await getPets(req, res);
        
        expect(res.json.calledWith(pets)).to.be.true;
    });

    it('should return 500 and on error', async () => {
        const req = {};
        const res = { status: sinon.stub().returnsThis(), json: sinon.spy()};

        sinon.stub(PetService, 'getPets').throws(new Error('DB Error'));

        await getPets(req,res);
        
        expect(res.json.calledWith([])).to.be.true; // because controller code
    });
});

// Test Update Pet

describe('Update Pet', () => {
    it('should update pet successfully', async () => {
        const id = new mongoose.Types.ObjectId();
        const req = { params: { id }, body: { name: 'Updated Name'}};
        const res = { status: sinon.stub().returnsThis(), json: sinon.spy()};
        const updatedPet = { _id: id, name: 'Updated Name'};

        sinon.stub(PetService, 'updatePet').resolves(updatedPet);

        await updatePet(req, res);

        expect(res.json.calledWith(updatedPet)).to.be.true;
    });

    it('should return 400 on unexpected error', async() => {
        const req = { params: { id: new mongoose.Types.ObjectId()}, body: {}};
        const res = { status: sinon.stub().returnsThis(), json: sinon.spy()};

        sinon.stub(PetService, 'updatePet').throws(new Error('DB Error'));

        await updatePet(req, res);

        expect(res.status.calledWith(400)).to.be.true;
        expect(res.json.calledWithMatch({message: 'DB Error'})).to.be.true
    });
});


// Test Delete Pet
describe('Delete Pet', () => {
    it('should delete pet successfully for admin', async() => {
        const id = new mongoose.Types.ObjectId().toString();
        const req = { params: { id }, user: { role: 'admin' }};
        const res = { status: sinon.stub().returnsThis(), json: sinon.spy()};

        const actor = { role: 'admin'};
        sinon.stub(UserFactory, 'fromDB').returns(actor);
        sinon.stub(AdminOnlyProxy.prototype, 'deletePet').resolves({message: 'Pet deleted'});

        await deletePet(req, res);

        expect(res.json.calledWith({message: 'Pet deleted'})).to.be.true;
    });

    it('should return 400 if delete fails', async() => {
        const id = new mongoose.Types.ObjectId().toString();
        const req = { params: { id }, user: { role: 'admin' }};
        const res = { status: sinon.stub().returnsThis(), json: sinon.spy()};

        const actor = { role: 'admin'};
        sinon.stub(UserFactory, 'fromDB').returns(actor);
        sinon.stub(AdminOnlyProxy.prototype, 'deletePet').resolves({message: 'DB Error'});

        await deletePet(req,res);

        expect(res.json.calledWithMatch({message: 'DB Error'})).to.be.true;
    });

    it('should return 400 if user is not admin', async() => {
        const id = new mongoose.Types.ObjectId().toString();
        const req = { params: { id }, user: { role: 'user' }};
        const res = { status: sinon.stub().returnsThis(), json: sinon.spy()};

        const actor = { role: 'user'};
        sinon.stub(UserFactory, 'fromDB').returns(actor);
        sinon.stub(AdminOnlyProxy.prototype, 'deletePet').resolves({message: 'Only admin can delete'});

        await deletePet(req,res);

        expect(res.json.calledWithMatch({message: 'Only admin can delete'})).to.be.true;
    });
});