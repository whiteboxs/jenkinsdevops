<template>
    <div>
    <el-dialog title="头像上传"  v-model="dialogVisible" width="600px">
        <vue-cropper
            :viewMode=1
            dragMode="move"
            :aspectRatio=1
            :autoCropArea=0.5
            ref="cropper"
            :src="imgSrc"
            :ready="cropImage"
            :zoom="cropImage"
            :cropmove="cropImage"
            style="width: 100%; height: 400px"
        ></vue-cropper>

        <template #footer>
            <span class="dialog-footer">
                <el-button class="crop-demo-btn" type="primary"
                    >选择图片
                    <input class="crop-input" type="file" name="image" accept="image/*" @change="setImage" />
                </el-button>
                <el-button type="primary" @click="saveAvatar">上传并保存</el-button>
                <el-button type="primary" @click="handleClose">取消</el-button>
            </span>
        </template>
    </el-dialog>
</div>
</template>


<script setup lang="ts" name="cropper">
import {ref } from 'vue';
import VueCropper from 'vue-cropperjs';
import 'cropperjs/dist/cropper.css';
import { useAuthStore } from '@/store/login';
import {baseURL_dev} from '@/config/baseURL'
import { upload } from '@/http/api';
import { ElMessage } from 'element-plus';

const user =useAuthStore() 




//页面上显示的图片,要穿给父组件
// const newavatarImg = ref();

//传入的图标地址
const imgSrc = ref('');
// 裁剪后的图片
const croppedFile = ref<File | null>(null); // 指定初始值为 null
// 裁剪后额base64链接图片
// const cropImg= ref('');

const dialogVisible = ref(false);

const cropper: any = ref();

// const showDialog = () => {
// 	imgSrc.value = avatarImg.value;
// 	dialogVisible.value = true;

// };
//判定图片是否是图片格式，返回图片信息
const setImage = (e: any) => {
  const file = e.target.files[0];
  if (!file.type.includes('image/')) {
	return;
  }
  if (file.size / 1024 / 1024 > 2) {
    ElMessage.error('文件大小不能超过2MB!')
    return false
  }
  const reader = new FileReader()
  //读取文件base64
  reader.readAsDataURL(file)
  reader.onload = ()=> {
	//图像元素显示选中图像文件(base64）
	imgSrc.value = String(reader.result)
	//console.log('setimage',imgSrc.value)
	cropper.value && cropper.value.replace(imgSrc.value);
	dialogVisible.value = true;      
  };
}

const cropImage = () => {
	  //cropImg.value = cropper.value.getCroppedCanvas().toDataURL(); // base64
	  cropper.value.getCroppedCanvas().toBlob((blob:any) => {
        // 将 Blob 对象转换为文件对象
        const file = new File([blob], 'cropped_image.png', { type: 'image/png' });
        // 将文件对象存储在 croppedFile 中
        croppedFile.value = file;
    }, 'image/png');
}


// 更新
const emit = defineEmits(['onupdate'])

//上传图片
const saveAvatar = async () => {
	console.log('file',croppedFile.value);
    // 如果没有裁剪后的文件对象，则不进行上传
    if (!croppedFile.value) {
        console.error('没有裁剪后的图片信息');
        return;
    }
	dialogVisible.value = false;
	// 创建 FormData 对象
	const formData = new FormData();
    // 将文件添加到 FormData 对象中
    formData.append('file', croppedFile.value);
	try {
        const res = await upload(user.userinfo.user_id, formData);
        if (res.data.code === 200) {
			ElMessage.success(res.data.msg);
            //最新的小图片穿给一个函数赋值,然后转给父组件
			//newavatarImg.value = baseURL_dev + '/my/view/' + res.data.image
			//更新登录的持久化信息
			user.updateuserPic(res.data.image)
			// 将 imgSrc.value 设置为新头像的地址
			// imgSrc.value = avatarImg.value;	
			// 重新创建 cropper 实例
			const reader = new FileReader()
			//重新对上传的图标进行成生新的cropper实例,当再次点击图片裁剪的时候显示上传的图片
			reader.readAsDataURL(croppedFile.value)
			reader.onload = ()=> {
			//图像元素显示选中图像文件(base64）
			imgSrc.value = String(reader.result)
			cropper.value && cropper.value.replace(imgSrc.value);     
              // 通知父组件更新操作  
            emit('onupdate');  
		};
        } else {
			ElMessage.success(res.data.msg)
         
        }
    } catch (error) {
        console.error('Error uploading image:', error);
        // 处理网络或其他错误
    }
};


// 关闭弹窗
const handleClose = () => {
    dialogVisible.value = false
}





const open = (avatarImg:any) => {

	imgSrc.value = avatarImg.value;
	dialogVisible.value = true;
    console.log('没提交前的', avatarImg.value)
}
defineExpose({
  open
})



</script>

<style scoped>

.crop-demo-btn {
	position: relative;
}
.crop-input {
	position: absolute;
	width: 100px;
	height: 40px;
	left: 0;
	top: 0;
	opacity: 0;
	cursor: pointer;
}
</style>
