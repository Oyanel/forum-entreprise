'use strict';

/**
 * Routes
 *
 * @param app
 */
module.exports = (app) => {
    let user = require('../controller/userController'),
        meeting = require('../controller/meetingController');


    /* User routes */
    app.route('/users')
        .get(user.list_users)
        .post(user.create_user);

    app.route('/users/:userId')
        .get(user.get_user)
        .put(user.update_user)
        .delete(user.delete_user);

    /* Meeting */

    app.route('/meetings')
        .get(meeting.list_meetings);

    app.route('/meetings/plannify')
        .get(meeting.plannify_meetings);

    app.route('/meetings/:meetingId')
        .get(meeting.get_meeting)
        .put(meeting.update_meeting)
        .delete(meeting.delete_meeting);
};
