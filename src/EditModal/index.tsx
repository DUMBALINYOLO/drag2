import React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Backdrop from "@material-ui/core/Backdrop";
import {
  NodeSingular as CSNodeSingular,
  EdgeSingular as CSEdgeSingular
} from "cytoscape";
import { TNodeData } from "components/Graph/elements/nodes";
import {
  Button,
  Divider,
  MenuItem,
  Paper,
  PaperProps,
  TextField
} from "@material-ui/core";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Draggable from "react-draggable";

import Dialog from "@material-ui/core/Dialog";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    modal: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      border: "2px solid #34c240",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      width: 400,
      [theme.breakpoints.down("sm")]: {
        width: "80vw"
      }
    },
    titleContainer: {
      padding: theme.spacing(0, 0, 3)
    },
    buttonContainer: {
      display: "flex",
      justifyContent: "flex-end"
    },
    deleteButton: {
      width: "8rem",
      backgroundColor: "#34c240",
      color: "#ffffff",
      transition: "0.5s",
      border: `1px solid #34c240`,
      "&:hover": {
        backgroundColor: "#ffffff",
        color: "#34c240",
        border: `1px solid #34c240`
      },
      marginRight: "0.5rem"
    },
    cancelButton: {
      width: "8rem",
      backgroundColor: "#ffffff",
      color: "#34c240",
      transition: "0.5s",
      border: `1px solid #34c240`,
      "&:hover": {
        backgroundColor: "#34c240",
        color: "#ffffff"
      }
    },
    inputField: {
      padding: theme.spacing(2, 0, 2, 0),
      borderColor: theme.palette.primary.main
    },
    formControl: {
      margin: theme.spacing(1, 0, 3, 0),
      // minWidth: 120,
      width: "100%"
    },
    backdrop: {
      backgroundColor: "rgba(0, 0, 0, 0.2)"
    }
  })
);

type TPaperComponent = {} & PaperProps;
function PaperComponent(props: TPaperComponent) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

export type TModalContent = CSEdgeSingular | CSNodeSingular | null;

type TModal = {
  editModalContent: TModalContent;
  setEditModalContent: (newContent: null) => void;
  handleConfirmButtonClick: (...params: any[]) => any;
};
const EditModal = React.memo(
  ({
    editModalContent,
    setEditModalContent,
    handleConfirmButtonClick
  }: TModal) => {
    const classes = useStyles();
    const { label, type }: TNodeData = editModalContent?.data() ?? {};
    const [value, setValue] = React.useState(label);
    const [typeOfQuestion, setTypeOfQuestion] = React.useState(type);

    React.useEffect(() => {
      if (editModalContent) {
        setValue(editModalContent.data().label);
        setTypeOfQuestion(editModalContent.data().type);
      }
    }, [editModalContent]);

    const handleClose = React.useCallback(() => {
      setEditModalContent(null);
    }, []);

    const handleConfirmClick = React.useCallback(() => {
      handleConfirmButtonClick(editModalContent, value, typeOfQuestion);

      handleClose();
    }, [editModalContent, value, typeOfQuestion]);

    const handleChange = (
      event: React.ChangeEvent<{ name?: string; value: unknown }>
    ) => {
      const newType = event.target.value;
      setTypeOfQuestion(newType as string);
    };

    return (
      <Dialog
        aria-labelledby="edit-dialog"
        aria-describedby="edit-a-node-dialog"
        className={classes.modal}
        open={!!editModalContent}
        onClose={handleClose}
        PaperComponent={PaperComponent}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
          className: classes.backdrop
        }}
      >
        <div className={classes.paper}>
          <div className={classes.titleContainer}>
            <h2 id="transition-modal-title">
              Изменить название {type === "question" ? "вопроса" : "связи"}
            </h2>
            <Divider />
          </div>
          <TextField
            placeholder="Начать печатать"
            variant="outlined"
            fullWidth
            autoFocus
            value={value}
            className={classes.inputField}
            onChange={({ target: { value } }) => setValue(value)}
          />
          <FormControl variant="outlined" className={classes.formControl}>
            <Select
              fullWidth
              value={typeOfQuestion}
              style={{ backgroundColor: "#ffffff" }}
              onChange={handleChange}
            >
              <MenuItem value={"question"}>Вопрос</MenuItem>
              <MenuItem value={"answer"}>Ответ</MenuItem>
            </Select>
            <FormHelperText>Укажите тип</FormHelperText>
          </FormControl>
          <div className={classes.buttonContainer}>
            <Button
              onClick={handleConfirmClick}
              className={classes.deleteButton}
            >
              Принять
            </Button>
            <Button
              onClick={handleClose}
              className={classes.cancelButton}
              variant="outlined"
            >
              Отмена
            </Button>
          </div>
        </div>
      </Dialog>
    );
  }
);

export default EditModal;
