'use strict';

import { Component } from 'mach-react';

import DragEventHelpers from '../mixins/DragEventHelpers';
import Vector from '../lib/Vector';

export default class GSEntityElement extends Component {

  static mixins = [ DragEventHelpers ]

  static defaultProps = {
    className: 'GSInlineFrame',
    css: {},
    style: {}
  }

  get canvas() { return this.context.canvas; }

  render(React) {
    try {
      var state = this.state;
      var css = {
        userSelect: 'none',
        boxSizing: 'border-box',
        position: 'absolute',
        top: 1000 - (this.props.size[1] / 2) + this.props.position[1],
        left: 1000 - (this.props.size[0] / 2) + this.props.position[0],
        width: this.props.size[0],
        height: this.props.size[1],
        paddingTop: '20px',
        background: 'rgba(0, 0, 0, 0.25)',
        border: '2px solid #000'
      };
      return (
        <div
            className={this.props.className}
            onMouseDown={this.translateEntity()}
            style={css}>
          TEST!
          {this.props.children}
        </div>
      );
    } catch (err) {
      console.error(err.stack || err);
    }
  }

  translateEntity() {
    return this.setupClickDrag(this.translateEntityListeners);
  }

  get position() {
    return new Vector(this.state.position)
  }

  get translateEntityListeners() {
    return {
      down: (event, dragState) => {
        event.stopPropagation();
      },
      move: (event, dragState) => {
        event.stopPropagation();
        clearInterval(this.moveRepeat);
        var scale = this.canvas.scale,
            offset = new Vector([event.diffX / scale, event.diffY / scale]);
        this.canvas.offsetElementPosition(this, offset);
      },
      up: (event, dragState) => {
        event.stopPropagation();
      }
    };
  }

  offsetPosition(offset) {
    this.props.position[0] += offset[0];
    this.props.position[1] += offset[1];
    this.queueUpdate();
    // this.setProps({position: new Vector(this.props.position).add(offset)});
  }

}
