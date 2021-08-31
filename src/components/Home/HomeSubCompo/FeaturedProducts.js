/* eslint-disable */
import React, { Component } from "react";
import { connect } from "react-redux";
import Axios from "axios";
import cookie from "react-cookies";
import { appId, apiUrlV2, deliveryId } from "../../Helpers/Config";
import {
  getReferenceID,
  stripslashes,
  showPriceValue,
  showLoader,
  hideLoader,
  showCustomAlert,
  showAlert,
  removePromoCkValue,
} from "../../Helpers/SettingHelper";
import noimage from "../../../common/images/no-img-product.png";
var qs = require("qs");

import { GET_FEATUREPRO } from "../../../actions";

var Parser = require("html-react-parser");

class FeaturedProducts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
    };
  }

  componentWillMount() {
    this.props.getFeatureProList();
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
    var avilablityId = cookie.load("defaultAvilablityId");
    var orderOutletId = cookie.load("orderOutletId");
    if (
      avilablityId !== "" &&
      orderOutletId != undefined &&
      orderOutletId !== "" &&
      orderOutletId != undefined
    ) {
      var IndexFlg = productDetail.product_primary_id;

      if (actionFlg === "initial") {
        $("#proIndex-" + IndexFlg).addClass("active");
        $("#proIndex-" + IndexFlg)
          .find(".smiple_product_lk")
          .hide();
        $("#proIndex-" + IndexFlg)
          .find(".addcart_done_maindiv")
          .show();
      } else {
        showLoader("proIndex-" + IndexFlg, "Idtext");
        var availabilityId = cookie.load("defaultAvilablityId");
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
            showCustomAlert(
              "success",
              "Great choice! Item added to your cart."
            );
            removePromoCkValue();
            this.handleShowAlertFun(
              "success",
              "Great choice! Item added to your cart."
            );
            return false;
          } else if (res.data.status === "error") {
            var errMsgtxt =
              res.data.message !== ""
                ? res.data.message
                : "Sorry! Products can`t add your cart.";
            showCustomAlert("error", errMsgtxt);
          }
        });
      }
    } else {
      cookie.save("popuptriggerFrom", "FeaturedPro", { path: "/" });
      $.magnificPopup.open({
        items: {
          src: ".order_popup",
        },
        type: "inline",
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
    var avilablityId = cookie.load("defaultAvilablityId");
    var orderOutletId = cookie.load("orderOutletId");
    if (
      avilablityId !== "" &&
      orderOutletId != undefined &&
      orderOutletId !== "" &&
      orderOutletId != undefined
    ) {
      var productSlug = productDetail.product_slug;
      if (productSlug !== "") {
        $("#proIndex-" + productDetail.product_primary_id).addClass("active");
        this.props.sateValChange("view_pro_data", productSlug);
      }
    } else {
      cookie.save("popuptriggerFrom", "FeaturedPro", { path: "/" });
      $.magnificPopup.open({
        items: {
          src: ".order_popup",
        },
        type: "inline",
      });
    }
    return false;
  }

  render() {
    let featureproArr = this.props.featureproduct;
    let featureprolist = [];
    let featureproimagesource = "";
    let tagimagesource = "";

    if (Object.keys(featureproArr).length > 0) {
      if (featureproArr[0].status === "ok") {
        featureprolist = featureproArr[0].result_set;
        featureproimagesource = featureproArr[0].common.image_source;
        tagimagesource = featureproArr[0].common.tag_image_source;
      }
    }

    return (
      <section className="featuredpro-section">
        {Object.keys(featureprolist).length > 0 ? (
          <div className="featured-products-section">
            <div className="container">
              <h2>Featured Products</h2>
              <div className="featured-products-main">
                <ul className="products-list-ulmain">
                  {featureprolist.map((featurepro, index) => {
                    var prodivId = "proIndex-" + featurepro.product_primary_id;
                    var comboProId = "comboPro-" + featurepro.product_slug;
                    return (
                      <li
                        className="products-single-li"
                        id={prodivId}
                        key={index}
                      >
                        <div className="products-image-div">
                          {featurepro.product_thumbnail !== "" ? (
                            <img
                              src={
                                featureproimagesource +
                                "/" +
                                featurepro.product_thumbnail
                              }
                            />
                          ) : (
                            <img src={noimage} />
                          )}
                        </div>

                        <div className="product-info-div">
                          <div className="product-title-maindiv">
                            <div className="product-title">
                              <h3>{stripslashes(featurepro.product_name)}</h3>
                            </div>
                            {Object.keys(featurepro.product_tag).length > 0 ? (
                              <div className="product-tag-list">
                                <ul>
                                  {featurepro.product_tag.map(
                                    (producttag, index1) => {
                                      return (
                                        <li key={index1}>
                                          {producttag.pro_tag_name !== "" ? (
                                           producttag.pro_tag_name  
                                          ) : (
                                            ""
                                          )}
                                        </li>
                                      );
                                    }
                                  )}
                                </ul>
                              </div>
                            ) : (
                              ""
                            )}
                          </div>

                          <div className="product-short-description">
                            <p>
                              {featurepro.product_short_description != ""
                                ? Parser(
                                    stripslashes(
                                      featurepro.product_short_description
                                    )
                                  )
                                : Parser("&nbsp;")}
                            </p>
                          </div>

                          <div className="product-price">
                            <h3>{showPriceValue(featurepro.product_price)}</h3>
                          </div>

                          <div className="products-ordernow-action">
                            <div className="addcart_row addcart_done_maindiv">
                              <div className="qty_bx">
                                <span
                                  className="qty_minus"
                                  onClick={this.proQtyAction.bind(
                                    this,
                                    featurepro.product_primary_id,
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
                                    featurepro.product_primary_id,
                                    "incr"
                                  )}
                                >
                                  +
                                </span>
                              </div>
                              <button
                                className="button btn_black order_done"
                                onClick={this.addToCartSimple.bind(
                                  this,
                                  featurepro,
                                  "done"
                                )}
                              >
                                Done
                              </button>
                            </div>

                            {featurepro.product_stock > 0 ||
                            featurepro.product_stock === null ? (
                              featurepro.product_type === "1" ? (
                                <a
                                  className="button order_nowdiv smiple_product_lk disbl_href_action"
                                  href="/"
                                  onClick={this.addToCartSimple.bind(
                                    this,
                                    featurepro,
                                    "initial"
                                  )}
                                >
                                  Order Now
                                </a>
                              ) : (
                                <a
                                  href="/"
                                  onClick={this.viewProDetail.bind(
                                    this,
                                    featurepro
                                  )}
                                  title="Product Details"
                                  id={comboProId}
                                  className="button order_nowdiv compo_product_lk"
                                >
                                  Order Now
                                </a>
                              )
                            ) : (
                              <a
                                className="button disabled disbl_href_action"
                                href="/"
                              >
                                Sold Out
                              </a>
                            )}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </section>
    );
  }
}

const mapStateTopProps = (state) => {
  return {
    featureproduct: state.featureproduct,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getFeatureProList: () => {
      dispatch({ type: GET_FEATUREPRO });
    },
  };
};

export default connect(mapStateTopProps, mapDispatchToProps)(FeaturedProducts);
