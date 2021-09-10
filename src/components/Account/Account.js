/* eslint-disable */
import React, { Component } from "react";
import { withRouter, Link, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { appId, apiUrl, deliveryId, cookieDefaultConfig } from "../Helpers/Config";
import axios from "axios";
import cookie from "react-cookies";

/* import modules */
import Header from "../Layout/Header";
import Footer from "../Layout/Footer";
import { showAlert } from "../Helpers/SettingHelper";
var Parser = require("html-react-parser");
var qs = require("qs");

class Account extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    let activationKey =
      typeof this.props.match.params.activationKey != "undefined"
        ? this.props.match.params.activationKey
        : "";
    var postObject = {
      app_id: appId,
      key: activationKey,
    };
    axios
      .post(apiUrl + "customer/activation", qs.stringify(postObject))
      .then((res) => {
        const { history } = this.props;

        if (res.data.status === "ok") {
          showAlert(
            "Success",
            "Your account has been successfully activated. Please login to continue."
          );
          $.magnificPopup.open({
            items: {
              src: ".alert_popup",
            },
            type: "inline",
          });
          cookie.save("loginPopup", 1, cookieDefaultConfig);
          history.push("/");
        } else {
          showAlert(
            "Error",
            "Your activation link has been expired. Please contact your admin."
          );
          $.magnificPopup.open({
            items: {
              src: ".alert_popup",
            },
            type: "inline",
          });
          history.push("/");
        }
      });
  }

  render() {
    return <div></div>;
  }
}

Header.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }),
};

export default withRouter(Account);
