'use strict';
let mongoose = require('mongoose'),
    Applicant = mongoose.model('Applicant');

/**
 * List all applicants
 *
 * @param req
 * @param res
 */
exports.list_applicants = (req, res) => {
    Applicant.find({}, (err, applicant) => {
        if (err)
            res.send(err);
        res.json(applicant);
    });
};

/**
 * Create a applicant
 *
 * @param req
 * @param res
 */
exports.create_applicant = (req, res) => {
    let new_applicant = new Applicant(req.body);
    new_applicant.save((err, applicant) => {
        if (err)
            res.send(err);
        res.json(applicant);
    });
};

/**
 * Get a applicant from id
 *
 * @param req
 * @param res
 */
exports.get_applicant = (req, res) => {
    Applicant.findById(req.params.applicantId, (err, applicant) => {
        if (err)
            res.send(err);
        res.json(applicant);
    });
};

/**
 * Update a applicant
 *
 * @param req
 * @param res
 */
exports.update_applicant = (req, res) => {
    Applicant.findOneAndUpdate({_id: req.params.applicantId}, req.body, {new: true}, (err, applicant) => {
        if (err)
            res.send(err);
        res.json(applicant);
    });
};


/**
 * Delete a applicant
 *
 * @param req
 * @param res
 */
exports.delete_applicant = (req, res) => {
    Applicant.deleteOne({
            _id: req.params.applicantId
        },
        (err) => {
            if (err)
                res.send(err);
            res.json({message: 'Entreprise supprimée'});
        });
};


