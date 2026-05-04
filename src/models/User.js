const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const User = sequelize.define('User', {
        id: { type: DataTypes.STRING, primaryKey: true }, // Discord User ID
        guildId: { type: DataTypes.STRING, primaryKey: true },
        votes: { type: DataTypes.INTEGER, defaultValue: 0 }
    }, { timestamps: false });

    return User;
};
