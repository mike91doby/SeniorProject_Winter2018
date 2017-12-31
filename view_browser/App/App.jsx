// Import required modules
import React from 'react';

// Import requred components
import Header from './components/Header';
import Body from './components/Body';
import Footer from './components/Footer';

/*
 * Main Application
 */
var AppJSX = function() {
  return(
    <div>
      <Header
      viewsite={this.state.viewsite} />

      <Body
      viewsite={this.state.viewsite}
      userDatabase={this.state.userDatabase}
      viewsiteRequestError={this.state.viewsiteRequestError}
      userTables={this.state.userTables}
      onRequestViewsite={this.handleRequestViewsite}
      onRequestUserDatabase={this.handleRequestUserDatabase} />

      <Footer
      viewsite={this.state.viewsite} />
    </div>
  );
}

// Export the main Application JSX view
export default AppJSX;
