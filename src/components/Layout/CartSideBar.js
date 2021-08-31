/* eslint-disable */
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import cookie from "react-cookies";
import moment from "moment";
import {
  stripslashes,
  getCalculatedAmount,
  showLoader,
  hideLoader,
  getOrderDateTime,
  getPromoCkValue,
  removePromoCkValue,
  resetCrtStyle,
  showAlert,
} from "../Helpers/SettingHelper";
import { deliveryId, CountryTxt } from "../Helpers/Config";

import crossImg from "../../common/images/cross1.png";
import shoppingBag from "../../common/images/shopping-bag.svg";
import noimage from "../../common/images/no-img-product.png";

import {
  GET_CART_DETAIL,
  UPDATE_CART_DETAIL,
  DELETE_CART_DETAIL,
  DESTROY_CART_DETAIL,
} from "../../actions";
var Parser = require("html-react-parser");

class CartSideBar extends Component {
  constructor(props) {
    super(props);
    var unitNoOne =
      typeof cookie.load("unitNoOne") === "undefined"
        ? ""
        : cookie.load("unitNoOne");
    var unitNoTwo =
      typeof cookie.load("unitNoTwo") === "undefined"
        ? ""
        : cookie.load("unitNoTwo");
    this.state = {
      cartlistdetail: [],
      overAllcart: [],
      cartItems: [],
      cartDetails: [],
      cartStatus: "",
      settings: [],
      cartTotalItmCount: 0,
      cartTotalAmount: 0,
      unitnumber1: unitNoOne,
      unitnumber2: unitNoTwo,
      updateCartResponse: [],
      startMsg: 0,
    };
  }

  componentWillMount() {
    this.props.getCartDetail();
  }

