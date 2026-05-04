require('dotenv').config();
const { Client, GatewayIntentBits, REST, Routes, Events } = require('discord.js');
const commands = require('./commands');
const { spotifyTokenInit } = require('./services/spotify.service');
const { initDB, upvoteHandler } = require('./db/upvotes');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Préparation des commandes
const commandsCollection = new Map();
const slashCommandsData = [];
for (const [name, cmd] of Object.entries(commands)) {
    commandsCollection.set(name, cmd);
    slashCommandsData.push(cmd.data);
}

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

client.once(Events.ClientReady, async (readyClient) => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
    try {
        console.log(`Started refreshing ${slashCommandsData.length} application (/) commands.`);
        await rest.put(
            Routes.applicationCommands(process.env.APPLICATION_ID),
            { body: slashCommandsData },
        );
        console.log(`Successfully reloaded application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
});

client.on(Events.InteractionCreate, async interaction => {
    if (interaction.isChatInputCommand()) {
        const command = commandsCollection.get(interaction.commandName);
        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(`Error executing ${interaction.commandName}:`, error);
            const errorReply = { content: 'Erreur interne lors de l\'exécution de cette commande!', ephemeral: true };
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp(errorReply);
            } else {
                await interaction.reply(errorReply);
            }
        }
    } else if (interaction.isButton()) {
        const [action, postId] = interaction.customId.split('_');
        const userId = String(interaction.user.id);

        if (action === 'upvote') {
            await upvoteHandler(postId, userId);
            await interaction.reply({
                content: `Post upvoted by <@${userId}>`,
                ephemeral: true // Invisible pour les autres, remplace flag: 64
            });
        }
    }
});

async function start() {
    try {
        await initDB();
        await spotifyTokenInit();
        await client.login(process.env.TOKEN);
    } catch (error) {
        console.error("Error starting bot:", error);
    }
}

start();
