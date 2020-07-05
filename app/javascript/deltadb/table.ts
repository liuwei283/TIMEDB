import Vue from "vue";
import Table from "./components/Table.vue";

export function table(option) {
  if (!option.el) {
    throw new Error(`table: el must exist`);
  }
  const app = new Vue({
    render: h => h(Table, { props: { test: "hi!" } }),
  }).$mount(option.el);
}
