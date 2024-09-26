<script setup lang="ts">
import { LandmarkList } from "@/components/ui/landmark";
import { DistanceList } from "@/components/ui/distance";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

import {
  ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger,
} from '@/components/ui/context-menu'

import { useLandmarksStore, useImagesStore } from "@/lib/stores";
import { Landmark } from "@/data/models/landmark";
import { type Shortcut } from "@/data/models/shortcut";
import { Scale } from "@/lib/utils";

import { RepositoryFactory } from '@/data/repositories/repository_factory'
import { repositorySettings } from "@/config/appSettings"

const repository = RepositoryFactory.get(repositorySettings.type)

const imageStore = useImagesStore()
const landmarksStore = useLandmarksStore()



function addDistance(){
  let id_left = landmarksStore.selectedGroup.deque[0]
  let id_right = landmarksStore.selectedGroup.deque[1]
  let left : Landmark = landmarksStore.landmarks.find((x) => x.id == id_left) as Landmark
  let right : Landmark = landmarksStore.landmarks.find((x) => x.id == id_right) as Landmark
  landmarksStore.addDistance(left, right)
}

function resetScale(){
  landmarksStore.adjustFactor = 1
}

console.log("Scale " + landmarksStore.scale)

</script>

<template>
  <div class="pb-[12px] w-auto">
    <div class="space-y-4 py-4">
      <div class="px-3 py-2">
        <h2 class="relative px-7 text-lg font-semibold tracking-tight">
          Landmarks
        </h2>
          <ContextMenu>
            <ContextMenuTrigger class="flex w-full h-full">
              <LandmarkList/>
            </ContextMenuTrigger>
            <ContextMenuContent class="w-64">
              <ContextMenuItem class="block" inset @select="addDistance">
                Create Distance
              </ContextMenuItem>
          </ContextMenuContent>
          </ContextMenu>
      </div>
      <div class="px-3 py-2">
        <div class="flex row">
          <h2 class="relative px-7 text-lg font-semibold tracking-tight">
            Distances
          </h2>
          <div class="w-full h-full flex justify-end space-x-2">
            <Select v-model="landmarksStore.scale">
              <SelectTrigger class="w-16">
                <SelectValue placeholder="Pick a scale" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Scale</SelectLabel>
                  <SelectItem v-for="scale in Object.keys(Scale).filter((v) => isNaN(Number(v)))" :value="scale">
                    {{ scale }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button variant="secondary" @click="resetScale">
              Reset Scale
            </Button>
          </div>
        </div>
        <DistanceList/>
      </div>
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
