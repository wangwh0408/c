<template>
  <el-row class="main-row">
    <el-col :span="5" class="left-col">
      <LeftPanel :active-menu="activeMenu" @sub-menu-change="handleSubMenuChange" />
    </el-col>
    <el-col :span="14" class="center-col">
      <div class="center-content">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </el-col>
    <el-col :span="5" class="right-col">
      <div class="right-content">
        <FileUpload
          title="模型文件上传"
          :initial-files="initialFiles"
          @upload-success="handleUploadSuccess"
          @upload-progress="handleUploadProgress"
          @upload-error="handleUploadError"
          @file-delete="handleFileDelete"
          @file-change="handleFileChange"
        />
      </div>
    </el-col>
  </el-row>
</template>

<script setup>
import { watch, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import LeftPanel from './LeftPanel.vue';
import FileUpload from './FileUpload.vue';
import uploadService from '@/api/uploadService';

const props = defineProps({
  activeMenu: {
    type: String,
    default: 'ai-model'
  }
});

const router = useRouter();
const initialFiles = ref([]);

const handleSubMenuChange = (path) => {
  if (path) {
    router.push(path);
  }
};

const loadInitialFiles = async () => {
  try {
    const files = await uploadService.getUploadedFiles();
    initialFiles.value = files;
  } catch (error) {
    console.error('加载文件列表失败:', error);
  }
};

const handleUploadSuccess = async ({ file, response }) => {
  console.log('文件上传成功:', file.name, '响应:', response);
  
  try {
    const businessResult = await uploadService.callBusinessApi(response);
    console.log('业务接口调用成功:', businessResult);
    ElMessage.success(`${file.name} 上传成功，业务接口已处理`);
  } catch (error) {
    console.error('业务接口调用失败:', error);
    ElMessage.warning('文件上传成功，但业务接口调用失败');
  }
};

const handleUploadProgress = ({ file, percent }) => {
  console.log(`上传进度: ${file.name} - ${percent}%`);
};

const handleUploadError = ({ file, error }) => {
  console.error('文件上传失败:', file.name, error);
};

const handleFileDelete = async ({ file, callback }) => {
  try {
    await uploadService.deleteFile(file);
    if (callback) {
      callback();
    }
  } catch (error) {
    ElMessage.error('删除失败');
    throw error;
  }
};

const handleFileChange = ({ type, file }) => {
  console.log(`文件变化: ${type} - ${file.name}`);
};

watch(() => props.activeMenu, (newVal) => {
  if (newVal === 'data-management') {
    router.push('/data-management');
  } else if (newVal === 'ai-model') {
    router.push('/my-models');
  }
}, { immediate: true });

onMounted(() => {
  loadInitialFiles();
});
</script>

<style scoped>
.main-row {
  height: 100%;
  display: flex;
}

.left-col, .center-col, .right-col {
  height: 100%;
  overflow: hidden;
}

.left-col {
  border-right: 1px solid #e4e7ed;
  background-color: #f5f7fa;
}

.center-col {
  background-color: #ffffff;
}

.center-content {
  height: 100%;
  padding: 20px;
  overflow-y: auto;
}

.right-col {
  border-left: 1px solid #e4e7ed;
  background-color: #f5f7fa;
}

.right-content {
  height: 100%;
  padding: 20px;
  overflow-y: auto;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
