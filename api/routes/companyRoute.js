'use strict';

/**
 * Routes for a company
 *
 * @param app
 */
module.exports = (app) => {
    let company = require('../controller/companyController');

    app.route('/companies')
        .get(company.list_companies)
        .post(company.create_company);

    app.route('/companies/:companyId')
        .get(company.get_company)
        .put(company.update_company)
        .delete(company.delete_company);
};