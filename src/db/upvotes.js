const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.js');

const User = sequelize.define('User', {
    id: { type: DataTypes.STRING, primaryKey: true },
    votes: { type: DataTypes.INTEGER, defaultValue: 0 }
}, { timestamps: false });

const Post = sequelize.define('Post', {
    id: { type: DataTypes.STRING, primaryKey: true },
    votes: { type: DataTypes.INTEGER, defaultValue: 0 }
}, { timestamps: false });

const UserVote = sequelize.define('UserVote', {
    user_id: { type: DataTypes.STRING, primaryKey: true },
    post_id: { type: DataTypes.STRING, primaryKey: true }
}, { timestamps: false });

async function initDB() {
    try {
        await sequelize.authenticate();
        await sequelize.sync(); // Crée les tables si elles n'existent pas
        console.log("PostgreSQL Database tables verified/initialized with Sequelize.");
    } catch (error) {
        console.error("Error initializing PostgreSQL DB:", error);
    }
}

async function upvoteHandler(postId, userId) {
    const transaction = await sequelize.transaction();
    try {
        // Vérifie si l'utilisateur a déjà voté pour ce post
        const existingVote = await UserVote.findOne({
            where: { user_id: userId, post_id: postId },
            transaction
        });

        if (!existingVote) {
            // Enregistre le vote
            await UserVote.create({ user_id: userId, post_id: postId }, { transaction });

            // Incrémente le compteur du post
            await Post.findOrCreate({
                where: { id: postId },
                defaults: { votes: 0 },
                transaction
            });
            await Post.increment('votes', { by: 1, where: { id: postId }, transaction });

            // Incrémente le nombre total de votes donnés par l'utilisateur
            await User.findOrCreate({
                where: { id: userId },
                defaults: { votes: 0 },
                transaction
            });
            await User.increment('votes', { by: 1, where: { id: userId }, transaction });
        }
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        console.error("Upvote error: ", error);
    }
}

async function getTopUsers() {
    try {
        const users = await User.findAll({
            order: [['votes', 'DESC']],
            limit: 5
        });
        
        if (users.length === 0) return 'Aucun utilisateur trouvé.';
        
        return users.map((user, index) => {
            return `${index + 1}. <@${user.id}>: ${user.votes}`;
        }).join('\n');
    } catch (error) {
        console.error('Erreur lors de la récupération des meilleurs utilisateurs:', error);
        return 'Erreur lors de la récupération des meilleurs utilisateurs.';
    }
}

module.exports = { initDB, upvoteHandler, getTopUsers };
