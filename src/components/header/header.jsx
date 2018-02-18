import "Components/header/header.scss";

import React from 'react';

class Header extends React.Component{
  constructor(props) {
    super(props);

    var now = new Date();
    var time = this.digits(now.getHours()) + ':' + this.digits(now.getMinutes());
    //
    var flag = null;
    var name = null;
    if(props.type == 'territory') {
      name = props.name;
      flag = 'data/locations/'+this.slug(props.name)+'.png';
    } else if(props.type == 'vertical') {
      name = props.name;
      flag = 'data/verticals/'+this.slug(props.name)+'.png';
    }
    this.state = {
      time: time,
      flag: flag,
      name: name,
    };
  }

  slug(name) {
    return name.split(' ').join('-').split('&').join('and').toLowerCase();
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.type != this.props.type || nextProps.name != this.props.name) {
      // change
      var flag = null;
      if(nextProps.type == 'territory') {
        flag = 'data/locations/'+this.slug(nextProps.name)+'.png';
      } else if(nextProps.type == 'vertical') {
        flag = 'data/verticals/'+this.slug(nextProps.name)+'.png';
      }
      this.setState({
        name: nextProps.name,
        flag: flag,
      });
    }
  }

  componentDidMount(){
    this.mounted = true;
    this.ti = setInterval(this.onTimeTick.bind(this),5000);
  }

  componentWillUnmount(){
    this.mounted = false;
    clearInterval(this.ti);
  }

  onTimeTick() {
    var now = new Date();
    var time = this.digits(now.getHours()) + ':' + this.digits(now.getMinutes());
    this.mounted && this.setState({
      time: time,
    });
  }

  digits(num) {
    var str = num.toString();
    if(num<10) {
      str = '0'+num.toString();
    }
    return str;
  }

  render() {
    var flg = '';
    if(this.state.flag) {
      flg = (
        <div className="flag">
          <span className="flag-img" style={{backgroundImage:'url('+this.state.flag+')'}}></span>
          <span className="flag-name">{this.state.name}</span>
        </div>
      );
    }
    //
    var clock = (
        <div className="clock">
          <span className="clock-icon"></span>
          <span className="clock-time">{this.state.time}</span>
        </div>
      );
    if(this.props.time) {
      clock = (
        <div className="clock">
          <span className="clock-time centered">{this.props.time}</span>
        </div>
      );
    }
    if(this.props.icon) {
      clock = (
        <div className="clock">
          <span className="clock-time clock-live-icon centered"></span>
        </div>
      );
    }
    //
    return (
      <header id="header" className={this.props.type}>
        <div className="header-bg"></div>
        {clock}
        {flg}
      </header>
    );
  }
}

export default Header;