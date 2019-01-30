'use strict';
let mongoose = require('mongoose'),
    Meeting = mongoose.model('Meeting');

/**
 * List all meetings
 *
 * @param req
 * @param res
 */
exports.list_meetings = (req, res) => {
    Meeting.find({}, (err, meeting) => {
        if (err)
            res.send(err);
        res.json(meeting);
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
            res.send(err);
        res.json(meeting);
    });
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
 * Get a meeting from id
 *
 * @param req
 * @param res
 */
exports.get_meeting_detail = (req, res) => {
    Meeting.findById(req.params.meetingId, (err, meeting) => {
        if (err)
            res.send(err);

        //res.json(meeting);
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


