import { makeStyles } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";
import React from "react";
const useStyles = makeStyles((theme) => ({
  root1: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
}));

const LinearIntermediate = () => {
  const classes = useStyles();

  return (
    <div className={classes.root1}>
      <LinearProgress color="primary" />
    </div>
  );
};
export default LinearIntermediate;
