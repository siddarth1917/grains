import React, { Component } from "react";
import cookie from "react-cookies";
import { cookieDefaultConfig } from "../Helpers/Config";

class Logout extends Component {
  componentWillMount() {
    cookie.remove("UserId", cookieDefaultConfig);
    cookie.remove("UserFname", cookieDefaultConfig);
    cookie.remove("UserLname", cookieDefaultConfig);
    cookie.remove("UserMobile", cookieDefaultConfig);
    cookie.remove("UserEmail", cookieDefaultConfig);
    cookie.remove("orderPaymentMode", cookieDefaultConfig);
    cookie.remove("orderOutletId", cookieDefaultConfig);
    cookie.remove("orderTableNo", cookieDefaultConfig);
    cookie.remove("product_remarks", cookieDefaultConfig);
    cookie.remove("orderOutletName", cookieDefaultConfig);
    cookie.remove("orderZoneId", cookieDefaultConfig);
    cookie.remove("carttotalitems", cookieDefaultConfig);
    cookie.remove("cartsubtotal", cookieDefaultConfig);
    cookie.remove("cartid", cookieDefaultConfig);

    /* Delivery avilablity */
    cookie.remove("DeliveryDate", cookieDefaultConfig);
    cookie.remove("DeliveryTime", cookieDefaultConfig);
    cookie.remove("unitNoOne", cookieDefaultConfig);
    cookie.remove("unitNoTwo", cookieDefaultConfig);

    cookie.remove("promotion_id", cookieDefaultConfig);
    cookie.remove("promotion_applied", cookieDefaultConfig);
    cookie.remove("promotion_code", cookieDefaultConfig);
    cookie.remove("promotion_delivery_charge_applied", cookieDefaultConfig);
    cookie.remove("promotion_amount", cookieDefaultConfig);
    cookie.remove("promotion_category", cookieDefaultConfig);
    cookie.remove("prmo_type", cookieDefaultConfig);

    /*Remove voucher*/
    cookie.remove("voucher_applied", cookieDefaultConfig);
    cookie.remove("voucher_code", cookieDefaultConfig);
    cookie.remove("voucher_amount", cookieDefaultConfig);

    cookie.remove("orderIdTxt", cookieDefaultConfig);
    cookie.remove("paymentIdTxt", cookieDefaultConfig);
	sessionStorage.removeItem("mytime");
    this.props.history.push("/");
  }

  render() {
    return <h1 className="loading-text">Logging out...</h1>;
  }
}

export default Logout;
