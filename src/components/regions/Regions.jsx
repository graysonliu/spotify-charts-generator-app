import React, { useEffect, useState, useRef } from "react";
import '../../styles.scss';
import { useSelector, useDispatch } from 'react-redux';
import { changeChartCheck, initCheckList, changeAllCheck } from "./chartCheckSlice";
import { initRegionList } from "./regionsNameSlice";
import { initChartOptionList } from "./chartOptionsSlice";
import { server_request } from "../../utils/server_request";

const ChartCheckBox = (props) => {
    const dispatch = useDispatch();
    const chartCheckList = useSelector((state) => state.chartCheckList);

    const onChange = (e) => {
        dispatch(changeChartCheck({
            [props.chart_code]: e.target.checked
        }));
    };

    return (
        <td>
            <input type='checkbox'
                checked={chartCheckList[props.chart_code] || false}
                onChange={onChange}
            />
        </td>
    );
};

const ChartCheckBoxGroup = (props) => {
    const chartOptionList = useSelector((state) => state.chartOptionList);
    const checkBoxGroup = [];

    for (const option of Object.keys(chartOptionList)) {
        checkBoxGroup.push(
            <ChartCheckBox
                key={props.region + '-' + option}
                chart_code={props.region + '-' + option}
            />);
    }

    return checkBoxGroup;
};

const RegionItem = (props) => {
    const dispatch = useDispatch();
    const [flagLoaded, setFlagLoaded] = useState(false);

    const FlagComponent = useRef(null);

    useEffect(() => {
        props.region_code !== 'global' &&
            (
                props.isWindows ?
                    import('country-flag-icons/react/3x2').then(({ default: Flags }) => {
                        FlagComponent.current = React.createElement(Flags[props.region_code.toUpperCase()]);
                        setFlagLoaded(true);
                    }
                    ) :
                    import('country-flag-icons/unicode').then(({ default: getUnicodeFlagIcon }) => {
                        FlagComponent.current = <span>{getUnicodeFlagIcon(props.region_code)}</span>;
                        setFlagLoaded(true);
                    })
            );
    }, [props.region_code, props.isWindows]);

    const onChange = (e) => {
        dispatch(changeChartCheck({
            [props.region_code]: e.target.checked
        }));
    };

    return (
        <tr className='region-item'>
            <td>
                {/* <input
                    type="checkbox"
                    checked={props.checked}
                    onChange={onChange}
                /> */}

                {/* region code 'global' does not have a flag */}
                {/* windows does not support country flag emoji */}
                {/* using svg instead if it is windows */}
                {
                    flagLoaded && FlagComponent.current
                }

                <span>{` ${props.region_name} `}</span>
            </td>
            <ChartCheckBoxGroup region={props.region_code} />
        </tr>);
};

const SelectAllCheckBox = (props) => {
    const chartCheckList = useSelector((state) => state.chartCheckList);
    const dispatch = useDispatch();

    const checkIfAllSelected = (chartCheckList) => {
        return Object.values(chartCheckList).reduce((a, b) => a && b, true);
    };

    return (
        <div className='select-all-item'>
            <input type='checkbox'
                checked={checkIfAllSelected(chartCheckList)}
                onChange={e => dispatch(changeAllCheck(e.target.checked))}
            />
            <span> Select All</span>
        </div>
    );
};

const ChartHeader = (props) => {
    const chartOptionList = useSelector((state) => state.chartOptionList);
    const headList = [];
    for (const [option_code, option_name] of Object.entries(chartOptionList)) {
        headList.push(
            <th
                key={option_code}>
                {option_name}
            </th>);
    }
    return (
        <thead className='region-list-header'>
            <tr>
                <th></th>
                {headList}
            </tr>
        </thead>);
};

const RegionList = (props) => {
    const regionNameList = useSelector((state) => state.regionNameList);
    const chartOptionList = useSelector((state) => state.chartOptionList);
    const region_item_list = [];
    const isWindows = window.navigator.platform.toUpperCase().indexOf('WIN') !== -1;

    for (const region_code of Object.keys(regionNameList)) {
        region_item_list.push(
            <RegionItem
                key={region_code}
                region_code={region_code}
                region_name={regionNameList[region_code]}
                isWindows={isWindows}
                chart_options={chartOptionList}
            />
        );
    }
    return (
        <div className='region-list'>
            <table>
                <ChartHeader />
                <tbody>
                    {region_item_list}
                </tbody>
            </table>
        </div>
    );
};

const Regions = (props) => {
    const dispatch = useDispatch();

    // getting charts metadata, only once
    useEffect(() => {
        get_charts_metadata();
    }, []);

    const get_charts_metadata = async () => {
        const regions = await server_request('/charts/regions');
        const options = await server_request('/charts/options');
        const check_list = [];
        for (const region_code of Object.keys(regions)) {
            for (const option_code of Object.keys(options)) {
                check_list.push(`${region_code}-${option_code}`);
            }
        }
        dispatch(initRegionList(regions));
        dispatch(initChartOptionList(options));
    };

    return (
        < RegionList />
    );
};

export default Regions;