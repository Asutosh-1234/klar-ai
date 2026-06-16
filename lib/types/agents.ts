export interface Agent {
  id: string;
  name: string;
  role: string;
  status: 'Idle' | 'Active' | 'Optimizing';
  description: string;
  tasksCompleted: number;
  accuracy: string;
}
