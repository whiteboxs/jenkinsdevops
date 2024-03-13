
import http from './index.ts';


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
  return http.post('/api/add_user',data,formDataConfig);
};

//登录接口
export const login = (data:object) => { 
    return http.post('/api/user/login', data);
  };

//获取所有用户
export const getallusers = () => {
  return http.get('/api/all/users');
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




//附件
export const upload = (file:File) => {
  const formData = new FormData();
  formData.append("file", file);
  console.log(formData);
  const formDataConfig = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };

  return http.post('/my/upload', formData, formDataConfig);
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
  const formDataConfig = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };
  return http.post('/api/build_status', data, formDataConfig);
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
  const formDataConfig = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  return http.post(`/api/service_status/${hostname}`,formDataConfig);
};

//重启节点noderestart
export const noderestart = (data:object) => {
  const formDataConfig = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  return http.post('/api/node_restart',data,formDataConfig);
};

//启动节点
export const nodestart = (data:object) => {
  const formDataConfig = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  return http.post('/api/node_start',data,formDataConfig);
};

//关闭节点
export const nodestop = (data:object) => {
  const formDataConfig = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  return http.post('/api/node_stop',data,formDataConfig);
};