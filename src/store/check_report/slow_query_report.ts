import { defineStore } from "pinia";
import { getslow_query_reports } from '@/http/check_report/mysql_check_report'
import { ref } from 'vue'
export const useslow_query_reportStore = defineStore('slow_query_report', () => {
  // 定义数据state

  
  const slow_query_reportinfo = ref<any>([]);

  // const month = ['01','02','03','04','05','06','07','08','09','10','11','12'];
  const reporttree = ref<any[]>([]);


  const  buildReportTree = (report:any) =>{  
    const tree = <any>[];
    const yearMap = <any>{};  
    
    report.forEach((item:{create_time:string,address:string,status:string,url:string,id:number,info:string,file_name:string}) => {  
        const [year, month, day] = item.create_time.split(' ')[0].split('-');  
        const fullDate = `${year}-${month}-${day}`;  
      if (!yearMap[year]) {  
        yearMap[year] = {  
          date: year,  
          months: {}, // 使用对象来存储月份，确保月份的唯一性  
          children: []  
        };  
        tree.push(yearMap[year]);  
      }  
    
      const yearNode = yearMap[year];  
         // 检查月份是否已经在该年份的months中  
  let monthNode: { date: string; children: any[] } | undefined = undefined;  
  
    // 检查是否已有该年的月份节点  
    for (const child of yearNode.children) {  
      if (child.date === month) {  
        monthNode = child;  
        break;  
      }  
    }  
  
    if (!monthNode) {  
      monthNode = {  
        date: month,  
        children: []  
      };  
      yearNode.children.push(monthNode);  
    }  
  
    monthNode.children.push({  
      address: item.address,  
      date:fullDate,  
      create_time: item.create_time,  
      status: item.status,
      url: item.url,
      info: item.info,
      file_name: item.file_name,
      id: item.id
    });  
  }); 
    // 对年份进行排序（降序）  
    tree.sort((a:any, b:any) => b.date.localeCompare(a.date, undefined, { numeric: true }));  

    // 对每个月份节点下的子节点（日期）进行排序（降序）  
    tree.forEach((yearNode:any) => {  
    yearNode.children.sort((a:any, b:any) => {  
        // 月份转换为数字进行降序比较  
        const monthA = parseInt(a.date, 10);  
        const monthB = parseInt(b.date, 10);  
        return monthB - monthA;  
    });  

    // 对每个日期节点下的报告进行排序（按日期降序）  
    yearNode.children.forEach((monthNode:any) => {  
        monthNode.children.sort((a:any, b:any) => {  
        // 使用 Date 对象进行降序比较  
        return new Date(b.date).getTime() - new Date(a.date).getTime();  
        });  
    });  
    });   

  return tree;  
};

 
 


  const getslowquery_reports = async (data:any) => {
    const res = await getslow_query_reports(data)
    slow_query_reportinfo.value= res.data.data
    if (slow_query_reportinfo.value) {
        reporttree.value  = buildReportTree(slow_query_reportinfo.value);
       }
  }
  

  return {
    slow_query_reportinfo,
    getslowquery_reports,
    reporttree,
  }
},
);