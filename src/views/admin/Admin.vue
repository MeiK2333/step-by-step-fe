<template>
  <el-card class="box-card" style="margin-bottom: 20px">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item
        v-for="(item, idx) in $route.matched"
        :key="idx"
        :to="{ path: item.path }"
        >{{ item.meta.title }}</el-breadcrumb-item
      >
    </el-breadcrumb>
  </el-card>
  <router-view></router-view>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  data() {},
  setup() {},
});
</script>
