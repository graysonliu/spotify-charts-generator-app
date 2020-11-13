import React, {useEffect, useState, useRef} from "react";
import '../../styles.scss'
import {useSelector, useDispatch} from 'react-redux';
import {changeRegionsCheck, initCheckList, changeAllCheck} from "./regionsCheckSlice";
import {initNameList} from "./regionsNameSlice";
import {server_request} from "../../utils/server_request";

const RegionItem = (props) => {
    const dispatch = useDispatch();
    const [flagLoaded, setFlagLoaded] = useState(false);

    const FlagComponent = useRef(null);

    useEffect(() => {
        props.region_code !== 'global' &&
        (
            props.isWindows ?
                import('country-flag-icons/react/3x2').then(({default: Flags}) => {
                        FlagComponent.current = React.createElement(Flags[props.region_code.toUpperCase()]);
                        setFlagLoaded(true);
                    }
                ) :
                import('country-flag-icons/unicode').then(({default: getUnicodeFlagIcon}) => {
                    FlagComponent.current = <span>{getUnicodeFlagIcon(props.region_code)}</span>
                    setFlagLoaded(true);
                })
        );
    }, [props.region_code, props.isWindows]);

    const onChange = (e) => {
        dispatch(changeRegionsCheck({
            [props.region_code]: e.target.checked
        }))
    }

    return (
        <div className='region-item'>
            <input
                type="checkbox"
                checked={props.checked}
                onChange={onChange}
            />
            <span>{` ${props.region_name} `}</span>
            {/* region code 'global' does not have a flag */}
            {/* windows does not support country flag emoji */}
            {/* using svg instead if it is windows */}
            {
                flagLoaded && FlagComponent.current
            }
        </div>);
}

const SelectAllCheckBox = (props) => {
    const regionCheckList = useSelector((state) => state.regionCheckList);
    const dispatch = useDispatch();

    const checkIfAllSelected = (regionCheckList) => {
        return Object.values(regionCheckList).reduce((a, b) => a && b, true);
    }

    return (
        <div className='select-all-item'>
            <input type='checkbox'
                   checked={checkIfAllSelected(regionCheckList)}
                   onChange={e => dispatch(changeAllCheck(e.target.checked))}
            />
            <span> Select All</span>
        </div>
    );
}

const RegionList = (props) => {
    const regionCheckList = useSelector((state) => state.regionCheckList);
    const regionNameList = useSelector((state) => state.regionNameList);
    const region_item_list = [];
    const isWindows = window.navigator.platform.toUpperCase().indexOf('WIN') !== -1;

    for (const region_code of Object.keys(regionCheckList)) {
        region_item_list.push(
            <RegionItem
                key={region_code}
                region_code={region_code}
                region_name={regionNameList[region_code]}
                checked={regionCheckList[region_code]}
                isWindows={isWindows}
            />
        );
    }
    return (
        <div className='region-list'>
            {region_item_list}
        </div>
    );
}

const Regions = (props) => {
    const dispatch = useDispatch();

    // getting region list, only once
    useEffect(() => {
        get_region_list();
    }, []);

    const get_region_list = async () => {
        const regions = await server_request('/charts/regions')
        const new_check_list = {};
        for (const [region_code, region_name] of Object.entries(regions)) {
            regions[region_code] = region_name;
            new_check_list[region_code] = false;
        }
        dispatch(initNameList(regions));
        dispatch(initCheckList(Object.keys(regions)));
    }

    return (
        <div>
            <SelectAllCheckBox/>
            <RegionList/>
        </div>
    );
}

export default Regions;