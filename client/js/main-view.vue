<style>
</style>

<template>
<div class="main-view">
  <item-editor @pushed="onItemPushed"></item-editor>
  <ul>
    <li v-for="item in items">
      <span v-text="item.type"></span>:
      <span v-text="item.content.plainText"></span>
      <span v-text="item.content.timestamp"></span>
    </li>
  </ul>
</div>
</template>

<script>
import * as api from './api.js';
export default {
  created() {
    api.getItems()
      .then(items => {
        this.items = items;
      });
  },
  methods: {
    onItemPushed(data) {
      console.log(data);
      this.items.push(data);
    },
  },
  data() {
    return {
      items: [],
    };
  },
};
</script>
