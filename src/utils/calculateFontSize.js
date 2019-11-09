// @flow

import type { Style } from "../types";
import { getWidth, getHeight } from "./index";

class FontSizeCalc {
    el: HTMLElement | null;
    maxW: number;
    maxH: number;
    ratio: number;

    constructor() {
        this.el = document.getElementById("dummyContainer");
        this.maxW = 0;
        this.maxH = 0;
        this.ratio = 0;
    }  

    setMaxValues(w: number, h: number) {
        this.maxH = h;
        this.maxW = w;
    }

    getCalculatedTop(top: number, height: number): number {
        return Math.min(
            top >= 0 ? top : 0,
            this.maxH - height < 0  ? 0 : this.maxH - height
        );
    }

    getCalculatedBottom(bottom: number, height: number): number {
        return Math.min(
            bottom >= 0 ? bottom : 0,
            this.maxH - height < 0  ? 0 : this.maxH - height
        );
    }

    getCalculatedLeft(left: number, width: number): number {
        return Math.min(
            left >= 0 ? left : 0, this.maxW - width < 0 ? 0 : this.maxW - width
        );
    }

    getCalculatedRight(right: number, width: number): number {
        return Math.min(
            right >= 0 ? right : 0, this.maxW - width < 0 ? 0 : this.maxW - width
        );
    }

    getPosWithFont ({
        size,
        top,
        left,
        text,
        maxHeight,
        maxWidth,
        family,
        lineHeight,
        width,
        height
    }: {
        size: number,
        top: number,
        left: number,
        text: string,
        maxHeight: number,
        maxWidth: number,
        family: string,
        lineHeight: string,
        width?: number,
        height?: number
    }) : { ...Style, size: number } {
        // const perCharacterSpace = this.getSingleCharacterDimension(size, family);
        const obj = this.getTotalHeightWidth(size, family, text, maxWidth, maxHeight, lineHeight, width, height);


        if (
            obj.scrollWidth * obj.scrollHeight <= maxWidth * maxHeight
        ) {
            let remainingLeft = maxWidth - obj.scrollWidth;
            let remainingTop = maxHeight - obj.scrollHeight;
            const calculatedLeft = Math.min(left, remainingLeft);
            const calculatedTop = Math.min(top, remainingTop);

            this.ratio = obj.width / obj.height;
            return {
                left: calculatedLeft,
                top: calculatedTop,
                size,
                bottom: Math.abs(maxHeight - calculatedTop - obj.height),
                right: Math.abs(maxWidth - calculatedLeft - obj.width),
                width: obj.width,
                height: obj.height
            };
        }

        return {
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            width: maxWidth,
            height: maxHeight,
            size: 32
        }
    }

    getTotalHeightWidth(size: number, family: string, text: string, maxWidth: number, maxHeight: number, lineHeight: string, width?: number, height?: number) {
        this.el = document.getElementById("dummyContainer");
        if (!this.el) throw "Dummy container not found";
            
        this.el.style.maxWidth = maxWidth + "px";
        this.el.style.maxHeight = maxHeight + "px";
        this.el.style.fontFamily = family;
        this.el.style.fontSize = size + "px";
        this.el.style.lineHeight = lineHeight;
        if (width) {
            this.el.style.width = width + "px";
        }
        if (height) {
            this.el.style.height = height + "px";
        }
        this.el.innerHTML = text;
        
        const scrollHeight = this.el.scrollHeight;
        const scrollWidth = this.el.scrollWidth;
    
        return {
            width: width || getWidth(this.el),
            // $FlowFixMe
            height: height || getHeight(this.el),
            scrollHeight,
            scrollWidth
        }
    }

    getCalculatedWidth(width: number): number {
        return  this.maxW < width ? this.maxW :  width;
    }

    getCalculatedHeight(height: number): number {
        return this.maxH < height ? this.maxH : height;
    }
    

    getCalculatedStyle(style: Style, newObj: { width: number, height: number }) {
        const newWidth = this.getCalculatedWidth(newObj.width);
        const newHeight = this.getCalculatedHeight(newObj.height);

        return {
            width: newWidth,
            height: newHeight
        };
    }
}

export default new FontSizeCalc();