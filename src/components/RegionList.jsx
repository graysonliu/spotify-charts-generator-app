import React, {Component} from "react";
import '../styles.scss'

class RegionItem extends Component {
    constructor(props) {
        super(props);
    }

    onChange = (e) => {
        this.props.handleClickRegionItem(this.props.region_code, e.target.checked);
    }

    render() {
        return (
            <div className='region-item'>
                <input
                    type="checkbox"
                    checked={this.props.checked}
                    onChange={this.onChange}
                />
                <span>{` ${this.props.region_name} `}</span>
                <span className={`flag-icon flag-icon-${this.props.region_code}`}/>
            </div>);
    }
}

class RegionList extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const region_list = [];
        for (const [region_code, region_name] of Object.entries(this.props.regions)) {
            region_list.push(
                <RegionItem
                    key={region_code}
                    region_code={region_code}
                    region_name={region_name}
                    checked={this.props.selected_list[region_code]}
                    handleClickRegionItem={this.props.handleClickRegionItem}
                />
            );
        }
        return (
            <div className='region-list'>
                {region_list}
            </div>
        );
    }
}

export default RegionList;