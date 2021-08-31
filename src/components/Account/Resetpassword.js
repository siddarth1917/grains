/* eslint-disable */
import React, { Component } from "react";
import { withRouter, Link, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { appId, apiUrl, deliveryId } from "../Helpers/Config";
import axios from "axios";
import cookie from "react-cookies";

/* import modules */
import Header from "../Layout/Header";
import Footer from "../Layout/Footer";
import { showAlert } from "../Helpers/SettingHelper";
var Parser = require("html-react-parser");
var qs = require("qs");

class Resetpassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: {},
      errors: {},
    };
  }

  componentDidMount() {
    var resetKey = this.props.match.params.resetKey;
    this.setState({ resetKey: resetKey });

    /* for account reset - start */
    if (typeof resetKey === "undefined" || resetKey === "") {
      showAlert("Error", "Please check your reset key.");

      const { history } = this.props;

      history.push("/");
    } else {
      $.magnificPopup.open({
        items: {
          src: "#reset-password-popup",
        },
        type: "inline",
        closeOnBgClick: false,
      });

      //$(".mfp-close").remove();
    }
  }

  handleValidation() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;

    //new pin
    if (!fields["new_pin"]) {
      formIsValid = false;
      errors["new_pin"] = "New PIN is required.";
    }
    //confirm pin
    if (!fields["confirm_pin"]) {
      formIsValid = false;
      errors["confirm_pin"] = "Confirm PIN is required.";
    }
    this.setState({ errors: errors });
    return formIsValid;
  }

  resetpasswordSubmit(e) {
    e.preventDefault();
    $(".spn-error").html("");
    if (this.handleValidation()) {
      var postObject = {
        app_id: appId,
        key: this.state.resetKey,
        password: this.state.fields["new_pin"],
        confirmpassword: this.state.fields["confirm_pin"],
        type: "PIN",
      };
      $(".spn-error").html("");
      $("#form-msg").html("");
      axios
        .post(apiUrl + "customer/resetpassword", qs.stringify(postObject))
        .then((res) => {
          if (res.data.status === "ok") {
            showAlert("Success", res.data.message);
            $.magnificPopup.open({
              items: {
                src: ".alert_popup",
              },
              type: "inline",
            });

            const { history } = this.props;

            history.push("/");
          } else {
            if (res.data.form_error) {
              //document.getElementById("form-error").innerHTML = '<div class="box_error"><ul><li>' + response.data.form_error + '</li></ul></div>';
              document.getElementById("form-msg").innerHTML =
                '<span class="error">' + res.data.form_error + "</span>";
            } else {
              $(".spn-error").html(res.data.message);
            }
          }
        });
    }
  }

  handleChange(field, e) {
    let fields = this.state.fields;
    fields[field] = e.target.value;
    this.setState({ fields });
  }

  render() {
    const {
      fields,
      onChange,
      onValid,
      onInvalid,
      $field,
      $validation,
    } = this.props;
    let errMsgEmail, errMsgPassword;
    /*if ($validation.email.error.reason !== undefined) {
            errMsgEmail = ($validation.email.show && <span className="error">{$validation.email.error.reason}</span>)
        } */
    return (
      <div
        id="reset-password-popup"
        className="white-popup mfp-hide popup_sec resetpw_popup changepw_popup"
      >
        <div className="pouup_in">
          <h3 className="title1 text-center">Reset PIN</h3>

          <div className="popup-body">
            <span className="spn-error alert alert_success"></span>

            <div className="form-group">
              <div className="focus-out">
                <label>New PIN</label>
                <input
                  type="password"
                  minlegth="6"
                  className="form-control input-focus"
                  onChange={this.handleChange.bind(this, "new_pin")}
                />
                {this.state.errors["new_pin"] ? (
                  <span className="error">{this.state.errors["new_pin"]}</span>
                ) : (
                  ""
                )}
              </div>
            </div>

            <div className="form-group">
              <div className="focus-out">
                <label>Confirm PIN</label>
                <input
                  type="password"
                  minlegth="6"
                  className="form-control input-focus"
                  onChange={this.handleChange.bind(this, "confirm_pin")}
                />
                {this.state.errors["confirm_pin"] ? (
                  <span className="error">
                    {this.state.errors["confirm_pin"]}
                  </span>
                ) : (
                  ""
                )}
                <div id="form-msg"></div>
              </div>
            </div>

            <div className="form-group">
              <div className="login_pop_sub">
                <button
                  type="button"
                  className="button btn_black btn_minwid"
                  onClick={this.resetpasswordSubmit.bind(this)}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Header.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }),
};

export default withRouter(Resetpassword);
