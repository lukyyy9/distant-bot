const { sequelize, User, GuildMember, Post, UserVote } = require('../models');

async function initDB() {
    try {
        await sequelize.authenticate();
        await sequelize.sync({ force: true }); // Attention: force vide les données. Idéal pour reconstruire l'association et purger les schémas erronés.
        console.log("PostgreSQL Database tables verified/initialized with Sequelize.");
    } catch (error) {
        console.error("Error initializing PostgreSQL DB:", error);
    }
}

async function createPost(id, guildId, authorId, url) {
    try {
        await User.findOrCreate({ where: { id: authorId } });
        await Post.findOrCreate({
            where: { id },
            defaults: { guildId, authorId, url, votes: 0 }
        });
    } catch (error) {
        console.error("Error creating post:", error);
    }
}

async function upvoteHandler(postId, userId, guildId) {
    const transaction = await sequelize.transaction();
    try {
        const post = await Post.findOne({ where: { id: postId }, transaction });
        if (!post) {
            await transaction.rollback();
            return;
        }

        const existingVote = await UserVote.findOne({
            where: { user_id: userId, post_id: postId },
            transaction
        });

        if (!existingVote) {
            await User.findOrCreate({ where: { id: userId }, transaction });
            await UserVote.create({ user_id: userId, post_id: postId }, { transaction });
            await post.increment('votes', { by: 1, transaction });

            // On récompense l'auteur du post dans le contexte de la guilde
            await User.findOrCreate({ where: { id: post.authorId }, transaction });
            await GuildMember.findOrCreate({
                where: { discordId: post.authorId, guildId: post.guildId },
                defaults: { votes: 0 },
                transaction
            });
            await GuildMember.increment('votes', { by: 1, where: { discordId: post.authorId, guildId: post.guildId }, transaction });
        }
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        console.error("Upvote error: ", error);
    }
}

async function getTopUsers(guildId) {
    try {
        const members = await GuildMember.findAll({
            where: { guildId },
            order: [['votes', 'DESC']],
            limit: 5
        });
        
        if (members.length === 0) return 'Aucun utilisateur trouvé.';
        
        return members.map((member, index) => {
            return `${index + 1}. <@${member.discordId}>: ${member.votes} j'aimes reçus`;
        }).join('\n');
    } catch (error) {
        console.error('Erreur:', error);
        return 'Erreur lors de la récupération des meilleurs utilisateurs.';
    }
}

async function getWeeklyTopPosts() {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const { Op } = require('sequelize');

    try {
        const posts = await Post.findAll({
            where: { createdAt: { [Op.gte]: sevenDaysAgo } },
            order: [['votes', 'DESC']]
        });
        
        // Group by guildId manually
        const topByGuild = {};
        for (const post of posts) {
            if (!topByGuild[post.guildId]) topByGuild[post.guildId] = [];
            if (topByGuild[post.guildId].length < 3) {
                topByGuild[post.guildId].push(post);
            }
        }
        return topByGuild;
    } catch (error) {
        console.error("Error fetching weekly top:", error);
        return {};
    }
}

function buildPodiumMessage(posts) {
    if (!posts || posts.length === 0) {
        return "Aucune vidéo n'a reçu de votes cette semaine sur ce serveur.";
    }
    
    let msg = `🏆 **Le podium de la semaine !** 🏆\n\n`;
    posts.forEach((post, index) => {
        msg += `${index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'} <@${post.authorId}> avec ${post.votes} j'aimes :\n${post.url}\n\n`;
    });
    return msg;
}

module.exports = { initDB, createPost, upvoteHandler, getTopUsers, getWeeklyTopPosts, buildPodiumMessage };
