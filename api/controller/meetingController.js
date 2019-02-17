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
            res.send(err);
        res.json(meetings);
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
            res.send(err);
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
            res.send(err);
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
                res.send(err);
            res.json({message: 'Meeting supprimé'});
        });
};
