const Conversation = require("./conversation");
const User = require("./user");
const Message = require("./message");
const UserConversation = require("./userConversation");


// associations
Conversation.belongsToMany(User, { through: 'UserConversation' });
User.belongsToMany(Conversation, { through: "UserConversation "});

Message.belongsTo(Conversation);
Conversation.hasMany(Message);

User.hasMany(Message);
Message.belongsTo(User)

module.exports = {
  User,
  Conversation,
  Message,
  UserConversation
};
