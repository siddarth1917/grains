/* eslint-disable */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { stripslashes, showAlert } from "../Helpers/SettingHelper";
import { appId } from "../Helpers/Config";
var Parser = require("html-react-parser");
import update from "immutability-helper";
import { validated } from "react-custom-validation";
import validator from "validator";
import axios from "axios";
import Header from "../Layout/Header";
import Footer from "../Layout/Footer";

import { connect } from "react-redux";
import innerbanner from "../../common/images/inner-banner.jpg";

import {
  GET_PICKUP_OUTLETS,
  GET_CONTACTDATA,
  GET_CONTACTCONTENT,
  GET_GLOBAL_SETTINGS,
  GET_REQUESTPAGEDATA,
} from "../../actions";

var Parser = require("html-react-parser");

class Contact extends Component {
  constructor(props) {
    super(props);

    this.state = {
      outlet_loaded: "no",
      outlets_result: [],
      outlets: [],
      outlet_id: "",
      fields: {
        name: "",
        mobile: "",
        subject: "",
        email: "",
        type: "",
        message: "",
      },
      pageTitle: "",
      pageDesc: "",
      status: "",
      windowHeight: 0,
      pagedata: [],
      pagedetail: "",
      pagetitle_txt: "",
      pagecommon: [],
      pagegallery: [],
    };
    this.props.getRequestpage("contact-us");
  }

  fieldChange = (field, value) => {
    this.setState(update(this.state, { fields: { [field]: { $set: value } } }));
  };

  handleFormSubmit = () => {
    const formPayload = this.state.fields;

    var qs = require("qs");
    var postObject = {
      app_id: appId,
      customer_first_name: formPayload.name,
      customer_emailaddress: formPayload.email,
      customer_phonenumber: formPayload.mobile,
      subject: formPayload.type,
      customer_message: formPayload.message,
    };

    this.props.getContactData(qs.stringify(postObject));
  };

  componentDidMount() {
    this.props.getGlobalSettings();
    /*this.props.getPickupOutlets();*/
    $("html, body").animate({ scrollTop: 0 }, 800);
  }

