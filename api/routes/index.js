'use strict';

/**
 * Routes
 *
 * @param app
 */
module.exports = (app) => {
    let company = require('../controller/companyController');
    let applicant = require('../controller/applicantController');

    /* Company routes */

    app.route('/companies')
        .get(company.list_companies)
        .post(company.create_company);

    app.route('/companies/:companyId')
        .get(company.get_company)
        .put(company.update_company)
        .delete(company.delete_company);

    /* Applicant */
    app.route('/applicants')
        .get(applicant.list_applicants)
        .post(applicant.create_applicant);

    app.route('/applicants/:applicantId')
        .get(applicant.get_applicant)
        .put(applicant.update_applicant)
        .delete(applicant.delete_applicant);
};