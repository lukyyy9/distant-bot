const { getTopUsers } = require('../services/db.service');

module.exports = {
    data: {
        name: "topuser",
        description: "Displays the leaderboard of users with the most upvotes received on this server"
    },
    execute: async (interaction) => {
        const topUsersString = await getTopUsers(interaction.guildId);
        await interaction.reply({
            content: `Top users having received the most likes:\n${topUsersString}`,
        });
    }
};