  handleShowAlertFun(header, msg) {
    var magnfPopup = $.magnificPopup.instance;
    showAlert(header, msg, magnfPopup);
    $.magnificPopup.open({
      items: {
        src: ".alert_popup",
      },
      type: "inline",
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.contactdata !== this.props.contactdata) {
      if (nextProps.contactdata[0].status === "ok") {
        this.handleShowAlertFun("success", nextProps.contactdata[0].message);

        setTimeout(function () {
          window.location.reload();
        }, 3000);
      } else {
        this.handleShowAlertFun("success", nextProps.contactdata[0].message);

        $.magnificPopup.open({
          items: {
            src: ".alert_popup",
          },
          type: "inline",
        });
      }
    }
    if (nextProps.pagedata !== this.state.pagedata) {
      $(".dvLoadrCls").fadeOut(500);
      var pageDetails = "";
      var pageTitleTxt = "";
      var pagegallery = [];
      if (Object.keys(nextProps.pagedata).length > 0) {
        var pagedataTxt = nextProps.pagedata[0].cmspage_description;
        pageTitleTxt = nextProps.pagedata[0].cmspage_title;
        pagegallery = nextProps.pagedata[0].gallery_images;
        pageDetails = pagedataTxt !== "" ? Parser(pagedataTxt) : "";
      }

      this.setState({
        pagedata: nextProps.pagedata,
        pagedetail: pageDetails,
        pagetitle_txt: pageTitleTxt,
        pagecommon: nextProps.pagecommon,
        pagegallery: pagegallery,
      });
    }
  }

  sateValChangefn(outlvalue) {
    this.setState({ outlet_id: outlvalue });
  }

  getOutletData = () => {
    var outLetLst = this.state.outlets;
    var outletId = this.state.outlet_id;
    if (Object.keys(outLetLst).length > 0) {
      var listhtml = outLetLst.map((item, index) => (
        <div
          key={index}
          onClick={this.sateValChangefn.bind(this, item.outlet_id)}
          className={
            outletId === item.outlet_id ? "locate-lirow active" : "locate-lirow"
          }
        >
          <h4>{stripslashes(item.outlet_name)}</h4>
          <p>{item.outlet_address_line1}</p>
          <p>
            Phone: <span className="phone-show-dskp">{item.outlet_phone}</span>
            <span className="phone-show-mbl">
              {" "}
              <a href={this.callPhoneOptn(item.outlet_phone)}>
                {item.outlet_phone}
              </a>
            </span>
          </p>
        </div>
      ));
      return listhtml;
    } else {
      return "";
    }
  };

  contMapHtml = () => {
    var outletId = this.state.outlet_id;
    /* jankosoft 'Dempsey' => 190 */
    if (outletId === "218") {
      return (
        <div>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.784116066201!2d103.80677851426552!3d1.30458871208381!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31da1a3cb9baec87%3A0x9afb0ed56701e15!2sMuthu&#39;s+Curry!5e0!3m2!1sen!2sin!4v1559310893750!5m2!1sen!2sin"
            width="600"
            height="450"
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </div>
      );
    }
    /* jankosoft 'Race Course' => 192 */
    if (outletId === "216") {
      return (
        <div>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.775596869837!2d103.84998271832654!3d1.3099511611600971!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31da19c71f708091%3A0xcb1c05d04cdfa80f!2sMuthu&#39;s+Curry!5e0!3m2!1sen!2sin!4v1559311174739!5m2!1sen!2sin"
            width="600"
            height="450"
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </div>
      );
    }
    /* jankosoft 'Suntec' => 191 */
    if (outletId === "217") {
      return (
        <div>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.7996915113254!2d103.85716761426546!3d1.294727262111923!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31da19a8a51c9f51%3A0x882bc15b9ef17943!2sMuthu&#39;s+Curry!5e0!3m2!1sen!2sin!4v1559311243416!5m2!1sen!2sin"
            width="600"
            height="450"
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </div>
      );
    }
  };

  render() {
    return (
      <div className="contactusmain-top-div">
        <Header />
        <div className="common-inner-blckdiv">
          <div className="common-inner-banner">
            <div className="page-banner">
              <img
                src={
                  this.state.pagegallery.length > 0 &&
                  this.state.pagecommon !== "" &&
                  typeof this.state.pagecommon !== undefined &&
                  typeof this.state.pagecommon !== "undefined"
                    ? this.state.pagecommon.gallery_image_path +
                      "/" +
                      this.state.pagegallery[0]
                    : innerbanner
                }
                alt=""
              />
              <div className="inner-banner-content">
                <h2>{this.state.pagetitle_txt}</h2>
              </div>
            </div>
          </div>
        </div>
        {/* <div className="common-inner-blckdiv">
          <div className="common-inner-banner">
            <p>{this.state.pagetitle_txt}</p>
          </div>
        </div> */}
        <div className="contact_wrap">
          <div className="contactus_wrapper">
            <div className="container">
              <br />
              {this.state.pagedetail}
              <br />
              <Form
                fields={this.state.fields}
                onChange={this.fieldChange}
                onValid={this.handleFormSubmit}
                outletListData={this.getOutletData}
                contMapFun={this.contMapHtml}
                onInvalid={() => console.log("Form invalid!")}
              />
            </div>
          </div>
        </div>
        <Footer />
        <div id="dvLoading1234"></div>
      </div>
    );
  }
}

const phonenumberPattern = /^[0-9]{6,14}$/;

const isMobile = (mobile) =>
  mobile.match(phonenumberPattern) ? null : "please enter valid Phone number.";

const isEmpty = (value) => (value === "" ? "This field is required." : null);

const isEmail = (email) =>
  validator.isEmail(email) ? null : "This is not a valid email.";

function validationConfig(props) {
  const { name, mobile, email, message } = props.fields;

  return {
    fields: ["name", "mobile", "email", "message"],

    validations: {
      name: [[isEmpty, name]],
      mobile: [
        [isEmpty, mobile],
        [isMobile, mobile],
      ],
      email: [
        [isEmpty, email],
        [isEmail, email],
      ],
      message: [[isEmpty, message]],
    },
  };
}

class Form extends React.Component {
  state = {
    pageTitle: "",
    pageDesc: "",
  };

