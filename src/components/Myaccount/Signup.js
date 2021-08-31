/* eslint-disable */
import React, { Component } from "react";

import { withRouter } from "react-router-dom";
import { appId, apiUrl } from "../Helpers/Config";
import { validated } from "react-custom-validation";
import validator from "validator";

const isEmpty = (value) => (value === "" ? "This field is required." : null);
const isEmail = (email) =>
  validator.isEmail(email) ? null : "This is not a valid email.";

const minLength = (pin, length) =>
  pin.length >= length ? null : "PIN must be at least 6 characters.";

const areSame = (pin, rePin) => (pin === rePin ? null : "PIN do not match.");

const isChecked = (terms) =>
  terms ? null : "Please accept terms and conditions";

function validationConfigSignup(props) {
  const { firstname, email, pin, rePin, mobile, terms } = props.fields;

  return {
    fields: ["firstname", "email", "pin", "rePin", "mobile", "terms"],

    validations: {
      firstname: [[isEmpty, firstname]],
      email: [
        [isEmail, email],
        /* [isUnique, email]*/
      ],
      pin: [[minLength, pin, 6]],
      rePin: {
        rules: [[areSame, pin, rePin]],
        fields: ["pin", "rePin"],
      },
      mobile: [
        [isEmpty, mobile],
        [isMobile, mobile],
        /* [isPhonenumerExist, mobile]*/
      ],
      terms: [[isChecked, terms, 1]],
    },
  };
}

const phonenumberPattern = /^[0-9]{6,14}$/;
const isMobile = (mobile) =>
  mobile.match(phonenumberPattern) ? null : "please enter valid Mobile Number.";

const isUnique = (email) => {
  var qs = require("qs");
  var postObject = {
    app_id: appId,
    type: "web",
    customer_email: email,
  };

  axios
    .post(apiUrl + "customer/email_exist", qs.stringify(postObject))
    .then((response) => {
      if (response.data.status === "ok") {
        document.getElementById("spn-email-error").innerHTML = "";
      } else {
        document.getElementById("spn-email-error").innerHTML =
          '<span class="error">Email already exists</span>';
      }
    });
};

const isPhonenumerExist = (mobile) => {
  var qs = require("qs");
  var postObject = {
    app_id: appId,
    type: "web",
    customer_phone: mobile,
  };
  axios
    .post(apiUrl + "customer/phoneno_exist", qs.stringify(postObject))
    .then((response) => {
      if (response.data.status === "ok") {
        document.getElementById("spn-mobile-error").innerHTML = "";
      } else {
        document.getElementById("spn-mobile-error").innerHTML =
          '<span class="error">Mobile number already exists</span>';
      }
    });
};

class Signup extends Component {
  constructor(props) {
    super(props);
  }

  closepopup(path) {
    const { history } = this.props;
    history.push(path);
    $.magnificPopup.close();
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
    const spanStyle = {
      clear: "both",
    };
    let errMsgFirstName,
      errMsgEmail,
      errMsgPin,
      errMsgrePin,
      errMsgMobile,
      errMsgTerms;

    if ($validation.firstname.error.reason !== undefined) {
      errMsgFirstName = $validation.firstname.show && (
        <span className="error">{$validation.firstname.error.reason}</span>
      );
    }
    if ($validation.email.error.reason !== undefined) {
      errMsgEmail = $validation.email.show && (
        <span className="error">{$validation.email.error.reason}</span>
      );
    }
    if ($validation.pin.error.reason !== undefined) {
      errMsgPin = $validation.pin.show && (
        <span className="error">{$validation.pin.error.reason}</span>
      );
    }
    if ($validation.rePin.error.reason !== undefined) {
      errMsgrePin = $validation.rePin.show && (
        <span className="error">{$validation.rePin.error.reason}</span>
      );
    }
    if ($validation.mobile.error.reason !== undefined) {
      errMsgMobile = $validation.mobile.show && (
        <span className="error">{$validation.mobile.error.reason}</span>
      );
    }
    if ($validation.terms.error.reason !== undefined) {
      errMsgTerms = $validation.terms.show && (
        <span className="error">{$validation.terms.error.reason}</span>
      );
    }

    return (
      <div className="popup-body">
        <h4>Enter Your Information</h4>
        <div className="form-group">
          <div className="focus-out">
            <label>Name</label>
            <input
              type="text"
              className="form-control input-focus"
              value={fields.firstname}
              {...$field("firstname", (e) =>
                onChange("firstname", e.target.value)
              )}
            />
            {errMsgFirstName}
          </div>
        </div>
        <div className="form-group">
          <div className="focus-out">
            <label>Enter Mobile Number</label>
            <input
              type="tel"
              className="form-control input-focus"
              pattern="\d*"
              value={fields.mobile}
              {...$field("mobile", (e) => onChange("mobile", e.target.value))}
            />
            <div id="spn-mobile-error">{errMsgMobile}</div>
          </div>
        </div>
        <div className="form-group">
          <div className="focus-out">
            <label>Email Address</label>
            <input
              type="text"
              className="form-control input-focus"
              value={fields.email}
              {...$field("email", (e) => onChange("email", e.target.value))}
            />
            <div id="spn-email-error">{errMsgEmail}</div>
          </div>
        </div>
        <div className="form-group">
          <div className="focus-out">
            <label>PIN</label>
            <input
              type="password"
              className="form-control input-focus"
              value={fields.pin}
              {...$field("pin", (e) => onChange("pin", e.target.value))}
            />
            {errMsgPin}
          </div>
        </div>
        <div className="form-group">
          <div className="focus-out">
            <label>Confirm PIN</label>
            <input
              type="password"
              className="form-control input-focus"
              value={fields.rePin}
              {...$field("rePin", (e) => onChange("rePin", e.target.value))}
            />
            {errMsgrePin}
          </div>
        </div>
        <div className="form-group">
          <div className="custom_checkbox custom_checkbox_content">
            <input
              type="checkbox"
              id="terms"
              checked={fields.terms}
              {...$field(
                "terms",
                (e) => onChange("terms", e.target.value),
                null,
                false
              )}
            />{" "}
            <span></span>
            <div className="sign_reg">
              <p>
                I agree with Grains & Co,&nbsp;
                <a
                  className="sign_reg_uline"
                  onClick={(e) => {
                    e.preventDefault();
                    this.closepopup("/terms-and-conditions");
                  }}
                  href="terms-of-use"
                >
                  Terms &amp; Conditions.
                </a>
              </p>
            </div>
          </div>
          {errMsgTerms}
        </div>
        <div className="form-group">
          <div className="login_pop_sub">
            <button
              type="button"
              className="button btn_black btn_minwid signup_submit"
              onClick={(e) => {
                e.preventDefault();
                this.props.$submit(onValid, onInvalid);
              }}
            >
              Submit
            </button>
          </div>
        </div>

        <div className="form-group-11">
          <div className="controls single-link">
            <a href="#login-popup" className="open-popup-link">
              Back to login
            </a>
          </div>
        </div>
      </div>
    );
  }
}
Signup = validated(validationConfigSignup)(Signup);

export default withRouter(Signup);
