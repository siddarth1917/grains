/* eslint-disable */
import React, { Component } from "react";
import Axios from "axios";
import cookie from "react-cookies";
import { connect } from "react-redux";
import { appId, apiUrl, apiUrlV2, deliveryId } from "../Helpers/Config";
import {
  getReferenceID,
  stripslashes,
  showLoader,
  hideLoader,
  showCustomAlert,
  showAlert,
  removePromoCkValue,
} from "../Helpers/SettingHelper";
import noimage from "../../common/images/no-img-product.png";

import { GET_PRODUCT_DETAIL } from "../../actions";
var Parser = require("html-react-parser");
var qs = require("qs");

class ProductDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedProSlug: "",
      editProductID: "",
      navigateMenu: [],
      navigateMenuTmp: [],
      selectedCategoryName: "",
      selectedSlugType: "",
      selectedSlugValue: "",
      catNavIndex: 0,
      productdetailstatus: "",
      productdetail: [],
      productcommon: [],
      selectedProId: "",
      remaining: 30,
      product_remarks: "",
      mdfinput_value: 1,
      mdfApi_call: "Yes",
      modParentProductId: "",
      modProductPrice: "",
      modProductTotalPrice: "",
      compoinput_value: 1,
      incrCompoPrice: 0,
      compoApi_call: "Yes",
      cartTriggerFlg: "No",
      cartItem: "",
    };
  }

  componentWillReceiveProps(nxtProps) {
    if (
      nxtProps.productState.viewProductSlug !== this.state.selectedProSlug &&
      nxtProps.productState.viewProductSlug !== "" &&
      nxtProps.productState.viewProductSlug !== 0
    ) {
      showLoader("prodetailinner-main-div", "class");
      this.setState(
        { selectedProSlug: nxtProps.productState.viewProductSlug },
        function () {
          this.props.getProductDetail(
            nxtProps.productState.viewProductSlug,
            "product_slug"
          );
        }.bind(this)
      );
    }
    if (
      nxtProps.productState.editProductID !== this.state.editProductID &&
      nxtProps.productState.editProductID !== "" &&
      nxtProps.productState.editProductID !== 0 &&
      nxtProps.productState.editProductID !== undefined
    ) {
      showLoader("prodetailinner-main-div", "class");
      this.setState(
        {
          editProductID: nxtProps.productState.editProductID,
          cartItem:
            nxtProps.productState.cartItem[nxtProps.productState.editItemID],
        },
        function () {
          var cart_Item =
            nxtProps.productState.cartItem[nxtProps.productState.editItemID];
          if (
            cart_Item !== "" &&
            typeof cart_Item !== undefined &&
            typeof cart_Item !== "undefined"
          ) {
            this.setState({ compoinput_value: cart_Item.cart_item_qty });
          }
          this.props.getProductDetail(
            nxtProps.productState.editProductID,
            "product_id"
          );
        }.bind(this)
      );
    }
  }

  showProductTags(tags) {
    return tags.map((item, index) => (
      <li key={index}>{stripslashes(item.pro_tag_name)}</li>
    ));
  }

  productDetailsMain() {
    var proDetStatus = this.props.productdetailstatus;
    var proDetails = this.props.productdetail;

    if (Object.keys(proDetails).length > 0 && proDetStatus === "success") {
      var imageSource = this.props.productcommon.image_source;
      var product_gallery_image_source =
        this.props.productcommon.product_gallery_image_source;

      if (
        this.props.productState.viewProductSlug ===
          proDetails[0].product_slug ||
        proDetails[0].product_id === this.props.productState.editProductID
      ) {
        hideLoader("prodetailinner-main-div", "class");
      }
      setTimeout(function () {
        $("#proIndex-" + proDetails[0].product_primary_id).removeClass(
          "active"
        );
        hideLoader("comboPro-" + proDetails[0].product_slug, "Idtext");
      }, 500);

      var desc = "";

      return proDetails.map((data, index) => {
        desc =
          data.product_long_description !== "" &&
          data.product_long_description !== null
            ? stripslashes(data.product_long_description)
            : "";

        var comboLgth = data.set_menu_component
          ? data.set_menu_component.length
          : 0;
        var ModifLgth = data.modifiers ? data.modifiers.length : 0;
        var isCombo = data.product_type === "2" && comboLgth > 0 ? "Yes" : "No";
        var isModifier =
          data.product_type === "4" && ModifLgth > 0 ? "Yes" : "No";
        var isSimple =
          data.product_type === "1" && comboLgth === 0 && ModifLgth === 0
            ? "Yes"
            : "No";

        return (
          <div key={index}>
            <div
              className="inn-product-popup"
              key={data.product_primary_id}
              id={"product_" + data.product_primary_id}
            >
              {/* prodet_bansec div - start */}
              <div className="prodet_bansec">
                {/* product image div - start */}
                <div className="inn-product-img-bg prodet_top">
                  {data.image_gallery.length > 0 ? (
                    <img
                      src={
                        product_gallery_image_source +
                        "/" +
                        data.image_gallery[0].pro_gallery_image
                      }
                    />
                  ) : data.product_thumbnail !== "" ? (
                    <img src={imageSource + "/" + data.product_thumbnail} />
                  ) : (
                    <img src={noimage} />
                  )}
                </div>
                {/* product image div - end */}

                {/* product info div - start */}
                <div className="prodet_baninfo">
                  <div className="inn_product_hea">
                    <div className="inn_product_review">
                      <div className="inn_product_hea_left">
                        <h3>
                          {" "}
                          {data.product_alias !== ""
                            ? stripslashes(data.product_alias)
                            : stripslashes(data.product_name)}{" "}
                        </h3>
                      </div>
                    </div>

                    {data.product_tag.length > 0 && (
                      <div className="product-tags-list">
                        <ul>{this.showProductTags(data.product_tag)}</ul>
                      </div>
                    )}

                    {desc !== "" ? Parser(desc) : ""}
                  </div>
                </div>
                {/* product info div - end */}
              </div>
              {/* prodet_bansec div - end */}

              {/* combo or modifier top div - start */}
              <div className="inn_product_row">
                {isCombo === "Yes" ? this.comboProDetails(data) : ""}
                {isModifier === "Yes" ? this.modifierProDetails(data) : ""}
                {isSimple === "Yes" ? this.simpleProDetails(data) : ""}
              </div>
              {/* combo or modifier top div - end */}
            </div>
          </div>
        );
      });
    } else if (
      Object.keys(proDetails).length === 0 &&
      proDetStatus === "failure"
    ) {
      return (
        <div className="product-detail-empty">
          Sorry, Invalid Product Detail.{" "}
        </div>
      );
    } else {
      return "";
    }
  }

  /* show modifier product details */
  simpleProDetails(proDetailArr) {
    var modProductPrice = proDetailArr.product_price;
    var modProductTotalPrice = proDetailArr.product_price;
    return (
      <div>
        <div className="prd_chosen_sub_row">
          <p>
            <sup>$</sup>
            <span id="id_price_final">{modProductTotalPrice}</span>
          </p>
          <div
            id={"proDtIndex-" + proDetailArr.product_primary_id}
            className="prd_chosen_sub_col popup_addcart_cls modfir_addcart_cls"
          >
            <div
              className="addcart_row prd_chosen_sub_item_left cart_update_div addcart_done_maindiv"
              style={{ display: "none" }}
            >
              <div className="qty_bx">
                <span
                  className="qty_minus"
                  onClick={this.proQtyAction.bind(
                    this,
                    proDetailArr.product_primary_id,
                    "decr"
                  )}
                >
                  -
                </span>
                <input
                  type="text"
                  value="1"
                  className="proqty_input"
                  readOnly="1"
                />
                <span
                  className="qty_plus"
                  onClick={this.proQtyAction.bind(
                    this,
                    proDetailArr.product_primary_id,
                    "incr"
                  )}
                >
                  +
                </span>
              </div>
            </div>

            <div
              className="prd_chosen_sub_item_right cart_update_div addcart_done_maindiv"
              style={{ display: "none" }}
            >
              <button
                onClick={this.addToCartSimple.bind(this, proDetailArr, "done")}
              >
                Done
              </button>
            </div>

            <div className="prd_chosen_sub_item_right prd_chosen_item_full cart_add_div smiple_product_lk">
              <button
                onClick={this.addToCartSimple.bind(
                  this,
                  proDetailArr,
                  "initial"
                )}
              >
                Add To Cart
              </button>
            </div>

            <div className="cart-success-msg alert alert_success mdfcart_success_msg"></div>
            <div className="cart-error-msg alert alert_danger mdfcart_error_msg"></div>
          </div>
        </div>
      </div>
    );
  }

  proQtyAction(indxFlg, actionFlg) {
    var proqtyInput = $("#proDtIndex-" + indxFlg)
      .find(".proqty_input")
      .val();
    proqtyInput = parseInt(proqtyInput);
    if (actionFlg === "decr") {
      proqtyInput = proqtyInput > 1 ? proqtyInput - 1 : proqtyInput;
    } else {
      proqtyInput = proqtyInput + 1;
    }
    $("#proDtIndex-" + indxFlg)
      .find(".proqty_input")
      .val(proqtyInput);
  }

  /* add to cart */
  addToCartSimple(productDetail, actionFlg) {
    var IndexFlg = productDetail.product_primary_id;

    if (actionFlg === "initial") {
      $("#proDtIndex-" + IndexFlg)
        .find(".smiple_product_lk")
        .hide();
      $("#proDtIndex-" + IndexFlg)
        .find(".addcart_done_maindiv")
        .show();
      return false;
    } else {
      showLoader("proDtIndex-" + IndexFlg, "Idtext");
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
      var proqtyQty = $("#proDtIndex-" + IndexFlg)
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
        hideLoader("proDtIndex-" + IndexFlg, "Idtext");
        $("#proDtIndex-" + IndexFlg)
          .find(".addcart_done_maindiv")
          .hide();
        $("#proDtIndex-" + IndexFlg)
          .find(".smiple_product_lk")
          .show();
        if (res.data.status === "ok") {
          this.props.sateValChange("cartflg", "yes");
          showCustomAlert("success", "Great choice! Item added to your cart.");
          this.setState({ cartTriggerFlg: "yes" });
          removePromoCkValue();
          this.handleShowAlertFun(
            "Success",
            "Great choice! Item added to your cart."
          );
          $("#ProductDetailMdl").modal("toggle");
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

  /* show modifier product details */
  modifierProDetails(proDetailArr) {
    var modProductPrice =
      this.state.modProductPrice !== ""
        ? this.state.modProductPrice
        : proDetailArr.product_price;
    var modProductTotalPrice =
      this.state.modProductTotalPrice !== ""
        ? this.state.modProductTotalPrice
        : proDetailArr.product_price;
    return (
      <div>
        <div className="prd_chosen_row mdf_common_rows">
          <div id="modErrorDiv" className="modfr-alert-danger single-danger">
            {" "}
            Product combination is wrong. Please check your combination{" "}
          </div>

          <div className="product_chosen_inner">
            <input
              type="hidden"
              id="modProductSlug"
              name="modProductSlug"
              value={proDetailArr.product_slug}
            />
            <input
              type="hidden"
              id="modProductId"
              name="modProductId"
              value={proDetailArr.product_id}
            />
            <input
              type="hidden"
              id="modProductPrice"
              name="modProductPrice"
              value={modProductPrice}
            />
            <input
              type="hidden"
              id="modParentProductId"
              name="modParentProductId"
              value={this.state.modParentProductId}
            />
            <input
              type="hidden"
              id="modProductTotalPrice"
              name="modProductTotalPrice"
              value={modProductTotalPrice}
            />

            <div className="product_chosen_col">
              <div className="product_chosen_col_inner">
                {this.modifierProOptions(proDetailArr)}
              </div>
            </div>

            <div className="product_chosen_col product_chosen_col_right">
              <div className="text-box">
                <textarea
                  placeholder="You can enter your special remark in the section..."
                  name="special_notes"
                  id="special_notes"
                  maxLength="30"
                  value={this.state.product_remarks}
                  onChange={this.updateRemarks.bind(this)}
                ></textarea>
                <em>{this.state.remaining} Characters remaining</em>
              </div>
            </div>
          </div>
        </div>

        <div className="prd_chosen_sub_row">
          <p>
            <sup>$</sup>
            <span id="id_price_final">{modProductTotalPrice}</span>
          </p>
          <div className="prd_chosen_sub_col popup_addcart_cls modfir_addcart_cls">
            <div
              className="addcart_row prd_chosen_sub_item_left cart_update_div mdf_update_div"
              style={{ display: "none" }}
            >
              <div className="qty_bx">
                <span
                  className="qty_minus"
                  onClick={this.mfdrQtyAction.bind(this, "decr")}
                >
                  -
                </span>
                <input
                  type="text"
                  value={this.state.mdfinput_value}
                  className="modfir_proqty_input"
                  readOnly="1"
                />
                <span
                  className="qty_plus"
                  onClick={this.mfdrQtyAction.bind(this, "incr")}
                >
                  +
                </span>
              </div>
            </div>

            <div
              className="prd_chosen_sub_item_right cart_update_div mdf_update_div"
              style={{ display: "none" }}
            >
              <button
                onClick={this.addToCartModifier.bind(
                  this,
                  proDetailArr,
                  "done"
                )}
              >
                Done
              </button>
            </div>

            <div className="prd_chosen_sub_item_right prd_chosen_item_full cart_add_div mdf_add_div">
              <button
                onClick={this.addToCartModifier.bind(
                  this,
                  proDetailArr,
                  "initial"
                )}
              >
                Add To Cart
              </button>
            </div>

            <div className="cart-success-msg alert alert_success mdfcart_success_msg"></div>
            <div className="cart-error-msg alert alert_danger mdfcart_error_msg"></div>
          </div>
        </div>
      </div>
    );
  }

  /* show modifier product option */
  modifierProOptions(mdfproducts) {
    var modifiersArr =
      mdfproducts.modifiers !== null && mdfproducts.modifiers !== ""
        ? mdfproducts.modifiers
        : Array();

    if (modifiersArr.length > 0) {
      const html = modifiersArr.map((item, index) => (
        <div
          className="product_chosen_item_left product_chosen_item_left_full"
          key={index}
        >
          <div className="product_chosen_addons">
            <div className="product_chosen_hea">
              <h6>{stripslashes(item.pro_modifier_name)}</h6>
              <span></span>
            </div>
          </div>

          <div className="form-group custom-select-bxcls">
            <div className={"re_select re_select_" + index}>
              {this.modifierValuesOpn(item)}
            </div>
          </div>
        </div>
      ));

      return html;
    } else {
      return "";
    }
  }

  modifierValuesOpn(mdfMainArr) {
    var mdfrValueArr =
      mdfMainArr.modifiers_values !== null && mdfMainArr.modifiers_values !== ""
        ? mdfMainArr.modifiers_values
        : Array();
    if (mdfrValueArr.length > 0) {
      var mainMdfId = mdfMainArr.pro_modifier_id;
      var mainMdfNm = stripslashes(mdfMainArr.pro_modifier_name);
      var mdfrSelectBoxHtml = "";
      var defaultMdfVal = "";
      $.each(mdfrValueArr, function (index, item) {
        var datamdfVl =
          mainMdfId +
          "~" +
          mainMdfNm +
          "~" +
          stripslashes(item.pro_modifier_value_name) +
          "~" +
          item.pro_modifier_value_id +
          "~" +
          item.pro_modifier_value_price;

        var incPrc =
          parseFloat(item.pro_modifier_value_price) > 0
            ? " ( + $" + item.pro_modifier_value_price + " )"
            : "";

        mdfrSelectBoxHtml +=
          "<option value='" +
          item.pro_modifier_value_id +
          "' data-mdfvl='" +
          datamdfVl +
          "'>" +
          item.pro_modifier_value_name +
          incPrc +
          "</option>";
        if (item.pro_modifier_value_is_default === "Yes") {
          defaultMdfVal = item.pro_modifier_value_id;
        }
      });
      var mdfrSelectDropDown = Parser(mdfrSelectBoxHtml);
      var statMdfVal = this.state["modifier~~" + mainMdfId];
      var mdfSelectVl =
        statMdfVal !== undefined && statMdfVal !== ""
          ? statMdfVal
          : defaultMdfVal;

      return (
        <select
          name="modifier_main"
          value={mdfSelectVl}
          className="modifierList"
          onChange={this.handleChange.bind(this, mainMdfId)}
          id={"modif" + mainMdfId}
        >
          {mdfrSelectDropDown}
        </select>
      );
    } else {
      return "";
    }
  }

  handleChange(mdfVl, event) {
    $("#modErrorDiv").hide();
    this.setState({
      mdfApi_call: "Yes",
      ["modifier~~" + mdfVl]: event.target.value,
    });
  }

  mfdrQtyAction(actionFlg) {
    var proqtyInput = $(".modfir_proqty_input").val();
    var modProductPrice = $("#modProductPrice").val();
    proqtyInput = parseInt(proqtyInput);
    if (actionFlg === "decr") {
      proqtyInput = proqtyInput > 1 ? proqtyInput - 1 : proqtyInput;
    } else {
      proqtyInput = proqtyInput + 1;
    }

    var productTotalPrice =
      parseFloat(modProductPrice) * parseFloat(proqtyInput);
    productTotalPrice = parseFloat(productTotalPrice).toFixed(2);

    /*$('.modfir_proqty_input').val(proqtyInput);*/
    this.setState({
      mdfApi_call: "No",
      mdfinput_value: proqtyInput,
      modProductTotalPrice: productTotalPrice,
    });
  }

  updateRemarks(event) {
    this.setState({ mdfApi_call: "No", product_remarks: event.target.value });
    this.setState({ remaining: 30 - event.target.value.length });
  }

  addToCartModifier(mdfProdDetail, actionFlg) {
    if (actionFlg === "initial") {
      $(".mdf_add_div").hide();
      $(".mdf_update_div").show();
      return false;
    } else {
      var modCount = $(".modifierList").length;
      $("#modErrorDiv").hide();
      var modifier = [];
      if (modCount > 0) {
        var errorChk = 0;
        $(".modifierList").each(function () {
          var modVal = $(this).val();
          var modSelectVal = $(this).find("option:selected").attr("data-mdfvl");
          if (modVal != "" && modSelectVal != "") {
            var modifier_sets = modSelectVal.split("~");
            var modifierVal = [];
            modifierVal.push({
              modifier_value_id: modifier_sets[3],
              modifier_value_qty: "1",
              modifier_value_name: modifier_sets[2],
              modifier_value_price: modifier_sets[4],
            });
            modifier.push({
              modifier_id: modifier_sets[0],
              modifier_name: modifier_sets[1],
              modifiers_values: modifierVal,
            });
          } else if (modSelectVal == "" || modVal == "") {
            errorChk = 1;
          }
        });

        if (errorChk == 1) {
          $(".mdfcart_error_msg").html("Sorry!. Product Detail was not valid.");
          $(".mdfcart_error_msg").show();
          $(".mdfcart_error_msg").delay(6000).fadeOut();
          return false;
        } else if (errorChk == 0) {
          showLoader("modfir_addcart_cls", "class");

          var availabilityId = cookie.load("defaultAvilablityId");
          var customerId =
            typeof cookie.load("UserId") === "undefined"
              ? ""
              : cookie.load("UserId");
          /*var availabilityId = deliveryId;*/
          var availabilityName =
            availabilityId === deliveryId ? "Delivery" : "Pickup";

          var productRemarks = this.state.product_remarks;
          var prodcutQty = this.state.mdfinput_value;
          var modParentId = this.state.modParentProductId;
          var modProductId = $("#modProductId").val();

          var postObject = {};
          postObject = {
            app_id: appId,
            product_id: modProductId,
            product_modifier_parent_id: modParentId,
            availability_id: availabilityId,
            availability_name: availabilityName,
            product_qty: prodcutQty,
            product_type: 4,
            modifiers: JSON.stringify(modifier),
            menu_set_component: "",
            product_remarks: productRemarks,
            reference_id: customerId === "" ? getReferenceID() : "",
            customer_id: customerId,
          };

          Axios.post(
            apiUrlV2 + "cart/simpleCartInsert",
            qs.stringify(postObject)
          ).then((res) => {
            hideLoader("modfir_addcart_cls", "class");
            if (res.data.status === "ok") {
              $(".mdf_update_div").hide();
              $(".mdf_add_div").show();
              showCustomAlert(
                "success",
                "Great choice! Item added to your cart."
              );
              $(".mdfcart_success_msg").html(
                "Successfully! Item added to your cart."
              );
              $(".mdfcart_success_msg").show();
              $(".mdfcart_success_msg").delay(6000).fadeOut();
              this.props.sateValChange("cartflg", "yes");
              this.setState({ cartTriggerFlg: "yes" });
              removePromoCkValue();
              this.handleShowAlertFun(
                "Success",
                "Great choice! Item added to your cart."
              );
              $("#ProductDetailMdl").modal("toggle");
              return false;
            } else if (res.data.status === "error") {
              var errMsgtxt =
                res.data.message !== ""
                  ? res.data.message
                  : "Sorry!. Product Detail was not valid.";
              $(".mdfcart_error_msg").html(errMsgtxt);
              $(".mdfcart_error_msg").show();
              $(".mdfcart_error_msg").delay(6000).fadeOut();
            }
          });
        }
      } else {
        $(".mdfcart_error_msg").html("Sorry!. Product Detail was not valid.");
        $(".mdfcart_error_msg").show();
        $(".mdfcart_error_msg").delay(6000).fadeOut();
        return false;
      }
    }
  }

  /* show combo product Details */
  comboProDetails(proDetailArr) {
    var comboArr =
      proDetailArr.set_menu_component !== null &&
      proDetailArr.set_menu_component !== ""
        ? proDetailArr.set_menu_component
        : Array();

    if (Object.keys(comboArr).length > 0) {
      var minMaxSelect = parseInt(proDetailArr.product_apply_minmax_select);
      var compoTotalPrice = proDetailArr.product_price;
      return (
        <div>
          <div className="prd_chosen_row compo_top_div">
            <div className="product_chosen_inner">
              <input
                type="hidden"
                id="set_menu_component_type"
                name="set_menu_component_type"
                value={minMaxSelect}
              />
              <input
                type="hidden"
                id="product_unitprice"
                name="product_unitprice"
                value={compoTotalPrice}
              />
              <input
                type="hidden"
                id="incr_compo_price"
                name="incr_compo_price"
                value={this.state.incrCompoPrice}
              />

              <div className="product_chosen_col common_compo_div">
                {minMaxSelect === 0 && this.singleComboDet(comboArr)}
                {minMaxSelect === 1 && this.multipleComboDet(comboArr)}
              </div>

              <div className="product_chosen_col product_chosen_col_right">
                <div className="text-box">
                  <textarea
                    placeholder="You can enter your special remark in the section..."
                    name="special_notes"
                    id="special_notes"
                    maxLength="30"
                    value={this.state.product_remarks}
                    onChange={this.updateRemarksCompo.bind(this)}
                  ></textarea>
                  <em>{this.state.remaining} Characters remaining</em>
                </div>
              </div>
            </div>
          </div>

          <div className="prd_chosen_sub_row">
            <p>
              <sup>$</sup>
              <span id="compoprice_final">{compoTotalPrice}</span>
            </p>
            <div className="prd_chosen_sub_col popup_addcart_cls compo_addcart_cls">
              {/* style={{ display: "none" }}  */}
              <div className="addcart_row prd_chosen_sub_item_left cart_update_div compo_update_div">
                <div className="qty_bx">
                  <span
                    className="qty_minus"
                    onClick={this.compoQtyAction.bind(this, "decr")}
                  >
                    -
                  </span>
                  <input
                    type="text"
                    value={this.state.compoinput_value}
                    className="compo_proqty_input"
                    readOnly="1"
                  />
                  <span
                    className="qty_plus"
                    onClick={this.compoQtyAction.bind(this, "incr")}
                  >
                    +
                  </span>
                </div>
              </div>

              <div className="prd_chosen_sub_item_right cart_update_div compo_update_div">
                <button
                  onClick={this.addToCartCombo.bind(this, proDetailArr, "done")}
                >
                  Done
                </button>
              </div>

              <div
                className="prd_chosen_sub_item_right prd_chosen_item_full cart_add_div compo_add_div"
                style={{ display: "none" }}
              >
                <button
                  onClick={this.addToCartCombo.bind(
                    this,
                    proDetailArr,
                    "initial"
                  )}
                >
                  Add To Cart
                </button>
              </div>

              <div className="cart-success-msg alert alert_success compocart_success_msg"></div>
              <div className="cart-error-msg alert alert_danger compocart_error_msg"></div>
            </div>
          </div>
        </div>
      );
    } else {
      return "";
    }
  }

  singleComboDet(compoProDetailArr) {
    if (Object.keys(compoProDetailArr).length > 0) {
      const html = compoProDetailArr.map((item, index1) => (
        <div
          className={
            "product_chosen_item_left product_chosen_item_left_full compo_list_div main_combo_div compo_acc_active maincombo-" +
            item.menu_component_id
          }
          data-maincomboidtxt={item.menu_component_id}
          data-combodata={
            item.menu_component_id + "~" + item.menu_component_name + "~0"
          }
          data-combopriceapply={
            item.menu_component_apply_price !== ""
              ? item.menu_component_apply_price
              : 0
          }
          key={"compo" + index1}
        >
          <div className="product_chosen_addons compo_pro_acc compo_acc_action">
            <div className="product_chosen_hea compopro_acc_head">
              <h6>{stripslashes(item.menu_component_name)}</h6>
            </div>
          </div>

          <div className="compo_acc_innerdiv" style={{ display: "none" }}>
            <div className="form-group custom-select-bxcls">
              {this.showSingleComboOptions(item)}
            </div>

            <div
              className="mdfr_list_divlcs"
              data-mismatchpro=""
              data-invcomboprice=""
            >
              <div
                className="mdfr_list_divlcs_error"
                style={{ display: "none", color: "red" }}
              >
                Please choose valid modifiers
              </div>
              {this.showSingleComboMdfr(item)}
            </div>
          </div>
        </div>
      ));

      return (
        <div className="product_chosen_col_inner compo_inner_main">{html}</div>
      );
    } else {
      return "";
    }
  }

  /* show single combo product option */
  showSingleComboOptions(splProducts, cartComboDetails) {
    var compoListArr =
      splProducts.product_details !== null && splProducts.product_details !== ""
        ? splProducts.product_details
        : Array();
    var menuComponentApplyPrice =
      splProducts.menu_component_apply_price !== ""
        ? splProducts.menu_component_apply_price
        : 0;
    var check_Combo_Value = "";
    if (compoListArr.length > 0) {
      var defaultSelectVl = splProducts.menu_component_default_select;
      var menuSetCmpId = splProducts.menu_set_component_id;
      var menuCmpId = splProducts.menu_component_id;
      var menuComponentNm = stripslashes(splProducts.menu_component_name);
      var compSelectBoxHtml = "";
      var mdfMainComboProId = "";
      var ismdfrProCount = 0;
      var comboPropriceAply = "";
      var comboProPrice = 0;
      var indvlComponentNm = "";
      var showPricetxt = "";
      var compomainselval = "";
      var currentThis = this;
      $.each(compoListArr, function (index2, item1) {
        mdfMainComboProId = item1[0].product_id;
        ismdfrProCount =
          item1[0].modifiers !== null && item1[0].modifiers !== ""
            ? Object.keys(item1[0].modifiers).length
            : 0;
        comboProPrice = item1[0].product_price;
        comboPropriceAply =
          parseFloat(comboProPrice) > 0 &&
          parseInt(menuComponentApplyPrice) === 1 &&
          parseInt(ismdfrProCount) === 0
            ? comboProPrice
            : 0;
        indvlComponentNm =
          item1[0].product_alias !== ""
            ? stripslashes(item1[0].product_alias)
            : stripslashes(item1[0].product_name);

        showPricetxt =
          parseFloat(comboPropriceAply) > 0
            ? " ( + $" + parseFloat(comboPropriceAply).toFixed(2) + " )"
            : "";
        var checkComboValue =
          cartComboDetails !== "" &&
          typeof cartComboDetails !== "undefined" &&
          typeof cartComboDetails !== undefined &&
          cartComboDetails.product_details !== "" &&
          typeof cartComboDetails.product_details !== "undefined" &&
          typeof cartComboDetails.product_details !== undefined
            ? currentThis.checkComboValue(
                cartComboDetails.product_details,
                item1[0].product_id
              )
            : "";
        if (
          checkComboValue !== "" &&
          typeof checkComboValue !== undefined &&
          typeof checkComboValue !== "undefined"
        ) {
          check_Combo_Value = item1[0].product_id;
        }

        compomainselval =
          item1[0].product_id +
          "~" +
          indvlComponentNm +
          "~" +
          item1[0].product_sku +
          "~" +
          comboProPrice;

        compSelectBoxHtml +=
          "<option value='" +
          item1[0].product_id +
          "' data-compomainselval='" +
          compomainselval +
          "' data-mdfcombopro='" +
          mdfMainComboProId +
          "' data-combopropriceaply='" +
          comboPropriceAply +
          "' data-ismdfrprochk='" +
          ismdfrProCount +
          "' >" +
          indvlComponentNm +
          showPricetxt +
          "</option>";
      });

      var compSelectDropDown = Parser(compSelectBoxHtml);
      var statMdfVal = this.state["compo~~" + menuCmpId];
      var mdfSelectVl =
        statMdfVal !== undefined && statMdfVal !== ""
          ? statMdfVal
          : defaultSelectVl;
      if (check_Combo_Value !== "") {
        mdfSelectVl = check_Combo_Value;
      }
      return (
        <select
          name="compomain_select"
          value={mdfSelectVl}
          className="components_selct components_selctbox_cls"
          onChange={this.handleChangeCompoMain.bind(this, menuCmpId)}
          id={"cmpp" + menuCmpId}
        >
          {compSelectDropDown}
        </select>
      );
    } else {
      return "";
    }
  }

  showSingleComboMdfr(splProducts) {
    var compoListArr =
      splProducts.product_details !== null && splProducts.product_details !== ""
        ? splProducts.product_details
        : Array();
    if (compoListArr.length > 0) {
      var defaultSelectVl = splProducts.menu_component_default_select;
      var menuSetCmpId = splProducts.menu_set_component_id;
      var menuCmpId = splProducts.menu_component_id;
      var menuComponentNm = stripslashes(splProducts.menu_component_name);

      const html = compoListArr.map((item1, index2) => (
        <div className="mdfr_list_divlcs_inv" key={"cmdf-" + index2}>
          {item1[0].modifiers !== null &&
            item1[0].modifiers !== "" &&
            this.singleComboMdfrOption(
              menuCmpId,
              item1[0].product_id,
              item1[0].modifiers
            )}
        </div>
      ));

      return html;
    } else {
      return "";
    }
  }

  singleComboMdfrOption(menuCmpIdTxt, productIdTxt, cmpProMdfr) {
    if (Object.keys(cmpProMdfr).length > 0) {
      const html = cmpProMdfr.map((item2, index3) => (
        <div
          className={
            "compoMdfr_item_left individual_combo_mdf compo_mdf_" + productIdTxt
          }
          key={"cmd-" + index3}
        >
          <div className="product_chosen_addons">
            <div className="product_chosen_hea">
              <h6>{stripslashes(item2.pro_modifier_name)}</h6>
            </div>
          </div>

          <div className="form-group custom-select-bxcls">
            <div className={"re_select re_select_cmd" + index3}>
              {this.singleComboMdfrValuesOpn(menuCmpIdTxt, item2)}
            </div>
          </div>
        </div>
      ));

      return html;
    } else {
      return "";
    }
  }

  singleComboMdfrValuesOpn(menuCmpIdTxt, mdfMainArr) {
    var mdfrValueArr =
      mdfMainArr.modifiers_values !== null && mdfMainArr.modifiers_values !== ""
        ? mdfMainArr.modifiers_values
        : Array();
    if (mdfrValueArr.length > 0) {
      var mainMdfId = mdfMainArr.pro_modifier_id;
      var mainMdfNm = stripslashes(mdfMainArr.pro_modifier_name);
      var mdfrSelectBoxHtml = "";
      var defaultMdfVal = "";
      $.each(mdfrValueArr, function (index4, item3) {
        var datamdfVl =
          mainMdfId +
          "~" +
          mainMdfNm +
          "~" +
          item3.pro_modifier_value_id +
          "~" +
          stripslashes(item3.pro_modifier_value_name) +
          "~" +
          item3.pro_modifier_value_price;

        var incPrc =
          parseFloat(item3.pro_modifier_value_price) > 0
            ? " ( + $" + item3.pro_modifier_value_price + " )"
            : "";

        mdfrSelectBoxHtml +=
          "<option value='" +
          item3.pro_modifier_value_id +
          "' data-selectmdfval='" +
          datamdfVl +
          "' data-mdfrpricevaluetxt='" +
          item3.pro_modifier_value_price +
          "' >" +
          item3.pro_modifier_value_name +
          incPrc +
          "</option>";
        if (item3.pro_modifier_value_is_default === "Yes") {
          defaultMdfVal = item3.pro_modifier_value_id;
        }
      });
      var mdfrSelectDropDown = Parser(mdfrSelectBoxHtml);
      var statMdfVal =
        this.state["compoInner~~" + menuCmpIdTxt + "~~" + mainMdfId];
      var mdfSelectVl =
        statMdfVal !== undefined && statMdfVal !== ""
          ? statMdfVal
          : defaultMdfVal;

      return (
        <select
          name="compoinner_select"
          value={mdfSelectVl}
          className="components_mdf_selct"
          onChange={this.handleChangeCompoInner.bind(
            this,
            menuCmpIdTxt,
            mainMdfId
          )}
          id={"modifvl" + mainMdfId}
        >
          {mdfrSelectDropDown}
        </select>
      );
    } else {
      return "";
    }
  }

  multipleComboDet(compoProDetailArr) {
    if (Object.keys(compoProDetailArr).length > 0) {
      var cartMenuComponent =
        this.state.cartItem !== ""
          ? this.state.cartItem.set_menu_component
          : "";
      const html = compoProDetailArr.map((item, index1) => {
        var checkComboMain = this.checkComboMain(
          cartMenuComponent,
          item.menu_component_id
        );
        return (
          <div
            className={
              "product_chosen_item_left product_chosen_item_left_full compo_list_div main_combo_div minmax_maincombo_div compo_acc_active maincombo-" +
              item.menu_component_id
            }
            data-maincomboidtxt={item.menu_component_id}
            data-combodata={
              item.menu_component_id + "~" + item.menu_component_name + "~1"
            }
            data-combopriceapply={
              item.menu_component_apply_price !== ""
                ? item.menu_component_apply_price
                : 0
            }
            data-minselectcombo={item.menu_component_min_select}
            data-maxselectcombo={item.menu_component_max_select}
            data-modifierapply={item.menu_component_modifier_apply}
            key={"compo" + index1}
          >
            <div className="product_chosen_addons compo_pro_acc compo_acc_action">
              <div className="product_chosen_hea compopro_acc_head">
                <h6>{stripslashes(item.menu_component_name)}</h6>
              </div>
            </div>

            <div className="compo_acc_innerdiv" style={{ display: "none" }}>
              {item.menu_component_modifier_apply === "1" ? (
                <div className="compo_mdfselect_maindiv">
                  <div className="form-group custom-select-bxcls">
                    {this.showSingleComboOptions(item, checkComboMain)}
                  </div>

                  <div
                    className="mdfr_list_divlcs"
                    data-mismatchpro=""
                    data-invcomboprice=""
                  >
                    <div
                      className="mdfr_list_divlcs_error"
                      style={{ display: "none", color: "red" }}
                    >
                      Please choose valid modifiers
                    </div>
                    {this.showSingleComboMdfr(item)}
                  </div>
                </div>
              ) : (
                <div className="compo_minmax_maindiv">
                  <div className="max-min-bar">
                    {"You've chosen"} <span className="minSelectCls">0</span>{" "}
                    (Min. {item.menu_component_min_select} & Max.{" "}
                    {item.menu_component_max_select}){" "}
                  </div>

                  <div className="error_combo_div">
                    {" "}
                    Please select the min number of items.{" "}
                  </div>

                  {this.showMultipleComboOptions(item, checkComboMain)}
                </div>
              )}
            </div>
          </div>
        );
      });

      return (
        <div className="product_chosen_col_inner compo_inner_main">{html}</div>
      );
    } else {
      return "";
    }
  }

  checkComboMain(comboList, combo_id) {
    var comboResult = "";
    if (comboList.length > 0) {
      comboList.map((item) => {
        if (item.menu_component_id === combo_id) {
          comboResult = item;
        }
      });
    }

    return comboResult;
  }

  showComboMultiSelect(mutilSlct) {
    return mutilSlct === 1 ? "none" : "";
  }

  /* show multiple combo product option */
  showMultipleComboOptions(splProducts, cartComboDetails) {
    var multiSelectApply =
      splProducts.menu_component_multipleselection_apply !== ""
        ? parseInt(splProducts.menu_component_multipleselection_apply)
        : 0;
    var compoListArr =
      splProducts.product_details !== null && splProducts.product_details !== ""
        ? splProducts.product_details
        : Array();
    var menuComponentApplyPrice =
      splProducts.menu_component_apply_price !== ""
        ? splProducts.menu_component_apply_price
        : 0;
    if (compoListArr.length > 0) {
      var defaultSelectVl = splProducts.menu_component_default_select;
      var menuSetCmpId = splProducts.menu_set_component_id;
      var menuCmpId = splProducts.menu_component_id;

      const compoMtplHtml = compoListArr.map((item1, index1) => {
        var checkComboValue =
          cartComboDetails !== ""
            ? this.checkComboValue(
                cartComboDetails.product_details,
                item1[0].product_id
              )
            : "";
        return (
          <div
            className={
              "chosen_adn mdfr_list_divlcs individual_combo_pro indvcombo-" +
              menuCmpId +
              "-" +
              item1[0].product_primary_id
            }
            data-mismatchpro=""
            data-invcomboprice={
              checkComboValue !== ""
                ? parseFloat(checkComboValue.cart_menu_component_product_price)
                  ? checkComboValue.cart_menu_component_product_price
                  : "0"
                : "0"
            }
            data-comboprice={item1[0].product_price}
            data-productdata={this.getCmpProData(item1)}
            key={index1}
          >
            <div className="bb-txt2 margin-15 chosen_adn_left">
              <span>
                {item1[0].product_alias !== ""
                  ? stripslashes(item1[0].product_alias)
                  : stripslashes(item1[0].product_name)}
              </span>{" "}
              <span className="combo_pro_price" style={{ display: "none" }}>
                {parseFloat(item1[0].product_price) > 0
                  ? " ( +" + item1[0].product_price + " )"
                  : ""}
              </span>
            </div>
            <div
              className="radio pull-right combo-inc-parent chosen_adn_right"
              style={{ display: this.showComboMultiSelect(multiSelectApply) }}
            >
              <div className="qty_bx">
                <span
                  className="qty_minus combo_inc"
                  onClick={this.decComboQty.bind(
                    this,
                    menuCmpId,
                    item1[0].product_primary_id
                  )}
                >
                  -
                </span>

                <label
                  type="text"
                  disabled
                  data-qtyval={
                    checkComboValue !== ""
                      ? checkComboValue.cart_menu_component_product_qty
                      : "0"
                  }
                  className="combo-input-label combo-input combolst_qty_value"
                >
                  {checkComboValue !== ""
                    ? checkComboValue.cart_menu_component_product_qty
                    : "0"}
                </label>

                <span
                  className="qty_plus combo_dec"
                  onClick={this.incComboQty.bind(
                    this,
                    menuCmpId,
                    item1[0].product_primary_id
                  )}
                >
                  +
                </span>
              </div>
            </div>

            {multiSelectApply === 1 && (
              <div className="checkboxcls pull-right">
                <input
                  className="css-checkboxcls"
                  type="checkbox"
                  onChange={this.comboMultiSelectUpdate.bind(
                    this,
                    menuCmpId,
                    item1[0].product_primary_id
                  )}
                  value={item1[0].product_price}
                  name={"comboMultiStVal_" + menuCmpId}
                  id={
                    "comboMultiStVal_" +
                    menuCmpId +
                    "_" +
                    item1[0].product_primary_id
                  }
                />{" "}
                <label
                  htmlFor={
                    "comboMultiStVal_" +
                    menuCmpId +
                    "_" +
                    item1[0].product_primary_id
                  }
                  className="css-label-chkbox"
                ></label>
              </div>
            )}
          </div>
        );
      });

      return <div>{compoMtplHtml}</div>;
    } else {
      return "";
    }
  }

  checkComboValue(comboValueList, comboProID) {
    var comboValueResult = "";
    if (comboValueList.length > 0) {
      comboValueList.map((item) => {
        if (item.cart_menu_component_product_id === comboProID) {
          comboValueResult = item;
        }
      });
    }

    return comboValueResult;
  }

  getCmpProData(proData) {
    var proName =
      proData[0].product_alias !== ""
        ? stripslashes(proData[0].product_alias)
        : stripslashes(proData[0].product_name);
    var pro_datetxt =
      proData[0].product_id +
      "~" +
      proName +
      "~" +
      proData[0].product_sku +
      "~" +
      proData[0].product_price;
    return pro_datetxt;
  }

  comboMultiSelectUpdate(menuCmpId, productPryId) {
    if (
      $("#comboMultiStVal_" + menuCmpId + "_" + productPryId).prop("checked") ==
      true
    ) {
      this.incComboQty(menuCmpId, productPryId, "checkboxact");
    } else {
      this.decComboQty(menuCmpId, productPryId);
    }
  }

  incComboQty(menuCmpId, proId, actionFrm) {
    var $_this = $(".indvcombo-" + menuCmpId + "-" + proId);
    var intValInc = $_this.find(".combolst_qty_value").attr("data-qtyval");
    intValInc = intValInc !== "" ? parseInt(intValInc) : 0;
    var minselectcombo =
      $_this.closest(".main_combo_div").attr("data-minselectcombo") != ""
        ? $_this.closest(".main_combo_div").attr("data-minselectcombo")
        : "0";
    var maxselectcombo =
      $_this.closest(".main_combo_div").attr("data-maxselectcombo") != ""
        ? $_this.closest(".main_combo_div").attr("data-maxselectcombo")
        : "0";
    var combopriceapply =
      $_this.closest(".main_combo_div").attr("data-combopriceapply") != ""
        ? $_this.closest(".main_combo_div").attr("data-combopriceapply")
        : "0";
    var invCompoQty = this.getInvCompoQty($_this);
    if (
      /*  actionFrm === "checkboxact" && */
      parseInt(invCompoQty) >= parseInt(maxselectcombo)
    ) {
      $("#comboMultiStVal_" + menuCmpId + "_" + proId).prop("checked", false);
      return false;
    }

    var chk_val = 0;
    if (!isNaN(intValInc) && parseInt(invCompoQty) < parseInt(maxselectcombo)) {
      intValInc = parseInt(intValInc + 1);
      chk_val = 1;
    }

    $_this.find(".combolst_qty_value").attr("data-qtyval", intValInc);
    $_this.find(".combolst_qty_value").html(intValInc);

    var comboProPrice = $_this.attr("data-invcomboprice");
    var invCompoQty = this.getInvCompoQty($_this);
    if (
      invCompoQty > parseInt(minselectcombo) ||
      (parseInt(combopriceapply) == 1 && chk_val == 1)
    ) {
      $_this.find(".combo_pro_price").show();
      var invComboproPrice = $_this.attr("data-invcomboprice");
      var comboprice = $_this.attr("data-comboprice");
      comboProPrice = parseFloat(invComboproPrice) + parseFloat(comboprice);
    }

    if (parseInt(minselectcombo) == 0 || parseInt(combopriceapply) == 1) {
      $_this.find(".combo_pro_price").show();
    }
    $_this.attr("data-invcomboprice", comboProPrice);
    this.updateProductPricefun();
  }

  decComboQty(menuCmpId, proId) {
    var $_this = $(".indvcombo-" + menuCmpId + "-" + proId);
    var intValInc = $_this.find(".combolst_qty_value").attr("data-qtyval");
    intValInc = intValInc !== "" ? parseInt(intValInc) : 0;
    var minselectcombo =
      $_this.closest(".main_combo_div").attr("data-minselectcombo") != ""
        ? $_this.closest(".main_combo_div").attr("data-minselectcombo")
        : "0";
    var maxselectcombo =
      $_this.closest(".main_combo_div").attr("data-maxselectcombo") != ""
        ? $_this.closest(".main_combo_div").attr("data-maxselectcombo")
        : "0";
    var combopriceapply =
      $_this.closest(".main_combo_div").attr("data-combopriceapply") != ""
        ? $_this.closest(".main_combo_div").attr("data-combopriceapply")
        : "0";

    var minusChkVal = 0;
    if (!isNaN(intValInc) && parseInt(intValInc) >= 1) {
      var intValInc = parseInt(intValInc - 1);
      minusChkVal = 1;
    }

    $_this.find(".combolst_qty_value").attr("data-qtyval", intValInc);
    $_this.find(".combolst_qty_value").html(intValInc);
    var invCompoQty = this.getInvCompoQty($_this);
    var comboProPrice = $_this.attr("data-invcomboprice");
    var defComboprice = $_this.attr("data-comboprice");
    if (
      (invCompoQty >= parseInt(minselectcombo) && minusChkVal == 1) ||
      (parseInt(combopriceapply) == 1 && minusChkVal == 1)
    ) {
      if (
        parseInt(combopriceapply) == 1 &&
        minusChkVal == 1 &&
        parseFloat(defComboprice) == 0 &&
        parseFloat(comboProPrice) == 0
      ) {
        var temp_price = 0;
        $_this.attr("data-invcomboprice", temp_price);
        console.log(temp_price, "temp_pricetemp_pricetemp_price");
        $_this.find(".combo_pro_price").hide();
      } else if (
        parseFloat(comboProPrice) >= parseFloat(defComboprice) &&
        parseFloat(comboProPrice) > 0
      ) {
        var temp_price = parseFloat(comboProPrice) - parseFloat(defComboprice);
        $_this.attr("data-invcomboprice", temp_price);
        console.log(temp_price, "Atemp_pricetemp_pricetemp_price");
        if (parseFloat(temp_price) == 0) {
          $_this.find(".combo_pro_price").hide();
        }
      } else {
        var rtn_val = 0;
        $_this
          .closest(".main_combo_div")
          .find(".individual_combo_pro")
          .each(function () {
            var thisInvPrc = $(this).attr("data-invcomboprice");
            if (parseFloat(thisInvPrc) > 0 && rtn_val == 0) {
              rtn_val = 1;
              var comboproprice = thisInvPrc;
              var def_combo_price = $(this).attr("data-comboprice");
              var tempPrice =
                parseFloat(comboproprice) - parseFloat(def_combo_price);
              if (parseFloat(tempPrice) > 0) {
                tempPrice = tempPrice;
              } else {
                tempPrice = 0;
              }
              $(this).attr("data-invcomboprice", tempPrice);
              console.log(
                tempPrice,
                comboproprice,
                def_combo_price,
                "Btemp_pricetemp_pricetemp_price"
              );
              if (parseFloat(tempPrice) == 0) {
                $(this).find(".combo_pro_price").hide();
              }
            }
          });
      }
    }

    if (parseInt(minselectcombo) == 0 || parseInt(combopriceapply) == 1) {
      $_this.find(".combo_pro_price").show();
    }

    this.updateProductPricefun();
  }

  getInvCompoQty($_this) {
    $_this.closest(".main_combo_div").find(".error_combo_div").hide();
    var combolst_qty = 0;
    $_this
      .closest(".main_combo_div")
      .find(".combolst_qty_value")
      .each(function () {
        combolst_qty += parseInt($(this).attr("data-qtyval"));
      });
    return combolst_qty;
  }

  updateRemarksCompo(event) {
    this.setState({ compoApi_call: "No", product_remarks: event.target.value });
    this.setState({ remaining: 30 - event.target.value.length });
  }

  updateProductPricefun() {
    var minmaxMainCnt = $(".compo_minmax_maindiv").length;
    if (minmaxMainCnt > 0) {
      $(".compo_minmax_maindiv").each(function (indx) {
        var invQtyCnt = 0;
        $(this)
          .find(".individual_combo_pro")
          .each(function (indx2) {
            var qtyval = $(this)
              .find(".combolst_qty_value")
              .attr("data-qtyval");
            invQtyCnt = parseInt(invQtyCnt) + parseInt(qtyval);
          });
        $(this).find(".minSelectCls").html(invQtyCnt);
      });
    }

    var combo_pro_price = 0;
    $(".mdfr_list_divlcs").each(function () {
      var invcomboPriceVl = $(this).attr("data-invcomboprice");
      invcomboPriceVl = invcomboPriceVl !== "" ? invcomboPriceVl : 0;
      combo_pro_price += parseFloat(invcomboPriceVl);
    });

    var qty_txt =
      $(".compo_proqty_input").val() != ""
        ? parseInt($(".compo_proqty_input").val())
        : 0;
    var pro_price_val =
      $("#product_unitprice").val() != ""
        ? parseFloat($("#product_unitprice").val())
        : 0;

    var exc_price = parseFloat(pro_price_val) + parseFloat(combo_pro_price);
    exc_price = parseInt(qty_txt) * parseFloat(exc_price);

    $("#incr_compo_price").val(exc_price);
    $("#compoprice_final").html(parseFloat(exc_price).toFixed(2));
  }

  compoQtyAction(actionFlg) {
    var proqtyInput = $(".compo_proqty_input").val();
    proqtyInput = parseInt(proqtyInput);
    if (actionFlg === "decr") {
      proqtyInput = proqtyInput > 1 ? proqtyInput - 1 : proqtyInput;
    } else {
      proqtyInput = proqtyInput + 1;
    }

    this.setState({ compoApi_call: "No", compoinput_value: proqtyInput });
  }

  handleChangeCompoMain(compoVl, event) {
    this.setState({
      compoApi_call: "Yes",
      ["compo~~" + compoVl]: event.target.value,
    });
  }

  handleChangeCompoInner(menuCmpIdTxt, compoVl, event) {
    this.setState({
      compoApi_call: "Yes",
      ["compoInner~~" + menuCmpIdTxt + "~~" + compoVl]: event.target.value,
    });
  }

  getComboproData($_this, CompoType) {
    var comboproSet = Array(),
      comboproMdf = Array(),
      aplypriceZero = 0;

    if (CompoType === 1) {
      $_this.find(".individual_combo_pro").each(function () {
        var componentsProDet = $(this).attr("data-productdata");
        var compoProDet = componentsProDet.split("~");
        var combolstQtyValue = $(this)
          .find(".combolst_qty_value")
          .attr("data-qtyval");
        var comboProInvPrice = $(this).attr("data-invcomboprice");
        if (parseInt(combolstQtyValue) > 0) {
          comboproSet.push({
            product_id: compoProDet[0],
            product_name: compoProDet[1],
            product_sku: compoProDet[2],
            product_price: comboProInvPrice,
            product_qty: combolstQtyValue,
            modifiers: comboproMdf,
          });
        }
      });
    } else {
      $_this.find(".components_selct").each(function () {
        var mdfcombopro_id = $(this).find(":selected").attr("data-mdfcombopro");
        var combopriceapplychk = $(this)
          .closest(".main_combo_div")
          .attr("data-combopriceapply");
        var aplyprice_temp = $(this)
          .find(":selected")
          .attr("data-combopropriceaply");
        var comboMdfSet = Array();
        $(this)
          .closest(".main_combo_div")
          .find(".compo_mdf_" + mdfcombopro_id)
          .each(function () {
            var combopro_mdf_txt = $(this).find(".components_mdf_selct").val();
            var comboMdfValueSet = Array();
            if (combopro_mdf_txt !== "") {
              var modifierCombosets_txt = $(this)
                .find(".components_mdf_selct")
                .find("option:selected")
                .attr("data-selectmdfval");
              var mdfSetDet =
                modifierCombosets_txt !== "" &&
                modifierCombosets_txt !== undefined
                  ? modifierCombosets_txt.split("~")
                  : Array();

              if (Object.keys(mdfSetDet).length > 0) {
                comboMdfValueSet.push({
                  modifier_value_name: mdfSetDet[3],
                  modifier_value_id: mdfSetDet[2],
                  modifier_value_price: mdfSetDet[4],
                  modifier_value_qty: 1,
                });
                comboMdfSet.push({
                  modifier_name: mdfSetDet[1],
                  modifier_id: mdfSetDet[0],
                  modifiers_values: comboMdfValueSet,
                });
              }
            }
          });

        var componentsProDet = $(this)
          .find("option:selected")
          .attr("data-compomainselval");
        var compoProDet = componentsProDet.split("~");
        var combolstQtyValue = 1;
        var comboProInvPrice =
          parseFloat(combopriceapplychk) > 0
            ? parseFloat(aplyprice_temp)
            : parseFloat(aplypriceZero);
        comboproSet.push({
          product_id: compoProDet[0],
          product_name: compoProDet[1],
          product_sku: compoProDet[2],
          product_price: comboProInvPrice,
          product_qty: combolstQtyValue,
          modifiers: comboMdfSet,
        });
      });
    }

    return comboproSet;
  }

  checkMinValfun($_this) {
    var combo_qtycount = 0,
      min_val_error = 0;
    var min_selectcombo =
      $_this.attr("data-minselectcombo") != ""
        ? $_this.attr("data-minselectcombo")
        : "0";
    $_this.find(".combolst_qty_value").each(function () {
      var qtyval = $(this).attr("data-qtyval");
      combo_qtycount += parseInt(qtyval);
    });
    if (parseInt(min_selectcombo) > parseInt(combo_qtycount)) {
      min_val_error = 1;
    }
    return min_val_error;
  }

  addToCartCombo(compoProdDetail, actionFlg) {
    var InvalidMdfrCompo = "No";
    $(".main_combo_div").each(function () {
      if ($(this).find(".mdfr_list_divlcs").attr("data-mismatchpro") == "1") {
        InvalidMdfrCompo = "Yes";
      }
    });
    if (InvalidMdfrCompo == "No") {
      if (actionFlg === "initial") {
        $(".compo_add_div").hide();
        $(".compo_update_div").show();
        return false;
      } else {
        var $_react_this = this;
        var menuSet = Array();
        var productDetailsMain = Array();
        var modifier = Array();
        var CompoType = $("#set_menu_component_type").val();
        CompoType = parseInt(CompoType);
        var compo_errors = "0";

        if (CompoType === 1) {
          $(".main_combo_div").each(function () {
            var modifierapply = $(this).attr("data-modifierapply");
            if (modifierapply === "1") {
              var combodata_txt = $(this).attr("data-combodata");
              var menu_component = combodata_txt.split("~");
              var productDetails = $_react_this.getComboproData($(this), 0);
              productDetailsMain.push({
                menu_component_id: menu_component[0],
                menu_component_name: menu_component[1],
                product_details: productDetails,
                min_max_flag: menu_component[2],
              });
            } else {
              var check_min_val = $_react_this.checkMinValfun($(this));
              if (check_min_val == 0) {
                var combodata_txt = $(this).attr("data-combodata");
                menu_component = combodata_txt.split("~");
                var productDetails = $_react_this.getComboproData(
                  $(this),
                  CompoType
                );
                productDetailsMain.push({
                  menu_component_id: menu_component[0],
                  menu_component_name: menu_component[1],
                  product_details: productDetails,
                  min_max_flag: menu_component[2],
                });
              } else {
                compo_errors = "1";
                $(this).find(".compo_acc_innerdiv").show();
                $(this).find(".error_combo_div").show();
                return false;
              }
            }
          });
        } else {
          $(".main_combo_div").each(function () {
            var combodata_txt = $(this).attr("data-combodata");
            var menu_component = combodata_txt.split("~");
            var productDetails = $_react_this.getComboproData(
              $(this),
              CompoType
            );
            productDetailsMain.push({
              menu_component_id: menu_component[0],
              menu_component_name: menu_component[1],
              product_details: productDetails,
              min_max_flag: menu_component[2],
            });
          });
        }
        menuSet = productDetailsMain;

        if (compo_errors == "0" && Object.keys(menuSet).length > 0) {
          showLoader("compo_addcart_cls", "class");
          var prCommon = this.props.productcommon;

          var productId = compoProdDetail.product_id;
          var productName =
            compoProdDetail.product_alias !== ""
              ? stripslashes(compoProdDetail.product_alias)
              : stripslashes(compoProdDetail.product_name);
          var productImage =
            compoProdDetail.product_thumbnail !== ""
              ? prCommon.image_source + "/" + compoProdDetail.product_thumbnail
              : "";
          var productSku = compoProdDetail.product_sku;
          var productSlug = compoProdDetail.product_slug;

          var productRemarks = this.state.product_remarks;
          var prodcutQty = this.state.compoinput_value;
          var incrCompoPrice = $("#incr_compo_price").val();

          var totalCompoPrice =
            incrCompoPrice !== "" ? parseFloat(incrCompoPrice) : 0;
          var unitProductPrice =
            parseFloat(totalCompoPrice) / parseFloat(prodcutQty);
          unitProductPrice = unitProductPrice.toFixed(2);

          var availabilityId = cookie.load("defaultAvilablityId");
          var customerId =
            typeof cookie.load("UserId") === "undefined"
              ? ""
              : cookie.load("UserId");

          if (
            parseFloat(totalCompoPrice) > 0 &&
            parseFloat(unitProductPrice) > 0
          ) {
            var postObject = {};
            postObject = {
              app_id: appId,
              product_id: productId,
              product_qty: prodcutQty,
              availability_id: availabilityId,
              product_name: productName,
              product_total_price: totalCompoPrice,
              product_unit_price: unitProductPrice,
              product_remarks: productRemarks,
              product_image: productImage,
              product_sku: productSku,
              product_slug: productSlug,
              modifiers: JSON.stringify(modifier),
              menu_set_component: JSON.stringify(menuSet),
              individual: "yes",
              customer_id: customerId,
              reference_id: customerId === "" ? getReferenceID() : "",
              product_edit_enable: "No",
            };
            if (this.state.cartItem !== "") {
              var deletepostObject = {
                app_id: appId,
                cart_item_id: this.state.cartItem.cart_item_id,
                cartAction: "Delete",
              };
              if (typeof customerId === "undefined") {
                deletepostObject["reference_id"] = getReferenceID();
              } else {
                deletepostObject["customer_id"] = customerId;
              }
              Axios.post(
                apiUrl + "cart/delete",
                qs.stringify(deletepostObject)
              ).then((res) => {});
            }

            Axios.post(apiUrl + "cart/insert", qs.stringify(postObject)).then(
              (res) => {
                hideLoader("compo_addcart_cls", "class");
                if (res.data.status === "ok") {
                  /* $(".compo_update_div").hide();
                  $(".compo_add_div").show(); */

                  $(".main_combo_div").each(function () {
                    var $_mainthis = $(this);
                    $_mainthis.find(".individual_combo_pro").each(function () {
                      var $_thisn = $(this);
                      var currentQty = parseInt(
                        $_thisn.find(".combolst_qty_value").attr("data-qtyval")
                      );
                      if (currentQty > 0) {
                        for (let index = 0; index < currentQty; index++) {
                          $_thisn.find(".qty_minus").trigger("click");
                        }
                      }
                    });
                  });
                  var selectproQty = parseInt($(".compo_proqty_input").val());
                  if (selectproQty > 1) {
                    for (let index = 0; index < selectproQty - 1; index++) {
                      $(".compo_addcart_cls .qty_minus").trigger("click");
                    }
                  }

                  showCustomAlert(
                    "success",
                    "Great choice! Item added to your cart."
                  );
                  $(".compocart_success_msg").html(
                    "Successfully! Item added to your cart."
                  );
                  $(".compocart_success_msg").show();
                  $(".compocart_success_msg").delay(6000).fadeOut();
                  this.props.sateValChange("cartflg", "yes");
                  this.props.sateValChange("resetProduct", "yes");
                  this.setState({ cartTriggerFlg: "yes" });
                  removePromoCkValue();
                  this.handleShowAlertFun(
                    "Success",
                    "Great choice! Item added to your cart."
                  );
                  $(".compo_acc_innerdiv").hide();
                  $("#ProductDetailMdl").modal("toggle");
                  this.setState(
                    { editProductID: "", selectedProSlug: "" },
                    function () {
                      this.props.sateValChange("closeedit", "Yes");
                    }
                  );
                  return false;
                } else if (res.data.status === "error") {
                  var errMsgtxt =
                    res.data.message !== ""
                      ? res.data.message
                      : "Product Detail was not valid.";
                  $(".compocart_error_msg").html(errMsgtxt);
                  $(".compocart_error_msg").show();
                  $(".compocart_error_msg").delay(6000).fadeOut();
                }
              }
            );
          } else {
            hideLoader("compo_addcart_cls", "class");
            $(".compocart_error_msg").html(
              "Sorry!. Product price was not valid."
            );
            $(".compocart_error_msg").show();
            if ($("#ProductDetailMdl .error_combo_div:visible").length > 0) {
              var sectionOffset = $(
                "#ProductDetailMdl .error_combo_div:visible:first"
              ).position();
              $("#ProductDetailMdl").animate(
                {
                  scrollTop: sectionOffset.top - 30,
                },
                "slow"
              );
            }
            $(".compocart_error_msg").delay(6000).fadeOut();
            return false;
          }
        } else {
          $(".compocart_error_msg").html(
            "Sorry!. Product Detail was not valid."
          );
          $(".compocart_error_msg").show();
          if ($("#ProductDetailMdl .error_combo_div:visible").length > 0) {
            var sectionOffset = $(
              "#ProductDetailMdl .error_combo_div:visible:first"
            ).position();
            $("#ProductDetailMdl").animate(
              {
                scrollTop: sectionOffset.top - 30,
              },
              "slow"
            );
          }

          $(".compocart_error_msg").delay(6000).fadeOut();
          return false;
        }
      }
    } else {
      $(".compocart_error_msg").html("Sorry!. Invalid product combination.");
      $(".compocart_error_msg").show();
      $(".compocart_error_msg").delay(6000).fadeOut();
      return false;
    }
  }

  checkProductPrice() {
    var allModVal = "";
    var errorChk = 0;
    var productID = $("#modProductId").val();
    var inc_lp = 1;
    var TotalCnt = $(".modifierList").length;

    $(".modfir_addcart_cls").show();
    showLoader("modfir_addcart_cls", "class");

    $(".modifierList").each(function () {
      var modVal = $(this).val();
      var modSelectVal = $(this).find("option:selected").attr("data-mdfvl");
      if (modVal != "" && modSelectVal != "") {
        var modifier_sets = modSelectVal.split("~");
        allModVal +=
          inc_lp == TotalCnt ? modifier_sets[3] : modifier_sets[3] + ";";
      } else if (modSelectVal == "" || modVal == "") {
        errorChk = 1;
      }
      inc_lp++;
    });

    if (errorChk === 0 && allModVal != "") {
      Axios.get(
        apiUrl +
          "products/validate_product?app_id=" +
          appId +
          "&product_id=" +
          productID +
          "&modifier_value_id=" +
          allModVal
      ).then((res) => {
        var response = res.data;
        hideLoader("modfir_addcart_cls", "class");
        if (response.status === "ok") {
          var proQty = $(".modfir_proqty_input").val();
          var productPrice = response.result_set[0].product_price;
          var productTotalPrice =
            parseFloat(response.result_set[0].product_price) *
            parseFloat(proQty);
          productTotalPrice = parseFloat(productTotalPrice).toFixed(2);
          /*$("#modParentProductId").val(response.result_set[0].alias_product_primary_id);
					$("#modProductPrice").val(productPrice);
					$("#modProductTotalPrice").val(productTotalPrice);
					$('#id_price_final').html(productTotalPrice);*/
          this.setState({
            mdfApi_call: "No",
            modParentProductId: response.result_set[0].alias_product_primary_id,
            modProductPrice: productPrice,
            modProductTotalPrice: productTotalPrice,
          });
        } else {
          $(".modfir_addcart_cls").hide();
          $("#modErrorDiv").show();
          $("#modErrorDiv").delay(6000).fadeOut();
        }
      });
    }
  }

  setModifierValFun($_this) {
    var mdfcombopro = $_this.find(":selected").attr("data-mdfcombopro");
    $_this.closest(".main_combo_div").find(".individual_combo_mdf").hide();
    $_this
      .closest(".main_combo_div")
      .find(".compo_mdf_" + mdfcombopro)
      .show();
  }

  setOverallSubmdfrPrice($_this) {
    var mainmdfrid = $_this.find(":selected").attr("data-mdfcombopro");
    var ismdfrprochk = $_this.find(":selected").attr("data-ismdfrprochk");
    var combopriceapplychk = $_this
      .closest(".main_combo_div")
      .attr("data-combopriceapply");
    var maincomboidtxt = $_this
      .closest(".main_combo_div")
      .attr("data-maincomboidtxt");
    var mdfrpricevaluetxt_val = 0,
      inv_comopo_mismatch_pro = "";

    if (parseFloat(ismdfrprochk) > 0) {
      if (this.state.compoApi_call === "Yes") {
        var rtrn_msg = this.checkModifierPricefun(
          $_this,
          maincomboidtxt,
          mainmdfrid
        );
      }
    } else {
      if (parseFloat(combopriceapplychk) > 0) {
        var aplyprice_temp = $_this
          .find(":selected")
          .attr("data-combopropriceaply");
        mdfrpricevaluetxt_val = parseFloat(aplyprice_temp);
      }
      $_this
        .closest(".main_combo_div")
        .find(".mdfr_list_divlcs")
        .attr("data-invcomboprice", mdfrpricevaluetxt_val);
      $_this
        .closest(".main_combo_div")
        .find(".mdfr_list_divlcs")
        .attr("data-mismatchpro", inv_comopo_mismatch_pro);
      $_this.closest(".main_combo_div").find(".mdfr_list_divlcs_error").hide();
    }

    this.checkModifierErrorfun();
  }

  checkModifierPricefun($_this, maincomboidtxt, mdfcombopro_id) {
    var returntxt_msg = "";
    var sub_mdfr_ids = "";
    $(".maincombo-" + maincomboidtxt)
      .find(".compo_mdf_" + mdfcombopro_id)
      .each(function () {
        var modVal = $(this).find(".components_mdf_selct").val();
        if (modVal !== "") {
          var modifier_combosets_txt = $(this)
            .find(".components_mdf_selct")
            .find("option:selected")
            .attr("data-selectmdfval");
          var modifier_combosets =
            modifier_combosets_txt !== "" &&
            modifier_combosets_txt !== undefined
              ? modifier_combosets_txt.split("~")
              : new Array();
          if (modifier_combosets.length >= 2) {
            if (modifier_combosets[2]) {
              if (sub_mdfr_ids != "") {
                sub_mdfr_ids += ";";
              }
              sub_mdfr_ids = sub_mdfr_ids + modifier_combosets[2];
            }
          }
        }
      });

    if (sub_mdfr_ids !== "") {
      showLoader("compo_addcart_cls", "class");
      Axios.get(
        apiUrl +
          "products/validate_product?app_id=" +
          appId +
          "&product_id=" +
          mdfcombopro_id +
          "&modifier_value_id=" +
          sub_mdfr_ids
      ).then((res) => {
        var response = res.data;
        if (response.status === "ok") {
          var tempval = "";
          this.updateIndvModifrprice(
            $_this
              .closest(".main_combo_div")
              .find(".compo_mdf_" + mdfcombopro_id + ":first")
          );
        } else {
          var tempval = "1";
        }
        $_this
          .closest(".main_combo_div")
          .find(".mdfr_list_divlcs")
          .attr("data-mismatchpro", tempval);
        this.checkModifierErrorfun();
        hideLoader("compo_addcart_cls", "class");
      });
    }

    return returntxt_msg;
  }

  updateIndvModifrprice($_this) {
    var mdfrpricevaluetxt_val = 0;
    $_this
      .closest(".mdfr_list_divlcs_inv")
      .find(".components_mdf_selct")
      .each(function () {
        var mdfrpricevaluetxt = $(this)
          .find(":selected")
          .attr("data-mdfrpricevaluetxt");
        mdfrpricevaluetxt =
          mdfrpricevaluetxt !== "" && mdfrpricevaluetxt !== undefined
            ? parseFloat(mdfrpricevaluetxt)
            : 0;
        mdfrpricevaluetxt_val =
          parseFloat(mdfrpricevaluetxt_val) + parseFloat(mdfrpricevaluetxt);
      });
    $_this
      .closest(".mdfr_list_divlcs")
      .attr("data-invcomboprice", mdfrpricevaluetxt_val);
  }

  checkModifierErrorfun() {
    var over_allerror = "";
    $(".mdfr_list_divlcs").each(function () {
      if ($(this).attr("data-mismatchpro") == "1") {
        over_allerror = "1";
        $(this).find(".mdfr_list_divlcs_error").show();
      } else {
        $(this).find(".mdfr_list_divlcs_error").hide();
      }
    });

    /*$('#comopo_mismatch_pro').val(over_allerror);*/

    this.updateProductPricefun();

    if (over_allerror == "1") {
      $(".compo_addcart_cls").hide();
    } else {
      $(".compo_addcart_cls").show();
    }
  }

  componentDidUpdate() {
    var TotalCnt = $(".modifierList").length;
    var modProductSlug = $("#modProductSlug").val();
    if (
      TotalCnt > 0 &&
      this.state.mdfApi_call === "Yes" &&
      this.state.selectedProSlug === modProductSlug
    ) {
      this.checkProductPrice();
    }

    var $_reactThis = this;
    var individualComboCnt = $(".individual_combo_mdf").length;
    if (individualComboCnt > 0) {
      $(".main_combo_div").each(function () {
        $_reactThis.setModifierValFun($(this).find(".components_selct"));
      });

      if ($(".components_selct").length > 0) {
        $(".components_selct").each(function () {
          $_reactThis.setOverallSubmdfrPrice($(this));
        });
      }
    }

    var indlMinMxComboCnt = $(".individual_combo_pro").length;
    if (indlMinMxComboCnt > 0) {
      $(".main_combo_div").each(function () {
        var minselectcombo_txt =
          $(this).data("minselectcombo") != ""
            ? $(this).data("minselectcombo")
            : "0";
        var combopriceapply_txt =
          $(this).data("combopriceapply") != ""
            ? $(this).data("combopriceapply")
            : "0";
        if (
          parseInt(minselectcombo_txt) === 0 ||
          parseInt(combopriceapply_txt) === 1
        ) {
          $(this).find(".combo_pro_price").show();
        } else {
          if ($_reactThis.state.editProductID !== "") {
            $(this)
              .find(".individual_combo_pro")
              .each(function () {
                if (parseFloat($(this).data("invcomboprice")) > 0) {
                  $(this).find(".combo_pro_price").show();
                } else {
                  $(this)
                    .find(".individual_combo_pro")
                    .each(function () {
                      if (parseFloat($(this).data("invcomboprice")) > 0) {
                        $(this).find(".combo_pro_price").show();
                      } else {
                        $(this).find(".combo_pro_price").hide();
                      }
                    });

                  // $(this).find(".combo_pro_price").hide();
                }
              });
          } else {
            $(this)
              .find(".individual_combo_pro")
              .each(function () {
                if (parseFloat($(this).data("invcomboprice")) > 0) {
                  $(this).find(".combo_pro_price").show();
                } else {
                  $(this).find(".combo_pro_price").hide();
                }
              });
            //$(this).find(".combo_pro_price").hide();
          }
        }
      });
    }

    var minmaxMainCnt = $(".minmax_maincombo_div").length;
    var chkAplyModfInMinmax = 0;
    if (minmaxMainCnt > 0) {
      chkAplyModfInMinmax = $(".minmax_maincombo_div").find(
        ".components_selctbox_cls"
      ).length;
      this.updateProductPricefun();
    }

    var singleSelectCompo = $(".components_selctbox_cls").length;
    if (
      singleSelectCompo > 0 &&
      ((minmaxMainCnt === 0 &&
        indlMinMxComboCnt === 0 &&
        individualComboCnt === 0) ||
        chkAplyModfInMinmax > 0)
    ) {
      if ($(".components_selct").length > 0) {
        $(".components_selct").each(function () {
          $_reactThis.setOverallSubmdfrPrice($(this));
        });
      }
    }
  }

  closeModel() {
    this.setState({ editProductID: "", selectedProSlug: "" }, function () {
      this.props.sateValChange("closeedit", "Yes");
    });

    $(".main_combo_div").each(function () {
      var $_mainthis = $(this);
      $_mainthis.find(".individual_combo_pro").each(function () {
        var $_thisn = $(this);
        var currentQty = parseInt(
          $_thisn.find(".combolst_qty_value").attr("data-qtyval")
        );
        if (currentQty > 0) {
          for (let index = 0; index < currentQty; index++) {
            $_thisn.find(".qty_minus").trigger("click");
          }
        }
      });
    });
    var selectproQty = parseInt($(".compo_proqty_input").val());
    if (selectproQty > 1) {
      for (let index = 0; index < selectproQty - 1; index++) {
        $(".compo_addcart_cls .qty_minus").trigger("click");
      }
    }
  }

  render() {
    return (
      <div
        className="modal fade commom-modal-topcls prodetailinner-main-div"
        id="ProductDetailMdl"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-body">
              <div className="common-modal-head">
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-hidden="true"
                  onClick={this.closeModel.bind(this)}
                >
                  X
                </button>
              </div>

              {/* modal-detail-box start */}
              <div className="modal-detail-box">
                {this.productDetailsMain()}
              </div>
              {/* modal-detail-box end */}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateTopProps = (state) => {
  var proDateilArr = Array();
  var proCommonArr = Array();
  var prodetailstatus = "";
  if (Object.keys(state.productdetail).length > 0) {
    if (
      state.productdetail[0].status === "ok" &&
      Object.keys(state.productdetail[0].result_set).length > 0
    ) {
      proDateilArr = state.productdetail[0].result_set;
      proCommonArr = state.productdetail[0].common;
      prodetailstatus = "success";
    } else {
      prodetailstatus = "failure";
    }
  }

  return {
    productdetail: proDateilArr,
    productcommon: proCommonArr,
    productdetailstatus: prodetailstatus,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getProductDetail: (proSlug, field_name) => {
      if (proSlug !== undefined) {
        dispatch({ type: GET_PRODUCT_DETAIL, proSlug, field_name });
      }
    },
  };
};
export default connect(mapStateTopProps, mapDispatchToProps)(ProductDetail);
