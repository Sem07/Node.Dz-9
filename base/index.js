const { Sequelize } = require('sequelize');

const { config: { DATABASE, PASSWORD_DB, USERNAME_DB } } = require('../configs');

module.exports.sequelize = new Sequelize(DATABASE,
    USERNAME_DB,
    PASSWORD_DB, {
        host: 'localhost',
        dialect: 'mysql'
    });
