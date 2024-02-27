import { $t } from "@/plugins/i18n";
const { VITE_HIDE_HOME } = import.meta.env;
const Layout = () => import("@/layout/index.vue");

export default {
  path: "/log",
  name: "Log",
  component: Layout,
  redirect: "/log",
  meta: {
    icon: "informationLine",
    title: "日志",
    rank: 3
  },
  children: [
    {
      path: "/log",
      name: "Log",
      component: () => import("@/views/log/index.vue"),
      meta: {
        title:"日志",
        showLink: VITE_HIDE_HOME === "true" ? false : true
      }
    }

  ]
} as RouteConfigsTable;
