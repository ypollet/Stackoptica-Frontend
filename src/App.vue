<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useImagesStore } from './lib/stores';

const imageStore = useImagesStore()

function changePicture(event: KeyboardEvent) {
  let key = event.key
  if(key == "ArrowUp"){
    imageStore.increment()
  }
  if(key == "ArrowDown"){
    imageStore.decrement()
  }
}
</script>

<template>
  <div class="overflow-hidden"> <RouterView @keydown="changePicture"/></div>
</template>

