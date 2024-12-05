import * as math from 'mathjs'
import { defineStore, type PiniaPluginContext, type StateTree } from 'pinia'
import { DequeMax2 } from '@/data/models/dequeMax2'
import { Distance } from '@/data/models/distance'
import { Landmark } from '@/data/models/landmark'
import Color from 'color'
import type { StackImage, Size } from '@/data/models/stack_image'
import { RepositoryFactory } from '@/data/repositories/repository_factory'
import { repositorySettings } from '@/config/appSettings'

const repository = RepositoryFactory.get(repositorySettings.type)

export const DEFAULT_TAB = "viewer"

export const useSettingsStore = defineStore('settings', {
  state: () => ({ isLeft : false }),
  actions: {
    useToggleLeft(value : boolean){
      this.isLeft = value
    },
  },

  persist: {
    storage: localStorage,
    key: 'settings',
  }
})


export const useImagesStore = defineStore('images', {
  state: () => ({
    objectPath: "",
    image : "stack",
    index : 0,
    stackImages : new Array<StackImage>(),
    individualImages : new Map<string, StackImage>(),
    size : { width : -1, height : -1},
    zoom : -1,
    offset : {x:0, y:0}
  }),
  getters: {
    selectedImage : (state) => (state.index >= 0 && state.index < state.stackImages.length && state.image == "stack") ?  state.stackImages[state.index] : (!(state.individualImages.has(state.image))) ? {"name":"RBINS Logo","image":"https://www.naturalsciences.be/bundles/8c62adb1e0fbef009ef7c06c69a991890012e203/img/logos/logo.svg"} : state.individualImages.get(state.image)
  },
  actions: {
    setPath(path : string) {
      this.$reset()
      this.objectPath = path
    },
    setIndex(index : number){
      this.index = math.min(math.max(0, index), this.stackImages.length-1)
    },
    moveIndex(move: number) {
      this.index = math.min(math.max(0, this.index + move), this.stackImages.length-1)
    },
    increment(){
      this.moveIndex(1)
    },
    decrement(){
      this.moveIndex(-1)
    },
    getImageName(index : number){
      return (index >= 0 && index < this.stackImages.length) ? this.stackImages[index].name : "Image " + index
    }

  },

  persist: {
    storage: sessionStorage,
    key: 'images',
    afterHydrate: (ctx: PiniaPluginContext) => {
      console.log("Restore Images Store")
      console.log(ctx.store.$state)
    }
  },
})

export const useLandmarksStore = defineStore('landmarks', {
  state: () => ({ 
    landmarks: Array<Landmark>(),
    distances: Array<Distance>(),
    adjustFactor: 1,
    scale: "mm",
    tab: "landmarks",
    selectedDistanceIndex: -1
  }),
  getters:{
    indexes: (state) => new Map(state.distances.map((distance, index) => [distance.label, index])),
    selectedDistance : (state) => (state.selectedDistanceIndex >= 0 && state.selectedDistanceIndex < state.distances.length) ? state.distances[state.selectedDistanceIndex] :  null
  },
  actions: {
    generateID() {
      let check: boolean = false
      let id: string = ""
      while (!check) {
        id = (Math.random() + 1).toString(36).substring(2);
        this.distances.forEach(distance => {
          if (distance.landmarks.filter(e => e.equals(id)).length == 0) {
            check = true
          }
        })
        if (this.landmarks.filter(e => e.equals(id)).length == 0) {
          check = true
        }
      }
      return id;
    },
  },
  persist: {
    storage: sessionStorage,
    key: 'landmarks',
    afterHydrate: (ctx: PiniaPluginContext) => {
      // restore landmarks
      console.log("Restore Landmarks")
      let landmarks = new Array<Landmark>()
      ctx.store.$state.landmarks.forEach((jsonObject : Landmark) => {
        let landmark = new Landmark(jsonObject.id, jsonObject.label, jsonObject.pose, jsonObject.position, Color(jsonObject.color))
        landmarks.push(landmark)
      })
      ctx.store.$state.landmarks = landmarks

      let distances = new Array<Distance>()
      ctx.store.$state.distances.forEach((jsonObject : Distance) => {
        console.log(jsonObject.landmarks)
        let landmarks = jsonObject.landmarks.map((x : Landmark) => new Landmark(x.id, x.label, x.pose, x.position, Color(x.color)))
        let distance = new Distance(jsonObject.label, landmarks, Color(jsonObject.color))
        distances.push(distance)
      })
      ctx.store.$state.distances = distances
    },
  },
})