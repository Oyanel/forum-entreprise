'use strict';
let mongoose = require('mongoose'),
    User = mongoose.model('User');

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
        res.json(user);
    });
};

/**
 * Get a user from id
 *
 * @param req
 * @param res
 */
exports.get_user_detail = (req, res) => {
    User.findById(req.params.userId, (err, user) => {
        if (err)
            res.send(err);

        //res.json(user);
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


