/* eslint-disable */
import React, { Component } from "react";
import cookie from "react-cookies";
import axios from "axios";
var FetchStream = require("fetch").FetchStream;

var fetch = new FetchStream("https://ccpl.promobuddy.asia");
import { connect } from "react-redux";
import Slider from "react-slick";

import Header from "../Layout/Header";
import Footer from "../Layout/Footer";
import HomeBanner from "./HomeSubCompo/HomeBanner";
import ProductDetail from "../Products/ProductDetail";
import FeaturedProducts from "./HomeSubCompo/FeaturedProducts";
import { appId, apiUrl, deliveryId, pickupId, cookieDefaultConfig } from "../Helpers/Config";
import {
  GET_GLOBAL_SETTINGS,
  GET_STATIC_BLOCK,
  GET_NORMAL_POPUP,
  GET_CATEGORY_LIST,
  GET_MENU_NAVIGATION,
} from "../../actions";
import {
  showLoader,
  hideLoader,
  validateEmailFun,
  showCustomAlert,
} from "../Helpers/SettingHelper";

import newletterImg from "../../common/images/newletter-bg.jpg";
import deliveryImg from "../../common/images/delivery-red.png";
import groceryImg from "../../common/images/grocery.png";
import welcomeImg from "../../common/images/welcome-img.jpg";

var Parser = require("html-react-parser");

class Home extends Component {
  constructor(props) {
    super(props);

    var normalpopupFlg = "initial";
    if (
      (cookie.load("triggerAvlPop") != "" &&
        cookie.load("triggerAvlPop") != undefined) ||
      cookie.load("orderPopuptrigger") === "Yes" ||
      cookie.load("loginpopupTrigger") === "Yes" ||
      cookie.load("promoPopupTrigger") === "Yes"
    ) {
      normalpopupFlg = "trigger";
    }

    this.state = {
      users: [],
      nextavail: "",
      cartTriggerFlg: "No",
      staticblacks: [],
      welcomeBlks: "",
      imageLink: "",
      viewProductFlg: "no",
      viewProductSlug: "",
      normalpopuplist: [],
      normalpopupdata: [],
      normalpopup_status: "no",
      normalpopup_flg: normalpopupFlg,
      normalpopupstatus: "initial",
      promo_mail_id: "",
      displayType: "all",
    };

    this.props.getSettings();
    this.props.getCategoryList();
    this.props.getMenuNavigation();
    this.props.getNormalPopup();
    this.props.getStaticBlock();

    /* const requestOptions = {
      method: "GET",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT",
        "access-control-allow-headers":
          "X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method, Authorization, Auth",
        "X-Frame-Options": "https://grainsnew.promobuddy.asia/",
        "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
      },
      body: JSON.stringify({ title: "React POST Request Example" }),
    };
    fetch(apiUrl + "cms/banner?app_id=" + appId, requestOptions)
      .then((response) => response.json())
      .then(); */

    axios({
      method: "GET",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT",
        "access-control-allow-headers":
          "X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method, Authorization, Auth",
        "X-Frame-Options": "https://grainsnew.promobuddy.asia/",
        "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
      },
      url: apiUrl + "cms/banner?app_id=" + appId,
      data: "",
    }).then(function (response) {
      console.log(response);
    });

    /* data => this.setState({ postId: data.id }) */

