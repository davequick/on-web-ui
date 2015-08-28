'use strict';

/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import mixin from 'react-mixin';
import DialogHelpers from 'common-web-ui/mixins/DialogHelpers';
import PageHelpers from 'common-web-ui/mixins/PageHelpers';
/* eslint-enable no-unused-vars */

import EditFile from './EditFile';
import CreateFile from './CreateFile';
export { CreateFile, EditFile };

import {
    LinearProgress,
    List, ListItem,
    RaisedButton,
    Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle,
    Snackbar
  } from 'material-ui';

import FileStore from '../stores/FileStore';
let file = new FileStore();

@mixin.decorate(DialogHelpers)
@mixin.decorate(PageHelpers)
export default class File extends Component {

  state = {
    file: null,
    loading: true
  };

  componentDidMount() {
    this.unwatchFile = file.watchOne(this.getFileId(), 'file', this, (err) => {
      if (err.message.indexOf('Not Found') !== -1) {
        this.showError('Unable to locate file.');
      }
    });
    this.readFile();
  }

  componentWillUnmount() { this.unwatchFile(); }

  componentDidUpdate() {
    if (this.state.error) { this.refs.error.show(); }
  }

  render() {
    let file = this.state.file || {};
    return (
      <div className="File">
        {this.renderBreadcrumbs(
          {href: 'dash', label: 'Dashboard'},
          {href: 'files', label: 'Files'},
          this.getFileId()
        )}
        {this.state.loading ? <LinearProgress mode="indeterminate" /> : null}
        <Toolbar>
          <ToolbarGroup key={0} float="left">
            <ToolbarTitle text="File Details" />
          </ToolbarGroup>
          <ToolbarGroup key={1} float="right">
            <RaisedButton
                label="Delete File"
                primary={true}
                onClick={this.deleteFile.bind(this)}
                disabled={this.state.loading} />
          </ToolbarGroup>
        </Toolbar>
        <div className="ungrid">
          <div className="line">
            <div className="cell">
              <List>
                <ListItem
                  primaryText={file.basename || '(Untitled)'}
                  secondaryText="Basename" />
                <ListItem
                  primaryText={file.version + '' || '(Unknown)'}
                  secondaryText="version" />
              </List>
            </div>
            <div className="cell">
              <List>
                <ListItem
                  primaryText={file.filename || '(Unknown)'}
                  secondaryText="filename" />
                <ListItem
                  primaryText={file.uuid || '(Unknown)'}
                  secondaryText="uuid" />
                <ListItem
                  primaryText={file.md5 || '(Unknown)'}
                  secondaryText="md5" />
              </List>
            </div>
          </div>
        </div>
        <EditFile file={this.state.file} />
        <Snackbar
          ref="error"
          action="dismiss"
          message={this.state.error || 'Unknown error.'}
          onActionTouchTap={this.dismissError.bind(this)} />
      </div>
    );
  }

  showError(error) { this.setState({error: error.message || error}); }

  dismissError() {
    this.refs.error.dismiss();
    this.setState({error: null});
  }

  getFileId() {
    return this.state.file && this.state.file.id ||
      this.props.fileId || this.props.params.fileId;
  }

  readFile() {
    this.setState({loading: true});
    file.list().then(() => {
      file.read(this.getFileId()).then(() => this.setState({loading: false}));
    });
  }

  deleteFile() {
    var id = this.state.file.id;
    this.setState({loading: true});
    this.confirmDialog('Are you sure want to delete: ' + id,
      (confirmed) => confirmed ? files.destroy(id).then(() => this.routeBack()) : this.setState({loading: false}));
  }

}
