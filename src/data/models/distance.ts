import type { Landmark } from "@/data/models/landmark"
import * as math from "mathjs"

export class Distance {
    label : string
    landmarkLeft : Landmark
    landmarkRight : Landmark
    edit_label: boolean
    edit_distance: boolean
    
    constructor(label: string, left: Landmark, right : Landmark){
        console.log("Creation Distance : " + left.id + " " + right.id)
        this.label = label
        this.landmarkLeft = left
        this.landmarkRight = right
        this.edit_label = false
        this.edit_distance = false
    }

    get distance() : [number, number, number] | undefined{
        if(this.landmarkLeft.pose == undefined || this.landmarkRight.pose == undefined){
            return undefined
        }
        return [
            math.abs(this.landmarkLeft.pose.marker.x - this.landmarkRight.pose.marker.x),
            math.abs(this.landmarkLeft.pose.marker.y - this.landmarkRight.pose.marker.y),
            math.abs(this.landmarkLeft.pose.image - this.landmarkRight.pose.image)
        ]
    }

    in(landmark : Landmark | string) : boolean{
        console.log(this.landmarkLeft.equals(landmark) || this.landmarkRight.equals(landmark))
        return this.landmarkLeft.equals(landmark) || this.landmarkRight.equals(landmark)
    }

    equals(other : Distance){
        console.log("Equals DIstance")
        console.log(this.landmarkLeft.equals(other.landmarkLeft) && this.landmarkRight.equals(other.landmarkRight))
        console.log(this.landmarkLeft.equals(other.landmarkRight) && this.landmarkRight.equals(other.landmarkLeft))
        return (this.landmarkLeft.equals(other.landmarkLeft) && this.landmarkRight.equals(other.landmarkRight))
            || (this.landmarkLeft.equals(other.landmarkRight) && this.landmarkRight.equals(other.landmarkLeft))
    }
}