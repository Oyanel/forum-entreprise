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
        config = require('../../config'),
        jwt = require('jsonwebtoken'),
        multer = require('multer'),
        crypto = require('crypto'),
        fs = require('fs'),
        DIR = 'fichiers/',
        storage = multer.diskStorage({
            destination: function(req, file, cb) {
                cb(null, DIR)
            },
            filename: function(req, file, cb) {
                crypto.pseudoRandomBytes(16, function(err, raw) {
                    cb(null, file.originalname);
                });
            }
        });

    /* User routes */
    app.route('/users')
        .get(secured, user.list_users)
        .post(user.create_user);

    app.route('/users/:userId')
        .get(secured, user.get_user)
        .put(secured, user.update_user)
        .delete(securedAdmin, user.delete_user);

    app.route('/users/password/:userId')
        .get(securedAdmin, user.renew_password);

    /* Meeting */
    app.route('/meetings')
        .get(secured, meeting.list_meetings)
        .delete(securedAdmin, meeting.delete_meetings);

    app.route('/meetings/plannify')
        .get(securedAdmin, meeting.plannify_meetings);

    app.route('/meetings/:meetingId')
        .get(secured, meeting.get_meeting)
        .put(securedAdmin, meeting.update_meeting)
        .delete(securedAdmin, meeting.delete_meeting);

    /* Configuration */
    app.route('/settings/')
        .get(securedAdmin, settings.get_settings)
        .put(securedAdmin, settings.update_settings);


    /** authentification **/

    /* login */
    app.route('/login')
        .post(user.login);

    app.route('/api/upload')
        .post(uploadFile);

    app.route('/getFile/:fileName')
        .get(getFile);

    function uploadFile(req, res) {
        let upload = multer({ storage: storage }).any();
        upload(req, res, function (err) {
            if (err) {
                return res.end(err.toString());
            }

            res.end('File is uploaded');
        });
    }

    function getFile(req, res) {
        if (req.params.fileName === null || req.params.fileName === undefined) {
            res.end('Fichier non trouvé');
        }
        var filePath = 'fichiers/' + req.params.fileName;


        let readStream = fs.createReadStream(filePath);
        // We replaced all the event handlers with a simple call to readStream.pipe()
        readStream.pipe(res);
    }

    // route middleware to verify a token
    function secured(req, res, next) {

        // check header or url parameters or post parameters for token
        let token = req.body.token || req.query.token || req.headers['x-access-token'];
        // decode token
        if (token) {
            // verifies secret and checks exp
            jwt.verify(token, config.token.secretKey, function (err, decoded) {
                if (err)
                    return res.json({success: false, message: 'Failed to authenticate token.'});

                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            });
        } else {
            return res.status(403).send({
                success: false,
                message: 'No token provided.'
            });

        }
    }

    /**
     * Admin route access controller
     *
     * @param req
     * @param res
     * @param next
     */
    function securedAdmin(req, res, next) {

        // check header or url parameters or post parameters for token
        let token = req.body.token || req.query.token || req.headers['x-access-token'];

        // decode token
        if (token) {
            // verifies secret and checks exp
            jwt.verify(token, config.token.secretKey, async function (err, decoded) {
                if (err)
                    return res.json({success: false, message: 'Failed to authenticate token.'});

                req.decoded = decoded;

                let isAdmin = await user.isAdmin(decoded.id);
                if (!isAdmin) {
                    return res.json({success: false, message: 'Access denied.'});
                }
                next();
            });
        } else {
            return res.status(403).send({
                success: false,
                message: 'No token provided.'
            });
        }

    }

};
