
import http from '../index';


// 查询所有操作日志
export const allsilences_policy = (data:object) => {
    return http.get('/api/all/silences_policy',{params: data});
  };
  
//创建策略
export const add_silences_policy = (data:object) => {
  const JsonConfig = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  return http.post('/api/add_silences_policy',data,JsonConfig);
};


// 查询单个id静默策略
export const getsilences_policy = (id:number) => {
  return http.get(`/api/silences_policy/${id}`);
};

// 删除单个id静默策略
export const delsilences_policy = (id:number) => {
  return http.delete(`/api/silences_policy/${id}`);
};

// 编辑单个id静默策略
export const update_silences_policy = (id:number,data:object) => {
  const JsonConfig = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  return http.put(`/api/silences_policy/${id}`,data,JsonConfig);
};


// 查询所有webhook
export const allalert_webhook = (data:object) => {
  return http.get('/api/all/alert_webhook',{params: data});
};

//创建webook
export const add_alert_webhook = (data:object) => {
const JsonConfig = {
  headers: {
    'Content-Type': 'application/json',
  },
};
return http.post('/api/add_alert_webhook',data,JsonConfig);
};


// 删除单个idwebhook
export const delalert_webhook = (id:number) => {
  return http.delete(`/api/alert_webhook/${id}`);
};

// 编辑单个id webhook
export const updatealerr_webhook = (id:number,data:object) => {
  const JsonConfig = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  return http.put(`/api/alert_webhook/${id}`,data,JsonConfig);
};

// 查询所有alert信息
export const allalert = (data:object) => {
  return http.get('/api/all/alert',{params: data});
};

// 删除单个告警信息
export const delalert = (id:number) => {
  return http.delete(`/api/alert/${id}`);
};

// 查询所有alert信息
export const allsilences = (data:object) => {
  return http.get('/api/all/silences',{params: data});
};

// 删除单个告警信息
export const delsilences = (id:number) => {
  return http.delete(`/api/silences/${id}`);
};