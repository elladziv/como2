// TRACE
if(typeof trace == 'undefined') {
  window['trace'] = function() {
    if(window.fatlady.params.env == 'production') {
      return false;
    }
    console.log(arguments);
  }
}

// Different Utils
require('Utils/api.js');
require('Utils/document.js');
require('Utils/event_dispatcher.js');
require('Utils/ie_promise.js');
require('Utils/script_loader.js');

// Other Utils
window.fatlady['utils'] = {
  // DATES
  createDateAsUTC :function(date) {
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));
  },
  convertDateToUTC: function(date) {
    return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
  },
  formatDate: function(date, format) {
    if(!date) {
      return '';
    } else if(isNaN(date.getTime())) {
      return '';
    }
    var digits = window.sp.helpers.digits;
    var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    //
    format = format || 'MMM dd, yyyy';
    var val = format;
    val = val.replace('yyyy',date.getFullYear()); // yyyy - Full year (2017)
    val = val.replace('yy',date.getYear()); // yy - Year (17)
    val = val.replace('MMMM',months[date.getMonth()]); // MMMM - Month Name (January)
    val = val.replace('MMM',months[date.getMonth()].toString().substring(0,3)); // MMM - Month Short Name (Jan)
    val = val.replace('MM',digits(date.getMonth()+1)); // MM - Month (01)
    val = val.replace('dddd',days[date.getDay()]); // dddd - Day Name (Sunday)
    val = val.replace('ddd',days[date.getDay()].toString().substring(0,3)); // ddd - Day Short Name (Sun)
    val = val.replace('dd',digits(date.getDate())); // dd - Date (01)
    //
    val = val.replace('hh',digits(date.getHours())); // hh - Hours (01)
    val = val.replace('mm',digits(date.getMinutes())); // mm - Minutes (01)
    val = val.replace('ss',digits(date.getSeconds())); // ss - Seconds (01)
    //
    return val;
  },
  digits: function(num) {
    var str = num.toString();
    if(num<10) {
      str = '0'+str;
    }
    return str;
  },
  reverseDate: function(dateStr) {
    /* TODO - fix this in server-side, and remove this patch! */
    var tmpArr = dateStr.split('-');
    if(tmpArr.length == 3) {
        return dateStr;
    }
    dateStr = dateStr.toString().replace(',',' ');
    dateStr = dateStr.replace('  ',' ');
    var arr = dateStr.split(' ');
    var months = 'January,February,March,April,May,June,July,August,September,October,November,December'.split(',');
    var month = months.indexOf(arr[0])+1;
    var digits = window.sp.helpers.digits;
    var dateStr = arr[2] + '-' + digits(month) + '-' + digits(arr[1]);
    return dateStr;
  },
  isNumeric: function(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  },

  // FILES
  getFileSize: function(bytes) {
    if(!bytes) {
      return ""
    }
    var fs = bytes;
    var w = 'b';
    if(fs > 1024) {
      fs = Math.round(fs/1024);
      w = 'kb';
      if(fs > 1024) {
        fs = Math.round(fs/1024);
        w = 'mb';
        if(fs > 1024) {
          fs = Math.round(fs/1024);
          w = 'gb';
        }
      }
    }
    return fs.toString()+w;
  },

  // PAGE / DOM
  scrollTo: function(ypos) {
    document.body.scrollTop = ypos;
  },
  scrollMove: function(ydis) {
    var ypos = document.body.scrollTop +  ydis;
    window.sp.helpers.scrollTo(ypos);
  },
  scrollToElementId: function(id) {
    var elem = document.getElementById(id);
    var ypos = elem.offsetTop;
    window.sp.helpers.scrollTo(ypos);
  },

  // GENERAL
  isMobile: function() {
    return window.innerWidth < 768;
  },

  getWindowSize: function() {
    var w=window,
    d=document,
    e=d.documentElement,
    g=d.getElementsByTagName('body')[0],
    x=w.innerWidth||e.clientWidth||g.clientWidth,
    y=w.innerHeight||e.clientHeight||g.clientHeight;
    return [x,y];
  },

  getElementSize: function(id) {
    var elem = document.getElementById(id);
    if(!elem) {
      return null;
    }
    return {
      x: elem.offsetLeft,
      y: elem.offsetTop,
      width: elem.clientWidth,
      height: elem.clientHeight
    }
  },

  // IMAGE LOADING
  lazyLoader: {
    images: [],
    isLoading: false,
    addImage: function(url, cb) {
      var _this = window.sp.helpers.lazyLoader;
      if(typeof url == 'string') {
        _this.images.push({url:url, cb:cb});
      } else if(typeof url == 'object' && url.length>0) {
        for(var i=0; i<url.length; i++) {
          _this.images.push({url:url[i], cb:cb});
        }
      }
      _this.startLoading();
    },
    startLoading: function() {
      var _this = window.sp.helpers.lazyLoader;
      if(!_this.isLoading) {
        _this.loadNext();
      }
    },
    loadNext: function() {
      var _this = window.sp.helpers.lazyLoader;
      if(_this.images.length> 0) {
        _this.isLoading = true;
        var url = _this.images[0].url;
        //
        var img = new Image();
        img.onload = function(){
          var _this = window.sp.helpers.lazyLoader;
          _this.onLoaded(this);
        };
        img.src = url;
        //trace('load next image',url);
      } else {
        _this.isLoading = false;
      }
    },
    onLoaded: function(img) {
      var _this = window.sp.helpers.lazyLoader;
      if(typeof _this.images[0].cb == 'function') {
        _this.images[0].cb(_this.images[0].url);
      }
      _this.images.splice(0,1);
      img.remove();
      //
      _this.loadNext();
    }
  },
}