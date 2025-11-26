export type Todo = {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  stateId: string;
};