import 'Components/shared/ui/progress_bar/progress_bar.scss';
import React from 'react';

class ProgressBar extends React.Component{
    constructor(props) {
        super(props);

        let pc = props.pc;
        if(pc <= 1) {
            pc *= 100;
        }
        this.state = {
            pc: pc,
        };
    }

    componentWillReceiveProps(nextProps) {
        let pc = nextProps.pc;
        if(pc <= 1) {
            pc *= 100;
        }
        this.setState({
            pc: pc,
        });
    }

    render(){
        return(
            <div className="progress-bar-bg">
                <div className="progress-bar" style={{width:(this.state.pc+'%')}}></div>
            </div>
        )
    }
}

export default ProgressBar;
