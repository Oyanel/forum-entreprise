'use strict';
let mongoose = require('mongoose');
let Schema = mongoose.Schema;


let MeetingSchema = new Schema({
    _id: {
        type: Schema.ObjectId,
        required: true,
        auto: true
    },
    start_date: {
        type: Date,
        required: true,
        default: Date.now()
    },
    end_date: {
        type: Date,
        required: true,
        default: Date.now()
    },
    applicant: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    description: {
        type: String
    },
    room: {
        type: String,
        required: true,
        default: "None"
    }

});

module.exports = mongoose.model('Meeting', MeetingSchema);