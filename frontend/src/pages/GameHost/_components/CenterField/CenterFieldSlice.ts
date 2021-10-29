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
    shouldDisableTsumo: boolean;
    shouldDisableRiichi: boolean;
}

const initialState: CenterFieldState = {
    oya: 0,
    player: [{score: 25000}, {score: 25000}, {score: 25000}, {score: 25000}],
    turnPlayer: 0,
    riichiPlayer: 0,
    shouldDisableTsumo: true,
    shouldDisableRiichi: true,
};

export const centerFieldSlice = createSlice({
    name: 'centerField',
    initialState,
    reducers: {
        resetCenterFieldState: (state) => {
            return Object.assign({}, state, initialState);
        },
        setCenterFieldState: (state, action: PayloadAction<CenterFieldState>) => {
            return Object.assign({}, state, action.payload);
        },
        setRiichiPlayer: (state, action) => {
            console.log("redux",action.payload);
            state.shouldDisableRiichi = false;
            state.riichiPlayer = action.payload.playerId;
        },
        setupTsumo: (state, action) => {
            state.shouldDisableTsumo = false;
            state.turnPlayer = action.payload.turnPlayer;
        },
        resetButton: (state) => {        
            state.shouldDisableTsumo = true;
            state.shouldDisableRiichi = true;
        },
        kyokuStartCenterField: (state, action) => {
            state.oya = action.payload.oya;
            state.player = action.payload.player;
        }
    },
});

export const { resetCenterFieldState, setCenterFieldState, setRiichiPlayer, setupTsumo, resetButton, kyokuStartCenterField } = centerFieldSlice.actions;

export const selectCenterFieldState = (state: RootState): CenterFieldState =>
    state.centerField;

export default centerFieldSlice.reducer;
