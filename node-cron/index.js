const cron = require('node-cron');

const deletedToken = require('./deleted_token');
const { CRON_EVERY_MONDAY } = require('../configs/config');

module.exports = () => {
    cron.schedule(CRON_EVERY_MONDAY, async () => {
        console.time('ITERATION');
        await deletedToken();
        console.timeEnd('ITERATION');
    });
};
