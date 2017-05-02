//SERVER JS NOTES 

//alt way of doing body parser 
// app.use(jsonParser);
// const routes = require("./routes");  //junkroutes at the moment.. 4/13 
// const jsonParser = require("body-parser").json();
//how would you add code to highlight a material on the client?? 
// app.put('/materials', (req, res) => {
//   console.log(req.body);
//   res.json(req.body.name).end();
//   // Material
//   // res.json({response: "material on back order"})
//   //   .findOneAndUpdate({_id: id},{ $set: { onBackOrder: query.body.data.onBackOrder}}, )
//   //   .exec()
//   //   .then(material =>res.json(material.apiRepr()))
//   //   .catch(err => {
//   //     console.error(err);
//   //       res.status(500).json({message: 'Internal server error'})
//   //   });
// });

//look up PUT endpoints, look at all the ex's if not sure still... d
//need callback, as far as the args, not sure how they are arranged.. confusing since ex's are in 
//ES5 not ES6... 

//mongoose docs for example of PUT 
  // if a model is passed in instead of an id

//   if (id instanceof Document) {
//     id = id._id;
//   }

//   return this.findOneAndUpdate.call(this, {_id: id}, update, options, callback);
// };
//thinkful example for put's 
// app.put('/posts/:id', (req, res) => {
//   if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
//     res.status(400).json({
//       error: 'Request path id and request body id values must match'
//     });
//   }

//   const updated = {};
//   const updateableFields = ['title', 'content', 'author'];
//   updateableFields.forEach(field => {
//     if (field in req.body) {
//       updated[field] = req.body[field];
//     }
//   });

//   BlogPost
//     .findByIdAndUpdate(req.params.id, {$set: updated}, {new: true})
//     .exec()
//     .then(updatedPost => res.status(201).json(updatedPost.apiRepr()))
//     .catch(err => res.status(500).json({message: 'Something went wrong'}));
// });

// using CORS for temporary sol to the browser from the DB SOL 
// app.use( (req,res,next) => {
//   res.header("Access-Control-Allow-Origin", "*"); //could put a list of ip or domain names.
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
//   if(req.method === "OPTIONS"){
//     res.header("Access-Control-Allow-Methods", "PUT,POST,DELETE");
//     return res.status(200).json({});
//   }
//   next();
// });

//POST EXAMPLE >> REFACTOR ME!! 
// app.put('/posts/:id', (req, res) => {
//   if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
//     res.status(400).json({
//       error: 'Request path id and request body id values must match'
//     });
//   }

//   const updated = {};
//   const updateableFields = ['title', 'content', 'author'];
//   updateableFields.forEach(field => {
//     if (field in req.body) {
//       updated[field] = req.body[field];
//     }
//   });

//   BlogPost
//     .findByIdAndUpdate(req.params.id, {$set: updated}, {new: true})
//     .exec()
//     .then(updatedPost => res.status(201).json(updatedPost.apiRepr()))
//     .catch(err => res.status(500).json({message: 'Something went wrong'}));
// });

// app.listen(process.env.PORT || 8080, () => {
//   console.log(`Order for later is listening on port: ${process.env.PORT || 8080}`);
// })



// >>>>>>>>NOTE!!! <<<<<<<<<<<<<<<<<<
//Express must parse incoming JSON with middleware!! it can't do it on its own! 

//also will need the users model...

// app.use(logger("dev")); //configures middlware for color codes in our api respones. 


//capstone 2 notes fix me later 4/14 - JJ

//error occurs, express finds 1st error handling middleware
//catch 404 and forward to error handler. 

//OUR OLD POST REQ 
    // $.post(url, JSON.stringify(material),  //just trying to get it to work, this is the post call we did the other night...
    //    function() { 
    //     state.requested_materials.push(material);
    //     render_material_list(); 
    //     console.log(state.requested_materials)
    // }
    //     );


//error handler -- they have 4 params!!!  
// app.use((err,req,res,next) => {
// 	res.status(err.status || 500)
// 	res.json({
// 		error: {
// 			message: err.message
// 		}
// 	});
// })

// app.use((req,res,next) => {
// 	if(req.body){
// 		console.log("the sky is", req.body.color);
// 	} else {
// 		console.log("there is no body property on the request"); 
// 	}
// }); 

