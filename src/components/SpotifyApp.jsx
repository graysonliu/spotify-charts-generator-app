import React, {useState, useEffect, useRef} from "react";
import processURL from "../utils/process_url";
import "../styles.scss"
import "flag-icon-css/css/flag-icon.min.css"
import MyLogo from "./MyLogo";
import RegionList from "./RegionList";
import SelectAllCheckBox from "./SelectAllCheckBox";
import MainButton from "./MainButton";
import ConsoleOutput from "./ConsoleOutput";

const SpotifyApp = (props) => {
    const [selected_list, set_selected_list] = useState({});
    const [user_name, set_user_name] = useState(null);
    const [user_id, set_user_id] = useState(null);
    const [console_text, set_console_text] = useState('');
    // mapping region code to region name
    const regions = useRef(null);
    // the popup window
    const popup = useRef(null);

    // getting region list, only once
    useEffect(() => {
        get_region_list();
    }, []);

    // for receiving message from the popup window
    // we only need to set this event listener once
    useEffect(() => {
        const auth_callback = (event) => {
            // message source should be the popup window
            if (event.source !== popup.current)
                return;
            event.source.close();
            popup.current = null;
            get_user_info(event.data);
        };
        window.addEventListener("message", auth_callback, false);
    }, []);

    // console output should be cleared after user_name changes
    useEffect(() => {
        clearOutput();
    }, [user_name]);

    const server_request = async (endpoint, method = 'GET', data) => {
        const server_url = window.env.server_url;
        const response =
            method.toUpperCase() === 'GET' ?
                await fetch(
                    server_url + endpoint,
                    {
                        method: method
                    }
                ) :
                await fetch(
                    server_url + endpoint,
                    {
                        method: method,
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data || '')
                    }
                );
        return await response.json();
    }

    const get_region_list = async () => {
        regions.current = await server_request('/charts/regions')
        const selected_list = {};
        for (const [region_code, region_name] of Object.entries(regions.current)) {
            regions.current[region_code] = region_name;
            selected_list[region_code] = false;
        }
        set_selected_list(selected_list);
    }

    const clearOutput = async (code) => {
        set_console_text(() => `- Logged in as "${user_name}"`);
    }

    const get_user_info = async (code) => {
        const user_info = await server_request(`/users?code=${code}`);
        set_user_name(user_info['user_name']);
        set_user_id(user_info['user_id']);
    }

    window.spotifyAuthCanceledCallback = () => {
        // close the popup window
        popup.current && popup.current.close();
    };

    const handleClickLoginButton = () => {
        popup.current = window.open('https://accounts.spotify.com/authorize' +
            '?response_type=code' +
            '&client_id=' + window.env.client_id +
            (window.env.scopes ? '&scope=' + encodeURIComponent(window.env.scopes) : '') +
            '&redirect_uri=' + encodeURIComponent(window.env.redirect_uri + '/'),
            'Login with Spotify');
    }

    const handleClickRegionItem = (region_code, checked) => {
        const new_selected_list = {...selected_list};
        new_selected_list[region_code] = checked;
        set_selected_list(new_selected_list);
    }

    const checkIfAllSelected = () => {
        return Object.values(selected_list).reduce((a, b) => a && b, true);
    }

    const handleClickSelectAll = (checked) => {
        const new_selected_list = {...selected_list};
        for (const region_code in new_selected_list) {
            new_selected_list[region_code] = checked;
        }
        set_selected_list(new_selected_list);
    }

    const createPlaylists = async () => {
        const selected_regions = [];
        for (const region_code in selected_list) {
            if (selected_list[region_code]) {
                selected_regions.push(region_code);
            }
        }

        await server_request(
            '/charts',
            'POST',
            {
                user_id: user_id,
                regions: selected_regions
            }
        )

        // clear all selected items after clicking create-playlists button
        handleClickSelectAll(false);
    }

    const appendConsoleText = (text) => {
        const new_console_text = `${console_text}\n- ${text}`
        set_console_text(new_console_text);
    }

    const queries = processURL(window.location.href)
    // spotify authentication
    if (!user_name && 'code' in queries) {
        // authenticated and this is a popup window
        // window.opener is the main window
        window.opener && window.opener.postMessage(queries['code'], window.env.redirect_uri);
        // it seems that this component will be rendered twice
        // to avoid sending message twice, we set its opener to null
        window.opener = null;
        return (<div className='app'/>);
    }
    if (!user_name && 'error' in queries) {
        // authentication canceled and this is a popup window
        // window.opener is the main window
        window.opener && window.opener.spotifyAuthCanceledCallback();
        window.opener = null;
        return (<div className='app'/>);
    }

    return (
        <div className='app'>
            <MyLogo style='my-logo-header'/>
            <div className='description'>
                    <span>Create playlists of daily charts from&nbsp;
                        <a href='https://spotifycharts.com' target='_blank'>Spotify Charts</a>
                        !
                    </span>
            </div>
            {
                user_name ?
                    <MainButton
                        style='main-button'
                        onClick={createPlaylists}
                        text='Create Playlists'
                    /> :
                    <MainButton
                        style='main-button'
                        onClick={handleClickLoginButton}
                        text='Login with Spotify'
                    />
            }

            {user_name &&
            <ConsoleOutput text={console_text}/>}

            {user_name &&
            <MainButton style='main-button'
                        onClick={clearOutput}
                        text='Clear Output'/>}

            {regions.current &&
            <SelectAllCheckBox
                all_selected={checkIfAllSelected()}
                handleClickSelectAll={handleClickSelectAll}
            />}

            {regions.current &&
            <RegionList
                regions={regions.current}
                selected_list={selected_list}
                handleClickRegionItem={handleClickRegionItem}
            />}
        </div>
    );
}

export default SpotifyApp;
