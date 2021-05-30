import { configureStore } from '@reduxjs/toolkit';
import chartCheckReducer from './components/regions/chartCheckSlice';
import regionNameReducer from './components/regions/regionsNameSlice';
import chartOptionReducer from './components/regions/chartOptionsSlice';


export default configureStore({
    reducer: {
        chartCheckList: chartCheckReducer,
        regionNameList: regionNameReducer,
        chartOptionList: chartOptionReducer
    },
});
