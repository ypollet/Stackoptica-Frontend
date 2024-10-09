import * as math from 'mathjs'
import { defineStore, type PiniaPluginContext, type StateTree } from 'pinia'
import { DequeMax2 } from '@/data/models/dequeMax2'
import { Distance } from '@/data/models/distance'
import { Landmark } from '@/data/models/landmark'
import Color from 'color'
import type { StackImage, Size } from '@/data/models/stack_image'

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


export const useImagesStore = defineStore('image', {
  state: () => ({
    objectPath: "",
    index : 0,
    images : Array<StackImage>(),
    size : { width : -1, height : -1},
    voxel : [1,1,1],
    zoom : -1,
    offset : {x:0, y:0}
  }),
  getters: {
    selectedImage : (state) => (state.index >= 0 && state.index < state.images.length) ?  state.images[state.index] : {"name":"RBINS Logo","image":"https://www.naturalsciences.be/bundles/8c62adb1e0fbef009ef7c06c69a991890012e203/img/logos/logo.svg"}
  },
  actions: {
    setPath(path : string) {
      this.reset()
      this.objectPath = path
    },
    reset() {
      this.objectPath = ""
      this.index = 0
      this.images = Array<StackImage>()
      this.size = { width : -1, height : -1}
      this.voxel = [1,1,1]
      this.zoom = -1
      this.offset = {x:0, y:0}
    },
    setIndex(move: number) {
      this.index = math.min(math.max(0, this.index + move), this.images.length-1)
    },
    increment(){
      this.setIndex(1)
    },
    decrement(){
      this.setIndex(-1)
    }

  },

  persist: {
    storage: sessionStorage,
    key: 'camera',
  },
})

export const useLandmarksStore = defineStore('landmarks', {
  state: () => ({ landmarks: Array<Landmark>(),
                  selectedGroup : new DequeMax2(),
                  distances: Array<Distance>(),
                  adjustFactor: 1,
                  scale: "m"
                }),
  actions: {
    addLandmark(landmark: Landmark) {
      this.landmarks.push(landmark)
    },
    generateID() {
      let check: boolean = false
      let id: string = ""
      while (!check) {
        id = (Math.random() + 1).toString(36).substring(2);
        if (this.landmarks.filter(e => e.getId() === id).length == 0) {
          check = true
        }
      }
      return id;
    },
    addDistance(left : Landmark, right : Landmark, label:string | null = null){
      let distance : Distance = new Distance(label || "distance_"+this.distances.length, left, right)
      if(this.distances.filter((x) => x.equals(distance)).length == 0){
        this.distances.push(distance)
      }
    }
  },
  persist: {
    storage: sessionStorage,
    key: 'landmarks',
    afterRestore: (ctx: PiniaPluginContext) => {
      // restore landmarks
      let landmarks = ctx.store.$state.landmarks.map((x: Landmark) => x)
      let landmarksToKeep = landmarks.map((jsonObject: Landmark) =>
        new Landmark(jsonObject.id, jsonObject.label, Color(jsonObject.color))
      )
      ctx.store.$state.landmarks = landmarksToKeep

      // restore selectedGroup
      let selectedGroup = new DequeMax2()
      let deque = ctx.store.$state.selectedGroup
      if(deque){
        for(let i = 0; i < Object.values(deque.deque).length; i++){
          selectedGroup.add(deque.deque[i])
        }
        ctx.store.$state.selectedGroup = selectedGroup
      }

      // restore distances
      landmarksToKeep.forEach((x : Landmark) => {
        console.log(x.id)
      })
      let distances = ctx.store.$state.distances.map((x : Distance) => x)

      ctx.store.$state.distances = distances.map((jsonObject: Distance) => 
        new Distance(jsonObject.label, landmarksToKeep[landmarksToKeep.map((e : Landmark) => e.id).indexOf(jsonObject.landmarkLeft.id)], 
          landmarksToKeep[landmarksToKeep.map((e : Landmark) => e.id).indexOf(jsonObject.landmarkRight.id)])
      )
      
    },
  },
})