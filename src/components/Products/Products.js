/* eslint-disable */
import React, { Component } from "react";
import cookie from "react-cookies";
import { connect } from "react-redux";
import update from "immutability-helper";

import Header from "../Layout/Header";
import Footer from "../Layout/Footer";
import MenuNavigation from "./MenuNavigation";
import ProductList from "./ProductList";
import ProductDetail from "./ProductDetail";
import { deliveryId } from "../Helpers/Config";
import { showLoader } from "../Helpers/SettingHelper";
import {
  GET_STATIC_BLOCK,
  GET_GLOBAL_SETTINGS,
  GET_MENU_NAVIGATION,
  GET_ZONE_DETAIL,
} from "../../actions";
import innerbanner from "../../common/images/inner-banner.jpg";
const isEqual = require("react-fast-compare");
var Parser = require("html-react-parser");
class Products extends Component {
  constructor(props) {
    super(props);
    this.state = {
      navigateMenu: [],
      selectedCategoryName: "",
      selectedNavigation: "",
      selectedSlugType: "",
      searchSubCat: "",
      searchProVal: "",
      viewProductSlug: "",
      catNavIndex: 0,
      catslugType: "",
      catslugValue: "",
      cartTriggerFlg: "No",
      productload: "Yes",
      editItemID: "",
      staticblacks: [],
      menuheader: "",
      imageLink: "",
    };

    var orderOutletId = cookie.load("orderOutletId");
    if (orderOutletId === "" || orderOutletId === undefined) {
      cookie.save("orderPopuptrigger", "Yes", { path: "/" });
      this.props.history.push("/");
      return;
    }

    this.props.getSettings();
    var availbty = cookie.load("defaultAvilablityId");
    var outltIdTxt =
      typeof cookie.load("orderOutletId") === "undefined"
        ? ""
        : cookie.load("orderOutletId");
    var zoneIdTxt =
      typeof cookie.load("orderZoneId") === "undefined"
        ? ""
        : cookie.load("orderZoneId");

    if (availbty === deliveryId && outltIdTxt !== "" && zoneIdTxt !== "") {
      this.state["delivery_outlet_id"] = outltIdTxt;
      this.props.getZoneDetail(outltIdTxt, zoneIdTxt);
    }
    this.props.getMenuNavigationList();
    this.props.getStaticBlock();
  }

