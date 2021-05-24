<template>
  <h4>最近的比赛</h4>
  <el-table v-loading="loading" :data="contests" stripe style="width: 100%">
    <el-table-column prop="source" label="Platform" width="120">
    </el-table-column>
    <el-table-column prop="name" label="Name" min-width="360">
      <template #default="scope">
        <a :href="scope.row.link" target="_blank">
          {{ scope.row.name }}
          <i
            v-if="scope.row.running"
            aria-label="icon: clock-circle"
            class="anticon anticon-clock-circle"
            ><svg
              viewBox="64 64 896 896"
              data-icon="clock-circle"
              width="1em"
              height="1em"
              fill="currentColor"
              aria-hidden="true"
              focusable="false"
              class=""
            >
              <path
                d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"
              ></path>
              <path
                d="M686.7 638.6L544.1 535.5V288c0-4.4-3.6-8-8-8H488c-4.4 0-8 3.6-8 8v275.4c0 2.6 1.2 5 3.3 6.5l165.4 120.6c3.6 2.6 8.6 1.8 11.2-1.7l28.6-39c2.6-3.7 1.8-8.7-1.8-11.2z"
              ></path></svg
          ></i>
          <div v-if="scope.row.state" class="ant-tag ant-tag-blue">
            {{ scope.row.state }}
          </div>
        </a>
      </template>
    </el-table-column>
    <el-table-column prop="start" label="Start" width="180"> </el-table-column>
    <el-table-column prop="end" label="End" width="180"> </el-table-column>
  </el-table>
</template>

<script lang="ts">
import moment from "moment";
import { defineComponent } from "vue";
import request from "../request";

export default defineComponent({
  props: ["username", "size"],
  data() {
    const limit = this.size ? this.size : 20;
    const contests: any[] = [];
    return {
      loading: false,
      limit,
      contests,
    };
  },
  created() {
    this.fetch();
  },
  methods: {
    async fetch() {
      this.loading = true;
      const resp = await request.get(
        "https://contests.sdutacm.cn/contests.json"
      );
      this.contests = [];
      const now = new Date();
      for (const iterator of resp.data) {
        iterator.start_time = new Date(iterator.start_time);
        iterator.end_time = new Date(iterator.end_time);
        iterator.start = moment(iterator.start_time).format("YYYY-MM-DD HH:mm");
        iterator.end = moment(iterator.end_time).format("YYYY-MM-DD HH:mm");
        // 已经结束的不显示
        if (iterator.end_time < now) {
          continue;
        }
        // 时长超过一天的认为是长期实验，不显示在最近比赛中
        if (
          iterator.end_time.getTime() - iterator.start_time.getTime() >=
          24 * 60 * 60 * 1000
        ) {
          continue;
        }
        if (iterator.start_time < now) {
          iterator.running = true;
        }
        iterator.state = moment(iterator.start_time).fromNow();
        this.contests.push(iterator);
      }
      this.loading = false;
    },
  },
});
</script>

<style scoped>
.ant-tag {
  box-sizing: border-box;
  margin: 0;
  margin-left: 5px;
  padding: 0;
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
  font-variant: tabular-nums;
  line-height: 1.5;
  list-style: none;
  font-feature-settings: "tnum";
  display: inline-block;
  height: 22px;
  margin-right: 8px;
  padding: 0 7px;
  font-size: 12px;
  line-height: 20px;
  white-space: nowrap;
  background: #fafafa;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
  opacity: 1;
  transition: all 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);
}
.ant-tag-blue {
  color: #1890ff;
  background: #e6f7ff;
  border-color: #91d5ff;
}
</style>