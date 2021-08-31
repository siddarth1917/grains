/* eslint-disable */
import React, { Component } from "react";
import { Link } from "react-router-dom";
import cookie from "react-cookies";
import { connect } from "react-redux";
import Slider from "react-slick";
import StripeCheckout from "react-stripe-checkout";
import DatePicker from "react-datepicker";
import moment from "moment";
import update from "immutability-helper";
import axios from "axios";
import Select from "react-select";
var qs = require("qs");
var dateFormat = require("dateformat");

import "react-datepicker/dist/react-datepicker.css";
import { setMinutes, setHours, format } from "date-fns";

import Header from "../Layout/Header";
import Footer from "../Layout/Footer";
import OrderdatetimeSlot from "../Layout/OrderdatetimeSlot";
import OrderAdvancedDatetimeSlot from "../Layout/OrderAdvancedDatetimeSlot";
import ProductDetail from "../Products/ProductDetail";
import {
  appId,
  apiUrl,
  apiUrlV2,
  deliveryId,
  pickupId,
  CountryTxt,
  stripeReference,
  stripeCurrency,
  stripeImage,
  stripeCompany,
} from "../Helpers/Config";
import {
  getReferenceID,
  stripslashes,
  showPriceValue,
  callImage,
  showLoader,
  hideLoader,
  getCalculatedAmount,
  showAlert,
  showCustomAlert,
  showCustomCenterAlert,
  getOrderDateTime,
  getPromoCkValue,
  removePromoCkValue,
  smoothScroll,
} from "../Helpers/SettingHelper";
import {
  GET_CART_DETAIL,
  UPDATE_CART_DETAIL,
  DELETE_CART_DETAIL,
  DESTROY_CART_DETAIL,
  GET_ACTIVITYCOUNT,
  GET_HOLIDAYS,
  GET_ADDONPRODUCT,
  GET_STATIC_BLOCK,
} from "../../actions";
var Parser = require("html-react-parser");
const isEqual = require("react-fast-compare");

import noimage from "../../common/images/no-img-product.png";

import loadingImage from "../../common/images/loading_popup.gif";
import tickImage from "../../common/images/tick_popup.png";
import paymentImage from "../../common/images/payment.png";
import hiHndImage from "../../common/images/hi.png";
import trashImg from "../../common/images/trash-bin.png";
import crossImg from "../../common/images/cross1.png";
import innerbanner from "../../common/images/inner-banner.jpg";
var MINIMUM_DATE = 0;
var base64 = require("base-64");
class Checkout extends Component {
  constructor(props) {
    super(props);
    /* Rounding to the nearest 15 minute interval */
    const start = moment();
    const remainder = 15 - (start.minute() % 15);
    const currentTime = moment(start).add(remainder, "minutes");
    /* To change the date after 2 PM */
    /*var CurrentDate = this.calcTime('Singapore', '+8');*/

    var CurrentDate = new Date();

    var avilablityId =
      cookie.load("defaultAvilablityId") != "" &&
      cookie.load("defaultAvilablityId") != undefined
        ? cookie.load("defaultAvilablityId")
        : "";
    var orderOutletId =
      cookie.load("orderOutletId") != "" &&
      cookie.load("orderOutletId") != undefined
        ? cookie.load("orderOutletId")
        : "";
    var orderPostalCode =
      typeof cookie.load("orderPostalCode") === "undefined"
        ? ""
        : cookie.load("orderPostalCode");
    var orderDeliveryAddress =
      typeof cookie.load("orderDeliveryAddress") === "undefined"
        ? ""
        : cookie.load("orderDeliveryAddress");
    var unitNoOne =
      typeof cookie.load("unitNoOne") === "undefined"
        ? ""
        : cookie.load("unitNoOne");
    var unitNoTwo =
      typeof cookie.load("unitNoTwo") === "undefined"
        ? ""
        : cookie.load("unitNoTwo");

    var billingPostalCode =
      typeof cookie.load("billingPostalCode") === "undefined"
        ? ""
        : cookie.load("billingPostalCode");
    var billingDeliveryAddress =
      typeof cookie.load("billingDeliveryAddress") === "undefined"
        ? ""
        : cookie.load("billingDeliveryAddress");
    var billunitNoOne =
      typeof cookie.load("billunitNoOne") === "undefined"
        ? ""
        : cookie.load("billunitNoOne");
    var billunitNoTwo =
      typeof cookie.load("billunitNoTwo") === "undefined"
        ? ""
        : cookie.load("billunitNoTwo");

    var orderDateTime =
      typeof cookie.load("orderDateTime") === "undefined"
        ? ""
        : cookie.load("orderDateTime");
    var orderTAT =
      typeof cookie.load("orderTAT") === "undefined"
        ? ""
        : cookie.load("orderTAT");

    /* For Advanced Slot */
    var isAdvanced =
      typeof cookie.load("isAdvanced") === "undefined"
        ? ""
        : cookie.load("isAdvanced");
    var slotType =
      typeof cookie.load("slotType") === "undefined"
        ? ""
        : cookie.load("slotType");

    var getPromoCkVal = getPromoCkValue();

    var Maxdate = new Date();
    Maxdate.setFullYear(Maxdate.getFullYear() - 10);

    var servicesurchargeArr = Array();
    servicesurchargeArr["servicechrg_displaylabel"] = "Service Charge";
    servicesurchargeArr["servicechrg_type"] = "percentage";
    servicesurchargeArr["servicechrg_per"] = 0;
    servicesurchargeArr["servicechrg_amount"] = 0;
    servicesurchargeArr["surcharge_amount"] = 0;
    servicesurchargeArr["surcharge_type"] = "";
    servicesurchargeArr["surcharge_date"] = "";
    servicesurchargeArr["surcharge_frmtime"] = "";
    servicesurchargeArr["surcharge_totime"] = "";

    this.state = {
      globalSettings: [],
      Maxdate: Maxdate,
      staticblacks: [],
      overAllcart: [],
      cartItems: [],
      cartDetails: [],
      productLeadtime: 0,
      cartStatus: "",
      cartTotalItmCount: 0,
      order_postcode: orderPostalCode,
      order_delivery_address: orderDeliveryAddress,
      unitnumber1: unitNoOne,
      unitnumber2: unitNoTwo,
      billing_postcode: billingPostalCode,
      billing_delivery_address: billingDeliveryAddress,
      billunitnumber1: billunitNoOne,
      billunitnumber2: billunitNoTwo,
      billing_addrs_sameas: "yes",
      order_specil_note: "",
      /* For Advanced Slot */
      getDateTimeFlg: "",
      seleted_ord_date: "",
      seleted_ord_time: "",
      seleted_ord_slot: "",
      seleted_ord_slotTxt: "",
      seleted_ord_slot_str: "",
      seleted_ord_slot_end: "",
      isAdvanced: isAdvanced,
      slotType: slotType,

      activitycount_arr: [],
      promotion_count: 0,
      reward_point_count: 0,
      used_reward_point: getPromoCkVal["usedPoints"],
      reward_point_val: getPromoCkVal["reedemPointVal"],
      promo_code_val: getPromoCkVal["promoCodeVal"],
      promotion_applied: getPromoCkVal["promotionApplied"],
      promotion_type: getPromoCkVal["promotionType"],
      promotion_amount: getPromoCkVal["promotionAmount"],
      promotion_source: getPromoCkVal["promotionSource"],
      promoIs_delivery: getPromoCkVal["promoIsDelivery"],
      paymentmodevalue: "Stripe",
      validateimage: loadingImage,
      placingorderimage: loadingImage,
      completingpaymentimage: loadingImage,
      orderValidFail: 0,
      cod_payment_enable: 0,
      stripe_payment_enable: 0,
      postorder_triggered: "no",
      chk_tarms_contn: "No",
      termsAndConditions: "",
      seletedAvilablityId: avilablityId,
      seletedOutletId: orderOutletId,
      order_tat_time: orderTAT,
      viewProductSlug: "",
      cust_birthdate_update: "no",
      cust_birthdate: "",
      cust_gender: "",
      omise_payment_enable: 0,
      omise_log_id: "",
      omisecodeerror: "",
      omiseyearerror: "",
      omisemontherror: "",
      omisecardrror: "",
      omisenameerror: "",
      holdername: "",
      cardNumber: "",
      expiration_month: "",
      expiration_year: "",
      security_code: "",
      cardImage: "",
      payment_ref_id: "",
      omise_tokken_response: "",
      omise_tokken_card_id: "",
      omise_tokken_id: "",
      updateCartResponse: [],
      startMsg: 0,
      servicesurchargeval: servicesurchargeArr,
      editItemID: "",
      staticblacks: [],
      menuheader: "",
      imageLink: "",
    };
    this.props.getStaticBlock();
    this.getActivityCounts();
    this.props.getAddonProList(orderOutletId);
    this.handleChangeDate = this.handleChangeDate.bind(this);
  }

  /* Convert Timezone */
  calcTime(city, offset) {
    var d = new Date();
    var utc = d.getTime() + d.getTimezoneOffset() * 60000;
    var nd = new Date(utc + 3600000 * offset);
    return nd;
  }

  changeBillingAddrChk() {
    var isSame = this.state.billing_addrs_sameas;
    if (isSame === "yes") {
      var tempvlu = "";
      this.setState({
        billing_postcode: tempvlu,
        billing_delivery_address: tempvlu,
        billunitnumber1: tempvlu,
        billunitnumber2: tempvlu,
        billing_addrs_sameas: "no",
      });
    } else {
      this.setState(
        { billing_addrs_sameas: "yes" },
        function () {
          this.setBillingAddrs();
        }.bind(this)
      );
    }
  }

  setBillingAddrs() {
    var isSame = this.state.billing_addrs_sameas;
    if (isSame === "yes") {
      var postalCode = this.state.order_postcode;
      var custAddress = this.state.order_delivery_address;
      var floorNo = this.state.unitnumber1;
      var unitNo = this.state.unitnumber2;
      this.setState({
        billing_postcode: postalCode,
        billing_delivery_address: custAddress,
        billunitnumber1: floorNo,
        billunitnumber2: unitNo,
      });
    }
  }

  CheckBillingAddrChk(type) {
    var isSame = this.state.billing_addrs_sameas;
    var chkBox = false;
    var diplayTxt = "block";
    if (isSame === "yes") {
      chkBox = true;
      diplayTxt = "none";
    }

    return type === "checkbox" ? chkBox : diplayTxt;
  }

  handleAddrChange(event) {
    if (event.target.name === "unit_no1") {
      cookie.save("unitNoOne", event.target.value, { path: "/" });
      this.setState(
        { unitnumber1: event.target.value },
        function () {
          this.setBillingAddrs();
        }.bind(this)
      );
    } else if (event.target.name === "unit_no2") {
      cookie.save("unitNoTwo", event.target.value, { path: "/" });
      this.setState(
        { unitnumber2: event.target.value },
        function () {
          this.setBillingAddrs();
        }.bind(this)
      );
    } else if (event.target.name === "specil_note") {
      this.setState({ order_specil_note: event.target.value });
    } else if (event.target.name === "reward_point") {
      this.setState({ reward_point_val: event.target.value });
    } else if (event.target.name === "promo_code") {
      this.setState({ promo_code_val: event.target.value });
    } else if (event.target.name === "bill_unit_no1") {
      this.setState({ billunitnumber1: event.target.value });
    } else if (event.target.name === "bill_unit_no2") {
      this.setState({ billunitnumber2: event.target.value });
    }
  }

  /* Validate Float Value */
  validateFloatval(e) {
    const re = /[0-9.]+/g;
    if (!re.test(e.key)) {
      e.preventDefault();
    }
  }

  /* Validate Int Value */
  validateIntval(e) {
    const re = /[0-9]+/g;
    if (!re.test(e.key)) {
      e.preventDefault();
    }
  }

  /* post code */
  changePostalCode(isFrm, event) {
    var postalCode = event.target.value;
    var postCdLth = postalCode !== "" ? postalCode.length : 0;

    if (postalCode !== "" && parseInt(postCdLth) === 6) {
      var urlShringTxt =
        apiUrl +
        "settings/get_address?app_id=" +
        appId +
        "&zip_code=" +
        postalCode;

      axios.get(urlShringTxt).then((res) => {
        var custAddress = "";
        if (res.data.status === "ok") {
          var outltResulSet = res.data.result_set;
          if (Object.keys(outltResulSet).length > 0) {
            var outletAddress =
              outltResulSet.zip_buno != ""
                ? outltResulSet.zip_buno + ", " + outltResulSet.zip_sname
                : outltResulSet.zip_sname;

            custAddress = outletAddress + " " + CountryTxt;
          }
        }

        this.setState({
          billing_postcode: postalCode,
          billing_delivery_address: custAddress,
        });
      });
    } else {
      var temparrs = "";
      this.setState({
        billing_postcode: postalCode,
        billing_delivery_address: temparrs,
      });
    }
  }

  /* Get Redeem Points Count History Details */
  getActivityCounts() {
    const inputKeys = ["promotionwithoutuqc", "reward", "testtxt"];
    this.props.getActivityCount(JSON.stringify(inputKeys));
  }

  componentWillMount() {
    /*this.props.getCartDetail();*/
  }

