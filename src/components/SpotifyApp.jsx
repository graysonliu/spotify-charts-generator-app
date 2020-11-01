import React, {useState, useEffect, useRef} from "react";
import processURL from "../utils/process_url";
import "../styles.scss"
import "flag-icon-css/css/flag-icon.min.css"
import MyLogo from "./MyLogo";
import Regions from "./regions/Regions";
import MainButton from "./MainButton";
import Output from "./Output";
import {server_request} from "../utils/server_request";
import {useDispatch, useSelector} from "react-redux";
import {changeRegionsCheck, changeAllCheck} from "./regions/regionsCheckSlice";

const SpotifyApp = (props) => {
    const [userName, setUserName] = useState(null);
    const [userId, setUserId] = useState(null);
    const [outputText, setOutputText] = useState('');
    const [registeredRegions, setRegisteredRegions] = useState([]);

    // the popup window
    const popup = useRef(null);

    const dispatch = useDispatch();
    const regionCheckList = useSelector((state) => state.regionCheckList);
    const regionNameList = useSelector((state) => state.regionNameList);

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
        window.addEventListener("message", auth_callback, false);
    }, [regionNameList]);

    useEffect(() => {
        loginReset();
    }, [userName]);

    useEffect(() => {
        outputRegisteredRegions();
    }, [registeredRegions]);

    const resetOutput = () => {
        loginReset();
        outputRegisteredRegions();
    }

    const loginReset = () => {
        setOutputText(() => `- Logged in as "${userName}"`);
    }

    const outputRegisteredRegions = () => {
        if (registeredRegions.length === 0)
            appendOutputText('No Registered Regions');
        else
            appendOutputText('Registered Regions: ' +
                registeredRegions.map(region_code => regionNameList[region_code])
                    .reduce((str, region_name) => `${str}, ${region_name}`)
            );

        dispatch(changeAllCheck(false));
        const registeredRegionsCheck = {};
        for (const region_code of registeredRegions) {
            registeredRegionsCheck[region_code] = true;
        }
        dispatch(changeRegionsCheck(registeredRegionsCheck));
    };

    const get_user_info = async (code) => {
        const body = await server_request(`/users?code=${code}`);
        setUserName(body['user_name']);
        setUserId(body['user_id']);
        setRegisteredRegions(body['registered_regions']);
    }

    const handleClickLoginButton = () => {
        popup.current = window.open('https://accounts.spotify.com/authorize' +
            '?response_type=code' +
            '&client_id=' + props.client_id +
            (props.scopes ? '&scope=' + encodeURIComponent(props.scopes) : '') +
            '&redirect_uri=' + encodeURIComponent(props.redirect_uri),
            'Login with Spotify');
    }

    const registerRegions = async () => {
        const selected_regions = [];
        for (const [region_code, checked] of Object.entries(regionCheckList)) {
            if (checked) {
                selected_regions.push(region_code);
            }
        }

        appendOutputText('Updating Registered Regions...');

        const body = await server_request(
            '/charts',
            'POST',
            {
                user_id: userId,
                regions_to_register: selected_regions
            }
        )

        setRegisteredRegions(body['registered_regions']);
    }

    const appendOutputText = (text) => {
        setOutputText((preText) => `${preText}\n- ${text}`);
    }

    const queries = processURL(window.location.href)
    // spotify authentication
    if (!userName && 'code' in queries) {
        // authenticated and this is a popup window
        // window.opener is the main window
        window.opener && window.opener.postMessage(queries['code'], window.opener.location.origin);
        return (<div/>);
    }
    if (!userName && 'error' in queries) {
        // authentication canceled and this is a popup window
        // window.opener is the main window
        window.opener && window.opener.postMessage(null, window.opener.location.origin);
        return (<div/>);
    }

    return (
        <div className='app'>
            <MyLogo style='my-logo-header'/>
            <div className='description'>
                    <span>Create and keep updating playlists of daily charts from&nbsp;
                        <a href='https://spotifycharts.com' target='_blank'>Spotify Charts</a>
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
                <Output text={outputText}/>
            }

            {
                userName &&
                <MainButton style='main-button'
                            onClick={resetOutput}
                            text='Reset'/>
            }
            <Regions/>
        </div>
    );
}

export default SpotifyApp;
