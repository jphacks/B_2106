import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ClientFlagState {
  canRon:boolean,
  canTsumoagari:boolean,
  canDahai:boolean,
  isMyturn:boolean
}
interface Turn{ canTsumoagari:boolean,isMyturn:boolean,canDahai:boolean}
interface Furo{ canRon:boolean}

const initialState = { canRon:false,canTsumoagari:false,isMyturn:false ,canDahai:false} as ClientFlagState;

const clientFlagSlice = createSlice({
  name: 'clientFlag',
  initialState,
  reducers: {
      setTurn(state,action:PayloadAction<Turn>){
        return {...state,...action.payload};
      },
      setFuro(state,action:PayloadAction<Furo>){
        return {...state,...action.payload};
    },
  },
})

export const { setTurn, setFuro } = clientFlagSlice.actions
export default clientFlagSlice.reducer