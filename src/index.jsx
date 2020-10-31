import React from "react";
import ReactDOM from "react-dom";
import SpotifyApp from "./components/SpotifyApp";
import store from './store';
import {Provider} from 'react-redux';


function component() {
    const element = document.createElement('div');
    element.id = 'root';
    return element;
}

document.body.appendChild(component());

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <SpotifyApp/>
        </Provider>
    </React.StrictMode>,
    document.getElementById("root")
);