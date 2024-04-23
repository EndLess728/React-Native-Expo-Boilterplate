import {combineReducers} from '@reduxjs/toolkit';
import authSlicer from '../slices/authSlicer';

const rootReducer = combineReducers({
  auth: authSlicer,
});

export default rootReducer;
