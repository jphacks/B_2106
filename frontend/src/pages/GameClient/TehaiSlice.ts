import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../store';

interface TehaiState {
  kaze: number,
  tehai: string[],
  tsumo: string
}

const initialState = { kaze: 0, tehai: [],tsumo:"" } as TehaiState;

const tehaiSlice = createSlice({
  name: 'tehai',
  initialState,
  reducers: {
    kyokuStart(state, action: PayloadAction<number>) {
      state.kaze = action.payload;
    },
    tsumo(state,action: PayloadAction<string>) {
      state.tsumo = action.payload
      return state;
    },
    dahai(state,action:PayloadAction<number>) {
        state.tehai = state.tehai.filter((hai,index)=>action.payload!=index);
        state.tehai.push(state.tsumo);
        state.tsumo = "";
        return state;
    },
    tsumogiri(state) {
        state.tsumo = "";
        return state;
    },
    haipai(state,action: PayloadAction<string[]>){
        state.tehai = action.payload;
        return state;
    }
  },
})

export const { kyokuStart, tsumo, dahai, tsumogiri,haipai } = tehaiSlice.actions;
export default tehaiSlice.reducer;

export const selectTehai = (state: RootState): TehaiState => state.tehai;
