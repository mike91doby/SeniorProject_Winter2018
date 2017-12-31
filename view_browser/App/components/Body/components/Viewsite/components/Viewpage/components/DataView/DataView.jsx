// Import required modules
import React from 'react';

/*
 * Create a cell for each datum in the record set
 * Used by Records
 */
function Data(props) {
  if(props.record.data) {
    return props.record.data.map((datum, index) => {
      return(
        <td key={datum._id}>
          {datum.datum}
        </td>
      );
    });
  }
}

/*
 * Create a table row for each record in the User Table
 * Used by DataViewJSX
 */
function Records(props) {
  if(props.userTable.records) {
    return props.userTable.records.map((record, index) => {
      return(
        <tr key={record._id}>
          <Data record={record} />
        </tr>
      );
    });
  } else {
    return null;
  }
}

/*
 * Data View JSX view
 */
var DataViewJSX = function() {
  // Find the User Table associated with the selected Form Element Data View
  let userTable = {};
  if(this.props.userDatabase.tables) {
    for(const databaseTable of this.props.userDatabase.tables) {
      if(databaseTable._id === this.props.element.formId) {
        userTable = databaseTable;
      }
    }
  }
  // Find the appropriate Form Title for the Form Element Data View
  let formTitle = "";
  if(this.props.userTables) {
    for(const userTable of this.props.userTables) {
      if(userTable._id == this.props.element.formId) {
        formTitle = userTable.formTitle;
      }
    }
  }

  return (
    <div>
      <h2>{formTitle}</h2>

      <table className="table table-hover">
        <tbody>
          <Records
          userTable={userTable} />
        </tbody>
      </table>
    </div>
  );
}

// Export Data View JSX view
export default DataViewJSX;