  componentWillReceiveProps(headerProps) {
    if (headerProps.cartTriggerFlg === "yes") {
      headerProps.prpSateValChange("cartflg", "no");
      this.props.getCartDetail();
      resetCrtStyle();
    }
    hideLoader("product-details", "class");
    hideLoader("cart_body", "class");

    if (this.state.updateCartResponse !== headerProps.updateCartResponse) {
      if (Object.keys(headerProps.updateCartResponse).length > 0) {
        this.setState(
          { updateCartResponse: headerProps.updateCartResponse },
          function () {
            var Response = headerProps.updateCartResponse;

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

    if (this.state.cartItems !== headerProps.cartItems) {
      this.setState({ cartItems: headerProps.cartItems }, function () {
        this.props.prpStateCartChange("cartItem", headerProps.cartItems);
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

  componentDidMount() {}
  handleChange = (event) => {};
  removePromoFun(event) {
    event.preventDefault();
    removePromoCkValue();
    this.props.getCartDetail();
  }

  closeCartlist() {
    $("body").removeClass("cart-items-open");
    $(".hcartdd_trigger").removeClass("active");
    $(".hcart_dropdown").removeClass("open");
  }

  handleAddrChange(event) {
    if (event.target.name === "unit_no1") {
      cookie.save("unitNoOne", event.target.value, { path: "/" });
      this.setState({ unitnumber1: event.target.value });
    } else if (event.target.name === "unit_no2") {
      cookie.save("unitNoTwo", event.target.value, { path: "/" });
      this.setState({ unitnumber2: event.target.value });
    }
  }

  cartDetailsList() {
    var cartItemsArr = this.props.cartItems;

    if (Object.keys(cartItemsArr).length > 0) {
      var cartDetailsArr = this.props.cartDetails;
      var promoTionArr = getPromoCkValue();

      var globalSettings = Array();
      if (Object.keys(this.props.globalsettings).length > 0) {
        if (this.props.globalsettings[0].status === "ok") {
          globalSettings = this.props.globalsettings[0].result_set;
        }
      }
      var zoneDetails = this.props.zonedetails;

      var calculatedAmount = getCalculatedAmount(
        globalSettings,
        zoneDetails,
        cartDetailsArr,
        cartItemsArr,
        promoTionArr
      );
      var orderDateTime =
        typeof cookie.load("orderDateTime") === "undefined"
          ? ""
          : cookie.load("orderDateTime");
      var orderTAT =
        typeof cookie.load("orderTAT") === "undefined"
          ? ""
          : cookie.load("orderTAT");
      var orderDateTmTxt = getOrderDateTime(orderDateTime, orderTAT);

      return (
        <div className="hcart_dropdown">
          <div className="hcart_tt">
            <div
              id="cart-close-span"
              onClick={this.closeCartlist.bind(this)}
            ></div>
            <h3>YOUR ORDER DETAILS</h3>
          </div>
          <div className="hcart_scrollarea">
            <div className="cart_table">
              <div className="cart_body">
                {cookie.load("defaultAvilablityId") === deliveryId ? (
                  <div className="delivery-cart-div">
                    <div className="col-sm-cls text-left">
                      <h4>Order Handled By</h4>
                      <p>{cookie.load("orderOutletName")}</p>
                      <p>{cookie.load("orderHandledByText")}</p>
                    </div>

                    <div className="col-sm-cls text-right">
                      <h4>Delivery Location</h4>
                      <p>{cookie.load("orderDeliveryAddress")}</p>
                      <p>
                        {CountryTxt} {cookie.load("orderPostalCode")}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="pickup-cart-div">
                    <div className="cart_row cart-header-first">
                      <div className="row-replace">
                        <div className="col-xs-12 cart_left text-center">
                          <h4>Pickup Location</h4>
                          <p>{cookie.load("orderOutletName")}</p>
                          <p>{cookie.load("orderHandledByText")}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div className="cart_row cart-header-second">
                  <div className="col-sm-cls text-left">
                    <h5>
                      {cookie.load("defaultAvilablityId") === deliveryId
                        ? "Delivery"
                        : "Pickup"}{" "}
                      Date
                    </h5>
                    <h3>{moment(orderDateTmTxt).format("DD/MM/YYYY")}</h3>
                  </div>
                  {/* For Advanced Slot */}
                  <div className="col-sm-cls text-right">
                    <h5>
                      {cookie.load("defaultAvilablityId") === deliveryId
                        ? "Delivery"
                        : "Pickup"}{" "}
                      Time
                    </h5>
                    {cookie.load("slotType") === "2" ? (
                      <h3>{cookie.load("orderSlotTxt")}</h3>
                    ) : (
                      <h3>{moment(orderDateTmTxt).format("hh:mm A")}</h3>
                    )}
                  </div>
                </div>
                <div className="product_orders_top">
                  <h4>Your Items</h4>
                  <a
                    href="/"
                    onClick={this.clearCartItm.bind(this)}
                    className="hclear_cart"
                    title="CLEAR CART"
                  >
                    CLEAR CART
                  </a>
                </div>

                {this.cartItemList()}
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
                      $
                      {parseFloat(calculatedAmount["deliveryCharge"]).toFixed(
                        2
                      )}
                    </span>
                  </div>
                )}
                {parseFloat(calculatedAmount["additionalDelivery"]) > 0 && (
                  <div className="cart_row">
                    <p className="text-uppercase">Additional Delivery</p>
                    <span>
                      $
                      {parseFloat(
                        calculatedAmount["additionalDelivery"]
                      ).toFixed(2)}
                    </span>
                  </div>
                )}
                {parseFloat(calculatedAmount["promotionAmount"]) > 0 && (
                  <div className="cart_row">
                    <p className="text-uppercase">Promo Code</p>
                    <span>
                      $
                      {parseFloat(calculatedAmount["promotionAmount"]).toFixed(
                        2
                      )}
                    </span>
                    <a
                      href="/"
                      onClick={this.removePromoFun.bind(this)}
                      className="cart_remove"
                    ></a>
                  </div>
                )}
                {parseFloat(calculatedAmount["orderGstAmount"]) > 0 && (
                  <div className="cart_row">
                    <p className="text-uppercase">
                      GST ({calculatedAmount["orderDisplayGst"]} %)
                    </p>
                    <span>
                      $
                      {parseFloat(calculatedAmount["orderGstAmount"]).toFixed(
                        2
                      )}
                    </span>
                  </div>
                )}

                {parseFloat(calculatedAmount["voucherDiscountAmount"]) > 0 && (
                  <div className="cart_row">
                    <p className="text-uppercase">Voucher Disocunt Amount</p>
                    <span>
                      $
                      {parseFloat(
                        calculatedAmount["voucherDiscountAmount"]
                      ).toFixed(2)}
                    </span>
                  </div>
                )}

                <div className="cart_row grant-total-cls">
                  <p className="text-uppercase">Total</p>
                  <span>
                    <sup>$</sup>
                    {calculatedAmount["grandTotalAmount"]}
                  </span>
                </div>
                {this.loadMinPercentage()}
                {cookie.load("defaultAvilablityId") === deliveryId &&
                  this.loadDeliveryPercentage()}

                {parseFloat(cartDetailsArr.cart_special_discount) > 0 && (
                  <div className="member-discount-total">
                    * {cartDetailsArr.cart_special_discount_type} $
                    {cartDetailsArr.cart_special_discount} Applied
                  </div>
                )}
              </div>
            </div>
          </div>
          {this.props.pageName === "header" && (
            <div className="cartaction_bottom">
              <Link
                to={"/checkout"}
                className="button btn_pink cartaction_checkout"
                title="Checkout Now"
              >
                Checkout Now
              </Link>
            </div>
          )}
        </div>
      );
    } else {
      if ($(".hcart_dropdown.open").length > 0) {
        this.closeCartlist();
      }
      return (
        <div className="hcart_dropdown">
          <div className="hcart_tt">
            <div
              id="cart-close-span"
              onClick={this.closeCartlist.bind(this)}
            ></div>
            <h3>YOUR ORDER DETAILS</h3>
          </div>
          <div className="hcart_scrollarea">
            <div className="cart_body">
              {cookie.load("defaultAvilablityId") === deliveryId ? (
                <div className="del_address">
                  <h5>Delivery Address</h5>
                  <div className="form-group">
                    <div className="input_field">
                      <input
                        type="text"
                        id="postal_code"
                        placeholder="Postal Code"
                        className="form-control"
                        readOnly={true}
                        defaultValue={cookie.load("orderPostalCode")}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="input_field">
                      <input
                        type="text"
                        placeholder="Address Line 1"
                        className="form-control"
                        readOnly={true}
                        defaultValue={cookie.load("orderDeliveryAddress")}
                      />
                    </div>
                  </div>
                  <div className="form-group half-fg">
                    <div className="input_field">
                      <input
                        type="text"
                        placeholder="Unit Number 1"
                        className="form-control"
                        name="unit_no1"
                        onChange={this.handleAddrChange.bind(this)}
                        value={this.state.unitnumber1}
                      />
                    </div>
                    <div className="input_field">
                      <input
                        type="text"
                        placeholder="Unit Number 2"
                        className="form-control"
                        name="unit_no2"
                        onChange={this.handleAddrChange.bind(this)}
                        value={this.state.unitnumber2}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="pickup-cart-div">
                  <div className="cart_row cart-header-first">
                    <div className="row-replace">
                      <div className="col-xs-12 cart_left text-center">
                        <h4>Pickup Location</h4>
                        <p>{cookie.load("orderOutletName")}</p>
                        <p>{cookie.load("orderHandledByText")}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="cartaction_bottom">
              <Link
                to={"/checkout"}
                className="button btn_pink cartaction_checkout"
                title="Checkout Now"
              >
                Checkout Now
              </Link>
            </div>
          </div>
        </div>
      );
    }
  }

  /* this  function used to load delivery percentage */
  loadDeliveryPercentage() {
    var freeDeliveryAmnt = 0;
    var DeliveryAmnt = 0;
    var remainAmnt = 0;
    var delPercentage = 0;

    var cartItemsArr = this.props.cartItems;

    if (Object.keys(cartItemsArr).length > 0) {
      var cartDetailsArr = this.props.cartDetails;
      var promoTionArr = getPromoCkValue();

      var globalSettings = Array();
      if (Object.keys(this.props.globalsettings).length > 0) {
        if (this.props.globalsettings[0].status === "ok") {
          globalSettings = this.props.globalsettings[0].result_set;
        }
      }

      var zoneDetails = this.props.zonedetails;
      var calculatedAmount = getCalculatedAmount(
        globalSettings,
        zoneDetails,
        cartDetailsArr,
        cartItemsArr,
        promoTionArr
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
                className="progress_bar progress_bar-free"
                style={{ width: delPercentage + "%" }}
              />
            </div>
            <p className="help-block">${remainAmnt} more to FREE delivery!</p>
          </div>
        </div>
      );
    }
  }

  /* this  function used to load delivery percentage */
  loadMinPercentage() {
    var minAmnt = 0;
    var remainAmnt = 0;
    var minPercentage = 0;

    var cartItemsArr = this.props.cartItems;

    if (Object.keys(cartItemsArr).length > 0) {
      var cartDetailsArr = this.props.cartDetails;
      var promoTionArr = getPromoCkValue();

      var globalSettings = Array();
      if (Object.keys(this.props.globalsettings).length > 0) {
        if (this.props.globalsettings[0].status === "ok") {
          globalSettings = this.props.globalsettings[0].result_set;
        }
      }

      var zoneDetails = this.props.zonedetails;
      var calculatedAmount = getCalculatedAmount(
        globalSettings,
        zoneDetails,
        cartDetailsArr,
        cartItemsArr,
        promoTionArr
      );

      minAmnt = parseFloat(calculatedAmount["zoneMinAmount"]);

      var subTotal = parseFloat(calculatedAmount["cartSubTotalAmount"]);
      var percentage = (subTotal * 100) / minAmnt;
      percentage = Math.round(percentage);
      minPercentage = percentage;
      remainAmnt = parseFloat(minAmnt - subTotal).toFixed(2);
    }

    if (remainAmnt > 0) {
      return (
        <div className="cart_itme_free">
          <div className="cart_row progress_bar_div">
            <div className="indication">
              <div className="indication_progress">
                <span
                  className="progress_bar"
                  style={{ width: minPercentage + "%" }}
                />
              </div>
              <p className="help-block">
                ${remainAmnt} more to Min order Amount!
              </p>
            </div>
          </div>
        </div>
      );
    }
  }

  cartItemList() {
    var cartItemsArr = this.props.cartItems;
    if (Object.keys(cartItemsArr).length > 0) {
     
      if(this.props.opencart!=="" && typeof this.props.opencart!==undefined && typeof this.props.opencart!=="undefined") {
        if(this.props.opencart==="Y") {
          var current_This = this;
          setTimeout(function () {
            current_This.props.prpSateValChange("opencart", "N");
            $("body").addClass("cart-items-open"); 
            $(".hcart_dropdown").addClass("open"); 
          }, 1000);
        }              
      }
    

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
              <h4>{stripslashes(product.cart_item_product_name)}
              {product.set_menu_component.length > 0 && (
            <a
              href="/"
              className="edit-cart-item"
              onClick={this.openEdit.bind(
                this,
                index,
                product.cart_item_product_id
              )}
            >
              <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
            </a>
          )}
              </h4>
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
                <p className="notes-block">
                  {stripslashes(product.cart_item_special_notes)}
                </p>
              )}

              {parseFloat(product.cart_item_promotion_discount) > 0 && (
                <span className="member-discount-desc">
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
                <span className="qty_minus"></span>
                <input type="text" value={product.cart_item_qty} readOnly />
                <span className="qty_plus"></span>
              </div>
            )}
          </div>
          <a
            href="/"
            onClick={this.deleteCartItm.bind(this, product)}
            className="cart_remove"
          >
            <img src={crossImg} />
          </a>
        </div>
      ));
    }
  }

  openEdit(cart_item_id, cart_item_product_id, e) {
    e.preventDefault();
    this.closeCartlist();
    this.props.prpStateCartChange(
      "cartedit",
      cart_item_id + "_" + cart_item_product_id
    );
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
          "<p>" + modName + ":</p> <p>" + modval + newModVlPrice + "</p> ";
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
            "<p>" +
            comboName +
            ": </p><p>" +
            comboVal +
            "  " +
            this.showComboModifiers(
              combo[i]["product_details"][0]["modifiers"]
            ) +
            "</p> ";
        } else {
          html +=
            "<p>" +
            comboName +
            ": </p><p>" +
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
    removePromoCkValue();
  }

  deleteCartItm(itemArr, event) {
    event.preventDefault();
    var cartItemId = itemArr.cart_item_id;
    showLoader("rowcartid-" + cartItemId, "Idtext");
    this.props.deleteCartDetail(cartItemId);
    removePromoCkValue();
  }

  clearCartItm(event) {
    event.preventDefault();
    showLoader("cart_body", "class");
    this.props.destroyCartDetail();
    removePromoCkValue();
  }

  render() {
    return (
      <>
        <li className="htico_cart">
          <Link to={"/"} className="hcartdd_trigger" title="">
            <img src={shoppingBag} alt="" />
            <span className="hcart_round">{this.props.cartTotalItmCount}</span>
          </Link>
          <input
            type="hidden"
            id="totalitmcount"
            value={this.props.cartTotalItmCount}
          />
        </li>

        <li>{this.cartDetailsList()}</li>
      </>
    );
  }
}

const mapStateTopProps = (state) => {
  var overAllcart = Array();
  var cartDetails = Array();
  var cartItems = Array();
  var updateCartResponse = Array();
  var cartTotalItmCount = 0;
  var cartStatus = "";

  if (Object.keys(state.updatecartdetail).length > 0) {
    if (state.updatecartdetail[0].status === "error") {
      updateCartResponse = state.updatecartdetail;
    }
  }

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
      cartTotalItmCount = resultSetArr.cart_details.cart_total_items;
      cartStatus = "success";
    } else {
      cartStatus = "failure";
    }
  }

  return {
    overAllcart: overAllcart,
    cartDetails: cartDetails,
    cartItems: cartItems,
    cartTotalItmCount: cartTotalItmCount,
    cartStatus: cartStatus,
    updateCartResponse: updateCartResponse,
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
  };
};
export default connect(mapStateTopProps, mapDispatchToProps)(CartSideBar);
