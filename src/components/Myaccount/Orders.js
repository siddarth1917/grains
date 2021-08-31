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
var Parser = require("html-react-parser");
var base64 = require("base-64");
import {
  apiUrl,
  apiUrlV2,
  appId,
  deliveryId,
  pickupId,
  baseUrl,
} from "../Helpers/Config";
import {
  addressFormat,
  stripslashes,
  showPriceValue,
  showCustomAlert,
  removeOrderDateTime,
  removePromoCkValue,
  timeToConv12,
  showPriceValueNew,
  getSurchargesplitup,
} from "../Helpers/SettingHelper";

import axios from "axios";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Moment from "moment";
import { setMinutes, setHours, getDay, format } from "date-fns";
var qs = require("qs");
import {
  GET_CORDERDETAIL,
  GET_PORDERDETAIL,
  GET_PRINTORDER,
  GET_ORDERHISTORY,
  GET_ACTIVITYCOUNT,
} from "../../actions";

import cookie from "react-cookies";

import scotterImg from "../../common/images/scotter-icon.png";
import mapImg from "../../common/images/map-icon.png";
import productImg from "../../common/images/noimg-400x400.jpg";
import orderagainImg from "../../common/images/order-again.png";
import warningImg from "../../common/images/warning.svg";
class Orders extends Component {
  constructor(props) {
    super(props);

    this.state = {
      corderdetail: [],
      cartItems: [],
      cartData: [],
      cart_brktime_list: [],
      showitems: 10,
      showpitems: 10,
      showresvitems: 10,
      resviewmore: "none",
      order_all: 0,
      overall_orders: 0,
      deliveryTakeaway_orders: 0,

      deliveryInfo: "",
      seletedAvilablityId: "",
      seletedOutletId: "",
      order_tat_time: "",
      orderHandled: "",
      getDateTimeFlg: "no",
      isAdvanced: "",
      slotType: "",
      pickupInfo: "",
      existCart: false,
      cartTriggerFlg: "No",
      opencart: "N",
    };

    if (cookie.load("UserId") === undefined) {
      props.history.push("/");
    }

    this.loadCart();
  }

  componentDidMount() {
    /* delivery current - past orders */
    var deliveryparams =
      "&customer_id=" +
      base64.encode(cookie.load("UserId")) +
      "&enc=Y&limit=" +
      this.state.showitems +
      "&except_availability=yes";
    this.props.getCorderDetail(deliveryparams);

    var deliverypastparams =
      "&customer_id=" +
      base64.encode(cookie.load("UserId")) +
      "&enc=Y&limit=" +
      this.state.showitems +
      "&except_availability=yes";
    this.props.getPorderDetail(deliverypastparams);
    $("#dvLoading").fadeOut(2000);

    //Default Action
    $(".filter_tabsec").hide(); //Hide all content
    $("ul.web_order_typecls li:first").addClass("active").show(); //Activate first tab
    $(".filter_tabsec:first").show(); //Show first tab content

    //On Click Event
    $("ul.web_order_typecls li").click(function () {
      $("ul.web_order_typecls li").removeClass("active"); //Remove any "active" class
      $(this).addClass("active"); //Add "active" class to selected tab
      $(".filter_tabsec").hide(); //Hide all tab content
      var activeTab = $(this).find("a").attr("href"); //Find the rel attribute value to identify the active tab + content
      $(activeTab).fadeIn(); //Fade in the active content
      return false;
    });

    this.getActivityCounts();
  }

  loadCart() {
    var availability =
      cookie.load("defaultAvilablityId") !== "" &&
      typeof cookie.load("defaultAvilablityId") !== undefined &&
      typeof cookie.load("defaultAvilablityId") !== "undefined"
        ? cookie.load("defaultAvilablityId")
        : "";
    axios
      .get(
        apiUrl +
          "cart/contents?status=A&app_id=" +
          appId +
          "&customer_id=" +
          base64.encode(cookie.load("UserId")) +
          "&enc=Y&availability_id=" +
          availability
      )
      .then((cart) => {
        if (cart.data.status === "ok") {
          if (
            cart.data.result_set !== "" &&
            typeof cart.data.result_set !== undefined &&
            typeof cart.data.result_set !== "undefined"
          ) {
            this.setState({ existCart: true });
          }
        }
      });
  }

