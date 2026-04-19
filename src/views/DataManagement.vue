<template>
  <div class="data-management">
    <h2>数据管理</h2>
    <el-card>
      <template #header>
        <div class="card-header">
          <span>数据集列表</span>
          <el-button type="primary">
            <el-icon><Plus /></el-icon>
            上传数据
          </el-button>
        </div>
      </template>
      <el-table :data="datasets" style="width: 100%">
        <el-table-column prop="name" label="数据集名称" />
        <el-table-column prop="type" label="数据类型">
          <template #default="scope">
            <el-tag>{{ scope.row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="size" label="数据大小" />
        <el-table-column prop="count" label="样本数量" />
        <el-table-column prop="createdAt" label="创建时间" />
        <el-table-column label="操作">
          <template #default>
            <el-button type="primary" link>预览</el-button>
            <el-button type="primary" link>下载</el-button>
            <el-button type="danger" link>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Plus } from '@element-plus/icons-vue';

const datasets = ref([
  { name: '训练数据集A', type: '图像', size: '2.5GB', count: 50000, createdAt: '2024-01-15' },
  { name: '训练数据集B', type: '文本', size: '800MB', count: 100000, createdAt: '2024-01-10' },
  { name: '测试数据集A', type: '图像', size: '500MB', count: 10000, createdAt: '2024-01-08' }
]);
</script>

<style scoped>
.data-management h2 {
  margin-bottom: 20px;
  color: #303133;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
