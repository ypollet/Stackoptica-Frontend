import type { ProjectData, StackImage } from "@/data/models/stack_image";

export interface Repository {
    getImages : (objectPath:string) => Promise<ProjectData>;
    getImage : (objectPath:string, imageName : string) => Promise<StackImage>;
}