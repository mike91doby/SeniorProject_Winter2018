// Service for interacting with API
import axios from 'axios';

class ViewsiteService {
  // Read one
  readOneViewsite(requestData) {
    return axios({
      url: '/read_one/viewsites' + requestData.viewsiteName,
      method: 'get',
      baseURL: 'http://159.203.105.123:3000/api/v1/'
    });
  }
}

export default ViewsiteService;
