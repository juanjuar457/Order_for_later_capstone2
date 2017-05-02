'use strict';

const mongoose = require("mongoose");
const Schema = mongoose.Schema; 


const MaterialSchema = Schema({
	vendor: String, 
	quantity: String, //sometimes they have '3UI' for units 
	product_name: String, 
	catalog_number: String, 
	unit_size: String, 
	units: String,
	createDate: {type: Date, default: Date.now}, 
  onBackOrder: Boolean 
});

//not sure how to structre this? ALso don't we need an env file??? 

const UserSchema = Schema({
	name: String,
	organization: String
});

//may not need these login schemas check later
const AdminLoginSchema = Schema({
	user: String, //maybe a boolean??
	password: String
});

const GuestLoginSchema = Schema({ 
	organization: String,
	passcode: Number
});

MaterialSchema.methods.apiRepr = function() {
  return {
    id: this._id,
    vendor: this.vendor,
    quantity: this.quantity,
    product_name: this.product_name,
    catalog_number: this.catalog_number,
    unit_size: this.unit_size,
    units: this.units,
    createdDate: this.createdDate,
    onBackOrder: this.onBackOrder
  };
}
//not in use in node capstone 4/26
UserSchema.methods.apiRepr = function() {
  return {
    id: this._id,
    name: this.name,
    organization: this.organization
  };
}

//how many shcema models??? also need passwords?? 

const Material = mongoose.model("materials", MaterialSchema);

const User = mongoose.model("users", UserSchema);
module.exports = {Material};
// module.exports.models = {Material,User};  //Es6 short hand prop short hand. 
