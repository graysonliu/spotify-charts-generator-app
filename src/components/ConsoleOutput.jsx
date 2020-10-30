import React, {Component} from "react";
import "../styles.scss";

class ConsoleOutput extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className='console-output'>
                <span>{this.props.text}</span>
            </div>
        );
    }
}

export default ConsoleOutput;