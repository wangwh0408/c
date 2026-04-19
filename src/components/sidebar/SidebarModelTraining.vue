<template>
  <div class="sidebar-component">
    <h4 class="sidebar-title">模型训练</h4>
    <div class="training-status">
      <div class="status-header">
        <span>当前训练任务</span>
        <el-tag :type="trainingStatus === 'running' ? 'success' : 'info'" size="small">
          {{ trainingStatus === 'running' ? '训练中' : '空闲' }}
        </el-tag>
      </div>
      <div class="progress-section" v-if="trainingStatus === 'running'">
        <el-progress 
          :percentage="progress" 
          :stroke-width="10"
          :color="progressColor"
        />
        <div class="progress-info">
          <span>Epoch: {{ currentEpoch }}/{{ totalEpoch }}</span>
          <span>Loss: {{ currentLoss }}</span>
        </div>
      </div>
      <p v-else class="idle-text">当前无训练任务</p>
    </div>
    <div class="quick-config">
      <h5>快速配置</h5>
      <el-form :model="quickConfig" size="small" label-width="50px">
        <el-form-item label="轮次">
          <el-input-number v-model="quickConfig.epochs" :min="1" :max="1000" />
        </el-form-item>
        <el-form-item label="学习率">
          <el-select v-model="quickConfig.lr" style="width: 100%">
            <el-option label="0.001" :value="0.001" />
            <el-option label="0.0001" :value="0.0001" />
            <el-option label="0.01" :value="0.01" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="startQuickTrain" style="width: 100%">
            <el-icon><VideoPlay /></el-icon>
            快速训练
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="training-history">
      <h5>训练历史</h5>
      <div class="history-list">
        <div class="history-item" v-for="item in historyList" :key="item.id">
          <div class="history-name">{{ item.name }}</div>
          <div class="history-meta">
            <span class="history-accuracy">准确率: {{ item.accuracy }}%</span>
            <el-tag :type="item.success ? 'success' : 'danger'" size="small">
              {{ item.success ? '成功' : '失败' }}
            </el-tag>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { VideoPlay } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

const trainingStatus = ref('running');
const progress = ref(65);
const currentEpoch = ref(65);
const totalEpoch = ref(100);
const currentLoss = ref(0.1234);

const progressColor = computed(() => {
  if (progress.value >= 80) return '#67C23A';
  if (progress.value >= 50) return '#409EFF';
  return '#E6A23C';
});

const quickConfig = ref({
  epochs: 100,
  lr: 0.001
});

const historyList = ref([
  { id: 1, name: '图像识别训练 #3', accuracy: 92.5, success: true },
  { id: 2, name: '文本分类训练 #2', accuracy: 88.2, success: true },
  { id: 3, name: '语音识别训练 #1', accuracy: 0, success: false }
]);

const startQuickTrain = () => {
  ElMessage.success(`快速训练已启动，轮次: ${quickConfig.value.epochs}, 学习率: ${quickConfig.value.lr}`);
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

.training-status {
  margin-bottom: 15px;
}

.status-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  font-size: 13px;
  color: #606266;
}

.progress-section {
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  padding: 10px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  font-size: 12px;
  color: #909399;
}

.idle-text {
  font-size: 12px;
  color: #909399;
  text-align: center;
  padding: 15px;
  background: #f5f7fa;
  border-radius: 4px;
}

.quick-config, .training-history {
  margin-bottom: 12px;
}

.quick-config h5, .training-history h5 {
  font-size: 13px;
  color: #606266;
  margin-bottom: 8px;
}

.history-list {
  max-height: 100px;
  overflow-y: auto;
}

.history-item {
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  padding: 6px 8px;
  margin-bottom: 5px;
}

.history-name {
  font-size: 12px;
  color: #303133;
  margin-bottom: 4px;
}

.history-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.history-accuracy {
  font-size: 11px;
  color: #909399;
}
</style>
