window.fatlady['scriptLoader'] = {

  /////////////////////////////////////////////////////////
  // SCRIPTS
  scripts: {
    GOOGLE_MAPS: {
      url: 'http://maps.googleapis.com/maps/api/js?key=AIzaSyBZ2wlP1d30z5Qo9nKiHNp6XZhk_pqKFns&sensor=false&language=en',
      obj: 'google',
      css: null,
      depends: [],
      loaders: []
    },
  },

  called: [],
  loaded: [],

  /////////////////////////////////////////////////////////
  // HELPERS
  loadScript: function(type) {
    return new Promise(function(resolve, reject){
    	if(window.fatlady.scriptLoader.called.indexOf(type)>=0) {
    		// already called
    		if(window.fatlady.scriptLoader.loaded.indexOf(type)>=0) {
    			// already loaded
    			resolve();
    		} else {
          // add to loaders list
    			window.fatlady.scriptLoader.scripts[type].loaders.push(resolve);
    		}
    	} else {
    		// call first time only
        // check dependancies
        if(window.fatlady.scriptLoader.scripts[type].depends && window.fatlady.scriptLoader.scripts[type].depends.length>0) {
          for(var i=0; i< window.fatlady.scriptLoader.scripts[type].depends.length; i++) {
            var depend = window.fatlady.scriptLoader.scripts[type].depends[i];
            window.fatlady.scriptLoader.loadScript(depend);
          }
        }
        //
        // do load
        window.fatlady.scriptLoader.reloadScript(type, resolve, reject);
    	}
    });
  },

  reloadScript: function(type, resolve, reject) {
    // check dependancies first - if all loaded then load this type
    if(window.fatlady.scriptLoader.scripts[type].depends && window.fatlady.scriptLoader.scripts[type].depends.length>0) {
      for(var i=0; i< window.fatlady.scriptLoader.scripts[type].depends.length; i++) {
        var depend = window.fatlady.scriptLoader.scripts[type].depends[i];
        if(window.fatlady.scriptLoader.loaded.indexOf(depend)<0) {
          //trace('depend delay',depend);
          setTimeout(function(){
            window.fatlady.scriptLoader.reloadScript(type, resolve, reject);
          },33);
          return false;
        }
      }
    }
    //trace('load',type);
    window.fatlady.scriptLoader.called.push(type);
    var js = document.createElement("script");
    js.type = "text/javascript";
    js.async = "async";
    js.id = "js-"+window.fatlady.scriptLoader.scripts[type].obj;
    js.defer = "defer"
    js.onload = function(e) {
      window.fatlady.scriptLoader.activateScript(type, resolve, reject);
    }
    js.src = window.fatlady.scriptLoader.scripts[type].url;
    document.getElementsByTagName('head')[0].appendChild(js);
    //
    if(window.fatlady.scriptLoader.scripts[type].css) {
      var link  = document.createElement('link');
      link.id = "css-"+window.fatlady.scriptLoader.scripts[type].obj;
      link.rel  = 'stylesheet';
      link.type = 'text/css';
      link.href = window.fatlady.scriptLoader.scripts[type].css;
      link.media = 'all';
      document.getElementsByTagName('head')[0].appendChild(link);
    }
  },

  activateScript: function(type, resolve, reject) {
    // check dependancies first - if all loaded then call listeners and resolve
    if(window.fatlady.scriptLoader.scripts[type].depends && window.fatlady.scriptLoader.scripts[type].depends.length>0) {
      for(var i=0; i< window.fatlady.scriptLoader.scripts[type].depends.length; i++) {
        var depend = window.fatlady.scriptLoader.scripts[type].depends[i];
        if(window.fatlady.scriptLoader.loaded.indexOf(depend)<0) {
          setTimeout(function(){
            window.fatlady.scriptLoader.activateScript(type, resolve, reject);
          },33);
          return false;
        }
      }
    }
    //trace('activate',type);
    //
    window.fatlady.scriptLoader.loaded.push(type);
    if(window.fatlady.scriptLoader.scripts[type].loaders.length>0) {
      //trace('has more loaders -> resolve');
      for(var i=0; i<window.fatlady.scriptLoader.scripts[type].loaders.length; i++) {
        window.fatlady.scriptLoader.scripts[type].loaders[i]();
      }
    }
    resolve();
  },

  /////////////////////////////////////////////////////////
  // API
  loadGoogleMaps: function() {
    return new Promise(function(resolve, reject){
      window.fatlady.scriptLoader.loadScript('GOOGLE_MAPS').then(function(){
        resolve();
      });
    });
  },

}
