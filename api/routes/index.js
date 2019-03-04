'use strict';

/**
 * Routes
 *
 * @param app
 */
module.exports = (app) => {
    let settings = require('../controller/settingsController'),
        user = require('../controller/userController'),
        meeting = require('../controller/meetingController'),
        passport = require('passport');


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

    /* Configuration */
    app.route('/settings/')
        .get(settings.get_settings)
        .put(settings.update_settings);


    /** authentification **/

    /* login */
    app.route('/login')
        .post(passport.authenticate('local-login', (req, res) => {
            res.json();
        }));

    /* logout */
    app.route('/logout')
        .get(isLoggedIn, (req, res) => {
            req.logout();
            res.status(200).json({
                'message': 'successfully logout'
            });
        });

    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
            return next();
        res.status(400).json({
            'message': 'access denied'
        });
    }
};
