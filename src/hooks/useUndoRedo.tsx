import React from "react";

type TUseUndoRedo = {
  ur: any;
  cy: any;
  setIsSelectingEdges: (val: boolean) => void;
};
export default function useUndoRedo({
  ur,
  cy,
  setIsSelectingEdges
}: TUseUndoRedo) {
  const handleKeydown = React.useCallback((e: KeyboardEvent) => {
    setIsSelectingEdges(false);
    if (e.which === 46) {
      var selecteds = cy.current.$(":selected");
      if (selecteds.length > 0) ur.current.do("remove", selecteds);
      // @ts-ignore
    } else if (
      (e.ctrlKey || e.metaKey) &&
      e.shiftKey &&
      e.target.nodeName === "BODY"
    ) {
      setIsSelectingEdges(true);
      // @ts-ignore
    } else if ((e.ctrlKey || e.metaKey) && e.target.nodeName === "BODY") {
      if (e.which === 90) ur.current.undo();
      else if (e.which === 89) ur.current.redo();
    }
  }, []);
  React.useEffect(() => {
    window.addEventListener("keydown", handleKeydown);

    return () => window.removeEventListener("keydown", handleKeydown);
  }, []);
}