  componentWillReceiveProps(nextProps) {
    $("body").removeClass("cart-items-open");
    $(".hcartdd_trigger").removeClass("active");
    $(".hcart_dropdown").removeClass("open");

    if (this.state.globalSettings !== nextProps.settingsArr) {
      var tampStArr = nextProps.settingsArr;
      var paymentmode = "Stripe";
      var codPayment = 0;
      var stripePayment = 0;
      var omisePayment = 0;
      if (Object.keys(tampStArr).length > 0) {
        if (
          tampStArr.client_cod_enable == 1 &&
          tampStArr.client_cod_availability == 1
        ) {
          codPayment = 1;
          paymentmode = "Cash";
        }

        if (
          tampStArr.client_stripe_enable == 1 &&
          tampStArr.client_stripe_availability == 1
        ) {
          stripePayment = 1;
        }

        if (
          tampStArr.client_omise_enable == 1 &&
          tampStArr.client_omise_availability == 1
        ) {
          omisePayment = 1;
          if (paymentmode !== "Cash") {
            paymentmode = "Omise";
          }
        }
      }

      this.setState({
        globalSettings: nextProps.settingsArr,
        cod_payment_enable: codPayment,
        stripe_payment_enable: stripePayment,
        omise_payment_enable: omisePayment,
        paymentmodevalue: paymentmode,
      });
    }

    if (this.state.activitycount_arr !== nextProps.activitycountArr) {
      this.setState({
        activitycount_arr: nextProps.activitycountArr,
        promotion_count: nextProps.activitycountArr.promotionwithoutuqc,
        reward_point_count: nextProps.activitycountArr.reward_ponits,
      });
    }

    if (this.state.overAllcart !== nextProps.overAllcart) {
      this.setState({
        overAllcart: nextProps.overAllcart,
        cartItems: nextProps.cartItems,
        cartDetails: nextProps.cartDetails,
        cartStatus: nextProps.cartStatus,
        cartTotalItmCount: nextProps.cartTotalItmCount,
        productLeadtime: nextProps.productLeadtime,
      });
    }

    if (this.state.updateCartResponse !== nextProps.updateCartResponse) {
      if (Object.keys(nextProps.updateCartResponse).length > 0) {
        this.setState(
          { updateCartResponse: nextProps.updateCartResponse },
          function () {
            var Response = nextProps.updateCartResponse;
            if (Object.keys(Response).length > 0) {
              if (Response[0].status === "error") {
                if (this.state.startMsg === 1) {
                  this.handleShowAlertFunct("Error", Response[0].message);
                  this.setState({ startMsg: 0 });
                }
              }
            }
          }
        );
      }
    }

    if (nextProps.staticblack !== this.state.staticblacks) {
      var termsConditions = "";
      if (Object.keys(nextProps.staticblack).length > 0) {
        nextProps.staticblack.map((data, index) => {
          if (data.staticblocks_slug === "terms-and-conditions") {
            termsConditions = data.staticblocks_description;
            return "";
          }
        });
      }
      termsConditions =
        termsConditions !== "" ? Parser(termsConditions) : termsConditions;
      this.setState({
        staticblacks: nextProps.staticblack,
        termsAndConditions: termsConditions,
      });

      setTimeout(function () {
        $(".checkout-terms-and-condition").mCustomScrollbar();
      }, 800);
    }
    if (nextProps.staticblack !== this.state.staticblacks) {
      var menuheader = "";
      var imageLink = "";
      if (Object.keys(nextProps.staticblack).length > 0) {
        nextProps.staticblack.map((data) => {
          if (data.staticblocks_slug === "checkout-header") {
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

  componentDidMount() {
    const script = document.createElement("script");
    script.src = "https://cdn.omise.co/omise.js";
    script.async = true;
    document.body.appendChild(script);

    smoothScroll(100, 70);
  }

  componentDidUpdate() {
    this.checkOutAuthentication();
    var modevalue = this.state.paymentmodevalue;
    var promoTionArr = Array();
    promoTionArr["promotionApplied"] = this.state.promotion_applied;
    promoTionArr["promotionAmount"] = this.state.promotion_amount;
    promoTionArr["promoIsDelivery"] = this.state.promoIs_delivery;
    var serviceSubChrArr = this.state.servicesurchargeval;
    var calculatedAmount = getCalculatedAmount(
      this.state.globalSettings,
      this.props.zonedetails,
      this.state.cartDetails,
      this.state.cartItems,
      promoTionArr,
      serviceSubChrArr
    );
    var subTotalAmount = parseFloat(calculatedAmount["cartSubTotalAmount"]);
    var grandTotalAmount = parseFloat(calculatedAmount["grandTotalAmount"]);
    if (subTotalAmount > 0 && grandTotalAmount === 0) {
      modevalue = "promotion";
    }
    if (this.state.paymentmodevalue !== modevalue) {
      this.setState({ paymentmodevalue: modevalue });
    }

    var cartDetailsArr = this.state.cartDetails;
    var settingsArr = this.state.globalSettings;
    if (
      cookie.load("orderOutletId") != "" &&
      cookie.load("orderOutletId") != undefined &&
      cookie.load("UserMobile") != "" &&
      cookie.load("UserMobile") != undefined &&
      Object.keys(cartDetailsArr).length > 0 &&
      Object.keys(settingsArr).length > 0 &&
      this.state.postorder_triggered === "no"
    ) {
      this.setState(
        { postorder_triggered: "yes", getDateTimeFlg: "yes" },
        function () {
          //   this.postOrder("initial", "Yes");
        }.bind(this)
      );
    }

    var sltdOrdDate = this.state.seleted_ord_date;
    var sltdOrdTime = this.state.seleted_ord_time;
    if (sltdOrdDate !== "" && sltdOrdTime !== "") {
      this.updateOrderDateTimeCookie();
    }
  }
  /* For Advanced Slot */
  updateOrderDateTimeCookie() {
    var sltdOrdDate = this.state.seleted_ord_date;
    var sltdOrdTime = this.state.seleted_ord_time;
    var OrdDate = format(sltdOrdDate, "yyyy-MM-dd");
    var OrdHours = sltdOrdTime.getHours();
    var OrdMunts = sltdOrdTime.getMinutes();
    var OrdSecnd = sltdOrdTime.getSeconds();
    var ordDateTime = new Date(OrdDate);
    ordDateTime.setHours(OrdHours);
    ordDateTime.setMinutes(OrdMunts);
    ordDateTime.setSeconds(OrdSecnd);

    var deliveryDate = format(sltdOrdDate, "dd/MM/yyyy");
    var deliveryTime =
      this.pad(OrdHours) + ":" + this.pad(OrdMunts) + ":" + this.pad(OrdSecnd);

    cookie.save("orderDateTime", ordDateTime, { path: "/" });
    cookie.save("deliveryDate", deliveryDate, { path: "/" });
    cookie.save("deliveryTime", deliveryTime, { path: "/" });

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

    cookie.save("orderSlotVal", orderSlotVal, { path: "/" });
    cookie.save("orderSlotTxt", orderSlotTxt, { path: "/" });
    cookie.save("orderSlotStrTime", orderSlotStrTime, { path: "/" });
    cookie.save("orderSlotEndTime", orderSlotEndTime, { path: "/" });
  }

  getServiceChargeAmt(OrdDateTimeArr) {
    var availabilityIdTxt = cookie.load("defaultAvilablityId");
    var orderOutletId = cookie.load("orderOutletId");
    var orderDate = "";
    var orderTime = "";
    if (availabilityIdTxt === deliveryId) {
      orderDate = OrdDateTimeArr["OrdDate"];
      orderTime = OrdDateTimeArr["OrdTime"];
    }

    var servicesurchargeArr = this.state.servicesurchargeval;
    var online_servicecharge_type = servicesurchargeArr["servicechrg_type"];
    var onlineservice_displaylabel =
      servicesurchargeArr["servicechrg_displaylabel"];
    var online_servicecharge_per = 0,
      online_servicecharge_amount = 0,
      subchr_amount = 0;
    var subchr_type = "",
      subchr_date = "",
      subchr_frmtime = "",
      subchr_totime = "";

    var urlPrms =
      "&availabilityid=" +
      availabilityIdTxt +
      "&outletid=" +
      orderOutletId +
      "&orderdate=" +
      orderDate +
      "&ordertime=" +
      orderTime +
      "&";
    var urlShringTxt =
      apiUrl + "outlets/outletsubcharge?app_id=" + appId + urlPrms;
    axios.get(urlShringTxt).then((res) => {
      if (res.data.status === "ok") {
        online_servicecharge_per =
          res.data.online_service_charge !== ""
            ? parseFloat(res.data.online_service_charge)
            : 0;
        online_servicecharge_amount = 0;

        if (
          res.data.subcharge_apply === "Yes" &&
          availabilityIdTxt === deliveryId
        ) {
          var subchr_data = res.data.result_set[0];
          subchr_amount =
            subchr_data.subchr_value !== ""
              ? parseFloat(subchr_data.subchr_value)
              : 0;
          subchr_type = subchr_data.subchr_type;
          if (subchr_data.subchr_type === "Time") {
            subchr_frmtime = this.tmConv24(subchr_data.subchr_from_time);
            subchr_totime = this.tmConv24(subchr_data.subchr_to_time);
          } else {
            subchr_date = subchr_data.subchr_date;
          }
        }
      }

      servicesurchargeArr["servicechrg_displaylabel"] =
        onlineservice_displaylabel;
      servicesurchargeArr["servicechrg_type"] = online_servicecharge_type;
      servicesurchargeArr["servicechrg_per"] = online_servicecharge_per;
      servicesurchargeArr["servicechrg_amount"] = online_servicecharge_amount;
      servicesurchargeArr["surcharge_amount"] = subchr_amount;
      servicesurchargeArr["surcharge_type"] = subchr_type;
      servicesurchargeArr["surcharge_date"] = subchr_date;
      servicesurchargeArr["surcharge_frmtime"] = subchr_frmtime;
      servicesurchargeArr["surcharge_totime"] = subchr_totime;

      this.setState(
        { servicesurchargeval: servicesurchargeArr },
        function () {
          this.postOrder("initial", "Yes");
        }.bind(this)
      );
    });
  }

  serverChargeCal() {
    var servicechargePer = this.state.online_servicecharge_per;
    servicechargePer =
      servicechargePer !== "" ? parseFloat(servicechargePer) : 0;
    var servicechargeAmount = this.state.online_servicecharge_amount;
    var cartDetailsArr = this.state.cartDetails;
    var subTotal =
      Object.keys(cartDetailsArr).length > 0
        ? parseFloat(cartDetailsArr.cart_sub_total)
        : 0;
    if (servicechargePer > 0 && subTotal > 0) {
      servicechargeAmount = (servicechargePer / 100) * subTotal;
      servicechargeAmount = servicechargeAmount.toFixed(2);
    }

    this.setState(
      { online_servicecharge_amount: servicechargeAmount },
      function () {
        this.postOrder("initial", "Yes");
      }.bind(this)
    );
  }

  tmConv24(time24) {
    var ts = time24;
    if (ts !== "") {
      var H = +ts.substr(0, 2);
      var h = H % 12 || 12;
      h = h < 10 ? "0" + h : h;
      var ampm = H < 12 ? " AM" : " PM";
      ts = h + ts.substr(2, 3) + ampm;
    }
    return ts;
  }

  pad(d) {
    return d < 10 ? "0" + d.toString() : d.toString();
  }

  checkOutAuthentication() {
    var orderOutletId =
      cookie.load("orderOutletId") != "" &&
      cookie.load("orderOutletId") != undefined
        ? cookie.load("orderOutletId")
        : "";
    var avilablityId =
      cookie.load("defaultAvilablityId") != "" &&
      cookie.load("defaultAvilablityId") != undefined
        ? cookie.load("defaultAvilablityId")
        : "";
    var zoneIdTxt =
      typeof cookie.load("orderZoneId") === "undefined"
        ? ""
        : cookie.load("orderZoneId");
    if (orderOutletId === "" || avilablityId === "") {
      showAlert("Error", "Sorry!. Your order outlet detail is empty.");
      $.magnificPopup.open({
        items: {
          src: ".alert_popup",
        },
        type: "inline",
      });
      this.props.history.push("/products");
      return false;
    }

    if (avilablityId === deliveryId && zoneIdTxt === "") {
      showAlert("Error", "Sorry!. Your order zone detail is empty.");
      $.magnificPopup.open({
        items: {
          src: ".alert_popup",
        },
        type: "inline",
      });
      this.props.history.push("/");
      return false;
    }

    var cartDetailsArr = this.state.cartDetails;
    var settingsArr = this.state.globalSettings;
    var zonedetailsArr = this.props.zonedetails;

    if (this.state.cartStatus === "failure") {
      showAlert("Error", "Sorry!. Your cart is empty.");
      $.magnificPopup.open({
        items: {
          src: ".alert_popup",
        },
        type: "inline",
      });
      this.props.history.push("/products");
      return false;
    }

    if (
      this.state.cartStatus === "success" &&
      Object.keys(cartDetailsArr).length > 0 &&
      Object.keys(zonedetailsArr).length > 0
    ) {
      /*var cartMinAmount = (settingsArr.callcnter_min_amount !== '') ? parseFloat(settingsArr.callcnter_min_amount) : 0;*/

      var cartMinAmount =
        zonedetailsArr[0].zone_min_amount !== ""
          ? parseFloat(zonedetailsArr[0].zone_min_amount)
          : 0;

      var cartSubTotal = parseFloat(cartDetailsArr.cart_sub_total);

      var errorMsg =
        "You must have an order with a minimum of $" +
        cartMinAmount +
        " to place your order, your current order total is $" +
        cartSubTotal +
        ".";

      if (
        cookie.load("defaultAvilablityId") === deliveryId &&
        cartSubTotal < cartMinAmount
      ) {
        /*showCustomAlert('error',errorMsg);*/
        showAlert("Error", errorMsg);
        $.magnificPopup.open({
          items: {
            src: ".alert_popup",
          },
          type: "inline",
        });
        this.props.history.push("/products");
        return false;
      }
    }

    var UserId =
      cookie.load("UserId") != "" && cookie.load("UserId") != undefined
        ? cookie.load("UserId")
        : "";
    if (UserId === "") {
      cookie.save("loginpopupTrigger", "Yes", { path: "/" });
      this.props.history.push("/");
      return false;
    }

    var UserMobile =
      cookie.load("UserMobile") != "" && cookie.load("UserMobile") != undefined
        ? cookie.load("UserMobile")
        : "";
    if (UserId !== "" && UserMobile === "") {
      showAlert("Error", "Please update your mobile no.");
      $.magnificPopup.open({
        items: {
          src: ".alert_popup",
        },
        type: "inline",
      });
      this.props.history.push("/myaccount");
      return false;
    }
  }

  sateValChange = (field, value) => {
    if (field === "cartflg") {
      this.setState({ cartTriggerFlg: value });
    }
    if (field === "view_pro_data" && value !== "") {
      this.setState(
        { viewProductSlug: value },
        function () {
          this.openProDetailPopup();
        }.bind(this)
      );
    }
    if (field === "editItemID") {
      this.setState({
        editItemID: value,
      });
    }
  };

  openProDetailPopup() {
    showLoader("comboPro-" + this.state.viewProductSlug, "Idtext");
    $("#ProductDetailMdl").modal({ backdrop: "static", keyboard: false });
  }

  loadCartOverallData() {
    var cartDetailsArr = this.state.cartDetails;

    if (Object.keys(cartDetailsArr).length > 0) {
      $("#dvLoading").fadeOut(1000);

      var promoTionArr = Array();
      promoTionArr["promotionApplied"] = this.state.promotion_applied;
      promoTionArr["promotionAmount"] = this.state.promotion_amount;
      promoTionArr["promoIsDelivery"] = this.state.promoIs_delivery;
      var serviceSubChrArr = this.state.servicesurchargeval;
      var calculatedAmount = getCalculatedAmount(
        this.state.globalSettings,
        this.props.zonedetails,
        cartDetailsArr,
        this.state.cartItems,
        promoTionArr,
        serviceSubChrArr
      );
      var promotionType = this.state.promotion_type;

      return (
        <div className="checkout-right-body-section">
          <div className="cart_table">
            <div className="cart_body">
              <div className="overall-parent">
                <div className="order-details-with-clear">
                  <h5>Your Items</h5>
                  <a
                    href="/"
                    onClick={this.clearCartItm.bind(this)}
                    className="hclear_cart"
                    title="CLEAR CART"
                  >
                    <img src={trashImg} />
                  </a>
                </div>
                <div className="product-details-parent">
                  {this.loadCartList()}
                </div>
              </div>
            </div>

            <div className="cart_footer">
              <div className="cart_row">
                <p className="text-uppercase">SUBTOTAL</p>
                <span>${calculatedAmount["cartSubTotalAmount"]}</span>
              </div>
              {parseFloat(calculatedAmount["deliveryCharge"]) > 0 && (
                <div className="cart_row">
                  <p className="text-uppercase">Delivery</p>
                  <span>
                    ${parseFloat(calculatedAmount["deliveryCharge"]).toFixed(2)}
                  </span>
                </div>
              )}
              {parseFloat(calculatedAmount["serviceCharge"]) > 0 && (
                <div className="cart_row">
                  {calculatedAmount["servicechrgType"] === "fixed" ? (
                    <p className="text-uppercase">
                      {calculatedAmount["servicechrgDisplaylbl"]}
                    </p>
                  ) : (
                    <p className="text-uppercase">
                      {calculatedAmount["servicechrgDisplaylbl"]} (
                      {calculatedAmount["servicechargePer"]}%)
                    </p>
                  )}
                  <span>
                    ${parseFloat(calculatedAmount["serviceCharge"]).toFixed(2)}
                  </span>
                </div>
              )}
              {parseFloat(calculatedAmount["surCharge"]) > 0 && (
                <div className="cart_row">
                  <p className="text-uppercase">Surcharge</p>
                  <span>
                    ${parseFloat(calculatedAmount["surCharge"]).toFixed(2)}
                  </span>
                </div>
              )}
              {parseFloat(calculatedAmount["additionalDelivery"]) > 0 && (
                <div className="cart_row">
                  <p className="text-uppercase">Additional Delivery</p>
                  <span>
                    $
                    {parseFloat(calculatedAmount["additionalDelivery"]).toFixed(
                      2
                    )}
                  </span>
                </div>
              )}
              {parseFloat(calculatedAmount["promotionAmount"]) > 0 && (
                <div className="cart_row promo-cart-row">
                  <p className="text-uppercase">
                    {promotionType === "points" ? "Discount " : "Promo Code"}
                  </p>
                  <span>
                    ($
                    {parseFloat(calculatedAmount["promotionAmount"]).toFixed(2)}
                    )
                  </span>
                  <a
                    href="/"
                    onClick={this.removePointsAndPromo.bind(this, "fromclk")}
                    className="cart_remove"
                  >
                    <img src={crossImg} alt="" />
                  </a>
                </div>
              )}
              {parseFloat(calculatedAmount["orderGstAmount"]) > 0 && (
                <div className="cart_row gst-row">
                  <p className="text-uppercase">
                    GST ({calculatedAmount["orderDisplayGst"]} %)
                  </p>
                  <span>
                    ${parseFloat(calculatedAmount["orderGstAmount"]).toFixed(2)}
                  </span>
                </div>
              )}

              {parseFloat(calculatedAmount["voucherDiscountAmount"]) > 0 && (
                <div className="cart_row gst-row">
                  <div className="row-replace">
                    <div className="col-sm-cls text-left">
                      <p className="text-uppercase">Voucher Discount Amount</p>
                    </div>
                    <div className="col-sm-cls text-right">
                      <span>
                        $
                        {parseFloat(
                          calculatedAmount["voucherDiscountAmount"]
                        ).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              <div className="cart_row grant-total-cls">
                <p className="text-uppercase">Total</p>

                <span>
                  <sup>$</sup>
                  {calculatedAmount["grandTotalAmount"]}
                </span>

                {parseFloat(cartDetailsArr.cart_special_discount) > 0 && (
                  <div class="member-discount-total">
                    * {cartDetailsArr.cart_special_discount_type} $
                    {cartDetailsArr.cart_special_discount} Applied
                  </div>
                )}
              </div>

              {cookie.load("defaultAvilablityId") === deliveryId &&
                this.loadDeliveryPercentageBar()}
            </div>
          </div>
        </div>
      );
    } else {
      return "";
    }
  }

  /* this  function used to load delivery percentage */
  loadDeliveryPercentageBar() {
    var freeDeliveryAmnt = 0;
    var DeliveryAmnt = 0;
    var remainAmnt = 0;
    var delPercentage = 0;

    var cartDetailsArr = this.state.cartDetails;

    if (Object.keys(cartDetailsArr).length > 0) {
      var promoTionArr = Array();
      promoTionArr["promotionApplied"] = this.state.promotion_applied;
      promoTionArr["promotionAmount"] = this.state.promotion_amount;
      promoTionArr["promoIsDelivery"] = this.state.promoIs_delivery;
      var serviceSubChrArr = this.state.servicesurchargeval;
      var calculatedAmount = getCalculatedAmount(
        this.state.globalSettings,
        this.props.zonedetails,
        cartDetailsArr,
        this.state.cartItems,
        promoTionArr,
        serviceSubChrArr
      );

      freeDeliveryAmnt = parseFloat(calculatedAmount["freeDeliveryAmnt"]);
      DeliveryAmnt = parseFloat(calculatedAmount["deliveryCharge"]);
      var subTotal = parseFloat(calculatedAmount["cartSubTotalAmount"]);
      var percentage = (subTotal * 100) / freeDeliveryAmnt;
      percentage = Math.round(percentage);
      delPercentage = percentage;
      remainAmnt = parseFloat(freeDeliveryAmnt - subTotal).toFixed(2);
    }

    if (DeliveryAmnt > 0 && freeDeliveryAmnt > 0 && remainAmnt > 0) {
      return (
        <div className="cart_row progress_bar_div">
          <div className="indication">
            <div className="indication_progress">
              <span
                className="progress_bar"
                style={{ width: delPercentage + "%" }}
              />
            </div>
            <p className="help-block">${remainAmnt} more to FREE delivery!</p>
          </div>
        </div>
      );
    }
  }

  loadCartList() {
    var cartItemsArr = this.state.cartItems;
    if (Object.keys(cartItemsArr).length > 0) {
      return cartItemsArr.map((product, index) => (
        <div
          className="cart_row product-details"
          id={"rowcartid-" + product.cart_item_id}
          key={index}
        >
          <div className="col-sm-cls cart_left">
            <div className="cart_img">
              {product.cart_item_product_image !== "" ? (
                <img src={product.cart_item_product_image} alt="" />
              ) : (
                <img src={noimage} alt="" />
              )}
            </div>
            <div className="cart_info text-left">
              <h4>{stripslashes(product.cart_item_product_name)}</h4>

              <h4>
                {product.cart_item_voucher_id !== "" &&
                product.cart_item_voucher_id != null
                  ? "Discount Applied"
                  : ""}
              </h4>

              {this.loadModifierItems(
                product.cart_item_type,
                product.modifiers,
                product.set_menu_component
              )}

              {product.cart_item_special_notes !== "" && (
                <p className="help-block">
                  {stripslashes(product.cart_item_special_notes)}
                </p>
              )}

              {parseFloat(product.cart_item_promotion_discount) > 0 && (
                <span class="member-discount-desc">
                  $ {product.cart_item_promotion_discount}{" "}
                  {product.cart_item_promotion_type} discount Applied
                </span>
              )}
            </div>
          </div>
          <div className="col-sm-cls cart_right text-right">
            <div className="cart_price">
              <p>${product.cart_item_total_price}</p>
            </div>

            {product.cart_item_voucher_product_free != 1 ? (
              <div className="qty_bx">
                <span
                  className="qty_minus"
                  onClick={this.updateCartQty.bind(this, product, "decr")}
                >
                  -
                </span>
                <input type="text" value={product.cart_item_qty} readOnly />
                <span
                  className="qty_plus"
                  onClick={this.updateCartQty.bind(this, product, "incr")}
                >
                  +
                </span>
              </div>
            ) : (
              <div className="qty_bx free_product">
                <span className="qty_minus">-</span>
                <input type="text" value={product.cart_item_qty} readOnly />
                <span className="qty_plus">+</span>
              </div>
            )}
          </div>

          <a
            href="/"
            onClick={this.deleteCartItm.bind(this, product)}
            className="cart_remove"
          >
            <img src={crossImg} alt="" />
          </a>
        </div>
      ));
    }
  }

  updateCartQty(itemArr, type) {
    var productId = itemArr.cart_item_product_id;
    var cartItemId = itemArr.cart_item_id;
    var cartQty = itemArr.cart_item_qty;
    var totalItmCount = this.props.cartTotalItmCount;
    var orderVoucherId = itemArr.cart_voucher_order_item_id;

    showLoader("rowcartid-" + cartItemId, "Idtext");

    if (type === "decr") {
      cartQty = parseInt(cartQty) - 1;
      if (parseInt(totalItmCount) === 0) {
      } else if (parseInt(cartQty) === 0) {
        this.props.deleteCartDetail(cartItemId);
      } else {
        this.props.updateCartDetail(
          productId,
          cartItemId,
          cartQty,
          orderVoucherId
        );
      }
    } else {
      cartQty = parseInt(cartQty) + 1;
      this.props.updateCartDetail(
        productId,
        cartItemId,
        cartQty,
        orderVoucherId
      );
    }
    this.setState({ startMsg: 1 });
    this.removePointsAndPromo("frmFunct");
  }

  deleteCartItm(itemArr, event) {
    event.preventDefault();
    var cartItemId = itemArr.cart_item_id;
    showLoader("rowcartid-" + cartItemId, "Idtext");
    this.props.deleteCartDetail(cartItemId);
    this.removePointsAndPromo("frmFunct");
  }

  clearCartItm(event) {
    event.preventDefault();
    showLoader("cart_body", "class");
    this.props.destroyCartDetail();
  }

  /* this function used to load modifer items */
  loadModifierItems(itemType, modifiers, combo) {
    var len = modifiers.length;
    var comboLen = combo.length;
    var html = '<div class="cart_extrainfo">';

    var temp_html = "";

    if (itemType === "Modifier" && len > 0) {
      for (var i = 0, length = len; i < length; i++) {
        var modName = modifiers[i]["cart_modifier_name"];
        var modval = modifiers[i]["modifiers_values"][0]["cart_modifier_name"];
        var modVlPrice =
          modifiers[i]["modifiers_values"][0]["cart_modifier_price"];
        var newModVlPrice = modVlPrice > 0 ? " (+" + modVlPrice + ")" : "";
        temp_html +=
          "<p><b>" +
          modName +
          ":</b></p> <p>" +
          modval +
          newModVlPrice +
          "</b></p> ";
      }

      html += temp_html + "</div>";
      var reactElement = Parser(html);
      return reactElement;
    } else if (itemType === "Component" && comboLen > 0) {
      for (var i = 0, length = comboLen; i < length; i++) {
        var comboName = combo[i]["menu_component_name"];
        var comboVal = this.showComboProducts(combo[i]["product_details"]);

        if (combo[i]["product_details"][0]["modifiers"].length) {
          html +=
            "<p><b>" +
            comboName +
            ":</b> </p><p>" +
            comboVal +
            "  " +
            this.showComboModifiers(
              combo[i]["product_details"][0]["modifiers"]
            ) +
            "</p> ";
        } else {
          html +=
            "<p><b>" +
            comboName +
            ":</b> </p><p>" +
            comboVal +
            " " +
            this.showComboModifiers(
              combo[i]["product_details"][0]["modifiers"]
            ) +
            "</p> ";
        }
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
        if (parseInt(combos[r]["cart_menu_component_product_qty"]) > 0) {
          var comboPro = combos[r]["cart_menu_component_product_name"];
          var comboQty = combos[r]["cart_menu_component_product_qty"];
          var comboPrice = combos[r]["cart_menu_component_product_price"];
          var newPrice = comboPrice > 0 ? " (+" + comboPrice + ")" : "";
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
    var html = "<div >";
    if (lenMod > 0) {
      for (var i = 0, length = lenMod; i < length; i++) {
        var modName = modifiers[i]["cart_modifier_name"];
        var modval = modifiers[i]["modifiers_values"][0]["cart_modifier_name"];
        var modValPrice =
          modifiers[i]["modifiers_values"][0]["cart_modifier_price"];
        var newModValPrice = modValPrice > 0 ? " (+" + modValPrice + ")" : "";
        html +=
          "<p><b>" +
          modName +
          ":</b> </p><p> " +
          modval +
          newModValPrice +
          "</p> ";
      }
      html += "</div>";

      return html;
    }

    return "";
  }

  applyPointsAndPromo(type) {
    var promotionApplied = this.state.promotion_applied;
    var promotionType = this.state.promotion_type;
    var promotionAmount = this.state.promotion_amount;
    var promotionSource = this.state.promotion_source;
    var promoIsDelivery = this.state.promoIs_delivery;
    var reedemPointVal = this.state.reward_point_val;
    var promoCodeVal = this.state.promo_code_val;
    var usedPoints = this.state.used_reward_point;

    if (type === "points") {
      if (parseFloat(reedemPointVal) === 0 || reedemPointVal === "") {
        showAlert("Error", "Sorry!. Invalid Redeem Point.");
      }
    } else if (type === "promoCode") {
      if (promoCodeVal === "") {
        return false;
      }
    }

    var cartDetailsArr = this.state.cartDetails;
    var cartItemsSateArr = this.state.cartItems;

    var subTotal =
      Object.keys(cartDetailsArr).length > 0
        ? cartDetailsArr.cart_sub_total
        : 0;
    var totalItems =
      Object.keys(cartDetailsArr).length > 0
        ? cartDetailsArr.cart_total_items
        : 0;

    if (type === "points") {
      if (reedemPointVal > 0) {
        showLoader("applypoints_cls", "class");
        var postObject = {
          app_id: appId,
          reference_id: cookie.load("UserId"),
          redeem_point: reedemPointVal,
          cart_amount: subTotal,
        };

        axios
          .post(apiUrl + "loyalty/apply_loyalityv1", qs.stringify(postObject))
          .then((res) => {
            if (res.data.status === "success") {
              var pointDet = res.data.result_set;
              promotionApplied = "Yes";
              promotionType = "points";
              promotionAmount = pointDet.points_amount;
              promotionSource = reedemPointVal;
              promoIsDelivery = "";
              promoCodeVal = "";
              usedPoints = reedemPointVal;
              showCustomAlert("success", "Rewards Points applied successfully");
            } else {
              if (promotionType === "points") {
                promotionApplied = "";
                promotionType = "";
                promotionAmount = "";
                promotionSource = "";
                promoIsDelivery = "";
                usedPoints = 0;
              }
              showCustomAlert("error", "Sorry! Did not applied Rewards Points");
            }

            hideLoader("applypoints_cls", "class");
            cookie.save("reedemPointVal", reedemPointVal, { path: "/" });
            cookie.save("promoCodeVal", promoCodeVal, { path: "/" });
            cookie.save("promotionApplied", promotionApplied, { path: "/" });
            cookie.save("promotionType", promotionType, { path: "/" });
            cookie.save("promotionAmount", promotionAmount, { path: "/" });
            cookie.save("promotionSource", promotionSource, { path: "/" });
            cookie.save("promoIsDelivery", promoIsDelivery, { path: "/" });
            cookie.save("usedPoints", usedPoints, { path: "/" });

            this.setState({
              reward_point_val: reedemPointVal,
              promo_code_val: promoCodeVal,
              promotion_applied: promotionApplied,
              promotion_type: promotionType,
              promotion_amount: promotionAmount,
              promotion_source: promotionSource,
              promoIs_delivery: promoIsDelivery,
              used_reward_point: usedPoints,
            });
          });
      }
    } else if (type === "promoCode") {
      showLoader("applypromo_cls", "class");

      var categoryIdsDet = this.getProductIdsDet(cartItemsSateArr);
      var avilablityId = cookie.load("defaultAvilablityId");

      var postObject = {
        app_id: appId,
        reference_id: cookie.load("UserId"),
        promo_code: promoCodeVal,
        cart_amount: subTotal,
        cart_quantity: totalItems,
        category_id: categoryIdsDet,
        availability_id: avilablityId,
        outlet_id: cookie.load("orderOutletId"),
      };

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
          }

          hideLoader("applypromo_cls", "class");
          cookie.save("reedemPointVal", reedemPointVal, { path: "/" });
          cookie.save("promoCodeVal", promoCodeVal, { path: "/" });
          cookie.save("promotionApplied", promotionApplied, { path: "/" });
          cookie.save("promotionType", promotionType, { path: "/" });
          cookie.save("promotionAmount", promotionAmount, { path: "/" });
          cookie.save("promotionSource", promotionSource, { path: "/" });
          cookie.save("promoIsDelivery", promoIsDelivery, { path: "/" });
          cookie.save("usedPoints", usedPoints, { path: "/" });

          this.setState({
            reward_point_val: reedemPointVal,
            promo_code_val: promoCodeVal,
            promotion_applied: promotionApplied,
            promotion_type: promotionType,
            promotion_amount: promotionAmount,
            promotion_source: promotionSource,
            promoIs_delivery: promoIsDelivery,
            used_reward_point: usedPoints,
          });
        });
    }
  }

  removePointsAndPromo(flag, event) {
    if (flag === "fromclk") {
      event.preventDefault();
    }
    var paymentmode = this.state.paymentmodevalue;
    if (paymentmode === "promotion") {
      var settingsArr = this.state.globalSettings;
      var paymentmode = "Stripe";
      if (Object.keys(settingsArr).length > 0) {
        if (
          settingsArr.client_cod_enable == 1 &&
          settingsArr.client_cod_availability == 1
        ) {
          paymentmode = "Cash";
        }

        if (
          settingsArr.client_omise_enable == 1 &&
          settingsArr.client_omise_availability == 1 &&
          paymentmode !== "Cash"
        ) {
          paymentmode = "Omise";
        }
      }
    }

    removePromoCkValue();

    this.setState({
      reward_point_val: "",
      promo_code_val: "",
      promotion_applied: "",
      promotion_type: "",
      promotion_amount: "",
      promotion_source: "",
      promoIs_delivery: "",
      used_reward_point: 0,
      paymentmodevalue: paymentmode,
    });
  }

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

  payCash(event) {
    event.preventDefault();
    $.magnificPopup.open({
      items: {
        src: ".processing",
      },
      type: "inline",
      showCloseBtn: false,
      midClick: true,
      closeOnBgClick: false,
    });

    this.postOrder(1);
  }

  postPromotionOrder(event) {
    event.preventDefault();
    $.magnificPopup.open({
      items: {
        src: ".processing",
      },
      type: "inline",
      showCloseBtn: false,
      midClick: true,
      closeOnBgClick: false,
    });
    this.postOrder(4);
  }

  /* show online payment mode loading */
  onlinePaymentLoading() {
    var promoTionArr = Array();
    promoTionArr["promotionApplied"] = this.state.promotion_applied;
    promoTionArr["promotionAmount"] = this.state.promotion_amount;
    promoTionArr["promoIsDelivery"] = this.state.promoIs_delivery;
    var serviceSubChrArr = this.state.servicesurchargeval;
    var calculatedAmount = getCalculatedAmount(
      this.state.globalSettings,
      this.props.zonedetails,
      this.state.cartDetails,
      this.state.cartItems,
      promoTionArr,
      serviceSubChrArr
    );
    var grandTotal = parseFloat(calculatedAmount["grandTotalAmount"]);

    if (this.state.paymentmodevalue !== "Cash" && grandTotal > 0) {
      return (
        <div className="process_col">
          <div className="process_left">
            <img src={this.state.validateimage} />
          </div>
          <div className="process_right">
            <h5>Processing</h5>
            <p>Validating card information.</p>
          </div>
        </div>
      );
    }
  }
  /**/

  /* show online payment mode loading */
  orderBCLoading() {
    return (
      <div className="process_col">
        <div className="process_left">
          <img src={this.state.placingorderimage} />
        </div>
        <div className="process_right">
          <h5>Processing</h5>
          <p>Placing your order now.</p>
        </div>
      </div>
    );
  }
  /**/

  /* show online payment mode loading */
  amountCaptureLoading() {
    var promoTionArr = Array();
    promoTionArr["promotionApplied"] = this.state.promotion_applied;
    promoTionArr["promotionAmount"] = this.state.promotion_amount;
    promoTionArr["promoIsDelivery"] = this.state.promoIs_delivery;
    var serviceSubChrArr = this.state.servicesurchargeval;
    var calculatedAmount = getCalculatedAmount(
      this.state.globalSettings,
      this.props.zonedetails,
      this.state.cartDetails,
      this.state.cartItems,
      promoTionArr,
      serviceSubChrArr
    );
    var grandTotal = parseFloat(calculatedAmount["grandTotalAmount"]);

    if (this.state.paymentmodevalue !== "Cash" && grandTotal > 0) {
      return (
        <div className="process_col">
          <div className="process_left">
            <img src={this.state.completingpaymentimage} />
          </div>
          <div className="process_right">
            <h5>Processing</h5>
            <p>Completing your online payment.</p>
          </div>
        </div>
      );
    }
  }
  /**/

  /* this fuction used to post order to biz panel */
  postOrder(
    paymentMode,
    validation = "No",
    captureID = "",
    payGetWayType = "",
    Paymentpop = "No"
  ) {
    if (cookie.load("UserId") == "" || cookie.load("UserId") == undefined) {
      cookie.save("loginpopupTrigger", "Yes", { path: "/" });
      this.props.history.push("/");
      return false;
    }

    if (
      cookie.load("defaultAvilablityId") == deliveryId &&
      paymentMode !== "initial"
    ) {
      var unitNoOne = this.state.unitnumber1;
      var unitNoTwo = this.state.unitnumber2;
      if (unitNoOne == "" && unitNoTwo == "") {
        /*showAlert('Error', 'Please enter unit No.');
				$.magnificPopup.open({
					items: {
						src: '.alert_popup'
					},
					type: 'inline'
				});*/

        if (paymentMode === 1) {
          $.magnificPopup.close();
        }

        if (Object.keys(this.props.addonproductlist).length > 0) {
          smoothScroll(500, 870);
        } else {
          smoothScroll(500, 270);
        }
        /*showCustomAlert('error','Please enter unit No.');*/
        showCustomCenterAlert("error", "Please enter unit No.");
        $("#unit_no1_id").focus();

        return false;
      }

      var billingAddrsSameas = this.state.billing_addrs_sameas;
      var billingPostcode = this.state.billing_postcode;
      var billingAddrss = this.state.billing_delivery_address;
      if (
        billingAddrsSameas === "no" &&
        (billingPostcode === "" || billingAddrss === "")
      ) {
        showAlert("Error", "Please enter default billing address.");
        $.magnificPopup.open({
          items: {
            src: ".alert_popup",
          },
          type: "inline",
        });
        return false;
      }
    }

    var finalcartItems = this.state.cartItems;

    var products = [];
    var row = this.state.cartItems.map(
      function (item, i) {
        var modifierdata = [];
        var comboData = [];
        var ComboLen = item.set_menu_component.length;
        var modifierLen = item.modifiers.length;
        if (item.cart_item_type === "Modifier" && modifierLen > 0) {
          for (var l = 0; l < modifierLen; l++) {
            var modifierVal = [];
            modifierVal.push({
              modifier_value_id:
                item.modifiers[l].modifiers_values[0].cart_modifier_id,
              modifier_value_qty:
                item.modifiers[l].modifiers_values[0].cart_modifier_qty,
              modifier_value_name:
                item.modifiers[l].modifiers_values[0].cart_modifier_name,
              modifier_value_price:
                item.modifiers[l].modifiers_values[0].cart_modifier_price,
            });
            modifierdata.push({
              modifier_id: item.modifiers[l].cart_modifier_id,
              modifier_name: item.modifiers[l].cart_modifier_name,
              modifiers_values: modifierVal,
            });
          }
        } else if (item.cart_item_type === "Component" && ComboLen > 0) {
          for (var m = 0; m < ComboLen; m++) {
            var combomodifierdata = [];
            /* build  modifier array */
            var comboModifier =
              item.set_menu_component[m].product_details[0].modifiers;

            var combomodifierdata = [];
            if (comboModifier.length > 0) {
              for (var p = 0; p < comboModifier.length; p++) {
                var comboModifierVal = [];
                comboModifierVal.push({
                  modifier_value_id:
                    comboModifier[p].modifiers_values[0].cart_modifier_id,
                  modifier_value_qty:
                    comboModifier[p].modifiers_values[0].cart_modifier_qty,
                  modifier_value_name:
                    comboModifier[p].modifiers_values[0].cart_modifier_name,
                  modifier_value_price:
                    comboModifier[p].modifiers_values[0].cart_modifier_price,
                });
                combomodifierdata.push({
                  modifier_id: comboModifier[p].cart_modifier_id,
                  modifier_name: comboModifier[p].cart_modifier_name,
                  modifiers_values: comboModifierVal,
                });
              }
            }

            var comborVal = [];
            var comboProductDetailslen =
              item.set_menu_component[m].product_details.length;
            if (comboProductDetailslen > 0) {
              for (
                var j = 0, lengthComboPro = comboProductDetailslen;
                j < lengthComboPro;
                j++
              ) {
                comborVal.push({
                  product_id:
                    item.set_menu_component[m].product_details[j]
                      .cart_menu_component_product_id,
                  product_name:
                    item.set_menu_component[m].product_details[j]
                      .cart_menu_component_product_name,
                  product_sku:
                    item.set_menu_component[m].product_details[j]
                      .cart_menu_component_product_sku,
                  product_qty:
                    item.set_menu_component[m].product_details[j]
                      .cart_menu_component_product_qty,
                  product_price:
                    item.set_menu_component[m].product_details[j]
                      .cart_menu_component_product_price,
                  modifiers: combomodifierdata,
                });
              }
            }

            comboData.push({
              menu_component_id: item.set_menu_component[m].menu_component_id,
              menu_component_name:
                item.set_menu_component[m].menu_component_name,
              product_details: comborVal,
            });
          }
        }

        products.push({
          product_name: item.cart_item_product_name,
          product_unit_price: item.cart_item_unit_price,
          product_total_amount: item.cart_item_total_price,
          product_sku: item.cart_item_product_sku,
          product_image: item.cart_item_product_image,
          product_id: item.cart_item_product_id,
          product_qty: item.cart_item_qty,
          condiments: "",
          modifiers: modifierdata,
          bakers_modifiers: "",
          menu_set_components: comboData,
          baby_pack: "",
          product_special_notes: item.cart_item_special_notes,
          voucher_gift_name: item.cart_item_product_voucher_gift_name,
          voucher_gift_email: item.cart_item_product_voucher_gift_email,
          voucher_gift_mobile: item.cart_item_product_voucher_gift_mobile,
          voucher_gift_message: item.cart_item_product_voucher_gift_message,
          order_item_id:
            item.cart_voucher_order_item_id != "0"
              ? item.cart_voucher_order_item_id
              : "",
          voucher_free_product: item.cart_item_voucher_product_free,
          order_voucher_id: item.cart_item_voucher_id,
        });

        return products;
      }.bind(this)
    );

    /* if  merge order date */
    var orderDate = "";

    var seletedOrdDate = this.state.seleted_ord_date;
    var seletedOrdTime = this.state.seleted_ord_time;

    /* For Advanced Slot */
    var order_is_timeslot = "No",
      ordSlotStrTm = "",
      ordSlotEndTm = "";
    if (seletedOrdDate !== "" && seletedOrdTime !== "") {
      var formatedDate = format(seletedOrdDate, "yyyy-MM-dd");
      var OrderHours = seletedOrdTime.getHours();
      var OrderMunts = seletedOrdTime.getMinutes();
      var OrderSecnd = seletedOrdTime.getSeconds();

      var orderTime = this.pad(OrderHours) + ":" + this.pad(OrderMunts);

      orderDate = formatedDate + " " + orderTime;

      if (this.state.isAdvanced === "yes" && this.state.slotType === "2") {
        order_is_timeslot = "Yes";
        ordSlotStrTm = this.state.seleted_ord_slot_str;
        ordSlotEndTm = this.state.seleted_ord_slot_end;
      }
    }

    if (orderDate === "" && paymentMode !== "initial") {
      showAlert("Error", "Please select order date and time.");
      $.magnificPopup.open({
        items: {
          src: ".alert_popup",
        },
        type: "inline",
      });
      return false;
    }

    if (
      this.state.chk_tarms_contn !== "Yes" &&
      this.state.termsAndConditions !== "" &&
      paymentMode !== "initial"
    ) {
      $(".tarms_chkbox_div").addClass("err_tarms_chk");
      window.scrollTo(0, 1000);
      return false;
    }

    if (paymentMode === "initial") {
      paymentMode = 2;
    }

    /*orderDate = '2019-07-10 10:15';*/

    /* insert customner details */
    if (validation !== "Yes") {
      var addressObject = {};
      var customerAddressId = 0;
      addressObject = {
        app_id: appId,
        customer_first_name: cookie.load("UserFname"),
        customer_last_name: cookie.load("UserLname"),
        customer_phone: cookie.load("UserMobile"),
        customer_email: cookie.load("UserEmail"),
        customer_address_line1: cookie.load("orderDeliveryAddress"),
        customer_postal_code: cookie.load("orderPostalCode"),
        customer_address_name: this.state.unitnumber1,
        customer_address_name2: this.state.unitnumber2,
        refrence: cookie.load("UserId"),
        customer_status: "A",
        customer_order_status: "order",
      };
      if (cookie.load("defaultAvilablityId") === deliveryId) {
        axios
          .post(
            apiUrl + "customer/secondary_address_add",
            qs.stringify(addressObject)
          )
          .then((res) => {
            if (res.data.status === "ok") {
              customerAddressId = res.data.insert_id;
            }
          });
      }
    }

    var promotionApplied = this.state.promotion_applied;
    var promotionType = this.state.promotion_type;
    var promotionAmount = this.state.promotion_amount;
    var promotionSource = this.state.promotion_source;
    var promoIsDelivery = this.state.promoIs_delivery;

    var cartDetailsArr = this.state.cartDetails;
    var promoTionArr = Array();
    promoTionArr["promotionApplied"] = promotionApplied;
    promoTionArr["promotionAmount"] = promotionAmount;
    promoTionArr["promoIsDelivery"] = promoIsDelivery;
    var serviceSubChrArr = this.state.servicesurchargeval;
    var calculatedAmount = getCalculatedAmount(
      this.state.globalSettings,
      this.props.zonedetails,
      cartDetailsArr,
      this.state.cartItems,
      promoTionArr,
      serviceSubChrArr
    );

    var BillingAddress = this.state.billing_delivery_address;
    var BillingPostalCode = this.state.billing_postcode;
    var BillingUnitNo1 = this.state.billunitnumber1;
    var BillingUnitNo2 = this.state.billunitnumber2;

    if (this.state.billing_addrs_sameas === "yes") {
      BillingAddress = cookie.load("orderDeliveryAddress");
      BillingPostalCode = cookie.load("orderPostalCode");
      BillingUnitNo1 = this.state.unitnumber1;
      BillingUnitNo2 = this.state.unitnumber2;
    }

    var custBirthdateUpdate = "",
      custBirthdate = "",
      custGender = "";
    if (this.state.cust_birthdate_update === "yes") {
      custBirthdateUpdate = this.state.cust_birthdate_update;
      var birthdateTxt = this.state.cust_birthdate;
      custBirthdate = format(birthdateTxt, "yyyy-MM-dd");
      custGender = this.state.cust_gender;
      if (validation !== "Yes") {
        cookie.save("UserBirthdate", custBirthdate, { path: "/" });
      }
    }

    var zoneIdTxt =
      typeof cookie.load("orderZoneId") === "undefined"
        ? ""
        : cookie.load("orderZoneId");

    var postObject = {};
    postObject = {
      /* cart details */
      app_id: appId,
      availability_id: cookie.load("defaultAvilablityId"),
      sub_total: parseFloat(calculatedAmount["cartSubTotalAmount"]).toFixed(2),
      grand_total: parseFloat(calculatedAmount["grandTotalAmount"]).toFixed(2),
      order_voucher_discount_amount:
        parseFloat(calculatedAmount["voucherDiscountAmount"]) > 0
          ? calculatedAmount["voucherDiscountAmount"]
          : "0",
      outlet_id: cookie.load("orderOutletId"),
      zone_id: zoneIdTxt,
      table_number: "",
      order_status: 1,
      order_source: "Web",
      order_date: orderDate,
      /* For Advanced Slot */
      order_is_timeslot: order_is_timeslot,
      order_pickup_time_slot_from: ordSlotStrTm,
      order_pickup_time_slot_to: ordSlotEndTm,

      order_remarks: this.state.order_specil_note,
      products: JSON.stringify(products),

      /* customer  Details */
      customer_id: base64.encode(cookie.load("UserId")),
      enc: "Y",
      customer_address_id: customerAddressId,
      customer_fname: cookie.load("UserFname"),
      customer_lname: cookie.load("UserLname"),
      customer_mobile_no: cookie.load("UserMobile"),
      customer_email: cookie.load("UserEmail"),
      customer_address_line1: cookie.load("orderDeliveryAddress"),
      customer_address_line2: "",
      customer_postal_code: cookie.load("orderPostalCode"),
      customer_unit_no1: this.state.unitnumber1,
      customer_unit_no2: this.state.unitnumber2,

      customer_birthdate_update: custBirthdateUpdate,
      customer_birthdate: custBirthdate,
      customer_gender: custGender,

      billing_address_line1: BillingAddress,
      billing_postal_code: BillingPostalCode,
      billing_unit_no1: BillingUnitNo1,
      billing_unit_no2: BillingUnitNo2,

      /* Payment */
      payment_mode: paymentMode /*paymentMode, */,
      payment_reference: stripeReference,
      stripe_envir: "test",
      payment_type: payGetWayType,
      order_capture_token: captureID,
      order_payment_getway_type: "",
      order_payment_getway_status: "Yes",

      /* additional paras */
      delivery_charge: parseFloat(calculatedAmount["deliveryCharge"]).toFixed(
        2
      ),
      additional_delivery: parseFloat(
        calculatedAmount["additionalDelivery"]
      ).toFixed(2),

      /* Sur & Service Chareges */
      order_subcharge_amount: parseFloat(calculatedAmount["surCharge"]).toFixed(
        2
      ),
      order_service_charge: calculatedAmount["servicechargePer"],
      order_service_charge_amount: parseFloat(
        calculatedAmount["serviceCharge"]
      ).toFixed(2),

      order_tat_time:
        typeof cookie.load("orderTAT") === "undefined"
          ? ""
          : cookie.load("orderTAT"),
      tax_charge: calculatedAmount["orderDisplayGst"],
      order_tax_calculate_amount: parseFloat(
        calculatedAmount["orderGstAmount"]
      ).toFixed(2),
      order_data_encode: "Yes",
      /* discount */
      order_discount_applied: "",
      order_discount_amount: "",
      order_discount_type: "",

      order_special_discount_amount: cartDetailsArr.cart_special_discount,
      order_special_discount_type: cartDetailsArr.cart_special_discount_type,
      product_leadtime: this.state.productLeadtime,
    };
    // console.log(postObject);
    /* check  validation */
    if (validation === "Yes") {
      postObject["validation_only"] = "Yes";
    }

    /*  promo code object - start */
    if (promotionApplied === "Yes" && parseFloat(promotionAmount) > 0) {
      postObject["discount_applied"] = "Yes";
      postObject["discount_amount"] = promotionAmount;

      if (promotionType === "promoCode") {
        var categoryIdsDet = this.getProductIdsDet(finalcartItems);

        postObject["coupon_applied"] = "Yes";
        postObject["promo_code"] = promotionSource;
        postObject["cart_quantity"] = cartDetailsArr.cart_total_items;
        postObject["category_id"] = categoryIdsDet;
        postObject["coupon_amount"] = promotionAmount;
        postObject["promotion_delivery_charge_applied"] = promoIsDelivery;
      }

      if (promotionType === "points") {
        postObject["redeem_applied"] = "Yes";
        postObject["redeem_point"] = promotionSource;
        postObject["redeem_amount"] = promotionAmount;
      }
    }

    postObject["reward_point_status"] = "Yes";

    axios
      .post(apiUrl + "ordersv1/submit_order", qs.stringify(postObject))
      .then((res) => {
        if (res.data.status === "ok") {
          this.setState({ orderValidFail: 0 });

          if (validation !== "Yes") {
            var localOrderNo = res.data.common.local_order_no;
            this.setState({ placingorderimage: tickImage });

            /* capture payemnt */
            if (payGetWayType === "Stripe") {
              this.captureAmount(
                captureID,
                res.data.common.order_primary_id,
                localOrderNo
              );
            } else if (payGetWayType === "Omise") {
              this.captureOmiseAmount(
                captureID,
                res.data.common.order_primary_id,
                localOrderNo
              );
            } else {
              this.showSuccessPage(
                localOrderNo,
                res.data.common.order_primary_id
              );
            }
          } else {
            if (Paymentpop === "Yes") {
              var popupIdTxt =
                payGetWayType === "Omise"
                  ? "#pay-omiseconf-popup"
                  : "#pay-conf-popup";

              $.magnificPopup.open({
                items: {
                  src: popupIdTxt,
                },
                type: "inline",
                closeOnBgClick: false,
              });
            }
            return true;
          }
        } else if (res.data.status === "error") {
          // This is used for stripe Auth Capture
          this.setState({ orderValidFail: 1 });

          if (res.data.form_error !== undefined) {
            showAlert("Error", res.data.form_error);
          } else {
            showAlert("Error", res.data.message);
          }
          $.magnificPopup.open({
            items: {
              src: ".alert_popup",
            },
            type: "inline",
          });
        }
      })
      .catch((error) => {
        $.magnificPopup.close();
        this.paymentFail(
          "Error",
          "Error code: 1004 Oops! Unable to processing your order. Please try again."
        );
        $.magnificPopup.open({
          items: {
            src: ".warining_popup",
          },
          type: "inline",
        });
        return false;
      });
  }

  pageReload = () => {
    setTimeout(function () {
      window.location.reload();
    }, 15000);
  };

  paymentFail(header, message) {
    $(".warining_popup").remove();
    $("body").append(
      '<div class="white-popup mfp-hide popup_sec warining_popup"><div class="custom_alert"><div class="custom_alertin"><div class="alert_height"><div class="alert_header">' +
        header +
        '</div><div class="alert_body"><p>' +
        message +
        '</p><div class="alt_btns"><a href="javascript:void(0);" onClick="' +
        this.pageReload() +
        '"class="button btn-sm btn_yellow popup-modal-dismiss">OK</a></div></div></div></div></div></div>'
    );
  }

  /* Capture amount */
  captureAmount(captureID, orderPrimaryId, localOrderNo) {
    var cabtureObjects = {};
    var captureParams = captureID + "~" + orderPrimaryId + "~" + localOrderNo;
    cabtureObjects = {
      payment_reference: stripeReference,
      stripe_envir: this.state.globalSettings.stripe_envir,
      customer_id: cookie.load("UserId"),
      app_id: appId,
      token: captureID,
      order_id: orderPrimaryId,
    };
    axios
      .post(apiUrl + "payment/captureAmount", qs.stringify(cabtureObjects))
      .then((captureRes) => {
        if (captureRes.data.status === "ok") {
          this.setState({ completingpaymentimage: tickImage });

          this.showSuccessPage(localOrderNo, orderPrimaryId);
        } else if (captureRes.data.status === "error") {
          showStripePopup("Error", "Your order was not successful.");
          $.magnificPopup.open({
            items: {
              src: ".alert_popup",
            },
            type: "inline",
          });
        } else {
          showStripePopup("Error", "Your order was not successful.");
          $.magnificPopup.open({
            items: {
              src: ".alert_popup",
            },
            type: "inline",
          });
        }
      })
      .catch((error) => {});
  }

  /* Omise Capture Payment */
  captureOmiseAmount(captureID, orderPrimaryId, localOrderNo) {
    var cabtureObjects = {};
    cabtureObjects = {
      payment_reference: stripeReference,
      customer_id: cookie.load("UserId"),
      app_id: appId,
      token: captureID,
      order_id: orderPrimaryId,
      log_id: this.state.omise_log_id,
      outlet_id: cookie.load("orderOutletId"),
    };
    axios
      .post(
        apiUrl + "paymentv1/captureAmountOmise",
        qs.stringify(cabtureObjects)
      )
      .then((captureRes) => {
        if (captureRes.data.status === "ok") {
          this.setState({ completingpaymentimage: tickImage });

          this.setState(
            { stop_authentication: "yes" },
            function () {
              this.showSuccessPage(localOrderNo);
            }.bind(this)
          );
        } else if (captureRes.data.status === "pending") {
          this.retrieve_charge_details(captureID, localOrderNo, orderPrimaryId);
        } else if (captureRes.data.status === "error") {
          var magnfPopup = $.magnificPopup.instance;
          var omsMsgTxt =
            captureRes.data.message != ""
              ? captureRes.data.message
              : "Your order was not successful.";
          showAlert("Error", omsMsgTxt, magnfPopup);
          $.magnificPopup.open({
            items: {
              src: ".alert_popup",
            },
            type: "inline",
          });
        } else {
          /*var magnfPopup = $.magnificPopup.instance;
				showAlert('Error', 'Your order was not successful.', magnfPopup);
                $.magnificPopup.open({
                    items: {
                        src: '.alert_popup'
                    },
                    type: 'inline'
                });*/

          /*Get Status of Charge ID*/
          this.retrieve_charge_details(captureID, localOrderNo, orderPrimaryId);
        }
      })
      .catch((error) => {
        this.captureOmiseAmount(captureID, orderPrimaryId, localOrderNo);
      });
  }

  retrieve_charge_details = (captureID, localOrderNo, orderPrimaryId) => {
    var orderOutlet_Id = cookie.load("orderOutletId");
    var postObject = {};
    postObject = {
      charge_id: captureID,
      app_id: appId,
      order_primary_id: orderPrimaryId,
      outlet_id: orderOutlet_Id,
    };

    axios
      .post(
        apiUrl + "paymentv1/retrieve_charge_details",
        qs.stringify(postObject)
      )
      .then((res) => {
        if (
          res.data.status === "ok" &&
          res.data.payment_status === "successful"
        ) {
          this.setState(
            { stop_authentication: "yes" },
            function () {
              this.showSuccessPage(localOrderNo);
            }.bind(this)
          );
        } else if (
          res.data.status === "ok" &&
          res.data.payment_status === "pending"
        ) {
          this.retrieve_charge_details(captureID, localOrderNo, orderPrimaryId);
        } else {
          var magnfPopup = $.magnificPopup.instance;
          var msgTxt =
            res.data.message != ""
              ? res.data.message
              : "Your order was not successful.";
          showAlert("Error", msgTxt, magnfPopup);
          $.magnificPopup.open({
            items: {
              src: ".alert_popup",
            },
            type: "inline",
          });
        }
      });
  };

  /* sucess page */
  showSuccessPage(localOrderNo, orderPrimaryId) {
    this.props.destroyCartDetail();
    this.deleteOrderCookie();
    /*this.sendMailFun(orderPrimaryId);*/
    cookie.save("ChkOrderid", localOrderNo, { path: "/" });
    const { history } = this.props;
    setTimeout(function () {
      $.magnificPopup.close();
      history.push("/thankyou/" + localOrderNo);
    }, 450);
  }

  sendMailFun(orderPrimaryId) {
    if (orderPrimaryId != "") {
      var urlShringTxt =
        apiUrl +
        "ordersv1/order_email?app_id=" +
        appId +
        "&order_primary_id=" +
        orderPrimaryId +
        "&mode=Cron";
      axios.get(urlShringTxt).then((res) => {});
    }
  }

  /* this function used to  delete all cookie values */
  deleteOrderCookie() {
    removePromoCkValue();

    cookie.remove("orderPaymentMode", { path: "/" });
    cookie.remove("orderTableNo", { path: "/" });
    cookie.remove("product_remarks", { path: "/" });
    cookie.remove("orderOutletName", { path: "/" });
    cookie.remove("orderOutletId", { path: "/" });
    cookie.remove("carttotalitems", { path: "/" });
    cookie.remove("cartsubtotal", { path: "/" });
    cookie.remove("cartid", { path: "/" });

    /* Delivery avilablity */
    cookie.remove("deliveryDate", { path: "/" });
    cookie.remove("deliveryTime", { path: "/" });
    cookie.remove("unitNoOne", { path: "/" });
    cookie.remove("unitNoTwo", { path: "/" });
    cookie.remove("firstNavigation", { path: "/" });

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
  }

  choosePayment(paymentMode) {
    if (paymentMode === "Cash") {
      this.setState({ paymentmodevalue: "Cash" });
    } else if (paymentMode === "Stripe") {
      this.setState({ paymentmodevalue: "Stripe" });
    } else if (paymentMode === "Omise") {
      this.setState({ paymentmodevalue: "Omise" });
    } else {
      this.setState({ paymentmodevalue: "promotion" });
    }

    this.postOrder(2, "Yes");
  }

  /* stripe description  */
  stripeDescription() {
    //userName
    if (
      typeof cookie.load("UserLname") !== "undefined" &&
      cookie.load("UserLname") !== ""
    ) {
      return cookie.load("UserFname") + " " + cookie.load("UserLname");
    } else {
      return cookie.load("UserLname");
    }
  }

  /* post stripe account */
  onToken = (token) => {
    $.magnificPopup.open({
      items: {
        src: ".processing",
      },
      type: "inline",
      midClick: true,
      closeOnBgClick: false,
    });

    var promoTionArr = Array();
    promoTionArr["promotionApplied"] = this.state.promotion_applied;
    promoTionArr["promotionAmount"] = this.state.promotion_amount;
    promoTionArr["promoIsDelivery"] = this.state.promoIs_delivery;
    var serviceSubChrArr = this.state.servicesurchargeval;
    var calculatedAmount = getCalculatedAmount(
      this.state.globalSettings,
      this.props.zonedetails,
      this.state.cartDetails,
      this.state.cartItems,
      promoTionArr,
      serviceSubChrArr
    );

    var payAmount = parseFloat(calculatedAmount["grandTotalAmount"]).toFixed(2);

    /*  load process html */
    var postObject = {};
    postObject = {
      app_id: appId,
      token: token.id,
      stripe_envir: this.state.globalSettings.stripe_envir,
      stripe_key: this.state.globalSettings.stripe_public_key,
      customer_id: cookie.load("UserId"),
      paid_amount: payAmount,
      outlet_name:
        typeof cookie.load("orderOutletName") === "undefined"
          ? cookie.load("orderOutletName")
          : "",
      payment_reference: stripeReference,
    };

    this.postOrder(2, "Yes"); // To validate the order

    if (this.state.orderValidFail === 0) {
      axios
        .post(apiUrl + "payment/stripeTokenPay", qs.stringify(postObject))
        .then((res) => {
          if (res.data.status === "ok") {
            var captureID = res.data.result_set.payment_reference_1;
            this.setState({ validateimage: tickImage });
            this.postOrder(3, "", captureID, "Stripe");
          } else if (res.data.status === "error") {
            $.magnificPopup.close();
            this.paymentFail(
              "Error",
              "Error code: 1001 Oops! Something went wrong! Please try again."
            );
            $.magnificPopup.open({
              items: {
                src: ".warining_popup",
              },
              type: "inline",
            });
            return false;
          }
        })
        .catch((error) => {
          $.magnificPopup.close();
          this.paymentFail(
            "Error",
            "Error code: 1002 Oops! Unable to connect to server. Please try again."
          );
          $.magnificPopup.open({
            items: {
              src: ".warining_popup",
            },
            type: "inline",
          });
          return false;
        });
    } else {
      $.magnificPopup.close();
      this.paymentFail(
        "Error",
        "Error code:1003 Oops! Something went wrong! Please try again."
      );
      $.magnificPopup.open({
        items: {
          src: ".warining_popup",
        },
        type: "inline",
      });

      return false;
    }
  };

  orderPayValidaion(payGetWayType, event) {
    event.preventDefault();
    this.postOrder(2, "Yes", "", payGetWayType, "Yes");
  }

  changeAddrrFun(event) {
    event.preventDefault();
    $.magnificPopup.open({
      items: {
        src: "#warning-popup",
      },
      type: "inline",
    });
    return false;
  }

  CheckTarmsContnChk() {
    var tarmsContn = this.state.chk_tarms_contn;
    var chkBox = false;
    if (tarmsContn === "Yes") {
      chkBox = true;
    }
    return chkBox;
  }

  changeTarmsContnChk() {
    var tarmsContn = this.state.chk_tarms_contn;
    if (tarmsContn === "Yes") {
      this.setState({ chk_tarms_contn: "No" });
    } else {
      this.setState({ chk_tarms_contn: "Yes" });
    }
    $(".tarms_chkbox_div").removeClass("err_tarms_chk");
  }

  setdateTimeFlg = (field, value) => {
    if (field == "tmflg") {
      this.setState({ getDateTimeFlg: value });
    } else if (field == "ordDate") {
      var ordTime = "";
      $(".ordrdatetime_error").html("");
      this.setState({
        seleted_ord_date: value,
        seleted_ord_time: ordTime,
        seleted_ord_slot: ordTime,
        seleted_ord_slotTxt: ordTime,
        seleted_ord_slot_str: ordTime,
        seleted_ord_slot_end: ordTime,
      });
    } else if (field == "ordTime") {
      var tmSltArr = value;
      var ordTime = "";
      $(".ordrdatetime_error").html("");
      this.setState({
        seleted_ord_time: tmSltArr["startTime"],
        seleted_ord_slot: ordTime,
        seleted_ord_slotTxt: ordTime,
        seleted_ord_slot_str: ordTime,
        seleted_ord_slot_end: ordTime,
      });
      var OrdDateTimeArr = Array();
      OrdDateTimeArr["OrdDate"] = tmSltArr["sldorddate"];
      OrdDateTimeArr["OrdTime"] = tmSltArr["sldordtime"];
      this.getServiceChargeAmt(OrdDateTimeArr);
    } else if (field == "ordSlotDate") {
      var ordTime = "";
      $(".ordrdatetime_error").html("");
      this.setState({
        seleted_ord_date: value,
        seleted_ord_time: ordTime,
        seleted_ord_slot: ordTime,
        seleted_ord_slotTxt: ordTime,
        seleted_ord_slot_str: ordTime,
        seleted_ord_slot_end: ordTime,
      });
    } else if (field == "ordSlotTime") {
      var tmSltArr = value;
      $(".ordrdatetime_error").html("");
      this.setState({
        seleted_ord_time: tmSltArr["startTime"],
        seleted_ord_slot: tmSltArr["ordSlotVal"],
        seleted_ord_slotTxt: tmSltArr["ordSlotLbl"],
        seleted_ord_slot_str: tmSltArr["ordSlotStr"],
        seleted_ord_slot_end: tmSltArr["ordSlotEnd"],
      });
      console.log("Chng ordSlotTime");
      var OrdDateTimeArr = Array();
      OrdDateTimeArr["OrdDate"] = tmSltArr["sldorddate"];
      OrdDateTimeArr["OrdTime"] = tmSltArr["sldordtime"];
      this.getServiceChargeAmt(OrdDateTimeArr);
    }
  };

  chkProStockCls(proSlug, Stock) {
    var returnText = "products-single-div no-stock-product " + proSlug;
    if (Stock > 0) {
      returnText = "products-single-div " + proSlug;
    }

    return returnText;
  }

  /* Addon product Listing */
  addonProductListing() {
    var addonProductlst = this.props.addonproductlist;
    var clientProductStock = "";
    if (Object.keys(this.state.globalSettings).length > 0) {
      clientProductStock = this.state.globalSettings.client_product_stock;
    }
    if (Object.keys(addonProductlst).length > 0) {
      if (Object.keys(addonProductlst[0].subcategorie).length > 0) {
        var slugType = "category";
        var slugValue = addonProductlst[0].subcategorie[0].pro_cate_slug;
        var addonProlstOnly = addonProductlst[0].subcategorie[0].products;
        var addonCommonImg = this.props.addonproductcommon.product_image_source;
        var tagImageSource = this.props.addonproductcommon.tag_image_source;
        const Phtml = addonProlstOnly.map((product, index) => (
          <div
            className={this.chkProStockCls(
              product.product_slug,
              product.product_stock,
              clientProductStock
            )}
            id={"proIndex-" + product.product_primary_id}
            key={index}
          >
            <div className="products-image-div">
              {product.product_thumbnail !== "" ? (
                <img src={addonCommonImg + "/" + product.product_thumbnail} />
              ) : (
                <img src={noimage} />
              )}
            </div>

            <div className="product-info-div">
              <div className="product-title-maindiv">
                <div className="product-title">
                  <h3>
                    {product.product_alias !== ""
                      ? stripslashes(product.product_alias)
                      : stripslashes(product.product_name)}
                  </h3>
                </div>
                {Object.keys(product.product_tag).length > 0 ? (
                  <div className="product-tag-list">
                    <ul>
                      {product.product_tag.map((producttag, index1) => {
                        return (
                          <li key={index1}>
                            {producttag.pro_tag_image !== "" ? (
                              <img
                                src={tagImageSource + producttag.pro_tag_image}
                              />
                            ) : (
                              ""
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ) : (
                  ""
                )}
              </div>

              <div className="product-short-description">
                <p>
                  {product.product_short_description !== null &&
                  product.product_short_description !== ""
                    ? Parser(stripslashes(product.product_short_description))
                    : Parser("&nbsp;")}
                </p>
              </div>

              <div className="product-price">
                <h3>{showPriceValue(product.product_price)}</h3>
              </div>

              <div className="products-ordernow-action">
                {product.product_stock > 0 || product.product_stock === null ? (
                  product.product_type === "1" ? (
                    <a
                      className="button order_nowdiv smiple_product_lk disbl_href_action"
                      href="/"
                      onClick={this.addToCartSimple.bind(
                        this,
                        product,
                        "initial"
                      )}
                    >
                      Add to Cart
                    </a>
                  ) : (
                    <a
                      href="/"
                      onClick={this.viewProDetail.bind(this, product)}
                      title="Product Details"
                      id={"comboPro-" + product.product_slug}
                      className="button order_nowdiv compo_product_lk"
                    >
                      Order Now
                    </a>
                  )
                ) : (
                  <a
                    className="button order_nowdiv disabled disbl_href_action"
                    href="/"
                  >
                    Sold Out
                  </a>
                )}

                <div className="addcart_row addcart_done_maindiv">
                  <div className="qty_bx">
                    <span
                      className="qty_minus"
                      onClick={this.proQtyAction.bind(
                        this,
                        product.product_primary_id,
                        "decr"
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
                        product.product_primary_id,
                        "incr"
                      )}
                    >
                      +
                    </span>
                  </div>
                  <button
                    className="button btn_black"
                    onClick={this.addToCartSimple.bind(this, product, "done")}
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          </div>
        ));

        return Phtml;
      }
    } else {
      return false;
    }
  }

  proQtyAction(indxFlg, actionFlg) {
    var proqtyInput = $("#proIndex-" + indxFlg)
      .find(".proqty_input")
      .val();
    proqtyInput = parseInt(proqtyInput);
    if (actionFlg === "decr") {
      proqtyInput = proqtyInput > 1 ? proqtyInput - 1 : proqtyInput;
    } else {
      proqtyInput = proqtyInput + 1;
    }
    $("#proIndex-" + indxFlg)
      .find(".proqty_input")
      .val(proqtyInput);
  }

  /* add to cart */
  addToCartSimple(productDetail, actionFlg, event) {
    event.preventDefault();
    var IndexFlg = productDetail.product_primary_id;

    if (actionFlg === "initial") {
      $("#proIndex-" + IndexFlg).addClass("active");
      $("#proIndex-" + IndexFlg)
        .find(".smiple_product_lk")
        .hide();
      $("#proIndex-" + IndexFlg)
        .find(".addcart_done_maindiv")
        .show();
      return false;
    } else {
      showLoader("proIndex-" + IndexFlg, "Idtext");
      var availabilityId = cookie.load("defaultAvilablityId");
      /*var availabilityId = deliveryId;*/
      var availabilityName =
        availabilityId === deliveryId ? "Delivery" : "Pickup";
      var isAddonProduct = "No";
      var productId = productDetail.product_id;
      var customerId =
        typeof cookie.load("UserId") === "undefined"
          ? ""
          : cookie.load("UserId");
      var proqtyQty = $("#proIndex-" + IndexFlg)
        .find(".proqty_input")
        .val();

      var postObject = {};
      postObject = {
        app_id: appId,
        product_id: productId,
        product_qty: proqtyQty,
        product_type: 1,
        availability_id: availabilityId,
        availability_name: availabilityName,
        isAddonProduct: isAddonProduct,
        reference_id: customerId === "" ? getReferenceID() : "",
        customer_id: customerId,
      };

      axios
        .post(apiUrlV2 + "cart/simpleCartInsert", qs.stringify(postObject))
        .then((res) => {
          $("#proIndex-" + IndexFlg).removeClass("active");
          hideLoader("proIndex-" + IndexFlg, "Idtext");
          $("#proIndex-" + IndexFlg)
            .find(".addcart_done_maindiv")
            .hide();
          $("#proIndex-" + IndexFlg)
            .find(".smiple_product_lk")
            .show();
          if (res.data.status === "ok") {
            this.sateValChange("cartflg", "yes");
            removePromoCkValue();
            showCustomAlert(
              "success",
              "Great choice! Item added to your cart."
            );
            /*showCartLst();*/
            this.handleShowAlertFun(
              "success",
              "Great choice! Item added to your cart."
            );
          } else if (res.data.status === "error") {
            var errMsgtxt =
              res.data.message !== ""
                ? res.data.message
                : "Sorry! Products can`t add your cart.";
            showCustomAlert("error", errMsgtxt);
            this.handleShowAlertFun("Error", errMsgtxt);
          }

          return false;
        });
    }
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

  viewProDetail(productDetail, event) {
    event.preventDefault();
    var productSlug = productDetail.product_slug;
    if (productSlug !== "") {
      $("#proIndex-" + productDetail.product_primary_id).addClass("active");
      this.sateValChange("view_pro_data", productSlug);
    }
    return false;
  }

  handleChangeDate(datevalue) {
    var dateval = new Date(datevalue);
    dateval = format(dateval, "dd/MM/yyyy");
    this.setState({ cust_birthdate_update: "yes", cust_birthdate: datevalue });
  }

  onGenderChange(event) {
    this.setState({ cust_gender: event.target.value });
  }

  /* Omise Payment Gateway Start */
  handleChangeTxt = (item, event) => {
    const re = /^[0-9 \b]+$/;
    if (item == "cardNumber") {
      if (event.target.value === "" || re.test(event.target.value)) {
        var cardnumber = this.space(event.target.value);
        var cardnumberLenght = cardnumber.length;
        if (cardnumberLenght <= 19) {
          this.setState({ [item]: cardnumber });
          this.cardValidation(cardnumber);
        }
      }
    } else if (
      item == "expiration_month" ||
      item == "expiration_year" ||
      item == "security_code"
    ) {
      if (event.target.value === "" || re.test(event.target.value)) {
        this.setState({ [item]: event.target.value });
      }
    } else {
      this.setState({ [item]: event.target.value });
    }

    this.setState({
      omisenameerror: "",
      omisecardrror: "",
      omisemontherror: "",
      omiseyearerror: "",
      omisecodeerror: "",
    });
  };

  space(el) {
    var numbes = el.replace(/ /g, "");
    return numbes.replace(/(\d{4})/g, "$1 ").replace(/(^\s+|\s+$)/, "");
  }

  cardValidation(carnumber) {
    var imagename = "";
    if (carnumber != "") {
      var single = carnumber.substring(0, 1);
      var double = carnumber.substring(0, 2);

      if (single == 4) {
        imagename = "visa";
      } else if (double == 34 || double == 37) {
        imagename = "american";
      } else if (double >= 51 && double <= 55) {
        imagename = "master";
      } else if (double == 60 || double == 64 || double == 65) {
        imagename = "discover";
      }
    }

    this.setState({ cardImage: imagename });
  }

  getOmiseToken() {
    var errorFlg = 0,
      omisenameerror = "",
      omisecardrror = "",
      omisemontherror = "",
      omiseyearerror = "",
      omisecodeerror = "";
    if (this.state.holdername == "") {
      errorFlg++;
      omisenameerror = "omise-form-error";
    }
    if (this.state.cardNumber == "") {
      errorFlg++;
      omisecardrror = "omise-form-error";
    }
    if (this.state.expiration_month == "") {
      errorFlg++;
      omisemontherror = "omise-form-error";
    }
    if (this.state.expiration_year == "") {
      errorFlg++;
      omiseyearerror = "omise-form-error";
    }
    if (this.state.security_code == "") {
      errorFlg++;
      omisecodeerror = "omise-form-error";
    }

    this.setState({
      omisenameerror: omisenameerror,
      omisecardrror: omisecardrror,
      omisemontherror: omisemontherror,
      omiseyearerror: omiseyearerror,
      omisecodeerror: omisecodeerror,
    });

    if (errorFlg === 0) {
      showLoader("omise-pay-btn", "class");
      Omise.setPublicKey(this.state.globalSettings.omise_public_key);
      var current = this;
      var card = {
        name: this.state.holdername,
        number: this.state.cardNumber,
        expiration_month: this.state.expiration_month,
        expiration_year: this.state.expiration_year,
        security_code: this.state.security_code,
        livemode: false,
      };
      Omise.createToken("card", card, function (statusCode, response) {
        hideLoader("omise-pay-btn", "class");
        if (statusCode === 200) {
          if (
            response.object == "error" ||
            !response.card.security_code_check
          ) {
            var msgArr = Array();
            msgArr["message"] =
              response.object == "error"
                ? response.message
                : "Invalid card details.";
            current.showOmiselert(msgArr);
          } else {
            $.magnificPopup.close();
            /*current.onProcessOmiseToken(response);*/
            current.setState(
              {
                omise_tokken_response: response,
                omise_tokken_card_id: response.card.id,
                omise_tokken_id: response.id,
              },
              () => {
                current.onProcessOmiseToken(response);
              }
            );
          }
        } else {
          var msgArr = Array();
          msgArr["message"] =
            response.message !== ""
              ? response.message
              : "Sorry!. Error from omise.";
          current.showOmiselert(msgArr);
        }
      });
    } else {
      return false;
    }
  }

  showOmiselert(msgArr) {
    var dataTimeoutId = $(".omise-error-info-div").attr("data-timeoutid");
    clearTimeout(dataTimeoutId);
    $(".omise-error-info-div").hide();
    $(".omise-error-msg").html(msgArr["message"]);
    $("#omise-error-info-div").fadeIn();
    var timeoutid = setTimeout(function () {
      $(".omise-error-info-div").hide();
    }, 6000);
    $(".omise-error-info-div").attr("data-timeoutid", timeoutid);
  }

  /* post stripe account */
  onProcessOmiseToken = (token) => {
    $.magnificPopup.open({
      items: {
        src: ".processing",
      },
      type: "inline",
      showCloseBtn: false,
      midClick: true,
      closeOnBgClick: false,
    });

    var promoTionArr = Array();
    promoTionArr["promotionApplied"] = this.state.promotion_applied;
    promoTionArr["promotionAmount"] = this.state.promotion_amount;
    promoTionArr["promoIsDelivery"] = this.state.promoIs_delivery;
    var serviceSubChrArr = this.state.servicesurchargeval;
    var calculatedAmount = getCalculatedAmount(
      this.state.globalSettings,
      this.props.zonedetails,
      this.state.cartDetails,
      this.state.cartItems,
      promoTionArr,
      serviceSubChrArr
    );

    var payAmount = parseFloat(calculatedAmount["grandTotalAmount"]).toFixed(2);
    var requestType =
      "Grainandco-" +
      cookie.load("orderOutletId") +
      "-" +
      cookie.load("UserId");

    axios
      .get(apiUrl + "paymentv1/getPaymentReferenceId?app_id=" + appId)
      .then((topRes) => {
        if (topRes.data.status === "ok") {
          var paymentRef = topRes.data.payment_ref_id;
          this.setState({ payment_ref_id: paymentRef });

          /*  load process html */
          var postObject = {};
          postObject = {
            app_id: appId,
            token: token.id,
            customer_id: cookie.load("UserId"),
            outlet_id: cookie.load("orderOutletId"),
            paid_amount: payAmount,
            request_type: requestType,
            outlet_name:
              typeof cookie.load("orderOutletName") === "undefined"
                ? cookie.load("orderOutletName")
                : "",
          };

          this.postOrder(2, "Yes"); // To validate the order

          if (this.state.orderValidFail === 0) {
            axios
              .post(apiUrl + "paymentv1/authOmise", qs.stringify(postObject))
              .then((res) => {
                if (res.data.status === "ok") {
                  var captureID = res.data.result_set.payment_reference_1;
                  var omiseLogId = res.data.result_set.log_id;
                  this.setState(
                    { validateimage: tickImage, omise_log_id: omiseLogId },
                    function () {
                      this.postOrder(3, "", captureID, "Omise");
                    }.bind(this)
                  );
                } else if (res.data.status === "error") {
                  if (res.data.message == "token was already used") {
                    this.omise_search_history();
                  } else {
                    $.magnificPopup.close();
                    var errerTxt =
                      res.data.message !== ""
                        ? res.data.message
                        : "Error code: 1001 Oops! Something went wrong! Please try again.";
                    this.paymentFail("Error", errerTxt);
                    $.magnificPopup.open({
                      items: {
                        src: ".warining_popup",
                      },
                      type: "inline",
                    });
                    return false;
                  }
                } else {
                  var currents = this;
                  setTimeout(
                    function () {
                      currents.omise_search_history();
                    }.bind(this),
                    2000
                  );
                }
              })
              .catch((error) => {
                /*$.magnificPopup.close();
				this.paymentFail('Error', "Error code: 1002 Oops! Unable to connect to server. Please try again.");
                $.magnificPopup.open({
                    items: {
                        src: '.warining_popup'
                    },
                    type: 'inline'
                });
                return false;*/

                var currentcatch = this;
                setTimeout(
                  function () {
                    currentcatch.omise_search_history();
                  }.bind(this),
                  2000
                );
              });
          } else {
            $.magnificPopup.close();
            this.paymentFail(
              "Error",
              "Error code:1003 Oops! Something went wrong! Please try again."
            );
            $.magnificPopup.open({
              items: {
                src: ".warining_popup",
              },
              type: "inline",
            });

            return false;
          }
        } else {
          $.magnificPopup.close();
          this.paymentFail(
            "Error",
            "Error code:1003 Oops! Something went wrong! Please try again."
          );
          $.magnificPopup.open({
            items: {
              src: ".warining_popup",
            },
            type: "inline",
          });

          return false;
        }
      })
      .catch((error) => {
        $.magnificPopup.close();
        this.paymentFail(
          "Error",
          "Error code: 1002 Oops! Unable to connect to server. Please try again."
        );
        $.magnificPopup.open({
          items: {
            src: ".warining_popup",
          },
          type: "inline",
        });
        return false;
      });
  };

  omise_search_history = () => {
    var orderOutlet_Id = cookie.load("orderOutletId");
    var postObject = {};
    postObject = {
      app_id: appId,
      card_id: this.state.omise_tokken_card_id,
      token_id: this.state.omise_tokken_id,
      outlet_id: orderOutlet_Id,
    };

    axios
      .post(apiUrl + "paymentv1/omise_search_details", qs.stringify(postObject))
      .then((res) => {
        if (res.data.status === "ok") {
          var captureID = res.data.captureID;
          var omiseLogId = res.data.log_id;
          this.setState(
            { validateimage: tickImage, omise_log_id: omiseLogId },
            function () {
              this.postOrder(3, "", captureID, "Omise");
            }.bind(this)
          );
        } else if (res.data.status === "error") {
          /* Reset poup message -  start */
          this.onProcessOmiseToken(this.state.omise_tokken_response);
        } else {
          this.onProcessOmiseToken(this.state.omise_tokken_response);
        }
      });
  };

  render() {
    var showRdmPoints =
      parseFloat(this.state.reward_point_count) -
      parseFloat(this.state.used_reward_point);
    showRdmPoints = showRdmPoints.toFixed(2);
    var InptRdmPoints =
      parseFloat(this.state.reward_point_count) > 0
        ? this.state.reward_point_count
        : 0;
    var promoTionArr = Array();
    promoTionArr["promotionApplied"] = this.state.promotion_applied;
    promoTionArr["promotionAmount"] = this.state.promotion_amount;
    promoTionArr["promoIsDelivery"] = this.state.promoIs_delivery;
    var serviceSubChrArr = this.state.servicesurchargeval;
    var calculatedAmount = getCalculatedAmount(
      this.state.globalSettings,
      this.props.zonedetails,
      this.state.cartDetails,
      this.state.cartItems,
      promoTionArr,
      serviceSubChrArr
    );

    var subTotalAmount = parseFloat(calculatedAmount["cartSubTotalAmount"]);
    var payAmount = parseFloat(calculatedAmount["grandTotalAmount"]).toFixed(2);
    /* For Advanced Slot */
    var advancedTimeslotEnable = "0";
    if (Object.keys(this.state.globalSettings).length > 0) {
      advancedTimeslotEnable =
        this.state.globalSettings.client_advanced_timeslot_enable;
    }

    var settingsAddons = {
      infinite: false,
      dots: false,
      slidesToShow: 4,
      slidesToScroll: 1,
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
          breakpoint: 850,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
          },
        },
        {
          breakpoint: 680,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          },
        },
      ],
    };

    var birthdate = this.state.cust_birthdate;
    var gender = this.state.cust_gender;
    var genderHtml =
      "<option value=''> Your Gender </option><option value='M'> Male </option><option value='F'> Female </option><option value='O'> Unspecified </option>";
    var genderDropDown = Parser(genderHtml);

    var userBirthdate =
      cookie.load("UserBirthdate") != "" &&
      cookie.load("UserBirthdate") != undefined
        ? cookie.load("UserBirthdate")
        : "";

    return (
      <div className="checkout-main-div">
        {/* Header start */}
        <Header
          cartTriggerFlg={this.state.cartTriggerFlg}
          sateValChange={this.sateValChange}
        />
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
                <h2>{this.state.menuheader}</h2>
              </div>
            </div>
          </div>
        </div>

        {/* container - start */}
        <div className="container">
          {/* addon products main div - start */}
          {Object.keys(this.props.addonproductlist).length > 0 && (
            <div className="addonpro-slider-top">
              <div className="chk-addonpro-title">
                <h3>Choose addons</h3>
              </div>
              <div className="detail-pg-slider">
                <Slider {...settingsAddons}>
                  {this.addonProductListing()}
                </Slider>
              </div>
            </div>
          )}
          {/* addon products main div - end */}

          {/* Birthday Info div - start */}

          <div className="birthday-info-div">
            <div className="birthday-info-top">
              <h3>
                Hi {cookie.load("UserFname")} <img src={hiHndImage} alt="" />
              </h3>
            </div>
          </div>

          {/* Birthday Info div - end */}

          {/* check_out_fourcommon - start */}
          <div className="check_out_fourcommon">
            <div className="container-one">
              {/* checkoutpage_form_outer - start */}
              <div className="checkoutpage_form_outer">
                <form
                  id="checkoutpage_form"
                  className=" form_sec checkout-total"
                  method="post"
                  acceptCharset="utf-8"
                >
                  <div className="cdd-details">
                    {/* cdd-details-lhs - start */}
                    <div className="cdd-details-lhs fl">
                      <div className="text-center checkout-heading">
                        <span className="text-uppercase">
                          {cookie.load("defaultAvilablityId") === deliveryId
                            ? "Delivery Details"
                            : "Self Collection Details"}
                        </span>
                      </div>
                      <div className="checkout-body-section">
                        {cookie.load("defaultAvilablityId") === deliveryId && (
                          <div className="checkout-control-group-top">
                            <label className="chk_hea">Delivery Location</label>
                            <div className="form-group">
                              <div className="focus-out controls-single">
                                <input
                                  type="text"
                                  readOnly
                                  className="form-control input-focus"
                                  value={this.state.order_delivery_address}
                                  placeholder="Address"
                                />
                              </div>
                            </div>
                            <div className="form-group">
                              <div
                                className={
                                  this.state.order_postcode != ""
                                    ? "focus-out focused"
                                    : "focus-out"
                                }
                              >
                                <label>Postal Code</label>
                                <input
                                  type="text"
                                  readOnly
                                  value={this.state.order_postcode}
                                  className="form-control input-focus"
                                />
                              </div>
                            </div>
                            <div className="form-group controls-three">
                              <div
                                className={
                                  this.state.unitnumber1 != ""
                                    ? "focus-out focused"
                                    : "focus-out"
                                }
                              >
                                <label className="unit-num">Unit No 01</label>
                                <input
                                  type="text"
                                  id="unit_no1_id"
                                  name="unit_no1"
                                  value={this.state.unitnumber1}
                                  className="form-control input-focus"
                                  onChange={this.handleAddrChange.bind(this)}
                                />
                              </div>

                              <div
                                className={
                                  this.state.unitnumber2 != ""
                                    ? "focus-out focused"
                                    : "focus-out"
                                }
                              >
                                <label className="unit-num">Unit No 02</label>
                                <input
                                  type="text"
                                  name="unit_no2"
                                  value={this.state.unitnumber2}
                                  className="form-control input-focus"
                                  onChange={this.handleAddrChange.bind(this)}
                                />
                              </div>
                            </div>
                            <a
                              href="/"
                              onClick={this.changeAddrrFun.bind(this)}
                              className=""
                            >
                              Change Delivery Location
                            </a>
                          </div>
                        )}

                        {cookie.load("defaultAvilablityId") === deliveryId && (
                          <div className="checkout-billing-address">
                            <label className="chk_hea">
                              Billing Address{" "}
                              <span>
                                Same As Delivery Location{" "}
                                <div className="custom_checkbox">
                                  <input
                                    type="checkbox"
                                    name="bill_chk"
                                    className="addon_list_single"
                                    onChange={this.changeBillingAddrChk.bind(
                                      this
                                    )}
                                    checked={this.CheckBillingAddrChk(
                                      "checkbox"
                                    )}
                                  />
                                  <span></span>
                                </div>
                              </span>
                            </label>
                            <div
                              className="check-billing"
                              style={{
                                display: this.CheckBillingAddrChk("display"),
                              }}
                            >
                              <div className="form-group">
                                <div
                                  className={
                                    this.state.billing_postcode != ""
                                      ? "focus-out focused"
                                      : "focus-out"
                                  }
                                >
                                  <label>Postal Code</label>
                                  <input
                                    type="text"
                                    name="billing_postcode"
                                    value={this.state.billing_postcode}
                                    onChange={this.changePostalCode.bind(
                                      this,
                                      "bill"
                                    )}
                                    onKeyPress={(e) => this.validateIntval(e)}
                                    className="form-control input-focus"
                                  />
                                </div>
                              </div>
                              <div className="form-group">
                                <div className="focus-out controls-single">
                                  <input
                                    type="text"
                                    className="form-control input-focus"
                                    placeholder="Address"
                                    readOnly
                                    value={this.state.billing_delivery_address}
                                  />
                                </div>
                              </div>
                              <div className="form-group controls-three">
                                <div
                                  className={
                                    this.state.billunitnumber1 != ""
                                      ? "focus-out focused"
                                      : "focus-out"
                                  }
                                >
                                  <label className="unit-num">Unit No 01</label>
                                  <input
                                    type="text"
                                    name="bill_unit_no1"
                                    value={this.state.billunitnumber1}
                                    className="form-control input-focus"
                                    onChange={this.handleAddrChange.bind(this)}
                                  />
                                </div>

                                <div
                                  className={
                                    this.state.billunitnumber2 != ""
                                      ? "focus-out focused"
                                      : "focus-out"
                                  }
                                >
                                  <label className="unit-num">Unit No 02</label>
                                  <input
                                    type="text"
                                    name="bill_unit_no2"
                                    value={this.state.billunitnumber2}
                                    className="form-control input-focus"
                                    onChange={this.handleAddrChange.bind(this)}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {cookie.load("defaultAvilablityId") === pickupId && (
                          <div className="checkout-control-group-top">
                            <label className="chk_hea">Pickup Location</label>
                            <div className="col-xs-cls">
                              <p>
                                <b>{cookie.load("orderOutletName")}</b>
                              </p>
                              <p>{cookie.load("orderHandledByText")}</p>
                            </div>
                            <a
                              href="/"
                              onClick={this.changeAddrrFun.bind(this)}
                              className="change-pickup-location"
                            >
                              Change Pickup Location
                            </a>
                          </div>
                        )}

                        <div className="checkout-control-group-middle">
                          <label className="chk_hea">
                            Delivery Date & Time
                          </label>
                          <div className="form-group1234">
                            {advancedTimeslotEnable === "1" ? (
                              <OrderAdvancedDatetimeSlot
                                {...this.props}
                                hdrState={this.state}
                                setdateTimeFlg={this.setdateTimeFlg}
                              />
                            ) : (
                              <OrderdatetimeSlot
                                {...this.props}
                                hdrState={this.state}
                                setdateTimeFlg={this.setdateTimeFlg}
                              />
                            )}
                            <div className="ordrdatetime_error"></div>
                          </div>
                        </div>
                        <div className="checkout-control-group-bottom">
                          <label className="chk_hea">Special Instruction</label>
                          <textarea
                            className=""
                            placeholder="Please enter your special message here..."
                            name="specil_note"
                            value={this.state.order_specil_note}
                            onChange={this.handleAddrChange.bind(this)}
                            id="orderRemarks"
                          ></textarea>

                          {this.state.termsAndConditions !== "" && (
                            <div>
                              <div className="checkout-terms-and-condition">
                                {this.state.termsAndConditions}
                              </div>
                              <div className="custom_checkbox tarms_chkbox_div">
                                <input
                                  type="checkbox"
                                  name="tarms_chk"
                                  onClick={this.changeTarmsContnChk.bind(this)}
                                  defaultChecked={this.CheckTarmsContnChk()}
                                />
                                <span>
                                  I have read and accept terms and conditions
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    {/* cdd-details-lhs - end */}

                    {/* cdd-details-rhs - start */}
                    <div className="cdd-details-rhs fl">
                      <div className="chekout_cart_bar">
                        <div className="cart-header">
                          <div className="text-center checkout-heading">
                            <span className="text-uppercase">
                              Your Order Details
                            </span>
                          </div>
                        </div>

                        {this.loadCartOverallData()}
                      </div>
                    </div>
                    {/* cdd-details-rhs - end */}
                  </div>
                </form>
              </div>
              {/* checkoutpage_form_outer - end */}

              {/* redeem div - start */}
              <div className="redeem">
                <div className="redeem-row">
                  <div className="redeem-col">
                    <div className="redeem-item">
                      <div className="redeem-item-hea">
                        <div className="redeem-item-hea-inner">
                          <h4>Get Redeem</h4>
                          <span>Redeem your points here</span>
                        </div>
                        {parseFloat(this.state.reward_point_count) > 0 ? (
                          <Link to={"/rewards"} className="points">
                            You have <b>{showRdmPoints} points</b> available
                          </Link>
                        ) : (
                          ""
                        )}
                      </div>
                      <div className="redeem_apply focus-out applypoints_cls">
                        <div
                          className={
                            this.state.used_reward_point != ""
                              ? "focus-out focused"
                              : "focus-out"
                          }
                        >
                          <label>
                            {"You Can Redeem " + InptRdmPoints + " Points"}
                          </label>
                          <input
                            type="text"
                            name="reward_point"
                            value={this.state.reward_point_val}
                            onKeyPress={(e) => this.validateFloatval(e)}
                            onChange={this.handleAddrChange.bind(this)}
                            id="pointValue"
                            className="form-control input-focus"
                          />
                        </div>
                        {this.state.promotion_applied === "Yes" &&
                        this.state.promotion_type === "points" ? (
                          <button
                            className="button btn_minwid applyPoints"
                            onClick={this.removePointsAndPromo.bind(
                              this,
                              "fromclk"
                            )}
                          >
                            Remove
                          </button>
                        ) : (
                          <button
                            className="button btn_minwid applyPoints"
                            onClick={this.applyPointsAndPromo.bind(
                              this,
                              "points"
                            )}
                          >
                            Apply Now
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="redeem-col redeem-col-right">
                    <div className="redeem-item">
                      <div className="redeem-item-hea">
                        <div className="redeem-item-hea-inner">
                          <h4>Promo Code</h4>
                          <span>Apply your promo code here</span>
                        </div>
                        {parseFloat(this.state.promotion_count) > 0 ? (
                          <Link to={"/mypromotions"} className="points">
                            You have{" "}
                            <b>{this.state.promotion_count} Promotions</b>{" "}
                            available
                          </Link>
                        ) : (
                          ""
                        )}
                      </div>
                      <div className="redeem_apply focus-out applypromo_cls">
                        <div
                          className={
                            this.state.promo_code_val != ""
                              ? "focus-out focused"
                              : "focus-out"
                          }
                        >
                          <label>Add Your Promo Code Here</label>
                          <input
                            name="promo_code"
                            value={this.state.promo_code_val}
                            id="promocodeValue"
                            type="text"
                            className="form-control input-focus"
                            onChange={this.handleAddrChange.bind(this)}
                          />
                        </div>
                        {this.state.promotion_applied === "Yes" &&
                        this.state.promotion_type === "promoCode" ? (
                          <button
                            className="button btn_minwid promobtn applyPromo"
                            onClick={this.removePointsAndPromo.bind(
                              this,
                              "fromclk"
                            )}
                          >
                            Remove
                          </button>
                        ) : (
                          <button
                            className="button btn_minwid promobtn applyPromo"
                            onClick={this.applyPointsAndPromo.bind(
                              this,
                              "promoCode"
                            )}
                          >
                            Apply Now
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* redeem div - end */}
              {/* Birthday div - Start */}
              {userBirthdate === "" && (
                <div className="birthday-info-move">
                  <div className="birthday-info-middle">
                    <p>
                      Do share the following for us to reach out to you with
                      promotions and offer!
                    </p>
                  </div>

                  <div className="birthday-info-bottom">
                    <div className="birthday-inpt-act">
                      <div className="left-input-div">
                        <div className="react_datepicker">
                          <DatePicker
                            peekNextMonth
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            className="form-control"
                            selected={birthdate}
                            placeholderText="Your Birthday"
                            maxDate={this.state.Maxdate}
                            dateFormat="dd/MM/yyyy"
                            onChange={this.handleChangeDate}
                          />
                        </div>
                      </div>
                      <div className="right-input-div">
                        <div className="narml_select">
                          <select
                            value={this.state.cust_gender}
                            name="cust_gender"
                            className="form-control"
                            onChange={this.onGenderChange.bind(this)}
                          >
                            {genderDropDown}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Birthday div - end */}
              {/* chk-payment div - end */}
              <div className="chk-payment">
                <div className="chk-payment-row">
                  <div className="chk-payment-title">
                    <h3>Select Your Payment Method</h3>
                  </div>
                  <div className="chk-payment-col">
                    <form action="#">
                      {this.state.paymentmodevalue !== "promotion" &&
                        parseFloat(payAmount) > 0 && (
                          <ul className="chk-payment-col-radio">
                            {this.state.cod_payment_enable === 1 && (
                              <li className="custom_checkbox">
                                <input
                                  type="radio"
                                  defaultChecked={
                                    this.state.paymentmodevalue == "Cash"
                                      ? "checked"
                                      : ""
                                  }
                                  id="cash"
                                  onClick={this.choosePayment.bind(
                                    this,
                                    "Cash"
                                  )}
                                  name="radio-group"
                                />
                                <label htmlFor="cash"></label>
                                <div className="radio_con">
                                  Cash On Delivery
                                </div>
                              </li>
                            )}
                            {this.state.stripe_payment_enable === 1 && (
                              <li className="custom_checkbox">
                                <input
                                  type="radio"
                                  defaultChecked={
                                    this.state.paymentmodevalue == "Stripe"
                                      ? "checked"
                                      : ""
                                  }
                                  id="card"
                                  onClick={this.choosePayment.bind(
                                    this,
                                    "Stripe"
                                  )}
                                  name="radio-group"
                                />
                                <label htmlFor="card"></label>
                                <div className="radio_con">
                                  <img src={paymentImage} />
                                </div>
                              </li>
                            )}
                            {this.state.omise_payment_enable === 1 && (
                              <li className="custom_checkbox">
                                <input
                                  type="radio"
                                  defaultChecked={
                                    this.state.paymentmodevalue == "Omise"
                                      ? "checked"
                                      : ""
                                  }
                                  id="omscard"
                                  onClick={this.choosePayment.bind(
                                    this,
                                    "Omise"
                                  )}
                                  name="radio-group"
                                />
                                <label htmlFor="omscard"></label>
                                <div className="radio_con">
                                  <img src={paymentImage} />
                                </div>
                              </li>
                            )}
                          </ul>
                        )}

                      {this.state.paymentmodevalue === "promotion" &&
                        parseFloat(payAmount) === 0 &&
                        subTotalAmount > 0 && (
                          <ul className="chk-payment-col-radio promotion-ul-topcls">
                            <li className="custom_checkbox">
                              <input
                                type="radio"
                                defaultChecked={
                                  this.state.paymentmodevalue == "promotion"
                                    ? "checked"
                                    : ""
                                }
                                id="promotion"
                                name="radio-group"
                              />
                              <label htmlFor="promotion"></label>
                              <div className="radio_con">Promotion</div>
                            </li>
                          </ul>
                        )}
                    </form>
                  </div>
                  <div className="chk-payment-col"></div>
                </div>

                {/* chk-payment div - end */}

                {/* chk-payment-btn div - end */}
                <div className="chk-payment-btn">
                  {this.state.paymentmodevalue !== "promotion" &&
                    parseFloat(payAmount) > 0 && (
                      <div className="chk-payment-btn-row">
                        {this.state.paymentmodevalue == "Cash" &&
                          this.state.cod_payment_enable === 1 && (
                            <a
                              href="/"
                              className="button"
                              title="Continue"
                              onClick={this.payCash.bind(this)}
                            >
                              Place Order
                            </a>
                          )}

                        {/*this.state.globalSettings.stripe_public_key && cookie.load('UserMobile') !='' && this.state.paymentmodevalue == 'Stripe' && this.state.stripe_payment_enable === 1 && <StripeCheckout name={stripeCompany} image={stripeImage} description={this.stripeDescription()} token={this.onToken} stripeKey={this.state.globalSettings.stripe_public_key} amount={(payAmount * 100)} email={cookie.load('UserEmail')} currency={stripeCurrency} > <a href="javascript:;" className="button" title="Continue">Checkout</a>
                            </StripeCheckout>*/}

                        {this.state.globalSettings.stripe_public_key &&
                          cookie.load("UserMobile") != "" &&
                          this.state.paymentmodevalue == "Stripe" &&
                          this.state.stripe_payment_enable === 1 && (
                            <a
                              href="/"
                              onClick={this.orderPayValidaion.bind(
                                this,
                                "Stripe"
                              )}
                              className="button"
                              title="Continue"
                            >
                              Place Order
                            </a>
                          )}

                        {this.state.globalSettings.omise_public_key &&
                          cookie.load("UserMobile") != "" &&
                          this.state.paymentmodevalue == "Omise" &&
                          this.state.omise_payment_enable === 1 && (
                            <a
                              href="#"
                              onClick={this.orderPayValidaion.bind(
                                this,
                                "Omise"
                              )}
                              className="button"
                              title="Continue"
                            >
                              Place Order
                            </a>
                          )}
                      </div>
                    )}

                  {this.state.paymentmodevalue === "promotion" &&
                    parseFloat(payAmount) === 0 &&
                    subTotalAmount > 0 && (
                      <div className="chk-payment-btn-row">
                        <a
                          href="/"
                          className="button"
                          title="Continue"
                          onClick={this.postPromotionOrder.bind(this)}
                        >
                          Place Order
                        </a>
                      </div>
                    )}
                </div>
              </div>
              {/* chk-payment-btn div - end */}
            </div>
          </div>
          {/* check_out_fourcommon - end */}
        </div>
        {/* container - end */}

        {/*Payment confirm popup Start*/}
        <div
          id="pay-conf-popup"
          className="white-popup mfp-hide popup_sec pay-conf-popup"
        >
          <div className="custom_alert">
            <div className="custom_alertin">
              <div className="alert_height">
                <div className="alert_header">Alert!</div>
                <div className="alert_body">
                  <p>Awesome ! You are all set</p>
                  <div className="alt_btns">
                    {this.state.globalSettings.stripe_public_key &&
                      cookie.load("UserMobile") != "" &&
                      this.state.paymentmodevalue == "Stripe" &&
                      this.state.stripe_payment_enable === 1 && (
                        <StripeCheckout
                          name={stripeCompany}
                          image={stripeImage}
                          description={this.stripeDescription()}
                          token={this.onToken}
                          stripeKey={
                            this.state.globalSettings.stripe_public_key
                          }
                          amount={payAmount * 100}
                          email={cookie.load("UserEmail")}
                          currency={stripeCurrency}
                        >
                          {" "}
                          <a
                            href="javascript:;"
                            className="button"
                            title="Proceed To Payment"
                          >
                            Proceed To Payment
                          </a>
                        </StripeCheckout>
                      )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/*payment confirm popup - End*/}

        {/*Payment omise confirm popup Start*/}
        <div
          id="pay-omiseconf-popup"
          className="white-popup mfp-hide popup_sec pay-omiseconf-popup"
        >
          <div
            className="omise-error-info-div"
            id="omise-error-info-div"
            data-timeoutid=""
            style={{ display: "none" }}
          >
            <div className="container">
              <span className="omise-error-icon">
                <i
                  className="fa fa-exclamation-triangle"
                  aria-hidden="true"
                ></i>
              </span>
              <a
                href="#"
                className="omise_alert_close"
                data-dismiss="alert"
                aria-label="Close"
                onClick={(evt) => {
                  evt.preventDefault();
                }}
              >
                {" "}
                <span aria-hidden="true">×</span>{" "}
              </a>
              <p className="omise-error-msg">Something went wrong</p>
            </div>
          </div>

          {this.state.globalSettings.omise_envir === "dev" && (
            <div className="omisepay-mode-option">Test Mode</div>
          )}

          <div className="custom_alert">
            <div className="custom_alertin">
              <div className="alert_height">
                <div className="omise_pay_header">
                  <span className="omise-pay-img">
                    <img className="makisan-logo-img" src={stripeImage} />
                  </span>
                  <span className="omise-pay-title">Grains & Co</span>
                </div>
                <div className="omise_pay_body">
                  <div className="omisepop_in">
                    <div className="form_sec">
                      <div className={"uname-box " + this.state.omisenameerror}>
                        <i className="fa fa-user" data-unicode="f007"></i>
                        <input
                          type="text"
                          id="holdername"
                          className="form-control"
                          placeholder="Card Holder Name"
                          value={this.state.holdername}
                          onChange={this.handleChangeTxt.bind(
                            this,
                            "holdername"
                          )}
                        />
                      </div>

                      <div
                        className={"card-numbr-div " + this.state.omisecardrror}
                      >
                        <i
                          className="fa fa-credit-card"
                          data-unicode="f09d"
                        ></i>
                        <input
                          type="text"
                          className={"form-control " + this.state.cardImage}
                          placeholder="Card Number"
                          value={this.state.cardNumber}
                          id="omise_card_number"
                          value={this.state.cardNumber}
                          onChange={this.handleChangeTxt.bind(
                            this,
                            "cardNumber"
                          )}
                        />
                        <span className="card"></span>
                      </div>

                      <div className="form_expire_row">
                        <div className="expire_row_inner">
                          <div
                            className={
                              "expire_left " + this.state.omisemontherror
                            }
                          >
                            <i
                              className="fa fa-calendar-o"
                              data-unicode="f133"
                            ></i>
                            <input
                              type="text"
                              className="form-control"
                              maxLength="2"
                              id="expiration_month"
                              placeholder="MM"
                              value={this.state.expiration_month}
                              onChange={this.handleChangeTxt.bind(
                                this,
                                "expiration_month"
                              )}
                            />
                          </div>

                          <div
                            className={
                              "expire_mdl " + this.state.omiseyearerror
                            }
                          >
                            <input
                              type="text"
                              placeholder="YY"
                              className="form-control"
                              maxLength="4"
                              id="expiration_year"
                              value={this.state.expiration_year}
                              onChange={this.handleChangeTxt.bind(
                                this,
                                "expiration_year"
                              )}
                            />
                          </div>

                          <div
                            className={
                              "expire_right " + this.state.omisecodeerror
                            }
                          >
                            <i className="fa fa-lock" data-unicode="f023"></i>
                            <input
                              type="password"
                              maxLength="3"
                              className="form-control"
                              id="security_code"
                              placeholder="CVV"
                              value={this.state.security_code}
                              onChange={this.handleChangeTxt.bind(
                                this,
                                "security_code"
                              )}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="alt_btns">
                        {this.state.globalSettings.omise_public_key &&
                          cookie.load("UserMobile") != "" &&
                          this.state.paymentmodevalue == "Omise" &&
                          this.state.omise_payment_enable === 1 && (
                            <button
                              onClick={this.getOmiseToken.bind(this)}
                              className="button omise-pay-btn"
                            >
                              Pay {stripeCurrency}{" "}
                              {parseFloat(payAmount).toFixed(2)}
                            </button>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/*payment omise confirm popup - End*/}

        <div
          id="processing-popup"
          className="white-popup mfp-hide popup_sec processing"
        >
          <div className="pouup_in">
            <h3 className="title1 text-center">We Are Processing Your Order</h3>
            <div className="process_inner">
              {this.onlinePaymentLoading()}
              {this.orderBCLoading()}
              {this.amountCaptureLoading()}
            </div>
          </div>
        </div>

        <div id="dvLoading"></div>

        {/* Footer section */}
        <Footer />
        {this.state.editItemID === "" && (
          <ProductDetail
            productState={this.state}
            sateValChange={this.sateValChange}
          />
        )}
      </div>
    );
  }
}

const mapStateTopProps = (state) => {
  var overAllcart = Array();
  var cartDetails = Array();
  var cartItems = Array();
  var cartTotalItmCount = 0;
  var cartStatus = "";
  var productLeadtime = 0;
  var updateCartResponse = Array();

  if (Object.keys(state.cartlistdetail).length > 0) {
    var resultSetArr = !("result_set" in state.cartlistdetail[0])
      ? Array()
      : state.cartlistdetail[0].result_set;
    if (
      state.cartlistdetail[0].status === "ok" &&
      Object.keys(resultSetArr).length > 0
    ) {
      overAllcart = resultSetArr;
      cartDetails = resultSetArr.cart_details;
      cartItems = resultSetArr.cart_items;
      productLeadtime = resultSetArr.product_lead_time;
      cartTotalItmCount = resultSetArr.cart_details.cart_total_items;
      cartStatus = "success";
    } else {
      cartStatus = "failure";
    }
  }

  var globalSettings = Array();
  if (Object.keys(state.settings).length > 0) {
    if (state.settings[0].status === "ok") {
      globalSettings = state.settings[0].result_set;
    }
  }

  var zonedetailArr = Array();
  if (Object.keys(state.zonedetail).length > 0) {
    if (state.zonedetail[0].status === "ok") {
      zonedetailArr = state.zonedetail[0].result_set;
    }
  }

  var activityCountArr = Array();
  if (Object.keys(state.activitycount).length > 0) {
    if (state.activitycount[0].status === "ok") {
      activityCountArr = state.activitycount[0].result_set;
    }
  }

  var blacksArr = Array();
  if (Object.keys(state.staticblack).length > 0) {
    if (state.staticblack[0].status === "ok") {
      blacksArr = state.staticblack[0].result_set;
    }
  }

  var addonProArr = Array();
  var addonCommonArr = Array();
  if (Object.keys(state.addonproduct).length > 0) {
    if (
      state.addonproduct[0].status === "ok" &&
      Object.keys(state.addonproduct[0].result_set).length > 0
    ) {
      addonProArr = state.addonproduct[0].result_set;
      addonCommonArr = state.addonproduct[0].common;
    }
  }

  if (Object.keys(state.updatecartdetail).length > 0) {
    if (state.updatecartdetail[0].status === "error") {
      updateCartResponse = state.updatecartdetail;
    }
  }

  var blacksArr = Array();
  if (Object.keys(state.staticblack).length > 0) {
    if (state.staticblack[0].status === "ok") {
      blacksArr = state.staticblack[0].result_set;
    }
  }

  return {
    activitycountArr: activityCountArr,
    settingsArr: globalSettings,
    staticblack: blacksArr,
    zonedetails: zonedetailArr,
    overAllcart: overAllcart,
    cartDetails: cartDetails,
    cartItems: cartItems,
    productLeadtime: productLeadtime,
    cartTotalItmCount: cartTotalItmCount,
    cartStatus: cartStatus,
    addonproductlist: addonProArr,
    addonproductcommon: addonCommonArr,
    updateCartResponse: updateCartResponse,
    staticblack: blacksArr,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getCartDetail: () => {
      dispatch({ type: GET_CART_DETAIL });
    },
    updateCartDetail: (productId, cartItemId, cartQty, orderVoucherId) => {
      dispatch({
        type: UPDATE_CART_DETAIL,
        productId,
        cartItemId,
        cartQty,
        orderVoucherId,
      });
    },
    deleteCartDetail: (cartItemId) => {
      dispatch({ type: DELETE_CART_DETAIL, cartItemId });
    },
    destroyCartDetail: () => {
      dispatch({ type: DESTROY_CART_DETAIL });
    },
    getActivityCount: (getObject) => {
      dispatch({ type: GET_ACTIVITYCOUNT, getObject });
    },
    getAddonProList: (outletId) => {
      dispatch({ type: GET_ADDONPRODUCT, outletId });
    },
    getStaticBlock: () => {
      dispatch({ type: GET_STATIC_BLOCK });
    },
  };
};
export default connect(mapStateTopProps, mapDispatchToProps)(Checkout);
