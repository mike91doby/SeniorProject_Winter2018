// Import required modules
import React from 'react';

// Import requred components
import AppContentJSX from './AppContent.js';

class AppContent extends React.Component {
  constructor(props) {
    // Call parent constructor
    super(props);

    // User Database Methods
    this.handleUpdateUserTable = this.handleUpdateUserTable.bind(this);
  }

  /*
   * Method that allows components to request a Viewsite's associated User Database
   * Passed down from the main Application
   */
  handleUpdateUserTable(updatedTable) {
    this.props.onUpdateUserTable(updatedTable);
  }

  /*
   * Render the Application Content JSX view
    */
  render() {
    return(AppContentJSX.call(this));
  }
}

// Export the Application Content
export default AppContent;
