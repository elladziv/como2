import "Components/item/item.scss";

import React from 'react';

class Item extends React.Component{
  constructor(props) {
    super(props);

    if(!props.data) {
      return false;
    }
    //
    var fname = props.data.first_name;
    if(fname.indexOf(' ')>-1) {
      fname = fname.split(' ');
      if(fname.length>2) {
        fname = fname[0] + ' ' + fname[1];
      } else {
        fname = fname.join(' ');
      }
    }
    if(fname.toLowerCase() == 'general') {
      fname = 'A customer';
    }
    //
    var title = props.actions[props.data.operation] || '';
    title = title.replace('[name]',fname);
    //
    this.state = {
      data: props.data,
      cls: 'hide',
      title: title,
      date: this.calcTime(props.data),
    };
    //trace(JSON.stringify(props.data));
  }

  calcTime(data) {
    //trace(data.timestamp);
    var eventDate = new Date(data.timestamp);
    //trace(eventDate);
    var now = new Date();
    var diff = now.getTime() - eventDate.getTime();
    var mins = diff / 1000 / 60;
    var str = Math.round(mins) + ' minutes ago';
    if(mins==1) {
      str = str.replace('minutes','minute');
    } else if(mins > 60) {
      /*var hours = mins / 60;
      str = Math.round(hours) + ' hours ago';
      if(hours==1) {
        str = str.replace('hours','hour');
      }*/
      str = 'earlier today';
    }
    //trace(str);
    return str;
  }

  componentWillReceiveProps(nextProps) {
    if(!this.props.hide && nextProps.hide) {
      this.hide();
    }
  }

  componentDidMount(){
    this.mounted = true;
    setTimeout(this.show.bind(this),33);
  }

  componentWillUnmount() {
    this.mounted = false;
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

  render() {
    return (
      <div className={"item "+this.state.cls} style={{width:this.props.width+'px', height:this.props.height+'px', left:this.props.xpos+'px', top:this.props.ypos+'px'}}>
        <div className="item-bg"></div>
        <div className="item-data">
          <div className="item-title">{this.state.data.business_name}</div>
          <div className="item-icon" style={{backgroundImage:'url(data/logos/'+this.state.data.locationid+'.png)'}}></div>
          <div className="item-info">
            <div className="action">
              <img src={"data/actions/"+this.state.data.operation+".png"} alt={this.state.data.operation} />
            </div>
            <h3>{this.state.title}&nbsp;{this.state.date}</h3>
          </div>
        </div>
      </div>
    );
  }
}

export default Item;