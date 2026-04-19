<template>
  <div class="sidebar-component">
    <h4 class="sidebar-title">数据管理</h4>
    <div class="data-stats">
      <h5>数据统计</h5>
      <div class="stats-grid">
        <div class="stat-card">
          <el-icon class="stat-icon"><Folder /></el-icon>
          <div class="stat-info">
            <span class="stat-number">{{ stats.total }}</span>
            <span class="stat-label">数据集</span>
          </div>
        </div>
        <div class="stat-card">
          <el-icon class="stat-icon"><Picture /></el-icon>
          <div class="stat-info">
            <span class="stat-number">{{ stats.images }}</span>
            <span class="stat-label">图像数据</span>
          </div>
        </div>
        <div class="stat-card">
          <el-icon class="stat-icon"><Document /></el-icon>
          <div class="stat-info">
            <span class="stat-number">{{ stats.text }}</span>
            <span class="stat-label">文本数据</span>
          </div>
        </div>
      </div>
    </div>
    <div class="quick-upload">
      <h5>快速上传</h5>
      <el-upload
        class="upload-demo"
        drag
        :auto-upload="false"
        :on-change="handleFileChange"
      >
        <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
        <div class="el-upload__text">
          将文件拖到此处，或<em>点击上传</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            支持 CSV, JSON, 图像文件
          </div>
        </template>
      </el-upload>
      <el-button 
        type="primary" 
        size="small" 
        @click="startUpload" 
        style="width: 100%; margin-top: 10px"
        :disabled="uploadFiles.length === 0"
      >
        <el-icon><Upload /></el-icon>
        确认上传 ({{ uploadFiles.length }})
      </el-button>
    </div>
    <div class="recent-datasets">
      <h5>最近数据集</h5>
      <div class="dataset-list">
        <div class="dataset-item" v-for="item in recentDatasets" :key="item.id">
          <div class="dataset-icon">
            <el-icon v-if="item.type === 'image'"><Picture /></el-icon>
            <el-icon v-else><Document /></el-icon>
          </div>
          <div class="dataset-info">
            <div class="dataset-name">{{ item.name }}</div>
            <div class="dataset-meta">
              <span>{{ item.count }} 条</span>
              <span>{{ item.size }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Folder, Picture, Document, Upload, UploadFilled } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

const stats = ref({
  total: 8,
  images: 3,
  text: 5
});

const uploadFiles = ref([]);

const recentDatasets = ref([
  { id: 1, name: '训练数据集A', type: 'image', count: 50000, size: '2.5GB' },
  { id: 2, name: '训练数据集B', type: 'text', count: 100000, size: '800MB' }
]);

const handleFileChange = (file) => {
  uploadFiles.value = file;
};

const startUpload = () => {
  if (uploadFiles.value.length === 0) {
    ElMessage.warning('请先选择要上传的文件');
    return;
  }
  ElMessage.success(`开始上传 ${uploadFiles.value.length} 个文件...`);
  uploadFiles.value = [];
};
</script>

<style scoped>
.sidebar-component {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.sidebar-title {
  font-size: 14px;
  color: #303133;
  margin-bottom: 10px;
}

.data-stats, .quick-upload, .recent-datasets {
  margin-bottom: 12px;
}

.data-stats h5, .quick-upload h5, .recent-datasets h5 {
  font-size: 13px;
  color: #606266;
  margin-bottom: 8px;
}

.stats-grid {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  padding: 8px 10px;
}

.stat-icon {
  font-size: 24px;
  color: #409EFF;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-number {
  font-size: 16px;
  font-weight: bold;
  color: #303133;
}

.stat-label {
  font-size: 11px;
  color: #909399;
}

.upload-demo :deep(.el-upload-dragger) {
  padding: 15px 10px;
}

.upload-demo :deep(.el-icon--upload) {
  font-size: 28px;
  color: #409EFF;
}

.upload-demo :deep(.el-upload__text) {
  font-size: 12px;
  margin-top: 5px;
}

.upload-demo :deep(.el-upload__tip) {
  font-size: 11px;
  color: #909399;
}

.dataset-list {
  max-height: 80px;
  overflow-y: auto;
}

.dataset-item {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  padding: 6px 8px;
  margin-bottom: 5px;
}

.dataset-icon {
  font-size: 20px;
  color: #409EFF;
}

.dataset-info {
  flex: 1;
}

.dataset-name {
  font-size: 12px;
  color: #303133;
  margin-bottom: 2px;
}

.dataset-meta {
  display: flex;
  gap: 10px;
  font-size: 11px;
  color: #909399;
}
</style>
