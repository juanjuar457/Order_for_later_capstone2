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

  // for (let i=1; i<=10; i++) {
  //   seedData.push(generateMaterialData());
  // }
  // this will return a promise
  return Material.insertMany(seedData);
}

function generateVendor() {
	console.log('got to vendor')
	const vendor = ["Medisca", "Letco", "B & B Pharma"]
	return vendor[Math.floor(Math.random() * vendor.length)]; 
}

function generateQuantity(){
	console.log('gen quantity')
	const quantity = [
	'1', '2','3','4'];
	return quantity[Math.floor(Math.random() * quantity.length)];
}

function generateProductName() {
	const productName = ["Testosterone", "Progesterone", "Pregnenolone"];
	return productName[Math.floor(Math.random() * productName.length)];
}

function generateCatalogNumber() {
	const catalogNumber = ["1234","1234566","1231111"];
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
    product_name: generateProductName(), 
    catalog_number: generateCatalogNumber(),
    unit_size: generateUnitSize(),
    units: generateUnits(), 

	}    
}


function tearDownDb() {
    console.warn('Deleting database');
    // return mongoose.connection.dropDatabase();
}

describe('Material API resource', function() {
	  before(function() {
	    return runServer(DATABASE_URL);
	  });

	  beforeEach(function() {
	    return seedMaterialData();
	  });

	  afterEach(function() {
	    return tearDownDb();
	  });

	  after(function() {
	    return closeServer();
	  })


 // //whole thing is wrapped in a describe, like unit tests examples... 
	describe('DELETE endpoint', function() {
	    it('delete a material by id', function() {
	      let material;
	      return Material
	        .findOne()
	        .exec()
	        .then(function(_material) {
	          material = _material;
            console.log(material);
	          return chai.request(app).delete(`/materials/${material._id}`);
	        })
	        .then(function(res) {
	          res.should.have.status(204);
	          return Material.findById(Material.id).exec();
	        })
	        .then(function(_material) {
	          // when a variable's value is null, chaining `should`
	          // doesn't work. so `_restaurant.should.be.null` would raise
	          // an error. `should.be.null(_restaurant)` is how we can
	          // make assertions about a null value.
	          should.not.exist(_material);
	        })
	    })    
	})
	//***** pick up here DON't FORGET POST!!!!! should be easy! check post in server! 
	 describe('GET endpoint', function() {

    	it('should return all existing materials', function() {
      // strategy:
      //    1. get back all restaurants returned by by GET request to `/restaurants`
      //    2. prove res has right status, data type
      //    3. prove the number of restaurants we got back is equal to number
      //       in db.
      //
      // need to have access to mutate and access `res` across
      // `.then()` calls below, so declare it here so can modify in place
      let res;
      return chai.request(app)
        .get('/materials')
        .then(function(_res) {
          // so subsequent .then blocks can access resp obj.
          res = _res;
          res.should.have.status(200);
          // otherwise our db seeding didn't work
          res.body.materials.should.have.length.of.at.least(1);
          return Material.count();
        })
        .then(function(count) {
          res.body.materials.should.have.length.of(count);
        	});
   		});

    	it('should return materials with right fields', function() {
      // Strategy: Get back all restaurants, and ensure they have expected keys

      let resMaterial;
      return chai.request(app)
        .get('/materials')
        .then(function(res) {
          res.should.have.status(200);
          res.should.be.json;
          res.body.materials.should.be.a('array');
          res.body.materials.should.have.length.of.at.least(1);

          res.body.materials.forEach(function(material) {
            material.should.be.a('object');
            material.should.include.keys(
              'id', 'vendor', 'quantity', 'product_name', 'catalog_number', 'unit_size', 'units');
          });
          resMaterial = res.body.materials[0];
          return Material.findById(resMaterial.id);
        })
        .then(function(material) {

          resMaterial.id.should.equal(material.id);
          resMaterial.vendor.should.equal(material.vendor);
          resMaterial.quantity.should.equal(material.quantity);
          resMaterial.product_name.should.equal(material.product_name);
          resMaterial.catalog_number.should.equal(material.catalog_number);
          resMaterial.unit_size.should.equal(material.unit_size);
          resMaterial.units.should.equal(material.units);
        	});
   		 });
  	});
    describe('PUT endpoint', function() {
    it('should update material with onBackOrder', function() {
      var updateData = null;
      return Material
      .findOne()
      .exec()
      .then(function(material) {
        updateData = material.apiRepr();
        updateData.onBackOrder = !updateData.onBackOrder
        return chai.request(app)
          .put('/materials') //alt below
          // .put('/materials/${material.id}')
          .send(updateData); 
      })
      .then(function(res) {
        res.should.have.status(201);
        return Material.findById(updateData.id).exec();     
      })
      then(function(material) {
        material.onBackOrder.should.equal(!updateData.onBackOrder);
      });
    });
  });
	 //   describe('POST endpoint test ', function() {
  //   // strategy: make a POST request with data,
  //   // then prove that the restaurant we get back has
  //   // right keys, and that `id` is there (which means
  //   // the data was inserted into db)
  //   it('should add a new material', function() {

  //     const newMaterial = generateMaterialData();
  //     let mostRecentGrade;

  //     return chai.request(app)
  //       .post('/materials')
  //       .send(newMaterial)
  //       .then(function(res) {
  //         res.should.have.status(201);
  //         res.should.be.json;
  //         res.body.should.be.a('object');
  //         res.body.should.include.keys(
  //           'id', 'vendor', 'quantity', 'product_name', 'catalog_number', 'unit_size','units');
  //                 // cause Mongo should have created id on insertion
  //         res.body.id.should.not.be.null;
  //         res.body.vendor.should.equal(newMaterial.vendor);
  //         res.body.quantity.should.equal(newMaterial.quantity);
  //         res.body.product_name.should.equal(newMaterial.product_name);
  //         res.body.catalog_number.should.equal(newMaterial.catalog_number);
  //         res.body.unit_size.should.equal(newMaterial.unit_size);
  //         res.body.units.should.equal(newMaterial.units);
  //         return Material.findById(res.body.id);
  //       })
  //       .then(function(material) {
  //         material.vendor.should.equal(newMaterial.vendor);
  //         material.quantity.should.equal(newMaterial.quantity);
  //         material.product_name.should.equal(newMaterial.product_name);
  //         material.catalog_number.should.equal(newMaterial.catalog_number);
  //         material.unit_size.should.equal(newMaterial.unit_size)
  //         material.units.should.equal(newMaterial.units)
  //       });
  //   });
  // });
}); 
	//everything is wrapped in the 1st describe from the top! 
	//**************PUT TEST 	
	//should it have update data with everything?? 
	//we're adding onBackOrder with the dom logic function on the client... doing ajax 
	//call inside! 

