import { createSlice } from '@reduxjs/toolkit';

const chartCheckSlice = createSlice({
    name: 'chartCheckList',
    initialState: {},
    reducers: {
        initCheckList(state, action) {
            for (const chart_code of action.payload)
                state[chart_code] = false;
        },
        // payload is a chart_code => checked mapping object
        changeChartCheck(state, action) {
            for (const [chart_code, checked] of Object.entries(action.payload))
                state[chart_code] = checked;
        },
        // payload is a single boolean value
        changeAllCheck(state, action) {
            for (const chart_code of Object.keys(state))
                state[chart_code] = action.payload;
        }
    }
});

export const { initCheckList, changeChartCheck, changeAllCheck } = chartCheckSlice.actions;
export default chartCheckSlice.reducer;