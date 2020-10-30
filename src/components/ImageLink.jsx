import React, {Component} from "react";
import '../styles.scss'

class ImageLink extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className='image-link'>
                <a href={this.props.href || '#'}
                   target={this.props.target || '_blank'}
                >
                    <img src={this.props.img}
                         alt={this.props.alt || ''}
                    />
                </a>
            </div>);
    }
}

export default ImageLink