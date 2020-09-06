<style>
</style>

<template>
<div class="main-view">
  <item-editor></item-editor>
  
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
  data() {
    return {
      items: [],
    };
  },
};
</script>
