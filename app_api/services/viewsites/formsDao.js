// Include required modules
var mongoose = require('mongoose');
var viewsites = mongoose.model('viewsite');

// Include DAOs required for cross-collection modification
var userTablesDao = require('../userDatabases/userTablesDao');

/*
 * Method that allows Users to create Form Elements
 */
function formsCreate(request) {
  var promise = new Promise(function(resolve, reject) {
    if(!request.body.viewsiteId || !request.body.viewpageId) {
      reject('Viewsite and Viewpage IDs are both required!');
    } else if(!request.body.formTitle) {
      reject('All fields required!');
    } else if(!request.session.userId) {
      reject('You must be logged in to create a Form!');
    } else {
      viewsites.findById(request.body.viewsiteId)
      .exec(function(error, viewsiteData) {
        if(viewsiteData.userId != request.session.userId) {
          reject('You can only create Forms for Viewsites you own!');
        } else if(!viewsiteData) {
          reject('Viewsite not found!');
        } else {
          viewsiteData.viewpages.id(request.body.viewpageId).elements.push({
            'kind': request.body.kind,
            'formTitle': request.body.formTitle
          });
          viewsiteData.save(function(error, results) {
            if(error) {
              console.log(error.message);
              reject('Something went wrong!');
            } else {
              let elementsLength = results.viewpages.id(request.body.viewpageId).elements.length;
              request.body.elementId = results.viewpages.id(request.body.viewpageId).elements[elementsLength - 1]._id;
              userTablesDao.userTablesCreate(request)
              .then(function() {
                var cleanResults = results.toObject();
                delete cleanResults.userId;
                delete cleanResults.__v;
                resolve(cleanResults);
              }, function(error) {
                console.log(error.message);
                reject('Something went wrong!');
              });
            }
          });
        }
      });
    }
  });
  return promise;
}

/*
 * Method that allows Users to update Form Elements
 */
function formsUpdate(request) {
  var promise = new Promise(function(resolve, reject) {
    if(!request.body.viewsiteId || !request.body.viewpageId || !request.body.elementId) {
      reject('Viewsite, Viewpage, and Element IDs are all required!');
    } else if(!request.body.formTitle) {
      reject('All fields required!');
    } else if(!request.session.userId) {
      reject('You must be logged in to update a Form!');
    } else {
      viewsites.findById(request.body.viewsiteId)
      .exec(function(error, viewsiteData) {
        if(error) {
          console.log(error.message);
          reject('Something went wrong!');
        } else if(!viewsiteData) {
          reject('Viewsite not found!');
        } else if(viewsiteData.userId != request.session.userId) {
          reject('You can only update Forms you own!');
        } else if(!viewsiteData.viewpages.id(request.body.viewpageId).elements.id(request.body.elementId)) {
          reject('Element doesn\'t exist!');
        } else {
          viewsiteData.viewpages.id(request.body.viewpageId).elements.id(request.body.elementId).formTitle = request.body.formTitle;
          viewsiteData.save(function(error, results) {
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
 * Method that allows Users to delete Form Elements
 */
function formsDelete(request) {
  var promise = new Promise(function(resolve, reject) {
    if(!request.body.viewsiteId || !request.body.viewpageId || !request.body.elementId) {
      reject('Viewsite, Viewpage, and Element IDs are all required!');
    } else if(!request.session.userId) {
      reject('You must be logged in to delete a Form!');
    } else {
      viewsites.findById(request.body.viewsiteId)
      .exec(function(error, viewsiteData) {
        if(error) {
          console.log(error.message);
          reject('Something went wrong!');
        } else if(!viewsiteData) {
          reject('Viewsite not found!');
        } else if(viewsiteData.userId != request.session.userId) {
          reject('You can only delete Forms you own!');
        } else if(!viewsiteData.viewpages.id(request.body.viewpageId).elements.id(request.body.elementId)) {
          reject('Element doesn\'t exist!');
        } else {
          viewsiteData.viewpages.id(request.body.viewpageId).elements.id(request.body.elementId).remove();
          viewsiteData.save(function(error, results) {
            if(error) {
              console.log(error.message);
              reject('Something went wrong!');
            } else {
              userTablesDao.userTablesDelete(request)
              .then(function() {
                var cleanResults = results.toObject();
                delete cleanResults.userId;
                delete cleanResults.__v;
                resolve(cleanResults);
              }, function(error) {
                console.log(error.message);
                reject('Something went wrong!');
              });
            }
          });
        }
      });
    }
  });
  return promise;
}

// Export public methods
module.exports.formsCreate = formsCreate;
module.exports.formsUpdate = formsUpdate;
module.exports.formsDelete = formsDelete;
