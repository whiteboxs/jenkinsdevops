import html2Canvas from 'html2canvas'
import JsPDF from 'jspdf'
import { ElLoading } from 'element-plus'
// title:下载文件的名称  htmlId:包裹的标签的id
export const htmlToPdf = (title: string, htmlId: string) => {
  const loading = ElLoading.service({ // 打开遮罩层
    lock: true,
    text: '请稍等...',
    background: 'rgba(255, 255, 255, 0.5)',
})
  var element = document.querySelector(htmlId) as HTMLElement
  window.pageYOffset = 0
  document.documentElement.scrollTop = 0
  document.body.scrollTop = 0
  setTimeout(() => {

 
    html2Canvas(element, {
      allowTaint: true,
      useCORS: true,
      scale: 2, // 提升画面质量，但是会增加文件大小
      height: element.scrollHeight, // 需要注意，element的 高度 宽度一定要在这里定义一下，不然会存在只下载了当前你能看到的页面   避雷避雷！！！
      windowHeight: element.scrollHeight,
    }).then(function (canvas) {
      var contentWidth = canvas.width
      var contentHeight = canvas.height
      // 一页pdf显示html页面生成的canvas高度;
      var pageHeight = (contentWidth * 841.89) / 592.28
      // 未生成pdf的html页面高度
      var leftHeight = contentHeight
      // console.log('pageHeight', pageHeight)
      // console.log('leftHeight', leftHeight)
      // 页面偏移
      var position = 0
      // a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高  //40是左右页边距
      var imgWidth = 595.28 - 40
      var imgHeight = (592.28 / contentWidth) * contentHeight
 
      var pageData = canvas.toDataURL('image/jpeg', 1.0)
 
      var pdf = new JsPDF('p', 'pt', 'a4')
 
      // 有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
      // 当内容未超过pdf一页显示的范围，无需分页
      if (leftHeight < pageHeight) {
        // console.log('没超过1页')
        pdf.addImage(pageData, 'JPEG', 20, 20, imgWidth, imgHeight)
      } else {
        while (leftHeight > 0) {
          // console.log('超过1页')
          pdf.addImage(pageData, 'JPEG', 20, position, imgWidth, imgHeight)
          leftHeight -= pageHeight
          position -= 841.89
          // 避免添加空白页
          if (leftHeight > 0) {
            pdf.addPage()
          }
        }
      }
      pdf.save(title + '.pdf')
      loading.close() // 关闭遮罩层
    })
  }, 1000)
}




 