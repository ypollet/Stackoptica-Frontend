export type StackImage = {
    name: string,
    image: string,
}

export type Size = {
    height: number,
    width: number
}

export type ProjectData = {
    stackImages: Array<string>,
    individualImages: Map<string, string>,
    size: Size,
    voxel: [number, number, number]
}

export type Ratio = {
    ratioH: number,
    ratioW: number
}