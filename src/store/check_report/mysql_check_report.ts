import { defineStore } from "pinia";
import { getmysql_check_reports } from '@/http/check_report/mysql_check_report'
import { ref } from 'vue'
export const usemysql_check_reportStore = defineStore('mysql_check_report', () => {
  // 定义数据state

  
  const mysql_check_reportinfo = ref<any>([]);

  const reporttree = ref<any[]>([]);


  const  buildReportTree = (report:any) =>{  
    const tree = <any>[];
    const yearMap = <any>{};  
    
    report.forEach((item:{create_time:string,address:string,name:string,title:string,id:number}) => {  
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
      name: item.name,
      title: item.title,
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

 
 


  const getmysqlcheck_reports = async (data:any) => {
    const res = await getmysql_check_reports(data)
    mysql_check_reportinfo.value= res.data.data
    if (mysql_check_reportinfo.value) {
        reporttree.value  = buildReportTree(mysql_check_reportinfo.value);
       }
  }
  

  return {
    mysql_check_reportinfo,
    getmysqlcheck_reports,
    reporttree,
  }
},
);