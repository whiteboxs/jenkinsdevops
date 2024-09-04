import { ElLoading} from 'element-plus'
 
let loadingCount = 0;
let loadingInstance: ReturnType<typeof ElLoading.service>;
 
const startLoading = () => {
    loadingInstance = ElLoading.service({
    fullscreen: true,
    lock: true,
    text: "Loading",
    background: "rgba(0, 0, 0, 0.7)"
    });
};
 
const endLoading = () => {
    loadingInstance.close();
};
 
export const showLoading = () => {
  if (loadingCount === 0) {
    startLoading();
  }
  loadingCount += 1;
};
 
export const hideLoading = () => {
  if (loadingCount <= 0) {
    return;
  }
  loadingCount -= 1;
  if (loadingCount === 0) {
    endLoading();
  }
}