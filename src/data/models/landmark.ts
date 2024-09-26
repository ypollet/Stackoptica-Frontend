import Color from "color"
import axios from "axios"
import { type Matrix }  from "mathjs"
import type { Coordinates } from "@/data/models/coordinates"
import { RepositoryFactory } from "../repositories/repository_factory"
import { repositorySettings } from "@/config/appSettings"

import * as math from 'mathjs'

const repository = RepositoryFactory.get(repositorySettings.type)

export class Landmark {
    id: string
    version: number
    label: string
    pose: Coordinates | undefined
    color: Color
    position: Array<number> | undefined
    edit: boolean

    constructor(id: string, label: string, version : number = 1,color: Color | null = null, pose: Coordinates | undefined= undefined, position: Array<number> | undefined = undefined) {
        this.id = id
        this.version = version
        this.label = label
        this.pose = pose
        this.edit = false

        if (color == null) {
            color = Color.rgb([Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256)])
        }
        this.color = color
        this.position = position
    }

    equals(other : Landmark | string | null){
        if(other == null){
            return false
        }
        if(typeof other === "string"){
            return this.id == other
        }
        return this.id == other.id
    }

    toJSON() {
        return { id: this.id, label: this.label, color: this.color.hex(), position: this.position, poses: this.pose }
    }

    getId() : string {
        return this.id
    }
    getLabel() : string {
        return this.label
    }
    setLabel(label : string){
        this.label = label
    }

    getVersion() : number{
        return this.version
    }
    
    getColorHEX() : string{
        return this.color.hex()
    }
    setColorHEX(color: string) {
        this.color = Color(color)
    }
    setColorRGB(color: number[]) {
        if (color.length < 3) {
            return
        }
        this.color = Color.rgb(color[0], color[1], color[2])
    }

    setPose(pose: Coordinates) {
        this.pose = pose
    }
    removePose() {
        this.pose = undefined
    }
    getPose() : Coordinates | undefined{
        return this.pose
    }

    getPosition(){
        return this.position
    }

    setPosition(position : Array<number> | undefined){
        this.position = position
        this.version++
    }
    getEdit() : boolean{
        return this.edit
    }
    setEdit(edit : boolean){
        this.edit = edit
    }
}