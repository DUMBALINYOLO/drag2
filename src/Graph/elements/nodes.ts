export type TNodeData = {
  id: string;
  label: string;
  type: string;
};

export type TNode = {
  data: TNodeData;
};

const nodes: TNode[] = [
  { data: { id: "entry", label: "Начало", type: "entry" } },
  { data: { id: "exit1", label: "Конец 1", type: "exit1" } },
  { data: { id: "exit2", label: "Конец 2", type: "exit2" } },
  {
    data: { id: "final-page", label: "Последняя страница", type: "final-page" }
  },

  { data: { id: "Вопрос 1", label: "Вопрос 1", type: "question" } },
  { data: { id: "Вопрос 2", label: "Вопрос 2", type: "question" } },
  { data: { id: "Вопрос 3", label: "Вопрос 3", type: "question" } },
  { data: { id: "Вопрос 4", label: "Вопрос 4", type: "question" } },
  { data: { id: "Вопрос 5", label: "Вопрос 5", type: "question" } },
  { data: { id: "Вопрос 6", label: "Вопрос 6", type: "question" } },

  { data: { id: "Ответ 1.1", label: "Ответ 1.1", type: "answer" } },
  { data: { id: "Ответ 1.2", label: "Ответ 1.2", type: "answer" } },
  { data: { id: "Ответ 1.3", label: "Ответ 1.3", type: "answer" } },
  { data: { id: "Ответ 1.4", label: "Ответ 1.4", type: "answer" } },
  { data: { id: "Ответ 1.5", label: "Ответ 1.5", type: "answer" } },

  { data: { id: "Ответ 2.1", label: "Ответ 2.1", type: "answer" } },
  { data: { id: "Ответ 2.2", label: "Ответ 2.2", type: "answer" } },
  { data: { id: "Ответ 2.3", label: "Ответ 2.3", type: "answer" } },
  { data: { id: "Ответ 2.4", label: "Ответ 2.4", type: "answer" } },

  { data: { id: "Ответ 3.1", label: "Ответ 3.1", type: "answer" } },

  { data: { id: "Ответ 4.1", label: "Ответ 4.1", type: "answer" } },
  { data: { id: "Ответ 4.2", label: "Ответ 4.2", type: "answer" } },

  { data: { id: "Ответ 5.1", label: "Ответ 5.1", type: "answer" } },

  { data: { id: "Ответ 6.1", label: "Ответ 6.1", type: "answer" } },
  { data: { id: "Ответ 6.2", label: "Ответ 6.2", type: "answer" } },
  { data: { id: "Ответ 6.3", label: "Ответ 6.3", type: "answer" } }
];

export default nodes;
