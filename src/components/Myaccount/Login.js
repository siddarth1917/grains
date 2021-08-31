/* eslint-disable */
import React, { Component } from "react";
import { validated } from "react-custom-validation";
import validator from "validator";
const isEmpty = (value) => (value === "" ? "This field is required." : null);

function validationConfig(props) {
  const { email, pin } = props.fields;

  return {
    fields: ["email", "pin"],

    validations: {
      email: [[isEmpty, email]],
      pin: [[isEmpty, pin]],
    },
  };
}

class Login extends Component {
  constructor(props) {
    super(props);
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
    let errMsgEmail, errMsgPin;

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

    return (
      <div className="popup-body">
        <span className="spn-error"></span>
        <div className="form-group">
          <div className="focus-out">
            <label>Enter Mobile Number</label>
            <input
              type="text"
              className="form-control input-focus"
              value={fields.email}
              {...$field("email", (e) => onChange("email", e.target.value))}
            />
            {errMsgEmail}
          </div>
        </div>
        <div className="form-group">
          <div className="focus-out">
            <label>Enter Your PIN</label>

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
          <div className="login_pop_sub">
            <button
              className="button btn_black btn_minwid login_submit"
              onClick={(e) => {
                e.preventDefault();
                this.props.$submit(onValid, onInvalid);
              }}
            >
              {" "}
              Submit{" "}
            </button>
          </div>
        </div>

        <div className="form-group">
          <div className="controls two-links">
            <a
              href="#signup-popup"
              data-effect="mfp-zoom-in"
              className="open-popup-link"
            >
              {" "}
              Create an account
            </a>
            <span className="spilter"> </span>
            <a href="#forgot-password-popup" className="open-popup-link">
              Forgot Pin
            </a>{" "}
          </div>
        </div>
      </div>
    );
  }
}
Login = validated(validationConfig)(Login);

export default Login;
