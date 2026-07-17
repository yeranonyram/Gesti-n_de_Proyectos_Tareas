import api from '../api/client';


export interface TaskStats {

  total:number;

  byStatus:{
    pending?:number;
    in_progress?:number;
    completed?:number;
  };

  byPriority:{
    low?:number;
    medium?:number;
    high?:number;
  };

  overdue:number;

  completedLast7Days:number;

}



class StatsService {


  async getTaskStats():Promise<TaskStats>{

    const response =
      await api.get('/tasks/stats');


    return response.data;

  }


}


export default new StatsService();