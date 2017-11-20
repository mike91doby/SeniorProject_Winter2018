// Service for interacting with API
import axios from 'axios';

class UserService {
  // Read one
  readOneUser(requestData) {
    return axios({
      url: '/read_one/users',
      method: 'post',
      baseURL: 'http://159.203.105.123:3000/api/v1/',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        'username': requestData.username,
        'password': requestData.password
      }
    });
  }

  // Create
  createUser(requestData) {
    return axios({
      url: '/create/users',
      method: 'post',
      baseURL: 'http://159.203.105.123:3000/api/v1/',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        'username': requestData.username,
        'password': requestData.password
      }
    });
  }

  // Update
  updateUser(requestData) {
    return axios({
      url: '/update/users/' + requestData.userId,
      method: 'put',
      baseURL: 'http://159.203.105.123:3000/api/v1/',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        'username': requestData.username,
        'password': requestData.password
      }
    });
  }

  // Delete
  deleteUser(requestData) {
    return axios({
      url: '/delete/users/' + requestData.userId,
      method: 'delete',
      baseURL: 'http://159.203.105.123:3000/api/v1/',
    });
  }

  // Exists
  existsUser(requestData) {
    return axios({
      url: '/exists/users/' + requestData.username,
      method: 'get',
      baseURL: 'http://159.203.105.123:3000/api/v1/'
    });
  }
}

export default UserService;