    /* axios
      .get(apiUrl + "cms/banner?app_id=" + appId, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": "true",
          "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT",
          "access-control-allow-headers":
            "X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method, Authorization, Auth",
          "X-Frame-Options": "https://grainsnew.promobuddy.asia/",
          "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
        },
      })
      .then((timeslt) => {}); */
  }

  componentWillReceiveProps(PropsData) {
    if (PropsData.staticblack !== this.state.staticblacks) {
      var welcomeBlk = "";
      var imageLink = "";
      if (Object.keys(PropsData.staticblack).length > 0) {
        PropsData.staticblack.map((data, index) => {
          if (data.staticblocks_slug === "home-welcome-content") {
            welcomeBlk = data.staticblocks_description;
            var gallery_image_path = data.gallery_image_path;
            imageLink =
              data.gallery_images.length > 0
                ? gallery_image_path + data.gallery_images[0]
                : "";
            return "";
          }
        });
      }
      welcomeBlk =
        welcomeBlk !== "" && welcomeBlk !== null
          ? Parser(welcomeBlk)
          : welcomeBlk;
      this.setState({
        staticblacks: PropsData.staticblack,
        welcomeBlks: welcomeBlk,
        imageLink: imageLink,
      });
    }

    if (
      PropsData.normalpopuplist !== this.state.normalpopuplist &&
      this.state.normalpopup_flg === "initial"
    ) {
      var normalpopupMain = PropsData.normalpopuplist,
        normalpopupdata = [],
        normalpopupStatus = "no";
      if (normalpopupMain !== "") {
        if (Object.keys(normalpopupMain).length > 0) {
          var normalpopupIds = cookie.load("normalpopupIds");
          var normalpopupIdArr =
            normalpopupIds != "" && normalpopupIds != undefined
              ? normalpopupIds.split("~~")
              : Array();
          if (
            $.inArray(normalpopupMain[0].normalpopup_id, normalpopupIdArr) ===
            -1
          ) {
            normalpopupdata = normalpopupMain[0];
            normalpopupStatus = "yes";
          }
          this.setState({
            normalpopuplist: normalpopupMain,
            normalpopupdata: normalpopupdata,
            normalpopup_status: normalpopupStatus,
            normalpopup_flg: "trigger",
          });
        }
      }
    }

    if (PropsData.normalpopupstatus !== this.state.normalpopupstatus) {
      this.setState({ normalpopupstatus: PropsData.normalpopupstatus });
    }
  }

  chooseAvailability(availability) {
    var defaultAvilTy = cookie.load("defaultAvilablityId");
    if (defaultAvilTy !== availability) {
      var cartTotalItems = cookie.load("cartTotalItems");
      cartTotalItems =
        cartTotalItems != "" && cartTotalItems != undefined
          ? parseInt(cartTotalItems)
          : 0;
      if (
        cookie.load("orderOutletId") != "" &&
        cookie.load("orderOutletId") != undefined
      ) {
        this.setState({ nextavail: availability });
        $.magnificPopup.open({
          items: {
            src: "#warning-popup",
          },
          type: "inline",
        });
        return false;
      }
    }

    var popupIdtxt = "";
    if (availability === deliveryId) {
      popupIdtxt = "#delevery-popup";
    } else if (availability === pickupId) {
      popupIdtxt = "#takeaway-popup";
    }

    if (popupIdtxt !== "") {
      $.magnificPopup.open({
        items: {
          src: popupIdtxt,
        },
        type: "inline",
      });
    }
  }

  componentDidMount() {
    if (
      cookie.load("triggerAvlPop") != "" &&
      cookie.load("triggerAvlPop") != undefined
    ) {
      var availabilityId = cookie.load("triggerAvlPop");
      cookie.remove("triggerAvlPop", cookieDefaultConfig);
      this.chooseAvailability(availabilityId);
    }

    if (cookie.load("orderPopuptrigger") === "Yes") {
      cookie.remove("orderPopuptrigger", cookieDefaultConfig);
      $.magnificPopup.open({
        items: {
          src: "#order-popup",
        },
        type: "inline",
      });
    }

    if (cookie.load("loginpopupTrigger") === "Yes") {
      cookie.save("loginpopupTrigger", "fromcheckout", cookieDefaultConfig);
      $.magnificPopup.open({
        items: {
          src: "#login-popup",
        },
        type: "inline",
      });
    }

    var RctThis = this;
    $("body")
      .off("click", ".act_order_popup")
      .on("click", ".act_order_popup", function (e) {
        e.preventDefault();

        var odrType = $(this).attr("data-acturl");
        var availabilityId = "";
        if (odrType === "delivery") {
          availabilityId = deliveryId;
        } else if (odrType === "pickup") {
          availabilityId = pickupId;
        }

        if (availabilityId !== "") {
          RctThis.chooseAvailability(availabilityId);
        } else if (availabilityId === "" && odrType === "ordernow") {
          $.magnificPopup.open({
            items: {
              src: "#order-popup",
            },
            type: "inline",
          });
        }
      });
  }

  sateValChange = (field, value) => {
    if (field === "cartflg") {
      this.setState({ cartTriggerFlg: value });
    }
    if (field === "view_pro_data" && value !== "") {
      this.setState(
        { viewProductFlg: "yes", viewProductSlug: value },
        function () {
          this.openProDetailPopup();
        }.bind(this)
      );
    }
    if (field === "view_pro_upate" && value !== "") {
      this.setState({ viewProductFlg: value });
    }
    if (field === "firstcategory" && value !== "") {
      this.setState({ firstcategory: value });
    }
  };

  openProDetailPopup() {
    showLoader("comboPro-" + this.state.viewProductSlug, "Idtext");
    $("#ProductDetailMdl").modal({ backdrop: "static", keyboard: false });
  }

  triggerNormalPopup(trgType) {
    let settingsArr = this.props.globalsettings;
    var showPromoPopup = "",
      showNormalPopup = "";
    if (Object.keys(settingsArr).length > 0) {
      if (Object.keys(settingsArr[0].result_set).length > 0) {
        if (settingsArr[0].result_set.client_promocode_enable === "1") {
          showNormalPopup =
            settingsArr[0].result_set.client_promo_code_normal_popup_enable ===
              "1"
              ? "yes"
              : "";
          if (settingsArr[0].result_set.client_promocode_options === "1") {
            showPromoPopup =
              settingsArr[0].result_set.client_promocode_options === "1"
                ? "yes"
                : "";
          }
        }
      }
    }

    var otherPageActTrigger = "no";
    if (
      (cookie.load("triggerAvlPop") != "" &&
        cookie.load("triggerAvlPop") != undefined) ||
      cookie.load("orderPopuptrigger") === "Yes" ||
      cookie.load("loginpopupTrigger") === "Yes"
    ) {
      otherPageActTrigger = "yes";
    }
    if (showNormalPopup === "yes") {
      if (
        trgType === "loading" &&
        otherPageActTrigger === "no" &&
        this.state.normalpopup_status === "yes" &&
        Object.keys(this.state.normalpopupdata).length > 0 &&
        cookie.load("promoPopupTrigger") !== "Yes"
      ) {
        if (this.props.match.path !== "/sign-in") {
          var normalpopupIds = cookie.load("normalpopupIds");
          var normalpopupIdsNew =
            normalpopupIds != "" && normalpopupIds != undefined
              ? normalpopupIds +
              "~~" +
              this.state.normalpopupdata.normalpopup_id
              : this.state.normalpopupdata.normalpopup_id;
          var normalpopupIdArr = [];
          normalpopupIdArr["normalpopupids"] = normalpopupIdsNew;
          cookie.save("normalpopupIds", normalpopupIdsNew, cookieDefaultConfig);
          var $_this_rec = this;
          $.magnificPopup.open({
            items: {
              src: "#normal-popup",
            },
            type: "inline",
            midClick: true,
            closeOnBgClick: false,
            callbacks: {
              close: function () {
                $_this_rec.normalPopupUpdate();
              },
            },
          });
        }
      }
    }
    if (showPromoPopup === "yes") {
      if (
        (cookie.load("promoPopupTrigger") === "Yes" ||
          (otherPageActTrigger === "no" &&
            this.state.normalpopup_status === "no" &&
            Object.keys(this.state.normalpopupdata).length === 0)) &&
        cookie.load("mailpopopuptrg") !== "yes"
      ) {
        cookie.save("mailpopopuptrg", "yes", cookieDefaultConfig);
        cookie.remove("promoPopupTrigger", cookieDefaultConfig);
        $.magnificPopup.open({
          items: {
            src: "#promo-check-popup",
          },
          type: "inline",
          midClick: true,
          closeOnBgClick: false,
        });
      }
    }
  }

  normalPopupUpdate() {
    if (cookie.load("mailpopopuptrg") !== "yes") {
      this.props.history.push("/refpage/promopopup");
    }
  }

  handleEmailChange(event) {
    this.setState({ promo_mail_id: event.target.value, promomail_error: "" });
  }

  sendPromoMailFun() {
    var promoEmail = this.state.promo_mail_id;

    var mailErrorTxt = "";
    if (promoEmail === "") {
      mailErrorTxt = "Email Address is required.";
    } else if (!validateEmailFun(promoEmail)) {
      mailErrorTxt = "Invalide Email Address";
    }

    if (mailErrorTxt !== "") {
      this.setState({ promomail_error: mailErrorTxt });
      return false;
    } else {
      showLoader("promomailpopup-cls", "class");

      var qs = require("qs");
      var postObject = {
        app_id: appId,
        email_address: promoEmail,
      };

      axios
        .post(apiUrl + "promotion/user_promotion", qs.stringify(postObject))
        .then((response) => {
          hideLoader("promomailpopup-cls", "class");
          $.magnificPopup.close();
          if (response.data.status === "ok") {
            showCustomAlert(
              "success",
              "You are now a Member of Grains & Co. Please check your email for more information."
            );
          } else {
            var errMsgtxt =
              response.data.message !== ""
                ? response.data.message
                : "Sorry! You didn`t have promo code.";
            showCustomAlert("error", errMsgtxt);
          }
          return false;
        });
    }

    return false;
  }

  setdisplayType(displayType) {
    this.setState({ displayType: displayType });
  }
  chooseAvailabilityFun(availability, event) {
    event.preventDefault();
    var defaultAvilTy = cookie.load("defaultAvilablityId");

    if (defaultAvilTy !== availability) {
      var cartTotalItems = cookie.load("cartTotalItems");
      cartTotalItems =
        cartTotalItems != "" && cartTotalItems != undefined
          ? parseInt(cartTotalItems)
          : 0;
      if (
        cookie.load("orderOutletId") != "" &&
        cookie.load("orderOutletId") != undefined
      ) {
        this.setState({ nextavail: availability });
        $.magnificPopup.open({
          items: {
            src: "#warning-popup",
          },
          type: "inline",
        });
        return false;
      }
    } else if (
      defaultAvilTy === availability &&
      cookie.load("orderOutletId") != "" &&
      cookie.load("orderOutletId") != undefined
    ) {
      $.magnificPopup.close();
      this.props.history.push("/products");
      return false;
    }

    var popupIdtxt = "";
    if (availability === deliveryId) {
      $(".delivery_outletpoup").find(".outlet_error").html("");
      popupIdtxt = "#delevery-postcode-popup";
    } else if (availability === pickupId) {
      popupIdtxt = "#takeaway-popup";
    }

    if (popupIdtxt !== "") {
      $.magnificPopup.open({
        items: {
          src: popupIdtxt,
        },
        type: "inline",
      });
    }
  }
  checkActiveDivHd(avlType) {
    var clsTxt = "";
    var availability = cookie.load("defaultAvilablityId");
    if (availability == avlType) {
      clsTxt += "active";
    }
    return clsTxt;
  }
  render() {
    let settingsArr = this.props.globalsettings;
    var showPromoPopup = "",
      showNormalPopup = "";
    if (Object.keys(settingsArr).length > 0) {
      if (Object.keys(settingsArr[0].result_set).length > 0) {
        if (settingsArr[0].result_set.client_promocode_enable === "1") {
          showNormalPopup =
            settingsArr[0].result_set.client_promo_code_normal_popup_enable ===
              "1"
              ? "yes"
              : "";
          if (settingsArr[0].result_set.client_promocode_options === "1") {
            showPromoPopup =
              settingsArr[0].result_set.client_promocode_options === "1"
                ? "yes"
                : "";
          }
        }
      }
    }

    return (
      <div className="home-main-div">
        {/* Header section */}
        <Header
          homePageState={this.state}
          cartTriggerFlg={this.state.cartTriggerFlg}
          sateValChange={this.sateValChange}
        />

        {/* Home banner section */}
        <section className="white-home">
          <HomeBanner />
          <div className="bann-container">
            <div className="container">
              <div className="wh-lhs">
                <div className="wh-lhs-bottom">
                  <ul>
                    <li className={this.checkActiveDivHd(deliveryId)}>
                      <div className="hero-top-img">
                        <img src={deliveryImg} />
                      </div>
                      <div className="hero-top-desc">
                        <h4>Delivery</h4>
                        {/* <p>Sample text of this section will be</p> */}
                        <a
                          className="button"
                          onClick={this.chooseAvailabilityFun.bind(
                            this,
                            deliveryId
                          )}
                        >
                          Order Now
                        </a>
                      </div>
                    </li>
                    <li className={this.checkActiveDivHd(pickupId)}>
                      <div className="hero-top-img">
                        <img src={groceryImg} />
                      </div>
                      <div className="hero-top-desc">
                        <h4>Takeaway</h4>
                        {/*  <p>Sample text of this section will be</p> */}
                        <a
                          className="button"
                          onClick={this.chooseAvailabilityFun.bind(
                            this,
                            pickupId
                          )}
                        >
                          Order Now
                        </a>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <FeaturedProducts sateValChange={this.sateValChange} />

        <section className="welcome-home">
          <div className="container">
            <div className="welcome-lhs">
              <img
                src={
                  this.state.imageLink !== ""
                    ? this.state.imageLink
                    : welcomeImg
                }
                alt=""
              />
            </div>
            <div className="welcome-rhs">{this.state.welcomeBlks}</div>
          </div>
        </section>

        {/* Footer section */}
        <Footer />

        {/* <ProductDetail
          productState={this.state}
          sateValChange={this.sateValChange}
        /> */}

        {/*Normal popup Start*/}
        <div
          id="normal-popup"
          className="white-popup mfp-hide popup_sec normal-popup"
        >
          <div className="normal_popup_alert">
            {this.state.normalpopup_status === "yes" &&
              Object.keys(this.state.normalpopupdata).length > 0 && (
                <div className="normal_popup_cont">
                  {Parser(this.state.normalpopupdata.normalpopup_description)}
                </div>
              )}
          </div>
        </div>
        {/*Normal popup - End*/}

        {/*Promo Check Email popup Start*/}
        <div
          id="promo-check-popup"
          className="white-popup mfp-hide popup_sec promo-check-popup"
        >
          <div className="promopopup-maindiv">
            <div className="promopopup-lhs">
              <div className="frm-action-div">
                <div className="frm-top-title">
                  <h3>Join our email list</h3>
                  <p>Enter your Email address to receive your promocode</p>
                </div>

                <div className="frm-inputbtn-div">
                  <div className="form-group">
                    <div className="focus-out">
                      <label>Email Address</label>
                      <input
                        type="email"
                        className="form-control input-focus"
                        value={this.state.promo_mail_id}
                        onChange={this.handleEmailChange.bind(this)}
                      />
                      {this.state.promomail_error !== "" && (
                        <div id="promomail-error">
                          {this.state.promomail_error}
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={this.sendPromoMailFun.bind(this)}
                    className="button promomailpopup-cls"
                  >
                    Subscribe
                  </button>
                </div>

                <div className="frm-bottom-text">
                  <p>
                    SIGN UP FOR EXCLUSIVE UPDATES, NEW PRODUCTS, AND
                    INSIDER-ONLY DISCOUNTS
                  </p>
                </div>
              </div>
            </div>

            <div className="promopopup-rhs">
              <img src={newletterImg} />
            </div>
          </div>
        </div>
        {/*Promo Check Email popup - End*/}

        {this.state.normalpopupstatus !== "initial" &&
          (showNormalPopup === "yes" || showPromoPopup === "yes") &&
          this.triggerNormalPopup("loading")}
      </div>
    );
  }
}

const mapStateTopProps = (state) => {
  var blacksArr = Array();
  if (Object.keys(state.staticblack).length > 0) {
    if (state.staticblack[0].status === "ok") {
      blacksArr = state.staticblack[0].result_set;
    }
  }

  var normalPopupStatus = "initial";
  var normalPopupArr = Array();
  if (Object.keys(state.normalpopuplist).length > 0) {
    if (state.normalpopuplist[0].status === "ok") {
      normalPopupArr = state.normalpopuplist[0].result_set;
      normalPopupStatus = "ok";
    } else {
      normalPopupStatus = "error";
    }
  }

  var tempArr = Array();
  var navigateRst = Array();
  var navigateCmn = Array();
  if (Object.keys(state.product).length > 0) {
    var tempArr = !("menuNavigation" in state.product[0])
      ? Array()
      : state.product[0].menuNavigation;
    if (Object.keys(tempArr).length > 0) {
      if (tempArr[0].status === "ok") {
        navigateRst = tempArr[0].result_set;
        navigateCmn = tempArr[0].common;
      }
    }
  }

  return {
    globalsettings: state.settings,
    categorylist: state.categorylist,
    navigateMenu: navigateRst,
    navigateCommon: navigateCmn,
    staticblack: blacksArr,
    normalpopuplist: normalPopupArr,
    normalpopupstatus: normalPopupStatus,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getSettings: () => {
      dispatch({ type: GET_GLOBAL_SETTINGS });
    },
    getCategoryList: () => {
      dispatch({ type: GET_CATEGORY_LIST });
    },
    getStaticBlock: () => {
      dispatch({ type: GET_STATIC_BLOCK });
    },
    getNormalPopup: () => {
      dispatch({ type: GET_NORMAL_POPUP });
    },
    getMenuNavigation: () => {
      dispatch({ type: GET_MENU_NAVIGATION });
    },
  };
};

export default connect(mapStateTopProps, mapDispatchToProps)(Home);
