<template>
  <div class="deltadb-table">
    <b-btn>bootstrap-vue test</b-btn>
    <table>
      <thead>
        <th>Name</th>
      </thead>
      <tbody>
        <tr v-for="table in tables" :key="table.id">
          <td>{{ table.name }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import api from "../api";

@Component
export default class Table extends Vue {
  private tables = [];

  mounted() {
    this.loadTables();
  }

  async loadTables() {
    const tables = await api.tables();
    console.log(tables);
    this.tables = tables;
  }
}
</script>

<style lang="scss">
.deltadb-table {
}
</style>
