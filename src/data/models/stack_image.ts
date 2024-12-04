export type StackImage = {
    name: string,
    image: string,
    format: string,
    height: number,
    width: number
}

export type Size = {
    height: number,
    width: number
}

export type ProjectData = {
    stackImages: Array<StackImage>,
    individualImages: Map<string, StackImage>,
    size: Size,
    voxel: [number, number, number]
}

export type Ratio = {
    ratioH: number,
    ratioW: number
}