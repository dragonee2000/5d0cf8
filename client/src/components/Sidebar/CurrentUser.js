import React, { useState } from "react";
import { Box, Typography, IconButton, Menu, MenuItem } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { BadgeAvatar } from "./index";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import { logout, fetchConversations } from "../../store/utils/thunkCreators";
import { clearOnLogout } from "../../store";

const useStyles = makeStyles(() => ({
  root: {
    height: 44,
    marginTop: 23,
    marginLeft: 6,
    display: "flex",
    alignItems: "center",
  },
  subContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexGrow: 1,
  },
  username: {
    letterSpacing: -0.23,
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 17,
  },
  ellipsis: {
    color: "#95A7C4",
    opacity: 0.5,
  },
  ellipsisBtn: {
    marginRight: 24,
  },
}));

const CurrentUser = (props) => {
  const classes = useStyles();
  const { logout } = props;
  const [anchorEl, setAnchorEl] = useState(null);

  const user = props.user || {};

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = async () => {
    await logout(user.id);
  }

  return (
    <Box className={classes.root}>
      <BadgeAvatar photoUrl={user.photoUrl} online={true} />
      <Box className={classes.subContainer}>
        <Typography className={classes.username}>{user.username}</Typography>
        <IconButton onClick={handleClick} classes={classes.ellipsisBtn}>
          <MoreHorizIcon classes={{ root: classes.ellipsis }} />
        </IconButton>
      </Box>
    </Box>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logout: (id) => {
      dispatch(logout(id));
      dispatch(clearOnLogout());
    }
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(CurrentUser);
