import {createSlice} from '@reduxjs/toolkit';

const regionsNameSlice = createSlice({
    name: 'regionNameList',
    initialState: {},
    reducers: {
        initNameList(state, action) {
            for (const [region_code, region_name] of Object.entries(action.payload))
                state[region_code] = region_name;
        }
    }
})

export const {initNameList} = regionsNameSlice.actions;
export default regionsNameSlice.reducer;