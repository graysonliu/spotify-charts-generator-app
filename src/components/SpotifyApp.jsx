import React, { useState, useEffect, useRef } from "react";
import processURL from "../utils/process_url";
import "../styles.scss";
import MyLogo from "./MyLogo";
import Regions from "./regions/Regions";
import MainButton from "./MainButton";
import Output from "./Output";
import { server_request } from "../utils/server_request";
import { useDispatch, useSelector } from "react-redux";
import { changeChartCheck, changeAllCheck } from "./regions/chartCheckSlice";

const SpotifyApp = (props) => {
    const [userName, setUserName] = useState(null);
    const [userId, setUserId] = useState(null);
    const [outputText, setOutputText] = useState('');
    const [registeredCharts, setRegisteredCharts] = useState([]);

    // the popup window
    const popup = useRef(null);

    const dispatch = useDispatch();
    const chartCheckList = useSelector((state) => state.chartCheckList);
    const regionNameList = useSelector((state) => state.regionNameList);
    const chartOptionList = useSelector((state) => state.chartOptionList);

    // for receiving auth code from the popup window
    useEffect(() => {
        const auth_callback = (event) => {
            // message source should be the popup window
            if (event.source !== popup.current)
                return;
            event.source.close(); // close the popup window
            popup.current = null; // set popup back to null
            if (event.data) {
                get_user_info(event.data);
            }
        };
        window.removeEventListener("message", auth_callback);
        window.addEventListener("message", auth_callback);
    }, []); // this is to ensure that event listener is only added once

    useEffect(() => {
        loginReset();
    }, [userName]);

    useEffect(() => {
        outputRegisteredRegions();
    }, [registeredCharts]);

    const resetOutput = () => {
        loginReset();
        outputRegisteredRegions();
    };

    const loginReset = () => {
        setOutputText(() => `- Logged in as "${userName}"`);
    };

    const outputRegisteredRegions = () => {
        loginReset();
        if (registeredCharts.length === 0)
            appendOutputText('No Registered Regions');
        else
            appendOutputText('Registered Regions:' +
                registeredCharts.map(chart_code => decodeChartCode(chart_code))
                    .reduce((str, chart_name) => `${str}\n\t- ${chart_name}`, '')
            );

        dispatch(changeAllCheck(false));
        const registeredChartsCheck = {};
        for (const chart_code of registeredCharts) {
            registeredChartsCheck[chart_code] = true;
        }
        dispatch(changeChartCheck(registeredChartsCheck));
    };

    const get_user_info = async (code) => {
        const body = await server_request(`/users?code=${code}`);
        setUserName(body['user_name']);
        setUserId(body['user_id']);
        setRegisteredCharts(body['registered_charts']);
    };

    const handleClickLoginButton = () => {
        popup.current = window.open('https://accounts.spotify.com/authorize' +
            '?response_type=code' +
            '&client_id=' + props.client_id +
            (props.scopes ? '&scope=' + encodeURIComponent(props.scopes) : '') +
            '&redirect_uri=' + encodeURIComponent(props.redirect_uri),
            'Login with Spotify');
    };

    const registerRegions = async () => {
        const selected_charts = [];
        for (const [chart_code, checked] of Object.entries(chartCheckList)) {
            if (checked) {
                selected_charts.push(chart_code);
            }
        }

        // ask user to confirm deregister
        const chartsToDeregister = [];
        for (const chart_code of registeredCharts)
            if (!chartCheckList[chart_code])
                chartsToDeregister.push(chart_code);
        if (chartsToDeregister.length !== 0) {
            const confirm = window.confirm('Are you sure you want to deregister following chart(s): ' +
                chartsToDeregister.map((chart_code => decodeChartCode(chart_code))).join(', ') + '?');
            if (!confirm) {
                const recheck = {};
                for (const region_code of chartsToDeregister)
                    recheck[region_code] = true;
                dispatch(changeChartCheck(recheck));
                return;
            }
        }

        appendOutputText('Updating Registered Regions...');

        const body = await server_request(
            '/charts',
            'POST',
            {
                user_id: userId,
                charts_to_register: selected_charts
            }
        );

        setRegisteredCharts(body['registered_charts']);
    };

    const appendOutputText = (text) => {
        setOutputText((preText) => `${preText}\n- ${text}`);
    };

    const queries = processURL(window.location.href);
    // spotify authentication
    if (!userName && 'code' in queries) {
        // authenticated and this is a popup window
        // window.opener is the main window
        window.opener && window.opener.postMessage(queries['code'], window.opener.location.origin);
        return (<div />);
    }
    if (!userName && 'error' in queries) {
        // authentication canceled and this is a popup window
        // window.opener is the main window
        window.opener && window.opener.postMessage(null, window.opener.location.origin);
        return (<div />);
    }

    const decodeChartCode = (chart_code) => {
        const i = chart_code.indexOf('-');
        const region_name = regionNameList[chart_code.slice(0, i)];
        const chart_option = chartOptionList[chart_code.slice(i + 1)];
        return `${region_name} ${chart_option}`;
    };

    return (
        <div className='app'>
            <MyLogo style='my-logo-header' />
            <div className='description'>
                <span>Create and keep updating playlists of daily charts from&nbsp;
                        <a href='https://spotifycharts.com' target='_blank' rel='noreferrer'>Spotify Charts</a>
                        !
                    </span>
            </div>
            {
                userName ?
                    <MainButton
                        style='main-button'
                        onClick={registerRegions}
                        text='Register Regions'
                    /> :
                    <MainButton
                        style='main-button'
                        onClick={handleClickLoginButton}
                        text='Login with Spotify'
                    />
            }

            {
                userName &&
                <Output text={outputText} />
            }

            {
                userName &&
                <MainButton style='main-button'
                    onClick={resetOutput}
                    text='Reset' />
            }
            <Regions />
        </div>
    );
};

export default SpotifyApp;
