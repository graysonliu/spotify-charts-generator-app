import {configureStore} from '@reduxjs/toolkit';
import regionsCheckReducer from './components/regions/regionsCheckSlice';
import regionsNameReducer from './components/regions/regionsNameSlice';

export default configureStore({
    reducer: {
        regionCheckList: regionsCheckReducer,
        regionNameList: regionsNameReducer
    },
});
