// Copyright 2015, EMC, Inc.

'use strict';

// import { EventEmitter } from 'events';

import React, // eslint-disable-line no-unused-vars
  { Component, PropTypes } from 'react';

import radium from 'radium';
import mixin from 'common-web-ui/lib/mixin';
import decorate from 'common-web-ui/lib/decorate';

import CoordinateHelpers from '../mixins/CoordinateHelpers';

import generateId from '../lib/generateId';

// import Graph from '../lib/Graph';
import Vector from '../lib/Vector';
// import Rectangle from '../lib/Rectangle';

import GCViewport from './Viewport';
import GCWorld from './World';

import GCGroupsManager from './managers/Groups';
import GCLinksManager from './managers/Links';
import GCMarksManager from './managers/Marks';
import GCNodesManager from './managers/Nodes';

import GCGroupElement from './elements/Group';
import GCLinkElement from './elements/Link';
import GCNodeElement from './elements/Node';
import GCPortElement from './elements/Port';
import GCSocketElement from './elements/Socket';

export { GCGroupElement as GCGroup };
export { GCLinkElement as GCLink };
export { GCNodeElement as GCNode };
export { GCPortElement as GCPort };
export { GCSocketElement as GCSocket };

/**
# GraphCanvas

@object
  @type class
  @extends React.Component
  @name GraphCanvas
  @desc
*/

@radium
@mixin(CoordinateHelpers)
@decorate({
  propTypes: {
    className: PropTypes.string,
    css: PropTypes.object,
    enableMarks: PropTypes.bool,
    grid: PropTypes.object,
    initialScale: PropTypes.number,
    initialX: PropTypes.number,
    initialY: PropTypes.number,
    style: PropTypes.object,
    viewHeight: PropTypes.number,
    viewWidth: PropTypes.number,
    worldHeight: PropTypes.number,
    worldWidth: PropTypes.number,
    onSelect: PropTypes.func,
    onLink: PropTypes.func,
    onUnlink: PropTypes.func
  },
  defaultProps: {
    className: 'GraphCanvas',
    css: {},
    enableMarks: false,
    grid: {},
    initialScale: 1,
    initialX: 0,
    initialY: 0,
    style: {},
    viewHeight: 600,
    viewWidth: 800,
    worldHeight: 2000,
    worldWidth: 2000,
    onSelect: null,
    onLink: null,
    onUnlink: null
  },
  childContextTypes: {
    graphCanvas: PropTypes.any
  }
})
export default class GraphCanvas extends Component {

  get graphCanvas() {
    return this;
  }

  index = {_links_: {}};

  // TODO: keep track of each action as a separate mutation for undo/redo
  history = [];

  // TODO: keep track of all selected items
  selected = [];

  shouldComponentUpdate(nextProps, nextState) {
    let props = this.props,
        state = this.state;
    return (
      props.viewHeight !== nextProps.viewHeight ||
      props.viewWidth !== nextProps.viewWidth ||
      props.worldHeight !== nextProps.worldHeight ||
      props.worldWidth !== nextProps.worldWidth ||
      state.position !== nextState.position ||
      state.scale !== nextState.scale
    );
  }

  state = {
    position: new Vector(
      this.props.initialX,
      this.props.initialY
    ),
    scale: this.props.initialScale
  };

  css = {
    root: {
      overflow: 'hidden'
    }
  };

  getChildContext() {
    return {
      graphCanvas: this
    };
  }

  // componentWillMount() {
  //   debugger;
  //   this.events = new EventEmitter();
  // }
  //
  // componentWillUnmount() {
  //   this.events.removeAllListeners();
  // }

  /**
  @method
    @name render
    @desc
  */
  render() {
    try {
      let props = this.props,
          css = [this.css.root, this.cssViewSize, props.css.root, props.style];

      let children = React.Children.map(props.children, child => {
        // NOTE: Context seems to be based on lexical scope, this will ensure Graph Canvas
        //       children have a graphCanvas in their context which is required for GC elements.
        return React.cloneElement(child);
      });

      // debugger;

      return (
        <div className={props.className} style={css}>
          <GCGroupsManager ref="groups" />
          <GCLinksManager ref="links" />
          <GCNodesManager ref="nodes" />
          {this.props.enableMarks && <GCMarksManager ref="marks" />}

          <GCViewport ref="viewport">
            <GCWorld ref="world" grid={this.props.grid}>
              {children}
            </GCWorld>
          </GCViewport>
        </div>
      );
    } catch (err) {
      console.error(err.stack || err);
    }
  }

  get cssViewSize() {
    return {
      width: this.props.viewWidth,
      height: this.props.viewHeight
    };
  }

  get cssWorldSize() {
    return {
      width: this.props.worldWidth,
      height: this.props.worldHeight
    };
  }

