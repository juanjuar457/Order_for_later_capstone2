
const mongoose = require("mongoose"); 
const models = require('./models'); 
const Material = models.Material;
const User = models.User; 


module.exports = {
    deleteMaterial: (req, res) => {
        Material
            .findByIdAndRemove(req.params.id)
            .exec()
            .then(() => {
                res.status(204).json({ message: 'success' });
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({ error: 'something went terribly wrong' });
            });
    },
    getMaterial: (req, res) => {
        Material
            // this is a convenience method Mongoose provides for searching
            // by the object _id property
            .findById(req.params.id)
            .exec()
            .then(material => res.json(material.apiRepr()))
            .catch(err => {
                console.error(err);
                res.status(500).json({ message: 'Internal server error' })
            });
    },
    getMaterials: (req, res) => {
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
                res.status(500).json({ message: 'Internal Server error' });
            });
    },
    postMaterial: (req, res) => {
        const requiredFields = ['vendor', 'quantity', 'productName', 'catalogNumber', 'unitSize', 'units'];
        for (let i = 0; i < requiredFields.length; i++) {
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
                productName: req.body.productName,
                catalogNumber: req.body.catalogNumber,
                unitSize: req.body.unitSize,
                units: req.body.units
            })
            .then(
            material => res.status(201).json(material.apiRepr()))
            .catch(err => {
                console.error(err);
                res.status(500).json({ message: 'Internal server error' });
            });
    },
    toggleBackorder: (req, res) => {
        const requiredFields = ['id', 'onBackOrder'];
        for (let i = 0; i < requiredFields.length; i++) {
            const field = requiredFields[i];
            if (!(field in req.body)) {
                const message = `Missing \ ${field}\` in request body`
                return res.status(400).send(message);
            }
        }

        Material
            .update({
                _id: req.body.id
            },
            {
                $set: {
                    onBackOrder: req.body.onBackOrder
                }
            })
            .exec()
            .then(
            res.status(201).json({ message: 'done' }))
            .catch(err => {
                console.error(message);
                res.status(500).json({ message: 'Internal server error' });

            });
    }
}



