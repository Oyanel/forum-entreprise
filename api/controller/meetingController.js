'use strict';
let mongoose = require('mongoose'),
    Meeting = mongoose.model('Meeting'),
    Meetings = require('../model/Meetings');

/**
 * List all meetings
 *
 * @param req
 * @param res
 */
exports.list_meetings = (req, res) => {
    Meeting.find({}, (err, meetings) => {
        if (err)
            return res.send(err);
        meetings.sort(function(a, b) {
            a = new Date(a.start_date);
            b = new Date(b.start_date);
            return a>b ? 1 : a<b ? -1 : 0;
        });
        res.json(meetings);
    });
};

/**
 * Create a meeting
 *
 * @param req
 * @param res
 */
exports.create_meeting = (req, res) => {
    let new_meeting = new Meeting(req.body);
    new_meeting.save((err, meeting) => {
        if (err)
            return res.send(err);
        res.json(meeting);
    });
};

/**
 * Plannify meetings
 *
 * @param req
 * @param res
 */
exports.plannify_meetings =  async (req, res) => {
    let meetings = new Meetings();
    res.json(await meetings.plannifyMeetings());
};

/**
 * Get a meeting from id
 *
 * @param req
 * @param res
 */
exports.get_meeting = (req, res) => {
    Meeting.findById(req.params.meetingId, (err, meeting) => {
        if (err)
            return res.send(err);
        res.json(meeting);
    });
};

/**
 * Update a meeting
 *
 * @param req
 * @param res
 */
exports.update_meeting = (req, res) => {
    Meeting.findOneAndUpdate({_id: req.params.meetingId}, req.body, {new: true}, (err, meeting) => {
        if (err)
            return res.send(err);
        res.json(meeting);
    });
};


/**
 * Delete a meeting
 *
 * @param req
 * @param res
 */
exports.delete_meeting = (req, res) => {
    Meeting.deleteOne({
            _id: req.params.meetingId
        },
        (err, meeting) => {
            if (err)
                return res.send(err);
            res.json({message: 'Meeting supprimé'});
        });
};

/**
 * Delete all meetings
 *
 * @param req
 * @param res
 */
exports.delete_meetings = (req, res) => {
    Meeting.remove({},
        (err) => {
            if (err)
                return res.send(err);
            res.json({message: 'Meetings supprimés'});
        });
};
