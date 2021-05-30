import React from "react";
import ReactDOM from "react-dom";
import SpotifyApp from "./components/SpotifyApp";
import store from './store';
import {Provider} from 'react-redux';
import {server_request} from "./utils/server_request";


function component() {
    const element = document.createElement('div');
    element.id = 'root';
    return element;
}

document.body.appendChild(component());

const start_render = async () => {
    const app_info = await server_request('/app-info');

    ReactDOM.render(
        <React.StrictMode>
            <Provider store={store}>
                <SpotifyApp {...app_info}/>
            </Provider>
        </React.StrictMode>,
        document.getElementById("root")
    );
};

start_render();