  /* for order load more  button */
  loadcurrentItems() {
    var pageNext = this.state.showitems + 10;
    this.setState({ showitems: pageNext }, function () {
      this.loadcitems();
    });
  }
  loadpastItems() {
    var pagepNext = this.state.showpitems + 10;
    this.setState({ showpitems: pagepNext }, function () {
      this.loadpitems();
    });
  }

  loadcitems() {
    $(".load_more_data").append('<b class="gloading_img"></b>');
    var deliveryparams =
      "&customer_id=" +
      base64.encode(cookie.load("UserId")) +
      "&enc=Y&availabilityIDs=" +
      deliveryId +
      "&limit=" +
      this.state.showitems +
      "&except_availability=yes";
    this.props.getCorderDetail(deliveryparams);
  }
  loadpitems() {
    $(".load_more_data1").append('<b class="gloading_img"></b>');
    var deliverypastparams =
      "&customer_id=" +
      cookie.load("UserId") +
      "&availabilityIDs=" +
      deliveryId +
      "&limit=" +
      this.state.showitems +
      "&except_availability=yes";
    this.props.getPorderDetail(deliverypastparams);
  }

  getActivityCounts() {
    const inputKeys = [
      "order_all",
      "overall_orders",
      "deliveryTakeaway_orders",
    ];
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
            order_all: nextProps.activitycount[0].result_set.order_all,
            overall_orders:
              nextProps.activitycount[0].result_set.overall_orders,
            deliveryTakeaway_orders:
              nextProps.activitycount[0].result_set.deliveryTakeaway_orders,
          });
          $("#dvLoading").fadeOut(2000);
        }
      }
    } else {
      this.setState({
        order_all: 0,
        overall_orders: 0,
        deliveryTakeaway_orders: 0,
      });
    }

    /*current orders */
    if (nextProps.corderdetail !== this.props.corderdetail) {
      if (nextProps.corderdetail && nextProps.corderdetail[0].status == "ok") {
        $("b").removeClass("gloading_img");
        $("#dvLoading").fadeOut(2000);
        this.setState({ corderdetail: nextProps.corderdetail[0].result_set });
        if (nextProps.corderdetail[0].common.total_records) {
          this.setState({
            totalcount: nextProps.corderdetail[0].common.total_records,
          });
        }
        if (
          this.state.showitems > nextProps.corderdetail[0].common.total_records
        ) {
          $(".load_more_data").hide();
        } else {
          $(".load_more_data").show();
        }
      } else {
        $(".load_more_data").hide();
      }
    }

    if (nextProps.porderdetail !== this.props.porderdetail) {
      if (nextProps.porderdetail && nextProps.porderdetail[0].status == "ok") {
        $("b").removeClass("gloading_img");
        $("#dvLoading").fadeOut(2000);
        this.setState({ porderdetail: nextProps.porderdetail[0].result_set });
        if (
          nextProps.porderdetail[0].common.total_records &&
          this.state.showpitems > nextProps.porderdetail[0].common.total_records
        ) {
          $(".load_more_data1").hide();
        } else {
          $(".load_more_data1").show();
        }
      } else {
        $(".load_more_data1").hide();
      }
    }

    if (nextProps.orderhistory !== this.props.orderhistory) {
      if (nextProps.orderhistory[0].status === "ok") {
        this.setState({
          CartItems: nextProps.orderhistory[0].result_set[0]["items"],
          ReceiptDetails: nextProps.orderhistory[0].result_set[0],
        });

        $("#dvLoading").fadeOut(5000);
        setTimeout(function () {
          $.magnificPopup.open({
            items: {
              src: ".receipt_popup",
            },
            type: "inline",
          });
        }, 1000);
      } else {
        this.setState({ ReceiptDetails: [] });
      }
    }

    if (nextProps.printorder !== this.props.printorder) {
      if (nextProps.printorder[0].status === "ok") {
        $("#dvLoading").fadeOut(2000);
        window.open(nextProps.printorder[0].pdf_url, "_blank");
      }
    }
  }

  getReceipt(orderId) {
    $("#dvLoading").fadeIn();
    var params =
      "&customer_id=" +
      base64.encode(cookie.load("UserId")) +
      "&enc=Y&order_id=" +
      orderId;
    this.props.getOrderHistory(params);
  }

  printReceipt(orderId, availabilityId) {
    $("#dvLoading").fadeIn();
    this.props.getPrintOrder(orderId, deliveryId);
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

  getOrderItemData = (dataProp) => {
    var dataProp = dataProp !== undefined ? dataProp : Array();
    if (Object.keys(dataProp).length > 0) {
      return dataProp.map((item) => {
        const orderDate = Moment(item.order_date).format("DD/MM/YYYY");
        /* Advanced Slot */
        const orderTime = this.showOrdTimeSlot(item);

        return (
          <div key={item.order_id} className="current_order">
            <div className="myacc_head_sec">
              <div className="head_left">
                <div className="head-group">
                  <h4>ORDER NO - {item.order_local_no}</h4>
                </div>
              </div>
              <div className="head_right">
                <div className="head-group">
                  <h4>{item.status_name}</h4>
                </div>
              </div>
            </div>
            <div className="order_details_body">
              <div className="order_again">
                <a
                  href="/"
                  className="orderagain_btn"
                  title="OrderAgain"
                  onClick={this.orderAgain.bind(this, item.order_id)}
                >
                  <img src={orderagainImg} /> Order Again
                </a>
              </div>

              <div className="order_no_deatails">
                Order placed at :
                {Moment(item.order_created_on).format("DD/MM/YYYY") +
                  " " +
                  Moment(item.order_created_on).format("h:mm A")}
                <span>Pay by : {item.order_method_name}</span>
              </div>
              {item.order_availability_id === deliveryId ? (
                <div className="delivery_total delivery_total_text">
                  <div className="delivery_total_left">
                    <img src={scotterImg} />
                    <h3>Order Handling By</h3>
                    <span>
                      {item.outlet_name !== "" && item.outlet_name !== null
                        ? stripslashes(item.outlet_name)
                        : ""}
                    </span>
                    <span>
                      {addressFormat(
                        item.outlet_unit_number1,
                        item.outlet_unit_number2,
                        item.outlet_address_line1,
                        item.outlet_address_line2,
                        item.outlet_postal_code
                      )}
                    </span>
                  </div>
                  <div className="delivery_total_left delivery_total_right">
                    <img src={mapImg} />
                    <h3>Delivery Location</h3>
                    <span>
                      {addressFormat(
                        item.order_customer_unit_no1,
                        item.order_customer_unit_no2,
                        item.order_customer_address_line1,
                        item.order_customer_address_line2,
                        item.order_customer_postal_code
                      )}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="delivery_total delivery_total_text pickup-order-div">
                  <div className="delivery_total_left">
                    <h3>Pickup Location</h3>
                    <span>
                      {item.outlet_name !== "" && item.outlet_name !== undefined
                        ? stripslashes(item.outlet_name)
                        : ""}
                    </span>
                    <span>
                      {addressFormat(
                        item.outlet_unit_number1,
                        item.outlet_unit_number2,
                        item.outlet_address_line1,
                        item.outlet_address_line2,
                        item.outlet_postal_code
                      )}
                    </span>
                  </div>
                </div>
              )}
              <div className="delivery_total delivery_total_number">
                <div className="delivery_total_left">
                  <h2>
                    {item.order_availability_id === deliveryId
                      ? "Delivery"
                      : "Pickup"}{" "}
                    Date
                  </h2>
                  <h4 className="checkoutDate">{orderDate}</h4>
                </div>
                <div className="delivery_total_left delivery_total_right">
                  <h2>
                    {item.order_availability_id === deliveryId
                      ? "Delivery"
                      : "Pickup"}{" "}
                    time
                  </h2>
                  {/* Advanced Slot */}
                  <h4 className="checkoutTime">{orderTime}</h4>
                </div>
              </div>
            </div>

            <div className="order_details_footer">
              <div className="order_amt">
                <div className="order_amt-left">
                  <h3>Order Amount</h3>
                </div>
                <div className="order_amt-right">
                  <h3 className="text-right">
                    <sup>$</sup>
                    {item.order_total_amount}
                  </h3>
                </div>
              </div>

              {/*onClick={this.printReceipt.bind(this, item.order_primary_id)} onClick={this.getReceipt.bind(this, item.order_id)}*/}

              {item.order_availability_id === pickupId &&
              item.order_payment_mode === "1" &&
              item.order_method_name.toLowerCase() === "cash" ? (
                <div className="order_btns">
                  <a
                    href="javascript:void(0)"
                    onClick={this.getReceipt.bind(this, item.order_id)}
                    className="button view_recipt button_full_view"
                    title=""
                  >
                    View Receipt
                  </a>
                </div>
              ) : (
                <div className="order_btns">
                  <a
                    href="javascript:void(0)"
                    onClick={this.printReceipt.bind(
                      this,
                      item.order_primary_id
                    )}
                    className="button print_invoice"
                    title=""
                  >
                    Print Invoice
                  </a>
                  <a
                    href="javascript:void(0)"
                    onClick={this.getReceipt.bind(this, item.order_id)}
                    className="button view_recipt"
                    title=""
                  >
                    View Receipt
                  </a>
                </div>
              )}
            </div>
          </div>
        );
      });
    } else {
      return <div className="no-recrds-found">No records found</div>;
    }
  };

  reservStatus(statusTxt) {
    var returnTxt = "Pending";
    statusTxt = statusTxt !== "" ? parseInt(statusTxt) : 0;
    if (statusTxt === 2) {
      returnTxt = "Cancel";
    } else if (statusTxt === 1) {
      returnTxt = "Assigned";
    } else if (statusTxt === 3) {
      returnTxt = "Arrived";
    } else if (statusTxt === 4) {
      returnTxt = "Not Arrived";
    } else if (statusTxt === 5) {
      returnTxt = "Completed";
    }

    return returnTxt;
  }

  showNoOfPax(adultCount, childCount) {
    var adultTxt =
      parseInt(adultCount) == 0
        ? ""
        : parseInt(adultCount) == 1
        ? adultCount + " Adult"
        : adultCount + " Adults";
    var childTxt =
      parseInt(childCount) == 0
        ? ""
        : parseInt(childCount) == 1
        ? childCount + " Child"
        : childCount + " Children";
    var paxText = adultTxt + " " + childTxt;

    return paxText;
  }
  orderAgain(orderID, event) {
    event.preventDefault();
    this.setState({ orderID: orderID }, function () {
      if (this.state.existCart === true) {
        $.magnificPopup.open({
          items: {
            src: "#warningmyaccount-popup",
          },
          type: "inline",
        });
      } else {
        this.conformorderagian();
      }
    });
  }

  destroyCart(event) {
    event.preventDefault();
    var customerId =
      typeof cookie.load("UserId") === "undefined" ? "" : cookie.load("UserId");
    var postObject = {
      app_id: appId,
      customer_id: customerId,
    };

    axios
      .post(apiUrl + "cart/destroy", qs.stringify(postObject))
      .then((res) => {
        if (res.data.status === "ok") {
          this.deleteOrderCookie("Yes");
        }
        return false;
      });
  }
  deleteOrderCookie(clear = "Yes") {
    if (clear == "Yes") {
      cookie.remove("orderZoneId", { path: "/" });
      cookie.remove("orderOutletId", { path: "/" });
      cookie.remove("outletchosen", { path: "/" });
    }

    removeOrderDateTime();
    removePromoCkValue();

    console.log("ckvremove");

    cookie.remove("orderPaymentMode", { path: "/" });
    cookie.remove("orderTableNo", { path: "/" });
    cookie.remove("product_remarks", { path: "/" });
    cookie.remove("orderOutletName", { path: "/" });
    cookie.remove("carttotalitems", { path: "/" });
    cookie.remove("cartsubtotal", { path: "/" });
    cookie.remove("cartid", { path: "/" });
    cookie.remove("firstNavigation", { path: "/" });

    /* Delivery avilablity */
    cookie.remove("orderDateTime", { path: "/" });
    cookie.remove("deliveryDate", { path: "/" });
    cookie.remove("deliveryTime", { path: "/" });
    cookie.remove("unitNoOne", { path: "/" });
    cookie.remove("unitNoTwo", { path: "/" });

    /* For Advanced Slot */
    cookie.remove("isAdvanced", { path: "/" });
    cookie.remove("slotType", { path: "/" });
    cookie.remove("orderSlotVal", { path: "/" });
    cookie.remove("orderSlotTxt", { path: "/" });
    cookie.remove("orderSlotStrTime", { path: "/" });
    cookie.remove("orderSlotEndTime", { path: "/" });

    cookie.remove("promotion_id", { path: "/" });
    cookie.remove("promotion_applied", { path: "/" });
    cookie.remove("promotion_code", { path: "/" });
    cookie.remove("promotion_delivery_charge_applied", { path: "/" });
    cookie.remove("promotion_amount", { path: "/" });
    cookie.remove("promotion_category", { path: "/" });
    cookie.remove("prmo_type", { path: "/" });

    /*Remove voucher*/
    cookie.remove("voucher_applied", { path: "/" });
    cookie.remove("voucher_code", { path: "/" });
    cookie.remove("voucher_amount", { path: "/" });

    cookie.remove("points_redeemed", { path: "/" });
    cookie.remove("points_used", { path: "/" });
    cookie.remove("points_amount", { path: "/" });
    cookie.remove("prmo_type", { path: "/" });
    this.conformorderagian();
  }
  /* For Order Again Start */
  conformorderagian(event) {
    if (
      event !== "" &&
      typeof event !== undefined &&
      typeof event !== "undefined"
    ) {
      event.preventDefault();
    }

    var orderID = this.state.orderID;
    var customerId =
      typeof cookie.load("UserId") === "undefined" ? "" : cookie.load("UserId");
    console.log(orderID, "orderIDorderID");

    var postObject = {
      app_id: appId,
      order_id: orderID,
      customer_id: customerId,
    };

    axios
      .post(apiUrl + "cart/order_again", qs.stringify(postObject))
      .then((res) => {
        if (res.data.status === "ok") {
          var result_set = res.data.result_set;
          var tat = 0;
          if (result_set.order_availability_id === deliveryId) {
            tat = result_set.outlet_delivery_tat;
            this.findOutletBasedZone(
              result_set.order_customer_postal_code,
              result_set.order_availability_id
            );
          } else if (result_set.order_availability_id === pickupId) {
            this.pickOutlet(result_set);
          }
        } else if (res.data.status === "error") {
          var errMsgtxt =
            res.data.message !== ""
              ? res.data.message
              : "Sorry! order again can`t add your cart.";
          showCustomAlert("error", errMsgtxt);
        }
        return false;
      });
  }
  findOutletBasedZone(postalcode, availability) {
    axios
      .get(
        apiUrlV2 +
          "outlets/findOutletZone?app_id=" +
          appId +
          "&skip_timing=Yes&availability_id=" +
          availability +
          "&postal_code=" +
          postalcode +
          "&&postalcode_basedoutlet=yes"
      )
      .then((res) => {
        var deliveryInfo = [];
        if (res.data.status === "ok") {
          cookie.save("outletchosen", availability, { path: "/" });

          var additionalTatTime =
            res.data.result_set.zone_additional_tat_time !== ""
              ? res.data.result_set.zone_additional_tat_time
              : 0;
          var outletDeliveryTiming =
            res.data.result_set.outlet_delivery_timing !== ""
              ? res.data.result_set.outlet_delivery_timing
              : 0;
          var outletDeliveryTaT =
            parseInt(outletDeliveryTiming) + parseInt(additionalTatTime);

          var orderDeliveryAddress =
            res.data.result_set.postal_code_information.zip_buno +
            " " +
            res.data.result_set.postal_code_information.zip_sname;
          var orderHandled =
            stripslashes(res.data.result_set.outlet_name) +
            ", Crew will be seeing you in " +
            outletDeliveryTaT +
            " Minutes";

          deliveryInfo["orderZoneId"] = res.data.result_set.zone_id;
          deliveryInfo["orderOutletId"] = res.data.result_set.outlet_id;
          deliveryInfo["orderOutletName"] = stripslashes(
            res.data.result_set.outlet_name
          );
          deliveryInfo["orderPostalCode"] =
            res.data.result_set.postal_code_information.zip_code;
          deliveryInfo["orderTAT"] = outletDeliveryTaT;
          deliveryInfo["orderDeliveryAddress"] = orderDeliveryAddress;
          deliveryInfo["orderHandled"] = orderHandled;
          deliveryInfo["defaultAvilablityId"] = availability;

          var unitNum = this.showUnitNum(
            res.data.result_set.outlet_unit_number1,
            res.data.result_set.outlet_unit_number2
          );

          var orderHandledText =
            res.data.result_set.outlet_address_line1 +
            " " +
            res.data.result_set.outlet_address_line2 +
            ", " +
            unitNum +
            " Singapore " +
            postalcode;

          deliveryInfo["orderHandledByText"] = orderHandledText;

          this.setState(
            {
              deliveryInfo: deliveryInfo,
              seletedAvilablityId: availability,
              seletedOutletId: res.data.result_set.outlet_id,
              order_tat_time: outletDeliveryTaT,
              orderHandled: orderHandled,
              orderDeliveryAddress:
                orderDeliveryAddress +
                " Singapore " +
                res.data.result_set.postal_code_information.zip_code,
            },
            function () {
              axios
                .get(
                  apiUrlV2 +
                    "settings/chkTimeslotIsAvaiable?app_id=" +
                    appId +
                    "&availability_id=" +
                    availability +
                    "&outletId=" +
                    res.data.result_set.outlet_id
                )
                .then((timeslt) => {
                  if (timeslt.data.status === "success") {
                    var isAdvanced = timeslt.data.isAdvanced,
                      slotType = "0";
                    if (isAdvanced === "yes") {
                      slotType = timeslt.data.slotType;
                    }
                    this.setState(
                      {
                        getDateTimeFlg: "yes",
                        isAdvanced: isAdvanced,
                        slotType: slotType,
                      },
                      function () {
                        this.setOrderOutletDateTimeData();
                      }
                    );
                  }
                });
            }
          );
        }
      });
  }
  pickOutlet(loaddata) {
    var unitNum = this.showUnitNum(
      loaddata.outlet_unit_number1,
      loaddata.outlet_unit_number2
    );

    var orderHandled =
      stripslashes(loaddata.outlet_name) +
      " " +
      loaddata.outlet_address_line1 +
      " " +
      loaddata.outlet_address_line2 +
      ", " +
      unitNum +
      " Singapore " +
      loaddata.outlet_postal_code;

    var pickupInfo = [];
    pickupInfo["orderOutletId"] = loaddata.order_outlet_id;
    pickupInfo["orderOutletName"] = stripslashes(loaddata.outlet_name);
    pickupInfo["orderPostalCode"] = loaddata.outlet_postal_code;
    pickupInfo["orderTAT"] = loaddata.outlet_pickup_tat;
    pickupInfo["orderHandled"] = orderHandled;
    pickupInfo["orderHandledByText"] = orderHandled;
    pickupInfo["defaultAvilablityId"] = pickupId;
    this.setState(
      {
        pickupInfo: pickupInfo,
        seletedAvilablityId: pickupId,
        seletedOutletId: loaddata.outlet_id,
        order_tat_time: loaddata.outlet_pickup_tat,
        orderHandled: orderHandled,
      },
      function () {
        this.setOrderOutletDateTimeData();
      }.bind(this)
    );
  }

  setOrderOutletDateTimeData() {
    var seletedOrdDate = this.state.seleted_ord_date;
    var seletedOrdTime = this.state.seleted_ord_time;
    if (
      seletedOrdDate !== "" &&
      seletedOrdTime !== "" &&
      seletedOrdDate !== null &&
      seletedOrdTime !== null
    ) {
      var orderInfoData =
        this.state.seletedAvilablityId === pickupId
          ? this.state.pickupInfo
          : this.state.deliveryInfo;
      if (Object.keys(orderInfoData).length > 0) {
        /* For Advanced Slot */
        var isAdvanced = this.state.isAdvanced;
        var slotType = this.state.slotType;
        var orderSlotVal = "",
          orderSlotTxt = "",
          orderSlotStrTime = "",
          orderSlotEndTime = "";
        if (slotType === "2") {
          orderSlotVal = this.state.seleted_ord_slot;
          orderSlotTxt = this.state.seleted_ord_slotTxt;
          orderSlotStrTime = this.state.seleted_ord_slot_str;
          orderSlotEndTime = this.state.seleted_ord_slot_end;
        }
        cookie.save("isAdvanced", isAdvanced, { path: "/" });
        cookie.save("slotType", slotType, { path: "/" });
        cookie.save("orderSlotVal", orderSlotVal, { path: "/" });
        cookie.save("orderSlotTxt", orderSlotTxt, { path: "/" });
        cookie.save("orderSlotStrTime", orderSlotStrTime, { path: "/" });
        cookie.save("orderSlotEndTime", orderSlotEndTime, { path: "/" });
        /* For Advanced Slot End */

        if (this.state.seletedAvilablityId === deliveryId) {
          cookie.save("orderZoneId", orderInfoData["orderZoneId"], {
            path: "/",
          });
          cookie.save(
            "orderDeliveryAddress",
            orderInfoData["orderDeliveryAddress"],
            { path: "/" }
          );
        }

        cookie.save("orderOutletId", orderInfoData["orderOutletId"], {
          path: "/",
        });
        cookie.save("orderOutletName", orderInfoData["orderOutletName"], {
          path: "/",
        });
        cookie.save("orderPostalCode", orderInfoData["orderPostalCode"], {
          path: "/",
        });
        cookie.save("orderTAT", orderInfoData["orderTAT"], { path: "/" });
        cookie.save("orderHandled", orderInfoData["orderHandled"], {
          path: "/",
        });
        cookie.save(
          "defaultAvilablityId",
          orderInfoData["defaultAvilablityId"],
          { path: "/" }
        );
        cookie.save("orderHandledByText", orderInfoData["orderHandledByText"], {
          path: "/",
        });
        cookie.save("outletchosen", orderInfoData["defaultAvilablityId"], {
          path: "/",
        });
        cookie.save("opentCart", "Yes", {
          path: "/",
        });
        this.setState({ cartTriggerFlg: "yes", opencart: "Y" });
        //  window.location = baseUrl;
      } else {
        $.magnificPopup.open({
          items: {
            src: "#outlet-error-popup",
          },
          type: "inline",
        });
      }
    }
  }
  showUnitNum(unit1, unit2) {
    unit1 = typeof unit1 !== "undefined" ? unit1 : "";
    unit2 = typeof unit2 !== "undefined" ? unit2 : "";

    if (unit1 !== "") {
      var unitNo = unit2 !== "" ? unit1 + " - " + unit2 : unit1;
    } else {
      var unitNo = unit2;
    }

    return unitNo !== "" ? "#" + unitNo + "," : "";
  }
  /* For Order Again Start */
  sateValChange = (field, value) => {
    if (field === "cartflg") {
      this.setState({ cartTriggerFlg: value });
    }
    if (field === "opencart") {
      this.setState({ opencart: value });
    }
  };
  render() {
    var settingsMyAcc = {
      infinite: false,
      slidesToShow: 4,
      slidesToScroll: 4,
      initialSlide: 1,
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

    /*	setTimeout(function () {
		//	console.log('render1',$('#dvLoading').length);		
            $('#dvLoading').remove();
						
					}, 500);*/

    return (
      <div className="myacc-main-div">
        <Header
          cartTriggerFlg={this.state.cartTriggerFlg}
          sateValChange={this.sateValChange}
          opencart={this.state.opencart}
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
                  <li className="active">
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
                    <div className="mbacc_mslide active">
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
                      <div className="tab_sec main_tabsec_inner">
                        <div className="myacc_filter">
                          <div className="tab_sec filter_tabsec" id="ordertab1">
                            <ul className="nav nav-tabs text-center">
                              <li className="active">
                                <a
                                  data-toggle="tab"
                                  href="#tab-id-inn5"
                                  aria-expanded="true"
                                >
                                  <span>Current Orders</span>
                                </a>
                              </li>
                              <li className="">
                                <a
                                  data-toggle="tab"
                                  href="#tab-id-inn6"
                                  aria-expanded="false"
                                >
                                  <span>Past Orders</span>
                                </a>
                              </li>
                            </ul>
                            <div className="tab-content">
                              <div
                                id="tab-id-inn5"
                                className="tab-pane fade active in"
                              >
                                <h4 className="tab_mobtrigger inner_tab_border active">
                                  Current orders<i></i>
                                </h4>
                                <div className="tab_mobrow filter_tabin">
                                  <div className="order-delivery">
                                    <div className="ord-body">
                                      <div className="cur-order-body">
                                        <div className="myacc_order_details">
                                          {this.getOrderItemData(
                                            this.state.corderdetail
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="load_more_div">
                                  <button
                                    className="load_more_data"
                                    onClick={this.loadcurrentItems.bind(this)}
                                    style={{ display: "none" }}
                                  >
                                    Load More
                                  </button>
                                </div>
                              </div>
                              <div id="tab-id-inn6" className="tab-pane fade">
                                <h4 className="tab_mobtrigger inner_tab_border">
                                  Past Orders<i></i>
                                </h4>
                                <div className="tab_mobrow filter_tabin">
                                  <div className="pst-order-body">
                                    <div className="myacc_order_details">
                                      {this.getOrderItemData(
                                        this.state.porderdetail
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="load_more_div">
                                  <button
                                    className="load_more_data1"
                                    style={{ display: "none" }}
                                    onClick={this.loadpastItems.bind(this)}
                                  >
                                    Load More
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* next tab */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Warning Popup - start */}
              <div
                id="warningmyaccount-popup"
                className="white-popup mfp-hide popup_sec warning_popup"
              >
                <div className="custom_alert">
                  <div className="custom_alertin">
                    <div className="alert_height">
                      <div className="alert_header">Warning</div>
                      <div className="alert_body">
                        <img className="warning-popup-img" src={warningImg} />
                        <p>By switching you are about to clear your cart.</p>
                        <p>Do you wish to proceed ?</p>
                        <div className="alt_btns">
                          <a
                            href="/"
                            className="popup-modal-dismiss button button-left disbl_href_action"
                          >
                            No
                          </a>
                          <a
                            href="/"
                            onClick={this.destroyCart.bind(this)}
                            className="button button-right popup-modal-dismiss disbl_href_action"
                          >
                            Yes
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Warning Popup - end */}
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
              details={this.state.ReceiptDetails}
              cartItems={this.state.CartItems}
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
    corderdetail: state.corderdetail,
    porderdetail: state.porderdetail,
    printorder: state.printorder,
    orderhistory: state.orderhistory,
    activitycount: state.activitycount,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getCorderDetail: (deliveryparams) => {
      dispatch({ type: GET_CORDERDETAIL, deliveryparams });
    },
    getPorderDetail: (deliverypastparams) => {
      dispatch({ type: GET_PORDERDETAIL, deliverypastparams });
    },
    getPrintOrder: (orderprimaryId, availabilityId) => {
      dispatch({ type: GET_PRINTORDER, orderprimaryId, availabilityId });
    },
    getOrderHistory: (params) => {
      dispatch({ type: GET_ORDERHISTORY, params });
    },
    getActivityCount: (getObject) => {
      dispatch({ type: GET_ACTIVITYCOUNT, getObject });
    },
  };
};

Orders.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }),
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Orders));

