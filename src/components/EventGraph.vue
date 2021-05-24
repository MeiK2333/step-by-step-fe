<template>
  <div class="contributions" style="width: 828px">
    <h4>
      {{ display.count }} solutions in
      <select style="font-size: 16px" @change="yearChange($event)">
        <option value="recent">the last year</option>
        <option v-for="year of years" :key="year">{{ year }}</option>
      </select>
    </h4>
    <div class="calendar-graph">
      <div :style="tipStyle" class="svg-tip" ref="tip">
        <strong v-if="tipData.count === 1">1 post</strong
        ><strong v-else>{{ tipData.count }} posts</strong> on
        {{ dateFmt(tipData.date) }}
      </div>
      <svg width="980" height="128" class="js-calendar-graph-svg">
        <g class="svg-g-transform" id="graph-svg">
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
              @mouseover="alertRect($event, item)"
              @mouseleave="leaveRect()"
            ></rect>
          </g>
          <text
            :x="16 + item.pos * 15"
            y="-9"
            class="month"
            v-for="(item, idx) of monthPos"
            :key="idx"
          >
            {{ item.name }}
          </text>
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

interface GraphItem {
  dayOfWeek: number;
  weekOfYear: number;
  count: number;
  date: Date;
}

function getCoords(elem: Element) {
  var box = elem.getBoundingClientRect();

  var body = document.body;
  var docEl = document.documentElement;

  var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
  var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

  var clientTop = docEl.clientTop || body.clientTop || 0;
  var clientLeft = docEl.clientLeft || body.clientLeft || 0;

  var top = box.top + scrollTop - clientTop;
  var left = box.left + scrollLeft - clientLeft;

  return { top, left, width: box.width, height: box.height };
}

export default defineComponent({
  props: ["username"],
  data() {
    const events: any[] = [];
    const years: any[] = [];
    const eventDict: { [name: string]: number } = {};
    const monthPos: any[] = [];
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
      tipStyle: {
        display: "none",
        top: "0px",
        left: "0px",
      },
      tipData: {
        count: 0,
        date: new Date(),
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
      this.display.data = [];
      let mpos = 0;
      let mt = startDay.getMonth();
      this.monthPos = [
        {
          pos: 0,
          name: this.monthName(mt),
        },
      ];
      // TODO: 月份显示、鼠标悬浮显示格子具体信息等
      for (
        let current = startDay;
        current <= endDay;
        current = moment(current).add(1, "days").toDate()
      ) {
        const dayOfWeek = current.getDay();
        // 一周从周日开始
        if (dayOfWeek === 0) {
          // 如果发生了月份切换，则将其添加到 pos 中
          if (current.getMonth() != mt) {
            mt = current.getMonth();
            this.monthPos.push({ pos: mpos, name: this.monthName(mt) });
          }
          weekOfYear += 1;
          mpos += 1;
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
      } else if (count < 3) {
        return "#9be9a8";
      } else if (count < 8) {
        return "#40c463";
      } else if (count < 15) {
        return "#30a14e";
      } else {
        return "#216e39";
      }
    },
    alertRect(event: Event, rect: GraphItem) {
      this.tipData.count = rect.count;
      this.tipData.date = rect.date;
      if (!event.target) {
        return;
      }
      const coords = getCoords(event.target as Element);
      this.tipStyle.top = `${coords.top - 50}px`;
      this.tipStyle.left = `${coords.left + coords.width / 2}px`;
      this.tipStyle.display = "block";
    },
    dateFmt(date: Date) {
      return moment(date).format("MMM D, YYYY");
    },
    leaveRect() {
      this.tipStyle.display = "none";
    },
    yearChange(event: Event) {
      //@ts-ignore
      const value = event.target.value;
      if (value === 'recent') {
        this.displayYear();
      } else {
        this.displayYear(Number(value));
      }
    }
  },
});
</script>

<style scoped>
.calendar-graph {
  font-size: 10px;
}
.svg-tip {
  position: absolute;
  z-index: 99999;
  padding: 10px;
  font-size: 12px;
  color: #959da5;
  text-align: center;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 6px;
  white-space: nowrap;
  transform: translateX(-50%);
}
.svg-tip:after {
  position: absolute;
  bottom: -10px;
  left: 50%;
  width: 5px;
  height: 5px;
  box-sizing: border-box;
  margin: 0 0 0 -5px;
  content: " ";
  border: 5px solid transparent;
  border-top-color: rgba(0, 0, 0, 0.8);
}
.svg-tip strong {
  color: #dfe2e5;
  font-weight: 600;
}
.svg-g-transform {
  transform: translate(0px, 20px);
}
@media (min-width: 1020px) {
  .svg-g-transform {
    transform: translate(75px, 20px);
  }
}
</style>