import React, {Component} from "react";
import ImageLink from "./ImageLink";
import logo_thinking from "../images/thinking.svg";

class MyLogo extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={this.props.style || ''}>
                <ImageLink
                    target='_self'
                    img={logo_thinking}
                />
            </div>
        );
    }
}

export default MyLogo