import React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Backdrop from "@material-ui/core/Backdrop";
import { Collection as CSCollection } from "cytoscape";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import {
  Button,
  Divider,
  IconButton,
  InputAdornment,
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

const useStyles = makeStyles<Theme>((theme) =>
  createStyles({
    modal: {
      displaay: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      border: "2px solid #34c240",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      width: 450,
      [theme.breakpoints.down("sm")]: {
        width: "80vw"
      },
      maxHeight: 600,
      overflow: "scroll"
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
      // padding: theme.spacing(2, 0, 2, 0),
      borderColor: theme.palette.primary.main
    },
    inputAnswerField: {
      padding: theme.spacing(2, 0, 0, 0),
      borderColor: theme.palette.primary.main
    },
    deleteIcon: {
      color: theme.palette.primary.main
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

type TModal = {
  showCreateModal: {
    renderedPosition: { x: number; y: number };
    elements: CSCollection;
  } | null;
  setShowCreateModal: (value: null) => void;
  handleConfirmButtonClick: (...params: any[]) => void;
};
const CreateNodesDialogue = React.memo(
  ({
    showCreateModal,
    setShowCreateModal,
    handleConfirmButtonClick
  }: TModal) => {
    const classes = useStyles();
    const [error, setError] = React.useState<string | null>(null);
    const [createContent, setCreateContent] = React.useState<{
      name: string;
      type: string;
      answers: Array<{ name: string; type: "answer"; target?: string }>;
    }>({
      name: "",
      type: "question",
      answers: []
    });

    const { name, type, answers } = createContent;

    const handleClose = React.useCallback(() => {
      setShowCreateModal(null);
    }, []);

    const handleConfirmClick = React.useCallback(() => {
      setError(null);
      let error = null;

      // @ts-ignore
      showCreateModal?.elements.some((element) => {
        // @ts-ignore
        const questionNameSame =
          element.data().id.toLowerCase().split(" ").join("") ===
          name.toLowerCase().split(" ").join("");
        if (questionNameSame) {
          error = name;
          return true;
        }

        answers.some(({ name }) => {
          // @ts-ignore
          const answerNameSame =
            element.data().id.toLowerCase().split(" ").join("") ===
            name.toLowerCase().split(" ").join("");
          if (answerNameSame) {
            error = name;
            return true;
          }
        });
      });

      if (name === "" || answers.find(({ name }) => name === "")) {
        return setError("");
      }

      if (error) {
        // name is not unique
        setError(error);
      } else {
        handleConfirmButtonClick(createContent);
        setCreateContent({
          name: "",
          type: "question",
          answers: []
        });
        handleClose();
      }
    }, [createContent]);

    const handleChange = (
      event: React.ChangeEvent<{ name?: string; value: unknown }>,
      field: "name" | "type"
    ) => {
      setError(null);
      const value = event.target.value;
      setCreateContent({
        ...createContent,
        [field]: value
      });
    };

    const handleAddAnswer = React.useCallback(() => {
      setCreateContent({
        ...createContent,
        answers: [...createContent.answers, { name: "", type: "answer" }]
      });
    }, [createContent]);

    const handleAnswerChange = React.useCallback(
      (
        event: React.ChangeEvent<{
          name?: string | undefined;
          value: unknown;
        }>,
        index: number,
        field: "name" | "target"
      ) => {
        setError(null);
        const newAnswers = [...answers];
        //@ts-ignore
        newAnswers[index][field] = event.target!.value;
        setCreateContent({ ...createContent, answers: newAnswers });
      },
      [createContent]
    );

    const handleRemoveQuestion = React.useCallback(
      (index) => {
        const newAnswers = [...createContent.answers];
        newAnswers.splice(index, 1);
        setCreateContent({
          ...createContent,
          answers: newAnswers
        });
      },
      [createContent]
    );

    return (
      <Dialog
        className={classes.modal}
        open={!!showCreateModal}
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
          <div id="draggable-dialog-title" className={classes.titleContainer}>
            <h2 id="transition-modal-title">Добавить вопрос</h2>
            <Divider />
          </div>
          <TextField
            placeholder="Начать печатать"
            variant="outlined"
            fullWidth
            autoFocus
            value={name}
            className={classes.inputField}
            onChange={(e) => handleChange(e, "name")}
            error={name === error}
            helperText={
              name === error ? "Это название не уникальное" : "Укажите название"
            }
          />
          <FormControl variant="outlined" className={classes.formControl}>
            <Select
              fullWidth
              value={type}
              style={{ backgroundColor: "#ffffff", cursor: "not-allowed" }}
              onChange={(e) => handleChange(e, "type")}
              disabled
            >
              <MenuItem value={"question"}>Вопрос</MenuItem>
              <MenuItem value={"answer"}>Ответ</MenuItem>
            </Select>
            <FormHelperText>Укажите тип</FormHelperText>
          </FormControl>
          {answers.map((answer, index) => (
            <div key={`answer-${index}`}>
              <TextField
                placeholder="Начать печатать"
                variant="outlined"
                fullWidth
                autoFocus
                value={answer.name}
                className={classes.inputAnswerField}
                onChange={(e) => handleAnswerChange(e, index, "name")}
                error={answer.name === error}
                helperText={
                  answer.name === error
                    ? "Это название не уникальное"
                    : "Укажите название ответа"
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="remove-question"
                        onClick={() => handleRemoveQuestion(index)}
                      >
                        <DeleteIcon className={classes.deleteIcon} />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              <FormControl variant="outlined" className={classes.formControl}>
                <Select
                  fullWidth
                  value={answer.target}
                  style={{ backgroundColor: "#ffffff" }}
                  onChange={(e) => handleAnswerChange(e, index, "target")}
                >
                  {showCreateModal?.elements
                    .nodes()
                    .filter((ele: any) => {
                      if (ele.data("type") === "question") {
                        return ele;
                      }
                    })
                    .map((node) => (
                      <MenuItem value={node.id()}>
                        {node.data("label")}
                      </MenuItem>
                    ))}
                </Select>
                <FormHelperText>
                  Необязательно - Укажите, на какой вопрос этот ответ перейдет
                </FormHelperText>
              </FormControl>
            </div>
          ))}
          <div
            onClick={handleAddAnswer}
            style={{ color: "#34c240", cursor: "pointer" }}
          >
            Добавить ответ
            <IconButton>
              <AddIcon style={{ color: "#34c240" }} />
            </IconButton>
          </div>
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

export default CreateNodesDialogue;
