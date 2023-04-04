import { configureStore, createSlice } from '@reduxjs/toolkit';

const userDataSlice = createSlice({
  name: 'user',
  initialState: {},
  reducers: {
    addInfoUser: (state: any, action) => {
      let newState = {  };
      newState = action.payload;
      state = newState;
      return state;
    },
  },
});

const postDataSlice = createSlice({
  name: 'post',
  initialState: [],
  reducers: {
    addPost: (state: any, action) => {
      let newState = {  };
      newState = action.payload;
      state.push(newState) ;
      return state;
    },
  },
});


const postDataServerSlice = createSlice({
  name: 'post',
  initialState: [],
  reducers: {
    addPostServer: (state: any, action) => {
      console.log('3333@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
      state.unshift(action.payload) ;

      return state;
    },
  },
});

// const statutSlice = createSlice({
//   name: 'statut',
//   initialState: {},
//   reducers: {
//     getStaut: (state) => {
//       return state;
//     },
//     set_statut: (state: any, action) => {
//       state.etat = action.payload
//       console.log(state);

//     },
//   },
// });

export const store = configureStore({
  reducer: {
    dataUser: userDataSlice.reducer,
    postData : postDataSlice.reducer,
    postDataServer : postDataServerSlice.reducer
  },
});

export const { addInfoUser } = userDataSlice.actions;
export const { addPost } = postDataSlice.actions;
export const { addPostServer } = postDataServerSlice.actions;
export type RootState = ReturnType<typeof store.getState>;
