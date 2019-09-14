import axios from "axios";
import { authAxios } from "../../utils";
import { CART_START, CART_SUCCESS, CART_FAIL } from "./actionTypes";
import { orderSummaryURL } from "../../constants";

export const cartStart = () => {
  return {
    type: CART_START
  };
};

export const cartSuccess = data => {
  return {
    type: CART_SUCCESS,
    data
  };
};

export const cartFail = error => {
  return {
    type: CART_FAIL,
    error: error
  };
};
//CART FETCH WILL BE CALLED WHEN THE APPLICATION IS LOADED FOR THE FIRST TIME
//AND THEN GOIN FORWARD WHENEVER WE ADD TO CART WE GONNA CALL CARTFETCH
export const fetchCart = () => {
  return dispatch => {
    dispatch(cartStart());
    authAxios
      .get(orderSummaryURL)
      .then(res => {
        dispatch(cartSuccess(res.data));
      })
      .catch(err => {
        dispatch(cartFail(err));
      });
  };
};
