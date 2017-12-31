// Include required modules
var mongoose = require('mongoose');
var viewsites = mongoose.model('viewsite');

// Include DAOs required for cross-collection modification
var userDatabasesDao = require('../userDatabases/userDatabasesDao');

/*
 * Method that allows Users to read top-level information for all owned Viewsites
 */
function viewsitesReadAll(request) {
  var promise = new Promise(function(resolve, reject) {
    if(!request.session.userId) {
      reject('User ID required!');
    } else {
      viewsites.find({'userId': request.session.userId})
      .select('-userId -__v -viewpages')
      .exec(function(error, results) {
        if(error) {
          console.log(error.message);
          reject('Something went wrong!');
        } else if(!results) {
          reject('No Viewsites found!');
        } else {
          resolve(results);
        }
      });
    }
  });
  return promise;
}

/*
 * Method that allows Users to read a Viewsite
 */
function viewsitesReadOne(request) {
  var promise = new Promise(function(resolve, reject) {
    if(!request.params.viewsiteName) {
      reject('Viewsite name is required!');
    } else {
      viewsites.findOne({'viewsiteName': request.params.viewsiteName})
      .select('-userId -__v')
      .exec(function(error, results) {
        if(error) {
          console.log(error.message);
          reject('Something went wrong!');
        } else if(!results) {
          reject('Viewsite not found!');
        } else {
          resolve(results);
        }
      });
    }
  });
  return promise;
}

/*
 * Method that allows Users to create Viewsites
 */
function viewsitesCreate(request) {
  var promise = new Promise(function(resolve, reject) {
    if(!request.body.viewsiteName) {
      reject('All fields required!');
    } else if(!request.session.userId) {
      reject('You must be logged in to create a Viewsite!');
    } else {
      viewsites.create({
        'userId': request.session.userId,
        'viewsiteName': request.body.viewsiteName,
        'loginEnabled': request.body.loginEnabled
      }, function(error, results) {
        if(error) {
          console.log(error.message);
          if(error.message === 'There was a duplicate key error') {
            reject('Viewsite already exists!');
          } else {
            reject('Something went wrong!');
          }
        } else {
          request.body.viewsiteId = results._id;
          userDatabasesDao.userDatabasesCreate(request)
          .then(function() {
            viewsitesReadAll(request)
            .then(function(results) {
              resolve(results);
            }, function(error) {
              console.log(error.message);
              reject('Something went wrong!');
            });
          }, function(error) {
            console.log(error.message);
            reject('Something went wrong!');
          });
        }
      });
    }
  });
  return promise;
}

/*
 * Method that allows Users to update Viewsites
 */
function viewsitesUpdate(request) {
  var promise = new Promise(function(resolve, reject) {
    if(!request.body.viewsiteId) {
      reject('Viewsite ID is required!');
    } else if(!request.session.userId) {
      reject('You must be logged in to update a viewsite!');
    } else {
      viewsites.findById(request.body.viewsiteId)
      .exec(function(error, viewsiteData) {
        if(error) {
          console.log(error.message);
          reject('Something went wrong!');
        } else if(!viewsiteData) {
          reject('Viewsite not found!');
        } else if(viewsiteData.userId != request.session.userId) {
          reject('You can only update Viewsites you own!');
        } else {
          viewsiteData.viewsiteName = request.body.viewsiteName;
          viewsiteData.loginEnabled = request.body.loginEnabled;
          viewsiteData.save(function(error, results) {
            if(error) {
              console.log(error.message);
              if(error.message === 'There was a duplicate key error') {
                reject('Viewsite already exists!');
              } else {
                reject('Something went wrong!');
              }
            } else {
              viewsitesReadAll(request)
              .then(function(results) {
                resolve(results);
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
 * Method that allows Users to delete Viewsites
 */
function viewsitesDelete(request) {
  var promise = new Promise(function(resolve, reject) {
    if(!request.body.viewsiteId) {
      reject('Viewsite ID is required!');
    } else if(!request.session.userId) {
      reject('You must be logged in to delete a viewsite!');
    } else {
      viewsites.findById(request.body.viewsiteId)
      .exec(function(error, viewsiteData) {
        if(error) {
          console.log(error.message);
          reject('Something went wrong!');
        } else if(!viewsiteData) {
          reject('Viewsite doesn\'t exist!');
        } else if(viewsiteData.userId != request.session.userId) {
          reject('You can only delete Viewsites you own!');
        } else {
          viewsites.findByIdAndRemove(request.body.viewsiteId)
          .exec(function(error, results) {
            if(error) {
              console.log(error.message);
              reject('Something went wrong!');
            } else {
              userDatabasesDao.userDatabasesDelete(request)
              .then(function() {
                viewsitesReadAll(request)
                .then(function(results) {
                  resolve(results);
                }, function(error) {
                  console.log(error.message);
                  reject('Something went wrong!');
                });
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
 * Method that allows the deletion of every Viewsite owned by a specific User
 * Invoked after deleting a User
 */
function viewsitesDeleteAll(request) {
  var promise = new Promise(function(resolve, reject) {
    if(!request.session.userId) {
      reject('User ID is required!');
    } else {
      viewsites.remove({"userId": request.session.userId})
      .exec(function(error, results) {
        if(error) {
          console.log(error.message);
          reject('Something went wrong!');
        } else {
          resolve('User\'s Viewsites successfully removed!');
        }
      });
    }
  });
  return promise;
}

// Export public methods
module.exports.viewsitesReadAll = viewsitesReadAll;
module.exports.viewsitesReadOne = viewsitesReadOne;
module.exports.viewsitesCreate = viewsitesCreate;
module.exports.viewsitesUpdate = viewsitesUpdate;
module.exports.viewsitesDelete = viewsitesDelete;
module.exports.viewsitesDeleteAll = viewsitesDeleteAll;
