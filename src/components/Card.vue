<template>
  <el-container class="card">
    <el-card class="e-card">
      <slot></slot>
    </el-card>
  </el-container>
</template>

<style scoped>
.card {
  justify-content: center;
}
@media (max-width: 480px) {
  .e-card {
    width: 100%;
  }
}
@media (max-width: 768px) {
  .e-card {
    width: 100%;
  }
}
@media (max-width: 1020px) {
  .e-card {
    width: 100%;
  }
}
@media (min-width: 1020px) {
  .e-card {
    width: 1020px;
  }
}
</style>