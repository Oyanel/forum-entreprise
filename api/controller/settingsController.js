'use strict';
let config = require('../../config'),
    fs = require('fs');


/**
 * Get settings
 *
 * @param req
 * @param res
 */
exports.get_settings = (req, res) => {
    res.json(config.planning);
};

/**
 * Update settings
 *
 * @param req
 * @param res
 */
exports.update_settings = (req, res) => {
    config.planning = req.body;
    fs.writeFile('config.json', JSON.stringify(config,null,2), (err) => {
        if(err)
            res.send(err);
        res.json({message: "settings updated"});
    });
};
