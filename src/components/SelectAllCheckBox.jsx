import React, {Component} from "react";

class SelectAllCheckBox extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className='select-all-item'>
                <input type='checkbox'
                       checked={this.props.all_selected}
                       onChange={e => this.props.handleClickSelectAll(e.target.checked)}
                />
                <span> Select All</span>
            </div>
        );
    }
}

export default SelectAllCheckBox;