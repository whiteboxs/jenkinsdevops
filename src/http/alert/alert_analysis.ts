import http from '../index';

// 统计静默策略匹配的告警数
export const search_policy_alert_count = (data:object) => {
    return http.get('/api/search/spac',{params: data});
  };

// 统计webhook群组发送的告警数
export const search_webhook_alert_count = (data:object) => {
    return http.get('/api/search/wac',{params: data});
  };


// 统计告警类型
export const search_alert_type_count = (data:object) => {
  return http.get('/api/search/atc',{params: data});
};


// 统计告警ip
export const search_alert_ip_count = (data:object) => {
  return http.get('/api/search/aic',{params: data});
};