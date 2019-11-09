// @flow

import React from "react";
 // $FlowFixMe
import { SketchPicker } from 'react-color';
// import IframeComponent from "./iframe";
import Components from "./helperComponent";
import { getHeight, getWidth, getTop, getLeft, getRight, getBottom } from "../utils";
import { mapResizer } from "../utils";
import { setCursorToEnd } from "../utils/cursor";
import type { Resizer } from "../utils";
import fontSizeCalc  from "../utils/calculateFontSize"
import type { Style, } from "../types";

import "./index.css";

type OutsideProps = {
    maxWidth?: number,
    maxHeight?: number,
    top?: number,
    left?: number,
    fontSize?: number,
    fontFamily?: string,
    lineHeight?: string,
    text: string,
    getHTML?: (html: string) => void,
    width?: number,
    height?: number
};

type Props = {
    maxWidth: number,
    maxHeight: number,
    top: number,
    left: number,
    text: string,
    fontSize: number,
    fontFamily: string,
    lineHeight: string,
    getHTML: (html: string) => void,
    width?: number,
    height?: number
};

type State = {
    style: Style,
    fontSize: number,
    editMode: boolean,
    fontFactor: number,
    ratio: number,
    resizing: null | Resizer,
    showColors: boolean,
    openColorPicker: boolean,
    color: string,
    backcolor: string,
    openBackColorPicker: boolean
};

const AUTO = 0;

class RichTextInput extends React.Component <Props, State> {
    myRef: Object;
    oldTopLeft: Style;
    selection: {
        baseNode: Element,
        baseOffset: Object,
        extentNode: Object,
        extentOffset: Object
    };

    constructor(props: Props) {
        super(props);

        this.myRef = React.createRef(); //SyntheticEvent<window>
        fontSizeCalc.setMaxValues(this.props.maxWidth, this.props.maxHeight);

        window.addEventListener('click', () => {
            this.setState({
                editMode: false,
                showColors: false,
                openColorPicker: false,
                openBackColorPicker: false
            });
        });

        this.selection = {
            baseNode:  window.getSelection().baseNode,
            baseOffset: window.getSelection().baseOffset,
            extentNode: window.getSelection().extentNode,
            extentOffset: window.getSelection().extentOffset 
        };

        this.oldTopLeft = {
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            width: 0,
            height: 0
        }

        this.state = {
            showColors: false,
            editMode: false,
            fontSize: 14,
            resizing: null,
            fontFactor: 0,
            ratio: 0,
            openColorPicker: false,
            openBackColorPicker: false,
            color: "#000000",
            backcolor: "#ffffff",
            style: {
                width: AUTO,
                height: AUTO,
                bottom: AUTO,
                right: AUTO,
                top: AUTO,
                left: AUTO
            }
        }
    }

    componentDidMount() {
        const { top, left, right, bottom, width, height,  size } = fontSizeCalc.getPosWithFont({
            size: this.props.fontSize,
            top: this.props.top,
            left: this.props.left,
            text: this.props.text,
            maxHeight: this.props.maxHeight,
            maxWidth: this.props.maxWidth,
            family: this.props.fontFamily,
            lineHeight: this.props.lineHeight,
            height: this.props.height,
            width: this.props.width
        });

        this.setState({
            editMode: false,
            fontSize: size,
            fontFactor: size / width,
            ratio: width / height,
            style: {
                top,
                left,
                bottom,
                right,
                width,
                height
            }
        });
    }

    adjustContainer() {
        const style = mapResizer.d.getCalculatedPosition({
            width: getWidth(this.myRef.current),
            height: getHeight(this.myRef.current)
        }, this.state.style);

        this.setState({
            style
        }, () => {
            const node = this.myRef.current.cloneNode();
            const childNode = this.myRef.current.querySelector(".contentEditable").cloneNode(true);
            childNode.contentEditable = false;
            node.appendChild(childNode);
            this.props.getHTML(node.outerHTML);
        });
    }

    setPropertyOnMouseDown() {
        this.oldTopLeft = {
            top: getTop(this.myRef.current),
            left: getLeft(this.myRef.current),
            bottom: getBottom(this.myRef.current),
            right: getRight(this.myRef.current),
            width: getWidth(this.myRef.current),
            height: getHeight(this.myRef.current)
        };
    }

    updatePosition () {
        return {
            top: getTop(this.myRef.current),
            left: getLeft(this.myRef.current),
            bottom: getBottom(this.myRef.current),
            right: getRight(this.myRef.current)
        };
    }


    focustAtSpecific() {
        if (!this.selection.baseNode) return;
        var range = document.createRange();
        var sel = window.getSelection();

        if (!sel.isCollapsed) return;
        if (this.selection.baseOffset < this.selection.extentOffset) {
            range.setStart(this.selection.baseNode, this.selection.baseOffset);
            range.setEnd(this.selection.extentNode, this.selection.extentOffset);
        } else {
            range.setStart(this.selection.extentNode, this.selection.extentOffset);
            range.setEnd(this.selection.baseNode, this.selection.baseOffset);
        }

        sel.removeAllRanges();
        sel.addRange(range);
    }
    
