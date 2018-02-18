import React from 'react';

class DragElement extends React.Component{
	constructor(props) {
		super(props);
		
		// PROPERTIES
		// onDragStart [ function(obj){} ]
		// onDragMove [ function(obj){} ]
		// onDragEnd [ function(obj){} ]

		trace('drag element');
		this.elem = null;
		this.dragElem = null;
		this.elemx = 0;
		this.elemy = 0;
		this.elemStartx = 0;
		this.elemStarty = 0;
		//
		this.mousex = 0;
		this.mousey = 0;
		this.startx = 0;
		this.starty = 0;
		this.movex = 0;
		this.movey = 0;
		this.velocityx = 0;
		this.velocityy = 0;
		//
		this.onMouseDown = this.onMouseDown.bind(this);
		this.onMouseUp = this.onMouseUp.bind(this);
		this.onMouseMove = this.onMouseMove.bind(this);
	}

	componentWillReceiveProps(nextProps){
		if(nextProps.disabled) {
			this.remove();
		} else if(this.props.disabled && !nextProps.disabled) {
			this.redraw();
		}
	}

	componentDidMount() {
		this.redraw();
	}

	redraw() {
		if(this.elem) {
			//trace('redraw');
			this.remove();
			//
			this.elem.addEventListener('mousedown',this.onMouseDown);
			this.elem.addEventListener('touchstart',this.onMouseDown,{passive:false});
		}
	}

	remove() {
		if(this.elem) {
			//trace('redraw');
			this.elem.removeEventListener('mousedown',this.onMouseDown);
			this.elem.removeEventListener('touchstart',this.onMouseDown);
		}
	}

	// mouse events
	clearMouseListeners() {
		document.removeEventListener('mousemove',this.onMouseMove);
		document.removeEventListener('touchmove',this.onMouseMove);
		document.removeEventListener('mouseup',this.onMouseUp);
		document.removeEventListener('touchend',this.onMouseUp);
		document.removeEventListener('touchcancel',this.onMouseUp);
		//
		document.removeEventListener('mousemove',this.onMouseMove,true);
		document.removeEventListener('touchmove',this.onMouseMove,true);
		document.removeEventListener('mouseup',this.onMouseUp,true);
		document.removeEventListener('touchend',this.onMouseUp,true);
		document.removeEventListener('touchcancel',this.onMouseUp,true);
	}

	setMouseListeners() {
		this.clearMouseListeners();
		document.addEventListener('mousemove',this.onMouseMove,{passive:false});
		document.addEventListener('touchmove',this.onMouseMove,{passive:false});
		document.addEventListener('mouseup',this.onMouseUp,{passive:false});
		document.addEventListener('touchend',this.onMouseUp,{passive:false});
		document.addEventListener('touchcancel',this.onMouseUp,{passive:false});
	}

	onMouseDown(e) {
		if(e.target == e.currentTarget) {
			e.preventDefault();
		}
		this.setMouseListeners();
		//
		this.dragElem = e.target;
		this.elemx = this.elemStartx = this.dragElem.offsetLeft;
		this.elemy = this.elemStarty = this.dragElem.offsetTop;
		this.mousex = this.startx = e.pageX || 0;
		this.mousey = this.starty = e.pageY || 0;
		if(typeof e.touches != 'undefined') {
			this.mousex = this.startx = e.touches[0].pageX;
			this.mousey = this.starty = e.touches[0].pageY;
		}
		this.movex = this.velocityx = 0;
		this.movey = this.velocityy = 0;
		//
		window.dragElem = this.dragElem;
		if(typeof this.props.onDragStart == 'function') {
			this.props.onDragStart({
				type: 'dragStart',
				element: this.elem,
				mousex: this.mousex,
				mousey: this.mousey,
				elemx: this.elemx,
				elemy: this.elemy,
			});
		}
	}

	onMouseUp(e) {
		if(e.target == e.currentTarget) {
			e.preventDefault();
		}
		this.clearMouseListeners();
		//
		if(typeof this.props.onDragEnd == 'function') {
			this.props.onDragEnd({
				type: 'dragEnd',
				element: this.elem,
				mousex: this.mousex,
				mousey: this.mousey,
				elemx: this.elemx,
				elemy: this.elemy,
				movex: this.movex,
				movey: this.movey,
				velocityx: this.velocityx,
				velocityy: this.velocityy,
			});
		}
	}

	onMouseMove(e) {
		e.preventDefault();
		var mx = e.pageX || 0;
		var my = e.pageY || 0;
		if(typeof e.touches != 'undefined') {
			mx = e.touches[0].pageX;
			my = e.touches[0].pageY;
		}
		//
		this.velocityx = mx - this.mousex;
		this.velocityy = my - this.mousey;
		this.mousex = mx;
		this.mousey = my;
		this.movex = this.mousex - this.startx;
		this.movey = this.mousey - this.starty;
		this.elemx = this.elemStartx + this.movex;
		this.elemy = this.elemStarty + this.movey;
		//
		if(typeof this.props.onDragMove == 'function') {
			this.props.onDragMove({
				type: 'dragMove',
				element: this.elem,
				mousex: this.mousex,
				mousey: this.mousey,
				elemx: this.elemx,
				elemy: this.elemy,
				movex: this.movex,
				movey: this.movey,
				velocityx: this.velocityx,
				velocityy: this.velocityy,
			});
		}
	}

	render() {
		return(
			<div className="drag-element" ref={(elem)=>{this.elem=elem}}>
				{this.props.children}
			</div>
		);
	}
}

export default DragElement;