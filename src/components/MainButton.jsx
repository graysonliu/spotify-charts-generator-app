import React, {Component} from "react";

class MainButton extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={this.props.style}>
                <button
                    onClick={this.props.onClick}>
                    {this.props.text}
                </button>
            </div>
        );
    }
}

export default MainButton;