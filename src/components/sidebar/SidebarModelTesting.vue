<template>
  <div class="sidebar-component">
    <h4 class="sidebar-title">模型测试</h4>
    <div class="test-results">
      <h5>最近测试结果</h5>
      <div class="result-summary">
        <div class="summary-item">
          <span class="summary-label">准确率</span>
          <span class="summary-value highlight">{{ latestTest.accuracy }}%</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">精确率</span>
          <span class="summary-value">{{ latestTest.precision }}%</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">召回率</span>
          <span class="summary-value">{{ latestTest.recall }}%</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">F1分数</span>
          <span class="summary-value">{{ latestTest.f1Score }}</span>
        </div>
      </div>
    </div>
    <div class="quick-test">
      <h5>快速测试</h5>
      <el-form :model="quickTest" size="small" label-width="60px">
        <el-form-item label="选择模型">
          <el-select v-model="quickTest.model" placeholder="请选择" style="width: 100%">
            <el-option label="图像识别 v1.0" value="model1" />
            <el-option label="文本分类 v2.0" value="model2" />
          </el-select>
        </el-form-item>
        <el-form-item label="测试数据">
          <el-select v-model="quickTest.dataset" placeholder="请选择" style="width: 100%">
            <el-option label="测试集A (1000条)" value="testA" />
            <el-option label="测试集B (2000条)" value="testB" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="runQuickTest" style="width: 100%">
            <el-icon><Search /></el-icon>
            开始测试
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="test-history">
      <h5>测试历史</h5>
      <div class="history-list">
        <div class="history-item" v-for="item in testHistory" :key="item.id">
          <div class="history-header">
            <span class="history-model">{{ item.model }}</span>
            <el-tag :type="item.passed ? 'success' : 'warning'" size="small">
              {{ item.passed ? '通过' : '待优化' }}
            </el-tag>
          </div>
          <div class="history-detail">
            <span>准确率: {{ item.accuracy }}%</span>
            <span class="history-time">{{ item.time }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Search } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

const latestTest = ref({
  accuracy: 92.5,
  precision: 91.2,
  recall: 93.8,
  f1Score: 0.925
});

const quickTest = ref({
  model: '',
  dataset: ''
});

const testHistory = ref([
  { id: 1, model: '图像识别 v1.0', accuracy: 92.5, passed: true, time: '10分钟前' },
  { id: 2, model: '文本分类 v2.0', accuracy: 78.3, passed: false, time: '1小时前' }
]);

const runQuickTest = () => {
  if (!quickTest.value.model || !quickTest.value.dataset) {
    ElMessage.warning('请选择模型和测试数据');
    return;
  }
  ElMessage.success('快速测试已启动，请稍候...');
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

.test-results, .quick-test, .test-history {
  margin-bottom: 12px;
}

.test-results h5, .quick-test h5, .test-history h5 {
  font-size: 13px;
  color: #606266;
  margin-bottom: 8px;
}

.result-summary {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.summary-item {
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  padding: 8px;
  text-align: center;
}

.summary-label {
  display: block;
  font-size: 12px;
  color: #909399;
  margin-bottom: 4px;
}

.summary-value {
  font-size: 16px;
  font-weight: bold;
  color: #303133;
}

.summary-value.highlight {
  color: #67C23A;
}

.history-list {
  max-height: 100px;
  overflow-y: auto;
}

.history-item {
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  padding: 8px;
  margin-bottom: 5px;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.history-model {
  font-size: 12px;
  color: #303133;
  font-weight: 500;
}

.history-detail {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
  color: #909399;
}

.history-time {
  color: #c0c4cc;
}
</style>
