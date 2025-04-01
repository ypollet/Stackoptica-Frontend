<script setup lang="ts">
import { ref } from 'vue';

import { Loader2 } from 'lucide-vue-next';

import { useQuery } from '@tanstack/vue-query'

import { useImagesStore } from '@/lib/stores';

import type { ProjectData, StackImage } from '@/data/models/stack_image'

import ImageViewer from '@/components/ui/image-viewer/ImageViewer.vue';

import { RepositoryFactory } from '@/data/repositories/repository_factory'
import { repositorySettings } from "@/config/appSettings"

import Label from '../label/Label.vue';


const imageStore = useImagesStore()

const { isPending, isError, data, error } = useQuery({
  queryKey: ['all_images'],
  queryFn: () => getImages(),
})

const repository = RepositoryFactory.get(repositorySettings.type)

function getImages(): Promise<ProjectData> {
  return repository.getImages(imageStore.objectPath).then((data) => {
    console.log("Thumbnails : ", data.thumbnails)
    console.log(data.stackImages)
    imageStore.stackImages = data.stackImages.map((image_data) => {
      return {
        name: image_data.name.split('').join(''),
        label: image_data.label.split('').join(''),
        image: repository.getFullImage(imageStore.objectPath, image_data.name),
        thumbnail: (data.thumbnails) ? repository.getThumbnail(imageStore.objectPath, image_data.name) : ""
      }
    })

    imageStore.size = data.size
    imageStore.individualImages = new Map()
    data.individualImages.forEach((value, key) => {
      imageStore.individualImages.set(key, {
        name: value.name.split('').join(''),
        label: value.label.split('').join(''),
        image: repository.getFullImage(imageStore.objectPath, value.name),
        thumbnail: (data.thumbnails) ? repository.getThumbnail(imageStore.objectPath, value.name) : ""
      })
    })
    return data
  })
}
</script>
<template>
  <div class="w-full h-full border flex justify-center items-center">
    <div v-if="isPending" class="w-full h-full flex justify-center items-center">
      <Loader2 class="animate-spin mr-10" width="10%" height="10%" />
    </div>
    <div v-if="isError" class="w-full h-full flex justify-center items-center">
      <div class="text-red-600">{{ error }}</div>
    </div>
    <div v-if="data" class="w-full h-full flex flex-col items-center">
      <div class="flex grow flex-row w-full justify-start border p-2 space-x-2">
        <Label>{{ imageStore.selectedImage!.label }}</Label>
        <Label v-if="imageStore.image=='stack'">{{ imageStore.index+1 }}/{{ imageStore.stackImages.length }}</Label>
      </div>
      <ImageViewer class="object-fit" aspect-ratio="auto" draggable="false" />
    </div>
  </div>
</template>

<style scoped>
.object-fit {
  object-fit: contain;
  max-width: 100%;
  max-height: 100%;
  width: 100%;
  height: 100%;
  display: block;
}
</style>