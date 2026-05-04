const { getService } = require('../utils/url');
const spotifyService = require('../services/spotify.service');
const youtubeService = require('../services/youtube.service');
const deezerService = require('../services/deezer.service');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: {
        name: "music",
        description: "Sends the music link from all music streaming services",
        options: [{
            name: "url",
            description: "Music streaming service title link",
            type: 3,
            required: true,
        }],
    },
    execute: async (interaction) => {
        // La recherche de musique sur 3 APIs différentes prend parfois plus de 3 secondes, il faut defer la réponse
        await interaction.deferReply();

        let url = interaction.options.getString('url');
        const service = getService(url);
        
        let trackDetails;
        let spotifyLink = '';
        let youtubeLink = '';
        let deezerLink = '';
        let musicWord = 'Music';

        try {
            if (service === 'spotify') {
                url = url.replace(/\/intl-\w\w/, '');
                trackDetails = await spotifyService.getTrackDetailsFromSpotify(url);
                spotifyLink = url;
            } else if (service === 'youtube') {
                trackDetails = await youtubeService.getTrackDetailsFromYouTube(url);
                youtubeLink = url;
            } else if (service === 'deezer') {
                trackDetails = await deezerService.getTrackDetailsFromDeezer(url);
                deezerLink = url;
            } else {
                return await interaction.editReply({
                    content: `This platform is not supported yet. Please use a valid music streaming service link.`,
                    ephemeral: true
                });
            }

            [spotifyLink, youtubeLink, deezerLink] = await Promise.all([
                spotifyLink === '' ? spotifyService.searchOnSpotify(trackDetails) : Promise.resolve(spotifyLink),
                youtubeLink === '' ? youtubeService.searchOnYouTube(trackDetails) : Promise.resolve(youtubeLink),
                deezerLink === '' ? deezerService.searchOnDeezer(trackDetails) : Promise.resolve(deezerLink)
            ]);

            const row = new ActionRowBuilder();

            if (spotifyLink) {
                row.addComponents(new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel('Spotify').setURL(spotifyLink));
                musicWord = `[Music](${spotifyLink})`;
            }
            if (youtubeLink) {
                row.addComponents(new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel('YouTube').setURL(youtubeLink));
            }
            if (deezerLink) {
                row.addComponents(new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel('Deezer').setURL(deezerLink));
            }

            await interaction.editReply({
                content: `${musicWord} shared by <@${interaction.user.id}>:\n${trackDetails.title} by ${trackDetails.artist}`,
                components: row.components.length > 0 ? [row] : []
            });

        } catch (error) {
            console.error("Music command error:", error);
            await interaction.editReply({
                content: `An error occurred while finding the track details.`,
                ephemeral: true
            });
        }
    }
};
