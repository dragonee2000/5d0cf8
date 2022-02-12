const router = require("express").Router();
const { User, Conversation, Message } = require("../../db/models");
const { Op, Sequelize } = require("sequelize");
const onlineUsers = require("../../onlineUsers");

// get all conversations for a user, include latest message text for preview, and all messages
// include other user model so we have info on username/profile pic (don't include current user info)
router.get("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const userId = req.user.id;
    const conversations = await Conversation.findAll({
      where: {
        [Op.or]: {
          user1Id: userId,
          user2Id: userId,
        },
      },
      attributes: {
        include: ["id", [Sequelize.fn("COUNT", Sequelize.where(Sequelize.col("messages.read"), false)), "unread"]]
      },
      order: [[Message, "createdAt", "DESC"]],
      include: [
        { model: Message, order: ["createdAt", "DESC"] },
        {
          model: User,
          as: "user1",
          where: {
            id: {
              [Op.not]: userId,
            },
          },
          attributes: ["id", "username", "photoUrl"],
          required: false,
        },
        {
          model: User,
          as: "user2",
          where: {
            id: {
              [Op.not]: userId,
            },
          },
          attributes: ["id", "username", "photoUrl"],
          required: false,
        },
      ],
      group: ["conversation.id", "user1.id", "user2.id","messages.id"]
    });

    for (let i = 0; i < conversations.length; i++) {
      const convo = conversations[i];
      const convoJSON = convo.toJSON();
      // set a property "otherUser" so that frontend will have easier access
      if (convoJSON.user1) {
        convoJSON.otherUser = convoJSON.user1;
        delete convoJSON.user1;
      } else if (convoJSON.user2) {
        convoJSON.otherUser = convoJSON.user2;
        delete convoJSON.user2;
      }

      // set property for online status of the other user
      if (onlineUsers.includes(convoJSON.otherUser.id)) {
        convoJSON.otherUser.online = true;
      } else {
        convoJSON.otherUser.online = false;
      }

      let cont = true;
      let lastReadID = -1;
      let otherUserLastReadID = -1;
      let unread = 0;

      for (let j = convoJSON.messages.length - 1; j >= 0 && cont; j--) {
        if (convoJSON.messages[j].senderId === userId && convoJSON.messages[j].read){
          otherUserLastReadID = convoJSON.messages[j].id;
        } 
        else if (convoJSON.messages[j].senderId !== userId) {
          if (convoJSON.messages[j].read) {
          lastReadID = convoJSON.messages[j].id;
          } else unread++;
        }
        else if (convoJSON.messages[j].senderId === userId && !convoJSON.messages[j].read
          && (convoJSON.messages[j].senderId !== userId && !convoJSON.messages[j].read)
          ){
          cont = false;
        } 
      }

      // set properties for notification count and latest message preview
      convoJSON.latestMessageText = convoJSON.messages[0].text;
      convoJSON.otherUserLastReadID = otherUserLastReadID;
      convoJSON.lastReadID = lastReadID
      convoJSON.unread = unread
      conversations[i] = convoJSON;
    }

    res.json(conversations);
  } catch (error) {
    next(error);
  }
});

// set messages to read
router.put("/read", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const userId = req.user.id;
    const otherUserId = req.body.otherUser

    const conversation = await Conversation.findOne({
      where: {
        user1Id: {
          [Op.or]: [userId, otherUserId]
        },
        user2Id: {
          [Op.or]: [userId, otherUserId]
        }
      },
      include: [
        { model: Message, order: ["createdAt", "DESC"] },
      ]
    });

    if (!conversation) {
      return res.sendStatus(403)
    }

    const convoJSON = conversation.toJSON();

    let messageIDs = [];
    let cont = true;
    for(let j = 0; j < convoJSON.messages.length && cont; j++) {
      if (convoJSON.messages[j].senderId === otherUserId) {
        messageIDs.push(convoJSON.messages[j].id);
      }
    }

    Message.update({ read: true }, {
      where: {
        id: messageIDs
      }
    })
    
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
})

module.exports = router;
