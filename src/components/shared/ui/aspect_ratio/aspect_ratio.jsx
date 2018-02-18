import "Components/shared/ui/aspect_ratio/aspect_ratio.scss";

import React from 'react';

class AspectRatio extends React.Component{
  constructor(props) {
    super(props);

    this.state = {
      ratio: 100
    }
  }

  componentDidMount() {
    this.setAspectRatio(this.props.width,this.props.height);
  }

  componentWillReceiveProps(nextProps) {
    this.setAspectRatio(nextProps.width,nextProps.height);
  }

  setAspectRatio(ww,hh) {
    var ratio = Math.round(10000*hh/ww)/100;
    this.setState({
      ratio: ratio
    });
  }

  render() {
    //trace(this.state.ration);
    return (
      <div className="aspect-ratio-wrapper" style={{paddingTop:this.state.ratio+'%'}}>
        <div className="aspect-ratio-inner">
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default AspectRatio;