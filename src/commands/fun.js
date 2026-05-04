module.exports = {
    chaise: {
        data: {
            name: "chaise",
            description: "❓"
        },
        execute: async (interaction) => {
             await interaction.reply({
                 content: `https://media.discordapp.net/attachments/1019235624013811722/1105832848314880020/ezgif.com-video-to-gif_3.gif`,
             });
        }
    },
    esiahc: {
        data: {
            name: "esiahc",
            description: "❓⏪"
        },
        execute: async (interaction) => {
             await interaction.reply({
                 content: `https://media.discordapp.net/attachments/992074829169692847/1116867287346061392/ezgif.com-reverse.gif`,
             });
        }
    }
};
