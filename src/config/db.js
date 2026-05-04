const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    process.env.PG_DB || 'distantbot',
    process.env.PG_USER || 'botuser',
    process.env.PG_PASSWORD || 'botpassword',
    {
        host: process.env.PG_HOST || 'db',
        port: process.env.PG_PORT || 5433,
        dialect: 'postgres',
        logging: false, // Désactiver les logs SQL dans la console
    }
);

module.exports = sequelize;