import React from "react";
import { Route } from "react-router-dom";
import Hoc from "./hoc/hoc";
import ProductList from "./containers/ProductList";
import Login from "./containers/Login";
import Signup from "./containers/Signup";
import HomepageLayout from "./containers/Home";
import OrderSummary from "./containers/OrderSummary";
import Checkout from "./containers/Checkout";

const BaseRouter = () => (
  <Hoc>
    <Route exact path="/products" component={ProductList} />
    <Route path="/login" component={Login} />
    <Route path="/signup" component={Signup} />
    <Route path="/order-summary" component={OrderSummary} />
    <Route path="/checkout" component={Checkout} />
    <Route exact path="/" component={HomepageLayout} />
  </Hoc>
);

export default BaseRouter;
