const LogActionModel = require('../base/mongo-models/LogAction');

module.exports = {

    addLogAction: (action) => new LogActionModel(action).save(),

};
