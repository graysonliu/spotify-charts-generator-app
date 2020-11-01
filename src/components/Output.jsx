import React, {Component} from "react";
import "../styles.scss";

class Output extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className='output'>
                <span>{this.props.text}</span>
            </div>
        );
    }
}

export default Output;