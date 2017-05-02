'use strict'; 
//4/13 this the junk router yo 
const express = require("express"); 
const router = express.Router(); 
const jsonParser = require("body-parser").json;
router.use(jsonParser());
const models = require("./models");

//EX GET 
// GET /materials
// Route for materials collection 
// app.get("/materials", (req, res) => {
// 	res.json({response: "You sent me a GET request"}); 
// });



router.get('/materials/:id', (req, res) => {
  Material
    // this is a convenience method Mongoose provides for searching
    // by the object _id property
    .findById(req.params.id)
    .exec()
    .then(material =>res.json(material.apiRepr()))
    .catch(err => {
      console.error(err);
        res.status(500).json({message: 'Internal server error'})
    });
});


// Get requests to /materials get the materials on the server, max 100 
app.get('/materials', (req, res) => {
	Material
	.find()
	.limit(100)
	.exec()
	.then(materials => {
		res.json({
			materials: materials.map(
				(material) => material.apiRepr())
		}); 
	})
	.catch(
		err => {
			console.error(err); 
			res.status(500).json({message: 'Internal Server error'}); 
		});
}); 

//to post new material on /materials
router.post('/materials', (req, res) => {

	const requiredFields = ['vendor', 'quantity', 'product_name', 'catalog_number', 'unit_size', 'units'];
	for (let i=0; i<requiredFields.length; i++) {
		const field = requiredFields[i];
		if (!(field in req.body)) {
			const message = `Missing \ ${field}\` in request body`
			console.error(message); 
			return res.status(400).send(message); 
		}
	}

	Material
		.create({
			vendor: req.body.vendor,
			quantity: req.body.quantity,
			product_name: req.body.product_name,
			catalog_number: req.body.catalog_number,
			unit_size: req.body.unit_size,
			units: req.body.units})
		.then(
			material => res.status(201).json(material.apiRepr()))
		.catch(err => {
			console.error(err);
			res.status(500).json({message: 'Internal server error'}); 
			});
});


// //POST /materials
// //Route for creating new materials 
// router.post("/adminlogin", (req, res) => {
// 	let username = req.body.username;
// 	let password = req.body.password;
// 	models.User.findOne({
// 		user: username, password
// 	}) //doc looks for user, username and password that was passed in. 
// 	res.json({. //use the apirpr function needed on models + check the .then in the mongoose section.
// 		response: "You sent me a POST request",
// 		body: req.body
// 	}); 
// });

// router.post("/guestlogin", (req, res) => {
// 	let organization = req.body.organization;
// 	let passcode = req.body.passcode;
// 	models.User.findOne({
// 		user: username, password
// 	}) //doc looks for user, username and password that was passed in. 
// 	res.json({. //use the apirpr function needed on models + check the .then in the mongoose section.
// 		response: "You sent me a POST request",
// 		body: req.body
// 	}); 
// });


//PUT /materials/:mID/ordered
//Add color to indicate ordered material, indicate already ordered..
app.put("/:mID/ordered", (req, res) => {
	res.json({
		response: "You sent me a PUT request to /ordered",
		orderedId: req.params.mID,
		body: req.body
	})
})

//DELETE  /materials/:mID/ordered
//Add color to indicate ordered material, indicate already ordered..
router.delete("/materials/:id", (req, res) => {
	Material
		.findByIAndRemove(req.params.id)
		.exec()
		.then(material => res.status(204).end())
		.catch(err => res.status(500).jason({message: 'Internal Server error'})); 
}); 


//need a Delete too! //will be similar to PUT just delete the body: req.body



//not sure how to get ALL the materials we need...
// //GET /materials
// router.get("/5/materials") ????
//should we need a id route for materials for post and put
//if they are all on the same page??? 



module.exports = router; 




