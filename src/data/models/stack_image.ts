export type StackImage = {
    name: string,
    image: string,
    label: string
}

export type ImageName = {
    name: string,
    label: string
}

export type Size = {
    height: number,
    width: number
}

export type ProjectData = {
    stackImages: Array<string>,
    individualImages: Map<string, string>,
    size: Size,
}

export type Ratio = {
    ratioH: number,
    ratioW: number
}