const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const morgan = require("morgan"); 
const mongoose = require("mongoose"); 
const {PORT, DATABASE_URL} = require('./config');
const models = require('./models'); 
const Material = models.Material;
const User = models.User; 

app.use(morgan('common'));
app.use(bodyParser.json());

mongoose.Promise = global.Promise;

app.use(express.static('public')); // for serving static files in express

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//>>>>>>>>>GET ENDPOINTS <<<<<<<<<<<<<<<<<<<
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

app.get('/materials', (req, res) => {
	Material
	.find()
	.limit(1000)
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

//>>>>>>>>>NOT IN USE IN NODE CAPSTONE - FROM CLEINT SIDE 4/22<<<<<<<<<<<<<<<<<<<<
app.get('/materials/:id', (req, res) => {
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

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//>>>>>>>>>POST ENDPOINTS <<<<<<<<<<<<<<<<<<
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  

app.post('/materials', (req, res) => {
  console.log(req.body);
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

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//>>>>>>>>>PUT ENDPOINTS <<<<<<<<<<<<<<<<<<<
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  

app.put('/materials', (req, res) => {
  console.log(req.body);
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

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//>>>>>>>>>DELETE ENDPOINTS <<<<<<<<<<<<<<<<
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> 

app.delete('/materials/:id', (req, res) => {
  console.log('delete materials', req.params.id);
  Material
    .findByIdAndRemove(req.params.id)
    .exec()
    .then(() => {
      res.status(204).json({message: 'success'});
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'something went terribly wrong'});
    });
});

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//>>>>>>>>>RUN/CLOSE SERVER <<<<<<<<<<<<<<<<
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> 

let server;

// this function connects to our database, then starts the server
function runServer(databaseUrl=DATABASE_URL, port=PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Order For Later is listening on port ${port}`);
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}

//closeServer returns promise, we use for testing later...
function closeServer() {
  return mongoose.disconnect().then(() => {
     return new Promise((resolve, reject) => {
       console.log('Closing server');
       server.close(err => {
           if (err) {
               return reject(err);
           }
           resolve();
       });
     });
  });
}

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = {runServer, app, closeServer};
