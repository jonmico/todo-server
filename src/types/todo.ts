export interface Todo {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  completed: number;
  due_date: Date | null;
  created_at: Date;
  updated_at: Date;
}
