import { createSlice } from '@reduxjs/toolkit';

const registeredChartsSlice = createSlice({
    name: 'registeredChartList',
    initialState: [],
    reducers: {
        updateRegisteredList(state, action) {
            return action.payload;
        }
    }
});

export const { updateRegisteredList } = registeredChartsSlice.actions;
export default registeredChartsSlice.reducer;