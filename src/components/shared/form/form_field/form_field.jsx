import 'Components/shared/form/form_field/form_field.scss';
import React from 'react';

class FormField extends React.Component{
    constructor(props) {
        super(props);
        //
        this.inputElement = null;
        this.isFocus = false;
        //
        if(props.type == 'checkbox' || props.type == 'toggle') {
            this.state = {
                checked: props.checked || false
            };
        } else {
            this.state = {
                value: props.value || ''
            };
            //
            if(props.type == 'textarea' && props.charLimit) {
                var val = props.value || '';
                this.state = {
                    value: val,
                    charLimit: props.charLimit,
                    charsLeft: props.charLimit-val.length,
                }
            }
        }
    }

    doChange(e) {
        if(this.props.type == 'checkbox' || this.props.type == 'toggle'||this.props.type == 'radio') {
            this.setState({
                checked: e.target.checked
            });
            this.update(e.target.name, e.target.checked);
        } else if(this.props.type == 'counter') {
            var val = parseInt(e.target.value);
            val = Math.max(val,0);
            if(isNaN(val)) {
                val = '0';
            } else if(!val) {
                val = '0';
            }
            this.setState({
                value: val
            });
        } else if(this.props.type == 'number') {
            var val = parseFloat(e.target.value);
            this.setState({
                value: val
            });
        } else {
            this.setState({
                value: e.target.value
            });
        }

        if(this.props.type == 'radio' || this.props.type == 'select' || this.props.type == 'list'){
            this.doBlur(e);
        }

    }

    doBlur(e) {
        this.isFocus = false;
        if(this.props.type == 'checkbox' || this.props.type == 'toggle') {
            //
        } else if(this.props.type == 'number' || this.props.type == 'counter') {
            this.update(e.target.name,parseFloat(e.target.value));
        } else {
            this.update(e.target.name,e.target.value);
        }
        //
        if(typeof this.props.onBlur == 'function') {
            this.props.onBlur();
        }
        //
        if(this.props.type != 'checkbox' && this.props.type != 'toggle') {
          window.fatlady.dispatcher.trigger('field-blur',{type:this.props.type,name:this.props.name,id:this.props.id});
        }
    }

    doFocus(e) {
        this.isFocus = true;
        this.setState({
            invalid: false
        });
        //
        if(typeof this.props.onFocus == 'function') {
            this.props.onFocus();
        }
        //
        if(this.props.type != 'checkbox' && this.props.type != 'toggle') {
          window.fatlady.dispatcher.trigger('field-focus',{type:this.props.type,name:this.props.name,id:this.props.id});
        }
    }

    doKeyPress(e) {
        if(this.props.type == 'textarea') {
            var chars = e.target.value.length;
            this.setState({
                charsLeft: (this.state.charLimit - chars),
            });
        }
        //
        if(typeof this.props.onKey == 'function') {
            var val = e.target.value;
            var key = e.keyCode;
            clearTimeout(this.keyTi);
            this.keyTi = setTimeout(function(){
                this.keyTi = null;
                this.props.onKey(this.props.name,val,key);
            }.bind(this),500);
        }
    }

    // Final validation check + call "onChange" from parent
    update(name,value){
        //trace('FF',name,value);
        var valid = true;
        if(this.props.mandatory || (this.props.type=='email' && value.length>0)) {
            valid = this.validateField(this.props.type, value);
        }
        if(this.props.type == 'number' || this.props.type == 'counter') {
            value = parseFloat(value);
            if(isNaN(value)) {
                value = '';
            }
        }
        if(valid || this.props.type == 'select') {
            if(typeof this.props.onChange == 'function') {
                this.props.onChange(name,value);
            }
        } else if(!valid) {
            this.props.onChange(name,'');
        }
        this.setState({
            invalid: !valid
        });
    }

    // validate field value by type
    validateField(type, value) {
        if(value.length < 1) {
            return false;
        }
        //
        if(this.props.error) {
            return false;
        }
        else if(type == 'email') {
            var regexEmail = new RegExp(/^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/);
            if(!regexEmail.test(value)){
                return false
            }
        } else if(type == 'tel') {
            var regexPhone = new RegExp(/^[0-9\-+().\s]{9,16}$/);
            if(!regexPhone.test(value)){
                return false
            }
        } else if(type == 'checkbox' || type == 'toggle'){
            // TODO
            trace(value);
        }
        return true;
    }

