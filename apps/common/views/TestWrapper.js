// Copyright 2015, EMC, Inc.

'use strict';

/* eslint-disable no-unused-vars */
import React, { Component, PropTypes } from 'react';
import mixin from 'react-mixin';
import decorate from '../lib/decorate';
import MUIContextHelpers from '../mixins/MUIContextHelpers';
/* eslint-enable no-unused-vars */

import onReady from '../lib/onReady';

var testContainer = document.createElement('div');
testContainer.setAttribute('id', (testContainer.id = 'tests'));

onReady(function() {
  document.body.appendChild(testContainer);
});

@decorate({
  propTypes: {
    disableAutoTheme: PropTypes.bool,
    TestComponent: PropTypes.func,
    componentProps: PropTypes.object,
    doneDelay: PropTypes.number,
    done: PropTypes.func
  },
  defaultProps: {
    doneDelay: 16,
    disableAutoTheme: false,
    componentProps: {}
  },
  childContextTypes: MUIContextHelpers.muiContextTypes()
})
@mixin.decorate(MUIContextHelpers)
export default class TestWrapper extends Component {

  static testRender(TestComponent, componentProps, done, disableAutoTheme) {
    try {
      var testWrapper = <TestWrapper
        disableAutoTheme={!!disableAutoTheme}
        TestComponent={TestComponent}
        componentProps={componentProps}
        done={done} />;
      return React.render(testWrapper, testContainer);
    } catch (err) {
      console.log('TestWrapper error:');
      console.error(err);
    }
  }

  static testCleanup(done) {
    clearTimeout(this.cleanupTimer);
    this.cleanupTimer = setTimeout(function() {
      if (!React.unmountComponentAtNode(testContainer)) {
        throw new Error('TestWrapper: Container element is not mounted.');
      }
      if (done) { setTimeout(done, 0); }
    }, 0);
  }

  state = {disabled: false};

  cleanup(done, componentOnly) {
    this.setState({disabled: true});
    if (!componentOnly) { TestWrapper.testCleanup(done); }
  }

  getDOMNode() { return React.findDOMNode(this); }

  getChildContext() {
    if (!this.props.disableAutoTheme) { return this.muiContext(); }
    return {};
  }

  get component() {
    return this.refs.component;
  }

  componentWillMount() {
    // console.log('Test wrapper will mount.', this.props);
  }

  componentDidMount() {
    if (this.props.done) {
      setTimeout(() => this.props.done(null, this.component), this.props.doneDelay);
    }
  }

  render() {
    try {
      if (this.state.disabled) { return null; }
      var { TestComponent, componentProps } = this.props,
          styles = {
            background: 'rgba(255, 255, 255, 0.75)',
            minHeight: '20%',
            position: 'absolute',
            padding: 10,
            zIndex: 1,
            border: '2px dotted rgba(255, 0, 0, 0.25)',
            width: '80%',
            left: '10%',
            top: '5%'
          };
      return (
        <div className="TestWrapper" style={styles}>
          <TestComponent ref="component" {...componentProps} />
        </div>
      );
    } catch (err) {
      console.log('TestWrapper-render error:');
      console.error(err);
    }
  }

}
