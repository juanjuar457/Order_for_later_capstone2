const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const morgan = require("morgan"); 
const {PORT, DATABASE_URL} = require('./config');
const routes = require('./routes');
const mongoose = require("mongoose"); 
app.use(morgan('common'));
app.use(bodyParser.json());

mongoose.Promise = global.Promise;

app.use(express.static('public')); // for serving static files in express

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//>>>>>>>>>ENDPOINTS <<<<<<<<<<<<<<<<<<<<<<<
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
app.get('/materials', routes.getMaterials); 

//>>>>>>>>>NOT IN USE IN NODE CAPSTONE - FROM CLEINT SIDE 4/22<<<<<<<<<<<<<<<<<<<<
app.get('/material/:id', routes.getMaterial);

app.post('/savematerial', routes.postMaterial);

app.put('/togglebackorder', routes.toggleBackorder);

app.delete('/deletematerial/:id', routes.deleteMaterial);

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
