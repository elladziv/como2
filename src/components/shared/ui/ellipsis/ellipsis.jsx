import 'Components/shared/ui/ellipsis/ellipsis.scss';
import React from 'react';

class Ellipsis extends React.Component{
    constructor(props) {
        super(props);
        // PROPERTIES:
        // redraw: redraw ellipsis on windw resize
        // rows: fixed number of rows limit
        // height: fixed height of div limit
        // cutWord: allow cutting of words (default:false)
        //
        this.state = {
            text: this.props.children.toString(),
        }
        //
        // TODO - on resize
    }

    componentDidMount() {
        this.redraw();
    }

    componentWillReceiveProps(nextProps) {
        if(!this.props.redraw && nextProps.redraw) {
            this.redraw();
        }
    }

    onResize() {
        if(this.props.redraw) {
            this.redraw();
        }
    }

    getStyle(elem,prop) {
        var val = '';
        if(elem.currentStyle)
            val = elem.currentStyle[prop];
        else if(window.getComputedStyle)
            val = document.defaultView.getComputedStyle(elem,null).getPropertyValue(prop);
        return val;
    }

    redraw() {
        //trace('redraw');
        var text = this.props.children.toString();
        var length = text.length;
        //
        var lineH = parseInt(this.getStyle(this.elem,'line-height').replace('px',''));
        if(!lineH) {
            lineH = 18;
        }
        //
        var hh = lineH * 5;
        if(this.props.rows) {
            hh = lineH * this.props.rows;
        }
        if(this.props.height) {
            hh = this.props.height;
        }
        if(!hh) {
            hh = 90;
        }
        var heightLines = hh / lineH;
        //
        this.elem.style.height = 'auto';
        this.elem.innerHTML = text;
        var lines = Math.ceil(this.elem.clientHeight / lineH);
        var avgCharsPerLine = length/lines;
        //
        this.elem.style.height = hh+'px';
        var maxScroll = this.elem.scrollHeight - this.elem.clientHeight;
        var jump = 3;
        if(maxScroll > 0) {
            // has scroll
            var cutPos = (heightLines+1) * avgCharsPerLine;
            do{
                cutPos-=jump;
                var cut = text.substring(0,cutPos)+'...';
                this.elem.innerHTML = cut;
                maxScroll = this.elem.scrollHeight - this.elem.clientHeight;
            } while(maxScroll>0);
            //
            var cut = text.substring(0,cutPos-1)+'...';
            if(!this.props.cutWord) {
                var ls = cut.lastIndexOf(' ');
                cut = text.substring(0,ls)+'...';
            }
            this.elem.innerHTML = cut;
            this.setState({
                text: cut
            });
        }
    }

    render() {
        return(
            <div className="ellipsis" ref={(elem)=>{this.elem=elem}}>
                {this.state.text}
            </div>
        );
    }
}

export default Ellipsis;