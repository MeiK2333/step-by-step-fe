<template>
  <div v-loading.fullscreen.lock="loading"></div>
  <div class="step-by-step-main">
    <!-- 左上角那个始终保持不动的玩意儿，需要保持在最前 -->
    <div
      :style="{
        height: '80px',
        width: '360px',
        'z-index': 3,
        position: 'absolute',
        overflow: 'hidden',
        'border-bottom': '1px solid #ddd',
      }"
    >
      <table>
        <thead>
          <tr>
            <th colspan="3" style="font-size: 16px">
              {{ name }}
            </th>
          </tr>
          <tr>
            <th>专项</th>
            <th>专题</th>
            <th>题目</th>
          </tr>
        </thead>
      </table>
    </div>

    <!-- 上方的用户列表 -->
    <div
      class="display-scrollbar"
      id="scroll-top"
      :style="{
        width: tableWidth - 360 + 'px',
        height: '80px',
        'z-index': 2,
        'overflow-y': 'hidden',
        'overflow-x': 'auto',
        position: 'relative',
        'border-bottom': '1px solid #ddd',
        left: '360px',
      }"
    >
      <table :style="{ width: 120 * users.length + 'px' }">
        <thead>
          <tr style="height: 80px; font-size: 12px">
            <th v-for="(user, idx) in users" :key="idx">
              <router-link
                :to="{ name: 'user', params: { username: user.username } }"
              >
                {{ user.class }}
                <br />
                {{ user.nickname }}
                <br />
              </router-link>
              <p>
                {{ user.passed }}
                / {{ problems.length }}
              </p>
              <el-progress
                :text-inside="true"
                :stroke-width="20"
                :percentage="
                  Number(((user.passed / problems.length) * 100).toFixed(2))
                "
                :color="customColor"
                style="width: 80%; padding-left: 10%; padding-right: 10%"
              ></el-progress>
            </th>
          </tr>
          <tr>
            <th></th>
          </tr>
        </thead>
      </table>
    </div>

    <!-- 左边的题目列表 -->
    <div
      class="display-scrollbar sync-scroll"
      id="scroll-left"
      :style="{
        height: tableHeight - 80 + 'px',
        width: '360px',
        'z-index': 2,
        'overflow-x': 'hidden',
        'overflow-y': 'auto',
        position: 'absolute',
      }"
    >
      <table>
        <tbody>
          <tr v-for="(i, idx) in problems" :key="idx">
            <td
              v-if="i.project"
              :rowspan="i.project_len"
              class="problem-manyrow"
            >
              <span>{{ i.project }}</span>
            </td>
            <td v-if="i.topic" :rowspan="i.topic_len" class="problem-manyrow">
              <span>{{ i.topic }}</span>
            </td>
            <td>
              <el-tooltip
                class="item"
                effect="dark"
                :content="i.title"
                placement="right"
              >
                <a :href="i.link" target="_blank">{{ i.problem }}</a>
              </el-tooltip>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 正文段，显示优先级最低 -->
    <div
      class="scroll-main"
      id="scroll-main"
      :style="{
        height: tableHeight - 80 + 'px',
        width: tableWidth - 360 + 'px',
        'z-index': 1,
        overflow: 'auto',
        position: 'relative',
        left: '360px',
      }"
    >
      <table :style="{ width: 120 * users.length + 'px' }">
        <tbody>
          <tr v-for="(problem, idx) in problems" :key="idx">
            <td
              v-for="(user, jdx) in users"
              :key="jdx"
              :class="solutionClass(user.solutions[problem.id])"
            >
              <template v-if="user.solutions[problem.id]">
                {{ user.solutions[problem.id].date }}
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import request from '../../request';
import throttle from "lodash/throttle";

