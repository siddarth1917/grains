/* eslint-disable */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { stripslashes } from "../Helpers/SettingHelper";
import { mediaUrl, pickupId } from "../Helpers/Config";
import cookie from "react-cookies";
import Header from "../Layout/Header";
import Footer from "../Layout/Footer";
import { connect } from "react-redux";
import noimage from "../../common/images/noimg-470x240.jpg";
import {
  GET_ALL_OUTLETS,
  GET_STATIC_BLOCK,
  GET_GLOBAL_SETTINGS,
} from "../../actions";
import innerbanner from "../../common/images/inner-banner.jpg";
var Parser = require("html-react-parser");
class Pages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      outlets: [],
      globalsettings: [],
      starttime: "",
      endtime: "",
      staticblacks: [],
      menuheader: "",
      imageLink: "",
    };
  }

  componentDidMount() {
    this.props.getAllOutlets(pickupId);
    this.props.getGlobalSettings();
    $("html, body").animate({ scrollTop: 0 }, 800);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.outlets !== this.props.outlets) {
      if (nextProps.outlets && nextProps.outlets[0].status == "ok") {
        $("#dvLoading").fadeOut(2000);
        this.setState({
          outlets: nextProps.outlets[0].result_set,
        });
      }
    }

    if (nextProps.globalsettings !== this.props.globalsettings) {
      if (
        nextProps.globalsettings &&
        nextProps.globalsettings[0].status == "ok"
      ) {
        this.setState({
          starttime: nextProps.globalsettings[0].result_set.client_start_time,
          endtime: nextProps.globalsettings[0].result_set.client_end_time,
        });
      }
    }

    if (nextProps.staticblack !== this.state.staticblacks) {
      var menuheader = "";
      var imageLink = "";
      if (Object.keys(nextProps.staticblack).length > 0) {
        nextProps.staticblack.map((data) => {
          if (data.staticblocks_slug === "location-header") {
            menuheader = data.staticblocks_description;
            var gallery_image_path = data.gallery_image_path;
            imageLink =
              data.gallery_images.length > 0
                ? gallery_image_path + data.gallery_images[0]
                : "";
            return "";
          }
        });
      }
      menuheader =
        menuheader !== "" && menuheader !== null
          ? Parser(menuheader)
          : menuheader;
      this.setState({
        menuheader: menuheader,
        imageLink: imageLink,
      });
    }
  }

  tConvert(time) {
    if (
      time !== null &&
      time !== "" &&
      typeof time !== undefined &&
      typeof time !== "undefined"
    ) {
      var hr = "";
      var timeArray = time.split(":");
      hr = timeArray[0];
      var ampm = " AM";
      if (timeArray[0] >= 12) {
        hr = Math.round(timeArray[0] - 12);
        ampm = " PM";
      }
      var result = hr + ":" + timeArray[1] + " " + ampm;
      return result;
    }
  }

  gotoContacus(outletId) {
    cookie.save("contusOutletId", outletId, { path: "/" });
    this.props.history.push("/contact-us");
  }

  callPhoneOptn(phoneTxt) {
    var resultTxt = "";
    if (phoneTxt !== "" && phoneTxt !== null) {
      if (phoneTxt.indexOf("+65") !== -1) {
        resultTxt = "tel:" + phoneTxt;
      } else if (phoneTxt.indexOf("65") !== -1 && phoneTxt.length >= 10) {
        resultTxt = "tel:+" + phoneTxt;
      } else {
        resultTxt = "tel:+65" + phoneTxt;
      }
    } else {
      resultTxt = "javascript:void(0);";
    }

    return resultTxt;
  }

  getOutletData = (dataProp) => {
    if (dataProp) {
      return dataProp.map((item, index) => {
        return (
          <li key={index}>
            <div className="ourrest_row">
              <div className="ourrest_img">
                {item.outlet_image !== "" &&
                typeof item.outlet_image !== undefined &&
                typeof item.outlet_image !== "undefined" ? (
                  <img
                    src={mediaUrl + "outlet/" + item.outlet_image}
                    alt="Outlet Img"
                  />
                ) : (
                  <img className="media-object" src={noimage} />
                )}
              </div>
              <div className="ourrest_info">
                <h4>{stripslashes(item.outlet_name)}</h4>
                <p className="outlet_address">
                  <i className="fa fa-map-marker" aria-hidden="true"></i>
                  <strong>Address</strong>{" "}
                </p>
                <p className="outlet_address_content">
                  {item.outlet_address_line1}
                  {item.outlet_unit_number2 !== ""
                    ? "#" +
                      item.outlet_unit_number1 +
                      "-" +
                      item.outlet_unit_number2
                    : item.outlet_unit_number1}{" "}
                  Singapore - {item.outlet_postal_code}
                </p>
                <div className="outlet-para-text">
                  {item.outlet_email !== "" && (
                    <span>
                      Email: {item.outlet_email} <br></br>
                    </span>
                  )}
                  {item.outlet_phone !== "" && (
                    <>
                      <i className="fa fa-phone" aria-hidden="true"></i>
                      <strong>Phone</strong> <br />
                      <p className="phone-show-dskp">
                        <span className="phone-show-mbl">
                          {" "}
                          <a href={this.callPhoneOptn(item.outlet_phone)}>
                            {item.outlet_phone}
                          </a>
                        </span>
                      </p>
                    </>
                  )}
                  <span className="outlets-timing">
                    {" "}
                    <strong>
                      <i className="fa fa-clock-o" aria-hidden="true"></i>{" "}
                      Timing
                    </strong>{" "}
                    {item.da_monday_start_time !== null &&
                      item.da_monday_end_time !== null && (
                        <p>
                          {" "}
                          Monday: {this.tConvert(item.da_monday_start_time)} -
                          {this.tConvert(item.da_monday_end_time)}
                        </p>
                      )}
                    {item.da_tuesday_start_time !== null &&
                      item.da_tuesday_end_time !== null && (
                        <p>
                          {" "}
                          Tuesday: {this.tConvert(item.da_tuesday_start_time)} -
                          {this.tConvert(item.da_tuesday_end_time)}
                        </p>
                      )}
                    {item.da_wednesday_start_time !== null &&
                      item.da_wednesday_end_time !== null && (
                        <p>
                          {" "}
                          Wednesday:{" "}
                          {this.tConvert(item.da_wednesday_start_time)} -{" "}
                          {this.tConvert(item.da_wednesday_end_time)}
                        </p>
                      )}
                    {item.da_thursday_start_time !== null &&
                      item.da_thursday_end_time !== null && (
                        <p>
                          {" "}
                          Thursday: {this.tConvert(
                            item.da_thursday_start_time
                          )}{" "}
                          -{this.tConvert(item.da_thursday_end_time)}
                        </p>
                      )}
                    {item.da_friday_start_time !== null &&
                      item.da_friday_end_time !== null && (
                        <p>
                          {" "}
                          Friday: {this.tConvert(item.da_friday_start_time)} -
                          {item.da_monday_end_time !== null
                            ? this.tConvert(item.da_friday_end_time)
                            : ""}
                        </p>
                      )}
                    {item.da_saturday_start_time !== null &&
                      item.da_saturday_end_time !== null && (
                        <p>
                          {" "}
                          Saturday: {this.tConvert(
                            item.da_saturday_start_time
                          )}{" "}
                          -{this.tConvert(item.da_saturday_end_time)}
                        </p>
                      )}
                    {item.da_sunday_start_time !== null &&
                      item.da_sunday_end_time !== null && (
                        <p>
                          {" "}
                          Sunday: {this.tConvert(item.da_sunday_start_time)} -
                          {this.tConvert(item.da_sunday_end_time)}
                        </p>
                      )}
                  </span>
                </div>
                <ul className="ourrest_infolinks">
                  <li className="media-links-b li-full-width">
                    <a
                      href="/products"
                      rel="nofollow"
                      className="readmore font-headings"
                    >
                      Make A Order Now{" "}
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </li>
        );
      });
    }
  };

  render() {
    return (
      <div className="outletList-main-div">
        {/* Header start */}
        <Header />
        {/* Header End */}
        <div className="common-inner-blckdiv">
          <div className="common-inner-banner">
            <div className="page-banner">
              <img
                src={
                  this.state.imageLink !== ""
                    ? this.state.imageLink
                    : innerbanner
                }
                alt=""
              />
              <div className="inner-banner-content">
                <h2> {this.state.menuheader}</h2>
              </div>
            </div>
          </div>
        </div>
        <div className="outlet-lst-page">
          <div className="container-one cms-content">
            <div className="container">
              <ul className="outletul">
                {this.getOutletData(this.state.outlets)}
              </ul>
            </div>
          </div>
        </div>

        <Footer />
        <div id="dvLoading" className="dvLoadrCls"></div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  var blacksArr = Array();
  if (Object.keys(state.staticblack).length > 0) {
    if (state.staticblack[0].status === "ok") {
      blacksArr = state.staticblack[0].result_set;
    }
  }
  return {
    outlets: state.alloutlets,
    globalsettings: state.settings,
    staticblack: blacksArr,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    getAllOutlets: (availability) => {
      dispatch({ type: GET_ALL_OUTLETS, availability });
    },
    getGlobalSettings: () => {
      dispatch({ type: GET_GLOBAL_SETTINGS });
    },
    getStaticBlock: () => {
      dispatch({ type: GET_STATIC_BLOCK });
    },
  };
};
Pages.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }),
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Pages));
