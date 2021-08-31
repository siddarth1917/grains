/* eslint-disable */
import React, { Component } from "react";
import { Link } from "react-router-dom";
import Axios from "axios";
import cookie from "react-cookies";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { connect } from "react-redux";
import {
  appId,
  apiUrl,
  apiUrlV2,
  deliveryId,
  timThumpUrl,
} from "../Helpers/Config";
import {
  getReferenceID,
  stripslashes,
  showPriceValue,
  callImage,
  showLoader,
  hideLoader,
  showCustomAlert,
  showCartLst,
  showAlert,
  removePromoCkValue,
} from "../Helpers/SettingHelper";
import noimage from "../../common/images/no-img-product.png";
import smartPhone from "../../common/images/smart-phone.png";
import proVouchar from "../../common/images/pro-vouchar.png";
import cashVouchar from "../../common/images/cash-vouchar.png";
import { GET_PRODUCT_LIST } from "../../actions";
var Parser = require("html-react-parser");
var qs = require("qs");

class ProductList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedNavigation: "",
      selectedslugType: "",
      productSubcatlist: [],
      productCommon: [],
      productDetails: [],
      filter_Tag: [],
      voucherProductDetail: [],
      voucher_product_qty: "",
      voucher_name: "",
      voucher_mobile: "",
      voucher_email: "",
      voucher_message: "",
      error_voucher_name: "",
      error_voucher_email: "",
      error_voucher_message: "",
      error_voucher_mobile: "",
      voucherIndexFlag: "",
    };
  }

  componentWillReceiveProps(nextProps) {
    let selectedNavigation = nextProps.productState.selectedNavigation;
    let slugType = nextProps.productState.catslugType;
    if (selectedNavigation !== this.state.selectedNavigation) {
      showLoader("productlist-main-div", "class");
      setTimeout(function () {
        $(window).scrollTo($(".common-inner-banner"), 100);
      }, 500);
      if (selectedNavigation !== "") {
        var catSlug = selectedNavigation;
        var subcatSlug = "";
        if (slugType === "subcategory") {
          catSlug = "";
          subcatSlug = selectedNavigation;
        }
        this.props.getProductList(catSlug, subcatSlug, "");
        $(".addcart_done_maindiv").hide();
        $(".smiple_product_lk").show();
      }
      this.setState({
        selectedNavigation: selectedNavigation,
        selectedslugType: slugType,
      });
    }
    if (nextProps.productState.setFiltetTag === "Yes") {
      this.setState(
        { filter_Tag: nextProps.productState.filterTag },
        function () {
          this.productsubcatlist();
          this.props.sateValChange("setFiltetTag", "No");
        }
      );
    }

    if (this.state.productSubcatlist !== nextProps.productSubcatlist) {
      this.setState(
        { productSubcatlist: nextProps.productSubcatlist },
        function () {
          this.productsubcatlist();
        }
      );
    }
  }

  productsubcatlist() {
    var subcatlistArr = this.props.productSubcatlist;
    if (Object.keys(subcatlistArr).length > 0) {
      hideLoader("productlist-main-div", "class");
      const productDetails = subcatlistArr.map((categories, categoryIndex) => {
        if (categories.products.length > 0) {
          return (
            <div className="innerproduct" key={categoryIndex}>
              <h3 id={categories.pro_subcate_slug}>
                {stripslashes(categories.pro_subcate_name)}
              </h3>
              <p>
                {categories.pro_subcate_description !== ""
                  ? stripslashes(categories.pro_subcate_description)
                  : ""}
              </p>
              <ul className="products-list-ulmain">
                {this.productList(
                  categories.products,
                  categories.products.length
                )}
              </ul>
            </div>
          );
        }
      });
      this.setState({ productDetails: productDetails });
      return productDetails;
    } else {
      return "";
    }
  }

  chkProStockCls(proSlug, Stock) {
    var searchProVal = this.props.productState.searchProVal;
    var actClstxt = searchProVal === proSlug ? " active" : "";

    var returnText =
      "products-single-li no-stock-product " + proSlug + actClstxt;
    if (Stock > 0) {
      returnText = "products-single-li " + proSlug + actClstxt;
    }

    return returnText;
  }

  /* Products List */
  productList(list, productcount) {
    var imageSource = this.props.productCommon.product_image_source;
    var tagImageSource = this.props.productCommon.tag_image_source;
    var slugType = this.state.selectedslugType;
    var naviSlug = this.state.selectedNavigation;
    const listProduct = list.map((productDetail, index) => {
      var description =
        productDetail.product_short_description !== null &&
        productDetail.product_short_description !== ""
          ? Parser(stripslashes(productDetail.product_short_description))
          : "";

      var prodivId = "proIndex-" + productDetail.product_primary_id;
      var comboProId = "comboPro-" + productDetail.product_slug;
      let filter = this.checkFilterTag(productDetail.product_tag);
      if (filter === 1) {
        return (
          <li
            className={
              this.chkProStockCls(
                productDetail.product_slug,
                productDetail.product_stock
              ) +
              (productDetail.product_type === "5"
                ? " voucher-product-box "
                : " ")
            }
            id={prodivId}
            key={index}
          >
            <div className="products-image-div">
              {productDetail.product_thumbnail !== "" ? (
                <img
                  src={imageSource + "/" + productDetail.product_thumbnail}
                />
              ) : productDetail.product_type !== "5" ? (
                <img src={noimage} />
              ) : productDetail.product_voucher === "f" ? (
                <img src={proVouchar} />
              ) : (
                <img src={cashVouchar} />
              )}
            </div>

            <div className="product-info-div">
              <div className="product-title-maindiv">
                <div className="product-title">
                  <h5>
                    {productDetail.product_alias !== ""
                      ? stripslashes(productDetail.product_alias)
                      : stripslashes(productDetail.product_name)}
                  </h5>
                </div>
                <div className="product-tag-list">
                  {Object.keys(productDetail.product_tag).length > 0 ? (
                    <ul>
                      {productDetail.product_tag.map((producttag, index1) => {
                        return (
                          <li key={index1}>
                            {stripslashes(producttag.pro_tag_name)}
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    ""
                  )}
                </div>
              </div>

              <div className="product-short-description">
                <p>{description !== "" ? description : Parser("&nbsp;")}</p>
              </div>

              <div className="product-price">
                <h3>{Parser(showPriceValue(productDetail.product_price))}</h3>
              </div>

              <div className="products-ordernow-action">
                {productDetail.product_stock > 0 ||
                productDetail.product_stock === null ? (
                  productDetail.product_type === "1" ||
                  productDetail.product_type === "5" ? (
                    <a
                      className="button order_nowdiv smiple_product_lk disbl_href_action"
                      href="/"
                      onClick={this.addToCartSimple.bind(
                        this,
                        productDetail,
                        "initial"
                      )}
                    >
                      Add to Cart
                    </a>
                  ) : (
                    <a
                      href="/"
                      onClick={this.viewProDetail.bind(this, productDetail)}
                      title="Product Details"
                      id={comboProId}
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
                  <div className="addcart-row-child">
                    <div className="qty_bx">
                      <span
                        className="qty_minus"
                        onClick={this.proQtyAction.bind(
                          this,
                          productDetail.product_primary_id,
                          "decr",
                          productDetail.product_minimum_quantity
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
                          productDetail.product_primary_id,
                          "incr",
                          productDetail.product_maximum_quantity
                        )}
                      >
                        +
                      </span>
                    </div>
                    <button
                      className="button btn_black"
                      onClick={this.addToCartSimple.bind(
                        this,
                        productDetail,
                        "done"
                      )}
                    >
                      Done
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </li>
        );
      }
    });

    return listProduct;
  }

  checkFilterTag(productFilter) {
    var current = this;
    if (
      this.state.filter_Tag !== "" &&
      typeof this.state.filter_Tag !== undefined &&
      typeof this.state.filter_Tag !== "undefined" &&
      this.state.filter_Tag.length > 0
    ) {
      if (Object.keys(productFilter).length > 0) {
        let tagAvil = 0;
        productFilter.map(function (item) {
          if (current.state.filter_Tag.indexOf(item.tag_id) >= 0) {
            tagAvil++;
          }
        });
        if (tagAvil > 0) {
          return 1;
        } else {
          return 0;
        }
      }
    } else {
      return 1;
    }
  }

  proQtyAction(indxFlg, actionFlg, minmaxqty) {
    var proqtyInput = $("#proIndex-" + indxFlg)
      .find(".proqty_input")
      .val();
    proqtyInput = parseInt(proqtyInput);
    if (actionFlg === "decr") {
      proqtyInput = proqtyInput > 1 ? proqtyInput - 1 : proqtyInput;
    } else {
      proqtyInput = proqtyInput + 1;
    }
    /* if (actionFlg === "incr") {
      if (proqtyInput > 0) {
        if (proqtyInput > minmaxqty) {
          return false;
        }
      }
    } */
    $("#proIndex-" + indxFlg)
      .find(".proqty_input")
      .val(proqtyInput);
  }

  /* add to cart */
  addToCartSimple(productDetail, actionFlg, event) {
    event.preventDefault();

    if (productDetail.product_type === "5") {
      var IndexFlg = productDetail.product_primary_id;
      var proqtyQty = $("#proIndex-" + IndexFlg)
        .find(".proqty_input")
        .val();

      $.magnificPopup.open({
        items: {
          src: "#vouchergift-popup",
        },
        type: "inline",
      });

      this.setState({
        voucherProductDetail: productDetail,
        voucher_product_qty: proqtyQty,
        voucherIndexFlag: IndexFlg,
      });
    } else {
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

        Axios.post(
          apiUrlV2 + "cart/simpleCartInsert",
          qs.stringify(postObject)
        ).then((res) => {
          $("#proIndex-" + IndexFlg).removeClass("active");
          hideLoader("proIndex-" + IndexFlg, "Idtext");
          $("#proIndex-" + IndexFlg)
            .find(".addcart_done_maindiv")
            .hide();
          $("#proIndex-" + IndexFlg)
            .find(".smiple_product_lk")
            .show();
          if (res.data.status === "ok") {
            this.props.sateValChange("cartflg", "yes");
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
  }

  addToCartVoucherMe() {
    var availabilityId = cookie.load("defaultAvilablityId");
    /*var availabilityId = deliveryId;*/
    var availabilityName =
      availabilityId === deliveryId ? "Delivery" : "Pickup";
    var isAddonProduct = "No";
    var customerId =
      typeof cookie.load("UserId") === "undefined" ? "" : cookie.load("UserId");

    var TotalPrice =
      this.state.voucherProductDetail.product_price *
      this.state.voucher_product_qty;
    var postObject = {};
    postObject = {
      app_id: appId,
      product_id: this.state.voucherProductDetail.product_id,
      product_qty: this.state.voucher_product_qty,
      product_name: this.state.voucherProductDetail.product_name,
      product_sku: this.state.voucherProductDetail.product_sku,
      product_total_price: TotalPrice,
      product_unit_price: this.state.voucherProductDetail.product_price,
      product_type: 5,
      availability_id: availabilityId,
      availability_name: availabilityName,
      isAddonProduct: isAddonProduct,
      reference_id: customerId === "" ? getReferenceID() : "",
      customer_id: customerId,
      voucher_gift_name:
        typeof cookie.load("UserFname") === "undefined"
          ? ""
          : cookie.load("UserFname"),
      voucher_gift_mobile:
        typeof cookie.load("UserMobile") === "undefined"
          ? ""
          : cookie.load("UserMobile"),
      voucher_gift_email:
        typeof cookie.load("UserEmail") === "undefined"
          ? ""
          : cookie.load("UserEmail"),
      voucher_gift_message: "",
      product_voucher_expiry_date:
        this.state.voucherProductDetail.product_voucher_expiry_date !== ""
          ? this.state.voucherProductDetail.product_voucher_expiry_date
          : "",
    };

    Axios.post(apiUrl + "cart/insert", qs.stringify(postObject)).then((res) => {
      $("#proIndex-" + this.state.voucherIndexFlag).removeClass("active");
      hideLoader("proIndex-" + this.state.voucherIndexFlag, "Idtext");
      $("#proIndex-" + this.state.voucherIndexFlag)
        .find(".addcart_done_maindiv")
        .hide();
      $("#proIndex-" + this.state.voucherIndexFlag)
        .find(".smiple_product_lk")
        .show();
      if (res.data.status === "ok") {
        this.props.sateValChange("cartflg", "yes");
        removePromoCkValue();
        showCustomAlert("success", "Great choice! Item added to your cart.");
        /*showCartLst();*/
        this.handleShowAlertFun(
          "success",
          "Great choice! Item added to your cart."
        );
        this.setState({
          voucherProductDetail: "",
          voucher_product_qty: "",
        });
      } else if (res.data.status === "error") {
        var errMsgtxt =
          res.data.message !== ""
            ? res.data.message
            : "Sorry! Products can`t add your cart.";
        showCustomAlert("error", errMsgtxt);
        this.handleShowAlertFun("Error", errMsgtxt);
        this.setState({
          voucherProductDetail: "",
          voucher_product_qty: "",
          voucherIndexFlag: "",
        });
      }

      return false;
    });
  }

  addToCartVoucher() {
    var error = 0;
    if (this.state.voucher_name === null || this.state.voucher_name === "") {
      error++;
      this.setState({
        error_voucher_name: Parser(
          '<span class="error">This field is required.</span>'
        ),
      });
    } else {
      this.setState({ error_voucher_name: "" });
    }

    if (
      this.state.voucher_mobile === null ||
      this.state.voucher_mobile === ""
    ) {
      error++;
      this.setState({
        error_voucher_mobile: Parser(
          '<span class="error">This field is required.</span>'
        ),
      });
    } else {
      this.setState({ error_voucher_mobile: "" });
    }

    if (this.state.voucher_email === null || this.state.voucher_email === "") {
      error++;
      this.setState({
        error_voucher_email: Parser(
          '<span class="error">This field is required.</span>'
        ),
      });
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(
        this.state.voucher_email
      )
    ) {
      error++;
      this.setState({
        error_voucher_email: Parser(
          '<span class="error">This is not a valid email.</span>'
        ),
      });
    } else {
      this.setState({ error_voucher_email: "" });
    }

    if (
      this.state.voucher_message === null ||
      this.state.voucher_message === ""
    ) {
      error++;
      this.setState({
        error_voucher_message: Parser(
          '<span class="error">This field is required.</span>'
        ),
      });
    } else {
      this.setState({ error_voucher_message: "" });
    }

    if (error == 0) {
      var availabilityId = cookie.load("defaultAvilablityId");
      /*var availabilityId = deliveryId;*/
      var availabilityName =
        availabilityId === deliveryId ? "Delivery" : "Pickup";
      var isAddonProduct = "No";
      var customerId =
        typeof cookie.load("UserId") === "undefined"
          ? ""
          : cookie.load("UserId");

      var TotalPrice =
        this.state.voucherProductDetail.product_price *
        this.state.voucher_product_qty;

      var ImagePath = this.state.voucherProductDetail.product_thumbnail;
      if (ImagePath !== "") {
        var postImagePath =
          this.state.productimagePath +
          this.state.voucherProductDetail.product_thumbnail;
      } else {
        postImagePath = "";
      }

      var postObject = {};
      postObject = {
        app_id: appId,
        product_id: this.state.voucherProductDetail.product_id,
        product_qty: this.state.voucher_product_qty,
        product_name: this.state.voucherProductDetail.product_name,
        product_sku: this.state.voucherProductDetail.product_sku,
        product_total_price: TotalPrice,
        product_unit_price: this.state.voucherProductDetail.product_price,
        product_image: postImagePath,
        product_type: 5,
        availability_id: availabilityId,
        availability_name: availabilityName,
        isAddonProduct: isAddonProduct,
        reference_id: customerId === "" ? getReferenceID() : "",
        customer_id: customerId,
        voucher_gift_name:
          this.state.voucher_name !== ""
            ? this.state.voucher_name
            : cookie.load("UserFname"),
        voucher_gift_mobile:
          this.state.voucher_mobile !== "" ? this.state.voucher_mobile : "",
        voucher_gift_email:
          this.state.voucher_email !== ""
            ? this.state.voucher_email
            : cookie.load("UserEmail"),
        voucher_gift_message:
          this.state.voucher_message !== "" ? this.state.voucher_message : "",
        product_voucher_expiry_date:
          this.state.voucherProductDetail.product_voucher_expiry_date !== ""
            ? this.state.voucherProductDetail.product_voucher_expiry_date
            : "",
      };

      Axios.post(apiUrl + "cart/insert", qs.stringify(postObject)).then(
        (res) => {
          $("#proIndex-" + this.state.voucherIndexFlag).removeClass("active");
          hideLoader("proIndex-" + this.state.voucherIndexFlag, "Idtext");
          $("#proIndex-" + this.state.voucherIndexFlag)
            .find(".addcart_done_maindiv")
            .hide();
          $("#proIndex-" + this.state.voucherIndexFlag)
            .find(".smiple_product_lk")
            .show();
          if (res.data.status === "ok") {
            this.props.sateValChange("cartflg", "yes");
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
            this.setState({
              voucherProductDetail: "",
              voucher_product_qty: "",
              voucher_name: "",
              voucher_mobile: "",
              voucher_email: "",
              voucher_message: "",
            });
          } else if (res.data.status === "error") {
            var errMsgtxt =
              res.data.message !== ""
                ? res.data.message
                : "Sorry! Products can`t add your cart.";
            showCustomAlert("error", errMsgtxt);
            this.handleShowAlertFun("Error", errMsgtxt);
            this.setState({
              voucherProductDetail: "",
              voucher_product_qty: "",
              voucherIndexFlag: "",
            });
          }

          return false;
        }
      );
    }
  }

  viewProDetail(productDetail, event) {
    event.preventDefault();
    var productSlug = productDetail.product_slug;
    if (productSlug !== "") {
      $("#proIndex-" + productDetail.product_primary_id).addClass("active");
      this.props.sateValChange("view_pro_data", productSlug);
    }
    return false;
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

  handleChangeTxt = (item, event) => {
    this.setState({ [item]: event.target.value });
    this.setState({ ["error_" + item]: "" });
  };

  render() {
    return (
      <div className="productlist-main-div">
        <div className="innerproduct_row">{this.state.productDetails}</div>

        <div
          id="vouchergift-popup"
          className="mfp-hide popup_sec vouchergift-popup"
        >
          <div className="pop-whole full-login-new">
            <div className="full-login-new-header">
              <h3>IM PURCHASING THIS</h3>
            </div>
            <div className="full-login-new-body">
              <div className="popup-footer voucher-popup-body">
                <Tabs>
                  <TabList>
                    <Tab>For Gift</Tab>
                    <Tab>For Me</Tab>
                  </TabList>

                  <TabPanel>
                    <div className="voucher-popup-inner">
                      <h2>GIFT RECEIVER'S INFORMATION</h2>
                      <div className="form-group">
                        <div className="focus-out">
                          <label>Name</label>
                          <input
                            type="text"
                            id="guest-name"
                            name="guest-name"
                            value={this.state.voucher_name}
                            onChange={this.handleChangeTxt.bind(
                              this,
                              "voucher_name"
                            )}
                            className="form-control input-focus"
                          />
                          {this.state.error_voucher_name}
                        </div>
                      </div>
                      <div className="form-group">
                        <div className="focus-out">
                          <label>Enter Mobile Number</label>
                          <input
                            type="tel"
                            id="guest-number"
                            name="guest-number"
                            value={this.state.voucher_mobile}
                            onChange={this.handleChangeTxt.bind(
                              this,
                              "voucher_mobile"
                            )}
                            className="form-control input-focus"
                          />
                          {this.state.error_voucher_mobile}
                        </div>
                      </div>
                      <div className="form-group">
                        <div className="focus-out">
                          <label>Email Address</label>
                          <input
                            type="text"
                            id="guest-email"
                            name="guest-email"
                            value={this.state.voucher_email}
                            onChange={this.handleChangeTxt.bind(
                              this,
                              "voucher_email"
                            )}
                            className="form-control input-focus"
                          />
                          {this.state.error_voucher_email}
                        </div>
                      </div>
                      <div className="form-group">
                        <div className="focus-out">
                          <label>Message</label>
                          <textarea
                            type="text"
                            id="guest-message"
                            name="guest-message"
                            value={this.state.voucher_message}
                            onChange={this.handleChangeTxt.bind(
                              this,
                              "voucher_message"
                            )}
                            className="form-control input-focus"
                          />
                          {this.state.error_voucher_message}
                        </div>
                      </div>

                      <div className="howtouse-gift-vouchar">
                        <img src={smartPhone} />
                        <h3>How to use</h3>
                        <p>
                          After purchase your recipient can get email
                          notificationand they can use above email address to
                          sign up. Vouchers will be available within their my
                          account{" "}
                        </p>
                      </div>
                      <div className="form-group gift-group">
                        <button
                          type="button"
                          className="button"
                          onClick={this.addToCartVoucher.bind(this)}
                        >
                          Add To Cart
                        </button>
                      </div>
                    </div>
                  </TabPanel>

                  <TabPanel>
                    <div className="voucher-popup-inner">
                      <div className="howtouse-gift-vouchar">
                        <img src={smartPhone} />
                        <h3>How to use</h3>
                        <p>
                          After purchase your can get an email notification and
                          voucher will be available within your account
                        </p>
                      </div>

                      <button
                        type="button"
                        className="button"
                        onClick={this.addToCartVoucherMe.bind(this)}
                      >
                        Add To Cart
                      </button>
                    </div>
                  </TabPanel>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateTopProps = (state) => {
  var tempArr = Array();
  var productSubcat = Array();
  var productCmn = Array();
  if (Object.keys(state.product).length > 0) {
    var tempArr = !("productlist" in state.product[0])
      ? Array()
      : state.product[0].productlist;
    if (Object.keys(tempArr).length > 0) {
      if (tempArr[0].status === "ok") {
        productSubcat = tempArr[0].result_set[0].subcategorie;
        productCmn = tempArr[0].common;
      }
    }
  }

  return {
    productSubcatlist: productSubcat,
    productCommon: productCmn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getProductList: (catslug, subcatslug, outletid) => {
      dispatch({ type: GET_PRODUCT_LIST, catslug, subcatslug, outletid });
    },
  };
};

export default connect(mapStateTopProps, mapDispatchToProps)(ProductList);
