const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Post = sequelize.define('Post', {
        id: { type: DataTypes.STRING, primaryKey: true }, // UUID
        guildId: { type: DataTypes.STRING, allowNull: false },
        authorId: { type: DataTypes.STRING, allowNull: false },
        url: { type: DataTypes.TEXT, allowNull: false },
        votes: { type: DataTypes.INTEGER, defaultValue: 0 }
    }, { timestamps: true });

    return Post;
};
