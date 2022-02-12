import React, { useEffect, useRef, useState } from "react";
import { Badge, Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "space-between",
    marginLeft: 20,
    flexGrow: 1,
    alignItems: 'center'
  },
  username: {
    fontWeight: "bold",
    letterSpacing: -0.2,
  },
  previewText: {
    fontSize: 12,
    color: "#9CADC8",
    letterSpacing: -0.17,
  },
  boldPreviewText: {
    letterSpacing: -0.17,
    fontSize: 12,
    fontWeight: "bold",
    color: "#000"
  },
  badge: {
    marginRight: 30
  }
}));

const ChatContent = (props) => {
  const classes = useStyles();

  const { conversation, unread, activeConvo } = props;
  const { latestMessageText, otherUser } = conversation;

  const [unreadBadge, setUnreadBadge] = useState(0);
  const firstUpdate = useRef(true);

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    } else if (conversation.otherUser.username !== activeConvo) {
      let unreadMsg = unreadBadge;
      unreadMsg += 1;
      setUnreadBadge(unreadMsg);
    } 
  }, [latestMessageText])

  useEffect(() => {
    setUnreadBadge(unread)
  }, [unread])

  useEffect(() => {
    if (conversation.otherUser.username === activeConvo){
      setUnreadBadge(0)
    }
  }, [activeConvo])

  return (
    <Box className={classes.root}>
      <Box>
        <Typography className={classes.username}>
          {otherUser.username}
        </Typography>
        <Typography className={unreadBadge > 0 ? classes.boldPreviewText : classes.previewText }>
          {latestMessageText}
        </Typography>
      </Box>
      <Box>
        <Badge className={classes.badge} badgeContent={unreadBadge} color="primary" />
      </Box>
    </Box>
  );
};

const mapStateToProps = (state) => {
  return {
    activeConvo: state.activeConversation
  }
}

export default connect(mapStateToProps, null)(ChatContent);
