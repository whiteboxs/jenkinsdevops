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

  // 更新单个id nginx
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

export const mysql_work_group = () => {
  return http.get('/api/mysql_work_group');
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


//数据库版本检查
export const check_nginx_version = (data:object) => {
  const formDataConfig = {
      headers: {
          'Content-Type': 'application/json',
        },
      };
  return http.post('/api/check_nginx_version', data, formDataConfig);
};

//查询所有ad_tracking汇总表信息
export const all_ad_tracking = (data:object) => {
  const ifLoading = true;
  return http.get('/api/all/ad_tracking',{params: data, ifLoading});
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


//查询rds
export const all_rds = (data:object) => {
  return http.get('/api/all/rds',{params: data});
}

//查询redis
export const all_redis = (data:object) => {
  return http.get('/api/all/redis',{params: data});
}


//创建ecs_mysql信息
export const add_ecs_mysql = (data:object) => {
  const formDataConfig = {
      headers: {
          'Content-Type': 'application/json',
        },
      };
  return http.post('/api/add_ecs_mysql', data, formDataConfig);
};


// 查询所有ecs_mysql信息
export const all_ecs_mysql = (data:object) =>  {
  return http.get('/api/all/ecs_mysql', {
  params: data,
  paramsSerializer: function(params) {
    return qs.stringify(params, { arrayFormat: 'repeat' });
  }
});
};

// 删除单个ecs_mysql服务器信息
export const del_ecs_mysql = (id:number) => {
  return http.delete(`/api/ecs_mysql/${id}`);
  };

// 编辑单个idd的mysql信息
  export const update_ecs_mysql = (id:number,data:object) => {
    const JsonConfig = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    return http.put(`/api/ecs_mysql/${id}`,data,JsonConfig);
  };

//数据库版本检查
export const check_mysql_version = (data:object) => {
  const formDataConfig = {
      headers: {
          'Content-Type': 'application/json',
        },
      };
  return http.post('/api/check_mysql_version', data, formDataConfig);
};