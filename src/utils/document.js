window.fatlady['document'] = {
  _readyListeners: [],
  _scrollListeners: [],
  _resizeListeners: [],

  documentListener: function(event, func) {
    this.event = event;
    this.function = func;
  },

  initListeners: function(){
    // listener functions
    window.fatlady.ready = function(f) {
      if(typeof f == 'function') {
        window.fatlady.document._readyListeners.push(f);
      }
    }
    window.fatlady.resize = function(f) {
      if(typeof f == 'function') {
        window.fatlady.document._resizeListeners.push(f);
      }
    }
    window.fatlady.scroll = function(f) {
      if(typeof f == 'function') {
        window.fatlady.document._scrollListeners.push(f);
      }
    }

    // event listeners
    document.addEventListener('DOMContentLoaded',function(e){
      //trace('ready');
      window.fatlady.document.onReady();
    });

    window.addEventListener('resize',function(e){
      //trace('resize');
      window.fatlady.document.onResize();
    });

    window.addEventListener('scroll',function(e){
      //trace('scroll');
      window.fatlady.document.onScroll();
    });
  },

  onReady: function() {
    // run 'ready' functions from array
    if(window.fatlady.document._readyListeners.length>0) {
      for(var i=0; i<window.fatlady.document._readyListeners.length; i++) {
        window.fatlady.document._readyListeners[i]();
      }
      window.fatlady.document._readyListeners = [];
    }
    // replace fatlady.ready() function
    window.fatlady.ready = function(f) {
      if(typeof f == 'function') {
        f();
      }
    }
    // init run of resize and scroll
    window.fatlady.document.onResize();
    window.fatlady.document.onScroll();
  },

  onResize: function() {
    // run 'resize' functions from array
    if(window.fatlady.document._resizeListeners.length>0) {
      for(var i=0; i<window.fatlady.document._resizeListeners.length; i++) {
        window.fatlady.document._resizeListeners[i]();
      }
    }
  },

  onScroll: function() {
    var scrollTop = document.body.scrollTop || document.scrollTop || 0;
    // run 'scroll' functions from array
    if(window.fatlady.document._scrollListeners.length>0) {
      for(var i=0; i<window.fatlady.document._scrollListeners.length; i++) {
        window.fatlady.document._scrollListeners[i](scrollTop);
      }
    }
  }
};
window.fatlady.document.initListeners();