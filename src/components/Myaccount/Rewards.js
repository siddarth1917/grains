/* eslint-disable */
import React, { Component } from "react";
import { Link } from "react-router-dom";
/* import modules */
import Header from "../Layout/Header";
import Footer from "../Layout/Footer";
import Myaccountheader from "./Myaccountheader";
import Slider from "react-slick";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { setMinutes, setHours, getDay, format } from "date-fns";
var Parser = require("html-react-parser");
import { deliveryId } from "../Helpers/Config";
import {
  addressFormat,
  stripslashes,
  showAlert,
} from "../Helpers/SettingHelper";
import { connect } from "react-redux";
import Moment from "moment";
var qs = require("qs");

import {
  GET_ACTIVITYCOUNT,
  GET_REWARDEARNED,
  GET_REWARDREDEEM,
  GET_PRINTORDER,
  GET_ORDERHISTORY,
} from "../../actions";

import cookie from "react-cookies";
import scotterImg from "../../common/images/scotter-icon.png";
import mapImg from "../../common/images/map-icon.png";

class Rewards extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cartItems: [],
      cartData: [],
      receiptDetails: [],
      activityPoints: {
        reward_ponits: "",
        reward_ponits_monthly: "",
        order_all: "",
        promotion: "",
      },
      status: "",
      status1: "",
      showearnitems: 10,
      showredeemitems: 10,
      order_all: 0,
      overall_orders: 0,
      reward_ponits: 0,
    };
    if (cookie.load("UserId") === undefined) {
      props.history.push("/");
    }
  }
  componentDidMount() {
    this.getActivityCounts();
    this.props.getRewardEarned(cookie.load("UserId"), this.state.showearnitems);
    this.props.getRewardRedeem(
      cookie.load("UserId"),
      this.state.showredeemitems
    );
    $("#dvLoading").fadeOut(2000);
  }

  /* for load more button -start */

  loadrewardearn() {
    var pageNext = this.state.showearnitems + 10;
    this.setState({ showearnitems: pageNext }, function () {
      this.loadereward();
    });
  }
  loadrewardredeem() {
    var pagepNext = this.state.showredeemitems + 10;
    this.setState({ showredeemitems: pagepNext }, function () {
      this.loadrreward();
    });
  }

  loadereward() {
    $(".load_more_data").append('<b class="gloading_img"></b>');
    this.props.getRewardEarned(cookie.load("UserId"), this.state.showearnitems);
  }
  loadrreward() {
    $(".load_more_data1").append('<b class="gloading_img"></b>');
    this.props.getRewardRedeem(
      cookie.load("UserId"),
      this.state.showredeemitems
    );
  }

  /* for load more button -end */

  /* Get Redeem Points Count History Details */
  getActivityCounts() {
    const inputKeys = ["reward", "overall_orders"];
    this.props.getActivityCount(JSON.stringify(inputKeys));
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
            reward_ponits: nextProps.activitycount[0].result_set.reward_ponits,
          });
        }
      }
    } else {
      this.setState({ overall_orders: 0, reward_ponits: 0 });
    }
    /*activity count - end*/

    /* reward earned - start */
    if (nextProps.rewardearned !== this.props.rewardearned) {
      $("b").removeClass("gloading_img");
      $("#dvLoading").fadeOut(2000);
      if (typeof nextProps.rewardearned[0].result_set !== "undefined") {
        this.setState({ pointsEarned: nextProps.rewardearned[0].result_set });
        this.setState({ status: "ok" });
        if (
          this.state.showearnitems >
          nextProps.rewardearned[0].common.total_records
        ) {
          $(".load_more_data").hide();
        } else {
          $(".load_more_data").show();
        }
      } else {
        $(".load_more_data").hide();
      }
    }
    /* reward earned - end */

    /* reward redeem - start */
    if (nextProps.rewardredeem !== this.props.rewardredeem) {
      $("b").removeClass("gloading_img");
      $("#dvLoading").fadeOut(2000);
      if (typeof nextProps.rewardredeem[0].result_set !== "undefined") {
        this.setState({ pointsRedeemed: nextProps.rewardredeem[0].result_set });
        this.setState({ status1: "ok" });
        if (
          this.state.showredeemitems >
          nextProps.rewardredeem[0].common.total_records
        ) {
          $(".load_more_data1").hide();
        } else {
          $(".load_more_data1").show();
        }
      } else {
        $(".load_more_data1").hide();
      }
    }
    /* reward redeem - end */

    /* view receipt - start */
    if (nextProps.orderhistory !== this.props.orderhistory) {
      if (nextProps.orderhistory[0].status === "ok") {
        this.setState({
          catrngCartItems: nextProps.orderhistory[0].result_set[0]["items"],
          catrngReceiptDetails: nextProps.orderhistory[0].result_set[0],
        });
        $("#dvLoading").fadeOut(1500);
        setTimeout(function () {
          $.magnificPopup.open({
            items: {
              src: ".receipt_popup",
            },
            type: "inline",
          });
        }, 1000);
      } else {
        $("#dvLoading").fadeOut(2000);
      }
    }
    /* view receipt - end */

    /* print reward - start */
    if (nextProps.printorder !== this.props.printorder) {
      if (nextProps.printorder[0].status === "ok") {
        $("#dvLoading").fadeOut(2000);
        window.open(nextProps.printorder[0].pdf_url, "_blank");
      } else {
        if (nextProps.printorder[0].form_error) {
          showAlert("Error", nextProps.printorder[0].form_error);
        } else {
          showAlert("Error", nextProps.printorder[0].message);
        }
        $.magnificPopup.open({
          items: {
            src: ".alert_popup",
          },
          type: "inline",
        });
      }
    }
  }
  /* print reward - end */

  /* reward earned - start */
  __rewardListing() {
    if (this.state.status === "ok") {
      return this.state.pointsEarned.map((points, index) => (
        <div
          key={points.order_id}
          className={
            points.lh_from === "order" && points.order_primary_id !== ""
              ? "current_order"
              : "current_order custom_points_cls"
          }
        >
          {points.lh_from === "order" && points.order_primary_id !== "" ? (
            <div>
              <div className="myacc_head_sec">
                <div className="head_left">
                  <div className="head-group">
                    <h4>ORDER NO - {points.order_local_no}</h4>
                  </div>
                </div>
                <div className="head_right">
                  <div className="head-group">
                    <h4>{points.order_availability_name}</h4>
                  </div>
                </div>
              </div>

              <div className="order_details_body">
                <div className="delivery_total delivery_total_number">
                  <div className="expiry_on_lhs">
                    <div className="delivery_total_left">
                      <h4 className="checkoutDate">
                        {Moment(points.order_date).format("DD/MM/YYYY")}
                      </h4>
                    </div>
                    <div className="delivery_total_left delivery_total_right">
                      {/* Advanced Slot */}
                      <h4 className="checkoutTime">
                        {this.showOrdTimeSlot(points)}
                      </h4>
                    </div>
                  </div>
                  <div className="delivery_total_left delivery_total_right expiry_on_rhs">
                    <h4 className="checkoutDate">
                      Expiry On :
                      {Moment(points.lh_expiry_on).format("DD/MM/YYYY")}
                    </h4>
                  </div>
                </div>

                <div className="order_amt_div">
                  <h3>
                    Order Amount <sup>$</sup>
                    {points.order_total_amount}
                  </h3>
                </div>
              </div>

              <div className="order_details_footer">
                <div className="order_amt">
                  <div className="order_amt-left">
                    <h3>{points.lh_status}</h3>
                  </div>
                  <div className="order_amt-right">
                    <h3 className="text-right">
                      {points.lh_credit_points} Points
                    </h3>
                  </div>
                </div>

                <div className="order_btns">
                  <a
                    href="javascript:void(0);"
                    onClick={this.printReceipt.bind(
                      this,
                      points.order_primary_id,
                      points.order_availability_id
                    )}
                    className="button print_invoice"
                    title=""
                  >
                    Print Invoice
                  </a>
                  <a
                    href="javascript:void(0);"
                    onClick={this.getReceipt.bind(
                      this,
                      points.order_id,
                      points.order_availability_id
                    )}
                    className="button view_recipt"
                    title=""
                  >
                    View Receipt
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="myacc_head_sec">
                <div className="head_left">
                  <div className="head-group">
                    <h4>ORDER NO - {points.order_local_no}</h4>
                  </div>
                </div>
                <div className="head_right">
                  <div className="head-group">
                    <h4>{points.order_availability_name}</h4>
                  </div>
                </div>
              </div>

              <div className="order_details_body">
                <div className="delivery_total delivery_total_number">
                  <div className="expiry_on_lhs">
                    <div className="delivery_total_left">
                      <h4 className="checkoutDate">
                        {Moment(points.order_date).format("DD/MM/YYYY")}
                      </h4>
                    </div>
                    <div className="delivery_total_left delivery_total_right">
                      <h4 className="checkoutTime">
                        {Moment(points.order_date).format("h:mm A")}
                      </h4>
                    </div>
                  </div>
                  <div className="delivery_total_left delivery_total_right expiry_on_rhs">
                    <h4 className="checkoutDate">
                      Expiry On :
                      {Moment(points.lh_expiry_on).format("DD/MM/YYYY")}
                    </h4>
                  </div>
                </div>

                <div className="order_amt_div">
                  <h3>
                    {points.lh_reason !== ""
                      ? stripslashes(points.lh_reason)
                      : ""}
                  </h3>
                </div>
              </div>

              <div className="order_details_footer">
                <div className="order_amt">
                  <div className="order_amt-left">
                    <h3>{points.lh_status}</h3>
                  </div>
                  <div className="order_amt-right">
                    <h3 className="text-right">
                      {points.lh_credit_points} Points
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ));
    } else {
      return <div className="no-recrds-found">No records found</div>;
    }
  }
  /* reward earned - end */

  /* reward redeem - start */

  __rewardRedeemListing() {
    if (this.state.status1 === "ok") {
      return this.state.pointsRedeemed.map((points, index) => (
        <div key={points.order_id} className="current_order">
          <div className="myacc_head_sec">
            <div className="head_left">
              <div className="head-group">
                <h4>ORDER NO - {points.order_local_no}</h4>
              </div>
            </div>
            <div className="head_right">
              <div className="head-group">
                <h4>{points.order_availability_name}</h4>
              </div>
            </div>
          </div>

          <div className="order_details_body">
            <div className="delivery_total delivery_total_number">
              <div className="delivery_total_left">
                <h4 className="checkoutDate">
                  {Moment(points.order_date).format("DD/MM/YYYY")}
                </h4>
              </div>
              <div className="delivery_total_left delivery_total_right">
                <h4 className="checkoutTime">
                  {Moment(points.order_date).format("h:mm A")}
                </h4>
              </div>
            </div>

            <div className="order_amt_div">
              <h3>
                Order Amount <sup>$</sup>
                {points.order_total_amount}
              </h3>
            </div>
          </div>

          <div className="order_details_footer">
            <div className="order_amt">
              <div className="order_amt-left">
                <h3>{points.lh_redeem_status}</h3>
              </div>
              <div className="order_amt-right">
                <h3 className="text-right">{points.lh_redeem_point} Points</h3>
              </div>
            </div>

            <div className="order_btns">
              <a
                href="javascript:void(0);"
                onClick={this.printReceipt.bind(
                  this,
                  points.order_primary_id,
                  points.order_availability_id
                )}
                className="button print_invoice"
                title=""
              >
                Print Invoice
              </a>
              <a
                href="javascript:void(0);"
                onClick={this.getReceipt.bind(
                  this,
                  points.order_id,
                  points.order_availability_id
                )}
                className="button view_recipt"
                title=""
              >
                View Receipt
              </a>
            </div>
          </div>
        </div>
      ));
    } else {
      return <div className="no-recrds-found">No records found</div>;
    }
  }
  /* reward redeem - end */

  getReceipt(orderId, availabilityId) {
    $("#dvLoading").fadeIn();
    var params =
      "&customer_id=" + cookie.load("UserId") + "&order_id=" + orderId;
    this.props.getOrderHistory(params);
  }

  printReceipt(orderprimaryId, availabilityId) {
    $("#dvLoading").fadeIn();
    var availabilityIdNew = deliveryId;
    this.props.getPrintOrder(orderprimaryId, availabilityIdNew);
  }

  /* Advanced Slot */
  showOrdTimeSlot(orderDetail) {
    var ordTmSlt = Moment(orderDetail.order_date).format("hh:mm A");
    if (orderDetail.order_is_timeslot === "Yes") {
      var slotTime1 =
        orderDetail.order_pickup_time_slot_from !== ""
          ? orderDetail.order_pickup_time_slot_from.split(":")
          : Array();
      var slotTime2 =
        orderDetail.order_pickup_time_slot_to !== ""
          ? orderDetail.order_pickup_time_slot_to.split(":")
          : Array();
      if (
        Object.keys(slotTime1).length > 0 &&
        Object.keys(slotTime2).length > 0
      ) {
        var startTimeVal = parseInt(slotTime1[0]);
        var startMinitVal = parseInt(slotTime1[1]);
        var strdatevalobj = new Date();
        strdatevalobj.setHours(startTimeVal);
        strdatevalobj.setMinutes(startMinitVal);

        var endTimeVal = parseInt(slotTime2[0]);
        var endMinitVal = parseInt(slotTime2[1]);
        var enddatevalobj = new Date();
        enddatevalobj.setHours(endTimeVal);
        enddatevalobj.setMinutes(endMinitVal);

        ordTmSlt =
          format(strdatevalobj, "p") + " - " + format(enddatevalobj, "p");
      }
    }

    return ordTmSlt;
  }

  render() {
    var settingsMyAcc = {
      infinite: false,
      slidesToShow: 4,
      slidesToScroll: 4,
      initialSlide: 2,
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

    /*setTimeout(function () {
		$('#dvLoading').remove();
		}, 500);*/
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
                  <li className="active">
                    <Link to="/rewards" title="My Rewards">
                      <span>Rewards</span>
                    </Link>
                  </li>
                  <li>
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
                    <div className="mbacc_mslide active">
                      <Link to="/rewards" title="My Rewards">
                        <span>Rewards</span>
                      </Link>
                    </div>
                    <div className="mbacc_mslide">
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
                      <div className="congrats">
                        <div className="congrats-inner">
                          <h3>Your Current Reward Points</h3>
                          <h2>{this.state.reward_ponits || 0} Points</h2>
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
                                  <span>REWARDS EARNED</span>
                                </a>
                              </li>
                              <li className="">
                                <a
                                  data-toggle="tab"
                                  href="#tab-id-inn6"
                                  aria-expanded="false"
                                >
                                  <span>REWARDS REDEEMED</span>
                                </a>
                              </li>
                            </ul>
                            <div className="tab-content">
                              <div
                                id="tab-id-inn5"
                                className="tab-pane fade active in"
                              >
                                <h4 className="tab_mobtrigger inner_tab_border active">
                                  REWARDS EARNED<i></i>
                                </h4>
                                <div className="tab_mobrow filter_tabin">
                                  <div className="order-delivery">
                                    <div className="ord-body">
                                      <div className="cur-order-body reward-list-body">
                                        <div className="myacc_order_details">
                                          {this.__rewardListing(
                                            this.state.pointsEarned
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="load_more_div">
                                  <button
                                    className="load_more_data"
                                    style={{ display: "none" }}
                                    onClick={this.loadrewardearn.bind(this)}
                                  >
                                    Load More
                                  </button>
                                </div>
                              </div>
                              <div id="tab-id-inn6" className="tab-pane fade">
                                <h4 className="tab_mobtrigger inner_tab_border">
                                  REWARDS REDEEMED<i></i>
                                </h4>
                                <div className="tab_mobrow filter_tabin">
                                  <div className="cur-order-body reward-list-body">
                                    <div className="myacc_order_details">
                                      {this.__rewardRedeemListing(
                                        this.state.pointsRedeemed
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="load_more_div">
                                  <button
                                    className="load_more_data1"
                                    style={{ display: "none" }}
                                    onClick={this.loadrewardredeem.bind(this)}
                                  >
                                    Load More
                                  </button>
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
          className="white-popup mfp-hide popup_sec receipt_popup"
        >
          <div className="pouup_in">
            <Viewreceipt
              details={this.state.catrngReceiptDetails}
              cartItems={this.state.catrngCartItems}
            />
          </div>
        </div>
        <div id="dvLoading"></div>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    activitycount: state.activitycount,
    rewardearned: state.rewardearned,
    rewardredeem: state.rewardredeem,
    orderhistory: state.orderhistory,
    printorder: state.printorder,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    getActivityCount: (getObject) => {
      dispatch({ type: GET_ACTIVITYCOUNT, getObject });
    },
    getRewardEarned: (customer_id, limit) => {
      dispatch({ type: GET_REWARDEARNED, customer_id, limit });
    },
    getRewardRedeem: (customer_id, limit) => {
      dispatch({ type: GET_REWARDREDEEM, customer_id, limit });
    },
    getOrderHistory: (params) => {
      dispatch({ type: GET_ORDERHISTORY, params });
    },

    getPrintOrder: (orderprimaryId, availabilityId) => {
      dispatch({ type: GET_PRINTORDER, orderprimaryId, availabilityId });
    },
  };
};
Rewards.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }),
};
export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Rewards)
);

class Viewreceipt extends React.Component {
  constructor(props) {
    super(props);
  }

  loadItems(cartItems) {
    if (cartItems.length > 0) {
      return cartItems.map((item, index) => (
        <div className="cart_row oreder_itm_row" key={index}>
          <div className="row oreder-row-inv">
            <div className="col-xs-7 cart_left">
              <div className="cart_info">
                <h4>
                  {stripslashes(item.item_name)} X {item.item_qty}
                </h4>

                {this.loadModifierItems(
                  "Component",
                  item.modifiers,
                  item.set_menu_component
                )}
              </div>

              {item.item_specification !== "" && (
                <p className="help-block">
                  {stripslashes(item.item_specification)}
                </p>
              )}

              {/*} <p className ="help-block">Special instruction for individual product items ...</p>{*/}
            </div>
            <div className="col-xs-5 cart_right text-right">
              <div className="cart_price">
                <p>${parseFloat(item.item_total_amount).toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      ));
    }
  }

  /* this function used to load modifer items */
  loadModifierItems(itemType, modifiers, combo) {
    var len = modifiers.length;
    var comboLen = combo.length;
    var html = '<div class="cart_extrainfo">';

    if (len > 0) {
      for (var i = 0, length = len; i < length; i++) {
        var modName = modifiers[i]["order_modifier_name"];
        var modval = modifiers[i]["modifiers_values"][0]["order_modifier_name"];
        html +=
          "<p><b>" +
          stripslashes(modName) +
          ":</b></p><p> " +
          stripslashes(modval) +
          "</p> ";
      }
      html += "</div>";
      var reactElement = Parser(html);
      return reactElement;
    } else if (comboLen > 0) {
      for (var i = 0, length = comboLen; i < length; i++) {
        var comboName = combo[i]["menu_component_name"];
        var comboVal = this.showComboProducts(combo[i]["product_details"]);

        html +=
          "<p><b>" +
          comboName +
          ":</b></p><p> " +
          comboVal +
          " " +
          this.showComboModifiers(combo[i]["product_details"][0]["modifiers"]) +
          "</p> ";
      }
      html += "</div>";
      var reactElement = Parser(html);
      return reactElement;
    }
  }

  /* show combo products  list */
  showComboProducts(combos) {
    var lenCombo = combos.length;
    var html = " ";
    if (lenCombo > 0) {
      for (var r = 0, lengthCombo = lenCombo; r < lengthCombo; r++) {
        var comboPro = combos[r]["menu_product_name"];
        var comboQty = combos[r]["menu_product_qty"];
        var comboPrice = combos[r]["menu_product_price"];
        var newPrice = comboPrice > 0 ? " (+" + comboPrice + ")" : "";
        if (parseInt(comboQty) > 0) {
          html += "<p>" + comboQty + " X " + comboPro + newPrice + " </p> ";
        }
      }
      return html;
    }
    return "";
  }

  /* this function used to show combo modifieirs list */
  showComboModifiers(modifiers) {
    var lenMod = modifiers.length;
    var html = "";
    if (lenMod > 0) {
      html = "<div >";
      for (var i = 0, length = lenMod; i < length; i++) {
        var modName = modifiers[i]["order_modifier_name"];
        var modval = modifiers[i]["modifiers_values"][0]["order_modifier_name"];
        var modValPrice =
          modifiers[i]["modifiers_values"][0]["order_modifier_price"];
        var newModValPrice = modValPrice > 0 ? " (+" + modValPrice + ")" : "";
        html +=
          "<p><b>" +
          modName +
          ":</b></p><p> " +
          modval +
          newModValPrice +
          "</p> ";
      }
      html += "</div>";
    }
    return html;
  }

  /* Advanced Slot */
  showOrdTimeSlot(orderDetail) {
    var ordTmSlt = Moment(orderDetail.order_date).format("hh:mm A");
    if (orderDetail.order_is_timeslot === "Yes") {
      var slotTime1 =
        orderDetail.order_pickup_time_slot_from !== ""
          ? orderDetail.order_pickup_time_slot_from.split(":")
          : Array();
      var slotTime2 =
        orderDetail.order_pickup_time_slot_to !== ""
          ? orderDetail.order_pickup_time_slot_to.split(":")
          : Array();
      if (
        Object.keys(slotTime1).length > 0 &&
        Object.keys(slotTime2).length > 0
      ) {
        var startTimeVal = parseInt(slotTime1[0]);
        var startMinitVal = parseInt(slotTime1[1]);
        var strdatevalobj = new Date();
        strdatevalobj.setHours(startTimeVal);
        strdatevalobj.setMinutes(startMinitVal);

        var endTimeVal = parseInt(slotTime2[0]);
        var endMinitVal = parseInt(slotTime2[1]);
        var enddatevalobj = new Date();
        enddatevalobj.setHours(endTimeVal);
        enddatevalobj.setMinutes(endMinitVal);

        ordTmSlt =
          format(strdatevalobj, "p") + " - " + format(enddatevalobj, "p");
      }
    }

    return ordTmSlt;
  }

  render() {
    const { details, cartItems } = this.props;
    if (details !== undefined) {
      return (
        <div className="Viewreceipt">
          <div className="tnk-you">
            <div className="tnk-header">
              <div className="tnk-detail">
                <div className="tnk-order">
                  <h3>Order No - {details.order_local_no}</h3>
                  <p>
                    Order placed at :{" "}
                    {Moment(details.order_created_on).format(
                      "DD-MM-YYYY hh:mm A"
                    )}
                    <br></br>Pay by : {details.order_method_name}
                  </p>
                </div>
                <h2>YOUR ORDER DETAILS</h2>
              </div>
              <div className="tnk-delivery">
                {details.order_availability_id === deliveryId ? (
                  <div className="delivery_total">
                    <div className="delivery_total_left">
                      <img src={scotterImg} />
                      <h3>Delivery From</h3> <span>{details.outlet_name}</span>
                      <span>
                        {addressFormat(
                          details.outlet_unit_number1,
                          details.outlet_unit_number2,
                          details.outlet_address_line1,
                          details.outlet_address_line2,
                          details.outlet_postal_code
                        )}
                      </span>
                    </div>
                    <div className="delivery_total_left delivery_total_right">
                      <img src={mapImg} />
                      <h3>Deliver TO</h3>{" "}
                      <span>{details.order_customer_address_line1}</span>{" "}
                      <span>
                        Singapore {details.order_customer_postal_code}
                      </span>{" "}
                      <span>
                        {details.order_customer_unit_no1 != "" &&
                        details.order_customer_unit_no2 != ""
                          ? details.order_customer_unit_no1 +
                            "-" +
                            details.order_customer_unit_no2
                          : ""}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="delivery_total pickup-order-div">
                    <div className="delivery_total_left">
                      <h3>Pickup Location</h3>
                      <span>{details.outlet_name}</span>
                      <span>
                        {addressFormat(
                          details.outlet_unit_number1,
                          details.outlet_unit_number2,
                          details.outlet_address_line1,
                          details.outlet_address_line2,
                          details.outlet_postal_code
                        )}
                      </span>
                    </div>
                  </div>
                )}

                <div className="delivery_total delivery_total_number">
                  <div className="delivery_total_left">
                    <h2>
                      {details.order_availability_id === deliveryId
                        ? "Delivery"
                        : "Pickup"}{" "}
                      Date
                    </h2>
                    <h4 className="checkoutDate">
                      {Moment(details.order_date).format("DD-MM-YYYY")}
                    </h4>
                  </div>
                  <div className="delivery_total_left delivery_total_right">
                    <h2>
                      {details.order_availability_id === deliveryId
                        ? "Delivery"
                        : "Pickup"}{" "}
                      time
                    </h2>
                    <h4 className="checkoutTime">
                      {/* Advanced Slot */}
                      {this.showOrdTimeSlot(details)}
                    </h4>
                  </div>
                </div>
                <div className="order-items-maindiv">
                  {this.loadItems(cartItems)}
                </div>

                <div className="cart_footer tnk_cart_footer">
                  <div className="cart_row">
                    <p className="text-uppercase">SUBTOTAL</p>
                    <span>${details.order_sub_total}</span>
                  </div>

                  {parseFloat(details.order_discount_amount) > 0 && (
                    <div className="cart_row">
                      <p className="text-uppercase">
                        {details.order_discount_type === "redeem"
                          ? "Discount (-)"
                          : "Promocode (-)"}
                      </p>
                      <span>${details.order_discount_amount}</span>
                    </div>
                  )}

                  {parseFloat(details.order_delivery_charge) > 0 && (
                    <div className="cart_row">
                      <p className="text-uppercase">Delivery Charges</p>
                      <span>
                        $
                        {(
                          parseFloat(details.order_delivery_charge) +
                          parseFloat(details.order_additional_delivery)
                        ).toFixed(2)}
                      </span>
                    </div>
                  )}
                  {parseFloat(details.order_service_charge_amount) > 0 && (
                    <div className="cart_row">
                      {parseFloat(details.order_service_charge) > 0 ? (
                        <p className="text-uppercase">
                          Service Charge (
                          {parseFloat(details.order_service_charge)}%)
                        </p>
                      ) : (
                        <p className="text-uppercase">Service Charge</p>
                      )}
                      <span>
                        $
                        {parseFloat(
                          details.order_service_charge_amount
                        ).toFixed(2)}
                      </span>
                    </div>
                  )}

                  {parseFloat(details.order_subcharge_amount) > 0 && (
                    <div className="cart_row">
                      <p className="text-uppercase">Surcharge</p>
                      <span>
                        {parseFloat(details.order_subcharge_amount).toFixed(2)}
                      </span>
                    </div>
                  )}
                  {parseFloat(details.order_voucher_discount_amount) > 0 && (
                    <div className="cart_row">
                      <p className="text-uppercase">Voucher Discount(-)</p>
                      <span>${details.order_voucher_discount_amount}</span>
                    </div>
                  )}

                  {details.order_tax_calculate_amount > 0 && (
                    <div className="cart_row  gst-row">
                      <p className="text-uppercase">
                        GST({details.order_tax_charge}%)
                      </p>
                      <span>${details.order_tax_calculate_amount}</span>
                    </div>
                  )}

                  <div className="cart_row cart_footer_totrow grant-total-cls">
                    <p className="text-uppercase">Total</p>
                    <span>${details.order_total_amount}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return <div></div>;
    }
  }
}
