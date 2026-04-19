<template>
  <div class="app-container">
    <el-row class="header-row">
      <el-col :span="24">
        <HeaderNav @menu-change="handleMenuChange" :active-menu="activeMenu" />
      </el-col>
    </el-row>
    <el-row class="main-row">
      <el-col :span="24" class="main-col">
        <MainLayout :active-menu="activeMenu" />
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import HeaderNav from './components/HeaderNav.vue';
import MainLayout from './components/MainLayout.vue';

const activeMenu = ref('ai-model');

const handleMenuChange = (menu) => {
  activeMenu.value = menu;
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #app {
  height: 100%;
  width: 100%;
}

.app-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.header-row {
  flex-shrink: 0;
}

.main-row {
  flex: 1;
  overflow: hidden;
}

.main-col {
  height: 100%;
}
</style>
