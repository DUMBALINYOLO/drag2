import React from "react";
import {
  Core as CSCore,
  NodeSingular as CSNodeSingular,
  EdgeSingular as CSEdgeSingular,
  EdgeHandlesApi,
  EdgeCollection as CSEdgeCollection,
  NodeCollection as CSNodeCollection,
  Collection as CSCollection,
  CollectionReturnValue,
  EventObject as CSEventObject
} from "cytoscape";
import CytoscapeComponent from "react-cytoscapejs";
import stylesheet from "./stylesheet";
import layout from "./layout";
import { v4 } from "uuid";
import { loadCSS } from "fg-loadcss";
import { initialNodes, initialEdges } from "./elements";
import edgehandleDefaults, {
  CSEventHandlers,
  TCSEventHandlersIncludingInjected
} from "./edgehandles";
import { TEdge } from "./elements/edges";
import { TNode } from "./elements/nodes";
import { Global, css } from "@emotion/react";
import useUndoRedo from "../hooks/useUndoRedo";
import cytoscape from "cytoscape";
import cxtmenu from "cytoscape-cxtmenu";
import EditModal, { TModalContent } from "../EditModal";
import CreateModal from "../CreateModal";

import undoRedo from "cytoscape-undo-redo";
import Legend from "../Legend";
import LightboxImage from "../LightboxImage";

cytoscape.use(undoRedo);
cytoscape.use(cxtmenu);

type TBatchAction = {
  name: string;
  param:
    | {
        group: "nodes" | "edges";
        data: {
          id: string;
          source: string;
          target: string;
        };
        renderedPosition?: {
          x: number;
          y: number;
        };
        style: {
          [key: string]: string;
        };
      }
    | CSNodeSingular
    | CSEdgeSingular
    | CSNodeCollection
    | CSEdgeCollection;
};

