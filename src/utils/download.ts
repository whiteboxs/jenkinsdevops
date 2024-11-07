export const downloadfile = async (data: any, fullNewName: any) => {
    const blob = new Blob([data], { type: 'text/plain' })// 创建blob对象，解析数据流
    const tempLink = document.createElement('a');// 创建一个临时的 HTML 元素，用于生成 Excel 文件
    const URL = window.URL || window.webkitURL;   // 兼容webkix浏览器，处理webkit浏览器中href自动添加blob前缀，默认在浏览器
    const herf = URL.createObjectURL(blob);  // 根据解析后的blob对象创建URL 对象
    tempLink.href = herf;  // 下载链接
    tempLink.download = fullNewName;// 下载文件名,如果后端没有返回，
    document.body.appendChild(tempLink);
    tempLink.click();  //下载后自动打开
    document.body.removeChild(tempLink); // 清理临时资源
    window.URL.revokeObjectURL(herf);   //在内存中移除URL 对象

    } 