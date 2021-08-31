/* eslint-disable */
import React, { Component } from "react";
import {
  stripslashes,
  addressFormat,
  showAlert,
  callImage,
  showLoader,
  hideLoader,
  showCustomAlert,
} from "../Helpers/SettingHelper";
import { hashHistory } from "react-router";
import { createBrowserHistory as history } from "history";
import { baseUrl, appId, apiUrl } from "../Helpers/Config";
import cookie from "react-cookies";
import Slider from "react-slick";
var dateFormat = require("dateformat");
import axios from "axios";

import validator from "validator";
import update from "immutability-helper";
import { validated } from "react-custom-validation";
/* import modules */
import Header from "../Layout/Header";
import Footer from "../Layout/Footer";
import Myaccountheader from "./Myaccountheader";

import PropTypes from "prop-types";
import { withRouter, Link } from "react-router-dom";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
var Parser = require("html-react-parser");

var qs = require("qs");
var base64 = require("base-64");
import moment from "moment";

import {
  GET_CART_DETAIL,
  GET_PROMOTIONLIST,
  GET_PROMOTIONRECEIPT,
  GET_APPLYPROMOTION,
  GET_ACTIVITYCOUNT,
} from "../../actions";

/*import promotionImage from "../../common/images/noimg-800x800.jpg";*/
import promotionImage from "../../common/images/noimg-400x400.jpg";

