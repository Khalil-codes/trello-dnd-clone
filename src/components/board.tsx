"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";

import {
  closestCenter,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";

import { Column as ColumnType, Task as TaskType } from "@/types";
import Column from "./column";
import TaskCard from "./task";
import { useTaskStore } from "@/store/board";
import CreateTask from "./create-task";
import { Button } from "./ui/button";

// To prevent hydration errors
const DndContext = dynamic(
  () => import("@dnd-kit/core").then((mod) => mod.DndContext),
  { ssr: false }
);

const Board = () => {
  const { tasks, columns, moveColumn, moveTask, addColumn } = useTaskStore();
  // To keep track of which column is active/dragged
  const [activeColumn, setActiveColumn] = useState<ColumnType | null>(null);

  // To keep track of which task is active/dragged
  const [activeTask, setActiveTask] = useState<TaskType | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 10 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const onDragStart = (event: DragStartEvent) => {
    const { active } = event;
    if (!active) {
      return;
    }

    if (active.data.current?.type === "column") {
      const column = columns.find((column) => column.id === active.id);
      console.log(column);
      if (!column) {
        return;
      }

      setActiveColumn(column);
    }

    if (active.data.current?.type === "task") {
      const task = tasks.find((task) => task.id === active.id);
      if (!task) {
        return;
      }
      setActiveTask(task);
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!active || !over) {
      return;
    }

    if (active.data.current?.type === "column") {
      const activeColId = active.id as string;
      const overColId = over.id as string;

      if (activeColId === overColId) return;

      moveColumn(activeColId, overColId);
    }

    setActiveColumn(null);
    setActiveTask(null);
  };

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!active || !over) {
      return;
    }

    const isActiveTask = active.data.current?.type === "task";
    const isOverTask = over.data.current?.type === "task";

    if (isActiveTask && isOverTask) {
      const activeIndex = tasks.findIndex((task) => task.id === active.id);
      const overIndex = tasks.findIndex((task) => task.id === over.id);

      if (activeIndex === overIndex) return;

      tasks[activeIndex].column = tasks[overIndex].column;

      moveTask(activeIndex, overIndex);
      return;
    }
    if (isActiveTask && over.data.current?.type === "column") {
      const activeIndex = tasks.findIndex((task) => task.id === active.id);
      tasks[activeIndex].column = over.data.current?.id;

      moveTask(activeIndex, activeIndex);
      return;
    }
  };

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-4 px-6">
      <h1 className="text-3xl font-bold">Trello DnD Clone</h1>
      <div className="flex gap-4">
        <CreateTask />
        <Button size="sm" variant="secondary" onClick={() => addColumn()}>
          Add Column
        </Button>
      </div>
      <div className="overflow-auto">
        <DndContext
          sensors={sensors}
          onDragEnd={onDragEnd}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          collisionDetection={closestCenter}>
          <div className="mt-10 flex flex-1 gap-6 lg:gap-12">
            <SortableContext items={columns.map((column) => column.id)}>
              {columns.map((column) => (
                <Column
                  key={column.id}
                  title={column.title}
                  id={column.id}
                  tasks={tasks.filter((task) => task.column === column.id)}
                />
              ))}
            </SortableContext>
          </div>
          <DragOverlay>
            {activeColumn ? (
              <Column
                title={activeColumn.title}
                id={activeColumn.id}
                tasks={tasks.filter((task) => task.column === activeColumn.id)}
              />
            ) : null}

            {activeTask ? <TaskCard task={activeTask} /> : null}
          </DragOverlay>
        </DndContext>
      </div>
    </section>
  );
};

export default Board;
