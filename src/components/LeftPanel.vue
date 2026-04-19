<template>
  <div class="left-panel">
    <div class="top-section">
      <h3 class="section-title">{{ sectionTitle }}</h3>
      <el-menu
        :default-active="defaultActive"
        background-color="#f5f7fa"
        text-color="#606266"
        active-text-color="#409EFF"
        @select="handleSelect"
      >
        <el-menu-item
          v-for="item in subMenus"
          :key="item.index"
          :index="item.path"
        >
          <el-icon><component :is="item.icon" /></el-icon>
          <span>{{ item.label }}</span>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="bottom-section">
      <component :is="currentSidebarComponent" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, markRaw } from 'vue';
import { useRoute } from 'vue-router';
import { List, Setting, DataAnalysis, Folder } from '@element-plus/icons-vue';
import SidebarMyModels from './sidebar/SidebarMyModels.vue';
import SidebarModelTraining from './sidebar/SidebarModelTraining.vue';
import SidebarModelTesting from './sidebar/SidebarModelTesting.vue';
import SidebarDataManagement from './sidebar/SidebarDataManagement.vue';

const props = defineProps({
  activeMenu: {
    type: String,
    default: 'ai-model'
  }
});

const emit = defineEmits(['subMenuChange']);
const route = useRoute();

const currentPath = ref('/my-models');

const subMenus = computed(() => {
  if (props.activeMenu === 'ai-model') {
    return [
      { path: '/my-models', label: '我的模型', icon: List, index: '1' },
      { path: '/model-training', label: '模型训练', icon: Setting, index: '2' },
      { path: '/model-testing', label: '模型测试', icon: DataAnalysis, index: '3' }
    ];
  } else {
    return [
      { path: '/data-management', label: '数据管理', icon: Folder, index: '4' }
    ];
  }
});

const sectionTitle = computed(() => {
  return props.activeMenu === 'ai-model' ? 'AI模型库管理' : '数据管理';
});

const defaultActive = computed(() => {
  return route.path;
});

const sidebarComponents = {
  '/my-models': markRaw(SidebarMyModels),
  '/model-training': markRaw(SidebarModelTraining),
  '/model-testing': markRaw(SidebarModelTesting),
  '/data-management': markRaw(SidebarDataManagement)
};

const currentSidebarComponent = computed(() => {
  return sidebarComponents[route.path] || sidebarComponents['/my-models'];
});

const handleSelect = (index) => {
  currentPath.value = index;
  emit('subMenuChange', index);
};

watch(() => props.activeMenu, (newVal) => {
  if (newVal === 'ai-model') {
    currentPath.value = '/my-models';
  } else {
    currentPath.value = '/data-management';
  }
}, { immediate: true });
</script>

<style scoped>
.left-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.top-section,
.bottom-section {
  padding: 15px;
}

.top-section {
  flex: 1;
  overflow-y: auto;
  border-bottom: 1px solid #e4e7ed;
  min-height: 200px;
}

.bottom-section {
  flex: 1;
  overflow-y: auto;
  background-color: #fafafa;
  border-radius: 0 0 4px 4px;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 2px solid #409EFF;
}

:deep(.el-menu) {
  border-right: none;
  background-color: transparent;
}

:deep(.el-menu-item) {
  height: 45px;
  line-height: 45px;
  margin: 5px 0;
  border-radius: 4px;
}

:deep(.el-menu-item:hover) {
  background-color: rgba(64, 158, 255, 0.1);
}

:deep(.el-menu-item.is-active) {
  background-color: rgba(64, 158, 255, 0.2);
  color: #409EFF;
}
</style>
