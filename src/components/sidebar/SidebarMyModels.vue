<template>
  <div class="sidebar-component">
    <h4 class="sidebar-title">我的模型</h4>
    <div class="filter-section">
      <h5>筛选条件</h5>
      <el-form :model="filterForm" size="small" label-width="60px">
        <el-form-item label="模型类型">
          <el-select 
            v-model="filterForm.type" 
            placeholder="请选择类型" 
            clearable
            @change="handleFilterChange"
            style="width: 100%"
          >
            <el-option label="全部类型" value="" />
            <el-option label="CNN" value="CNN" />
            <el-option label="BERT" value="BERT" />
            <el-option label="RNN" value="RNN" />
            <el-option label="其他" value="其他" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="applyFilter" style="width: 100%">
            <el-icon><Search /></el-icon>
            应用筛选
          </el-button>
        </el-form-item>
      </el-form>
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
import { ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Search } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

const router = useRouter();
const route = useRoute();

const recentModels = ref([
  { name: '图像识别 v1.0', status: '已完成' },
  { name: '文本分类 v2.0', status: '训练中' }
]);

const filterForm = ref({
  type: route.query.type || ''
});

const getTagType = (status) => {
  const map = {
    '已完成': 'success',
    '训练中': 'warning',
    '失败': 'danger'
  };
  return map[status] || 'info';
};

const handleFilterChange = () => {
};

const applyFilter = () => {
  const query = { ...route.query };
  if (filterForm.value.type) {
    query.type = filterForm.value.type;
  } else {
    delete query.type;
  }
  router.push({ path: route.path, query });
  if (filterForm.value.type) {
    ElMessage.success(`已筛选类型为 ${filterForm.value.type} 的模型`);
  } else {
    ElMessage.info('已清除筛选条件');
  }
};

watch(() => route.query.type, (newType) => {
  filterForm.value.type = newType || '';
}, { immediate: true });
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

.filter-section {
  margin-bottom: 12px;
  padding: 10px;
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 4px;
}

.filter-section h5 {
  font-size: 13px;
  color: #606266;
  margin-bottom: 8px;
}

.filter-section :deep(.el-form-item) {
  margin-bottom: 8px;
}

.filter-section :deep(.el-form-item:last-child) {
  margin-bottom: 0;
}

.recent-models {
  margin-bottom: 12px;
}

.recent-models h5 {
  font-size: 13px;
  color: #606266;
  margin-bottom: 8px;
}

.empty-text {
  font-size: 12px;
  color: #909399;
  text-align: center;
  padding: 10px;
}
</style>
