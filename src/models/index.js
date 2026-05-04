const sequelize = require('../config/db.js');

const User = require('./User')(sequelize);
const GuildMember = require('./GuildMember')(sequelize);
const Post = require('./Post')(sequelize);
const UserVote = require('./UserVote')(sequelize);

// Define Associations
User.hasMany(Post, { foreignKey: 'authorId', sourceKey: 'id', as: 'Posts' });
Post.belongsTo(User, { foreignKey: 'authorId', targetKey: 'id', as: 'Author' });

User.belongsToMany(Post, { through: UserVote, foreignKey: 'user_id', otherKey: 'post_id', as: 'VotedPosts' });
Post.belongsToMany(User, { through: UserVote, foreignKey: 'post_id', otherKey: 'user_id', as: 'Voters' });

User.hasMany(GuildMember, { foreignKey: 'discordId', sourceKey: 'id', as: 'GuildStats' });
GuildMember.belongsTo(User, { foreignKey: 'discordId', targetKey: 'id', as: 'User' });

module.exports = {
    sequelize,
    User,
    GuildMember,
    Post,
    UserVote
};
