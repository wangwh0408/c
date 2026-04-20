<template>
  <div class="file-upload">
    <h4 class="upload-title">{{ title }}</h4>
    <el-upload
      class="upload-dragger"
      drag
      :action="uploadUrl"
      :headers="headers"
      :data="extraData"
      :multiple="multiple"
      :limit="limit"
      :accept="accept"
      :auto-upload="autoUpload"
      :file-list="fileList"
      :http-request="handleHttpRequest"
      :on-change="handleChange"
      :on-success="handleSuccess"
      :on-error="handleError"
      :on-remove="handleRemove"
      :before-upload="beforeUpload"
      :disabled="disabled"
    >
      <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
      <div class="el-upload__text">
        将文件拖到此处，或<em>点击上传</em>
      </div>
      <template #tip>
        <div class="el-upload__tip">
          {{ tipText }}
        </div>
      </template>
    </el-upload>
    
    <div class="upload-progress" v-if="uploadingFiles.size > 0">
      <h5>上传中</h5>
      <div class="progress-list">
        <div class="progress-item" v-for="(progress, fileId) in uploadingFiles" :key="fileId">
          <div class="progress-info">
            <span class="progress-name">{{ progress.name }}</span>
            <span class="progress-percent">{{ progress.percent }}%</span>
          </div>
          <el-progress 
            :percentage="progress.percent" 
            :stroke-width="6"
            :color="progressColor"
          />
        </div>
      </div>
    </div>

    <div class="uploaded-files" v-if="uploadedFiles.length > 0">
      <h5>已上传文件 ({{ uploadedFiles.length }})</h5>
      <div class="file-list">
        <div class="file-item" v-for="file in uploadedFiles" :key="file.uid">
          <div class="file-info">
            <el-icon class="file-icon"><Document /></el-icon>
            <div class="file-detail">
              <span class="file-name">{{ file.name }}</span>
              <span class="file-size">{{ formatFileSize(file.size) }}</span>
            </div>
          </div>
          <div class="file-actions">
            <el-tag :type="getFileStatusType(file.status)" size="small">
              {{ getFileStatusText(file.status) }}
            </el-tag>
            <el-button 
              type="danger" 
              link 
              size="small" 
              @click="handleDeleteFile(file)"
              :loading="file.deleting"
            >
              删除
            </el-button>
          </div>
        </div>
      </div>
    </div>
    
    <el-empty v-if="uploadedFiles.length === 0 && uploadingFiles.size === 0" :description="emptyText" />
  </div>
</template>

<script setup>
import { ref, computed, watch, markRaw } from 'vue';
import { UploadFilled, Document } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import uploadService from '@/api/uploadService';

const props = defineProps({
  title: {
    type: String,
    default: '模型文件上传'
  },
  uploadUrl: {
    type: String,
    default: '/api/upload'
  },
  headers: {
    type: Object,
    default: () => ({})
  },
  extraData: {
    type: Object,
    default: () => ({})
  },
  multiple: {
    type: Boolean,
    default: true
  },
  limit: {
    type: Number,
    default: 10
  },
  accept: {
    type: String,
    default: '.pt,.pth,.onnx,.pb,.h5,.keras,.model,.weights,.index,.meta,.ckpt,.safetensors,.bin'
  },
  autoUpload: {
    type: Boolean,
    default: true
  },
  disabled: {
    type: Boolean,
    default: false
  },
  tipText: {
    type: String,
    default: '支持模型文件格式：.pt, .pth, .onnx, .pb, .h5, .keras, .safetensors 等'
  },
  emptyText: {
    type: String,
    default: '暂无上传的模型文件'
  },
  initialFiles: {
    type: Array,
    default: () => []
  },
  maxFileSize: {
    type: Number,
    default: 500
  }
});

const emit = defineEmits(['upload-success', 'upload-error', 'upload-progress', 'file-delete', 'file-change']);

const fileList = ref([]);
const uploadedFiles = ref([]);
const uploadingFiles = ref(new Map());
const progressColor = computed(() => {
  return (percentage) => {
    if (percentage >= 80) return '#67C23A';
    if (percentage >= 50) return '#409EFF';
    return '#E6A23C';
  };
});

watch(() => props.initialFiles, (newFiles) => {
  if (newFiles && newFiles.length > 0) {
    uploadedFiles.value = newFiles.map((file, index) => ({
      uid: file.uid || `existing-${index}-${Date.now()}`,
      name: file.name,
      size: file.size,
      status: 'success',
      isExisting: true,
      deleting: false,
      ...file
    }));
  }
}, { immediate: true, deep: true });

const beforeUpload = (file) => {
  const maxSize = props.maxFileSize * 1024 * 1024;
  if (file.size > maxSize) {
    ElMessage.error(`文件大小不能超过 ${props.maxFileSize}MB`);
    return false;
  }
  
  uploadingFiles.value.set(file.uid, {
    name: file.name,
    percent: 0,
    size: file.size
  });
  
  emit('file-change', { type: 'add', file });
  return true;
};

const handleChange = (file, uploadFileList) => {
  // uploadFileList 是 el-upload 内部维护的文件列表
  // 我们自己的 uploadedFiles 用于显示已上传文件
  fileList.value = uploadFileList;
};

