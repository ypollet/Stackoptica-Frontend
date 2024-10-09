import Color from "color"
import type { Coordinates } from "@/data/models/coordinates"

export type Pose = {
    marker: Coordinates
    image: number
}



export class Landmark {
    id: string
    label: string
    pose: Pose | undefined
    color: Color
    edit: boolean

    constructor(id: string, label: string, color: Color | null = null, pose: Pose | undefined = undefined) {
        this.id = id
        this.label = label
        this.pose = pose
        this.edit = false

        if (color == null) {
            color = Color.rgb([Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256)])
        }
        this.color = color
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
        return { id: this.id, label: this.label, color: this.color.hex(), pose: this.pose }
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

    setPose(image : number, pose: Coordinates) {
        this.pose = {
            marker : pose,
            image : image
        }
    }
    removePose() {
        this.pose = undefined
    }
    getPose() : Pose | undefined{
        return this.pose
    }
    
    getEdit() : boolean{
        return this.edit
    }
    setEdit(edit : boolean){
        this.edit = edit
    }
}