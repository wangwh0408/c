<template>
  <div class="model-testing">
    <h2>模型测试</h2>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>测试配置</span>
          </template>
          <el-form :model="form" label-width="100px">
            <el-form-item label="选择模型">
              <el-select v-model="form.model" placeholder="请选择模型">
                <el-option label="图像识别模型 v1.0" value="model1" />
                <el-option label="文本分类模型 v2.0" value="model2" />
              </el-select>
            </el-form-item>
            <el-form-item label="测试数据">
              <el-select v-model="form.testData" placeholder="请选择测试数据">
                <el-option label="测试集A" value="testA" />
                <el-option label="测试集B" value="testB" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="runTest">开始测试</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>测试结果</span>
          </template>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="准确率">{{ results.accuracy }}%</el-descriptions-item>
            <el-descriptions-item label="精确率">{{ results.precision }}%</el-descriptions-item>
            <el-descriptions-item label="召回率">{{ results.recall }}%</el-descriptions-item>
            <el-descriptions-item label="F1分数">{{ results.f1Score }}</el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';

const form = ref({
  model: '',
  testData: ''
});

const results = ref({
  accuracy: 92.5,
  precision: 91.2,
  recall: 93.8,
  f1Score: 0.925
});

const runTest = () => {
  if (!form.value.model || !form.value.testData) {
    ElMessage.warning('请选择模型和测试数据');
    return;
  }
  ElMessage.success('测试完成');
};
</script>

<style scoped>
.model-testing h2 {
  margin-bottom: 20px;
  color: #303133;
}
</style>