  componentWillReceiveProps(nextProps) {
    let slugType =
      typeof this.props.match.params.slugType !== "undefined"
        ? this.props.match.params.slugType
        : "";
    let slugValue =
      typeof this.props.match.params.slugValue !== "undefined"
        ? this.props.match.params.slugValue
        : "";
    let proValue =
      typeof this.props.match.params.proValue !== "undefined"
        ? this.props.match.params.proValue
        : "";
    let selectedNavigation = nextProps.selectedNavigation;
    let selectedSlugType = nextProps.selectedSlugType;
    var searchSubCat = "";
    if (!isEqual(this.props.match.params, nextProps.match.params)) {
      slugType =
        typeof nextProps.match.params.slugType !== "undefined"
          ? nextProps.match.params.slugType
          : "";
      slugValue =
        typeof nextProps.match.params.slugValue !== "undefined"
          ? nextProps.match.params.slugValue
          : "";
      proValue =
        typeof nextProps.match.params.proValue !== "undefined"
          ? nextProps.match.params.proValue
          : "";
    }

    if (slugValue !== "") {
      if (slugType !== "category" && slugType !== "subcategory") {
        searchSubCat = slugValue;
        slugValue = slugType;
        slugType = "category";
        /*$('.search_result').hide();*/
        var tmpVl = "";
        $("#productsearch").val(tmpVl);
        $("#clearSearch").hide();
        $(".hsearch_sec").removeClass("open");
        $(".hsearch_trigger").removeClass("active");
        setTimeout(function () {
          $(window).scrollTo($("." + proValue), 100);
        }, 2000);
      }
      selectedNavigation = slugValue;
    }

    if (slugType === "") {
      slugType = selectedSlugType;
    }

    if (
      selectedNavigation !== this.state.selectedNavigation ||
      this.state.selectedCategoryName !== nextProps.selectedCatry
    ) {
      if (slugType === "subcategory") {
        var navIndex = nextProps.navigateMenu.findIndex(
          (p) => p.pro_subcate_slug == selectedNavigation
        );
        var categoryNameTxt =
          Object.keys(nextProps.navigateMenu).length > 0
            ? nextProps.navigateMenu[navIndex].subcategory_name
            : nextProps.selectedCatry;
      } else {
        var navIndex = nextProps.navigateMenu.findIndex(
          (p) => p.pro_cate_slug == selectedNavigation
        );
        var categoryNameTxt =
          Object.keys(nextProps.navigateMenu).length > 0
            ? nextProps.navigateMenu[navIndex].category_name
            : nextProps.selectedCatry;
      }

      this.setState({
        selectedNavigation: selectedNavigation,
        catNavIndex: navIndex,
        catslugType: slugType,
        catslugValue: slugValue,
        selectedCategoryName: categoryNameTxt,
        searchSubCat: searchSubCat,
        searchProVal: proValue,
      });
    }

    if (nextProps.staticblack !== this.state.staticblacks) {
      var menuheader = "";
      var imageLink = "";
      if (Object.keys(nextProps.staticblack).length > 0) {
        nextProps.staticblack.map((data) => {
          if (data.staticblocks_slug === "menu-header") {
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

  componentDidMount() {
    $(window).scroll(function () {
      var productlist_height = $(".productlist-main-div").offset();
      if (productlist_height !== undefined) {
        var mycustomscroll = $(".productlist-main-div").offset().top - 122,
          wind_toptxt = $(window).scrollTop();

        if (wind_toptxt > mycustomscroll) {
          $(".bakery_row").addClass("catogry_row_fixed");
        } else {
          $(".bakery_row").removeClass("catogry_row_fixed");
        }
      }
    });
    $(".product_search_result").hide();
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
    if (field === "productlist" && value !== "") {
      this.setState({
        searchProResult: value,
        selectedProResult: value,
      });
    }
    if (field === "setFiltetTag" && value !== "") {
      this.setState({
        setFiltetTag: value,
      });
    }
    if (field === "resetProduct" && value !== "") {
      this.setState({
        viewProductSlug: "",
      });
    }
    if (field === "editItemID") {
      this.setState({
        editItemID: value,
      });
    }
  };

  productFlageChange = (field, value) => {
    this.setState(
      update(this.state, { productflage: { [field]: { $set: value } } })
    );
  };

  openProDetailPopup() {
    showLoader("comboPro-" + this.state.viewProductSlug, "Idtext");
    $("#ProductDetailMdl").modal();
  }

  handleChange(section, event) {
    let filterTag = section.state.filterTag;
    if (event.target.checked === true) {
      filterTag.push(event.target.value);
    } else {
      var index = filterTag.indexOf(event.target.value);
      filterTag.splice(index, 1);
    }
    section.setState({ filterTag: filterTag, setFiltetTag: "Yes" });
  }

  render() {
    return (
      <div className="productpage-main-div">
        {/* Header start */}
        <Header
          cartTriggerFlg={this.state.cartTriggerFlg}
          sateValChange={this.sateValChange}
          showCatryName={this.state.selectedCategoryName}
        />
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

        {/* Header End */}
        <section className="menu-nav-section">
          <div className="container">
            <MenuNavigation
              {...this.props}
              productState={this.state}
              sateValChange={this.sateValChange}
            />
          </div>
        </section>
        <section className="product-menu-listing">
          <div className="container">
            <ProductList
              {...this.props}
              productState={this.state}
              sateValChange={this.sateValChange}
            />
          </div>
        </section>

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
  var tempArr = Array();
  var menu_slug = "";
  var menu_type = "";
  var navigateRst = Array();
  var navigateCmn = Array();
  var selectedCatry = "";
  if (Object.keys(state.product).length > 0) {
    var tempArr = !("menuNavigation" in state.product[0])
      ? Array()
      : state.product[0].menuNavigation;
    if (Object.keys(tempArr).length > 0) {
      if (tempArr[0].status === "ok") {
        navigateRst = tempArr[0].result_set;
        navigateCmn = tempArr[0].common;
        if (tempArr[0].result_set[0].menu_type == "main") {
          selectedCatry = tempArr[0].result_set[0].category_name;
          menu_slug = tempArr[0].result_set[0].pro_cate_slug;
          menu_type = "category";
        } else {
          selectedCatry = tempArr[0].result_set[0].subcategory_name;
          menu_slug = tempArr[0].result_set[0].pro_subcate_slug;
          menu_type = "subcategory";
        }
      }
    }
  }

  var zonedetailArr = Array();
  if (Object.keys(state.zonedetail).length > 0) {
    if (state.zonedetail[0].status === "ok") {
      zonedetailArr = state.zonedetail[0].result_set;
    }
  }

  var blacksArr = Array();
  if (Object.keys(state.staticblack).length > 0) {
    if (state.staticblack[0].status === "ok") {
      blacksArr = state.staticblack[0].result_set;
    }
  }

  return {
    globalsettings: state.settings,
    navigateMenu: navigateRst,
    navigateCommon: navigateCmn,
    selectedCatry: selectedCatry,
    selectedNavigation: menu_slug,
    selectedSlugType: menu_type,
    zonedetails: zonedetailArr,
    staticblack: blacksArr,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getSettings: () => {
      dispatch({ type: GET_GLOBAL_SETTINGS });
    },
    getZoneDetail: (outletId, zoneId) => {
      dispatch({ type: GET_ZONE_DETAIL, outletId, zoneId });
    },
    getMenuNavigationList: () => {
      dispatch({ type: GET_MENU_NAVIGATION });
    },
    getStaticBlock: () => {
      dispatch({ type: GET_STATIC_BLOCK });
    },
  };
};
export default connect(mapStateTopProps, mapDispatchToProps)(Products);
