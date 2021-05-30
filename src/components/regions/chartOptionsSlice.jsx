import { createSlice } from '@reduxjs/toolkit';

const chartOptionsSlice = createSlice({
    name: 'chartOptionList',
    initialState: {},
    reducers: {
        initChartOptionList(state, action) {
            for (const [option_code, option_name] of Object.entries(action.payload))
                state[option_code] = option_name;
        }
    }
});

export const { initChartOptionList } = chartOptionsSlice.actions;
export default chartOptionsSlice.reducer;