'use strict';
let mongoose = require('mongoose'),
    Schema = mongoose.Schema;


let CompanySchema = new Schema({
    _id: {
        type: Schema.ObjectId,
        required: true,
        auto: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    job_offer: {
        type: Array
    }
});

module.exports = mongoose.model('Company', CompanySchema);