import { v4 } from "uuid";
import { TNode } from "./nodes";

interface IEdgeBasic {
  source: TNode["data"]["id"];
  target: TNode["data"]["id"];
  id: string;
}

interface IEdgeWithLabelAndType extends IEdgeBasic {
  label: string;
  type: "labeled";
}

interface IEdgeWithOutLabelAndType extends IEdgeBasic {
  label?: never;
  type?: never;
}

export type TEdgeData = IEdgeWithOutLabelAndType | IEdgeWithLabelAndType;
export type TEdge = {
  data: TEdgeData;
};

const edges: TEdge[] = [
  {
    data: {
      id: v4(),
      source: "entry",
      target: "Вопрос 1"
    }
  },
  {
    data: {
      id: v4(),
      source: "Вопрос 1",
      target: "Ответ 1.1"
    }
  },
  {
    data: {
      id: v4(),
      source: "Вопрос 1",
      target: "Ответ 1.2"
    }
  },
  {
    data: {
      id: v4(),
      source: "Вопрос 1",
      target: "Ответ 1.3"
    }
  },
  {
    data: {
      id: v4(),
      source: "Вопрос 1",
      target: "Ответ 1.4"
    }
  },
  {
    data: {
      id: v4(),
      source: "Вопрос 1",
      target: "Ответ 1.5"
    }
  },
  {
    data: {
      id: v4(),
      source: "Ответ 1.1",
      target: "Вопрос 2"
    }
  },
  {
    data: {
      id: v4(),
      source: "Ответ 1.2",
      target: "Вопрос 2"
    }
  },
  {
    data: {
      id: v4(),
      source: "Ответ 1.3",
      target: "Вопрос 2"
    }
  },
  {
    data: {
      id: v4(),
      source: "Ответ 1.4",
      target: "Вопрос 3"
    }
  },
  {
    data: {
      id: v4(),
      source: "Ответ 1.5",
      target: "Вопрос 3"
      // label: '×',
      // type: 'labeled',
    }
  },
  {
    data: {
      id: v4(),
      source: "Вопрос 3",
      target: "Ответ 3.1"
    }
  },
  {
    data: {
      id: v4(),
      source: "Ответ 3.1",
      target: "Вопрос 6"
    }
  },
  {
    data: {
      id: v4(),
      source: "Вопрос 6",
      target: "Ответ 6.1"
    }
  },
  {
    data: {
      id: v4(),
      source: "Вопрос 6",
      target: "Ответ 6.2"
    }
  },
  {
    data: {
      id: v4(),
      source: "Вопрос 6",
      target: "Ответ 6.3"
    }
  },
  {
    data: {
      id: v4(),
      source: "Вопрос 2",
      target: "Ответ 2.1"
    }
  },
  {
    data: {
      id: v4(),
      source: "Вопрос 2",
      target: "Ответ 2.2"
    }
  },
  {
    data: {
      id: v4(),
      source: "Вопрос 2",
      target: "Ответ 2.3"
    }
  },
  {
    data: {
      id: v4(),
      source: "Вопрос 2",
      target: "Ответ 2.4"
    }
  },
  {
    data: {
      id: v4(),
      source: "Ответ 2.1",
      target: "Вопрос 4"
    }
  },
  {
    data: {
      id: v4(),
      source: "Ответ 2.2",
      target: "Вопрос 4"
    }
  },
  {
    data: {
      id: v4(),
      source: "Ответ 2.3",
      target: "Вопрос 5"
    }
  },
  {
    data: {
      id: v4(),
      source: "Ответ 2.4",
      target: "Вопрос 5"
    }
  },
  {
    data: {
      id: v4(),
      source: "Вопрос 4",
      target: "Ответ 4.1"
    }
  },
  {
    data: {
      id: v4(),
      source: "Вопрос 4",
      target: "Ответ 4.2"
    }
  },
  {
    data: {
      id: v4(),
      source: "Ответ 4.1",
      target: "exit1"
    }
  },
  {
    data: {
      id: v4(),
      source: "Ответ 4.2",
      target: "final-page"
    }
  },
  {
    data: {
      id: v4(),
      source: "Вопрос 5",
      target: "Ответ 5.1"
    }
  },
  {
    data: {
      id: v4(),
      source: "Ответ 5.1",
      target: "final-page"
    }
  },
  {
    data: {
      id: v4(),
      source: "Ответ 6.1",
      target: "final-page"
    }
  },
  {
    data: {
      id: v4(),
      source: "Ответ 6.2",
      target: "final-page"
    }
  },
  {
    data: {
      id: v4(),
      source: "Ответ 6.3",
      target: "final-page"
    }
  },
  {
    data: {
      id: v4(),
      source: "final-page",
      target: "exit2",
      label: "×",
      type: "labeled"
    }
  }
];

export default edges;
