export type StackImage = {
    name: string,
    label: string,
    image: string,
    thumbnail: string
}

export type ImageName = {
    name: string,
    label: string
}

export type ImageData = {
    image: string,
    thumbnail: string
}

export type Size = {
    height: number,
    width: number
}

export type ProjectData = {
    stackImages: Array<ImageName>,
    individualImages: Map<string, ImageName>,
    size: Size,
    thumbnails: boolean
}

export type Ratio = {
    height: number,
    width: number
}