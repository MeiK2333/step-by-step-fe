<template>
  <div class="contributions">
    <h4 v-if="display.year === -1">
      {{ display.count }} solutions in the last year
    </h4>
    <h4 v-else>{{ display.count }} solutions in {{ display.year }}</h4>
    <div class="calendar-graph">
      <svg width="828" height="128" class="js-calendar-graph-svg">
        <g transform="translate(10, 20)" id="graph-svg">
          <g
            v-for="(_, i) of 53"
            :key="i"
            :transform="`translate(${i * 16}, 0)`"
          >
            <rect
              v-for="(item, j) of display.data.filter(
                (item) => item.weekOfYear === i
              )"
              :key="j"
              class="day"
              width="11"
              height="11"
              :x="16 - i"
              :y="item.dayOfWeek * 15"
              :fill="rectColor(item.count)"
            ></rect>
          </g>
        </g>
      </svg>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import moment from "moment";
import request from "../request";

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const monthsFull = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

interface GraphItem {
  dayOfWeek: number;
  weekOfYear: number;
  count: number;
  date: Date;
}

export default defineComponent({
  props: ["username"],
  data() {
    const events: any[] = [];
    const years: any[] = [];
    const eventDict: { [name: string]: number } = {};
    const monthPos: number[] = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
    const data: GraphItem[] = [];
    return {
      loading: false,
      events,
      eventDict,
      currentMonth: new Date().getMonth(),
      monthPos,
      years,
      display: {
        count: 0,
        year: -1,
        data,
      },
    };
  },
  created() {
    this.fetch();
  },
  methods: {
    async fetch() {
      this.loading = true;
      const resp = await request.get(`/events?username=${this.username}`);
      this.events = resp.data;
      this.events.forEach((value) => {
        const year = Number(value.date.split("-")[0]);
        if (!this.years.includes(year)) {
          this.years.push(year);
        }
        this.eventDict[value.date] = value.count;
      });
      this.years.sort((a, b) => {
        return b - a;
      });
      this.displayYear();
      this.loading = false;
    },
    monthName(month: number) {
      return months[month % 12];
    },
    displayYear(year?: number) {
      let startDay: Date;
      let endDay: Date;
      const now = new Date();
      if (!year) {
        // recent
        // 如果是最近一年，那么显示最近 53 周的数据（从周日开始，即第一列格子填满，一直到当前日期为止），在 365 - 371 天之间
        this.display.year = -1;
        startDay = moment(now).add(-365, "days").toDate();
        // 日期从周日开始
        startDay = moment(startDay).add(-startDay.getDay(), "days").toDate();
        endDay = now;
      } else {
        // 如果指定年份，那么就只显示该年份数据，第一列不必填满，以实际起止日期为准
        this.display.year = year;
        startDay = new Date(year, 0, 1);
        endDay = new Date(year, 11, 31);
      }
      startDay.setHours(0, 0, 0, 0);
      endDay.setHours(23, 59, 59, 99);
      let weekOfYear = -1;
      this.display.count = 0;
      // TODO: 月份显示、鼠标悬浮显示格子具体信息等
      for (
        let current = startDay;
        current <= endDay;
        current = moment(current).add(1, "days").toDate()
      ) {
        const dayOfWeek = current.getDay();
        // 一周从周日开始
        if (dayOfWeek === 0) {
          weekOfYear += 1;
        }
        const count = this.eventDict[moment(current).format("YYYY-MM-DD")] || 0;
        this.display.count += count;
        this.display.data.push({
          dayOfWeek,
          weekOfYear,
          count,
          date: current,
        });
      }
    },
    rectColor(count: number) {
      if (count === 0) {
        return "#ebedf0";
      } else if (count === 1) {
        return "#9be9a8";
      } else if (count === 2) {
        return "#40c463";
      } else if (count === 3) {
        return "#30a14e";
      } else {
        return "#216e39";
      }
    },
  },
});
</script>

<style scoped>
.calendar-graph {
  font-size: 10px;
}
</style>