  get elements() {
    var elements = [],
        world = this.refs.world;
    if (world) {
      if (this.refs.marks) {
        elements = elements.concat(this.refs.marks.markElements);
      }
    }
    return elements;
  }

  get vectors() {
    var vectors = [],
        world = this.refs.world;
    if (world) {
      if (this.refs.marks) {
        vectors = vectors.concat(this.refs.marks.markVectors);
      }
    }
    return vectors;
  }

  updatePosition(position) {
    this.setState({ position });
  }

  updateScale(scale) {
    this.setState({ scale });
  }

  updateSelection(selected, element) {
    let index = this.selected.indexOf(element);
    if (selected) {
      if (index === -1) { this.selected.push(element); }
    }
    else {
      if (index !== -1) { this.selected.splice(index, 1); }
    }
    // debugger;
    // this.events.emit('selection', this.selected);
    if (this.props.onSelect) { this.props.onSelect(this.selected); }
  }

  // onSelect(callback) {
  //   // debugger;
  //   this.events.on('selection', callback);
  // }

  lookup(id) {
    let obj = this.index[id];
    if (!obj) {
      let err = new Error('GraphCanvas: Unable to find element with id: ' + id);
      err.gcIsSafe = true;
      throw err;
    }
    if (obj.matches) {
      if (obj.matches.length === 1) { return obj.matches[0]; }
      console.warn('GraphCanvas lookup returned multitple elements for an id.');
      return obj.matches;
    }
  }

  register(child) {
    // debugger;
    let id = child.id = child.id || generateId();
    let obj = this.index[id] = (this.index[id] || {matches: []});
    if (obj.matches.indexOf(child) === -1) {
      obj.matches.push(child);
    }
    // TODO: create groups, nodes, links, ports, and sockets lists using child.constructor.GCTypeEnum
  }

  unregister(child) {
    // debugger;
    let id = child.id;
    if (!id) {
      throw new Error('GraphCanvas: Cannot unregister invalid child without id.');
    }
    let obj = this.index[id];
    if (obj && obj.matches) {
      let index = obj.matches.indexOf(child);
      if (index !== -1) {
        obj.matches.splice(index, 1);
      }
    }
  }

  lookupLinks(id) {
    // debugger;
    let scope = this.index._links_ = this.index._links_ || {},
        subindex = scope[id],
        links = {};
    Object.keys(subindex || {}).forEach(otherEnd => {
      otherEnd = subindex[otherEnd];
      Object.keys(otherEnd || {}).forEach(linkId => {
        links[linkId] = otherEnd[linkId];
      });
    });
    return Object.keys(links).map(linkId => links[linkId]);
  }

  associate(scope, a, b, id, value) {
    a = a.id || a;
    b = b.id || b;
    scope[a] = scope[a] || {};
    scope[a][b] = scope[a][b] || {};
    if (value) { scope[a][b][id] = value; }
    else { delete scope[a][b][id]; }
  }

  associateLinkConcept(linkTo, linkFrom, linkId, value) {
    let scope = this.index._links_ = this.index._links_ || {};

    let toSocket = this.lookup(linkTo);
    let toPort = toSocket.context.parentGCPort;
    let toNode = toPort.context.parentGCNode;
    let toGroup = toNode.context.parentGCGroup;

    let fromSocket = this.lookup(linkFrom);
    let fromPort = fromSocket.context.parentGCPort;
    let fromNode = fromPort.context.parentGCNode;
    let fromGroup = fromNode.context.parentGCGroup;

    this.associate(scope, fromSocket, toSocket, linkId, value);
    this.associate(scope, toSocket, fromSocket, linkId, value);

    this.associate(scope, fromPort, toPort, linkId, value);
    this.associate(scope, toPort, fromPort, linkId, value);

    this.associate(scope, fromNode, toNode, linkId, value);
    this.associate(scope, toNode, fromNode, linkId, value);

    this.associate(scope, fromGroup, toGroup, linkId, value);
    this.associate(scope, toGroup, fromGroup, linkId, value);

    setTimeout(() => {
      fromSocket.forceUpdate();
      toSocket.forceUpdate();
    }, 0);
  }

  associateLink(link, value) {
    if (value === undefined) { value = link; }

    this.associateLinkConcept(link.state.to, link.state.from, link.id, value);
  }

  forgetLinkAssociation(link) {
    this.associateLink(link, null);
  }

  emitters = {add: {}, remove: {}};

  emitLink(link) {
    if (this.emitters.add[link.id]) { return; }
    this.emitters.add[link.id] = true;
    if (this.props.onLink) { this.props.onLink(link); }
  }

  emitUnlink(link) {
    if (this.emitters.remove[link.id]) { return; }
    this.emitters.remove[link.id] = true;
    if (this.props.onUnlink) { this.props.onUnlink(link); }
  }

}

// RAINBOW MODE:
// color = [ 'red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet' ];
// this.color = color[i++ % color.length];
