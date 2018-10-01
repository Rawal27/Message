
 const Input = require('../models/input.model.js');

 exports.insert = (req, res) => {

 };


 // Create and Save a new Note
exports.create = (req, res) => {


};

   


// Retrieve and return all inputs from the database.
exports.findAll = (req, res) => {
    Input.find()
    .then(input => {
        res.send(input);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving all inputs."
        });
    });
};
