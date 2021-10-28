import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../../../store';

interface TableState {
    sutehai: string[][];
    canRiichi: boolean;
}

const initialState: TableState = {
    sutehai: [[]],
    canRiichi: true
};

export const tableSlice = createSlice({
    name: 'table',
    initialState,
    reducers: {
        /**
         * 呼び出し例
         * dahai({ sutehai: [["1m", ...], ...], canRiichi: true });
         */
        dahai: (state, action: PayloadAction<TableState>) => {
            return Object.assign({}, state, action.payload);
        },
    },
});

export const { dahai } = tableSlice.actions;

export const selectTableState = (state: RootState): TableState =>
    state.table;

export default tableSlice.reducer;
