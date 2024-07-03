
import http from './index';
//qs
import qs from 'qs'

export const fetchData = () => {
  return http({
      url: './table.json',
      method: 'get'
  });
};

//更新token
let isRefreshing = false
let promiseRT: Promise<any>
export const refresh_token =  async () => {
  if (isRefreshing) {
   return promiseRT 
  }
  isRefreshing = true
  promiseRT =  http.post('/token/refresh');
  try {
    return await promiseRT;
  } finally {
    isRefreshing = false;
  }
};


//获取allmenu
export const getallmenus = () => {
  return http.get('/api/all/menus');
};

//获取角色菜单的权限
export const getrolemenupermiss = (id:number) => {
  return http.get(`/api/menu_permiss/${id}`);
};
//更新角色菜单的权限
export const updaterolemenupermiss = (id:number,data:object) => {
  return http.put(`/api/menu_permiss/${id}`,data);
};

//创建菜单
export const addmenu = (data:object) => {
  const formDataConfig = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };
  return http.post('/api/menu',data,formDataConfig);
};


// 编辑菜单
export const updatemenu = (id:number,data:object) => {
    const formDataConfig = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
      return http.put(`/api/menu/${id}`,data,formDataConfig);
};

  //删除菜单接口
  export const delmenu = (id:number) => {
    return http.delete(`/api/menu/${id}`);
  };


//登录接口
export const login = (data:object) => { 
    return http.post('/api/user/login', data);
  };

//修改密码
export const changepasswd = (data:object) => { 
  return http.post('/api/changepasswd', data);
};
  

//获取所有用户
export const getallusers = (data:any) => {
  return http.get('/api/all/users',{params:data});
};

// 创建用户
export const adduser = (data:object) => {
  const formDataConfig = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };
  return http.post('/api/add_user',data,formDataConfig);
};


//编辑用户账号状态
export const updateuserstatus = (id:number,data:any) => {

    return http.put(`/api/user/${id}?user_status=${data}`,{  
    });
  };

//编辑用户信息
export const updateuserinfo = (id:number,data:any) => {
  const formDataConfig = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };
    return http.put(`/api/user/${id}`,data,formDataConfig);
  };

  //删除工单接口
  export const deluser = (id:number) => {
    return http.delete(`/api/user/${id}`);
  };

  //创建角色
  export const addrole = (data:object) => {
    const formDataConfig = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    return http.post('/api/role', data, formDataConfig);
  };

  //删除角色
  export const delrole = (id:number) => {
    return http.delete(`/api/role/${id}`);
  };



//获取所有路由
export const getallroute = () => {
  return http.get('/api/all/route');
};
//获取单个路由
export const getroute = (roue_id:number) => {
  return http.get(`/api/route/${roue_id}`);
};


//获取所有角色
export const getallroles = () => {
  return http.get('/api/all/roles');
};

// 获取单个角色信息
export const getrole = (id:number) => {
  return http.get(`/api/role/${id}`);
};

// 获取all工单接口
export const getalltickets = (data:object) => {
  return http.get('/api/all/tickets',{params:data});
};

// 获取登录用户的工单
export const getusertickets = (data:object) => {
  return http.get('/api/user_tickets',{params:data});
};

// 获取环境信息接口
  export const getenvironments = () => {
    return http.get('/api/all/environments');
  };


// 获取经办人信息接口
export const getassignees = () => {
  return http.get('/api/all/assignees');
};

// 获取指派人信息接口
export const getusers = (data:object) => {
    return http.get('/api/all/users',data);
  };

  //删除工单接口
export const delticket = (id:number) => {
    return http.delete(`/api/ticket/${id}`);
  };

//编辑工单接口
export const putticket = (id:number,data:any) => {
  const formDataConfig = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };
    return http.put(`/api/ticket/${id}`,data,formDataConfig);
  };



  //创建工单
  export const createticket = (data:any) => {
    const formDataConfig = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    return http.post('/api/ticket', data, formDataConfig);
  };



  // 获取指派给自己的工单
export const getticket_processing = (data:object) => {
  return http.get('/api/ticket_processing',{params:data});
};



  // 创建问题反馈
export const create_ticket_processing_feedbacks = (data:object) => {
    const formDataConfig = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    return http.post('/api/ticket_processing_feedbacks', data, formDataConfig);
};




