// @flow

import React from "react";
import { mapResizer } from "../../../utils";
import type { ResizeType, PageClick } from "../../../types";
import "./index.css";

type Props = {
    dragging: (number, number) => void,
    resizeClicked: (ResizeType) => void,
    resetResized: () => void,
    onResize: ({| current: PageClick, previous: PageClick |}) => void,
    updatePosition: () => void,
    enableEditMode: () => void
};

export default class FakeComponent extends React.Component <Props> {
    resize: Function;
    mousePosition: {
        x: number,
        y: number
    };
    isMouseDown: boolean;
    dragging: boolean;
    constructor(props: Props) {
       
        super(props);

        this.mousePosition = {
            x: 0,
            y: 0
        };
        this.isMouseDown = false;
        this.dragging = false;

        this.resize = (e: Object) => {
            if (this.dragging) {
                this.props.dragging(
                    e.pageX - this.mousePosition.x, 
                    e.pageY - this.mousePosition.y
                )
                return;
            }

            if ((!this.isMouseDown)) return;

            this.props.onResize({
                current: {
                    pageX: e.pageX,
                    pageY: e.pageY,
                },
                previous: {
                    pageX: this.mousePosition.x,
                    pageY: this.mousePosition.y,
                }
            });
        }
    }

    //TODO: Remove mouse up an related if not needed.
    addResizeEvent() {
        window.addEventListener('mouseup', () => this.removeResizeEvent());
        window.addEventListener('mousemove', this.resize);
    }

    removeResizeEvent() {
        this.isMouseDown = false;
        this.dragging = false;
        this.props.resetResized();
    }

    mouseDown(e: Object) {
        e.preventDefault();
        e.stopPropagation();

        this.mousePosition = {
            x: e.pageX,
            y: e.pageY
        };

        this.addResizeEvent();
    }

    render() {
        return <div
                className="fakeContainer"
                onDoubleClick={() => this.props.enableEditMode()}
        >
            <div className='resizers'
                onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    this.dragging = true;
                    this.mouseDown(e);
                    this.props.updatePosition();
                }}
            >
                {
                    Object.keys(mapResizer).map(key => {
                        return <div
                            key={key}
                            className={`resizer ${mapResizer[key].name}`}
                            onMouseDown={(e) => {
                                this.isMouseDown = true;
                                this.mouseDown(e);
                                this.props.resizeClicked(key);
                            }}
                        ></div>;
                    })
                }
            </div>
        </div>;
    }
}