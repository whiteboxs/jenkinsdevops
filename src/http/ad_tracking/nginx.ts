import http from '../index';
//qs
import qs from 'qs'

//创建nginx服务信息
export const add_nginx_server = (data:object) => {
  const formDataConfig = {
      headers: {
          'Content-Type': 'application/json',
        },
      };
  return http.post('/api/add_nginx_server', data, formDataConfig);
};

  // 编辑单个id nginx
export const update_nginx_server = (id:number,data:object) => {
  const JsonConfig = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  return http.put(`/api/nginx_server/${id}`,data,JsonConfig);
};

// 删除单个nginx
export const del_nginx_server = (id:number) => {
return http.delete(`/api/nginx_server/${id}`);
};

// 查询所有nginxserver
export const all_nginx_server = (data:object) =>  {
  return http.get('/api/all/nginx_server', {
  params: data,
  paramsSerializer: function(params) {
    return qs.stringify(params, { arrayFormat: 'repeat' });
  }
});
};


//ecs_ip
// export const ecs_ip = () => {
//   return http.get('/api/ecs_ip');
// };

//ecs_nameip
export const ecs_nameip = () => {
  return http.get('/api/ecs_nameip');
};


//查询所有nginx_config 列表
export const all_nginx_config = (data:object) => {
  return http.get('/api/all/nginx_config',{params: data});

}

// 查询单个idnginx_config
export const getnginx_config = (id:number) => {
  return http.get(`/api/nginx_config/${id}`);
};

//查询所有slb_ecs汇总表信息
export const all_slb_ecs = (data:object) => {
  return http.get('/api/all/slb_ecs',{params: data});
}


// 查询单个idslb_ecs
export const getslb_ecs = (id:number) => {
  return http.get(`/api/slb_ecs/${id}`);
};


//nginx服务器安装客户端环境
export const add_agent_env = (data:object) => {
  const formDataConfig = {
      headers: {
          'Content-Type': 'application/json',
        },
      };
  return http.post('/api/add_agent_env', data, formDataConfig);
};


//客户端组件检查
export const agent_env_check = (data:object) => {
  const formDataConfig = {
      headers: {
          'Content-Type': 'application/json',
        },
      };
  return http.post('/api/agent_env_check', data, formDataConfig);
};



//查询所有ad_tracking汇总表信息
export const all_ad_tracking = (data:object) => {
  return http.get('/api/all/ad_tracking',{params: data});
}

// 查询单个ad_tracking
export const getad_tracking = (id:number,data:object) => {
  return http.get(`/api/ad_tracking/${id}`,{params: data});
};

//查询nacos
export const all_nacos = (data:object) => {
  return http.get('/api/all/nacos_service',{params: data});
}

//查询waf
export const all_waf = (data:object) => {
  return http.get('/api/all/waf',{params: data});
}