    componentDidMount() {
        this.initField();
    }

    componentDidUpdate() {

    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.type == 'checkbox' || nextProps.type == 'toggle') {
            this.setState({
                checked: nextProps.checked || false
            });
        } else {
            if(typeof this.props.onKey == 'function' && this.isFocus) {
                // in focus with onKey event - don't update
            } else {
                this.setState({
                    value: nextProps.value || ''
                });
            }
        }
        //
        if(nextProps.error || nextProps.error==false) {
            if(this.state.invalid != nextProps.error) {
                this.setState({invalid: nextProps.error});
            }
        }
    }

    initField() {
        var self = this;
        if( this.props.type == 'xxx'){

        }
    }

    counterClick(e) {
        var dir = 1;
        if(e.target.className.indexOf('minus')>0) {
            dir = -1;
        }
        var val = parseInt(this.state.value)
        if(isNaN(val)) {
            val = 0;
        }
        val += dir;
        val = Math.max(val, 0);
        if(isNaN(val)) {
            val = 0;
        } else if(!val) {
            val = '0';
        }
        this.setState({
            value: val
        });
        this.update(this.props.name,val);
    }

    render(){
        var invalidCls = '';
        if(this.state.invalid) {
            invalidCls = 'err';
        }
        // icon
        var ico = '';
        var icoCls = '';
        if(this.props.mobileIcon) {
            ico = (<i className={'icon icon-'+this.props.mobileIcon}></i>);
            icoCls = ' mobile-icon';
        }
        //
        var tabIndex = false;
        if(this.props.readonly || this.props.disabled) {
            tabIndex = '-1';
        }
        //
        if( this.props.type == 'checkbox' || this.props.type == 'toggle' ) {
            var label = this.props.label;
            if(this.props.caps) {
                label = lable.toUpperCase();
            }
            return (
            <label className={'fl-'+this.props.type +' '+ (this.props.className ? this.props.className+' ' : '') + (this.props.disabled?'disabled ':'') + (this.props.color=="transparent"?'invert ':'') + (this.props.readonly?'readonly ':'') + invalidCls} id={this.props.id}>
                    <input type="checkbox"
                        name={this.props.name}
                        checked={this.state.checked}
                        onChange={this.doChange.bind(this)}
                        onFocus={this.doFocus.bind(this)}
                        onBlur={this.doBlur.bind(this)}
                        disabled={this.props.disabled}
                        readOnly={this.props.readonly}
                        tabIndex={tabIndex} />
                    <div className="square"
                        style={this.props.type == 'checkbox' ? {backgroundColor:this.props.color, color:this.props.vcolor} : {}}></div>
                    {label}
                    {this.props.html}
                </label>
            );
        } else if( this.props.type == 'textarea') {
            var limit = '';
            if(this.props.charLimit) {
                limit = (<span className="textarea-counter">{this.state.charsLeft}</span>);
            }
            return (
                <span className={'fl-field-container '+invalidCls}>
                  <textarea className={"sp_input "+this.props.className}
                        id={this.props.id}
                        name={this.props.name}
                        rows={this.props.rows}
                        type={this.props.type}
                        placeholder={this.props.placeholder}
                        maxLength={this.props.charLimit}
                        onChange={this.doChange.bind(this)}
                        onFocus={this.doFocus.bind(this)}
                        onBlur={this.doBlur.bind(this)}
                        onKeyUp={this.doKeyPress.bind(this)}
                        disabled={this.props.disabled}
                        readOnly={this.props.readonly}
                        value={this.state.value}
                        ref={(elem)=>{this.inputElement = elem}}></textarea>
                    {limit}
                </span>
            );
        } else if( this.props.type == 'radio') {
            return (
                <span className={'fl-field-container '+invalidCls}>
                    <input className="sp_radio"
                        id={this.props.id}
                        name={this.props.name}
                        type={this.props.type}
                        onChange={this.doChange.bind(this)}
                        value={this.props.value}
                        disabled={this.props.disabled}
                        defaultChecked={this.props.checked}
                        readOnly={this.props.readonly}></input>
                </span>
            );
        } else if( this.props.type == 'select') {
            var options=[];
            if(this.props.options) {
                if(this.props.value==null){
                    options.push(
                        <option key="zero" value={-1}>{this.props.placeholder || 'Select'}</option>
                    )
                }
                for(var l=0; l<this.props.options.length; l++) {
                    var opt = this.props.options[l];
                    if(this.props.optiontype=="array") {
                        options.push(
                            <option key={l} value={opt[this.props.keypos]}>{opt[this.props.valuepos].toLowerCase()}</option>
                        )
                    } else {
                        var ttl = opt;
                        if(ttl == '') {
                            ttl = this.props.placeholder || 'Select';
                        }
                        options.push(
                            <option key={l} value={opt}>{ttl}</option>
                        )
                    }
                }
            }
            var defaultval = (this.props.value==null) ? "" : this.props.value;
            return (
                <span className={'fl-field-container '+invalidCls+icoCls+' '+defaultval}>
                    <select id={this.props.id}
                        className={"fl-select fl-select-arrow "+this.props.className}
                        value={defaultval}
                        onChange={this.doChange.bind(this)}
                        name={this.props.name}
                        disabled={this.props.disabled}>
                        {options}
                    </select>
                    {ico}
                </span>
            );
        } else if( this.props.type == 'counter') {
            return (
                <div className={"fl-field-container fl-field-counter "+invalidCls}>
                    <input type="number"
                        className="sp_input"
                        id={this.props.id}
                        name={this.props.name}
                        onChange={this.doChange.bind(this)}
                        onFocus={this.doFocus.bind(this)}
                        onBlur={this.doBlur.bind(this)}
                        onKeyUp={this.doKeyPress.bind(this)}
                        disabled={this.props.disabled}
                        readOnly={this.props.readOnly}
                        value={this.state.value}
                        ref={(elem)=>{this.inputElement = elem}}/>
                    {this.props.suffix ? (<span className="counter-suffix">{this.props.suffix}</span>) : ''}
                    <span className="counter-bt counter-minus" onClick={this.counterClick.bind(this)}>-</span>
                    <span className="counter-bt counter-plus" onClick={this.counterClick.bind(this)}>+</span>
                </div>
            );
        } else if( this.props.type == 'list') {
            var options = [];
            if(this.props.options) {
                for(var i=0; i<this.props.options.length; i++) {
                    var key = this.props.options[i];
                    var val =this.props.options[i];
                    var valdisplay =this.props.options[i];
                    if(this.props.optiontype=="array") {
                        key = this.props.options[i][0];
                        val = this.props.options[i][1];
                        valdisplay =<div><span>{this.props.options[i][0]}</span>{this.props.options[i][1].length>0? ': '+this.props.options[i][1]:this.props.options[i][1]}</div>;
                    }
                    var selected='';
                    if(this.state.value == key) {
                        selected = ' selected'
                    }
                    options.push(<label key={'opt-'+i}>
                            <input type="radio" name={this.props.name} value={key} onChange={this.doChange.bind(this)} checked={this.state.value == key} />
                            <div className={"fl-field-list-option"}>{valdisplay}</div>
                        </label>);
                }
            }
            return (
                <div className={"fl-field-container fl-field-list "+invalidCls} id={this.props.id}>
                    {options}
                </div>
            );
        } else {
            var currencyCls = '';
            var currencyElem = '';
            if(this.props.currency) {
                currencyCls = ' fl-field-currency';
                currencyElem = (<div className="fl-field-prefix">{this.props.currency}</div>);
            }

            //
            return(
                <span className={'fl-field-container '+invalidCls+currencyCls}>
                    <input className="sp_input"
                        id={this.props.id}
                        name={this.props.name}
                        type={this.props.type}
                        placeholder={this.props.placeholder}
                        onChange={this.doChange.bind(this)}
                        onFocus={this.doFocus.bind(this)}
                        onBlur={this.doBlur.bind(this)}
                        onKeyUp={this.doKeyPress.bind(this)}
                        disabled={this.props.disabled}
                        readOnly={this.props.readonly}
                        value={this.state.value}
                        ref={(elem)=>{this.inputElement = elem}}></input>
                    {currencyElem}
                </span>
            );
        }
    }
}

export default FormField;