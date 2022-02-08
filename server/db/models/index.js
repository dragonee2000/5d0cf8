const Conversation = require("./conversation");
const User = require("./user");
const Message = require("./message");
const UserConversation = require("./userConversation");


// associations

User.hasMany(UserConversation);
UserConversation.belongsTo(User);

Conversation.hasMany(UserConversation);
UserConversation.belongsTo(Conversation);

Message.belongsTo(Conversation);
Conversation.hasMany(Message);

User.hasMany(Message);
Message.belongsTo(User)
// Conversation.belongsTo(User, { as: "user1" });
// Conversation.belongsTo(User, { as: "user2" });
// Message.belongsTo(Conversation);
// Conversation.hasMany(Message);

module.exports = {
  User,
  Conversation,
  Message,
  UserConversation
};
