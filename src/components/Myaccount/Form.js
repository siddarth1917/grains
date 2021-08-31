/* eslint-disable */

import React, { Component } from "react";
import validator from "validator";
import update from "immutability-helper";
import { validated } from "react-custom-validation";
import Changepassword from "./Changepassword";
import Billingaddress from "./Billingaddress";
import { Link } from "react-router-dom";
import {
  stripslashes,
  addressFormat,
  showAlert,
  callImage,
  showCustomAlert,
  showLoader,
  hideLoader,
} from "../Helpers/SettingHelper";
import {
  appId,
  apiUrl,
  apiUrlV2,
  deliveryId,
  timThumpUrl,
} from "../Helpers/Config";
import axios from "axios";
import cookie from "react-cookies";

import {
  GET_CHANGEPASSWORD,
  GET_ALLUSERSECADDRDATA,
  ADD_USERSECADDRDATA,
} from "../../actions";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import $ from "jquery";
var Parser = require("html-react-parser");

import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

import DatePicker from "react-datepicker";
import { setMinutes, setHours, format } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";

import pflImg from "../../common/images/Member-Icon.png";
import like from "../../common/images/like.png";

var dateFormat = require("dateformat");
var qs = require("qs");
var base64 = require("base-64");
const isEmpty = (value) => (value === "" ? "This field is required." : null);

const isEmail = (email) =>
  validator.isEmail(email) ? null : "This is not a valid email.";

const phonenumberPattern = /^[0-9]{6,14}$/;
const isMobile = (mobile) =>
  mobile.match(phonenumberPattern)
    ? null
    : "This is not a valid mobile number.";

const dobpattern = /^\d{1,2}\/\d{1,2}\/\d{4}$/;

function validationConfig(props) {
  const { firstname, lastname, email, mobile, birthdate } = props.fields;

  return {
    fields: ["firstname", "lastname", "email", "mobile", "birthdate"],

    validations: {
      firstname: [[isEmpty, firstname]],
      lastname: [[isEmpty, lastname]],
      mobile: [
        [isEmpty, mobile],
        [isMobile, mobile],
      ],
      email: [
        [isEmpty, email],
        [isEmail, email],
      ],
      birthdate: [[isEmpty, birthdate]],
    },
  };
}

class Form extends React.Component {
  constructor(props) {
    super(props);
    var Maxdate = new Date();
    Maxdate.setFullYear(Maxdate.getFullYear() - 10);
    this.state = {
      status: "Loading",
      Maxdate: Maxdate,
      secAddrData: [],
      address_added: "no",
      birthdate: "",
      fieldschpassword: {
        oldpin: "",
        newpin: "",
        confirmpin: "",
      },
      fieldsbillingaddress: {
        postalcode: "",
        addressline: "",
        floor_no: "",
        unit_no: "",
      },
    };
    this.handleChangeDate = this.handleChangeDate.bind(this);
    this.changepassword = this.changepassword.bind(this);
    this.props.getSecondaryAddress();
  }

  componentDidMount() {
    /*axios.get(apiUrl + "customer/get_all_user_secondary_address?app_id=" + appId + "&status=A&refrence=" + cookie.load('UserId')).then(res => {
            if (res.data.status === "ok") {
                this.setState({ secAddrData: res.data.result_set });
            } else {
                this.setState({ secAddrData: '', secAddrData: [] });
            }
        }); */
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.secAddrData !== nextProps.secondaryaddress) {
      if (this.state.address_added === "yes") {
        $(".postalcode, .address_line, .floor_no, .unit_no").val("");
        hideLoader("billing-addrs-sbmt", "class");
        window.$.magnificPopup.close();
        showCustomAlert(
          "success",
          "Nice! Your billing address added successfully."
        );
      }
      this.setState({
        secAddrData: nextProps.secondaryaddress,
        address_added: "no",
      });
    }

