import React from "react";
import { render } from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import { getStore } from "./store";

import "./common/css/font-awesome.min.css";
import "./common/css/bootstrap.min.css";
import "./common/css/custom.css";
import "./common/css/responsive.css";
import "./common/css/slick.css";

import Home from "./components/Home/Home";
import Products from "./components/Products/Products";
import Checkout from "./components/Checkout/Checkout";
import Thankyou from "./components/Checkout/Thankyou";
import Pages from "./components/Pages/Pages";
import Faq from "./components/Pages/Faq";
import ContactUs from "./components/Pages/ContactUs";
import Outlets from "./components/Pages/Outlets";
import Myaccount from "./components/Myaccount/Myaccount";
import Orders from "./components/Myaccount/Orders";
import Mypromotions from "./components/Myaccount/Mypromotions";
import Rewards from "./components/Myaccount/Rewards";
import Account from "./components/Account/Account";
import Myvouchers from "./components/Myaccount/Myvouchers";
import Resetpassword from "./components/Account/Resetpassword";
import Logout from "./components/Myaccount/Logout";
import Refpage from "./components/Layout/Refpage";
import Page404 from "./Page404";

const store = getStore();

render(
  <Provider store={store}>
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/sign-in" component={Home} />
        <Route
          path={"/products/:slugType/:slugValue/:proValue"}
          component={Products}
        />
        <Route path={"/products/:slugType/:slugValue"} component={Products} />
        <Route path="/products" component={Products} />
        <Route path="/checkout" component={Checkout} />
        <Route path="/thankyou/:orderId" component={Thankyou} />
        <Route path="/news-and-updates" component={Pages} />
        <Route path="/privacy-policy" component={Pages} />
        <Route path="/page/:page_slug" component={Pages} />
        <Route path="/about-us" component={Pages} />
        <Route path="/terms-of-use" component={Pages} />
        <Route path="/faq" component={Faq} />
        <Route path="/contact-us" component={ContactUs} />
        <Route path="/locations" component={Outlets} />
        <Route path="/rewards" component={Rewards} />
        <Route path="/mypromotions" component={Mypromotions} />
        <Route path="/myorders" component={Orders} />
        <Route path="/myvouchers" component={Myvouchers} />
        <Route path="/myaccount" component={Myaccount} />
        <Route path="/account/activation/:activationKey" component={Account} />
        <Route
          path="/account/resetpassword/:resetKey"
          component={Resetpassword}
        />
        <Route path="/logout" component={Logout} />
        <Route path={"/refpage/:slugtext"} component={Refpage} />
        <Route component={Page404} />
      </Switch>
    </Router>
  </Provider>,

  document.getElementById("root")
);
