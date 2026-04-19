<template>
  <el-row class="main-row">
    <el-col :span="5" class="left-col">
      <LeftPanel :active-menu="activeMenu" @sub-menu-change="handleSubMenuChange" />
    </el-col>
    <el-col :span="14" class="center-col">
      <div class="center-content">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </el-col>
    <el-col :span="5" class="right-col">
      <div class="right-content">
        <h3>右侧面板</h3>
        <p>这里可以放置帮助信息、快捷操作或其他辅助内容</p>
      </div>
    </el-col>
  </el-row>
</template>

<script setup>
import { watch } from 'vue';
import { useRouter } from 'vue-router';
import LeftPanel from './LeftPanel.vue';

const props = defineProps({
  activeMenu: {
    type: String,
    default: 'ai-model'
  }
});

const router = useRouter();

const handleSubMenuChange = (path) => {
  if (path) {
    router.push(path);
  }
};

watch(() => props.activeMenu, (newVal) => {
  if (newVal === 'data-management') {
    router.push('/data-management');
  } else if (newVal === 'ai-model') {
    router.push('/my-models');
  }
}, { immediate: true });
</script>

<style scoped>
.main-row {
  height: 100%;
  display: flex;
}

.left-col, .center-col, .right-col {
  height: 100%;
  overflow: hidden;
}

.left-col {
  border-right: 1px solid #e4e7ed;
  background-color: #f5f7fa;
}

.center-col {
  background-color: #ffffff;
}

.center-content {
  height: 100%;
  padding: 20px;
  overflow-y: auto;
}

.right-col {
  border-left: 1px solid #e4e7ed;
  background-color: #f5f7fa;
}

.right-content {
  height: 100%;
  padding: 20px;
}

.right-content h3 {
  margin-bottom: 15px;
  color: #303133;
}

.right-content p {
  color: #606266;
  line-height: 1.6;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