const handleHttpRequest = async (options) => {
  const { file, onProgress, onSuccess, onError } = options;
  
  try {
    const response = await uploadService.uploadFile(file, (progressEvent) => {
      const percent = progressEvent.percent;
      
      if (uploadingFiles.value.has(file.uid)) {
        uploadingFiles.value.set(file.uid, {
          name: file.name,
          percent: Math.round(percent),
          size: file.size
        });
      }
      
      emit('upload-progress', { file, percent: Math.round(percent) });
      
      if (onProgress) {
        onProgress({ percent });
      }
    });
    
    if (onSuccess) {
      onSuccess(response);
    }
    
  } catch (error) {
    if (onError) {
      onError(error);
    }
  }
};

const handleSuccess = (response, file, uploadFileList) => {
  uploadingFiles.value.delete(file.uid);
  
  // 检查文件是否已存在，避免重复添加
  const existingIndex = uploadedFiles.value.findIndex(f => f.uid === file.uid);
  if (existingIndex !== -1) {
    // 文件已存在，更新文件信息
    uploadedFiles.value[existingIndex] = {
      ...uploadedFiles.value[existingIndex],
      status: 'success',
      response: response
    };
    emit('upload-success', { file: uploadedFiles.value[existingIndex], response });
    ElMessage.success(`${file.name} 上传成功`);
    return;
  }
  
  const newFile = {
    uid: file.uid,
    name: file.name,
    size: file.size,
    status: 'success',
    isExisting: false,
    deleting: false,
    response: response
  };
  
  uploadedFiles.value.push(newFile);
  
  emit('upload-success', { file: newFile, response });
  ElMessage.success(`${file.name} 上传成功`);
};

const handleError = (error, file, uploadFileList) => {
  uploadingFiles.value.delete(file.uid);
  
  emit('upload-error', { file, error });
  ElMessage.error(`${file.name} 上传失败`);
};

const handleRemove = (file, uploadFileList) => {
  uploadingFiles.value.delete(file.uid);
  fileList.value = uploadFileList;
};

const handleDeleteFile = async (file) => {
  try {
    await ElMessageBox.confirm(`确定要删除文件 "${file.name}" 吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    });
    
    file.deleting = true;
    
    await emit('file-delete', { file, callback: async () => {
      const index = uploadedFiles.value.findIndex(f => f.uid === file.uid);
      if (index > -1) {
        uploadedFiles.value.splice(index, 1);
      }
      ElMessage.success(`${file.name} 删除成功`);
    }});
    
  } catch (error) {
    file.deleting = false;
    if (error !== 'cancel') {
      ElMessage.error('删除失败');
    }
  }
};

const formatFileSize = (bytes) => {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const getFileStatusType = (status) => {
  const map = {
    'success': 'success',
    'error': 'danger',
    'uploading': 'primary',
    'pending': 'info'
  };
  return map[status] || 'info';
};

const getFileStatusText = (status) => {
  const map = {
    'success': '已上传',
    'error': '失败',
    'uploading': '上传中',
    'pending': '等待中'
  };
  return map[status] || '未知';
};

const triggerUpload = () => {
  const uploader = document.querySelector('.upload-dragger input[type="file"]');
  if (uploader) {
    uploader.click();
  }
};

defineExpose({
  triggerUpload,
  fileList: computed(() => fileList.value),
  uploadedFiles: computed(() => uploadedFiles.value)
});
</script>

<style scoped>
.file-upload {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.upload-title {
  font-size: 14px;
  color: #303133;
  margin-bottom: 10px;
  font-weight: bold;
}

.upload-dragger {
  margin-bottom: 15px;
}

.upload-dragger :deep(.el-upload-dragger) {
  padding: 15px 10px;
}

.upload-dragger :deep(.el-icon--upload) {
  font-size: 28px;
  color: #409EFF;
}

.upload-dragger :deep(.el-upload__text) {
  font-size: 12px;
  margin-top: 5px;
}

.upload-dragger :deep(.el-upload__tip) {
  font-size: 11px;
  color: #909399;
  margin-top: 5px;
}

.upload-progress {
  margin-bottom: 15px;
}

.upload-progress h5,
.uploaded-files h5 {
  font-size: 13px;
  color: #606266;
  margin-bottom: 8px;
}

.progress-list {
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  padding: 8px;
  max-height: 120px;
  overflow-y: auto;
}

.progress-item {
  margin-bottom: 8px;
}

.progress-item:last-child {
  margin-bottom: 0;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.progress-name {
  font-size: 12px;
  color: #303133;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 150px;
}

.progress-percent {
  font-size: 11px;
  color: #909399;
}

.uploaded-files {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 50px;
}

.uploaded-files .file-list {
  flex: 1;
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  padding: 8px;
  overflow-y: auto;
  max-height: none;
}

.file-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 6px;
  background: #f5f7fa;
  border-radius: 4px;
  margin-bottom: 6px;
}

.file-item:last-child {
  margin-bottom: 0;
}

.file-info {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  flex: 1;
  min-width: 0;
}

.file-icon {
  font-size: 20px;
  color: #409EFF;
  flex-shrink: 0;
}

.file-detail {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.file-name {
  font-size: 12px;
  color: #303133;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-size {
  font-size: 11px;
  color: #909399;
}

.file-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  flex-shrink: 0;
  margin-left: 8px;
}

:deep(.el-empty) {
  padding: 20px 0;
}
</style>
