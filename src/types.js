//@flow

export type Style = {|
    width: number,
    height: number,
    bottom: number,
    right: number,
    top: number,
    left: number
|}

export type PageClick = {
    pageX: number,
    pageY: number
}

export type ResizeType = "a"|"b"|"c"|"d" | "e" | "f";