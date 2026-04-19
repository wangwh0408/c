<template>
  <div class="model-training">
    <h2>模型训练</h2>
    <el-card>
      <template #header>
        <span>训练配置</span>
      </template>
      <el-form :model="form" label-width="120px">
        <el-form-item label="模型名称">
          <el-input v-model="form.modelName" placeholder="请输入模型名称" />
        </el-form-item>
        <el-form-item label="训练数据">
          <el-select v-model="form.dataset" placeholder="请选择数据集">
            <el-option label="数据集A" value="datasetA" />
            <el-option label="数据集B" value="datasetB" />
          </el-select>
        </el-form-item>
        <el-form-item label="训练轮次">
          <el-input-number v-model="form.epochs" :min="1" :max="1000" />
        </el-form-item>
        <el-form-item label="学习率">
          <el-slider v-model="form.learningRate" :min="0.0001" :max="0.1" :step="0.0001" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="startTraining">开始训练</el-button>
          <el-button>重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';

const form = ref({
  modelName: '',
  dataset: '',
  epochs: 100,
  learningRate: 0.001
});

const startTraining = () => {
  if (!form.value.modelName || !form.value.dataset) {
    ElMessage.warning('请填写完整的训练配置');
    return;
  }
  ElMessage.success('训练任务已启动');
};
</script>

<style scoped>
.model-training h2 {
  margin-bottom: 20px;
  color: #303133;
}
</style>
