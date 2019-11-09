// @flow

import fontSizeCalc  from "../utils/calculateFontSize"

import type {Style, ResizeType, PageClick } from "../types";

export type Dimension = { width: number, height: number, top?: number, left?: number };

export type GetDimension = ({| ...Style,  current: PageClick, previous: PageClick |}) => Dimension;

export type Resizer = {
    key: ResizeType,
    name: string,
    onlyWidth?: boolean,
    getDimension: GetDimension,
    getStyle: (style: Style) => Object,
    getCalculatedPosition: ({ width: number, height: number}, Style: Style) => Style
};

type MapResizer = {
    [ResizeType] : Resizer
}

// export const findWidth = (text: string, fontSize: number) => {
//     return text.length > fontSize;
// } 


export const getWidth = (element: HTMLElement) => {
    return parseFloat(window.getComputedStyle(element).width.replace("px", ""));
};

export const getHeight = (element: HTMLElement) => {
    return parseFloat(window.getComputedStyle(element).height.replace("px", ""));
};

export const getTop = (element: HTMLElement) => {
    return parseFloat(window.getComputedStyle(element).top.replace("px", ""));
};

export const getLeft = (element: HTMLElement) => {
    return parseFloat(window.getComputedStyle(element).left.replace("px", ""));
};

export const getRight = (element: HTMLElement) => {
    return parseFloat(window.getComputedStyle(element).right.replace("px", ""));
};


export const getBottom = (element: HTMLElement) => {
    return parseFloat(window.getComputedStyle(element).bottom.replace("px", ""));
};

export const getElementRectangle = (element: HTMLElement) => {
    return {
        //TODO: remove window.getComputedStyle so fraction may cause problem
        width: element.getBoundingClientRect().width,
        height: element.getBoundingClientRect().height,
        // $FlowFixMe
        left: element.parentElement.offsetLeft,
         // $FlowFixMe
        top: element.parentElement.offsetTop,
        // $FlowFixMe
        bottom: element.getBoundingClientRect().width - element.parentElement.offsetTop,
        // $FlowFixMe
        right: element.getBoundingClientRect().height - element.parentElement.offsetLeft
    }
}

// let fontFactor = 0.05;

export const calculateFontSize = (text: string, maxLength: number) => {
    const initial = 14;
    const totalTextSize = (initial * text.length) / 2;
    const lines = maxLength < totalTextSize ? Math.floor(totalTextSize / maxLength) : 1;
    // fontFactor = initial / (lines > 1 ? maxLength : totalTextSize);
    return {
        width: lines > 1 ? maxLength : totalTextSize,
        height: lines * initial,
        fontSize: initial
    }
};

export const calculateDimension = (text: string, maxLength: number, initial: number) => {
    const lineArray = text.split("\n");
    if (lineArray.length === 1) {
        const totalTextSize = (initial * text.length) / 2;
        const lines = maxLength < totalTextSize ? Math.floor(totalTextSize / maxLength) : 1;
        // fontFactor = initial / (lines > 1 ? maxLength : totalTextSize);

        return {
            width: lines > 1 ? maxLength : totalTextSize,
            height: lines * initial,
            fontSize: initial
        }
    }
    const highest = lineArray.reduce((acc, val) => val.length > acc.length ? val : acc , lineArray[0]);

    const totalTextSize = (initial * highest.length) / 2;
    const lines = maxLength < totalTextSize ? Math.floor(totalTextSize / maxLength) : 1;
    const finalLines = lines + lineArray.length - 1;
    // fontFactor = initial / (finalLines > 1 ? maxLength : totalTextSize);

    return {
        width: Math.min(maxLength, totalTextSize),
        height: finalLines * initial,
        fontSize: initial
    }
};

export const getFontSize = (newWidth: number, fontFactor: number ) => {
    return (
        Math.floor(newWidth * fontFactor) 
    )
}

