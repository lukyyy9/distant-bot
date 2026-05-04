const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const User = sequelize.define('User', {
        id: { type: DataTypes.STRING, primaryKey: true } // Discord User ID
    }, { timestamps: false });

    return User;
};
