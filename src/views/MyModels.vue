<template>
  <div class="my-models">
    <h2>我的模型</h2>
    <el-table :data="models" style="width: 100%">
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
    <el-pagination
      style="margin-top: 20px"
      :total="10"
      :page-size="10"
      layout="total, prev, pager, next"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';

const models = ref([
  { name: '图像识别模型 v1.0', type: 'CNN', status: '已完成', createdAt: '2024-01-15' },
  { name: '文本分类模型 v2.0', type: 'BERT', status: '训练中', createdAt: '2024-01-10' },
  { name: '语音识别模型 v1.5', type: 'RNN', status: '已完成', createdAt: '2024-01-05' }
]);

const getTagType = (status) => {
  const map = {
    '已完成': 'success',
    '训练中': 'warning',
    '失败': 'danger'
  };
  return map[status] || 'info';
};
</script>

<style scoped>
.my-models h2 {
  margin-bottom: 20px;
  color: #303133;
}
</style>
