import type { Matrix } from "mathjs";
import type { DataProvider } from "./providers";

import axios, { type AxiosResponse } from "axios";
import type { Coordinates } from "../models/coordinates";

export class WebProvider implements DataProvider {
    server: string;

    constructor(server: string) {
        this.server = server
    }

    async getImages(objectPath: string): Promise<AxiosResponse> {
        const path = this.server + "/" + objectPath +'/images';
        return axios.get(path)
    }

    async getImage(objectPath: string, imageName : string): Promise<AxiosResponse> {
        const path = this.server + "/" + objectPath + '/' + imageName
        return axios.get(path)
    }
}