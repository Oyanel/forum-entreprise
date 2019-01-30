'use strict';
let mongoose = require('mongoose');
let Schema = mongoose.Schema;


let UserSchema = new Schema({
    _id: {
        type: Schema.ObjectId,
        required: true,
        auto: true,
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    account: {
        type: Object,
        required: true,
        default: {}
    },
    user_type: {
        type: String,
        required: true,
        enum: ['Applicant', 'Company','Administrator']
    },
});

module.exports = mongoose.model('User', UserSchema);