    if (nextProps.changepassword !== this.props.changepassword) {
      //  const {changepassword} = nextProps.changepassword;
      $(".old_password").val("");
      $(".new_password").val("");
      $(".confirm_password").val("");
      hideLoader("change-pass-sbmt", "class");
      if (nextProps.changepassword[0].status === "ok") {
        showAlert("Success", "PIN changed successfully!");
      } else {
        if (nextProps.changepassword[0].form_error) {
          showAlert("Success", nextProps.changepassword[0].form_error);
        } else {
          showAlert("Success", nextProps.changepassword[0].message);
        }
      }
      window.$.magnificPopup.open({
        items: {
          src: ".alert_popup",
        },
        type: "inline",
      });
    }
  }

  handleChangeDate(datevalue) {
    var dateval = new Date(datevalue);
    dateval = format(dateval, "dd/MM/yyyy");
    cookie.save("birthdate", dateval, { path: "/" });
    this.setState({ birthdate: datevalue });
    this.handleChange("birthdate", datevalue);
  }

  fieldChange = (field, value) => {
    this.setState(
      update(this.state, { fieldschpassword: { [field]: { $set: value } } })
    );
  };

  fieldAddChange = (field, value) => {
    this.setState(
      update(this.state, { fieldsbillingaddress: { [field]: { $set: value } } })
    );
  };

  /* To delete the secondary address */
  deleteSecAddr(addrId) {
    var postObject = {
      app_id: appId,
      type: "web",
      secondary_address_id: addrId,
      refrence: cookie.load("UserId"),
    };

    axios
      .post(
        apiUrl + "customer/secondary_address_remove",
        qs.stringify(postObject)
      )
      .then((response) => {
        if (response.data.status === "ok") {
          this.props.getSecondaryAddress();
          window.$.magnificPopup.close();
          showCustomAlert("success", "Address deleted successfully!");
          // showAlert("Success", "Address deleted successfully!");
          $.magnificPopup.open({
            items: {
              src: ".alert_popup",
            },
            type: "inline",
          });
        } else {
        }
      })
      .catch(function (error) {});
  }

  /* Get Secondary Address Details */
  secondaryAddresslist() {
    if (this.state.secAddrData.length > 0) {
      return this.state.secAddrData.map((addr, index) => (
        <li key={index}>
          <a href={void 0}>
            {addressFormat(
              addr.unit_code,
              addr.unit_code2,
              addr.address,
              addr.country,
              addr.postal_code
            )}
          </a>
          <span
            onClick={() => {
              this.deleteSecAddr(addr.secondary_address_id);
            }}
          ></span>
        </li>
      ));
    } else {
      return <li>No address found</li>;
    }
  }

  /*loadPostalAddress(postal_code,address1) {*/
  loadPostalAddress() {
    var postal = $(".customer_postal_code").val();
    document.getElementById("spn-postalcode-error").innerHTML = "";
    if (postal.length > 5) {
      axios
        .get(
          apiUrl +
            "/settings/get_address?app_id=" +
            appId +
            "&zip_code=" +
            postal
        )
        .then((res) => {
          if (res.data.status === "ok") {
            var address_name =
              res.data.result_set.zip_buno +
              " " +
              res.data.result_set.zip_sname;
            /*$("#customer_address_line1").val(address_name);
                    this.setState({postal :postal });
                    this.setState({address1 :address_name });*/
            this.props.onChange("address1", address_name);
          } else {
            document.getElementById("spn-postalcode-error").innerHTML =
              '<span class="error">This is not a valid postal code.</span>';
            /*$(".customer_postal_code").val('');
                    $("#customer_address_line1").val('');*/
            this.props.onChange("address1", "");
          }
        });
    } else {
      $(".customer_postal_code").val(postal);
    }
  }

  /* Change Password */
  changepassword() {
    var old_pin = $(".old_password").val();
    var new_pin = $(".new_password").val();
    var confirm_pin = $(".confirm_password").val();
    var postObject = {
      app_id: appId,
      type: "web",
      oldpassword: old_pin,
      password: new_pin,
      confirmpassword: confirm_pin,
      refrence: base64.encode(cookie.load("UserId")),
      enc: "Y",
      passwordtype: "PIN",
    };
    showLoader("change-pass-sbmt", "class");
    this.props.getChangePassword(qs.stringify(postObject));
  }

  /* Change Password */
  changeaddress = () => {
    var postalcode = $(".postalcode").val();
    var addressline = $(".address_line").val();
    var unitnumber1 = $(".floor_no").val();
    var unitnumber2 = $(".unit_no").val();
    if (postalcode !== "" && addressline !== "") {
      showLoader("billing-addrs-sbmt", "class");
      var postArr = Array();
      postArr["postalcode"] = postalcode;
      postArr["addressline"] = addressline;
      postArr["unitnumber1"] = unitnumber1;
      postArr["unitnumber2"] = unitnumber2;
      this.setState(
        { address_added: "yes" },
        function () {
          this.props.addSecondaryAddress(postArr);
        }.bind(this)
      );
    }
  };

  handleChange = (item, value) => {
    this.props.onChange(item, value);
    this.setState({ ...this.state, [item]: value });
    var des = document.getElementsByClassName("birthdate");
  };

  render() {
    var displaySts =
      this.state.defaultDispaly === "" ? "none" : this.state.defaultDispaly;

    const {
      fields,
      activityPoints,
      onChange,
      onValid,
      onInvalid,
      $field,
      $validation,
    } = this.props;

    let PreviousOrderAddressTitle,
      errMsgFirstname,
      errMsgLastname,
      errMsgEmail,
      errMsgMobile,
      errMsgPostal,
      errMsgbirthdate;

    if ($validation.firstname.error.reason !== undefined) {
      errMsgFirstname = $validation.firstname.show && (
        <span className="error">{$validation.firstname.error.reason}</span>
      );
    }

    if ($validation.lastname.error.reason !== undefined) {
      errMsgLastname = $validation.lastname.show && (
        <span className="error">{$validation.lastname.error.reason}</span>
      );
    }

    if ($validation.email.error.reason !== undefined) {
      errMsgEmail = $validation.email.show && (
        <span className="error">{$validation.email.error.reason}</span>
      );
    }

    if ($validation.mobile.error.reason !== undefined) {
      errMsgMobile = $validation.mobile.show && (
        <span className="error">{$validation.mobile.error.reason}</span>
      );
    }

    if ($validation.birthdate.error.reason !== undefined) {
      errMsgbirthdate = $validation.birthdate.show && (
        <span className="error">{$validation.birthdate.error.reason}</span>
      );
    }

    var genderlabel = "";
    var gender = "";
    if (fields.gender == "M") {
      genderlabel = "Male";
      gender = "M";
    } else if (fields.gender == "F") {
      genderlabel = "Female";
      gender = "F";
    } else if (fields.gender == "O") {
      genderlabel = "Unspecified";
      gender = "O";
    }

    var genderBoxHtml = "<option value='M'>Male</option>";
    genderBoxHtml += "<option value='F'>Female</option>";
    genderBoxHtml += "<option value='O'>Unspecified</option>";
    var genderSelectDropDown = Parser(genderBoxHtml);

    var joined_date = "";
    if (fields.joinedOn !== "" && fields.joinedOn != undefined) {
      var joinedDateArr = fields.joinedOn.split(" ");
      var joinedDateObj =
        joinedDateArr[0] !== "" ? new Date(joinedDateArr[0]) : new Date();
      joined_date = format(joinedDateObj, "dd/MM/yyyy");
    }
    var birthdate = new Date();
    if (this.state.birthdate !== "") {
      birthdate = this.state.birthdate;
    } else if (
      fields.birthdate !== "" &&
      fields.birthdate !== "0000-00-00" &&
      fields.birthdate !== "00/00/0000"
    ) {
      birthdate = new Date(fields.birthdate);
    }

    if (typeof this.props.customerdetail !== undefined) {
      let customer_membership_type = "";
      let customer_membership_type_display = "";
      let customer_unique_id = "";
      let calc_kakis_perc = 0;
      let calc_kakis_perc_display = "";

      if (Object.keys(this.props.customerdetail).length) {
        customer_membership_type =
          this.props.customerdetail[0].result_set.customer_membership_type;
        customer_unique_id =
          this.props.customerdetail[0].result_set.customer_unique_id;

        let membership_max_amount =
          this.props.customerdetail[0].result_set.membership_max_amount;
        let membership_spent_amount =
          this.props.customerdetail[0].result_set.membership_spent_amount;

        let membership_spent_msg =
          this.props.customerdetail[0].result_set.membership_spent_msg;

        if (
          customer_membership_type !== "" &&
          customer_membership_type !== "Normal" &&
          customer_membership_type !== "undefined"
        ) {
          customer_membership_type_display = (
            <div className="membership-desc">
              {" "}
              <img src={like} alt="like" />
              {customer_membership_type} Member
            </div>
          );
        }

        if (parseInt(customer_unique_id)) {
          customer_unique_id = (
            <div className="user-id">
              <span>User Id</span> - {customer_unique_id}
            </div>
          );
        } else {
          customer_unique_id = "";
        }

        if (parseInt(membership_max_amount)) {
          calc_kakis_perc =
            (membership_spent_amount / membership_max_amount) * 100;
        }
        console.log(
          calc_kakis_perc,
          "calc_kakis_perc",
          customer_membership_type,
          membership_max_amount
        );
        if (customer_membership_type === "Normal" && membership_max_amount) {
          calc_kakis_perc_display = (
            <div className="membership-progress">
              <div className="pg-bar">
                <span style={{ width: calc_kakis_perc + "%" }}></span>
              </div>{" "}
              <p>{membership_spent_msg}</p>
            </div>
          );
        }
      }

      return (
        <div className="container-one">
          <div className="tab-content">
            <div className="tab-pane account-tab-section fade in active">
              <h4 className="tab_mobtrigger active">
                Account Information<i></i>
              </h4>
              <div className="tab_mobrow main_tabin">
                <div className="box_in">
                  <div className="account_sec">
                    <div className="accmenu_sec">
                      <div className="accprofile text-center">
                        <div className="accprofile_img">
                          <img
                            src={
                              fields.photo !== null &&
                              fields.photo !== "" &&
                              fields.photo !== "null"
                                ? fields.photo
                                : pflImg
                            }
                            alt=""
                          />
                        </div>

                        <div className="accprofile_descs">
                          {/*customer_membership_type_display*/}

                          {customer_unique_id}
                        </div>

                        <div className="accprofile_info">
                          <p className="text-uppercase">Date Joined</p>
                          <p>{joined_date}</p>
                        </div>

                        {calc_kakis_perc_display}
                      </div>

                      <div className="setting_menu_list">
                        <ul>
                          <li>
                            <a
                              href="#change-password-popup"
                              className="open-popup-link"
                            >
                              <i className="setting_menu_list_icon password_icon"></i>
                              Change PIN
                            </a>
                          </li>
                          <li>
                            <a href="/logout">
                              <i className="setting_menu_list_icon logout_icon"></i>
                              Logout
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="accsec_right">
                      <h1>
                        Hello, {fields.firstname} {fields.lastname}
                      </h1>
                      <p>
                        My Account Dashboard allows you to view your recent
                        activities, check your reward points and update account
                        information.
                      </p>

                      <div className="acc-inform">
                        {/* profile-info-div - end */}
                        <div className="profile-info-div">
                          <h4 className="form_grouptt">
                            Your Account Information
                          </h4>

                          <div className="form-group">
                            <div className="row">
                              <div className="col-md-6">
                                <div
                                  className={
                                    fields.firstname != ""
                                      ? "focus-out focused"
                                      : "focus-out"
                                  }
                                >
                                  <label>Name</label>
                                  <input
                                    type="text"
                                    id="firstname"
                                    className="form-control input-focus"
                                    value={fields.firstname || ""}
                                    {...$field("firstname", (e) =>
                                      onChange("firstname", e.target.value)
                                    )}
                                  />
                                  {errMsgFirstname}
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div
                                  className={
                                    fields.lastname != ""
                                      ? "focus-out focused"
                                      : "focus-out"
                                  }
                                >
                                  <label>Last Name</label>
                                  <input
                                    type="text"
                                    value={fields.lastname || ""}
                                    {...$field("lastname", (e) =>
                                      onChange("lastname", e.target.value)
                                    )}
                                    className="form-control input-focus"
                                  />
                                  {errMsgLastname}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="form-group">
                            <div className="row">
                              <div className="col-md-6">
                                <div
                                  className={
                                    fields.customer_nick_name != ""
                                      ? "focus-out focused"
                                      : "focus-out"
                                  }
                                >
                                  <label>PreferredName</label>
                                  <input
                                    type="text"
                                    name="customer_nick_name"
                                    value={fields.nickname || ""}
                                    {...$field("nickname", (e) =>
                                      onChange("nickname", e.target.value)
                                    )}
                                    className="form-control input-focus"
                                  />
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div
                                  className={
                                    fields.mobile != ""
                                      ? "focus-out focused"
                                      : "focus-out"
                                  }
                                >
                                  <label>Mobile Number</label>
                                  <input
                                    type="text"
                                    name="customer_phone"
                                    value={fields.mobile || ""}
                                    {...$field("mobile", (e) =>
                                      onChange("mobile", e.target.value)
                                    )}
                                    className="form-control input-focus"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="form-group">
                            <div className="row">
                              <div className="col-md-6">
                                <div
                                  className={
                                    fields.email != ""
                                      ? "focus-out focused"
                                      : "focus-out"
                                  }
                                >
                                  <label>Email Address</label>
                                  <input
                                    type="email"
                                    name="customer_email"
                                    value={fields.email || ""}
                                    {...$field("email", (e) =>
                                      onChange("email", e.target.value)
                                    )}
                                    className="form-control input-focus"
                                  />
                                  {errMsgEmail}
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="row">
                                  <div className="col-md-6">
                                    <div
                                      className={
                                        birthdate != ""
                                          ? "focus-out focused"
                                          : "focus-out"
                                      }
                                    >
                                      <label>Birthday</label>
                                      <div className="react_datepicker">
                                        <DatePicker
                                          peekNextMonth
                                          showMonthDropdown
                                          showYearDropdown
                                          dropdownMode="select"
                                          className="form-control"
                                          selected={birthdate}
                                          maxDate={this.state.Maxdate}
                                          dateFormat="dd/MM/yyyy"
                                          onChange={this.handleChangeDate}
                                        />

                                        {errMsgbirthdate}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="re_select">
                                      {(gender !== "" ||
                                        fields.gender !== "") && (
                                        <Select
                                          defaultValue={{
                                            value: gender,
                                            label: genderlabel,
                                          }}
                                          onChange={onChange.bind(
                                            this,
                                            "gender"
                                          )}
                                          options={[
                                            { value: "M", label: "Male" },
                                            { value: "F", label: "Female" },
                                            {
                                              value: "O",
                                              label: "Unspecified",
                                            },
                                          ]}
                                        />
                                      )}
                                    </div>

                                    {/*<div className="form-group custom_select">
																<select name="gender" value={gender} className="components_selct" onChange={onChange.bind(this, 'gender')} id='gender' >
																{genderSelectDropDown}
																</select>
															</div>*/}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="form-group">
                            <div className="row"></div>
                          </div>
                        </div>
                        {/* profile-info-div - end */}

                        {/* address-info-div - start */}
                        <div className="address-info-div">
                          <h4 className="form_grouptt">Address</h4>
                          <div className="form-group">
                            <div className="row">
                              <div className="col-md-6">
                                <div
                                  className={
                                    fields.postal != ""
                                      ? "focus-out focused"
                                      : "focus-out"
                                  }
                                >
                                  <label>Postal Code</label>
                                  <input
                                    type="text"
                                    maxLength="6"
                                    id="postal-code"
                                    value={fields.postal || ""}
                                    {...$field("postal", (e) =>
                                      onChange("postal", e.target.value)
                                    )}
                                    onBlur={this.loadPostalAddress.bind(this)}
                                    className="form-control input-focus customer_postal_code"
                                  />
                                  <div id="spn-postalcode-error"></div>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div
                                  className={
                                    fields.address1 != ""
                                      ? "focus-out focused"
                                      : "focus-out"
                                  }
                                >
                                  <label>Address Line 1</label>
                                  <input
                                    type="text"
                                    id="customer_address_line1"
                                    className="form-control input-focus"
                                    value={fields.address1 || ""}
                                    {...$field("address1", (e) =>
                                      onChange("address1", e.target.value)
                                    )}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="form-group">
                            <div className="row">
                              <div className="col-md-6">
                                <div className="row">
                                  <div className="col-md-6">
                                    <div
                                      className={
                                        fields.unitnumber1 != ""
                                          ? "focus-out focused"
                                          : "focus-out"
                                      }
                                    >
                                      <label>Unit Number 1</label>
                                      <input
                                        type="text"
                                        className="form-control input-focus"
                                        value={fields.unitnumber1 || ""}
                                        {...$field("unitnumber1", (e) =>
                                          onChange(
                                            "unitnumber1",
                                            e.target.value
                                          )
                                        )}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div
                                      className={
                                        fields.unitnumber2 != ""
                                          ? "focus-out focused"
                                          : "focus-out"
                                      }
                                    >
                                      <label>Unit Number 2</label>
                                      <input
                                        type="text"
                                        className="form-control input-focus"
                                        value={fields.unitnumber2 || ""}
                                        {...$field("unitnumber2", (e) =>
                                          onChange(
                                            "unitnumber2",
                                            e.target.value
                                          )
                                        )}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <button
                                  type="button"
                                  className="myaccount_update button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    this.props.$submit(onValid, onInvalid);
                                  }}
                                >
                                  Update
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* address-info-div - end */}
                      </div>

                      <div className="other-add">
                        <h4 className="form_grouptt">
                          Other Address{" "}
                          <a
                            href="#billing-address-popup"
                            className="open-popup-link add-address-more"
                          >
                            <i
                              className="fa fa-plus-circle"
                              data-unicode="f055"
                            ></i>
                          </a>
                        </h4>
                        <div className="other-add-body mCustomScrollbar">
                          <div>
                            <ul className="other-add-row">
                              {this.secondaryAddresslist()}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            id="change-password-popup"
            className="white-popup mfp-hide popup_sec changepw_popup"
          >
            <div className="pouup_in">
              <div id="form-msg"></div>
              <h3 className="title1 text-center">Change PIN</h3>
              <Changepassword
                fields={this.state.fieldschpassword}
                onChange={this.fieldChange}
                onValid={this.changepassword}
                onInvalid={() => console.log("Form invalid!")}
              />
            </div>
          </div>

          <div
            id="billing-address-popup"
            className="white-popup mfp-hide popup_sec changepw_popup"
          >
            <div className="pouup_in">
              <div id="form-msg"></div>
              <h3 className="title1 text-center">Billing Address</h3>
              <Billingaddress
                fields={this.state.fieldsbillingaddress}
                onChange={this.fieldAddChange}
                onValid={this.changeaddress}
                onInvalid={() => console.log("Form invalid!")}
              />
            </div>
          </div>
        </div>
      );
    } else {
      return <div id="dvLoading"></div>;
    }
  }
}
Form = validated(validationConfig)(Form);

const mapStateToProps = (state) => {
  var secondaryArr = Array();
  if (Object.keys(state.secondaryaddress).length > 0) {
    if (state.secondaryaddress[0].status === "ok") {
      secondaryArr = state.secondaryaddress[0].result_set;
    }
  }

  return {
    secondaryaddress: secondaryArr,
    changepassword: state.changepassword,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getSecondaryAddress: () => {
      dispatch({ type: GET_ALLUSERSECADDRDATA });
    },
    addSecondaryAddress: (addPram) => {
      dispatch({ type: ADD_USERSECADDRDATA, addPram });
    },
    getChangePassword: (formPayload) => {
      dispatch({ type: GET_CHANGEPASSWORD, formPayload });
    },
  };
};
Form.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }),
};
export default connect(mapStateToProps, mapDispatchToProps)(Form);
