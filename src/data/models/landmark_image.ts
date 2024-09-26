import type { Coordinates } from "@/data/models/coordinates"
export class LandmarkImage  {
    name: string
    image: string

    constructor(name : string, image : string){
        this.name = name
        this.image = image
    }
}