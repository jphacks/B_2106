import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../../../store';

export type Sutehai = {
        pai: string,
        isRiichi: boolean,
}

interface TableState {
    kyoku: number;
    honba: number;
    sutehaiList: Sutehai[][];
    dora: string[];
}

const initialState: TableState = {
    kyoku: 1,
    honba: 1,
    sutehaiList: [[], [], [], []],
    dora: [],
};

interface DahaiState {
    playerId: number;
    pai: string;
    isRiichi: boolean;
}

export const tableSlice = createSlice({
    name: 'table',
    initialState,
    reducers: {
        dahai: (state: TableState, action: PayloadAction<DahaiState>) => {
            const payload = action.payload;

            state.sutehaiList[payload.playerId].push({
                pai: payload.pai,
                isRiichi: payload.isRiichi,
            });
        },
        kyokuStartTable: (state, action) => {
            state.kyoku = action.payload.kyoku;
            state.honba = action.payload.honba;
            state.dora = action.payload.dora;
        },
        resetSutehaiList:(state, action) => {
            state.sutehaiList= [[], [], [], []]
        },
    },
});

export const { dahai, kyokuStartTable,resetSutehaiList } = tableSlice.actions;

export const selectTableState = (state: RootState): TableState =>
    state.table;

export default tableSlice.reducer;