  render() {
    const { fields, onChange, onValid, onInvalid, $field, $validation } =
      this.props;
    let errMsgFirstName, errMsgEmail, errMsgMobile, errMsgType, errMsgMessage;

    let contactcontent = "";

    if (this.props.contactContent != undefined) {
      contactcontent = Parser(
        this.props.contactContent.result_set[0].staticblocks_description
      );
    }

    if ($validation.name.error.reason !== undefined) {
      document.getElementsByClassName("name").className = "error";
      errMsgFirstName = $validation.name.show && (
        <span className="error">{$validation.name.error.reason}</span>
      );
    }

    if ($validation.mobile.error.reason !== undefined) {
      errMsgMobile = $validation.mobile.show && (
        <span className="error">{$validation.mobile.error.reason}</span>
      );
    }

    if ($validation.email.error.reason !== undefined) {
      errMsgEmail = $validation.email.show && (
        <span className="error">{$validation.email.error.reason}</span>
      );
    }

    if ($validation.message.error.reason !== undefined) {
      errMsgMessage = $validation.message.show && (
        <span className="error">{$validation.message.error.reason}</span>
      );
    }

    return (
      <div className="white_bgbx">
        {/* <div className="locate-map">					
						<div className="locate-mapleft">
							<div className="locate-list">
								{this.props.outletListData()} 
							</div>
						</div>
						<div className="locate-mapright">
							<div id="locateGmap">
								{this.props.contMapFun()}
							</div>
						</div>
				</div> */}
        <div className="contact_form">
          <h3>DROP US A LINE</h3>
          <form className="form_sec clear">
            <div className="contact_col">
              <div className="form-group">
                <div className="focus-out">
                  <label>Name*</label>
                  <input
                    type="input"
                    className="form-control input-focus"
                    value={fields.name}
                    maxLength="80"
                    {...$field("name", (e) => onChange("name", e.target.value))}
                  />
                  {errMsgFirstName}
                </div>
              </div>
              <div className="form-group">
                <div className="focus-out">
                  <label>Contact Number*</label>
                  <input
                    type="text"
                    className="form-control input-focus"
                    value={fields.mobile}
                    maxLength="11"
                    {...$field("mobile", (e) =>
                      onChange("mobile", e.target.value)
                    )}
                  />
                  {errMsgMobile}
                </div>
              </div>
              <div className="form-group">
                <div className="focus-out">
                  <label>Email*</label>
                  <input
                    type="input"
                    className="form-control input-focus"
                    value={fields.email}
                    maxLength="85"
                    {...$field("email", (e) =>
                      onChange("email", e.target.value)
                    )}
                  />
                  {errMsgEmail}
                </div>
              </div>
            </div>
            {/*<div className="form-group">
								<div className="re_select">
									<select className="form-control select-gender" {...$field('type', (e) => onChange('type', e.target.value)) }>
										<option value=""> Please Select* </option>
										<option value="General Enquiry" id="general-enquiry"> General Enquiry </option>
										<option value="Order Enquiry" id="order-enquiry"> Order Enquiry </option>
										<option value="Others" id="others"> Others </option>
									</select>

									{errMsgType}

								</div>
							</div>*/}
            <div className="contact_col">
              <div className="form-group">
                <div className="focus-out">
                  <label>Message*</label>

                  <textarea
                    className="form-control input-focus"
                    id="feedback"
                    {...$field("message", (e) =>
                      onChange("message", e.target.value)
                    )}
                  ></textarea>
                  {errMsgMessage}
                </div>
              </div>
              <div className="btn_sec">
                <button
                  type="button"
                  className="button btn_black btn-lg btn-block"
                  onClick={(e) => {
                    e.preventDefault();
                    this.props.$submit(onValid, onInvalid);
                  }}
                >
                  Submit<div className="ripple-container"></div>
                </button>
                <br />
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
Form = validated(validationConfig)(Form);

const mapStateToProps = (state) => {
  var pagedataRst = Array();
  var common = "";
  if (Object.keys(state.pagedata).length > 0) {
    if (state.pagedata[0].status === "ok") {
      pagedataRst = state.pagedata[0].result_set;
      common = state.pagedata[0].common;
    }
  }
  return {
    outlets: state.outlets,
    globalsettings: state.settings,
    contactdata: state.contactdata,
    pagedata: pagedataRst,
    pagecommon: common,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getPickupOutlets: () => {
      dispatch({ type: GET_PICKUP_OUTLETS });
    },
    getContactData: (postObject) => {
      dispatch({ type: GET_CONTACTDATA, postObject });
    },
    getGlobalSettings: () => {
      dispatch({ type: GET_GLOBAL_SETTINGS });
    },
    getRequestpage: (slug) => {
      dispatch({ type: GET_REQUESTPAGEDATA, slug });
    },
  };
};

Contact.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }),
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Contact)
);
