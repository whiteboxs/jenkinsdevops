
import http from '../index';
//qs
import qs from 'qs'


// 查询所有静默策略
export const allsilences_policy = (data:object) => {
    return http.get('/api/all/silences_policy', {
      params: data,
      paramsSerializer: function(params) {
        return qs.stringify(params, { arrayFormat: 'repeat' });
      }
    });
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

// 查询所有alert信信息
export const allalert = (data:object) => {
  return http.get('/api/all/alert', {
    params: data,
    paramsSerializer: function(params) {
      return qs.stringify(params, { arrayFormat: 'repeat' });
    }
  });
};

// 删除单个告警信息
export const delalert = (id:number) => {
  return http.delete(`/api/alert/${id}`);
};

// 查询所有静默信息
export const allsilences = (data:object) => {
  return http.get('/api/all/silences',  {
    params: data,
    paramsSerializer: function(params) {
      return qs.stringify(params, { arrayFormat: 'repeat' });
    }
  });
};

// 删除单个告警信息
export const delsilences = (id:number) => {
  return http.delete(`/api/silences/${id}`);
};

//当前告警数
export const now_alert = () => {
  return http.get('/api/now_alert');
};