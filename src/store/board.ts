import { create } from "zustand";
import { Column, Task } from "../types";
import { v4 as uuid } from "uuid";
import { COLUMNS, TASKS } from "@/constants";
import { arrayMove } from "@dnd-kit/sortable";

export type State = {
  tasks: Task[];
  columns: Column[];
};

export type Actions = {
  addTask: (title: string) => void;
  removeTask: (id: string) => void;
  updateTask: (id: string, columnId: string) => void;
  moveTask: (activeId: number, overId: number) => void;

  addColumn: () => void;
  removeColumn: (id: string) => void;
  updateColumn: (id: string, title: string) => void;
  moveColumn: (activeId: string, overId: string) => void;
};

export const useTaskStore = create<State & Actions>((set) => ({
  tasks: TASKS,
  columns: COLUMNS,
  addTask: (title) =>
    set((state) => ({
      tasks: [
        ...state.tasks,
        { id: uuid(), column: state.columns[0].id, title: title },
      ],
    })),
  removeTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    })),
  updateTask: (id, columnId) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, column: columnId } : task
      ),
    })),

  moveTask: (activeIdx, overIdx) => {
    set((state) => ({
      tasks: arrayMove(state.tasks, activeIdx, overIdx),
    }));
  },

  addColumn: () =>
    set((state) => {
      const title = `Column ${state.columns.length + 1}`;
      return {
        columns: [
          {
            id: uuid(),
            title,
            status: title.toUpperCase().replace(" ", "_"),
          },
          ...state.columns,
        ],
      };
    }),
  removeColumn: (id) =>
    set((state) => ({
      columns: state.columns.filter((column) => column.id !== id),
      tasks: state.tasks.filter((task) => task.column !== id),
    })),

  updateColumn: (id, title) =>
    set((state) => {
      return {
        columns: state.columns.map((column) =>
          column.id === id ? { ...column, title } : column
        ),
      };
    }),

  moveColumn: (activeId, overId) => {
    set((state) => {
      const columns = [...state.columns];
      const activeIndex = columns.findIndex((column) => column.id === activeId);
      const overIndex = columns.findIndex((column) => column.id === overId);

      const newColumns = arrayMove(columns, activeIndex, overIndex);
      return {
        columns: newColumns,
      };
    });
  },
}));
