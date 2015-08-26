'use strict';

/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import mixin from 'react-mixin';
import DialogHelpers from 'common-web-ui/mixins/DialogHelpers';
import FormatHelpers from 'common-web-ui/mixins/FormatHelpers';
import RouteHelpers from 'common-web-ui/mixins/RouteHelpers';
import GridHelpers from 'common-web-ui/mixins/GridHelpers';
/* eslint-enable no-unused-vars */

import {
    RaisedButton,
    LinearProgress
  } from 'material-ui';

import FileStore from '../stores/FileStore';
let files = new FileStore();

@mixin.decorate(DialogHelpers)
@mixin.decorate(FormatHelpers)
@mixin.decorate(RouteHelpers)
@mixin.decorate(GridHelpers)
export default class FilesGrid extends Component {

  state = {
    files: null,
    loading: true
  };

  componentDidMount() {
    this.unwatchFiles = files.watchAll('files', this);
    this.listFiles();
  }

  componentWillUnmount() { this.unwatchFiles(); }

  render() {
    return (
      <div className="FilesGrid">
        {this.renderGridToolbar({
          label: <a href="#/files">Files</a>,
          count: this.state.files && this.state.files.length || 0,
          right:
            <RaisedButton label="Create File" primary={true} onClick={this.createNode.bind(this)} />
        })}
        {this.state.loading ? <LinearProgress mode="indeterminate" /> : <div className="clearfix"></div>}
        {
          this.renderGrid({
            results: this.state.files,
            resultsPerPage: this.props.size || 50
          }, file => (
            {
              ID: <a href={this.routePath('files', file.uuid)}>{this.shortId(file.uuid)}</a>,
              Name: file.basename,
              MD5: file.md5,
              Version: file.version
            }
          ), 'No files.')
        }
      </div>
    );
  }

  listFiles() {
    this.setState({loading: true});
    files.list().then(() => this.setState({loading: false}));
  }

  createNode() { this.routeTo('files', 'new'); }

}