export const mapResizer: MapResizer = {
    a: {
        key: "a",
        name: "top-left",
        getStyle: (style: Style) => ({
            top: "auto",
            left: "auto",
            right: style.right,
            bottom: style.bottom
        }),
        getCalculatedPosition: (newDimension, style) => {
            return {
                ...style,
                ...newDimension,
                bottom: fontSizeCalc.getCalculatedBottom(style.bottom, newDimension.height),
                right: fontSizeCalc.getCalculatedRight(style.right, newDimension.width)
            };
        },
        getDimension: ({ width, height, current, previous }) => {
            return {
                width: width - (current.pageX - previous.pageX),
                height: height - (current.pageY - previous.pageY)
            }
        }
    },
    b: {
        key: "b",
        name: "top-right",
        getCalculatedPosition: (newDimension, style) => {
            return {
                ...style,
                ...newDimension,
                bottom: fontSizeCalc.getCalculatedBottom(style.bottom, newDimension.height),
                left: fontSizeCalc.getCalculatedLeft(style.left, newDimension.width)
            };
        },
         getStyle: (style: Style) => ({
            top: "auto",
            left: style.left,
            right: "auto",
            bottom: style.bottom
        }),
        getDimension: ({ width, height, current, previous }) => {
            return {
                width: width + (current.pageX - previous.pageX),
                height: height - (current.pageY - previous.pageY)
            }
        }
    },
    c: {
        key: "c",
        name: "bottom-left",
        getCalculatedPosition: (newDimension, style) => {
            return {
                ...style,
                ...newDimension,
                top: fontSizeCalc.getCalculatedTop(style.top, newDimension.height),
                right: fontSizeCalc.getCalculatedRight(style.right, newDimension.width)
            };
        },
        getStyle: (style: Style) => ({
            top: style.top,
            left: "auto",
            right: style.right,
            bottom: "auto"
        }),
        getDimension: ({ width, height, current, previous }) => {
            return {
                width: width - (current.pageX - previous.pageX),
                height: height + (current.pageY - previous.pageY)
            }
        }
    },
    d: {
        key: "d",
        name: "bottom-right",
        getCalculatedPosition: (newDimension, style) => {
            return {
                ...style,
                ...newDimension,
                top: fontSizeCalc.getCalculatedTop(style.top, newDimension.height),
                left: fontSizeCalc.getCalculatedLeft(style.left, newDimension.width)
            };
        },
        getStyle: (style: Style) => ({
            top: style.top,
            left: style.left,
            right: "auto",
            bottom: "auto"
        }),
        getDimension: ({ width, height, current, previous }) => {
            return {
                width: width + (current.pageX - previous.pageX),
                height: height + (current.pageY - previous.pageY)
            }
        }
    },
    e: {
        key: "e",
        onlyWidth: true,
        name: "middle",
        getCalculatedPosition: (newDimension, style) => {
            return {
                ...style,
                ...newDimension,
                top: fontSizeCalc.getCalculatedTop(style.top, newDimension.height),
                left: fontSizeCalc.getCalculatedLeft(style.left, newDimension.width)
            };
        },
        getStyle: (style: Style) => ({
            top: style.top,
            left: style.left,
            right: "auto",
            bottom: "auto"
        }),
        getDimension: ({ width, height, current, previous }) => {
            return {
                width: width + ((current.pageX - previous.pageX) * 0.7),
                height
            }
        }
    },
    f: {
        key: "f",
        onlyWidth: true,
        name: "leftMiddle",
        getCalculatedPosition: (newDimension, style) => {
            return {
                ...style,
                ...newDimension,
                top: fontSizeCalc.getCalculatedTop(style.top, newDimension.height),
                right: fontSizeCalc.getCalculatedRight(style.right, newDimension.width)
            };
        },
        getStyle: (style: Style) => ({
            top: style.top,
            right: style.right,
            left: "auto",
            bottom: "auto"
        }),
        getDimension: ({ width, height, current, previous }) => {
            return {
                width: width + ((previous.pageX - current.pageX) * 0.7),
                height
            }
        }
    }
}