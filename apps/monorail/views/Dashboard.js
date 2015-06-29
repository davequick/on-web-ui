'use strict';

/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import mixin from 'react-mixin';
import PageHelpers from 'common-web-ui/mixins/PageHelpers';
/* eslint-enable no-unused-vars */

import NodesGrid from './NodesGrid';
import Chart from './Chart';
import './Dashboard.less';

@mixin.decorate(PageHelpers)
export default class Dashboard extends Component {

  render() {
    return (
      <div className="Dashboard">
        {this.renderBreadcrumbs('Dashboard')}
        <div className="container">
          <div className="row">
            <div className="one-half column">
              <NodesGrid />
            </div>
            <div className="one-half column">
              <Chart />
            </div>
          </div>
        </div>
      </div>
    );
  }

}