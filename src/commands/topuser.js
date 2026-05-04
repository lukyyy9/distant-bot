const { getTopUsers } = require('../db/upvotes');

module.exports = {
    data: {
        name: "topuser",
        description: "Displays the leaderboard of users with the most upvotes given"
    },
    execute: async (interaction) => {
        const topUsersString = await getTopUsers();
        await interaction.reply({
            content: `Top users:\n${topUsersString}`,
        });
    }
};
