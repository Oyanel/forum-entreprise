'use strict';
let mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    generator = require('generate-password'),
    bcrypt = require('bcrypt-nodejs');
const {Mailer} = require('../helper/mailer');

let UserSchema = new Schema({
    _id: {
        type: Schema.ObjectId,
        required: true,
        auto: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    account: {
        type: Object,
        required: true
    },
    wish_list: {
        type: Array,
        default: [{}]
    },
    user_type: {
        type: String,
        required: true,
        enum: ['Applicant', 'Company', 'Administrator']
    },
});

UserSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

UserSchema.pre('save', function (next) {
    let user = this;

    this.password = generator.generate({
        length: 10,
        numbers: true
    });
    Mailer.sendPassword(this.email, Mailer.PASSWORD_REQUEST, this.password);

    if (user.password) {
        this.password = UserSchema.methods.generateHash(user.password);
    }
    next();
});

module.exports = mongoose.model('User', UserSchema);
