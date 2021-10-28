import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../../../store';

interface PlayerState {
    score: number
}

interface CenterFieldState {
    oya: number;
    player: [PlayerState, PlayerState, PlayerState, PlayerState],
    turnPlayer: number;
    riichiPlayer: number;
}

const initialState: CenterFieldState = {
    oya: 0,
    player: [{score: 25000}, {score: 25000}, {score: 25000}, {score: 25000}],
    turnPlayer: 0,
    riichiPlayer: 0
};

export const centerFieldSlice = createSlice({
    name: 'centerField',
    initialState,
    reducers: {
        resetCenterFieldState: (state) => {
            return Object.assign({}, state, initialState);
        },
        /**
         * 呼び出し例
         * setDecoderState({ oya: 0, player: [{score: 25000}, ...], turnPlayer: 0, riichiPlayer: 0 });
         */
        setCenterFieldState: (state, action: PayloadAction<CenterFieldState>) => {
            return Object.assign({}, state, action.payload);
        },
    },
});

export const { resetCenterFieldState, setCenterFieldState } = centerFieldSlice.actions;

export const selectCenterFieldState = (state: RootState): CenterFieldState =>
    state.centerField;

export default centerFieldSlice.reducer;
