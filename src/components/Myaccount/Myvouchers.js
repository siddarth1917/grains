/* eslint-disable */
import React, { Component } from "react";
import {
  stripslashes,
  showAlert,
  showCustomAlert,
} from "../Helpers/SettingHelper";
import { appId, apiUrl } from "../Helpers/Config";
import cookie from "react-cookies";
import Slider from "react-slick";
var dateFormat = require("dateformat");
import axios from "axios";
/* import modules */
import Header from "../Layout/Header";
import Footer from "../Layout/Footer";
import Myaccountheader from "./Myaccountheader";
import PropTypes from "prop-types";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
var Parser = require("html-react-parser");

var qs = require("qs");
var base64 = require("base-64");
import moment from "moment";

import { GET_CART_DETAIL, GET_ACTIVITYCOUNT } from "../../actions";

import proVouchar from "../../common/images/pro-vouchar.png";
import cashVouchar from "../../common/images/cash-vouchar.png";
import BigproVouchar from "../../common/images/big-pro-vouchar.png";
import BigcashVouchar from "../../common/images/big-cash-vouchar.png";
class Myvouchers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: "",
      promo: [],
      cartItems: [],
      voucherdetails: [],
      cartDetails: [],
      cart_sub_total: 0,
      cartStatus: "",
      order_all: 0,
      overall_orders: 0,
      voucherStatus: "Waiting",
      myVouchers: [],
      usedVouchers: [],
      productimagePath: "",
      currentDate: "",
    };

    if (cookie.load("UserId") == "" || cookie.load("UserId") == undefined) {
      props.history.push("/");
    }
  }

  componentDidMount() {
    this.props.getCartDetail();
    this.getActivityCounts();
    var customerParam = "&customer_id=" + cookie.load("UserId");
    $("#dvLoading").fadeOut(2000);
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + "-" + mm + "-" + dd;
    this.setState({
      currentDate: today,
    });

    axios
      .get(
        apiUrl +
          "promotion_api_v2/vouchers?app_id=" +
          appId +
          "&customer_id=" +
          base64.encode(cookie.load("UserId")) +
          "&enc=Y"
      )
      .then((vouchers) => {
        this.setState({ voucherStatus: "Ready" });
        /* set promotion content */
        if (vouchers.data.status === "ok") {
          this.setState({
            myVouchers: vouchers.data.result_set.voucher_list,
            usedVouchers: vouchers.data.result_set.used_vouchers,
            productimagePath: vouchers.data.common.image_source,
            status: "ok",
          });
        }
      });
  }

  componentWillReceiveProps(nextProps) {
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

  addToCart(voucher) {
    if (voucher !== "") {
      if (voucher.product_voucher == "f") {
        var modifier = [];
        var combo = [];
        var postObject = {};
        var price = parseFloat("0.00");
        var ImagePath = voucher.product_thumbnail;
        if (ImagePath !== "") {
          var postImagePath =
            this.state.productimagePath + voucher.product_thumbnail;
        } else {
          postImagePath = "";
        }

        var qty_voucher = $(".proqty_input").val();

        var postObject = {
          app_id: appId,
          product_id: voucher.item_product_id,
          product_name: voucher.item_name,
          product_sku: voucher.item_sku,
          product_image: postImagePath,
          availability_id: cookie.load("defaultAvilablityId"),
          product_unit_price: price,
          product_qty: qty_voucher,
          product_total_price: price,
          modifiers: modifier,
          menu_set_component: combo,
          customer_id: cookie.load("UserId"),
          order_availability_id: voucher.order_availability_id,
          order_item_id: voucher.order_item_id,
          order_outlet_id: voucher.order_outlet_id,
        };

        axios
          .post(apiUrl + "cart/is_voucher_insert", qs.stringify(postObject))
          .then((res) => {
            this.setState({ status: "ok" });
            if (res.data.status === "ok") {
              this.setState({ redirectToCart: true });
              $(".mfp-close").trigger("click");
              this.sateValChange("cartflg", "yes");

              showCustomAlert(
                "success",
                "Great choice! Voucher added to your cart."
              );
              /*showCartLst();*/
              this.handleShowAlertFunct(
                "success",
                "Great choice! Voucher added to your cart."
              );
            } else if (res.data.status === "error") {
              $(".mfp-close").trigger("click");
              this.handleShowAlertFunct("Error", res.data.message);
            }
          });
      }

      if (voucher.product_voucher == "c") {
        var modifier = [];
        var combo = [];
        var postObject = {};
        var price = parseFloat("0.00");
        postObject = {
          app_id: appId,
          product_qty: voucher.item_qty,
          product_voucher_points: voucher.product_voucher_points,
          customer_id: cookie.load("UserId"),
          order_item_id: voucher.order_item_id,
        };

        axios
          .post(
            apiUrl + "ordersv1/add_voucher_redeem",
            qs.stringify(postObject)
          )
          .then((res) => {
            this.setState({ status: "ok" });
            if (res.data.status === "ok") {
              //
              showCustomAlert("success", "Cash Voucher Points Credited.");
              /*showCartLst();*/
              this.handleShowAlertFunct(
                "success",
                "Cash Voucher Points Credited."
              );
              this.props.history.push("/rewards");
            } else if (res.data.status === "error") {
              this.handleShowAlertFunct("Error", res.data.message);
            }
          });
      }
    }
  }

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

  voucherPopup(vouch) {
    this.setState(
      { voucherdetails: vouch },
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

  loadMyVouchers() {
    var myVouchers =
      this.state.myVouchers !== undefined ? this.state.myVouchers : Array();

    if (Object.keys(myVouchers).length > 0) {
      return this.state.myVouchers.map((vouch, index) => (
        <li className="promo-earned-col" key={index}>
          <div className="promo-earned-col-item">
            <div className="promo-earned-col-image">
              {vouch.product_thumbnail !== "" &&
              vouch.product_thumbnail !== null ? (
                <img
                  src={this.state.productimagePath + vouch.product_thumbnail}
                />
              ) : (
                <img
                  src={vouch.product_voucher == "c" ? cashVouchar : proVouchar}
                />
              )}
            </div>
            <div className="promo-earned-info">
              <div className="promo-earned-top">
                <h4 className="promo-earned-code">
                  <span> {vouch.item_name}</span>
                </h4>
                <span>Expiry {this.loadProductDate(vouch.expiry_date)}</span>
                <p className="vouchar-txt">{vouch.product_short_description}</p>
              </div>
              <div className="promation_btn" id={"promo-codediv-" + index}>
                {this.state.currentDate > vouch.expiry_date ? (
                  <a
                    className="button promation_btn-one"
                    href="javascript:void(0);"
                  >
                    Expired{" "}
                  </a>
                ) : (
                  <a
                    className="button promation_btn-one"
                    onClick={this.voucherPopup.bind(this, vouch)}
                    href="javascript:void(0);"
                  >
                    View & Redeem
                  </a>
                )}
              </div>
            </div>
          </div>
        </li>
      ));
    } else {
      return <div className="no-recrds-found">No vouchers found</div>;
    }
  }

  /* Vouchers used list*/
  loadMyUsedVouchers() {
    var myVouchers =
      this.state.usedVouchers !== undefined ? this.state.usedVouchers : Array();

    if (Object.keys(myVouchers).length > 0) {
      return this.state.usedVouchers.map((vouch, index) => (
        <li className="promo-earned-col" key={index}>
          <div className="promo-earned-col-item">
            <div className="promo-earned-col-image">
              {vouch.product_thumbnail !== "" &&
              vouch.product_thumbnail !== null ? (
                <img
                  src={this.state.productimagePath + vouch.product_thumbnail}
                />
              ) : (
                <img
                  src={vouch.product_voucher == "c" ? cashVouchar : proVouchar}
                />
              )}
            </div>
            <div className="promo-earned-info">
              <div className="promo-earned-top">
                <h4 className="promo-earned-code">
                  <span> {vouch.item_name}</span>
                </h4>
                <span>Expiry {this.loadProductDate(vouch.expiry_date)}</span>
                <p className="vouchar-txt">{vouch.product_short_description}</p>
              </div>
            </div>
          </div>
        </li>
      ));
    } else {
      return <div className="no-recrds-found">No vouchers found</div>;
    }
  }

  proQtyAction(indxFlg, actionFlg, maxCount) {
    var proqtyInput = $(".proqty_input").val();
    proqtyInput = parseInt(proqtyInput);
    var AvailableQty = maxCount;
    if (actionFlg === "decr") {
      proqtyInput = proqtyInput > 1 ? proqtyInput - 1 : proqtyInput;
    } else {
      if (AvailableQty > proqtyInput) {
        proqtyInput = proqtyInput + 1;
      }
    }
    $(".proqty_input").val(proqtyInput);
  }

  sateValChange = (field, value) => {
    if (field === "cartflg") {
      this.setState({ cartTriggerFlg: value });
    }
  };

  loadProductDate(date) {
    var product_date = new Date(date).toString().split(" ");
    return product_date[2] + "-" + product_date[1] + "-" + product_date[3];
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
        <Header
          sateValChange={this.sateValChange}
          cartTriggerFlg={this.state.cartTriggerFlg}
        />
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
                  <li>
                    <Link to="/mypromotions" title="My Promotions">
                      <span>Promotions</span>
                    </Link>
                  </li>
                  <li className="active">
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
                    <div className="mbacc_mslide">
                      <Link to="/mypromotions" title="My Promotions">
                        <span>Promotions</span>
                      </Link>
                    </div>

                    <div className="mbacc_mslide active">
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
                                  <span>Vouchers</span>
                                </a>
                              </li>
                              <li className="">
                                <a
                                  data-toggle="tab"
                                  href="#tab-id-inn6"
                                  aria-expanded="false"
                                >
                                  <span>Vouchers Used</span>
                                </a>
                              </li>
                            </ul>
                            <div className="tab-content">
                              <div
                                id="tab-id-inn5"
                                className="tab-pane fade active in"
                              >
                                <h4 className="tab_mobtrigger inner_tab_border active">
                                  Vouchers<i></i>
                                </h4>
                                <div className="tab_mobrow filter_tabin">
                                  <div className="order-delivery">
                                    <div className="ord-body">
                                      {}

                                      <div className="cur-order-body mypromo-main-div myvouchar-main-div">
                                        <ul className="myacc_order_details">
                                          {this.loadMyVouchers(
                                            this,
                                            "vouchers"
                                          )}
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div id="tab-id-inn6" className="tab-pane fade">
                                <h4 className="tab_mobtrigger inner_tab_border">
                                  Vouchers Used<i></i>
                                </h4>
                                <div className="tab_mobrow filter_tabin">
                                  <div className="cur-order-body mypromo-main-div myvouchar-main-div">
                                    <ul className="myacc_order_details used-voucher">
                                      {this.loadMyUsedVouchers(
                                        this,
                                        "vouchers"
                                      )}
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
          className="white-popup mfp-hide popup_sec receipt_popup redeem_popsec vouchar-popup"
        >
          <div className="redeem_bansec">
            <div className="promo-popup-image">
              {this.state.voucherdetails.product_thumbnail !== "" &&
              this.state.voucherdetails.product_thumbnail !== null ? (
                <img
                  src={
                    this.state.productimagePath +
                    this.state.voucherdetails.product_thumbnail
                  }
                />
              ) : (
                <img
                  src={
                    this.state.voucherdetails.product_voucher == "c"
                      ? BigcashVouchar
                      : BigproVouchar
                  }
                />
              )}
            </div>
            <div className="promo-earned-content">
              <h4>Vouchers</h4>
              <h4>{this.state.voucherdetails.item_name}</h4>
              <span className="promo-valid">
                Valid Till{" "}
                {this.loadProductDate(this.state.voucherdetails.expiry_date)}
              </span>
              <h4>
                Available :{" "}
                {this.state.voucherdetails.order_item_voucher_balance_qty}
              </h4>
              <p>
                {this.state.voucherdetails.product_short_description !== ""
                  ? Parser(
                      stripslashes(
                        this.state.voucherdetails.product_short_description + ""
                      )
                    )
                  : ""}
              </p>

              <div className="addcart-row-child">
                <div className="qty_bx">
                  <span
                    className="qty_minus"
                    onClick={this.proQtyAction.bind(
                      this,
                      this.state.voucherdetails.item_product_id,
                      "decr",
                      this.state.voucherdetails.order_item_voucher_balance_qty
                    )}
                  >
                    -
                  </span>
                  <input
                    type="text"
                    className="proqty_input"
                    readOnly
                    value="1"
                  />
                  <span
                    className="qty_plus"
                    onClick={this.proQtyAction.bind(
                      this,
                      this.state.voucherdetails.item_product_id,
                      "incr",
                      this.state.voucherdetails.order_item_voucher_balance_qty
                    )}
                  >
                    +
                  </span>
                </div>
              </div>
              <a
                className="button btn_black btn-block voucher_btn"
                onClick={this.addToCart.bind(this, this.state.voucherdetails)}
                href="javascript:void(0);"
              >
                Redeem Now
              </a>
            </div>
          </div>
        </div>
        {/*} <div id="dvLoading"></div> {*/}
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

  return {
    activitycount: state.activitycount,
    promotionlist: state.promotionlist,
    overAllcart: overAllcart,
    cartTotalItmCount: cartTotalItmCount,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getActivityCount: (getObject) => {
      dispatch({ type: GET_ACTIVITYCOUNT, getObject });
    },
    getCartDetail: () => {
      dispatch({ type: GET_CART_DETAIL });
    },
  };
};

Myvouchers.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }),
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Myvouchers)
);
