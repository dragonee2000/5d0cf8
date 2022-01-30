import React, { useState } from "react";
import { Box,IconButton, FormControl, FilledInput, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { postMessage } from "../../store/utils/thunkCreators";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import FileCopyIcon from "@material-ui/icons/FileCopy";

const useStyles = makeStyles(() => ({
  root: {
    justifySelf: "flex-end",
    marginTop: 15,
  },
  input: {
    paddingLeft: 20,
    height: 70,
    backgroundColor: "#F4F6FA",
    borderRadius: 8,
    marginBottom: 20,
  },
}));

const Input = (props) => {
  const classes = useStyles();
  const [text, setText] = useState("");
  const { postMessage, otherUser, conversationId, user } = props;

  const handleChange = (event) => {
    setText(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // add sender user info if posting to a brand new convo, so that the other user will have access to username, profile pic, etc.
    const reqBody = {
      text: event.target.text.value,
      recipientId: otherUser.id,
      conversationId,
      sender: conversationId ? null : user,
    };
    await postMessage(reqBody);
    setText("");
  };

  return (
    <form className={classes.root} onSubmit={handleSubmit}>
      <FormControl fullWidth hiddenLabel>
        <FilledInput
          classes={{ root: classes.input }}
          disableUnderline
          fullWidth
          placeholder="Type something..."
          value={text}
          name="text"
          onChange={handleChange}
          endAdornment={
            <Box display="flex" flexDirection="row">
              <Box>
                <IconButton className={classes.iconBtn}>
                  <InsertEmoticonIcon className={classes.icon} />
                </IconButton>
              </Box>
              <Box>
                <IconButton className={classes.iconBtn}>
                  <FileCopyIcon className={classes.icon} /></IconButton>
              </Box>
            </Box>
          }
        />
      </FormControl>
    </form>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    postMessage: (message) => {
      dispatch(postMessage(message));
    },
  };
};

export default connect(null, mapDispatchToProps)(Input);
