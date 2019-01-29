'use strict';
let mongoose = require('mongoose');
let Schema = mongoose.Schema;


let ApplicantSchema = new Schema({
    id: {
        type: Number,
        required: 'Identifiant manquant'
    },
    last_name: {
        type: String,
        required: 'Entrez votre nom'
    },
    first_name: {
        type: String,
        required: 'Entrez votre prenom'
    },
    description: {
        type: String
    },
    cv: {
        type: String
    }
});

module.exports = mongoose.model('Applicant', ApplicantSchema);