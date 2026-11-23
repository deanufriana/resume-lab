import { createRouter, createWebHashHistory } from "vue-router";
import ResumeForm from "../components/ResumeForm.vue";

const routes = [
  {
    path: "/",
    name: "studio",
    component: ResumeForm,
  },
  {
    path: "/upload",
    redirect: "/",
  },
  {
    path: "/manual",
    redirect: "/",
  },
  {
    path: "/preview",
    redirect: "/",
  },
  {
    path: "/signature",
    redirect: "/",
  },
  {
    path: "/about",
    redirect: "/",
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
