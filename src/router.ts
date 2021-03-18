import { createWebHistory, createRouter } from "vue-router";
import Home from "./views/Home.vue";
import Groups from './views/group/Groups.vue';
import GroupDetail from './views/group/Detail.vue';
import SetDetail from './views/set/Detail.vue';
import About from "./views/About.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
    meta: { title: "Home" }
  },
  {
    path: "/groups",
    name: "groups",
    component: Groups,
    meta: { title: "Groups" }
  },
  {
    path: "/group/:id",
    name: "group",
    component: GroupDetail,
    meta: { title: "Group" }
  },
  {
    path: "/set/:id",
    name: "set",
    component: SetDetail,
    meta: { title: "Set" }
  },
  {
    path: "/about",
    name: "about",
    component: About,
    meta: { title: "About" }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from) => {
  document.title = to.meta.title ? `${to.meta.title} - StepByStep` : "StepByStep";
})

export default router;