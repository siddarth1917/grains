/* eslint-disable */
import React, { Component } from "react";
//import validator from 'validator'
/*import update from 'immutability-helper'*/
import { validated } from "react-custom-validation";

function validationConfigPassword(props) {
  const { oldpin, newpin, confirmpin } = props.fields;
  return {
    fields: ["oldpin", "newpin", "confirmpin"],
    validations: {
      oldpin: [[isEmpty, oldpin]],
      newpin: [[isEmpty, newpin]],
      confirmpin: [[isEmpty, confirmpin]],
    },
  };
}

const isEmpty = (value) => (value === "" ? "This field is required." : null);

class Changepassword extends Component {
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
    let errMsgOld, errMsgNew, errMsgConfirm;

    if ($validation.oldpin.error.reason !== undefined) {
      errMsgOld = $validation.oldpin.show && (
        <span className="error">{$validation.oldpin.error.reason}</span>
      );
    }
    if ($validation.newpin.error.reason !== undefined) {
      errMsgNew = $validation.newpin.show && (
        <span className="error">{$validation.newpin.error.reason}</span>
      );
    }
    if ($validation.confirmpin.error.reason !== undefined) {
      errMsgConfirm = $validation.confirmpin.show && (
        <span className="error">{$validation.confirmpin.error.reason}</span>
      );
    }

    return (
      <div className="popup-body">
        <form className="form_sec">
          <div className="form-group">
            <div className="focus-out">
              <label>Current PIN</label>
              <input
                type="password"
                className="form-control input-focus old_password"
                {...$field("oldpin", (e) => onChange("oldpin", e.target.value))}
              />
              {errMsgOld}
            </div>
          </div>
          <div className="form-group">
            <div className="focus-out">
              <label>New PIN</label>
              <input
                type="password"
                className="form-control input-focus new_password"
                {...$field("newpin", (e) => onChange("newpin", e.target.value))}
              />
              {errMsgNew}
            </div>
          </div>
          <div className="form-group">
            <div className="focus-out">
              <label>Re-enter New PIN</label>
              <input
                type="password"
                className="form-control input-focus confirm_password"
                {...$field("confirmpin", (e) =>
                  onChange("confirmpin", e.target.value)
                )}
              />
              {errMsgConfirm}
            </div>
          </div>
          <div className="form-group">
            <div className="login_pop_sub change-pass-sbmt">
              <button
                type="button"
                className="button btn_black btn_minwid"
                onClick={(e) => {
                  e.preventDefault();
                  this.props.$submit(onValid, onInvalid);
                }}
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}
Changepassword = validated(validationConfigPassword)(Changepassword);

export default Changepassword;
