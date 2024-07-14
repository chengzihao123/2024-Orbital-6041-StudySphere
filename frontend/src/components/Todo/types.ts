export interface Todo {
    id: string;
    deadline: string;
    priority: string;
    status: string;
    completed: boolean;
    taskName: string;
    taskDescription: string;
    userId: string;
    notified: boolean;
  }
  
  export interface Filter {
    date: string;
    priority: string;
    status: string;
  }