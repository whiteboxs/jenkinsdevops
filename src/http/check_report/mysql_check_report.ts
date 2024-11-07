import http from '../index';
//qs
import qs from 'qs'


//获取单个mysql_report列表
export const getmysql_check_reports = (data:object) => {
    return http.get('/api/mysql_check_reports',{params: data});
  };


//单个id 的报告详情
export const getmysql_check_report = (id:number) => {
  return http.get(`/api/mysql_check_report/${id}`);
};



//编辑mysql慢查询开关
export const update_slow_query_switch = (id:number,data:object) => {
  const JsonConfig = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  return http.put(`/api/ecs_mysql/${id}`,data,JsonConfig);
};


//nginx服务器安装客户端环境
export const add_slow_query_agent = (data:object) => {
  const formDataConfig = {
      headers: {
          'Content-Type': 'application/json',
        },
      };
  return http.post('/api/add_slow_query_agent', data, formDataConfig);
};


//客户端组件检查
export const check_slow_query_agent = (data:object) => {
  const formDataConfig = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  return http.post('/api/check_slow_query_agent', data, formDataConfig);
};



//获取单个mysql_report列表
export const getslow_query_reports = (data:object) => {
  return http.get('/api/slow_query_reports',{params: data});
};


//单个id 的报告详情
export const getslow_query_report = (id:number) => {
return http.get(`/api/slow_query_report/${id}`);
};



//手动生成慢查询报告
export const manual_slow_query = (data:object) => {
  const formDataConfig = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  return http.post('/api/manual_slow_query', data, formDataConfig);
};
//手动生成慢查询报告状态
export const manual_slow_query_status = (data:object) => {
  const formDataConfig = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  return http.post('/api/manual_slow_query_status', data, formDataConfig);
};


// 浏览报告
export const view_slow_query_report = (id:number) => {
  return http.get(`/view/slow_query_report/${id}`,{responseType: 'text'});
}

// 下载报告到后端
export const download_slow_query_report = (id:number) => {
  return http.get(`/download/slow_query_report/${id}`);
}

// //前端页面下载报告
// export const download_slow_query_report_front = (id:number) => {
//   return http.get(`/download/slow_query_report/${id}`,{responseType: 'blob'});
// }


// 删除单个ecs_mysql服务器信息
export const del_check_report = (id:number) => {
  return http.delete(`/api/mysql_check_report/${id}`);
};

// 删除单个ecs_mysql服务器信息
export const del_slow_query_report = (id:number) => {
  return http.delete(`/api/slow_query_report/${id}`);
};
  