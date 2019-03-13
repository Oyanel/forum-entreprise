'use strict';

const {Debugger} = require('../helper/debugger');
let mongoose = require('mongoose'),
    config = require('../../config'),
    Meeting = mongoose.model('Meeting'),
    User = mongoose.model('User');

const MAX_PRIORITY = config.planning.max_rank;

/**
 * This class handle the meetings strategy
 */
class Meetings {

    constructor() {
        if (this.instance) {
            return this.instance;
        }
        this.applicants = [];
        this.companies = [];
        this.error = [];
        this.instance = this;
    }

    /**
     * Plannify All the meetings from the user wish lists
     *
     */
    async plannifyMeetings() {
        this.companies = await this.getCompanies();
        this.applicants = await this.getApplicants();
        let affinityMatrix = this.getAfinityMatrix();
        const MAX_APPOINTEMENTS = Meetings.getMaxAppointments();

        // We loop on the applicants affinities
        for (let key in affinityMatrix) {
            if (!affinityMatrix.hasOwnProperty(key)) continue;
            let applicant = affinityMatrix[key];
            let sortedCompanies = Object.keys(applicant).sort((a, b) => b - a);
            await sortedCompanies.forEach(async company => {
                //then we check if the max number of meeting is yet reached
                let meetings = await this.findMeetingsByCompany(company);
                if (meetings.length > MAX_PRIORITY) {
                    delete sortedCompanies[company];
                }
            });

            let appointements = sortedCompanies.splice(0, MAX_APPOINTEMENTS);
            Debugger.debug('applicant: ', key);
            Debugger.debug('appointements: ', appointements);

        }
        return !!this.error ? 'Les rendez-vous sont prêts (mais pas les heures -_-\')!' : this.error;
    };

    /**
     * get the companies
     */
    async getCompanies() {
        let users = await User.find({user_type: "Company"}, (err, companies) => {
            if (err)
                return err;
            return companies;
        });

        return Promise.resolve(users);
    }

    /**
     * get the applicants
     */
    async getApplicants() {
        let users = await User.find({user_type: "Applicant"}, (err, applicants) => {
            if (err)
                return err;
            return applicants;
        });
        return Promise.resolve(users);
    }

    /**
     * Create and return the affinity matrix
     */
    getAfinityMatrix() {
        let affinityMatrix = {},
            applicants = this.applicants,
            companies = this.companies;

        applicants.forEach(applicant => {
            let companyArray = {};
            companies.forEach(company => {
                companyArray[company._id] = this.getAffinity(applicant, company);
            });
            affinityMatrix[applicant._id] = companyArray;
        });

        Debugger.debug(affinityMatrix);

        return affinityMatrix;
    }

    /**
     * return a value between 0 and 1
     * 0 = no affinity
     * 1 = max affinity
     *
     * To get the max value, both the company and the applicant should rank the other first in their wish lists
     *
     * @param applicant
     * @param company
     * @returns {number}
     */
    getAffinity(applicant, company) {
        let companyId = company._id,
            applicantId = applicant._id,
            rankCompany = applicant.wish_list.length > 0 && applicant.wish_list[0][companyId] ? applicant.wish_list[0][companyId] : 0,
            rankApplicant = company.wish_list.length > 0 && company.wish_list[0][applicantId] ? company.wish_list[0][applicantId] : 0,
            scoreCompany = rankCompany > 0 ? (rankCompany - 1) / (MAX_PRIORITY - 1) : 1,
            scoreApplicant = rankApplicant > 0 ? (rankApplicant - 1) / (MAX_PRIORITY - 1) : 1;

        return (1 - (scoreApplicant + scoreCompany) / 2);
    }

    /**
     * Return the meetings from the company id
     *
     * @param companyId
     * @returns {Promise<Object>}
     */
    async findMeetingsByCompany(companyId) {
        let meetings = await Meeting.find({company: companyId}, (err, meetings) => {
            if (err)
                return err;
            return meetings;
        });
        return Promise.resolve(meetings);
    }

    /**
     * Return the maximum number of appointements for a day.
     * Takes in account the config file
     * @TODO: use real dates not numbers
     *
     * @returns {number}
     */
    static getMaxAppointments() {
        return (config.planning.end_time - config.planning.start_time) / config.planning.time_meeting;
    }
}

module.exports = Meetings;