export default defineComponent({
  name: "SetDetail",
  data() {
    const users: any = [];
    const problems: any = [];
    return {
      loading: true,
      id: Number(this.$route.params.id),
      problems,
      name: "",
      users,
      tableSync: (event: any) => {},
      tableWidth: 0,
      tableHeight: 0,
    };
  },
  created() {
    this.fetchSet();
  },
  mounted() {
    this.resize();
    window.addEventListener("resize", this.resize);

    const scrollLeft = document.querySelector("#scroll-left");
    const scrollTop = document.querySelector("#scroll-top");
    const scrollMain = document.querySelector("#scroll-main");
    if (scrollLeft === null || scrollTop === null || scrollMain === null) {
      return;
    }
    const tableSync = throttle((event) => {
      const top = event.target.scrollTop;
      const left = event.target.scrollLeft;
      const target = event.target as Element;
      // 左侧滑动只能影响中间的上下
      if (target === scrollLeft) {
        scrollMain.scrollTop = top;
      }
      // 顶部滑动只能影响中间左右
      if (target === scrollTop) {
        scrollMain.scrollLeft = left;
      }
      // 中间滑动需要改变上左的位置
      if (target === scrollMain) {
        scrollLeft.scrollTop = top;
        scrollTop.scrollLeft = left;
      }
    }, 10);
    this.tableSync = tableSync;
    scrollLeft.addEventListener("scroll", this.tableSync, {
      passive: true,
    });
    scrollTop.addEventListener("scroll", this.tableSync, {
      passive: true,
    });
    scrollMain.addEventListener("scroll", this.tableSync, {
      passive: true,
    });
  },
  unmounted() {
    window.removeEventListener("resize", this.resize);
    document
      .querySelector("#scroll-left")
      ?.removeEventListener("scroll", this.tableSync, true);
    document
      .querySelector("#scroll-top")
      ?.removeEventListener("scroll", this.tableSync, true);
    document
      .querySelector("#scroll-main")
      ?.removeEventListener("scroll", this.tableSync, true);
  },
  methods: {
    resize() {
      this.tableWidth =
        document.querySelector(".step-by-step-main")?.clientWidth || 0;
      this.tableHeight =
        document.querySelector(".step-by-step-main")?.clientHeight || 0;
    },
    async fetchSet() {
      this.loading = true;
      const resp = await request.get(`/step/${this.id}`);
      this.problems = resp.data.problems;
      this.users = resp.data.users;
      // 计算每个人通过的题目数量
      for (const user of this.users) {
        user.passed = Object.values(user.solutions).filter(
          (solution: any) => solution.result === "Accepted"
        ).length;
      }
      // 计算专题专项需要占几行
      let topic_len = 1;
      let project_len = 1;
      for (let i = this.problems.length - 1; i >= 0; i--) {
        const problem = this.problems[i];
        if (problem.topic === null) {
          topic_len++;
        } else {
          problem.topic_len = topic_len;
          topic_len = 1;
        }
        if (problem.project === null) {
          project_len++;
        } else {
          problem.project_len = project_len;
          project_len = 1;
        }
      }
      this.name = resp.data.name;
      document.title = this.name + " - StepByStep";
      this.loading = false;
    },
    customColor(percentage: number) {
      if (percentage == 100) {
        return "#409EFF";
      } else if (percentage > 70) {
        return "#67c23a";
      } else if (percentage > 30) {
        return "#e6a23c";
      } else {
        return "#909399";
      }
    },
    solutionClass(
      solution: { result: string; date: string } | null | undefined
    ) {
      if (solution === undefined || solution === null) {
        return "";
      }
      const result = solution.result;
      const date = solution.date;
      let clazz = "";
      switch (result) {
        case "Accepted":
          clazz = "ac";
          break;
        default:
          // 不是 AC 全是错误
          clazz = "wa";
          break;
      }
      // 七天内提交算近期
      if (
        new Date().getTime() - new Date(date).getTime() <
        7 * 24 * 60 * 60 * 1000
      ) {
        clazz += "-now";
      }
      return clazz;
    },
  },
});
</script>

<style scoped>
.step-by-step-main {
  height: 100%;
  width: 100%;
  font-size: 14px;
  font-family: "Helvetica Neue", Helvetica, "Microsoft Yahei", Arial, sans-serif;
}
table {
  /* table-layout: fixed; */
  border-spacing: 1px;
  background-color: #ddd;
}
tr {
  overflow: auto;
  text-align: center;
}
th,
td {
  padding: 0;
  background-color: #fff;
  height: 39px;
  width: 119px;
}
.display-scrollbar {
  overflow: -moz-scrollbars-none;
  -ms-overflow-style: none;
}
.display-scrollbar::-webkit-scrollbar {
  display: none;
}
.scroll-main td {
  background-color: #fafafa;
}
.problem-manyrow {
  vertical-align: top;
  overflow-wrap: anywhere;
  overflow: hidden;
}
.problem-manyrow span {
  padding: 8px;
}
/* 第一个 AC 的 */
.fb {
  background-color: #2aabd2 !important;
  color: #fff !important;
}
.fb:hover {
  background-color: #28a4c9 !important;
}
/* 最近 AC 的 */
.ac-now {
  background-color: #419641 !important;
  color: #fff !important;
}
.ac-now:hover {
  background-color: #3e8f3e !important;
}
/* 历史 AC 的 */
.ac {
  background-color: #dff0d8 !important;
}
.ac:hover {
  background-color: #d0e9c6 !important;
}
/* 最近错误的 */
.wa-now {
  background-color: #d9534f !important;
  color: #fff !important;
}
.wa-now:hover {
  background-color: #c12e2a !important;
}
/* 历史错误的 */
.wa {
  background-color: #f2dede !important;
}
.wa:hover {
  background-color: #ebcccc !important;
}
th p {
  margin: 0 0 4px;
  font-weight: normal;
  font-size: smaller;
}
</style>