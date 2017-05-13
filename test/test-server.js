const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker'); //manually put stuff for the diff params, don't need??
const mongoose = require('mongoose');

// this makes the should syntax available throughout
// this module
const should = chai.should();

const {Material} = require('../models');
const {app, runServer, closeServer} = require('../server');
const {DATABASE_URL} = require('../config');
//need to use test DB?? I nuked my whole db with delete test!!! 
chai.use(chaiHttp);


function seedMaterialData() {
    console.info('seeding Material data');
    const seedData = [];
    return Material.insertMany(seedData);
}

function generateVendor() {
    console.log('got to vendor')
    const vendor = ["Medisca", "Letco", "B & B Pharma"]
    return vendor[Math.floor(Math.random() * vendor.length)];
}

function generateQuantity() {
    console.log('gen quantity')
    const quantity = [
        '1', '2', '3', '4'];
    return quantity[Math.floor(Math.random() * quantity.length)];
}

function generateProductName() {
    const productName = ["Testosterone", "Progesterone", "Pregnenolone"];
    return productName[Math.floor(Math.random() * productName.length)];
}

function generateCatalogNumber() {
    const catalogNumber = ["1234", "1234566", "1231111"];
    return catalogNumber[Math.floor(Math.random() * catalogNumber.length)];
}

function generateUnitSize() {
    const unitSize = ["1000", "1", "10"];
    return unitSize[Math.floor(Math.random() * unitSize.length)];
}

function generateUnits() {
    const units = ["grams", "killograms", "milliliters"];
    return units[Math.floor(Math.random() * units.length)];
}
//note how the functions call other functions to about the module to execute the tests...
//to execute on the tests...
function generateMaterialData() {
    return {
        vendor: generateVendor(), //not sure whats up with the faker npm!
        quantity: generateQuantity(), //make function for this  
        productName: generateProductName(),
        catalogNumber: generateCatalogNumber(),
        unitSize: generateUnitSize(),
        units: generateUnits(),

    }
}


function tearDownDb() {
    console.warn('Deleting database');
    // return mongoose.connection.dropDatabase();
}

describe('Material API resource', function () {
    before(function () {
        return runServer(DATABASE_URL);
    });

    beforeEach(function () {
        return seedMaterialData();
    });

    afterEach(function () {
        return tearDownDb();
    });

    after(function () {
        return closeServer();
    })

    describe('DELETE endpoint', function () {
        it('delete a material by id', function () {
            let material;
            return Material
                .findOne()
                .exec()
                .then(function (_material) {
                    material = _material;                    
                    return chai.request(app).delete(`/deletematerial/${material._id}`);
                })
                .then(function (res) {
                    res.should.have.status(204);
                    return Material.findById(material.id).exec();
                })
                .then(function (_material) {

                    should.not.exist(_material);
                })
        })
    });

    describe('GET endpoint', function () {
        it('should return all existing materials', function () {
            let res;
            return chai.request(app)
                .get('/materials')
                .then(function (_res) {
                    res = _res;
                    res.should.have.status(200);
                    res.body.materials.should.have.length.of.at.least(1);
                    return Material.count();
                })
                .then(function (count) {
                    res.body.materials.should.have.length.of(count);
                });
        });
        it('should return materials with right fields', function () {
            let resMaterial;
            return chai.request(app)
                .get('/materials')
                .then(function (res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.materials.should.be.a('array');
                    res.body.materials.should.have.length.of.at.least(1);
                    res.body.materials.forEach(function (material) {
                        material.should.be.a('object');
                        material.should.include.keys(
                            'id', 'vendor', 'quantity', 'productName', 'catalogNumber', 'unitSize', 'units');
                    });
                    resMaterial = res.body.materials[0];
                    return Material.findById(resMaterial.id);
                })
                .then(function (material) {
                    resMaterial.id.should.equal(material.id);
                    resMaterial.vendor.should.equal(material.vendor);
                    resMaterial.quantity.should.equal(material.quantity);
                    resMaterial.productName.should.equal(material.productName);
                    resMaterial.catalogNumber.should.equal(material.catalogNumber);
                    resMaterial.unitSize.should.equal(material.unitSize);
                    resMaterial.units.should.equal(material.units);
                });
        });
    });
    describe('PUT endpoint', function () {
        it('should update material with onBackOrder', function () {
            var updateData = null;
            var material = null;
            return Material
                .findOne()
                .exec()
                .then(function (_material) {
                    updateData = _material.apiRepr();
                    material = _material.apiRepr();
                    updateData.onBackOrder = !updateData.onBackOrder
                    return chai.request(app)
                        .put('/togglebackorder')
                        .send(updateData);
                })
                .then(function (res) {
                    res.should.have.status(201);
                    return Material.findById(updateData.id).exec();
                })
                .then(function (_material) {
                    material.onBackOrder.should.equal(!_material.onBackOrder);
                });
        });
    });
}); 