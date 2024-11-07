export type Column = {
  id: string;
  title: string;
  status: string;
};

export type Task = {
  id: string;
  title: string;
  description?: string;
  column: string;
};
