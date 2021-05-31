import {createSlice} from '@reduxjs/toolkit';

const regionsNameSlice = createSlice({
    name: 'regionNameList',
    initialState: {},
    reducers: {
        initRegionList(state, action) {
            for (const [region_code, region_name] of Object.entries(action.payload))
                state[region_code] = region_name;
        }
    }
});

export const {initRegionList} = regionsNameSlice.actions;
export default regionsNameSlice.reducer;