//附件上传
export const upload = (id:number,data:any) => {
  const formDataConfig = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };
  return http.post(`/my/upload/${id}`, data, formDataConfig);
};



//jenkins
  //创建k8sjob
  export const addk8sjob = (data:object) => {
    const formDataConfig = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    return http.post('/api/add_k8s_job', data, formDataConfig);
  };


// 查询k8sjob
export const getk8sjob = () => {
    return http.get('/api/all/k8s_job');
};

//获取分支
export const branch = (id:number) => {
  return http.get(`/api/remote_branches/${id}`);
};


//构建
export const build = (data:object) => {
  const formDataConfig = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };
  return http.post('/api/build', data, formDataConfig);
};
//查询构建中的项目状态
export const buildstatus = (data:object) => {
  return http.get('/api/build_status',{params:data});
};


//编辑job信息
export const updatejobinfo = (id:number,data:any) => {
  const formDataConfig = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };
    return http.put(`/api/k8s_jobinfo/${id}`,data,formDataConfig);
  };

    //删除工单接口
export const deljob = (id:number) => {
  return http.delete(`/api/k8s_jobinfo/${id}`);
};


//构建
export const save_build_id = (data:object) => {
  const formDataConfig = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };
  return http.post('/api/save_build_id', data, formDataConfig);
};


//jumpserver api获取信息
//获取传入的名称在jumper里的主机信息
// export const jump_hosts = (data:string) => {
//   return http.get(`/api/jump_allassets/${data}`);
// };

//查询jump对应的节点上的业务工作情况
export const service_status = (hostname:string) => {
  const JsonConfig = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  return http.post(`/api/service_status/${hostname}`,JsonConfig);
};

//重启节点noderestart
export const noderestart = (data:object) => {
  const JsonConfig = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  return http.post('/api/node_restart',data,JsonConfig);
};

//启动节点
export const nodestart = (data:object) => {
  const JsonConfig = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  return http.post('/api/node_start',data,JsonConfig);
};

//关闭节点
export const nodestop = (data:object) => {
  const JsonConfig = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  return http.post('/api/node_stop',data,JsonConfig);
};

//aliyun-super
export const node_list = () => {
  return http.get(`/api/jump_node_list`);
};

// 快速创建实例
export const quick_ecs = (data:object) => {
  const JsonConfig = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  return http.post('/api/aliyun/quick_ecs',data,JsonConfig);
};
// 标准创建实例
export const normal_ecs = (data:object) => {
  const JsonConfig = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  return http.post('/api/aliyun/normal_ecs',data,JsonConfig);
};

//获取所有ecs列表
export const getall_ecs = (data:object) => {
  return http.get('/api/aliyun/all_ecs',{ params: data });
};
//获取ecsdisk
export const getecsdisk = (data:object) => {
  return http.get('/api/aliyun/ecsdisk',{ params: data });
};

// 初始化supervisor
export const init_supervisor = (data:object) => {
  const JsonConfig = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  return http.post('/api/jump_super_task',data,JsonConfig);
};


// 修改hostname
export const hostnamectl = (data:object) => {
  const JsonConfig = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  return http.post('/api/jump_hostname_task',data,JsonConfig);
};

// 登录日志
export const allloginlog = (data:object) => {
  return http.get('/api/all/loginlog',{
    params: data,
    paramsSerializer: function(params) {
      return qs.stringify(params, { arrayFormat: 'repeat' });
    }
  });
};


// 查询所有操作日志
export const alloperlog = (data:object) => {
  return http.get('/api/all/operlog',{
    params: data,
    paramsSerializer: function(params) {
      return qs.stringify(params, { arrayFormat: 'repeat' });
    }
  });
};

// 查询单个id操作日志
export const getoperlog = (id:number) => {
  return http.get(`/api/operlog/${id}`);
};
// 删除单个id操作日志
  export const deloperlog = (id:number) => {
    return http.delete(`/api/operlog/${id}`);
  };



// 添加监控和删除监控
export const monitor = (data:object) => {
  const JsonConfig = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  return http.post('/api/monitor',data,JsonConfig);
};

// 监控group
export const monitor_group = () => {
  return http.get('/api/monitor_group');
};

// 监控monitor_instance
export const monitor_instance = () => {
  return http.get('/api/monitor_instance');
};


//monitor_check
export const monitor_check = (data:object) => {
  return http.get('/api/monitor_check',{params: data});
};
