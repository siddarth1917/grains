import React, { Component } from "react";
import cookie from "react-cookies";
import { deliveryId, pickupId, cookieDefaultConfig } from "../Helpers/Config";

class Refpage extends Component {
  constructor(props) {
    super(props);

    let slugtext =
      typeof this.props.match.params.slugtext !== "undefined"
        ? this.props.match.params.slugtext
        : "";

    if (slugtext === "delivery") {
      cookie.save("triggerAvlPop", deliveryId, cookieDefaultConfig);
    } else if (slugtext === "pickup") {
      cookie.save("triggerAvlPop", pickupId, cookieDefaultConfig);
    } else if (slugtext === "ordernow") {
      cookie.save("orderPopuptrigger", "Yes", cookieDefaultConfig);
    } else if (slugtext === "promopopup") {
      cookie.save("promoPopupTrigger", "Yes", cookieDefaultConfig);
    } else {
      cookie.remove("triggerAvlPop", cookieDefaultConfig);
      cookie.remove("orderPopuptrigger", cookieDefaultConfig);
      cookie.remove("promoPopupTrigger", cookieDefaultConfig);
    }

    this.props.history.push("/");
  }

  render() {
    return <div></div>;
  }
}

export default Refpage;
