import React, { useEffect, useState, useRef } from "react";
import '../styles.scss';
import { useSelector, useDispatch } from 'react-redux';


const Output = (props) => {
    const registeredChartList = useSelector((state) => state.registeredChartList);
    const regionNameList = useSelector((state) => state.regionNameList);
    const chartOptionList = useSelector((state) => state.chartOptionList);

    const decodeChartCode = (chart_code) => {
        const i = chart_code.indexOf('-');
        const region_name = regionNameList[chart_code.slice(0, i)];
        const chart_option = chartOptionList[chart_code.slice(i + 1)];
        return `${region_name} ${chart_option}`;
    };

    const registeredChartText = registeredChartList.map(chart_code => decodeChartCode(chart_code))
        .reduce((str, chart_name) => `${str} - ${chart_name}\n`, '');

    return (
        <div className='output'>
            <p>
                <span>{props.text}</span>
                <br />
                <span>- </span>
                {registeredChartList.length == 0 ?
                    <span>No registered playlists.</span> :
                    <span>
                        Registered&nbsp;
                        <span className="underline">{registeredChartList.length} playlists
                            <span className="float-text">{registeredChartText}</span>
                        </span> in total.
                    </span>}
            </p>
        </div>
    );

};

export default Output;