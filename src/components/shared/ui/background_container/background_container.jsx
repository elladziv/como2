import "Components/shared/ui/background_container/background_container.scss";

import React from 'react';

class BackgroundContainer extends React.Component{
  constructor(props) {
    super(props);
    this.ww = 0;
    this.ih = 0;
  }

  componentDidMount() {
    this.resize();

    window.addEventListener('resize',this.onWindowResize.bind(this));
  }

  componentDidUpdate() {
    this.resize();
  }

  onWindowResize(e) {
    this.resize();
  }

  resize() {
    var wrapperW = this.wrapper.offsetWidth;
    var wrapperH = this.wrapper.offsetHeight;
    var innerW = this.inner.offsetWidth;
    var innerH = this.inner.offsetHeight;
    //
    if(this.ww != wrapperW || this.ih != innerH) {
      this.ww = wrapperW;
      this.ih = innerH;
      //
      //trace(this.wrapper,wrapperW,wrapperH);
      //trace(this.inner,innerW,innerH);
      //
      if(innerW > wrapperW) {
        this.inner.style.width = '100%';
      }
      setTimeout(function(){
        innerW = this.inner.offsetWidth;
        innerH = this.inner.offsetHeight;
        if(innerH < wrapperH-1) {
          var w = Math.round(10000*wrapperH/innerH)/100;
          this.inner.style.width = w+'%';
        }
      }.bind(this),1);
    }
  }

  render() {
    return (
      <div className="bg-wrapper" ref={(elem) => {this.wrapper = elem}}>
        <div className="bg-inner" ref={(elem) => {this.inner = elem}}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default BackgroundContainer;