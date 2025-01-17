// Copyright 2015, EMC, Inc.

'use strict';

import React, { Component } from 'react';

import { LinearProgress } from 'material-ui';
import JsonInspector from 'react-json-inspector';

import OBMServiceStore from '../stores/OBMServiceStore';
let obmService = new OBMServiceStore();

export default class OBMService extends Component {

  state = {
    obmService: null,
    loading: true
  };

  componentDidMount() {
    this.unwatchOBMService = obmService.watchOne(this.getOBMServiceId(), 'obmService', this);
    this.readOBMService();
  }

  componentWillUnmount() { this.unwatchOBMService(); }

  render() {
    console.log(this.state.obmService);
    return (
      <div className="OBMService">
        {this.state.loading ? <LinearProgress mode="indeterminate" /> : null}
        <div style={{overflow: 'auto', margin: 10}}>
          <JsonInspector
              search={false}
              isExpanded={() => true}
              data={this.state.obmService || {}} />
        </div>
      </div>
    );
  }

  getOBMServiceId() { return this.props.obmsId || this.props.params.obmsId; }

  readOBMService() {
    this.setState({loading: true});
    obmService.read(this.getOBMServiceId()).then(() => this.setState({loading: false}));
  }

}