export default React.memo(() => {
  const [open, setOpen] = React.useState(false);

  // for selecting only edges
  const [isSelectingEdges, setIsSelectingEdges] = React.useState(false);

  // For lightbox
  const [src, setSrc] = React.useState<{ url: string; title: string } | null>(
    null
  );

  React.useEffect(() => {
    setTimeout(() => {
      setOpen(true);
    }, 500);
  }, []);

  // Nodes and edges are handles separately
  const [nodes] = React.useState<TNode[]>(initialNodes);
  const [edges] = React.useState<TEdge[]>(initialEdges);

  // Counter for new next node (answer / question)
  const [newQuestionNode, setNewQuestionNode] = React.useState(
    nodes.filter(({ data: { type } }) => type === "question").length + 1
  );
  const [newAnswerNode, setNewAnswerNode] = React.useState(
    nodes.filter(({ data: { type } }) => type === "answer").length + 1
  );

  // Delete edge or node modal
  const [editModalContent, setEditModalContent] = React.useState<TModalContent>(
    null
  );
  // create modal
  const [showCreateModal, setShowCreateModal] = React.useState<{
    renderedPosition: { x: number; y: number };
    elements: CSCollection;
  } | null>(null);

  // Cytoscape instance
  const cyRef = React.useRef<CSCore | null>(null);
  // Edgehandles instance
  const ehRef = React.useRef<EdgeHandlesApi | null>(null);
  // Ctxmenu instance
  const ctxRef = React.useRef<any>(null);
  // UndoRedo instance
  const urRef = React.useRef<any>(null);

  useUndoRedo({ cy: cyRef, ur: urRef, setIsSelectingEdges });

  React.useEffect(() => {
    // Clean up
    return () => {
      if (cyRef.current) cyRef.current.destroy();
      if (ctxRef.current) ctxRef.current.destroy();
    };
  }, []);

  const initListeners = React.useCallback(() => {
    if (!cyRef.current) return;

    cyRef.current.on("boxend" as TCSEventHandlersIncludingInjected, (e, f) => {
      if (isSelectingEdges) {
        // fix race condition
        setTimeout(() => {
          if (cyRef.current) {
            const selected = cyRef.current.$(":selected");
            selected.forEach((element) => {
              if (element.isNode()) {
                element.unselect();
              }
            });
          }
        }, 0);
      }
    });

    cyRef.current.on("tap", "node", (e) => {
      const node: CSNodeSingular = e.target;
      ehRef.current?.hide();
      if (cyRef.current) {
        const selected = cyRef.current.$(":selected");

        if (selected.length === 1 && selected[0].id() === node.id()) {
          setEditModalContent(node);
        }
      }
    });

    // @ts-expect-error
    cyRef.current.on(
      "ehcomplete",
      (event, sourceNode, targetNode, addedEles) => {
        const sourceNodeType = sourceNode.data("type");
        const targetNodeType = targetNode.data("type");
        if (cyRef.current) {
          if (
            (targetNodeType === "answer" && sourceNodeType === "answer") ||
            (targetNodeType === "question" && sourceNodeType === "question")
          ) {
            if (cyRef.current) {
              // TODO toastr
              cyRef.current.remove(addedEles[0]);
            }
          } else {
            cyRef.current.remove(addedEles[0]);
            const actions = [];
            actions.push({
              name: "add",
              param: {
                group: "edges",
                data: {
                  id: addedEles[0].id(),
                  source: sourceNode.id(),
                  target: targetNode.id()
                }
                // position: { x: 100, y: 200 },
                // style: { 'background-color': 'darkgreen' },
              }
            });

            urRef.current.do("batch", actions);
          }
        }
      }
    );
  }, [nodes, isSelectingEdges]);

  const unbindListeners = React.useCallback(() => {
    if (!cyRef.current) return;

    CSEventHandlers.forEach((handler) => {
      if (cyRef.current) {
        cyRef.current.unbind(handler as TCSEventHandlersIncludingInjected);
      }
    });
  }, []);

  const handleCreateNodes = React.useCallback(
    ({ name: questionNode, type, answers }) => {
      console.log("new content", { questionNode, type, answers });
      console.log("showCreateModal", showCreateModal);

      // @ts-ignore
      const { renderedPosition, elements } = showCreateModal;
      const questionActions = [];
      // add main root question node
      questionActions.push({
        name: "add",
        param: {
          group: "nodes",
          data: {
            id: questionNode,
            label: questionNode,
            type: type
          },
          renderedPosition: renderedPosition
        }
      });

      const answerActions: any = [];
      const edgeActions: any = [];
      if (answers.length) {
        //@ts-ignore
        answers.forEach(({ name: answerNode, type, target }) => {
          // add any answers to this question
          answerActions.push({
            name: "add",
            param: {
              group: "nodes",
              data: {
                id: answerNode,
                label: answerNode,
                type: type
              },
              renderedPosition: {
                x:
                  renderedPosition.x -
                  250 +
                  Math.floor(Math.random() * 400) +
                  1,
                y: renderedPosition.y + 75
              }
            }
          });

          // include edge between root and this question
          edgeActions.push({
            name: "add",
            param: {
              group: "edges",
              data: {
                id: v4(),
                source: questionNode, // root node
                target: answerNode // this node
              }
            }
          });

          if (target) {
            // include child edges between other nodes
            edgeActions.push({
              name: "add",
              param: {
                group: "edges",
                data: {
                  id: v4(),
                  source: answerNode, // this node
                  target: target // child node
                }
              }
            });
          }
        });
      }

      urRef.current.do("batch", [
        ...questionActions,
        ...answerActions,
        ...edgeActions
      ]);
      setNewQuestionNode(newQuestionNode + 1);
      setShowCreateModal(null);
    },
    [showCreateModal]
  );

  const init = React.useCallback(
    (cy: CSCore) => {
      if (!cyRef.current) {
        cyRef.current = cy;
      }

      unbindListeners();
      initListeners();

      ehRef.current = cyRef.current.edgehandles(edgehandleDefaults);

      ctxRef.current = cyRef.current.cxtmenu({
        selector: "core",
        // activeFillColor: 'rgba(48, 163, 44, 0.75)',
        commands: [
          {
            content: '<span class="fas fa-question fa-2x"></span>',
            select: (core: CSCore, { renderedPosition }: CSEventObject) => {
              setShowCreateModal({
                elements: core.elements(),
                renderedPosition
              });
            }
          },
          {
            content: '<span class="fas fa-edit fa-2x"></span>',
            select: (core: CSCore, { renderedPosition }: CSEventObject) => {
              const actions = [];
              actions.push({
                name: "add",
                param: {
                  group: "nodes",
                  data: {
                    id: newAnswerNode.toString(),
                    label: `Ответ ${newAnswerNode.toString()}`,
                    type: "answer"
                  },
                  renderedPosition: renderedPosition
                  // style: { 'background-color': 'darkgreen' },
                }
              });

              urRef.current.do("batch", actions);

              setNewAnswerNode(newAnswerNode + 1);
            }
          },
          {
            content: '<span class="fas fa-search-minus fa-2x"></span>',
            select: () => {
              cyRef.current?.fit();
            }
          },
          {
            content: '<span class="fas fa-undo fa-2x"></span>',
            select: () => {
              cyRef.current?.layout(layout).run();
            }
          }
        ]
      });

      ctxRef.current = cyRef.current.cxtmenu({
        selector: "core",
        css: {
          opacity: 0.2
        }
      });

      ctxRef.current = cyRef.current.cxtmenu({
        selector: "edge",
        commands: [
          {
            content: '<span class="fas fa-trash fa-2x"></span>',
            select: (edge: CSEdgeSingular) => {
              handleDeleteElements(edge);
            }
          },

          {
            content: '<span class="fas fa-minus-circle fa-2x"></span>',
            select: (edge: CSEdgeSingular) => {
              console.log(edge.data("name"));
            },
            enabled: false
          }
        ]
      });

      ctxRef.current = cyRef.current.cxtmenu({
        selector: "node",
        commands: [
          {
            content: '<span class="fas fa-pen fa-2x"></span>',
            select: (node: CSNodeSingular) => {
              ehRef.current?.hide();
              setEditModalContent(node);
            }
          },

          {
            content: '<span class="fas fa-minus-circle fa-2x"></span>',
            select: (node: CSNodeSingular) => {
              console.log(node.data("name"));
            },
            enabled: false
          },

          {
            content: '<span class="fas fa-trash fa-2x"></span>',
            select: (node: CSNodeSingular) => {
              handleDeleteElements(node);
            }
          }
        ]
      });

      urRef.current = cyRef.current.undoRedo({
        isDebug: false, // Debug mode for console messages
        actions: {}, // actions to be added
        undoableDrag: true, // Whether dragging nodes are undoable can be a function as well
        stackSizeLimit: undefined, // Size limit of undo stack, note that the size of redo stack cannot exceed size of undo stack
        ready: function () {}
      }); // Can also be set whenever wanted.

      urRef.current.action(
        "changeData",
        ({
          node,
          label,
          type
        }: {
          node: CSNodeSingular;
          label: string;
          type: string;
        }) => {
          // first, remove the nodes and all of its edges
          const removeActions: TBatchAction[] = [];
          removeActions.push({
            name: "remove",
            param: node
          });
          removeActions.push({
            name: "remove",
            param: node.connectedEdges()
          });
          // then, re-add everything to graph with new data for node
          const addActions: any = [];
          addActions.push({
            name: "add",
            param: {
              group: "nodes",
              data: { id: node.id(), label: label, type: type },
              position: node.position()
              // style: { 'background-color': 'darkgreen' },
            }
          });
          node.connectedEdges().forEach((edge: CSEdgeSingular) => {
            addActions.push({
              name: "add",
              param: {
                group: "edges",
                data: {
                  id: edge.id(),
                  source: edge.source().id(),
                  target: edge.target().id()
                }
              }
            });
          });
          urRef.current.do("batch", [...removeActions, ...addActions]);
        },
        () => urRef.current.undo()
      );
    },
    [nodes, newQuestionNode, newAnswerNode, isSelectingEdges]
  );

  const addElementIfNotExists = React.useCallback(
    (
      element: CSEdgeSingular | CSNodeSingular,
      selected: CollectionReturnValue
    ) => {
      const exists = selected.some((selectedElement) => {
        // @ts-expect-error
        return selectedElement.id() === element.id();
      });

      // @ts-expect-error
      if (!exists) selected.push(element);
    },
    []
  );

  const handleDeleteElements = React.useCallback(
    (element: CSEdgeSingular | CSNodeSingular) => {
      if (urRef.current && cyRef.current) {
        const selected = cyRef.current.$(":selected");

        addElementIfNotExists(element, selected);
        // cyRef.current?.remove(elementsToDelete);

        const actions: TBatchAction[] = [];
        actions.push({
          name: "remove",
          param: selected
        });

        urRef.current.do("batch", actions);
      }
    },
    []
  );

  const handleUpdateTitleOrType = React.useCallback(
    (node, newLabel, typeOfQuestion) => {
      urRef.current.do("changeData", {
        node,
        label: newLabel,
        type: typeOfQuestion
      });
    },
    []
  );

  React.useEffect(() => {
    const fa = loadCSS(
      "https://use.fontawesome.com/releases/v5.12.0/css/all.css",
      document.querySelector("#font-awesome-css")
    );

    return () => {
      fa.parentNode!.removeChild(fa);
    };
  }, []);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        maxWidth: "100vw",
        maxHeight: "100vh"
      }}
    >
      <Global
        styles={css`
          * {
            outline: none;
            font-family: "Poppins", sans-serif;
            font-weight: 300;
          }
          .cxtmenu-disabled {
            opacity: 0.333;
          }
        `}
      />

      {/* <div id='undoRedoList'>
				<span style={{ color: 'darkslateblue', fontWeight: 'bold' }}>Log</span>
				<div id='undos' style={{ paddingBottom: 20, position: 'absolute', left: 40, top: 40 }} />
			</div> */}

      <CytoscapeComponent
        elements={CytoscapeComponent.normalizeElements({
          nodes: nodes,
          edges: edges
        })}
        layout={layout}
        cy={(cy) => init(cy)}
        stylesheet={stylesheet}
        style={{
          width: "100vw",
          height: "100vh"
        }}
      />
      <Legend src={src} setSrc={setSrc} open={open} setOpen={setOpen} />
      <EditModal
        editModalContent={editModalContent}
        setEditModalContent={setEditModalContent}
        handleConfirmButtonClick={handleUpdateTitleOrType}
      />
      <CreateModal
        handleConfirmButtonClick={handleCreateNodes}
        showCreateModal={showCreateModal}
        setShowCreateModal={setShowCreateModal}
      />
      <LightboxImage src={src} setSrc={setSrc} />
    </div>
  );
});
