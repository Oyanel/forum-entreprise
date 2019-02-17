'use strict';
let mongoose = require('mongoose'),
    Schema = mongoose.Schema;


let ApplicantSchema = new Schema({
    _id: {
        type: Schema.ObjectId,
        required: true,
        auto: true,
    },
    last_name: {
        type: String,
        required: true
    },
    first_name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    cv: {
        type: String
    }
});

module.exports = mongoose.model('Applicant', ApplicantSchema);