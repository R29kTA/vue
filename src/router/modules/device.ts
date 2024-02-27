import { $t } from "@/plugins/i18n";
const { VITE_HIDE_HOME } = import.meta.env;
const Layout = () => import("@/layout/index.vue");

export default {
  path: "/device",
  name: "Device",
  component: Layout,
  redirect: "/device",
  meta: {
    icon: "lollipop",
    title: "设备列表",
    rank: 1
  },
  children: [
    {
      path: "/device",
      name: "Device",
      component: () => import("@/views/device/index.vue"),
      meta: {
        title:"设备列表",
        showLink: VITE_HIDE_HOME === "true" ? false : true
      }
    }

  ]
} as RouteConfigsTable;
