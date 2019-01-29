'use strict';
let mongoose = require('mongoose');
let Schema = mongoose.Schema;


let CompanySchema = new Schema({
    id: {
        type: Number,
        required: 'Identifiant manquant'
    },
    name: {
        type: String,
        required: 'Entrez le nom de votre Entreprise'
    },
    description: {
        type: String
    },
    job_offer: {
        type: Array
    }
});

module.exports = mongoose.model('Company', CompanySchema);