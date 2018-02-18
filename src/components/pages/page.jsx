import "Components/pages/page.scss";

import React from 'react';
import Item from 'Components/item/item.jsx';
import BackgroundContainer from 'Components/shared/ui/background_container/background_container';
import AspectRatio from 'Components/shared/ui/aspect_ratio/aspect_ratio';
import BackgroundVideo from 'Components/shared/ui/background_container/background_video';

class Page extends React.Component{
  constructor(props) {
    super(props);
    //trace(props);
    this.state = {
      page: props.page,
      cls: 'hide',
      animate: props.animate,
      data: [],
      pos: -1,
      items: [],
      curVid: 0,
    };
    //
    //this.fixedPos=true;
    this.ti = -1;
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.animate != this.props.animate) {
      if(nextProps.animate) {
        this.startAnim();
      } else {
        this.stopAnim();
      }
    }
    //
    this.setState({
      page: nextProps.page,
      animate: nextProps.animate,
      curVid: 0,
    });
  }

  componentDidMount(){
    this.mounted = true;
    setTimeout(this.show.bind(this),33);
  }

  componentWillUnmount() {
    this.mounted = false;
    clearInterval(this.ti);
  }

  mixArray(arr) {
    if(true) {
      // override random - use given order
      return arr;
    }
    //
    var res = [];
    for(var i=0; i< arr.length; i++) {
      var obj = arr[i];
      var pos = Math.floor(Math.random() * res.length);
      res.splice(pos,0,obj);
    }
    return res;
  }

  hide() {
    this.mounted && this.setState({
      cls: 'hide',
    });
  }

  show() {
    this.mounted && this.setState({
      cls: 'show',
    });
  }

  startAnim() {
    //trace('start anim',this.state.page);
    this.mounted && this.setState({
      data: this.mixArray(this.state.page.data),
      pos: -1,
    });
    //
    this.stopAnim();
    var delay = this.props.settings[this.props.page.type+'_item_duration'] * 1000;
    this.ti = setInterval(this.changeItem.bind(this),delay);
    setTimeout(this.changeItem.bind(this),50);
  }

  stopAnim() {
    //trace('stop anim');
    clearInterval(this.ti);
  }

  changeItem() {
    //trace('change');
    if(this.props.paused) {
      return false;
    }
    if(this.state.data.length == 0) {
      setTimeout(this.changeItem.bind(this),50);
      return false;
    }
    //
    var pos = this.state.pos+1;
    //trace('data:',this.state.data);
    //trace('changeItem elem:',this.state.data[pos]);
    var obj = this.state.data[pos].activity;
    //
    var calc = this.getPositionCalc();
    //
    //trace('item-'+pos+'-'+xpos+'-'+ypos);
    var item = (
      <Item key={'item-'+pos+'-'+calc.xpos+'-'+calc.ypos} width={calc.width} height={calc.height} xpos={calc.xpos} ypos={calc.ypos} data={obj} actions={this.props.actions} hide={false}></Item>
    );
    //
    var items = this.state.items;
    items.push(item);
    this.mounted && this.setState({
      pos: pos,
      items: items,
    });
    //
    this.removePrevItem();
  }

  getPositionCalc() {
    // Item size: 426*461 (bg image: 584*593)
    var winSize = window.fatlady.utils.getWindowSize();
    var width = Math.round(winSize[0] * 0.222);
    var height = width / 426 * 461;
    var margin = Math.round(winSize[0] * 0.04);
    var xpos = Math.round(Math.random() * (winSize[0]-width-(margin*2))) + margin;
    var ypos = Math.round(Math.random() * (winSize[1]-height-(margin*2))) + margin;
    if(this.fixedPos) {
      xpos = 20;
      ypos = 20;
    }
    //
    var headerPos = window.fatlady.utils.getElementSize('header');
    //trace(headerPos);
    //trace(xpos, ypos, size);
    if(xpos+width > headerPos.x-20) {
      if(ypos < headerPos.y + headerPos.height + 20) {
        //trace(' --- POS FIX ---');
        ypos = headerPos.y + headerPos.height + 20;
      }
    }
    //
    return {
      winSize: winSize,
      width: width,
      height: height,
      margin: margin,
      xpos: xpos,
      ypos: ypos
    }
  }

  removePrevItem() {
    if(this.state.items.length>1) {
      var prevPos = this.state.pos-1;
      if(prevPos<0) {
        prevPos = this.state.data.length-1;
      }
      //
      var items = this.state.items;
      var prev = items[0];
      //trace('item-'+prevPos+'-'+prev.props.xpos+'-'+prev.props.ypos);
      var item = (
        <Item key={'item-'+prevPos+'-'+prev.props.xpos+'-'+prev.props.ypos} width={prev.props.width} height={prev.props.height} xpos={prev.props.xpos} ypos={prev.props.ypos} data={prev.props.obj} actions={prev.props.actions} hide={true}></Item>
      );
      items[0] = item;
      this.mounted && this.setState({
        items: items,
      });
      setTimeout(function(){
        var items = [this.state.items.pop()];
        this.mounted && this.setState({
          items: items,
        });
      }.bind(this),1000);
    }
  }

  videoEnd() {
    if(this.state.page.videos.length>1) {
      var curVid = this.state.curVid+1;
      if(curVid > this.state.page.videos.length-1) {
        curVid = 0;
      }
      //trace('curVid',curVid);
      this.mounted && this.setState({
        curVid: curVid,
      });
    }
  }

  render() {
    var videos = '';
    //trace('page',JSON.stringify(this.state.page));
    var bgImage = this.state.page.images[0];
    if(this.state.page.videos.length>0) {
      bgImage = '';
      var videoArr = [];
      for(var i=0; i<this.state.page.videos.length; i++) {
        var poster = this.state.page.images[i];
        if(!poster) {
          poster = this.state.page.images[0];
        }
        poster = '';
        var video = (
          <BackgroundVideo key={'vid-'+i} src={this.state.page.videos[i]} poster={poster} loop={this.state.page.videos.length<2} onEnd={this.videoEnd.bind(this)} muted={true} autoplay={false} play={i==this.state.curVid} data-play={i==this.state.curVid}></BackgroundVideo>
        );
        videoArr.push(video);
      }
      videos = (
        <BackgroundContainer>
          <AspectRatio width={1920} height={1080}>
            {videoArr}
          </AspectRatio>
        </BackgroundContainer>
      );
    }
    //
    return (
      <div className={"page "+this.state.cls}>
        <div className={"page-bg "+(this.state.items.length>0 ? 'blur' : '')} style={{backgroundImage:"url('"+bgImage+"')"}}>
          {videos}
        </div>
        <div className="page-items">
          {this.state.items}
        </div>
      </div>
    );
  }
}

export default Page;