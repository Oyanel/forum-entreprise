'use strict';
let mongoose = require('mongoose'),
    User = mongoose.model('User'),
    bcrypt = require('bcrypt-nodejs'),
    config = require('../../config'),
    jwt = require('jsonwebtoken');


/**
 * List all users
 *
 * @param req
 * @param res
 */
exports.list_users = (req, res) => {
    User.find({}, (err, user) => {
        if (err)
            res.send(err);
        res.json(user);
    });
};

/**
 * Create a user
 *
 * @param req
 * @param res
 */
exports.create_user = (req, res) => {
    let new_user = new User(req.body);
    new_user.save((err, user) => {
        if (err)
            res.send(err);
        res.json(user);
    });
};

/**
 * Get a user from id
 *
 * @param req
 * @param res
 */
exports.get_user = (req, res) => {
    User.findById(req.params.userId, (err, user) => {
        if (err)
            res.send(err);
        delete user.password;
        res.json(user);
    });
};

/**
 * Update a user
 *
 * @param req
 * @param res
 */
exports.update_user = (req, res) => {
    User.findOneAndUpdate({_id: req.params.userId}, req.body, {new: true}, (err, user) => {
        if (err)
            res.send(err);
        res.json(user);
    });
};


/**
 * Delete a user
 *
 * @param req
 * @param res
 */
exports.delete_user = (req, res) => {
    User.deleteOne({
            _id: req.params.userId
        },
        (err, user) => {
            if (err)
                res.send(err);
            res.json({message: 'User supprimé'});
        });
};

/**
 *
 * @param req
 * @param res
 */
exports.login = function (req, res) {
    User.findOne({
        email: req.body.email
    }, function (err, user) {

        if (err)
            res.send(err);

        if (!user)
            res.json({success: false, message: 'Authentication failed. User not found.'});

        // check if password matches
        if (!validPassword(req.body.password, user.password))
            res.json({success: false, message: 'Authentication failed. Wrong password.'});

        delete user.password;

        let token = jwt.sign({id: user._id}, config.token.secretKey);

        // return the information including token as JSON
        res.json({
            success: true,
            user: user,
            token: token
        });
    });

    /**
     * validate password
     *
     * @param password
     * @param userPassword
     * @returns {*}
     */
    function validPassword(password, userPassword) {
        return bcrypt.compareSync(password, userPassword);
    }
};

/**
 *
 * @param user_id
 * @returns {Promise<boolean>}
 */
exports.isAdmin = async function (user_id) {
    let user = await User.findOne({
        _id: user_id
    }, (err, user) => {
        if (err)
            return false;
        return user;
    });
    return Promise.resolve(user.user_type.localeCompare('Administrator') === 0);
};
