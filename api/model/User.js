'use strict';
let mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt-nodejs');


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
    wish_list: {
        type: Array,
        default: []
    },
    user_type: {
        type: String,
        required: true,
        enum: ['Applicant', 'Company', 'Administrator']
    },
});

UserSchema.methods.generateHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

UserSchema.methods.validPassword = (password) => {
    return bcrypt.compareSync(password, this.password);
};

UserSchema.pre('save', function (next) {
    let user = this;
    if(user.password){
        this.password = UserSchema.methods.generateHash(user.password);
    }
    next();
});

module.exports = mongoose.model('User', UserSchema);
