<template>
  <div class="my-models">
    <div class="page-header">
      <h2>我的模型</h2>
      <el-button type="primary" @click="handleCreateModel">
        <el-icon><Plus /></el-icon>
        新建模型
      </el-button>
    </div>
    <el-card class="filter-card" v-if="currentFilter">
      <div class="filter-info">
        <span>当前筛选：</span>
        <el-tag type="primary">{{ currentFilter }}</el-tag>
        <el-button type="primary" link @click="clearFilter">清除筛选</el-button>
      </div>
    </el-card>
    <el-table :data="filteredModels" style="width: 100%">
      <el-table-column prop="name" label="模型名称" />
      <el-table-column prop="type" label="模型类型" />
      <el-table-column prop="status" label="状态">
        <template #default="scope">
          <el-tag :type="getTagType(scope.row.status)">
            {{ scope.row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="创建时间" />
      <el-table-column label="操作">
        <template #default>
          <el-button type="primary" link>查看</el-button>
          <el-button type="primary" link>编辑</el-button>
          <el-button type="danger" link>删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-empty v-if="filteredModels.length === 0" description="没有找到匹配的模型" />
    <el-pagination
      style="margin-top: 20px"
      :total="filteredModels.length"
      :page-size="10"
      layout="total, prev, pager, next"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Plus } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

const route = useRoute();
const router = useRouter();

const models = ref([
  { name: '图像识别模型 v1.0', type: 'CNN', status: '已完成', createdAt: '2024-01-15' },
  { name: '文本分类模型 v2.0', type: 'BERT', status: '训练中', createdAt: '2024-01-10' },
  { name: '语音识别模型 v1.5', type: 'RNN', status: '已完成', createdAt: '2024-01-05' },
  { name: '图像识别模型 v2.0', type: 'CNN', status: '训练中', createdAt: '2024-01-08' },
  { name: '文本分类模型 v1.0', type: 'BERT', status: '已完成', createdAt: '2024-01-01' }
]);

const currentFilter = computed(() => {
  return route.query.type || null;
});

const filteredModels = computed(() => {
  if (!currentFilter.value) {
    return models.value;
  }
  return models.value.filter(model => model.type === currentFilter.value);
});

const getTagType = (status) => {
  const map = {
    '已完成': 'success',
    '训练中': 'warning',
    '失败': 'danger'
  };
  return map[status] || 'info';
};

const clearFilter = () => {
  const query = { ...route.query };
  delete query.type;
  router.push({ path: route.path, query });
};

const handleCreateModel = () => {
  ElMessage.info('准备创建新模型...');
};
</script>

<style scoped>
.my-models h2 {
  margin-bottom: 0;
  color: #303133;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.filter-card {
  margin-bottom: 15px;
}

.filter-info {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
