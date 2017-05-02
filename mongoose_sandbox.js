'use strict'; 

const mongoose = require("mongoose"); 
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/sandbox");

const db = mongoose.connection; 
//probablhy have to re do this w/ promisises 
db.on("error", (err) => {
	console.error("connection error;", err);
}); //listen to error event with on method

db.once("open", () => {
	console.log("db connection successful");
	//all db comms goes here 
//trying to load the defaults
	const Schema = mongoose.Schema;
	const MaterialSchema = new Schema({
		vendor: {type: String, default: "B & B Pharma"},
		quantity: {type: String, default: "1"},
		product_name: {type: String, default: "Testosterone"}, 
		catalog_number: {type: String, default: "14345634J175"}, //most cat numbers have letters 
		unit_size: {type: String, default: "2"}, 
		units: {type: String, default: "KG"}
	})

	const Material = mongoose.model("Material", MaterialSchema);

	const taurine = new Material({
		vendor: "Medisca",
		quantity: "1",
		product_name: "Taurine",
		catalog_number: "5678BB1",
		unit_size: "1000",
		units: "KG"
	})

	const material = new Material({}); //testosterone

	taurine.save((err) => {
		if (err) console.error("Save Failed.", err);
		else console.log("saved!");
		db.close(  () => {
			console.log("db connection closed");
		}); 
	}); 

}); 
















