require('Styles/app.scss');

var React = require('react');
var ReactDOM = require('react-dom');

import Header from 'Components/header/header';
import Page from 'Components/pages/page';

// EXTRA
window.fatlady = {
  params: {
    env: 'prod',
  },
};
require('Utils/utils.js');

// REACT
class App extends React.Component{
  constructor() {
    super();
    this.state = {
      data: [],
      pages: [],
      prevPos: -1,
      prevType: '',
      prevName: '',
      prevObj: null,
      prevAnim: false,
      curPos: -1,
      curType: '',
      curName: '',
      curObj: null,
      curAnim: false,
      paused: false,
    };
    this.data = [];

    this.reloading=true;
    this.loading=false;
    this.pageTI = -1;
  }

  componentDidMount() {
    //trace('Get Pages');
    window.fatlady.api.getPages().then(function(res){
      this.setState({
        pages: res.pages,
        settings: res.settings,
        actions: res.actions,
      });
      trace('pages:',res.pages);
      //
      this.reloadData();
    }.bind(this));

    window.addEventListener('keyup',this.onKeyUp.bind(this));
  }

  onKeyUp(e) {
    if(!this.loading && !this.reloading) {
      if(e.keyCode == 37) {
        this.movePage(-1);
      } else if(e.keyCode == 39) {
        this.movePage(1);
      } else if(e.keyCode == 32) {
        trace('Paused: '+(!this.state.paused));
        this.setState({paused: !this.state.paused});
      }
    }
  }

  reloadData(){
    trace('reload all');
    this.reloading=true;
    //trace('Get Verticals');
    window.fatlady.api.getVerticals().then(function(res){
      res = JSON.parse(res);
      trace('verticals',res);
      //this.data.verticals = res.result;
      this.mixData('vertical',res.result);
      //trace('Get Territories');
      window.fatlady.api.getTerritories().then(function(res){
        res = JSON.parse(res);
        trace('territories',res);
        //this.data.territories = res.result;
        this.mixData('territory',res.result);
        this.setState({
          data: this.data,
          prevPos: -1,
          prevType: '',
          prevName: '',
          prevObj: null,
          prevAnim: false,
          curPos: -1,
          curType: '',
          curName: '',
          curObj: null,
          curAnim: false,
        });
        this.reloading=false;
        this.nextPage();
      }.bind(this));
    }.bind(this));
  }

  mixData(type, arr) {
    var only = ['Health & Beauty','Bars & Pubs','United States','South Africa'];
    for(var i=0; i< arr.length; i++) {
      var obj = {type: type, name: arr[i]};
      var pos = Math.floor(Math.random() * this.data.length);
      //pos = this.data.length; // - reset to default order
      if(typeof only == 'undefined' || (typeof only != 'undefined' && only.indexOf(arr[i])>-1)) {
        this.data.splice(pos,0,obj);
      }
    }
    //trace(this.data);
  }

