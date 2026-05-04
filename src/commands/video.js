const { getService, getRidOfVmTiktok } = require('../utils/url');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: {
        name: "video",
        description: "Sends video from a social media post",
        options: [{
            name: "url",
            description: "Social network post link",
            type: 3, // Type 3 correspond à STRING
            required: true,
        }],
    },
    execute: async (interaction) => {
        // Defer reply in case url fetching (e.g. tiktok) takes more than 3 seconds
        await interaction.deferReply();
        
        let url = interaction.options.getString('url');
        let videoType = '';
        
        switch (getService(url) + '.') {
            case 'instagram.': 
                url = url.replace('instagram.', 'kkinstagram.'); 
                videoType = 'Reel'; 
                break;
            case 'tiktok.':
                if(url.includes('vm.tiktok')){
                    url = await getRidOfVmTiktok(url);
                }
                url = url.replace('tiktok.', 'kktiktok.');
                videoType = 'TikTok';
                break;
            case 'twitter.': 
                url = url.replace('twitter.', 'fxtwitter.'); 
                videoType = 'X'; 
                break;
            case 'x.': 
                url = url.replace('x.', 'fxtwitter.'); 
                videoType = 'X'; 
                break;
            default: 
                videoType = 'Video'; 
                break;
        }

        const upvoteBtn = new ButtonBuilder()
            .setCustomId(`upvote_${interaction.options.getString('url')}`)
            .setLabel('❤')
            .setStyle(ButtonStyle.Primary);
        
        const row = new ActionRowBuilder().addComponents(upvoteBtn);

        await interaction.editReply({
            content: `[${videoType}](${url}) shared by <@${interaction.user.id}>:`,
            components: [row]
        });
    }
};
