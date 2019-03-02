let config = require('../../config');


/**
 * Helper for debugging
 *
 * Edit config.json to enable/disable debug
 *
 */
class Debugger {

    /**
     * Display debug message if debug is enable
     *
     * @param messages
     */
    static debug(...messages) {
        if (config.dev.debug === true) {
            console.log(...messages);
        }
    }
}

module.exports = {Debugger};
