const { getWeeklyTopPosts, buildPodiumMessage } = require('../services/db.service');

module.exports = {
    data: {
        name: "top",
        description: "Affiche le podium des vidéos les plus aimées de la semaine sur le serveur",
    },
    execute: async (interaction) => {
        const topByGuild = await getWeeklyTopPosts();
        
        // Extraire les posts du serveur courant
        const guildPosts = topByGuild[interaction.guildId] || [];
        
        const responseMessage = buildPodiumMessage(guildPosts);
        
        await interaction.reply({
            content: responseMessage,
        });
    }
};
