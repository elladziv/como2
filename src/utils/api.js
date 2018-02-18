window.fatlady['api'] = {

  /////////////////////////////////////////////////////////
  // PATHS
  paths: {
    GET_VERTICALS: 'http://34.251.92.188:8000/verticals',
    GET_LOCATIONS: 'http://34.251.92.188:8000/locations',
    GET_TERRITORIES: 'http://34.251.92.188:8000/territories',
    GET_ACTIVITIES: 'http://34.251.92.188:8000/activities',
    GET_PAGES: './data/data.json',
  },

  /////////////////////////////////////////////////////////
  // HELPERS
  _post(path, data = null){
    return new Promise(function(resolve, reject){
      var xhr = new XMLHttpRequest();
      xhr.open('POST', path);
      xhr.setRequestHeader('Content-type', "application/json; charset=utf-8");
      xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      xhr.onload = function(){
        if (xhr.status === 200 || xhr.status === 201) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          window.fatlady.api._onError(xhr);
          reject();
        }
      };
      xhr.send(JSON.stringify(data));
    })
  },

  _get(path){
    return new Promise(function(resolve, reject){
      var xhr = new XMLHttpRequest();
      xhr.open('GET', path);
      xhr.setRequestHeader('Content-type', "application/json; charset=utf-8");
      //xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      xhr.onload = function(){
        if (xhr.status === 200 || xhr.status === 201) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          window.fatlady.api._onError(xhr);
          reject();
        }
      };
      xhr.send();
    })
  },

  _multipart(path, file, params, progressFunc){
    return new Promise(function(resolve, reject){
      if(file){
        var xhrData = new FormData();
        xhrData.append('file', file, file.name);
        xhrData.append('file_size', file.size);
        if(typeof params == 'object') {
          for(var key in params) {
            xhrData.append(key, params[key]);
          }
        }
        //
        var xhr = new XMLHttpRequest();
        xhr.open('POST', path, true);
        xhr.upload.addEventListener('progress',progressFunc);
        xhr.onload = function(){
          if(xhr.status === 200 || xhr.status === 201) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            window.fatlady.api._onError(xhr);
            reject();
          }
        };
        xhr.send(xhrData);
      } else {
        reject();
      }
    })
  },

  _onError(xhr) {
    console.error(xhr);
  },

  /////////////////////////////////////////////////////////
  // METHODS
  getVerticals() {
    return window.fatlady.api._get(window.fatlady.api.paths.GET_VERTICALS);
  },

  getLocations() {
    return window.fatlady.api._get(window.fatlady.api.paths.GET_LOCATIONS);
  },

  getTerritories() {
    return window.fatlady.api._get(window.fatlady.api.paths.GET_TERRITORIES);
  },

  getActivities(type,name) {
    var url = window.fatlady.api.paths.GET_ACTIVITIES + '?' + type + '=' + escape(name);
    return window.fatlady.api._get(url);
  },

  getPages() {
    return window.fatlady.api._get(window.fatlady.api.paths.GET_PAGES);
  },

};
