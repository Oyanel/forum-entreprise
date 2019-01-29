'use strict';
let mongoose = require('mongoose'),
    Company = mongoose.model('Company');


/**
 * List all companies
 *
 * @param req
 * @param res
 */
exports.list_companies = (req, res) => {
    Company.find({}, (err, company) => {
        if (err)
            res.send(err);
        res.json(company);
    });
};

/**
 * Create a company
 *
 * @param req
 * @param res
 */
exports.create_company = (req, res) => {
    let new_company = new Company(req.body);
    new_company.save((err, company) => {
        if (err)
            res.send(err);
        res.json(company);
    });
};

/**
 * Get a company from id
 *
 * @param req
 * @param res
 */
exports.get_company = function (req, res) {
    company.findById(req.params.companyId, (err, company) => {
        if (err)
            res.send(err);
        res.json(company);
    });
};

/**
 * Update a company
 *
 * @param req
 * @param res
 */
exports.update_company = (req, res) => {
    company.findOneAndUpdate({_id: req.params.companyId}, req.body, {new: true}, (err, company) => {
        if (err)
            res.send(err);
        res.json(company);
    });
};


/**
 * Delete a company
 *
 * @param req
 * @param res
 */
exports.delete_company = (req, res) => {
    company.remove({
        _id: req.params.companyId
    }, function (err, company) {
        if (err)
            res.send(err);
        res.json({message: 'Entreprise supprimée'});
    });
};


