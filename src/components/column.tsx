import React from "react";
import TaskCard from "./task";
import Sortable from "./sortable";
import { SortableContext } from "@dnd-kit/sortable";
import { Task } from "@/types";
import { Trash2 } from "lucide-react";
import { useTaskStore } from "@/store/board";

type Props = {
  id: string;
  title: string;
  tasks: Task[];
};

const Column = ({ id, title, tasks = [] }: Props) => {
  const remove = useTaskStore((state) => state.removeColumn);
  const update = useTaskStore((state) => state.updateColumn);
  return (
    <Sortable
      className="flex h-[700px] max-h-[700px] flex-col"
      id={id}
      as="section"
      data={{ id, type: "column" }}>
      {(listeners, attributes, isDragging) => {
        if (isDragging) {
          return (
            <div className="h-full w-[300px] border-2 border-dashed border-gray-500" />
          );
        }
        return (
          <>
            <div className="relative">
              <div className="flex justify-between gap-4">
                <input
                  defaultValue={title}
                  onBlur={(e) => {
                    update(id, e.target.value);
                  }}
                  className="w-fit bg-transparent outline-none"
                />
                <button
                  className="absolute -top-6 left-1/2 h-4 w-10 -translate-x-1/2 cursor-pointer rounded-full bg-gray-400"
                  {...attributes}
                  {...listeners}
                />
                <button
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    remove(id);
                  }}>
                  <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-400" />
                </button>
              </div>
            </div>
            <div className="mt-3 h-full w-[300px] rounded-xl bg-gray-700/50 p-4">
              <SortableContext items={tasks.map((task) => task.id)}>
                {tasks.length > 0 ? (
                  tasks.map((task) => (
                    <Sortable
                      as={"div"}
                      key={task.id}
                      id={task.id}
                      data={{ type: "task" }}>
                      {(listeners, attributes, isDragging) => {
                        return (
                          <div {...listeners} {...attributes}>
                            <TaskCard
                              key={task.id}
                              task={task}
                              isDragging={isDragging}
                            />
                          </div>
                        );
                      }}
                    </Sortable>
                  ))
                ) : (
                  <p className="flex flex-1 items-center justify-center text-muted">
                    No Tasks in this column
                  </p>
                )}
              </SortableContext>
            </div>
          </>
        );
      }}
    </Sortable>
  );
};

export default Column;
