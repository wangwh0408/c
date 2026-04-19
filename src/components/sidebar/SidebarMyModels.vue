<template>
  <div class="sidebar-component">
    <h4 class="sidebar-title">我的模型</h4>
    <div class="stats-cards">
      <div class="stat-card">
        <span class="stat-number">{{ stats.total }}</span>
        <span class="stat-label">模型总数</span>
      </div>
      <div class="stat-card">
        <span class="stat-number green">{{ stats.active }}</span>
        <span class="stat-label">运行中</span>
      </div>
      <div class="stat-card">
        <span class="stat-number blue">{{ stats.completed }}</span>
        <span class="stat-label">已完成</span>
      </div>
    </div>
    <div class="quick-actions">
      <h5>快捷操作</h5>
      <div class="action-buttons">
        <el-button size="small" type="primary" @click="handleAction('create')">
          <el-icon><Plus /></el-icon>
          新建模型
        </el-button>
        <el-button size="small" @click="handleAction('import')">
          <el-icon><Upload /></el-icon>
          导入模型
        </el-button>
      </div>
    </div>
    <div class="recent-models">
      <h5>最近模型</h5>
      <el-table :data="recentModels" size="small" v-if="recentModels.length > 0">
        <el-table-column prop="name" label="名称" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="scope">
            <el-tag :type="getTagType(scope.row.status)" size="small">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
      <p v-else class="empty-text">暂无模型数据</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Plus, Upload } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

const stats = ref({
  total: 5,
  active: 2,
  completed: 3
});

const recentModels = ref([
  { name: '图像识别 v1.0', status: '已完成' },
  { name: '文本分类 v2.0', status: '训练中' }
]);

const getTagType = (status) => {
  const map = {
    '已完成': 'success',
    '训练中': 'warning',
    '失败': 'danger'
  };
  return map[status] || 'info';
};

const handleAction = (action) => {
  if (action === 'create') {
    ElMessage.info('准备创建新模型...');
  } else if (action === 'import') {
    ElMessage.info('准备导入模型...');
  }
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

.stats-cards {
  display: flex;
  gap: 8px;
  margin-bottom: 15px;
}

.stat-card {
  flex: 1;
  background: #fff;
  border-radius: 4px;
  padding: 8px;
  text-align: center;
  border: 1px solid #ebeef5;
}

.stat-number {
  display: block;
  font-size: 18px;
  font-weight: bold;
  color: #409EFF;
}

.stat-number.green {
  color: #67C23A;
}

.stat-number.blue {
  color: #409EFF;
}

.stat-label {
  font-size: 12px;
  color: #909399;
}

.quick-actions, .recent-models {
  margin-bottom: 12px;
}

.quick-actions h5, .recent-models h5 {
  font-size: 13px;
  color: #606266;
  margin-bottom: 8px;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.empty-text {
  font-size: 12px;
  color: #909399;
  text-align: center;
  padding: 10px;
}
</style>
