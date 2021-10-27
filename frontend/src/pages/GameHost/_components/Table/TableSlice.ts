import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../../../store';

interface TableState {
    sutehai: string[][]
}

const initialState: TableState = {
    sutehai: [[]]
};

export const tableSlice = createSlice({
    name: 'table',
    initialState,
    reducers: {
        dahai: (state, action) => {
            state.sutehai = action.payload
        }
    },
});

export const { dahai } = tableSlice.actions;

export const selectTableState = (state: RootState): TableState =>
    state.table;

export default tableSlice.reducer;
