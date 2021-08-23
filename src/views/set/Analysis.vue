<template>
  <card class="box-card">
    <h3>{{ name }}</h3>
    <el-table
      :data="users"
      style="width: 100%"
      v-loading="loading"
      :default-sort="{ prop: 'passed', order: 'descending' }"
      :row-class-name="tableRowClassName"
    >
      <el-table-column label="Index" width="120">
        <template #default="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="class" label="Class" width="140">
      </el-table-column>
      <el-table-column prop="nickname" label="Name" min-width="120">
      </el-table-column>
      <el-table-column prop="passed" sortable label="Passed" width="120">
      </el-table-column>
      <el-table-column prop="daily" sortable label="Daily" width="120">
      </el-table-column>
      <el-table-column prop="weekly" sortable label="Weekly" width="120">
      </el-table-column>
      <el-table-column prop="monthly" sortable label="Monthly" width="120">
      </el-table-column>
      <el-table-column prop="process" label="Process" width="120">
        <template #default="scope">
          {{ scope.row.passed }} / {{ problemCount }}
        </template>
      </el-table-column>
    </el-table>
    <el-row style="margin-top: 30px;">
      <el-button @click="downloadExcel">下载 Excel</el-button>
    </el-row>
  </card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import request from "../../request";
import XLSX from "xlsx";

export default defineComponent({
  data() {
    const users: any = [];
    const problems: any = [];
    return {
      loading: true,
      id: Number(this.$route.params.id),
      users,
      problems,
      problemCount: 0,
      name: "",
      tableData: [],
    };
  },
  setup() {},
  created() {
    this.fetchSet();
  },
  methods: {
    downloadExcel() {
      const workbook = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet([]);
      XLSX.utils.book_append_sheet(workbook, ws, "A1");
      const table = [];
      for (const user of this.users) {
        table.push({
          Class: user.class,
          Name: user.nickname,
          Passed: user.passed,
          Daily: user.daily,
          Weekly: user.weekly,
          Monthly: user.monthly,
          Process: `${user.passed} / ${this.problemCount}`
        });
      }
      table.sort(function (a, b) {
        return b.Passed - a.Passed
      })
      XLSX.utils.sheet_add_json(ws, table);
      XLSX.writeFile(workbook, this.name + ".xlsx");
    },
    async fetchSet() {
      this.loading = true;
      const resp = await request.get(`/step/${this.id}`);
      this.problems = resp.data.problems;
      const problemSet = new Set();
      for (const problem of this.problems) {
        problemSet.add(problem.id)
      }
      this.problemCount = problemSet.size;
      this.users = resp.data.users;
      // 计算每个人通过的题目数量
      for (const user of this.users) {
        user.passed = Object.values(user.solutions).filter(
          (solution: any) => solution.result === "Accepted"
        ).length;
        user.daily = Object.values(user.solutions).filter(
          (solution: any) =>
            solution.result === "Accepted" &&
            new Date().getTime() - new Date(solution.date).getTime() <
              24 * 60 * 60 * 1000
        ).length;
        user.weekly = Object.values(user.solutions).filter(
          (solution: any) =>
            solution.result === "Accepted" &&
            new Date().getTime() - new Date(solution.date).getTime() <
              7 * 24 * 60 * 60 * 1000
        ).length;
        user.monthly = Object.values(user.solutions).filter(
          (solution: any) =>
            solution.result === "Accepted" &&
            new Date().getTime() - new Date(solution.date).getTime() <
              30 * 24 * 60 * 60 * 1000
        ).length;
      }
      this.name = resp.data.name;
      document.title = this.name + " - StepByStep";
      this.loading = false;
    },
    //@ts-ignore
    tableRowClassName({ row, rowIndex }) {
      if (row.passed === this.problemCount) {
        return "passed";
      }
      if (row.passed === 0) {
        return "zero";
      }
    },
  },
});
</script>

<style scoped>
.passed {
  background: #f0f9eb;
}
.zero {
  background: oldlace;
}
</style>