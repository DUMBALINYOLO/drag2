import React from "react";
import { makeStyles, useTheme, Theme } from "@material-ui/core/styles";
import Zoom from "@material-ui/core/Zoom";
import MuiFab from "@material-ui/core/Fab";
import HelpIcon from "@material-ui/icons/Help";
import CloseIcon from "@material-ui/icons/Close";
import styled from "@emotion/styled";

const useStyles = makeStyles<Theme, { open: boolean; src: boolean }>(
  (theme) => ({
    root: ({ open, src }) => ({
      display: src ? "none" : undefined,
      position: "fixed",
      left: open ? 590 : 90,
      top: "calc(12vh)",
      zIndex: 9999999,
      borderRadius: "0 !important",
      transition: "0.2s",
      [theme.breakpoints.down("sm")]: {
        left: ({ open }) => (open ? "100%" : 90)
      }
    }),
    fab: {
      borderRadius: "50%",
      width: 59,
      height: 59,
      position: "absolute",
      bottom: theme.spacing(2),
      right: theme.spacing(2),
      backgroundColor: "#ffffff"
    }
  })
);

type TInfoFab = {
  open: boolean;
  setOpen: (value: boolean) => void;
  src: {
    url: string;
    title: string;
  } | null;
};

export default React.memo(({ src, open, setOpen }: TInfoFab) => {
  const theme = useTheme();
  const classes = useStyles({ open, src: !!src });

  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen
  };

  return (
    <div className={classes.root} onClick={() => setOpen(!open)}>
      <Zoom
        in={true}
        timeout={transitionDuration}
        style={{
          transitionDelay: `${transitionDuration.exit}ms`
        }}
        unmountOnExit
      >
        <MuiFab className={classes.fab} variant="extended">
          <CloseIconStyled open={open} />
          <HelpIconStyled open={open} />
        </MuiFab>
      </Zoom>
    </div>
  );
});

const HelpIconStyled = styled(HelpIcon)<{ open: boolean }>`
  transition: 0.5s;
  ${({ open }) => (open ? "width: 0; height: 0;" : "")}
`;

const CloseIconStyled = styled(CloseIcon)<{ open: boolean }>`
  transition: 0.5s;
  ${({ open }) => (open ? "" : "width: 0; height: 0;")}
`;
