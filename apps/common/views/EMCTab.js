// Copyright 2015, EMC, Inc.

'use strict';

import React, { Component } from 'react';
import radium from 'radium';

@radium
export default class AppHeader extends Component {

  // http://brand.emc.com/brand-elements-2/

  css = {
    root: {
      backgroundColor: '#2C95DD',
      overflow: 'hidden',
      position: 'fixed',
      display: 'block',
      zIndex: 99,
      color: 'white',
      float: 'left',
      // left: (100 / 21) + '%',
      right: (100 / 21) + '%',
      width: (100 / 7) + '%',
      maxWidth: 140,
      minWidth: 100,
      bottom: 0,
      // top: 0,

      ':hover': {
        backgroundColor: require('color')('#2C95DD').lighten(0.125).clearer(0.5).rgbaString()
      }
    },

    logo: {
      clear: 'both',
      marginTop: '32%',
      marginLeft: '16%',
      marginRight: '16%',
      marginBottom: '16%',
      width: '64%'
    }
  }

  render() {
    return (
      <a
          className="emc-tab"
          style={[this.css.root]}
          href="http://emc.com">

        <img
            className="emc-logo"
            style={[this.css.logo]}
            src="/common/WhiteLogoLarge.png"
            alt="EMC" />

      </a>
    );
  }

}
