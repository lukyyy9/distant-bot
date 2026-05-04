const utils = require('../utils'); // Keep fallback for now before deleting

module.exports = {
    ping: require('./ping'),
    chaise: require('./fun').chaise,
    esiahc: require('./fun').esiahc,
    music: require('./music'),
    video: require('./video'),
    topuser: require('./topuser')
};