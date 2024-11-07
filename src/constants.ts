import { Column, Task } from "./types";
import { v4 as uuid } from "uuid";

export const COLUMNS: Column[] = [
  {
    id: "47ef1c0a-4fe4-4132-91ad-934e125da7cb",
    title: "Todo",
    status: "TODO",
  },
  {
    id: "057fe881-396e-4bfa-b51a-1c05468b1c63",
    title: "In Progress",
    status: "IN_PROGRESS",
  },
  {
    id: "5f1d6a0e-2b6f-4c05-9c5e-0e5d6a0e2b6f",
    title: "Done",
    status: "DONE",
  },
];

export const TASKS: Task[] = [
  {
    id: uuid(),
    title: "Task 1",
    column: "47ef1c0a-4fe4-4132-91ad-934e125da7cb",
  },
  {
    id: uuid(),
    title: "Task 2",
    column: "057fe881-396e-4bfa-b51a-1c05468b1c63",
  },
  {
    id: uuid(),
    title: "Task 3",
    column: "5f1d6a0e-2b6f-4c05-9c5e-0e5d6a0e2b6f",
  },
];
