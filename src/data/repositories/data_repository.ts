import type { Repository } from "./repository";
import type { ProjectData, StackImage } from "../models/stack_image";

import type { DataProvider } from "../providers/providers";

export class DataRepository implements Repository {
    provider: DataProvider;

    constructor(provider: DataProvider) {
        this.provider = provider
    }

    async getImages(objectPath: string): Promise<ProjectData> {
        console.log("get Images")
        return this.provider.getImages(objectPath).then((res) => {
            let data = res.data.result as ProjectData
            data.individualImages = new Map(Object.entries(data.individualImages))
            return data
        })
    }

    async getImage(objectPath: string, imageName: string): Promise<StackImage> {
        return this.provider.getImage(objectPath, imageName).then((response) => {
            return response.data as StackImage
        })
    }
}