const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const UserVote = sequelize.define('UserVote', {
        user_id: { type: DataTypes.STRING, primaryKey: true },
        post_id: { type: DataTypes.STRING, primaryKey: true }
    }, { timestamps: false });

    return UserVote;
};
