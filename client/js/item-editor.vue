<style>
</style>

<template>
<div class="item-editor">
  <textarea v-model="contentText"></textarea>
  <select v-model="itemType">
    <option value="plainText">plain text</option>
  </select>
  <button @click="pushItem" :disabled="!readyToPush">push</button>
</div>
</template>

<script>
import * as api from './api.js';
export default {
  data() {
    return {
      contentText: "",
      itemType: "plainText",
    };
  },
  computed: {
    readyToPush() { return this.contentText.length> 0; },
  },
  methods: {
    clear() {
      this.contentText = "";
    },
    pushItem() {
      const item = {
        type: this.itemType,
        content: {
          plainText: this.contentText,
        },
      };
      api.pushItem(item)
        .then(
          (result) => {
            console.log(`pushed! id: ${result.itemId}`);
            this.clear();
            this.$emit('pushed', result.data);
          }
        );
    },
  }
};
</script>
