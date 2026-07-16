export interface Task {

    id: number;
    title: string;
    description?: string;
    status:| 'pending'| 'in_progress'| 'completed';
    priority:| 'low'| 'medium'| 'high';
    dueDate?: string;
    projectId: number;
    createdAt: string;
    updatedAt: string;

}