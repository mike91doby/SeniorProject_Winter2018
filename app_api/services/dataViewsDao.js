// Required modules
var mongoose = require('mongoose');
var dataView = mongoose.model('dataView');

// ** CRUD OPERATIONS **

// Read operations
function dataViewsReadOne(request) {
  var promise = new Promise(function(resolve, reject) {
    if(!request.params.dataViewId) {
      reject('Data View ID is required!');
    } else {
      dataView.findOne({'_id': request.params.dataViewId}).populate('form').populate('userTable').exec(function(error, results) {
        if(error) {
          console.log(error.message);
          reject('Something went wrong!');
        } else if(!results) {
          reject('Data View not found!');
        } else {
          resolve(results);
        }
      });
    }
  });
  return promise;
}

function dataViewsReadAll(request) {
  var promise = new Promise(function(resolve, reject) {
    if(!request.params.viewpageId) {
      reject('Viewpage ID is required!');
    } else {
      dataView.find({'viewpageId': request.params.viewpageId}).populate('form').populate('userTable').exec(function(error, results) {
        if(error) {
          console.log(error.message);
          reject('Something went wrong!');
        } else if(!results) {
          reject('No Data Views found!');
        } else {
          resolve(results);
        }
      });
    }
  });
  return promise;
}

// Create operations
function dataViewsCreate(request) {
  var promise = new Promise(function(resolve, reject) {
    dataView.create({
      'form': request.body.formId,
      'userTable': request.body.formId,
      'viewpageId': request.body.viewpageId
    }, function(error, results) {
      if(error) {
        console.log(error.message);
        reject('Something went wrong!');
      } else {
        resolve('Data View created successfully!');
      }
    });
  });
  return promise;
}

// Update operations
function dataViewsUpdate(request) {
  var promise = new Promise(function(resolve, reject) {
    if(!request.params.dataViewId) {
      reject('Data View ID is required!');
    }
    dataView.findById(request.params.dataViewId).exec(function(error, dataViewData) {
      if(!dataViewData) {
        reject('Data View not found!');
      } else if(error) {
        console.log(error.message);
        reject('Something went wrong!');
      } else {
        dataViewData.form = request.body.formId;
        dataViewData.userTable = request.body.formId;
        dataViewData.save(function(error, results) {
          if(error) {
            console.log(error.message);
            reject('Something went wrong!');
          } else {
            resolve('Data View updated successfully!');
          }
        });
      }
    });
  });
  return promise;
}

// Delete operations
function dataViewsDelete(request) {
  var promise = new Promise(function(resolve, reject) {
    if(!request.params.dataViewId) {
      reject('Data View ID is required!');
    }
    dataView.findByIdAndRemove(request.params.dataViewId).exec(function(error, results) {
      if(error) {
        console.log(error.message);
        reject('Something went wrong!');
      } else {
        resolve('Data View deleted successfully!');
      }
    });
  });
  return promise;
}

// Export functions
module.exports.dataViewsReadOne = dataViewsReadOne;
module.exports.dataViewsReadAll = dataViewsReadAll;
module.exports.dataViewsCreate = dataViewsCreate;
module.exports.dataViewsUpdate = dataViewsUpdate;
module.exports.dataViewsDelete = dataViewsDelete;