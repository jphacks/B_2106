import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface TehaiState {
  tehai: string[],
  tsumo: string
}

const initialState = { tehai: [],tsumo:"" } as TehaiState;

const tehaiSlice = createSlice({
  name: 'tehai',
  initialState,
  reducers: {
    tsumo(state,action: PayloadAction<string>) {
      state.tsumo = action.payload
      return {...state};
    },
    dahai(state,action:PayloadAction<number>) {
        state.tehai = state.tehai.filter((hai,index)=>action.payload!=index);
        state.tehai.push(state.tsumo);
        state.tsumo = "";
        return {...state};
    },
    tsumogiri(state) {
        state.tsumo = "";
        return {...state}
    },
    haipai(state,action: PayloadAction<string[]>){
        state.tehai = action.payload;
        return {...state}
    }
  },
})

export const { tsumo, dahai, tsumogiri,haipai } = tehaiSlice.actions
export default tehaiSlice.reducer