    setSelection () {
         this.selection = {
            baseNode:  window.getSelection().baseNode,
            baseOffset: window.getSelection().baseOffset,
            extentNode: window.getSelection().extentNode,
            extentOffset: window.getSelection().extentOffset 
        };
    }
    showColorOptionsIfNeeded() {
        this.setSelection();
        this.setState({
            showColors: !window.getSelection().isCollapsed
        });
    }

    componentDidUpdate() {
         if (this.state.openBackColorPicker || this.state.openColorPicker) {
            if (window.getSelection().isCollapsed) {
                this.focustAtSpecific();
            } else {
                this.setSelection();
            }
         }
         const childElement = this.myRef.current.querySelector(".contentEditable").outerHTML;
                this.props.getHTML(`<div style="${this.myRef.current.style.cssText}">${childElement}</div>`);
    }


    renderContentEditable() {
        return <div
            className="contentEditable"
            contentEditable
            // onInput={this.emitChange} 
            onBlur={() => {
                const childElement = this.myRef.current.querySelector(".contentEditable").outerHTML;
                this.props.getHTML(`<div style="${this.myRef.current.style.cssText}">${childElement}</div>`);
                this.focustAtSpecific();
            }}
            onMouseUp={() => {
                setTimeout(() => {
                    this.showColorOptionsIfNeeded();    
                }, 0);
            }}
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
            }}
            spellCheck="false"
            onInput={() => this.adjustContainer()}
            onKeyUp={(e) => {
                this.showColorOptionsIfNeeded();
                if (e.shiftKey && e.keyCode > 36 && e.keyCode < 41) return;
                if (e.keyCode === 13 || e.keyCode === 16 || e.keyCode === 18 || e.shiftKey || e.ctrlKey) return;
            }}
            onKeyDown={(e) => {
                if (this.props.maxHeight <= e.currentTarget.scrollHeight) {
                    this.setState({
                        fontSize: this.state.fontSize - 1,
                        fontFactor: (this.state.fontSize - 1) / this.state.style.width,
                    })
                }
            }}
            dangerouslySetInnerHTML={{ __html: this.props.text }}
        >
        </div>
    }

    getFontSize(width: number, height: number) {
        return (this.props.maxHeight > height && this.props.maxWidth > width)
    }


    renderColorOption() {
        return [ 
                this.state.showColors  && (this.state.openColorPicker || this.state.openBackColorPicker )? 
                        <SketchPicker
                            color={this.state.openBackColorPicker ? this.state.backcolor  : this.state.color}
                            onChangeComplete={(color) => {
                                if (this.state.openBackColorPicker) {
                                    if (window.getSelection().isCollapsed) {
                                        this.focustAtSpecific();
                                    } else {
                                        this.setSelection();
                                    }
                                    document.execCommand("backcolor", false, color.hex);
                                    this.setState({ backcolor: color.hex });
                                } else {
                                    if (window.getSelection().isCollapsed) {
                                        this.focustAtSpecific();
                                    } else {
                                        this.setSelection();
                                    }
                                    document.execCommand("foreColor", false, color.hex);
                                    this.setState({ color: color.hex });
                                }
                                
                            }}
                        /> : null 
            ,
                this.state.showColors ? 
                    <div className="colorOptions"
                        key="colorOptions"
                        onClick={() => {
                            this.focustAtSpecific();
                        }}
                    >
                        <div
                            className="background"
                            style={{ backgroundColor: this.state.backcolor }}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                this.focustAtSpecific();
                                 // $FlowFixMe
                                this.setState({ openBackColorPicker: true, openColorPicker: false, backcolor: document.queryCommandValue("backcolor") })
                            }}
                        ></div>
                        <div
                            className="color"
                            style={{ color: this.state.color }}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                this.focustAtSpecific();
                                 // $FlowFixMe
                                this.setState({ openColorPicker: true, openBackColorPicker: false, color: document.queryCommandValue("foreColor") })
                            }}
                        > A </div>
                    </div> : null
        ];
    }

    renderLimitContainer() {
        return <div
            className="limitContainer"
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (e.target.classList.contains("limitContainer")) {
                    this.setState({
                        editMode: false,
                        showColors: false,
                        openColorPicker: false,
                        openBackColorPicker: false
                    });
                }
            }}
            style={{
                width: this.props.maxWidth,
                height: this.props.maxHeight
            }}
        >
            <div
                ref={this.myRef}
                className="contentEditableStart"
                style={{
                     ...this.state.resizing ?
                            this.state.resizing.getStyle(this.state.style) :
                            { top: this.state.style.top, left: this.state.style.left },
                    width: this.state.style.width,
                    // height: this.state.style.height,
                    fontSize: this.state.fontSize,
                    fontFamily: this.props.fontFamily,
                    maxWidth: this.props.maxWidth,
                    maxHeight: this.props.maxHeight,
                    lineHeight: this.props.lineHeight,
                    height: "auto",
                    display: "flex",
                    "align-items": "center",
                    "min-width": "auto",
                    padding: "7px",
                    "box-sizing": "border-box",
                    "word-break": "break-word"
                }}
            >
                {this.renderColorOption()}
                {this.renderContentEditable()}
                {
                    !this.state.editMode ? 
                        <Components.FakeComponent
                            enableEditMode={() => {
                                !this.state.editMode && 
                                this.setState({
                                    editMode: true
                                }, () => {
                                    setCursorToEnd(this.myRef.current.querySelector(".contentEditable"))
                                });
                            }}
                            updatePosition={() => {
                                this.setState({
                                    style: {
                                        ...this.state.style,
                                        ...this.updatePosition()
                                    }
                                }, () => this.setPropertyOnMouseDown());
                            }}
                            resizeClicked={type => {
                                this.setState({
                                    resizing: mapResizer[type],
                                    style: {
                                        ...this.state.style,
                                        ...this.updatePosition()
                                    }
                                }, () => this.setPropertyOnMouseDown());
                            }}
                            resetResized={() => {
                                if (!this.state.editMode) {
                                    this.setState({
                                        resizing: null,
                                        style: {
                                            ...this.state.style,
                                            ...this.updatePosition()
                                        }
                                    })
                                }
                            }}
                            dragging={(x, y) => {
                                this.setState({
                                    style: {
                                        ...this.state.style,
                                        top: fontSizeCalc.getCalculatedTop(
                                            this.oldTopLeft.top + y,
                                            getHeight(this.myRef.current)
                                        ),
                                        left: fontSizeCalc.getCalculatedLeft(
                                            this.oldTopLeft.left + x,
                                            getWidth(this.myRef.current)
                                        )
                                    }
                                })
                            }}
                            onResize={({current, previous}) => {
                                if (!this.state.resizing) return;
                                const getCalculatedPosition = this.state.resizing.getCalculatedPosition;
                                
                                const dimension = this.state.resizing.getDimension({
                                    ...this.oldTopLeft,
                                    current,
                                    previous,
                                    height: this.state.resizing && 
                                            (this.state.resizing.key === "e" ||
                                    this.state.resizing.key === "f" ) ? getHeight(this.myRef.current): this.oldTopLeft.height
                                });

                                if (
                                    this.myRef.current.scrollHeight > (this.myRef.current.offsetHeight + 5)
                                    && dimension.width < this.state.style.width
                                    && dimension.width > this.state.style.width
                                ) {
                                    return;
                                }

                                if (this.state.resizing && 
                                    (this.state.resizing.key === "e" ||
                                    this.state.resizing.key === "f" )&&
                                    dimension.width < this.state.style.width &&
                                    this.props.maxHeight - dimension.height <= this.state.fontSize
                                ) {
                                    return; 
                                }

                                if (this.state.resizing && 
                                    (this.state.resizing.key === "e" ||
                                    this.state.resizing.key === "f" )&&
                                    dimension.width < this.state.style.width &&
                                    this.myRef.current.offsetWidth + 6 < this.myRef.current.scrollWidth
                                ) {
                                    return; 
                                }
                                
                                const newDimension = fontSizeCalc.getCalculatedStyle(this.state.style, dimension);
                                const newFont = this.state.resizing && 
                                        (this.state.resizing.key !== "e" && this.state.resizing.key !== "f") ? 
                                        newDimension.width * this.state.fontFactor : this.state.fontSize;
                                
                                if (
                                    this.state.resizing &&
                                    this.state.resizing.key !== "e" &&
                                    this.state.resizing.key !== "f" &&
                                    this.state.fontSize < newFont &&
                                    Math.ceil(getHeight(this.myRef.current)) >= this.props.maxHeight
                                ) return;

                                if (newFont < 14) return;

                                const style = getCalculatedPosition(newDimension, this.state.style);
                                this.setState({
                                    fontSize: newFont,
                                    fontFactor: this.state.resizing && 
                                           ( this.state.resizing.key === "e" || this.state.resizing.key === "f" ) ? newFont / newDimension.width: this.state.fontFactor, 
                                    style
                                });
                            }}
                        /> : null
                }
            </div>
        </div>
    }

    render() {
        return this.renderLimitContainer();
    }
}


export default (props: OutsideProps) => {
    const mergedProps = {
        maxHeight: 360,
        maxWidth: 640,
        fontSize: 18,
        fontFamily: "Freshman",
        top: 100,
        left: 100,
        lineHeight: "1.3em",
        getHTML: (str) => {console.log(str)},
        ...props
    };
    
    return <div
            className="richTextInputMainWrapper"
        >
            <RichTextInput {...mergedProps}/>
            <div contentEditable={true} id="dummyContainer"></div>
        </div>;
};

