import {createSlice} from '@reduxjs/toolkit';

const regionsCheckSlice = createSlice({
    name: 'regionCheckList',
    initialState: {},
    reducers: {
        initCheckList(state, action) {
            for (const region_code of action.payload)
                state[region_code] = false;
        },
        // payload is a region_code => checked mapping object
        changeRegionsCheck(state, action) {
            for (const [region_code, checked] of Object.entries(action.payload))
                state[region_code] = checked;
        },
        // payload is a single boolean value
        changeAllCheck(state, action) {
            for (const region_code of Object.keys(state))
                state[region_code] = action.payload;
        }
    }
})

export const {initCheckList, changeRegionsCheck, changeAllCheck} = regionsCheckSlice.actions;
export default regionsCheckSlice.reducer;