class Mypromotions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      promoused: [],
      promotions: [],
      status: "",
      promo: [],
      cartItems: [],
      promodetails: [],
      cartDetails: [],
      cart_sub_total: 0,
      cartStatus: "",
      order_all: 0,
      overall_orders: 0,
    };

    if (cookie.load("UserId") == "" || cookie.load("UserId") == undefined) {
      props.history.push("/");
    }
  }

  componentDidMount() {
    this.props.getCartDetail();
    this.getActivityCounts();
    var customerParam =
      "&customer_id=" + base64.encode(cookie.load("UserId")) + "&enc=Y";
    this.props.getPromotionList(customerParam);
    $("#dvLoading").fadeOut(2000);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.promotionlist !== this.props.promotionlist) {
      if (nextProps.promotionlist[0].status === "ok") {
        this.setState({ status: nextProps.promotionlist[0].status });
        this.setState({
          promotions: nextProps.promotionlist[0].result_set.my_promo,
        });
        this.setState({
          promoused: nextProps.promotionlist[0].result_set.promo_history,
        });
      }
    }

    /* for receipt promotion */
    if (nextProps.promotionreceipt !== this.props.promotionreceipt) {
      if (nextProps.promotionreceipt[0].status === "ok") {
        this.setState({
          promodetails: nextProps.promotionreceipt[0].result_set,
        });

        $("#dvLoading").fadeOut(2000);

        $.magnificPopup.open({
          items: {
            src: ".receipt_popup",
          },
          type: "inline",
        });
      } else {
        this.setState({ promodetails: [] });
      }
    }

    /*activity count -start */
    if (Object.keys(nextProps.activitycount).length > 0) {
      if (nextProps.activitycount !== this.props.activitycount) {
        if (
          nextProps.activitycount[0].status &&
          nextProps.activitycount[0].result_set
        ) {
          this.setState({
            overall_orders:
              nextProps.activitycount[0].result_set.overall_orders,
          });
        }
      }
    } else {
      this.setState({ overall_orders: 0 });
    }
    /*activity count - end*/
  }

  /* Get Redeem Points Count History Details */
  getActivityCounts() {
    const inputKeys = ["overall_orders"];
    this.props.getActivityCount(JSON.stringify(inputKeys));
  }

  /*  get promo category details  */
  getProductIdsDet(cartItems) {
    var product_cartid = "";
    if (Object.keys(cartItems).length > 0) {
      for (var key in cartItems) {
        if (
          product_cartid !== "" &&
          cartItems[key].cart_item_product_id !== ""
        ) {
          product_cartid += ";";
        }
        product_cartid +=
          cartItems[key].cart_item_product_id +
          "|" +
          cartItems[key].cart_item_total_price +
          "|" +
          cartItems[key].cart_item_qty;
      }
    }

    return product_cartid;
  }

  applyCouponInput() {
    var promocode = $("#applyPromo").val();
    this.applyCoupon("top", promocode);
  }

  /*apply coupon  function- start*/
  applyCoupon(index, promocode) {
    if (promocode === "") {
      this.handleShowAlertFunct("Error", "Pleae enter your Promo Code.");
      return false;
    }

    var cartCount = this.props.cartTotalItmCount;
    cartCount = cartCount !== "" ? parseInt(cartCount) : 0;
    if (cartCount === 0) {
      this.handleShowAlertFunct(
        "Error",
        "Cart Quantity is not enough to apply promotion."
      );
      return false;
    }

    if (cartCount > 0) {
      var cartDetailsArr = this.props.overAllcart.cart_details;
      var cartItemsSateArr = this.props.overAllcart.cart_items;

      var subTotal =
        Object.keys(cartDetailsArr).length > 0
          ? cartDetailsArr.cart_sub_total
          : 0;
      var totalItems =
        Object.keys(cartDetailsArr).length > 0
          ? cartDetailsArr.cart_total_items
          : 0;

      var categoryIdsDet = this.getProductIdsDet(cartItemsSateArr);
      var avilablityId = cookie.load("defaultAvilablityId");

      var promotionApplied = "";
      var promotionType = "";
      var promotionAmount = "";
      var promotionSource = "";
      var promoIsDelivery = "";
      var reedemPointVal = "";
      var promoCodeVal = promocode;
      var usedPoints = 0;

      var postObject = {
        app_id: appId,
        reference_id: cookie.load("UserId"),
        promo_code: promocode,
        cart_amount: subTotal,
        cart_quantity: totalItems,
        category_id: categoryIdsDet,
        availability_id: avilablityId,
      };

      showLoader("promo-codediv-" + index, "idtext");

      axios
        .post(
          apiUrl + "promotion_api_v2/apply_promotion",
          qs.stringify(postObject)
        )
        .then((res) => {
          if (res.data.status === "success") {
            var pointDet = res.data.result_set;
            var IsDelivery =
              pointDet.promotion_delivery_charge_applied == "Yes"
                ? "Yes"
                : "No";
            promotionApplied = "Yes";
            promotionType = "promoCode";
            promotionAmount = pointDet.promotion_amount;
            promotionSource = promoCodeVal;
            promoIsDelivery = IsDelivery;
            reedemPointVal = "";
            usedPoints = 0;
            showCustomAlert("success", "Promotion applied successfully");
            this.handleShowAlertFunct(
              "Success",
              "Promotion applied successfully"
            );
          } else {
            var msgTxt =
              res.data.message !== ""
                ? res.data.message
                : "Sorry! Did not applied promo code";
            if (promotionType === "promoCode") {
              promotionApplied = "";
              promotionType = "";
              promotionAmount = "";
              promotionSource = "";
              promoIsDelivery = "";
            }
            showCustomAlert("error", msgTxt);
            this.handleShowAlertFunct("Error", msgTxt);
          }

          hideLoader("promo-codediv-" + index, "idtext");
          cookie.save("reedemPointVal", reedemPointVal, { path: "/" });
          cookie.save("promoCodeVal", promoCodeVal, { path: "/" });
          cookie.save("promotionApplied", promotionApplied, { path: "/" });
          cookie.save("promotionType", promotionType, { path: "/" });
          cookie.save("promotionAmount", promotionAmount, { path: "/" });
          cookie.save("promotionSource", promotionSource, { path: "/" });
          cookie.save("promoIsDelivery", promoIsDelivery, { path: "/" });
          cookie.save("usedPoints", usedPoints, { path: "/" });

          if (promotionApplied === "Yes") {
            const { history } = this.props;
            setTimeout(function () {
              history.push("/checkout");
            }, 1000);
          }
        });
    }
  }
  /*apply coupon  function - end */

  handleShowAlertFunct(header, msg) {
    var magnfPopup = $.magnificPopup.instance;
    showAlert(header, msg, magnfPopup);
    $.magnificPopup.open({
      items: {
        src: ".alert_popup",
      },
      type: "inline",
    });
  }

  /*get receipt for promotion */
  getReceipt(promotion_id, promo) {
    $("#dvLoading").fadeIn();
    this.setState({ promo: promo });
    var params = "&promotion_id=" + promotion_id;
    this.props.getPromotionReceipt(params);
  }

  promotioncheckout() {
    $.magnificPopup.close();
    const { history } = this.props;
    cookie.save("fromCkeckOutVld", "Yes", { path: "/" });
    history.push("/checkout");
  }
  /*promotion list */

  promoPopup(promoData) {
    var promoImage =
      promoData.promotion_image !== "" && promoData.promotion_image !== null
        ? this.props.promoSource + promoData.promotion_image
        : promotionImage;
    this.setState(
      { promodetails: promoData, promoImage: promoImage },
      function () {
        this.trgPromoPopup();
      }.bind(this)
    );
  }

  trgPromoPopup() {
    $.magnificPopup.open({
      items: {
        src: ".receipt_popup",
      },
      type: "inline",
    });
  }

  __promotionListing() {
    var promotionsArr =
      this.state.promotions !== undefined ? this.state.promotions : Array();
    if (this.state.status === "ok" && Object.keys(promotionsArr).length > 0) {
      return this.state.promotions.map((promo, index) => (
        <li className="promo-earned-col" key={index}>
          <div className="promo-earned-col-item">
            <div className="promo-earned-col-image">
              {promo.promotion_image !== "" &&
              promo.promotion_image !== null ? (
                <img src={this.props.promoSource + promo.promotion_image} />
              ) : (
                <img src={promotionImage} />
              )}
            </div>
            <div className="promo-earned-info">
              <div className="promo-earned-top">
                <h4 className="promo-earned-code">
                  Promo Code
                  <span> {promo.promo_code}</span>
                </h4>
                <span className="promo-valid">{promo.promo_days_left}</span>
              </div>
              <div className="promation_btn" id={"promo-codediv-" + index}>
                <a
                  className="button promation_btn-one"
                  onClick={this.promoPopup.bind(this, promo)}
                  href="javascript:void(0);"
                >
                  View Now
                </a>
                <a
                  className="button"
                  href="javascript:void(0);"
                  onClick={this.applyCoupon.bind(this, index, promo.promo_code)}
                >
                  Redeem
                </a>
              </div>
            </div>
          </div>
        </li>
      ));
    } else {
      return <div className="no-recrds-found">No records found</div>;
    }
  }

  /* promotion used list*/
  __promotionUsedListing() {
    var promousedArr =
      this.state.promoused !== undefined ? this.state.promoused : Array();
    if (this.state.status === "ok" && Object.keys(promousedArr).length > 0) {
      return this.state.promoused.map((promo, index) => (
        <li className="promo-earned-col" key={index}>
          <div className="promo-earned-col-item">
            <div className="promo-earned-col-image">
              <div className="innerproduct-item-image">
                {promo.promotion_image !== "" &&
                promo.promotion_image !== null ? (
                  <img src={this.props.promoSource + promo.promotion_image} />
                ) : (
                  <img src={promotionImage} />
                )}
              </div>
            </div>
            <div className="promo-earned-info">
              <div className="promo-bot-left fl">
                <p>
                  <span>Promo Code</span> {promo.promo_code}
                </p>
              </div>
            </div>
          </div>
        </li>
      ));
    } else {
      return <div className="no-recrds-found">No records found</div>;
    }
  }

  render() {
    var settingsMyAcc = {
      infinite: false,
      slidesToShow: 4,
      slidesToScroll: 4,
      initialSlide: 3,
      responsive: [
        {
          breakpoint: 1191,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
            infinite: false,
          },
        },
        {
          breakpoint: 900,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
            infinite: false,
          },
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            infinite: false,
          },
        },
      ],
    };

    return (
      <div className="myacc-main-div">
        <Header />
        <Myaccountheader />

        <div className="innersection_wrap myadmin_wrap">
          <div className="mainacc_menusec">
            {/* container div - start */}
            <div className="container">
              <div className="mainacc_menuout">
                <ul className="mainacc_menulist">
                  <li>
                    <Link to="/myaccount" title="My Account">
                      <span>Account Details</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/myorders" title="My Orders">
                      <span>Orders</span>
                      {parseFloat(this.state.overall_orders) > 0 && (
                        <span id="masterCount">
                          {this.state.overall_orders}
                        </span>
                      )}
                    </Link>
                  </li>
                  <li className="">
                    <Link to="/rewards" title="My Rewards">
                      <span>Rewards</span>
                    </Link>
                  </li>
                  <li className="active">
                    <Link to="/mypromotions" title="My Promotions">
                      <span>Promotions</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/myvouchers" title="My Vouchers">
                      <span>Vouchers</span>
                    </Link>
                  </li>
                </ul>

                <div className="mbacc_mslidersec mbacc_mslider">
                  <Slider {...settingsMyAcc}>
                    <div className="mbacc_mslide">
                      <Link to="/myaccount" title="My Account">
                        <span>Account Details</span>
                      </Link>
                    </div>
                    <div className="mbacc_mslide">
                      <Link to="/myorders" title="My Orders">
                        <span>Orders</span>
                      </Link>
                    </div>
                    <div className="mbacc_mslide">
                      <Link to="/rewards" title="My Rewards">
                        <span>Rewards</span>
                      </Link>
                    </div>
                    <div className="mbacc_mslide active">
                      <Link to="/mypromotions" title="My Promotions">
                        <span>Promotions</span>
                      </Link>
                    </div>
                    <div className="mbacc_mslide">
                      <Link to="/myvouchers" title="My Vouchers">
                        <span>Vouchers</span>
                      </Link>
                    </div>
                  </Slider>
                </div>
              </div>
              <div className="mainacc_menucontent">
                <div className="main_tabsec">
                  <div className="order-tab-section">
                    <div className="mainacc_mobrow">
                      <div className="promo-form">
                        <h3>
                          <span>Redeem your</span> Promotions
                        </h3>
                        <div className="myuacc-promo" id="promo-codediv-top">
                          <input
                            type="text"
                            placeholder="Add Your Promo/Invite Code Here"
                            id="applyPromo"
                          />
                          <button
                            className="applyBtn button"
                            onClick={this.applyCouponInput.bind(this)}
                          >
                            APPLY
                          </button>
                        </div>
                      </div>

                      <div className="tab_sec main_tabsec_inner">
                        <div className="myacc_filter">
                          <div className="tab_sec filter_tabsec">
                            <ul className="nav nav-tabs text-center">
                              <li className="active">
                                <a
                                  data-toggle="tab"
                                  href="#tab-id-inn5"
                                  aria-expanded="true"
                                >
                                  <span>Promotions</span>
                                </a>
                              </li>
                              <li className="">
                                <a
                                  data-toggle="tab"
                                  href="#tab-id-inn6"
                                  aria-expanded="false"
                                >
                                  <span>Promotions Used</span>
                                </a>
                              </li>
                            </ul>
                            <div className="tab-content">
                              <div
                                id="tab-id-inn5"
                                className="tab-pane fade active in"
                              >
                                <h4 className="tab_mobtrigger inner_tab_border active">
                                  Promotions<i></i>
                                </h4>
                                <div className="tab_mobrow filter_tabin">
                                  <div className="order-delivery">
                                    <div className="ord-body">
                                      {}

                                      <div className="cur-order-body mypromo-main-div">
                                        <ul className="myacc_order_details">
                                          {this.state.promotions &&
                                            this.__promotionListing()}
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div id="tab-id-inn6" className="tab-pane fade">
                                <h4 className="tab_mobtrigger inner_tab_border">
                                  Promotions Used<i></i>
                                </h4>
                                <div className="tab_mobrow filter_tabin">
                                  <div className="cur-order-body mypromo-main-div">
                                    <ul className="myacc_order_details">
                                      {this.state.promoused &&
                                        this.__promotionUsedListing()}
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
                </div>
              </div>
            </div>
            {/* container div - end */}
          </div>
        </div>

        <Footer />
        <div
          id="receipt-popup"
          className="white-popup mfp-hide popup_sec receipt_popup redeem_popsec"
        >
          <div className="redeem_bansec">
            <div className="promo-popup-image">
              <img src={this.state.promoImage} alt="" />
            </div>
            <div className="promo-earned-content">
              <h4>{this.state.promodetails.promo_code}</h4>
              <span className="promo-valid">
                Valid Till{" "}
                {moment(this.state.promodetails.promotion_end_date).format(
                  "Do"
                )}{" "}
                of{" "}
                {moment(this.state.promodetails.promotion_end_date).format(
                  "MMM YYYY"
                )}{" "}
              </span>
              <p>
                {this.state.promodetails.promo_desc !== ""
                  ? Parser(
                      stripslashes(this.state.promodetails.promo_desc + "")
                    )
                  : ""}
              </p>
              <a
                className="button btn_black btn-block"
                onClick={this.applyCoupon.bind(
                  this,
                  0,
                  this.state.promodetails.promo_code
                )}
                href="javascript:void(0);"
              >
                Redeem
              </a>
            </div>
          </div>
        </div>
        {/*} <div id="dvLoading"></div> {*/}

        <div
          className="white-popup mfp-hide popup_sec"
          id="promotion-popup"
          style={{ maxWidth: 500 }}
        >
          <div className="custom_alert">
            <div className="custom_alertin">
              <div className="alert_height">
                <div className="alert_header">Success</div>
                <div className="alert_body">
                  <p>Promotion is applied successfully</p>
                  <div className="alt_btns">
                    <a
                      href="javascript:;"
                      className="button btn-sm btn_yellow"
                      onClick={this.promotioncheckout.bind(this)}
                    >
                      Ok
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  var overAllcart = Array();
  var cartTotalItmCount = 0;
  if (Object.keys(state.cartlistdetail).length > 0) {
    var resultSetArr = !("result_set" in state.cartlistdetail[0])
      ? Array()
      : state.cartlistdetail[0].result_set;
    if (
      state.cartlistdetail[0].status === "ok" &&
      Object.keys(resultSetArr).length > 0
    ) {
      overAllcart = resultSetArr;
      cartTotalItmCount = resultSetArr.cart_details.cart_total_items;
    }
  }

  var promoSource = "";
  if (Object.keys(state.promotionlist).length > 0) {
    promoSource = state.promotionlist[0].common.promo_image_source;
  }

  return {
    activitycount: state.activitycount,
    promotionlist: state.promotionlist,
    promoSource: promoSource,
    overAllcart: overAllcart,
    cartTotalItmCount: cartTotalItmCount,
    promotionreceipt: state.promotionreceipt,
    applypromotion: state.applypromotion,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getActivityCount: (getObject) => {
      dispatch({ type: GET_ACTIVITYCOUNT, getObject });
    },
    getPromotionList: (customerParam) => {
      dispatch({ type: GET_PROMOTIONLIST, customerParam });
    },
    getCartDetail: () => {
      dispatch({ type: GET_CART_DETAIL });
    },
    getPromotionReceipt: (params) => {
      dispatch({ type: GET_PROMOTIONRECEIPT, params });
    },
    getApplyPromotion: (postData) => {
      dispatch({ type: GET_APPLYPROMOTION, postData });
    },
  };
};

Mypromotions.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }),
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Mypromotions)
);
