import 'Components/shared/ui/tooltip/tooltip.scss';
import React from 'react';

class ToolTip extends React.Component{
  constructor(props){
    super(props);
  }

  render() {
    var cls = "fl-tooltip";
    cls += this.props.block ? ' block' : '';
    cls += this.props.pos ? ' pos-'+this.props.pos : ' pos-bottom';
    cls += this.props.align ? ' align-'+this.props.align : ' align-center';
    var style = {};
    if(this.props.width) {
      style = {width:this.props.width};
    }
    //
    var tip = '';
    tip = (
      <div className="fl-tooltip-tip"></div>
    );
    //
    // Layer
    var layer = '';
    var title = this.props.title ? (<h4>{this.props.title}</h4>) : '';
    var text = this.props.text ? (<p>{this.props.text}</p>) : '';
    var html = this.props.html ? (<div className="tooltip-children">{this.props.html}</div>) : '';
    layer = (
      <div className="fl-tooltip-layer" style={style}>
        {title}
        {text}
        {html}
      </div>
    );
    //
    return (
      <span
        className={cls + (this.props.addCls ? ' ' + this.props.addCls : '')}
        style={this.props.addStyle ? this.props.addStyle : {}}
        >
        <div className="fl-tooltip-container">
          {layer}
          {tip}
        </div>
        {this.props.children}
      </span>
    );
  }
}

export default ToolTip;