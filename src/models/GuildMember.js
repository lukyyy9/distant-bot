const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const GuildMember = sequelize.define('GuildMember', {
        discordId: { type: DataTypes.STRING, primaryKey: true },
        guildId: { type: DataTypes.STRING, primaryKey: true },
        votes: { type: DataTypes.INTEGER, defaultValue: 0 }
    }, { timestamps: false });

    return GuildMember;
};