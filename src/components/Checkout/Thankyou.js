/* eslint-disable */
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import Moment from "moment";
import { setMinutes, setHours, getDay, format } from "date-fns";
import cookie from "react-cookies";
import Header from "../Layout/Header";
import Footer from "../Layout/Footer";

import {
  stripslashes,
  addressFormat,
  getCalculatedAmount,
  callImage,
  showLoader,
  hideLoader,
  showAlert,
} from "../Helpers/SettingHelper";
import { appId, deliveryId, CountryTxt, apiUrlNotify } from "../Helpers/Config";
import thnkyou_tick_img from "../../common/images/tick.png";
import productImg from "../../common/images/noimg-400x400.jpg";
import scootyImg from "../../common/images/scooty.png";
import cartMpImg from "../../common/images/cart-map.png";
import innerbanner from "../../common/images/inner-banner.jpg";
import { GET_ORDER_DETAIL, GET_STATIC_BLOCK } from "../../actions";

var Parser = require("html-react-parser");

class Thankyou extends Component {
  constructor(props) {
    super(props);
    this.state = {
      staticblacks: [],
      menuheader: "",
      imageLink: "",
    };
    this.props.getStaticBlock();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.staticblack !== this.state.staticblacks) {
      var menuheader = "";
      var imageLink = "";
      if (Object.keys(nextProps.staticblack).length > 0) {
        nextProps.staticblack.map((data) => {
          if (data.staticblocks_slug === "thankyou-header") {
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

  componentWillMount() {
    let orderId =
      typeof this.props.match.params.orderId !== "undefined"
        ? this.props.match.params.orderId
        : "";
    var chkOrderid =
      typeof cookie.load("ChkOrderid") === "undefined"
        ? ""
        : cookie.load("ChkOrderid");
    if (orderId !== "" && chkOrderid === orderId) {
      this.props.getOrderDetail(orderId);
      /*this.sendNotification();*/
    } else {
      showAlert("Error", "Invalid order detail.");
      $.magnificPopup.open({
        items: {
          src: ".alert_popup",
        },
        type: "inline",
      });
      this.props.history.push("/");
    }
  }

  componentDidMount() {
    /*console.log('DidMount');*/
  }

  sendNotification() {
    axios.get(apiUrlNotify + "order_notify").then((res) => {});
  }

  loadItems(orderDetail) {
    if (Object.keys(orderDetail).length > 0) {
      var remarks =
        orderDetail.order_remarks !== "" ? (
          <div className="remark_notesec text-left">
            <h4>Remarks</h4>
            <p>{orderDetail.order_remarks}</p>
          </div>
        ) : (
          ""
        );
      var cartItems = orderDetail["items"];
      return cartItems.map((item, index) => (
        <div key={index}>
          <div className="cart_row product-details">
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

                {item.item_specification !== "" && (
                  <p className="help-block">
                    {stripslashes(item.item_specification)}
                  </p>
                )}
              </div>
            </div>
            <div className="col-sm-cls cart_right text-right">
              <div className="cart_price">
                <p>${parseFloat(item.item_total_amount).toFixed(2)}</p>
              </div>
            </div>
          </div>
          {remarks}
        </div>
      ));
    } else {
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
        var comboQtyChk = comboQty !== "" ? parseInt(comboQty) : 0;
        if (comboQtyChk > 0) {
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

      return html;
    }

    return "";
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
    let orderArr = this.props.orderdetail;
    var orderDetail = [];

    if (Object.keys(orderArr).length > 0) {
      if (orderArr[0].status === "ok") {
        orderDetail = orderArr[0].result_set[0];
      }
    }

    return (
      <div className="thankyou-main-div">
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
        {/* container - start */}
        <div className="container">
          {/* innersection_wrap - start */}
          {Object.keys(orderDetail).length > 0 && (
            <div className="innersection_wrap tnk-you">
              <div className="mainacc_toptext tick">
                <img src={thnkyou_tick_img} alt="" />
                <h2>Thank You</h2>
                <p>Your order has been placed successfully</p>
              </div>

              {/* order-detail-maindiv - start */}
              <div className="thank-order-detaildiv">
                <div className="tnk-detail text-center">
                  <h2>YOUR ORDER DETAILS</h2>
                  <div className="tnk-order">
                    <h3>Order No - {orderDetail.order_local_no}</h3>
                    <p>
                      Order placed at :{" "}
                      {Moment(orderDetail.order_created_on).format(
                        "DD-MM-YYYY hh:mm A"
                      )}
                      <br></br>Pay by : {orderDetail.order_method_name}
                    </p>
                  </div>
                </div>

                <div className="tnk-delivery">
                  {orderDetail.order_availability_id === deliveryId ? (
                    <div className="delivery-cart-div">
                      <div className="cart-direction">
                        <img className="cart-direction-left" src={scootyImg} />
                        <img className="cart-direction-right" src={cartMpImg} />
                      </div>
                      <div className="cart_row tnkorder-first">
                        <div className="order-hlhs text-left">
                          <h5>Order Handling By</h5>
                          <p>{stripslashes(orderDetail.outlet_name)}</p>
                          <p>
                            {addressFormat(
                              orderDetail.outlet_unit_number1,
                              orderDetail.outlet_unit_number2,
                              orderDetail.outlet_address_line1,
                              orderDetail.outlet_address_line2,
                              orderDetail.outlet_postal_code
                            )}
                          </p>
                        </div>
                        <div className="order-hrhs text-right">
                          <h5>Delivery Location</h5>
                          <p>
                            {addressFormat(
                              orderDetail.order_customer_unit_no1,
                              orderDetail.order_customer_unit_no2,
                              orderDetail.order_customer_address_line1,
                              orderDetail.order_customer_address_line2,
                              orderDetail.order_customer_postal_code
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="pickup-cart-div">
                      <div className="cart-direction"></div>
                      <div className="cart_row cart-header-first">
                        <div className="pickup-thankfull text-center">
                          <h4>Pickup Location</h4>
                          <p>{stripslashes(orderDetail.outlet_name)}</p>
                          <p>
                            {addressFormat(
                              orderDetail.outlet_unit_number1,
                              orderDetail.outlet_unit_number2,
                              orderDetail.outlet_address_line1,
                              orderDetail.outlet_address_line2,
                              orderDetail.outlet_postal_code
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <br />

                  <div className="delivery_total delivery_total_number delivery_datetime_div">
                    <div className="delivery_total_left">
                      <h2>
                        {orderDetail.order_availability_id === deliveryId
                          ? "Delivery"
                          : "Pickup"}{" "}
                        Date
                      </h2>
                      <h4 className="checkoutDate">
                        {Moment(orderDetail.order_date).format("DD-MM-YYYY")}
                      </h4>
                    </div>
                    <div className="delivery_total_left delivery_total_right">
                      <h2>
                        {orderDetail.order_availability_id === deliveryId
                          ? "Delivery"
                          : "Pickup"}{" "}
                        time
                      </h2>
                      {/* Advanced Slot */}
                      <h4 className="checkoutTime">
                        {this.showOrdTimeSlot(orderDetail)}
                      </h4>
                    </div>
                  </div>

                  <div className="orderitem_body_div">
                    <div className="overall-parent">
                      <div className="order-details-with-clear">
                        <h5>Your Items</h5>
                      </div>
                      {this.loadItems(orderDetail)}
                    </div>
                  </div>

                  <div className="cart_footer tnk_cart_footer">
                    <div className="cart_row">
                      <p className="text-uppercase">SUBTOTAL</p>

                      <span>${orderDetail.order_sub_total}</span>
                    </div>

                    {parseFloat(orderDetail.order_delivery_charge) > 0 && (
                      <div className="cart_row">
                        <p className="text-uppercase">Delivery Charge</p>
                        <span>
                          $
                          {parseFloat(
                            orderDetail.order_delivery_charge
                          ).toFixed(2)}
                        </span>
                      </div>
                    )}

                    {parseFloat(orderDetail.order_additional_delivery) > 0 && (
                      <div className="cart_row">
                        <p className="text-uppercase">
                          Additional Delivery Charge
                        </p>
                        <span>
                          $
                          {parseFloat(
                            orderDetail.order_additional_delivery
                          ).toFixed(2)}
                        </span>
                      </div>
                    )}

                    {parseFloat(orderDetail.order_service_charge_amount) >
                      0 && (
                      <div className="cart_row">
                        {parseFloat(orderDetail.order_service_charge) > 0 ? (
                          <p className="text-uppercase">
                            Service Charge (
                            {parseFloat(orderDetail.order_service_charge)}%)
                          </p>
                        ) : (
                          <p className="text-uppercase">Service Charge</p>
                        )}
                        <span>
                          $
                          {parseFloat(
                            orderDetail.order_service_charge_amount
                          ).toFixed(2)}
                        </span>
                      </div>
                    )}

                    {parseFloat(orderDetail.order_subcharge_amount) > 0 && (
                      <div className="cart_row">
                        <p className="text-uppercase">Surcharge</p>
                        <span>
                          {parseFloat(
                            orderDetail.order_subcharge_amount
                          ).toFixed(2)}
                        </span>
                      </div>
                    )}

                    {parseFloat(orderDetail.order_discount_amount) > 0 && (
                      <div className="cart_row">
                        <p className="text-uppercase">
                          {orderDetail.order_discount_type === "redeem"
                            ? "Discount (-)"
                            : "Promocode (-)"}
                        </p>
                        <span>
                          $
                          {parseFloat(
                            orderDetail.order_discount_amount
                          ).toFixed(2)}
                        </span>
                      </div>
                    )}
                    {parseFloat(orderDetail.order_voucher_discount_amount) >
                      0 && (
                      <div className="cart_row">
                        <div className="row-replace">
                          <div className="col-sm-cls text-left">
                            <p className="text-uppercase">
                              Voucher Discount(-)
                            </p>
                          </div>
                          <div className="col-sm-cls text-right">
                            <span>
                              {showPrices(
                                parseFloat(
                                  orderDetail.order_voucher_discount_amount
                                ).toFixed(2)
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                    {parseFloat(orderDetail.order_tax_calculate_amount) > 0 && (
                      <div className="cart_row gst-row">
                        <p className="text-uppercase">
                          GST({parseFloat(orderDetail.order_tax_charge)}%)
                        </p>
                        <span>
                          $
                          {parseFloat(
                            orderDetail.order_tax_calculate_amount
                          ).toFixed(2)}
                        </span>
                      </div>
                    )}

                    <div className="cart_row grant-total-cls">
                      <p className="text-uppercase">Total</p>

                      <span>
                        <sup>$</sup>
                        {parseFloat(orderDetail.order_total_amount).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div className="tnk-chk-order">
                    <Link to={"/myorders"} className="button">
                      Check Your Order Status
                    </Link>
                  </div>
                </div>
              </div>
              {/* order-detail-maindiv - end */}
            </div>
          )}
          {/* innersection_wrap - start */}
        </div>
        {/* container - end */}

        {/* Footer section */}
        <Footer />
      </div>
    );
  }
}

const mapStateTopProps = (state) => {
  var globalSettings = Array();
  if (Object.keys(state.settings).length > 0) {
    if (state.settings[0].status === "ok") {
      globalSettings = state.settings[0].result_set;
    }
  }
  var blacksArr = Array();
  if (Object.keys(state.staticblack).length > 0) {
    if (state.staticblack[0].status === "ok") {
      blacksArr = state.staticblack[0].result_set;
    }
  }

  return {
    settingsArr: globalSettings,
    orderdetail: state.orderdetail,
    staticblack: blacksArr,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getOrderDetail: (orderId) => {
      dispatch({ type: GET_ORDER_DETAIL, orderId });
    },
    getStaticBlock: () => {
      dispatch({ type: GET_STATIC_BLOCK });
    },
  };
};

export default connect(mapStateTopProps, mapDispatchToProps)(Thankyou);
