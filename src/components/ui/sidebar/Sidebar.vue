<script setup lang="ts">
import { LandmarkList } from "@/components/ui/landmark";
import { DistanceComputed, DistanceList } from "@/components/ui/distance";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useImagesStore, useLandmarksStore } from "@/lib/stores";
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import ThumbnailViewer from "../thumbnail-viewer/ThumbnailViewer.vue";

const imageStore = useImagesStore()
const landmarksStore = useLandmarksStore()

</script>

<template>
  <div class="flex flex-col pb-[12px] w-auto h-full">
    <div class="flex justify-center">
      <div class="w-4/5">
        <ThumbnailViewer/>
      </div>
    </div>
    <div class="flex-none space-y-4 py-4">
      <ToggleGroup type="single" :model-value="imageStore.image" @update:modelValue="$event => {if($event != undefined) {imageStore.image = $event.toString()}}">
        <ToggleGroupItem value="stack">
          Stack
        </ToggleGroupItem>
        <ToggleGroupItem v-for="stackedImage in imageStore.individualImages.keys()" :value="stackedImage">
          {{ stackedImage }}
        </ToggleGroupItem>
    </ToggleGroup>
    </div>
    <div class="flex-none space-y-4 py-4">
      <div class="px-3 py-2">
        <Slider :model-value="[imageStore.index]" :max="imageStore.stackImages.length - 1" :step="1"
          @update:modelValue="$event => imageStore.setIndex($event![0])" />
        <div className='mt-1.5 flex flex-row justify-between'>
          <span class="w-5 text-center" v-for="i in new Array(imageStore.stackImages.length)">
            |
          </span>
        </div>
      </div>
      <Tabs :model-value="landmarksStore.tab" @update:modelValue="$event => landmarksStore.tab = $event.toString()"
        default-value="landmarks" class="w-full my-4">
        <TabsList class="grid w-full grid-cols-2">
          <TabsTrigger value="landmarks">
            Landmarks
          </TabsTrigger>
          <TabsTrigger value="distances">
            Distances
          </TabsTrigger>
        </TabsList>
        <TabsContent value="landmarks">
          <LandmarkList />
        </TabsContent>
        <TabsContent value="distances">
          <DistanceList />
        </TabsContent>
      </Tabs>
    </div>
    <div class="flex grow items-end mt-4">
      <DistanceComputed />
    </div>
  </div>
</template>

<style>
.scroll-align {
  scroll-snap-align: start;
  scroll-behavior: auto;
}

.scroll-snap-type {
  scroll-snap-type: y mandatory;
}
</style>
