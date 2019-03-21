'use strict';

const {Debugger} = require('../helper/debugger');
let mongoose = require('mongoose'),
    config = require('../../config'),
    Meeting = mongoose.model('Meeting'),
    User = mongoose.model('User');

const MAX_PRIORITY = config.planning.max_rank;
const START_TIME = new Date(2019, 3, 18, config.planning.start_time, 0, 0);
const END_TIME = new Date(2019, 3, 18, config.planning.end_time, 0, 0);
const MEETING_TIME = config.planning.time_meeting;


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
        let rdvs = {},
            niteration = 0;
        let rdv_start_time = START_TIME;
        let rdv_end_time = new Date(2019, 3, 18, rdv_start_time.getHours(), 30, 0);

        const MAX_APPOINTEMENTS = Meetings.getMaxAppointments();

        while(niteration < MAX_PRIORITY){
            Debugger.debug("Iteration " + niteration);
            Debugger.debug(rdv_start_time);
            Debugger.debug(rdv_end_time);
            // We loop on the applicants affinities
            for (let key in affinityMatrix) {
                if (!affinityMatrix.hasOwnProperty(key)) continue;
                let applicant = affinityMatrix[key];
                let sortedCompanies = Object.keys(applicant).sort((a, b) => b - a);
                await sortedCompanies.forEach(async company => {
                    //then we check if the max number of meeting is yet reached
                    let meetings = await this.findMeetingsByCompany(company);
                    if (meetings.length > MAX_APPOINTEMENTS) {
                        delete sortedCompanies[company];
                    }
                });
                let creneau_trouve = 0;
                let compteur = 0;
                Debugger.debug("Recherche d'entreprise dispo");
                while(creneau_trouve==0 && compteur < this.companies.length){
                    Debugger.debug("tour " + compteur);
                    if(compteur < sortedCompanies.length){
                        Debugger.debug("test freetime");
                        await this.isFreeTime(key, sortedCompanies[compteur], rdv_start_time).then(async (valeur)=>{  
                            if (valeur==1){
                                creneau_trouve = 1;
                                Debugger.debug("Création meeting");
                                // Debugger.debug(rdv_start_time);
                                // Debugger.debug(rdv_end_time);
                                // Debugger.debug(applicant);
                                // Debugger.debug(sortedCompanies[niteration + compteur]);
                                let new_meeting = new  Meeting({start_date: rdv_start_time, end_date: rdv_end_time, applicant: key, company: sortedCompanies[compteur], description: "test"}); //.setMinutes(Date.now().getMinutes() + 30)
                                await new_meeting.save();
                            }
                        });
                    }
                    compteur = compteur + 1;
                }
                
                
                

                // let appointements = sortedCompanies.splice(0, MAX_APPOINTEMENTS);
                // Debugger.debug('applicant: ', key);
                // Debugger.debug('appointements: ', appointements);

            }

            rdv_start_time = rdv_end_time;
            rdv_end_time = new Date(2019, 3, 18, rdv_start_time.getHours(), rdv_start_time.getMinutes() + 30, 0);
            //Debugger.debug(this.applicants);
            affinityMatrix = await this.shuffle(affinityMatrix);
            
            niteration = niteration + 1;

        }
        this.addNoneMeetings(this.companies, this.applicants);
        return !!this.error ? 'Les rendez-vous sont prêts !' : this.error;
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

        return 1 - (scoreApplicant + scoreCompany) / 2;
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
        return (END_TIME.getHours() - START_TIME.getHours()) / MEETING_TIME;
    }

    /**
     * Return a boolean
     * 
     * @param company
     * @param start_time
     * @returns {Promise<Object>}
     */
    async isFreeTime(applicant, company, start_time){
        let meetings = await this.findMeetingsByCompany(company),
            output = 1;
        
        await meetings.forEach(async meeting => {
            if ((meeting.start_date.getHours() == start_time.getHours() && meeting.start_date.getMinutes() == start_time.getMinutes())
                || meeting.applicant == applicant) {
                output = 0;
            }
        });
        
        return Promise.resolve(output);

    }

    async shuffle(a) {
        var keys = Object.keys(a);
        let aShuffled = {};

        keys.sort(function(a,b) {return Math.floor(Math.random() * (keys.length + 1));});
        keys.forEach(key => {aShuffled[key]=a[key]});
        Debugger.debug(aShuffled);
        return aShuffled;
    }

    async addNoneMeetings(companies, applicants){

        

        await companies.forEach(async company =>{
            let test_time = START_TIME;
            let meetings = await this.findMeetingsByCompany(company);
            meetings.sort(function(a, b) {
                a = new Date(a.start_date);
                b = new Date(b.start_date);
                return a>b ? 1 : a<b ? -1 : 0;
            });
            await meetings.forEach(async meeting => {
                if(!(meeting.start_date.getHours() == test_time.getHours() && meeting.start_date.getMinutes() == test_time.getMinutes())){
                    Debugger.debug("Création meeting vide");
                    let new_meeting = new  Meeting({
                        start_date: test_time, 
                        end_date: new Date(2019, 3, 18, test_time.getHours(), test_time.getMinutes() + 30, 0), 
                        company: company, 
                        description: "meeting vide"});
                    await new_meeting.save();
                }
                test_time=new Date(2019, 3, 18, test_time.getHours(), test_time.getMinutes() + 30, 0);
            });
            // Debugger.debug(meetings);
        });
        
    }



}

module.exports = Meetings;