//using middleware in epxress Making a REST api.. stupid gomix
// app.use((req,res,next) => {
// 	console.log("first Piece of middleware"); 
// 	next();
// });

//QQQ: will our app even need id??? 
// app.use("/different/:id", (req,res,next) => {
// 	console.log("Second Piece of middleware, ID:", req.params.id); 
// 	next();
// });



//adding route as 2nd param. 

//>>>>>filler get request to test
// app.get("/materials", (req, res) => {
// 	res.json({response: "You sent me a GET request"}); 
// });

//>>>>>>>>>>Accepting Data example <<<<<<<<<<
// let jsonCheck = ((req,res,next) => {
// 	if(req.body){
// 		console.log("the sky is", req.body.color);
// 	} else {
// 		console.log("there is no body property on the request"); 
// 	}
// 	next(); 
// }); 

// app.use(jsonCheck);


// app.use(function(req,res, next){
// 	if(req.body){
// 		console.log("The sky is", req.body.color );
// 	} else {
// 		console.log("There is no body property on the request"); 
// 	}	 
// 	next(); 
// });

// app.use((req,res,next) => {
// 	if(req.body){
// 		console.log("the sky is", req.body.color);
// 	} else {
// 		console.log("therre is no body property on the request"); 
// 	}
// });


// app.use((req, res, next) => {
// 	console.log("poopie"); 
// });

//by default browsers cannot dynamically make requests from 1 domain to another
//this allowed the browser to control the db, need the right ajax call though...
//need explicit permission by the api.. 
//didn't adjust to es6 syntax... 
//good CORS EXample 
// app.use( (req,res,next) => {
//   res.header("Access-Control-Allow-Origin", "*"); //could put a list of ip or domain names.
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
//   if(req.method === "OPTIONS"){
//     res.header("Access-Control-Allow-Methods", "PUT,POST,DELETE");
//     return res.status(200).json({});
//   }
//   next();
// });



//4/21 notes + extra comments. 
//POST EXAMPLE >> REFACTOR ME!! 
// app.put('/posts/:id', (req, res) => {
//   if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
//     res.status(400).json({
//       error: 'Request path id and request body id values must match'
//     });
//   }

//   const updated = {};
//   const updateableFields = ['title', 'content', 'author'];
//   updateableFields.forEach(field => {
//     if (field in req.body) {
//       updated[field] = req.body[field];
//     }
//   });

//   BlogPost
//     .findByIdAndUpdate(req.params.id, {$set: updated}, {new: true})
//     .exec()
//     .then(updatedPost => res.status(201).json(updatedPost.apiRepr()))
//     .catch(err => res.status(500).json({message: 'Something went wrong'}));
// });

// app.listen(process.env.PORT || 8080, () => {
//   console.log(`Order for later is listening on port: ${process.env.PORT || 8080}`);
// })



// >>>>>>>>NOTE!!! <<<<<<<<<<<<<<<<<<
//Express must parse incoming JSON with middleware!! it can't do it on its own! 

//also will need the users model...

// app.use(logger("dev")); //configures middlware for color codes in our api respones. 

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
// if (require.main === module) {
//   runServer().catch(err => console.error(err));
// };

// module.exports = {runServer, app, closeServer};


//>>>>>>>>>>>>>>>>>>>>>>>>>>>> 4/17 issues and kill list
//storing multiple db's ??? 
//QQQ how to have a db for materials and db for user-login info??? Do we manage that from the config??? 
//need to add a get/materials ajax call to refresht the page, every so often?? like a reverse timeout? Possibly more elegant sol? 
//NO ID IS RETURNED FROM THE DB AFTER POST REQ! 
//POST IS FINALLY RETURNING 200'S WOOT
//CHECK THE REQS HOW MUCH NEEDS TO BE BUILT OUT FOR THE LOGIN PART, NOT REQURIED FOR THE NODE CAPSTONE, HOLD FOR LATER, ONCE REACT IS IN....
//STILL GOTTA FIX THAT DEL CALL, AND ADD THE PUT... MAYBE USE A PUT FOR THE PAGE RELOAD??? 



