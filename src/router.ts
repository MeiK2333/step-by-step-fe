import { createWebHistory, createRouter } from "vue-router";
import Home from "./views/Home.vue";
import Groups from './views/group/Groups.vue';
import GroupDetail from './views/group/Detail.vue';
import SetDetail from './views/set/Detail.vue';
import UserDetail from './views/user/Detail.vue';
import About from "./views/About.vue";
import Admin from './views/admin/Admin.vue';
import AdminHome from './views/admin/Home.vue';
import AdminGroup from './views/admin/Group.vue';
import AdminStep from './views/admin/Step.vue';
import AdminStepUser from './views/admin/StepUser.vue';
import AdminStepProblem from './views/admin/StepProblem.vue';
import Login from './views/user/Login.vue';
import store from './store';

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
    path: "/user/:username",
    name: "user",
    component: UserDetail,
    meta: { title: "User" }
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: { title: 'Login' }
  },
  {
    path: "/about",
    name: "about",
    component: About,
    meta: { title: "About" }
  },
  {
    path: "/admin",
    name: "admin",
    component: Admin,
    meta: { title: "Admin" },
    children: [
      { path: '', name: 'admin_home', component: AdminHome },
      {
        path: "group",
        name: "admin_group",
        component: AdminGroup,
        meta: { title: "Group" },
      },
      {
        path: "group/:id/step",
        name: "admin_group_step",
        component: AdminStep,
        meta: { title: "Step" },
      },
      {
        path: "group/:group_id/step/:step_id/user",
        component: AdminStepUser,
        meta: { title: "StepUser" }
      },
      {
        path: "group/:group_id/step/:step_id/problem",
        component: AdminStepProblem,
        meta: { title: "StepProblem" }
      }
    ]
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