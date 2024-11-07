import http from '../index';

//查询所有计划任务
export const all_cron_task = (data:object) => {
    return http.get('/api/all/cron_task',{params: data});
  }


//创建计划任务
export const add_cron_task = (data:object) => {
    const formDataConfig = {
        headers: {
            'Content-Type': 'application/json',
          },
        };
    return http.post('/api/add_cron_task', data, formDataConfig);
  };


// 查询单个ecs_mysql服务器信息
export const get_cron_task = (id:number) => {
    return http.get(`/api/cron_task/${id}`);
};


// 删除单个ecs_mysql服务器信息
export const del_cron_task = (id:number) => {
    return http.delete(`/api/cron_task/${id}`);
};
  
// 编辑单个idd的mysql信息
export const update_cron_task = (id:number,data:object) => {
const JsonConfig = {
headers: {
    'Content-Type': 'application/json',
},
};
return http.put(`/api/cron_task/${id}`,data,JsonConfig);
};

//新建apscheduler任务
export const add_scheduler_task = (id:number) => {
    return http.post(`/api/add_scheduler_task/${id}`);
  };

//查询全部scheduler_task
export const all_scheduler_task = (data:object) => {
    return http.get('/api/all/scheduler_task',{params: data});
  }

//查询单独id scheduler_task
export const get_scheduler_task = (id:number) => {
    return http.post(`/api/scheduler_task/${id}`);
  };

//start任务，一般开启用新建scheduler任务就行了
export const start_scheduler_task = (id:number) => {
    return http.get(`/api/start_scheduler_task/${id}`);
  };

//暂停任务

export const pause_scheduler_task = (id:number) => {
    return http.get(`/api/pause_scheduler_task/${id}`);
  };


//查询任务函数信息
export const all_task_func = () => {
  return http.get('/api/all/task_func');
}

