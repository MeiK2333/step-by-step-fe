<template>
  <card class="box-card">
    <el-alert
      v-for="(row, idx) in error_data"
      :key="idx"
      :title="row"
      type="error"
    >
    </el-alert>
    <el-table
      v-loading="loading"
      :default-sort="{ prop: 'class', order: 'ascending' }"
      :data="data"
      style="width: 100%"
    >
      <el-table-column prop="class" label="Class" width="180">
      </el-table-column>
      <el-table-column prop="nickname" label="Nickname" width="180">
      </el-table-column>
      <el-table-column prop="username" label="Username" width="180">
      </el-table-column>
      <el-table-column prop="source" label="Source" width="180">
      </el-table-column>
      <el-table-column label="Operation"> </el-table-column>
    </el-table>
    <div style="margin-top: 20px">
      <el-button @click="onClickUpload">选择 Excel</el-button>
      <el-button :disabled="data.length === 0" type="primary">上传</el-button>
    </div>
  </card>
  <input
    ref="excel_upload_input"
    @change="handleFile"
    type="file"
    accept=".xlsx"
    style="display: none"
  />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import XLSX from "xlsx";

export default defineComponent({
  data() {
    const data: any[] = [];
    const error_data: any[] = [];
    return {
      loading: false,
      data,
      error_data,
    };
  },
  created() {},
  methods: {
    onClickUpload() {
      const dom = this.$refs.excel_upload_input;
      //@ts-ignore
      dom.click();
    },
    handleFile(e: any) {
      this.loading = true;
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet) as any[];
        this.data = [];
        this.error_data = [];
        for (let i = 0; i < json.length; i++) {
          if (!this.checkUploadRow(json[i])) {
            const values = Object.values(json[i]);
            this.error_data.push(`${values.join()} 校验未通过!`);
            continue;
          }
          this.data.push(json[i]);
        }
        this.loading = false;
      };
      reader.readAsArrayBuffer(file);
    },
    checkUploadRow(row: any): boolean {
      if (!row.class || !row.nickname || !row.nickname || !row.source) {
        return false;
      }
      return true;
    },
  },
});
</script>
