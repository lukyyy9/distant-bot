const sequelize = require('../config/db.js');

const User = require('./User')(sequelize);
const Post = require('./Post')(sequelize);
const UserVote = require('./UserVote')(sequelize);

// Define Associations
// Un utilisateur (dans une guilde) peut avoir partagé plusieurs posts.
// Sequelize a du mal avec les foreign keys composites auto-générées pour les associations simples, 
// mais on peut associer avec des alias et spécifier les clés.
User.hasMany(Post, { 
    foreignKey: 'authorId', 
    sourceKey: 'id',
    as: 'Posts' 
});
Post.belongsTo(User, { 
    foreignKey: 'authorId', 
    targetKey: 'id',
    as: 'Author' 
});

// Relation pour les votes (Many-to-Many)
User.belongsToMany(Post, { through: UserVote, foreignKey: 'user_id', otherKey: 'post_id', as: 'VotedPosts' });
Post.belongsToMany(User, { through: UserVote, foreignKey: 'post_id', otherKey: 'user_id', as: 'Voters' });

module.exports = {
    sequelize,
    User,
    Post,
    UserVote
};
