<template>
  <el-menu
    :default-active="activeMenu"
    mode="horizontal"
    background-color="#304156"
    text-color="#bfcbd9"
    active-text-color="#409EFF"
    @select="handleSelect"
    class="header-menu"
  >
    <el-menu-item index="ai-model">
      <el-icon><Cpu /></el-icon>
      <span>AI模型库管理</span>
    </el-menu-item>
    <el-menu-item index="data-management">
      <el-icon><DataAnalysis /></el-icon>
      <span>数据管理</span>
    </el-menu-item>
  </el-menu>
</template>

<script setup>
import { Cpu, DataAnalysis } from '@element-plus/icons-vue';

const props = defineProps({
  activeMenu: {
    type: String,
    default: 'ai-model'
  }
});

const emit = defineEmits(['menuChange']);

const handleSelect = (index) => {
  emit('menuChange', index);
};
</script>

<style scoped>
.header-menu {
  height: 60px;
  line-height: 60px;
  border-bottom: none;
}

:deep(.el-menu-item) {
  height: 60px;
  line-height: 60px;
  border-bottom: none;
}

:deep(.el-menu-item:hover) {
  background-color: rgba(255, 255, 255, 0.1) !important;
}

:deep(.el-menu-item.is-active) {
  background-color: rgba(64, 158, 255, 0.2) !important;
}
</style>
