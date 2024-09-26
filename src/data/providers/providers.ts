import type { Matrix } from "mathjs";
import type { AxiosResponse } from "axios";
import type { Coordinates } from "../models/coordinates";

export interface DataProvider {
        getImages: (objectPath: string) => Promise<AxiosResponse>;
        getImage : (objectPath:string, image_name : string) => Promise<AxiosResponse>;
}
