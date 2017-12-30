// Import required modules
import React from 'react';

// Import requred components
import BodyJSX from './Body.jsx';
import './body.css';

class Body extends React.Component {
  constructor(props) {
    // Call parent constructor
    super(props);

    // Viewsite Methods
    this.handleRequestViewsite = this.handleRequestViewsite.bind(this);

    // User Database Methods
    this.handleRequestUserDatabase = this.handleRequestUserDatabase.bind(this);
  }

  handleRequestViewsite(viewsiteName) {
    this.props.onRequestViewsite(viewsiteName);
  }

  handleRequestUserDatabase(viewsiteId) {
    this.props.onRequestUserDatabase(viewsiteId);
  }

  render() {
    return(BodyJSX.call(this));
  }
}

export default Body;
