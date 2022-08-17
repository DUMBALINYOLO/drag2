import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Divider from "@material-ui/core/Divider";
import InfoFab from "./InfoFab";
import styled from "@emotion/styled";

const useStyles = makeStyles((theme) => ({
  list: {
    width: 500,
    [theme.breakpoints.down("sm")]: {
      width: "100%"
    }
  }
}));

type TLegend = {
  open: boolean;
  setOpen: (value: boolean) => void;
  setSrc: (value: { url: string; title: string }) => void;
  src: {
    url: string;
    title: string;
  } | null;
};
export default function TemporaryDrawer({
  src,
  open,
  setOpen,
  setSrc
}: TLegend) {
  const classes = useStyles();

  const toggleDrawer = () => () => {
    setOpen(!open);
  };

  const handleClick = React.useCallback(
    (title, url) => () => {
      setOpen(false);
      setSrc({ title, url });
    },
    []
  );

  const list = () => (
    <div className={classes.list}>
      <div
        style={{
          fontWeight: "bold",
          fontSize: 20,
          textAlign: "center",
          padding: 10
        }}
      >
        Контроль:
      </div>
      <Divider style={{ backgroundColor: "black" }} />

      <Section>
        <div>
          <span style={{ textDecoration: "underline" }}>Context Menu</span>:
          Right click
        </div>
        <div>
          <span style={{ textDecoration: "underline" }}>Undo</span>: CTRL + Z
        </div>
        <div>
          <span style={{ textDecoration: "underline" }}>Redo</span>: CTRL + Y
        </div>
        <div style={{ fontSize: 14, fontStyle: "italic" }}>
          На Маке рекомендуется использовать клавишу CMD
        </div>
      </Section>
      <Divider style={{ backgroundColor: "black" }} />
      <Section>
        <div style={{ fontWeight: "bold", fontSize: 20 }}>Multi-select</div>
        <div>CTRL + drag</div>
        <Image
          onClick={handleClick(
            "Multi-select: CTRL + drag",
            "https://mkhoussid.s3.eu-central-1.amazonaws.com/gif1.gif"
          )}
          src="https://mkhoussid.s3.eu-central-1.amazonaws.com/gif1.gif"
          alt="gif1"
        />
        <div>CTRL + click</div>
        <Image
          onClick={handleClick(
            "Multi-select: CTRL + click",
            "https://mkhoussid.s3.eu-central-1.amazonaws.com/gif2.gif"
          )}
          src="https://mkhoussid.s3.eu-central-1.amazonaws.com/gif2.gif"
          alt="gif2"
        />
        <div>Только связи: CTRL + SHIFT + drag</div>
        <Image
          onClick={handleClick(
            "Multi-select только связи: CTRL + SHIFT + drag",
            "https://mkhoussid.s3.eu-central-1.amazonaws.com/gif12.gif"
          )}
          src="https://mkhoussid.s3.eu-central-1.amazonaws.com/gif12.gif"
          alt="gif12"
        />
      </Section>
      <Divider style={{ backgroundColor: "black" }} />
      <Section>
        <div style={{ fontWeight: "bold", fontSize: 20 }}>Multi-delete</div>
        <div>DEL (FN + Backspace на Мак)</div>
        <Image
          onClick={handleClick(
            "Multi-delete: DEL (FN + Backspace на Мак)",
            "https://mkhoussid.s3.eu-central-1.amazonaws.com/gif4.gif"
          )}
          src="https://mkhoussid.s3.eu-central-1.amazonaws.com/gif4.gif"
          alt="gif4"
        />
        <Image
          onClick={handleClick(
            "Multi-delete: DEL (FN + Backspace на Мак)",
            "https://mkhoussid.s3.eu-central-1.amazonaws.com/gif5.gif"
          )}
          src="https://mkhoussid.s3.eu-central-1.amazonaws.com/gif5.gif"
          alt="gif5"
        />
        <div>Через Context Menu:</div>
        <Image
          onClick={handleClick(
            "Multi-select",
            "https://mkhoussid.s3.eu-central-1.amazonaws.com/gif11.gif"
          )}
          src="https://mkhoussid.s3.eu-central-1.amazonaws.com/gif11.gif"
          alt="gif2"
        />
      </Section>
      <Divider style={{ backgroundColor: "black" }} />
      <Section>
        <div style={{ fontWeight: "bold", fontSize: 20 }}>Добавить связь</div>
        <Image
          onClick={handleClick(
            "Добавить связь",
            "https://mkhoussid.s3.eu-central-1.amazonaws.com/gif3.gif"
          )}
          src="https://mkhoussid.s3.eu-central-1.amazonaws.com/gif3.gif"
          alt="gif3"
        />
      </Section>
      <Divider style={{ backgroundColor: "black" }} />
      <Section>
        <div style={{ fontWeight: "bold", fontSize: 20 }}>Переименование</div>
        <Image
          onClick={handleClick(
            "Переименование",
            "https://mkhoussid.s3.eu-central-1.amazonaws.com/gif6.gif"
          )}
          src="https://mkhoussid.s3.eu-central-1.amazonaws.com/gif6.gif"
          alt="gif6"
        />
      </Section>
      <Divider style={{ backgroundColor: "black" }} />
      <Section>
        <div style={{ fontWeight: "bold", fontSize: 20 }}>Создать вопрос</div>
        <Image
          onClick={handleClick(
            "Создать вопрос",
            "https://mkhoussid.s3.eu-central-1.amazonaws.com/gif9.gif"
          )}
          src="https://mkhoussid.s3.eu-central-1.amazonaws.com/gif9.gif"
          alt="gif9"
        />
        <div style={{ fontWeight: "bold", fontSize: 20 }}>Создать ответ</div>
        <Image
          onClick={handleClick(
            "Создать ответ",
            "https://mkhoussid.s3.eu-central-1.amazonaws.com/gif8.gif"
          )}
          src="https://mkhoussid.s3.eu-central-1.amazonaws.com/gif8.gif"
          alt="gif8"
        />
      </Section>
      <Divider style={{ backgroundColor: "black" }} />
      <Section>
        <div style={{ fontWeight: "bold", fontSize: 20 }}>Reset layout</div>
        <Image
          onClick={handleClick(
            <div>
              Reset layout{" "}
              <span style={{ fontStyle: "italic", fontSize: 14 }}>
                (все изменения будут сохранены)
              </span>
            </div>,
            "https://mkhoussid.s3.eu-central-1.amazonaws.com/gif7.gif"
          )}
          src="https://mkhoussid.s3.eu-central-1.amazonaws.com/gif7.gif"
          alt="gif7"
        />
        <div style={{ fontSize: 14, fontStyle: "italic" }}>
          Все изменения будут сохранены
        </div>
      </Section>
      <Section>
        <div style={{ fontWeight: "bold", fontSize: 20 }}>Zoom-out</div>
        <Image
          onClick={handleClick(
            "Layout",
            "https://mkhoussid.s3.eu-central-1.amazonaws.com/gif10.gif"
          )}
          src="https://mkhoussid.s3.eu-central-1.amazonaws.com/gif10.gif"
          alt="gif7"
        />
      </Section>
      <Divider style={{ backgroundColor: "black" }} />
    </div>
  );

  return (
    <>
      <InfoFab src={src} open={open} setOpen={setOpen} />
      <Drawer
        className={classes.list}
        anchor={"left"}
        open={open}
        onClose={toggleDrawer()}
      >
        {list()}
      </Drawer>
    </>
  );
}

{
  /* <div>Все записывается в undo stack. Все движения (node/edge drag), </div> */
}

const Section = styled.div`
  padding: 20px;
`;

const Image = styled.img`
  width: 100%;
  border: 2px solid black;
  cursor: pointer;
  transition: 0.5s;
  opacity: 1;
  margin-top: 0.5rem;

  &:hover {
    opacity: 0.5;
    transform: scale(1.1);
    filter: brightness(0.85) blur(5px);
  }
`;
