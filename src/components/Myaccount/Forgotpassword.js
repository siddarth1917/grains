/* eslint-disable */
import React, { Component } from "react";
import { validated } from "react-custom-validation";

const isEmpty = (value) => (value === "" ? "This field is required." : null);

const isEmail = (email) =>
  validator.isEmail(email) ? null : "This is not a valid email.";

function validationForgot(props) {
  const { email } = props.fields;
  return {
    fields: ["email"],
    validations: {
      email: [[isEmpty, email]],
    },
  };
}

class Forgotpassword extends Component {
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
    let errMsgEmail, errMsgPassword;
    if ($validation.email.error.reason !== undefined) {
      errMsgEmail = $validation.email.show && (
        <span className="error">{$validation.email.error.reason}</span>
      );
    }
    return (
      <div className="popup-body">
        <div className="form-group">
          <div className="focus-out">
            <label>Email Address</label>
            <input
              type="email"
              className="form-control input-focus"
              value={fields.email}
              {...$field("email", (e) => onChange("email", e.target.value))}
            />
            {errMsgEmail}
            <div id="form-msg"></div>
          </div>
        </div>
        <div className="form-group">
          <div className="login_pop_sub">
            <button
              type="button"
              className="button btn_black btn_minwid forgotpassword-cls"
              onClick={(e) => {
                e.preventDefault();
                this.props.$submit(onValid, onInvalid);
              }}
            >
              Get Reset Link
            </button>
          </div>
        </div>

        <div className="form-group">
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

Forgotpassword = validated(validationForgot)(Forgotpassword);

export default Forgotpassword;
