<script setup lang="ts">
import Menu from "@/components/Menu.vue";
import { Separator } from "@/components/ui/separator";
import { Sidebar } from "@/components/ui/sidebar";
import { useSettingsStore, useImagesStore } from "@/lib/stores";
import { CameraViewer } from "@/components/ui/camera-viewer"
import { MainLogo } from "@/components/ui/logo";

const settingsStore = useSettingsStore()
const imageStore = useImagesStore()

let urlParams = new URLSearchParams(window.location.search);

imageStore.setPath(urlParams.get('series') as string)

</script>

<template>
  <main class="h-screen">
    <div class="flex menu">
      <Menu class="sticky top-0 flex flex-row grow z-50" />
      <div class="flex items-center space-x-2 pr-2">
        <MainLogo :height=30 :width=30 />
        <h1 class="font-dejavu font-bold text-brand">Stackoptica</h1>
      </div>
    </div>
    <Separator></Separator>
    <div class="rest_height flex" :class="settingsStore.isLeft ? 'flex-row' : 'flex-row-reverse'">
      <div class="h-full w-96 flex-none overflow-auto border p-4">
        <Sidebar />
      </div>

      <div class="h-full w-0 flex-auto items-center justify-center">
        <CameraViewer />
      </div>
    </div>
  </main>
</template>

<style scoped>
.menu {
  height: 40;
}

.sidebar {
  width: 25%;
}

.rest_height {
  height: calc(100% - 41px);
}

.rest_width {
  width: 75%;
}
</style>
