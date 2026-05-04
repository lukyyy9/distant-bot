module.exports = {
    data: {
        name: "ping",
        description: "Pings Distant"
    },
    execute: async (interaction) => {
        await interaction.reply({
            content: `Pong ${interaction.user.username}! 🏓`,
            ephemeral: true
        });
    }
};
