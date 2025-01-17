// Copyright 2015, EMC, Inc.

'use strict';

import React, { // eslint-disable-line no-unused-vars
  Component, PropTypes } from 'react';

import radium from 'radium';
import mixin from 'common-web-ui/lib/mixin';
import decorate from 'common-web-ui/lib/decorate';

import {
    List,
    ListItem,
    // FontIcon,
    IconButton,
    Checkbox//,
    // Toggle
  } from 'material-ui';

/**
# WEWorkflowJSON

@object
  @type class
  @extends React.Component
  @name WEWorkflowJSON
  @desc
*/

@radium
@decorate({
  propTypes: {
    className: PropTypes.string,
    editor: PropTypes.object,
    model: PropTypes.object,
    style: PropTypes.any
  },

  defaultProps: {
    className: '',
    editor: null,
    model: null,
    style: {}
  },

  contextTypes: {
    layout: PropTypes.any,
    editor: PropTypes.any
  }
})
export default class WETaskOutline extends Component {

  state = {};

  componentWillMount() {
    if (this.props.model && this.props.model._) {
      this.props.model._.outlineComponent = this;
    }
  }

  componentWillUnmount() {}

  updateSelected(selected) {
    // this.setState({ selected });
    // debugger;
    let nodeComponent = this.context.editor.refs.graphCanvas.lookup(this.props.model._.nodeId);
    let isChecked = selected.indexOf(nodeComponent) !== -1;
    this.refs.selected.setChecked(isChecked);
  }

  render() {
    let task = this.props.model;

    // let definition =
    //   task.taskDefinition ||
    //   this.context.editor.getTaskDefinitionByName(task.taskName) ||
    //   {};

    // console.log(task, definition);
    // <br/>implementsTask:<br/>
    // {JSON.stringify(definition.implementsTask) || 'undefined'}
    // <br/>options:<br/>
    // {JSON.stringify(definition.options) || 'undefined'}
    // <br/>properties:<br/>
    // {JSON.stringify(definition.properties) || 'undefined'}
    // <br/>waitOn:<br/>
    // {JSON.stringify(task.waitOn) || 'undefined'}
    // <br/><br/>

    return (
      <List
          subheader={this.props.showSubHeader ? 'Task:' : ''}>
        <ListItem
            leftCheckbox={<Checkbox ref="selected" onCheck={this.selectTask.bind(this)}/>}
            rightIconButton={
              <IconButton
                  iconClassName="fa fa-at"
                  tooltip="Task Label"
                  tooltipPosition="top-left" />
            }>
          {task.label}
        </ListItem>
        {/*<ListItem
            primaryText="Ignore Failure"
            rightToggle={<Toggle />}>
        </ListItem>*/}
      </List>
    );
  }

  selectTask(e, toggled) {
    // this.stopEvent(e);
    console.log(toggled);
    let nodeComponent = this.context.editor.refs.graphCanvas.lookup(this.props.model._.nodeId);
    nodeComponent.refs.panel.toggleSelected();
    // if (toggled) {
    //   this.context.layout.refs.graphCanvas.selectNode(this.props.model._node, e.shiftKey);
    // }
  }

  stopEvent(e) {
    e.stopPropagation();
    e.preventDefault();
  }

}
