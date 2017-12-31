// Include required modules
var mongoose = require('mongoose');
var userDatabases = mongoose.model('userDatabase');

/*
 * Method that allows Users to add a new Record
 */
function userRecordsCreate(request) {
  var promise = new Promise(function(resolve, reject) {
    if(!request.body.viewsiteId || !request.body.elementId) {
      reject('User Database and Table IDs are both required!');
    } else if(!request.body.record) {
      reject('All fields required!');
    } else {
      userDatabases.findById({'_id': request.body.viewsiteId})
      .exec(function(error, userDatabaseData) {
        if(error) {
          console.log(error.message);
          reject('Something went wrong!');
        } else if(!userDatabaseData) {
          reject('User Database not found!');
        } else if(!userDatabaseData.tables.id(request.body.elementId)) {
          reject('User Table doesn\'t exist!');
        } else  {
          let newRecord = userDatabaseData.tables.id(request.body.elementId).records.create();
          for(formFieldId in request.body.record) {
            newRecord.data.push({
              '_id': formFieldId,
              'datum': request.body.record[formFieldId]
            });
          }
          userDatabaseData.tables.id(request.body.elementId).records.push(newRecord);
          userDatabaseData.save(function(error, results) {
            if(error) {
              console.log(error.message);
              reject('Something went wrong!');
            } else {
              var cleanResults = results.toObject();
              delete cleanResults.userId;
              delete cleanResults.__v;
              resolve(cleanResults);
            }
          });
        }
      });
    }
  });
  return promise;
}

/*
 * Method that allows Users to modify an existing Record
 */
function userRecordsUpdate(request) {
  var promise = new Promise(function(resolve, reject) {
    if(!request.body.viewsiteId || !request.body.elementId || !request.body.recordId) {
      reject('User Database, Table, and Record IDs are all required!');
    } else if(!request.body.record) {
      reject('All fields required!');
    } else if(!request.session.userId) {
      reject('You must be logged in to update a Record!');
    } else {
      userDatabases.findById({'_id': request.body.viewsiteId})
      .exec(function(error, userDatabaseData) {
        if(error) {
          console.log(error.message);
          reject('Something went wrong!');
        } else if(!userDatabaseData) {
          reject('User Database not found!');
        } else if(userDatabaseData.userId != request.session.userId) {
          reject('You can only update Records you own!');
        } else if(!userDatabaseData.tables.id(request.body.elementId).records.id(request.body.recordId)) {
          reject('User Record doesn\'t exist!');
        } else {
          let userRecord = userDatabaseData.tables.id(request.body.elementId).records.id(request.body.recordId);
          let updatedRecord = userDatabaseData.tables.id(request.body.elementId).records.create();
          updatedRecord._id = userRecord._id;
          for(formFieldId in request.body.record) {
            updatedRecord.data.push({
              '_id': formFieldId,
              'datum': request.body.record[formFieldId]
            });
          }
          userRecord.set(updatedRecord);
          userDatabaseData.save(function(error, results) {
            if(error) {
              console.log(error.message);
              reject('Something went wrong!');
            } else {
              var cleanResults = results.toObject();
              delete cleanResults.userId;
              delete cleanResults.__v;
              resolve(cleanResults);
            }
          });
        }
      });
    }
  });
  return promise;
}

/*
 * Method that allows Users to delete an existing Record
 */
function userRecordsDelete(request) {
  var promise = new Promise(function(resolve, reject) {
    if(!request.body.viewsiteId || !request.body.elementId || !request.body.recordId) {
      reject('User Database, Table, and Record IDs are all required!');
    } else if(!request.session.userId) {
      reject('You must be logged in to delete a Record!');
    } else {
      userDatabases.findOne({'_id': request.body.viewsiteId})
      .exec(function(error, userDatabaseData) {
        if(error) {
          console.log(error.message);
          reject('Something went wrong!');
        } else if(!userDatabaseData) {
          reject('User Database not found!');
        } else if(userDatabaseData.userId != request.session.userId) {
          reject('You can only delete Records you own!');
        } else if(!userDatabaseData.tables.id(request.body.elementId).records.id(request.body.recordId)) {
          reject('User Record doesn\'t exist!');
        } else {
          userDatabaseData.tables.id(request.body.elementId).records.id(request.body.recordId).remove();
          userDatabaseData.save(function(error, results) {
            if(error) {
              console.log(error.message);
              reject('Something went wrong!');
            } else {
              var cleanResults = results.toObject();
              delete cleanResults.userId;
              delete cleanResults.__v;
              resolve(cleanResults);
            }
          });
        }
      });
    }
  });
  return promise;
}

// Export all public methods
module.exports.userRecordsCreate = userRecordsCreate;
module.exports.userRecordsUpdate = userRecordsUpdate;
module.exports.userRecordsDelete = userRecordsDelete;