  loadCurrentData(pos) {
    if(this.loading || this.reloading) {
      trace('don\'t reload');
      return false;
    }
    //
    var pos = pos;
    if(pos>=0 && pos<this.state.data.length) {
      var obj = this.state.data[pos];
      //trace(obj);
      if(obj.data) {
        // already loaded activities
        //trace('Display existing activities for: '+obj.type+': '+obj.name);
        this.setState({
          prevPos: this.state.curPos,
          prevType: this.state.curType,
          prevName: this.state.curName,
          prevObj: this.state.curObj,
          prevAnim: false,
          curPos: pos,
          curType: obj.type,
          curName: obj.name,
          curObj: obj,
          curAnim: false,
        });
        //
        var delay = this.state.settings.vertical_duration;
        if(obj.type == 'territory') {
          delay = this.state.settings.territory_duration;
        }
        // hide prev page
        setTimeout(this.clearPrev.bind(this),2000);
        // load next vertical/location
        if(this.pageTI == -1) {
          this.pageTI = setTimeout(function(){
            this.pageTI = -1;
            this.nextPage();
          }.bind(this),delay*1000);
        }
      } else {
        // load activities
        this.loading=true;
        //trace('Get Activities for '+obj.type+': '+obj.name);
        this.apiStart = new Date();
        window.fatlady.api.getActivities(obj.type, obj.name).then(function(res){
          this.apiEnd = new Date();
          var diff = this.apiEnd.getTime() - this.apiStart.getTime();
          diff = diff/1000;
          //trace('API call duration: '+diff+' sec.');
          this.loading=false;
          //
          res = JSON.parse(res);
          //trace('activities',res);
          if(res.status && res.status=='error') {
            trace('ERROR',res.message);
          }
          //trace('Got '+res.result.length+' activities');
          //
          // reorder
          var lastBusiness = null;
          var arr = res.result;
          var sameCount = 0;
          //trace('before:',JSON.parse(JSON.stringify(res.result)));
          for(var i=0; i<arr.length; i++) {
            var rr = arr[i];
            if(typeof rr.checked == 'undefined') {
              rr.checked = 0;
            }
            //
            if(lastBusiness && rr.activity.business_name==lastBusiness && rr.checked<3) {
              // move to end
              sameCount++;
              rr.checked++;
              arr.splice(i,1);
              arr.push(rr);
              i--;
            } else {
              arr[i].checked = rr.checked;
              lastBusiness = rr.activity.business_name;
            }
          }
          //trace('same: '+sameCount);
          //trace('after',arr);
          //
          // set page
          if(arr.length == 0) {
            // next...
            trace('skip empty results');
            this.loadCurrentData(pos+1);
          } else {
            var obj = this.state.data[pos];
            var page = this.getPage(obj.type, obj.name);
            //trace(obj,page);
            if(!page) {
              this.removePage(obj.type, obj.name);
              this.nextPage();
              return false;
            }
            obj.images = page.images;
            obj.videos = page.videos;
            obj.data = arr;
            this.data[pos] = obj;
            //trace(obj);
            this.setState({
              data: this.data,
              prevPos: this.state.curPos,
              prevType: this.state.curType,
              prevName: this.state.curName,
              prevObj: this.state.curObj,
              prevAnim: false,
              curPos: pos,
              curType: obj.type,
              curName: obj.name,
              curObj: obj,
              curAnim: false,
            });
            //
            var delay = this.state.settings.vertical_duration;
            if(obj.type == 'territory') {
              delay = this.state.settings.territory_duration;
            }
            // hide prev page
            setTimeout(this.clearPrev.bind(this),2000);
            // load next vertical/location
            if(this.pageTI == -1) {
              this.pageTI = setTimeout(function(){
                this.pageTI = -1;
                this.nextPage();
              }.bind(this),delay*1000);
            }
          }
        }.bind(this));
      }
    }
  }

  clearPrev() {
    this.setState({
      prevPos: -1,
      prevType: '',
      prevName: '',
      prevObj: null,
      prevAnim: false,
    });
    this.animateCurPage();
  }

  nextPage() {
    if(this.state.paused) {
      return false;
    }
    this.movePage(1);
  }

  movePage(dir) {
    var pos = this.state.curPos;
    pos += dir;
    if(pos > this.state.data.length-1) {
      // reload on loop
      this.reloadData();
      return false;
      //pos = 0;
    } else if(pos < 0) {
      pos = this.state.data.length-1;
    }
    //trace('next:',pos,this.state.data,this.state.pages);
    //
    setTimeout(function(){
      this.loadCurrentData(pos);
    }.bind(this), 33);
  }

  animateCurPage() {
    this.setState({
      curAnim: true,
    });
  }

  removePage(type, name) {
    //trace('REMOVE: '+type+' - '+name+' at pos: '+this.state.curPos);
    var data = this.state.data;
    for(var i=0; i<data.length; i++) {
      var p = data[i];
      if(p.type == type && p.name == name) {
        data.splice(i,1);
        //trace('NEW DATA:',data);
        this.setState({
          data: data,
        });
        return true;
      }
    }
    return false;
  }

  getPage(type, name) {
    //trace('get page:',type,name);
    for(var i=0; i<this.state.pages.length; i++) {
      var page = this.state.pages[i];
      if(page.type == type && page.name == name) {
        return page;
      }
    }
    return null;
  }

  render() {
    if(this.state.curType) {
      var pages = [];
      if(this.state.prevPos>-1 && this.state.prevType && this.state.prevObj) {
        pages.push(<Page key={'page'+this.state.prevPos} page={this.state.prevObj} settings={this.state.settings} actions={this.state.actions} animate={this.state.prevAnim} paused={this.state.paused}></Page>);
      }
      if(this.state.curPos>-1 && this.state.curType && this.state.curObj) {
        pages.push(<Page key={'page'+this.state.curPos} page={this.state.curObj} settings={this.state.settings} actions={this.state.actions} animate={this.state.curAnim} paused={this.state.paused}></Page>);
      }
      return (
        <div className="app">
          <Header type={this.state.curType} name={this.state.curName} time={""} icon={true}></Header>
          <div className="pages">
            {pages}
          </div>
          <footer>
            <div className="como-logo"></div>
          </footer>
        </div>
      );
    }
    //
    return (
        <div className="app"></div>
    );
  }
}

ReactDOM.render(
  <App/>, document.getElementById('app')
);