class Viewreceipt extends Component {
  constructor(props) {
    super(props);
  }

  getCartDetList(cartItems) {
    if (cartItems.length > 0) {
      return cartItems.map((item, index) => (
        <div className="cart_row oreder_itm_row" key={index}>
          <div className="col-sm-cls cart_left">
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
            {/*} 
				 <p className ="help-block">Special instruction for individual product items ...</p>
				 {*/}
          </div>
          <div className="col-sm-cls cart_right text-right">
            <div className="cart_price">
              <p>${parseFloat(item.item_total_amount).toFixed(2)}</p>
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
          "</p>";
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
          "</p>";
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
          html += "<p>" + comboQty + " X " + comboPro + newPrice + " </p>";
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
      html = "<div > ";
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
          "</p>";
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
            </div>
            <div className="tnk-delivery">
              {details.order_availability_id === deliveryId ? (
                <div className="delivery_total">
                  <div className="delivery_total_left">
                    <img src={scotterImg} />
                    <h3>Delivery From</h3>
                    <span>
                      {details.outlet_name !== "" &&
                      details.outlet_name !== undefined
                        ? stripslashes(details.outlet_name)
                        : ""}
                    </span>
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
                    <h3>Deliver TO</h3>
                    <span>{details.order_customer_address_line1}</span>{" "}
                    <span>Singapore {details.order_customer_postal_code}</span>{" "}
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
                    <span>
                      {details.outlet_name !== "" &&
                      details.outlet_name !== undefined
                        ? stripslashes(details.outlet_name)
                        : ""}
                    </span>
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
                  {/* Advanced Slot */}
                  <h4 className="checkoutTime">
                    {this.showOrdTimeSlot(details)}
                  </h4>
                </div>
              </div>

              <div className="order-items-maindiv">
                {this.getCartDetList(cartItems)}
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
                      {parseFloat(details.order_service_charge_amount).toFixed(
                        2
                      )}
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
                  <div className="cart_row gst-row">
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
      );
    } else {
      return <div></div>;
    }
  }
}
