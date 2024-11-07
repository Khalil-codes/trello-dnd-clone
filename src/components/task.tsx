"use client";

import { cn } from "@/lib/utils";
import { useTaskStore } from "@/store/board";
import { Task } from "@/types";
import { Trash2 } from "lucide-react";
import React, { memo } from "react";

type Props = {
  task: Task;
  isDragging?: boolean;
};

const TaskCard = memo(({ task, isDragging = false }: Props) => {
  const { id, title } = task;
  const remove = useTaskStore((state) => state.removeTask);

  // To mimic task dragging with it's own height
  if (isDragging) {
    return (
      <div className="mb-4 border-2 border-dashed border-gray-500 px-3 py-2">
        <div className="opacity-0">
          <h3 className="font-medium text-gray-700">{title}</h3>
        </div>
      </div>
    );
  }

  return (
    <div
      id={id}
      className={cn(
        "mb-4 flex items-start justify-between rounded-lg bg-gray-200 px-3 py-2 text-gray-900"
      )}>
      <div>
        <h3 className="font-medium text-gray-700">{title}</h3>
      </div>
      <button
        className="cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          remove(id);
        }}>
        <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-400" />
      </button>
    </div>
  );
});

TaskCard.displayName = "TaskCard";

export default TaskCard;
