/* eslint-disable */
import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import cookie from "react-cookies";
import axios from "axios";
import update from "immutability-helper";
import { setMinutes, setHours, getDay, format } from "date-fns";
var dateFormat = require("dateformat");

import {
  appId,
  apiUrl,
  apiUrlV2,
  deliveryId,
  pickupId,
  baseUrl,
  googleAppId,
  cookieDefaultConfig
} from "../Helpers/Config";

import {
  GET_GLOBAL_SETTINGS,
  GET_ZONE_DETAIL,
  GET_PICKUP_OUTLETS,
  GET_ALL_OUTLETS,
  DESTROY_CART_DETAIL,
  GET_LOGINDATA,
  GET_FBLOGINDATA,
  GET_GOOGLELOGINDATA,
  GET_FORGET_PASSWORD,
  GET_REGISTRATION,
  GET_MENUDATA,
  GET_ALLUSERSECADDRDATA,
} from "../../actions";
import {
  getReferenceID,
  showAlert,
  showLoader,
  hideLoader,
  getAliasName,
  stripslashes,
  removeOrderDateTime,
  removePromoCkValue,
  addressFormat,
} from "../Helpers/SettingHelper";

/* import MenuNavigationmob from "./MenuNavigation/MenuNavigationmob"; */
import OrderdatetimeSlot from "./OrderdatetimeSlot";
import OrderAdvancedDatetimeSlot from "./OrderAdvancedDatetimeSlot";
import {
  Login,
  Forgotpassword,
  Signup,
} from "../../components/Myaccount/Index";
import ProductDetail from "../Products/ProductDetail";
/* import images */
import mainLogo from "../../common/images/logo.png";
import iconUnhappy from "../../common/images/sad-smiley.png";
import iconWin from "../../common/images/icon-win.svg";
import warningImg from "../../common/images/warning.svg";

import avicon from "../../common/images/av-icon.png";
import loupe from "../../common/images/loupe.svg";
import loginav from "../../common/images/login-av.png";
import CartSideBar from "./CartSideBar";

import deliveryImg from "../../common/images/delivery-red.png";
import takeawayImg from "../../common/images/grocery.png";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      seletedAvilablityId: "",
      defaultAvilablityId:
        cookie.load("defaultAvilablityId") !== "" &&
          typeof cookie.load("defaultAvilablityId") !== undefined &&
          typeof cookie.load("defaultAvilablityId") !== "undefined"
          ? cookie.load("defaultAvilablityId")
          : "",
      seletedOutletId: "",
      order_tat_time: 0,
      globalsettings: [],
      secondaryaddresslist: [],
      deliveryOutlets: [],
      deliveryOutletsList: [],
      pickupOutlets: [],
      pickupOutletsList: [],
      delivery_outlet_id: "",
      searchProResult: [],
      selectedProResult: [],
      orderHandled: "",
      orderDeliveryAddress: "",
      nextavail: "",
      logindata: "",
      deliveryInfo: [],
      pickupInfo: [],
      /* For Advanced Slot Start */
      getDateTimeFlg: "",
      seleted_ord_date: "",
      seleted_ord_time: "",
      seleted_ord_slot: "",
      seleted_ord_slotTxt: "",
      seleted_ord_slot_str: "",
      seleted_ord_slot_end: "",
      isAdvanced: "no",
      slotType: "0",
      /* For Advanced Slot End */
      fields: {
        email: "",
        pin: "",
      },
      fieldsfgtpassword: {
        email: "",
      },
      fpstatus: "initiating",
      regstatus: "initiating",
      fieldssignup: {
        firstname: "",
        email: "",
        pin: "",
        rePin: "",
        mobile: "",
        pdpa_consent: "",
        terms: "",
      },
      menuData: [],
      googlelogin: "No",
      trigerGlogin: false,
      cartItem: "",
      editItemID: "",
    };

    this.props.getGlobalSettings();
    this.props.getPickupOutlets();
    this.props.getAllOutlets(deliveryId);
    this.props.getSecondaryAddress();

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
  }

  /*forget password  - start*/
  fieldforgot = (field, value) => {
    this.setState(
      update(this.state, { fieldsfgtpassword: { [field]: { $set: value } } })
    );
  };

  forgotpassword = () => {
    this.setState({ fpstatus: "loading" });
    const formPayload = this.state.fieldsfgtpassword;

    var qs = require("qs");
    var postObject = {
      app_id: appId,
      type: "web",
      email_address: formPayload.email,
      site_url: this.props.globalsettings[0].result_set.client_site_url,
    };

    showLoader("forgotpassword-cls", "class");
    this.props.getForgetPassword(qs.stringify(postObject));
  };
  /*forget password  - end*/

  /* signin - start*/
  fieldChange = (field, value) => {
    this.setState(update(this.state, { fields: { [field]: { $set: value } } }));
  };

  handleSignin = () => {
    const formPayload = this.state.fields;
    var qs = require("qs");
    var postObject = {
      app_id: appId,
      type: "web",
      logintype: "mobile",
      passwordtype: "pin",
      login_username: formPayload.email,
      login_password: formPayload.pin,
    };
    showLoader("login_submit", "class");
    this.props.getLoginData(qs.stringify(postObject));
  };
  /* signin - end*/

  /* for signup - start*/
  fieldChangeSignup = (field, value) => {
    if (field == "terms") {
      value = $("#terms").prop("checked");
    }
    if (field == "pdpa_consent") {
      value = $("#pdpa_consent").prop("checked");
    }
    this.setState(
      update(this.state, { fieldssignup: { [field]: { $set: value } } })
    );
  };

  handleSignup = () => {
    const formPayload = this.state.fieldssignup;
    this.setState({ regstatus: "loading" });

    var pdpaConsent = formPayload.pdpa_consent === true ? "yes" : "no";

    var qs = require("qs");
    var postObject = {
      app_id: appId,
      type: "web",
      registertype: "mobile",
      passwordtype: "pin",
      customer_first_name: formPayload.firstname,
      customer_email: formPayload.email,
      customer_pin: formPayload.pin,
      customer_phone: formPayload.mobile,
      customer_pdpa_consent: pdpaConsent,
      site_url: this.props.globalsettings[0].result_set.client_site_url,
    };

    showLoader("signup_submit", "class");
    this.props.getRegistration(qs.stringify(postObject));
  };
  /* for signup - end*/

  componentWillReceiveProps(PropsDt) {
    if (PropsDt.menudata !== this.props.menudata) {
      this.setState({ menudata: PropsDt.menudata[0].result_set });
    }

    if (PropsDt.outletslist !== this.state.pickupOutletsList) {
      this.setState({
        pickupOutlets: PropsDt.outletslist,
        pickupOutletsList: PropsDt.outletslist,
      });
    }

    if (PropsDt.alloutletslist !== this.state.deliveryOutletsList) {
      this.setState({
        deliveryOutlets: PropsDt.alloutletslist,
        deliveryOutletsList: PropsDt.outletslist,
      });
    }

    if (PropsDt.secondaryaddresslist !== this.state.secondaryaddresslist) {
      this.setState({ secondaryaddresslist: PropsDt.secondaryaddresslist });
    }

    if ("homePageState" in PropsDt) {
      if (
        PropsDt.homePageState.nextavail !== undefined &&
        PropsDt.homePageState.nextavail !== "" &&
        PropsDt.homePageState.nextavail !== this.state.nextavail
      ) {
        this.setState({ nextavail: PropsDt.homePageState.nextavail });
      }
    }

    if (PropsDt.fbloginData !== this.props.fbloginData) {
      this.doLogin(PropsDt.fbloginData);
    }

    if (this.state.googlestatus === "loading") {
      if (PropsDt.googlelogin !== undefined) {
        if (PropsDt.googlelogin.length > 0) {
          this.setState({ googlestatus: "ok" }, function () {
            this.doLogin(PropsDt.googlelogin[0]);
          });
        }
      }
    }
    if (PropsDt.logindata !== this.props.logindata) {
      this.doLogin(PropsDt.logindata[0]);
    }

    if (this.state.fpstatus === "loading") {
      if (PropsDt.forgetpassword !== undefined) {
        this.setState({ fpstatus: "ok" });
        this.showMessage(PropsDt.forgetpassword[0]);
      }
    }

    if (this.state.regstatus === "loading") {
      if (PropsDt.registration !== undefined) {
        this.setState({ regstatus: "ok" });
        this.showMessage(PropsDt.registration[0]);
      }
    }
  }

  /* main - menu navigation -start*/

  createLink(menu) {
    if (menu.nav_type === "0" && menu.nav_parent_title == "") {
      return (
        <Link to={"/page/" + menu.nav_title_slug} title={menu.nav_title}>
          <span>{menu.nav_title}</span>
        </Link>
      );
    } else if (menu.nav_type === "3" && menu.nav_parent_title == "") {
      var pageUrlTxt = menu.nav_pages;
      if (pageUrlTxt.includes("http")) {
        return (
          <a
            href={menu.nav_pages}
            title={menu.nav_title}
            target={menu.nav_link_type == "blank" ? "_blank" : ""}
          >
            <span>{menu.nav_title}</span>
          </a>
        );
      } else {
        return (
          <Link
            to={menu.nav_pages != "#" ? "/" + menu.nav_pages : ""}
            title={menu.nav_title}
            target={menu.nav_link_type == "blank" ? "_blank" : ""}
            onClick={this.openCategoryNav.bind(this, menu.nav_pages)}
          >
            <span>{menu.nav_title}</span>
          </Link>
        );
      }
    }
  }

  createSubmenu(menu, type) {
    if (menu.nav_parent_title === "") {
      if (this.state.menudata) {
        var checkIngVal = 0;
        var liTxt = this.state.menudata.map(function (menuparent, i) {
          if (menu.nav_id == menuparent.nav_parent_title) {
            checkIngVal = 1;
            if (menuparent.nav_type === "0") {
              return (
                <li key={i + 100}>
                  <Link
                    to={"/page/" + menuparent.nav_title_slug}
                    title={menuparent.nav_title}
                  >
                    <span>{menuparent.nav_title}</span>
                  </Link>
                </li>
              );
            } else {
              return (
                <li key={i + 100}>
                  <Link
                    to={
                      menuparent.nav_pages != "#"
                        ? "/" + menuparent.nav_pages
                        : ""
                    }
                    title={menuparent.nav_title}
                    target={menuparent.nav_link_type == "blank" ? "_blank" : ""}
                  >
                    <span>{menuparent.nav_title}</span>
                  </Link>
                </li>
              );
            }
          }
        }, this);

        if (type === "span" && checkIngVal === 1) {
          return <a href="/" className="submenu-arow disbl_href_action"></a>;
        } else if (type === "ul" && checkIngVal === 1) {
          return <ul className="submenu_list">{liTxt}</ul>;
        } else {
          return "";
        }
      }
    }
  }

  menuActiveCls(nav_pages) {
    var currenturl = window.location.href;
    var returnClsTx = "";
    if (nav_pages === "home" || nav_pages === "#") {
      returnClsTx =
        this.props.match.path === "/home" || this.props.match.path === "/"
          ? "active"
          : "";
    } else if (nav_pages === "products") {
      returnClsTx =
        this.props.match.path === "/products" ||
          this.props.match.path === "/products/:slugType/:slugValue" ||
          this.props.match.path === "/products/:slugType/:slugValue/:proValue" ||
          this.props.match.path === "/checkout" ||
          this.props.match.path === "/thankyou/:orderId"
          ? "active"
          : "";
    } else {
      returnClsTx = currenturl.includes(nav_pages) ? "active" : "";
    }
    return returnClsTx;
  }
  openCategoryNav(pageLink, event) {
    if (pageLink === "products") {
      if (
        cookie.load("defaultAvilablityId") !== "" &&
        typeof cookie.load("defaultAvilablityId") !== undefined &&
        typeof cookie.load("defaultAvilablityId") !== "undefined"
      ) {
      }
    }
  }

  listMainNavigation() {
    if (this.state.menudata) {
      return this.state.menudata.map(function (menu, i) {
        return (
          <li key={i + 100} className={this.menuActiveCls(menu.nav_pages)}>
            {this.createLink(menu)}
            {this.createSubmenu(menu, "span")}
            {this.createSubmenu(menu, "ul")}
          </li>
        );
      }, this);
    }
  }

  /* menu navigation -end */
  /* show message */
  showMessage(response) {
    hideLoader("signup_submit", "class");
    hideLoader("forgotpassword-cls", "class");
    if (response.status === "ok") {
      showAlert("Success", response.message);
    } else {
      if (response.form_error) {
        showAlert("Error", response.form_error);
      } else {
        showAlert("Error", response.message);
      }
    }
    $.magnificPopup.open({
      items: {
        src: ".alert_popup",
      },
      type: "inline",
    });
  }

  chooseAvailabilityFun(availability, event) {
    event.preventDefault();
    var defaultAvilTy = cookie.load("defaultAvilablityId");

    if (defaultAvilTy !== availability) {
      var cartTotalItems = cookie.load("cartTotalItems");
      cartTotalItems =
        cartTotalItems != "" && cartTotalItems != undefined
          ? parseInt(cartTotalItems)
          : 0;
      if (
        cookie.load("orderOutletId") != "" &&
        cookie.load("orderOutletId") != undefined
      ) {
        this.setState({ nextavail: availability });
        $.magnificPopup.open({
          items: {
            src: "#warning-popup",
          },
          type: "inline",
        });
        return false;
      }
    } else if (
      defaultAvilTy === availability &&
      cookie.load("orderOutletId") != "" &&
      cookie.load("orderOutletId") != undefined
    ) {
      /*$.magnificPopup.close();
      this.props.history.push('/products');
      return false;*/
    }

    var popupIdtxt = "";
    if (availability === deliveryId) {
      $(".delivery_outletpoup").find(".outlet_error").html("");
      popupIdtxt = "#delevery-postcode-popup";
    } else if (availability === pickupId) {
      popupIdtxt = "#takeaway-popup";
    }

    if (popupIdtxt !== "") {
      $.magnificPopup.open({
        items: {
          src: popupIdtxt,
        },
        type: "inline",
      });
    }
  }

  chooseAvailabilityMbl() {
    var availability = cookie.load("defaultAvilablityId");
    var showtext = "Order Now";
    if (availability === deliveryId) {
      showtext = "Delivery";
    } else if (availability === pickupId) {
      showtext = "Takeaway";
    }
    return showtext;
  }

  /* facebook login */
  responseFacebook = (response) => {
    if (
      response.name !== "" &&
      response.email !== "" &&
      response.name !== undefined &&
      response.email !== undefined
    ) {
      var vSplitName = response.name.split(" ");
      var firstname = vSplitName[0];
      var lastname = vSplitName[1];
      var birthday = response.birthday;
      var qs = require("qs");
      var photo = response.picture.data.url;
      /* update gender field */
      var postGender = "";
      if (
        typeof response.gender !== "undefined" &&
        response.gender === "male"
      ) {
        postGender = "M";
      } else if (
        typeof response.gender !== "undefined" &&
        response.gender === "female"
      ) {
        postGender = "F";
      }
      /* update DOB */
      var dob = "";
      if (typeof birthday !== "undefined" && birthday !== "") {
        dob = dateFormat(response.birthday, "yyyy-mm-dd");
      }

      var postObject = {
        app_id: appId,
        type: "web",
        login_firstname: response.first_name,
        login_lastname: response.last_name,
        login_username: response.email,
        customer_fb_id: response.id,
        customer_gender: postGender,
        customer_photo: photo,
        customer_dob: dob,
      };
      this.props.getFbLoginData(qs.stringify(postObject));
    }
  };

  /* for login and facebook login*/
  doLogin(fbloginData) {
    hideLoader("login_submit", "class");
    if (fbloginData.status === "ok") {
      $.magnificPopup.close();
      var mobileno = "",
        cust_birthdate = "";
      if (
        typeof fbloginData.result_set.customer_phone === "undefined" ||
        fbloginData.result_set.customer_phone === "null" ||
        fbloginData.result_set.customer_phone === ""
      ) {
        mobileno = "";
      } else {
        mobileno = fbloginData.result_set.customer_phone;
      }

      if (
        typeof fbloginData.result_set.customer_birthdate !== "undefined" &&
        fbloginData.result_set.customer_birthdate !== "null" &&
        fbloginData.result_set.customer_birthdate !== null &&
        fbloginData.result_set.customer_birthdate !== "" &&
        fbloginData.result_set.customer_birthdate !== "0000-00-00"
      ) {
        cust_birthdate = fbloginData.result_set.customer_birthdate;
      }
      cookie.save("UserId", fbloginData.result_set.customer_id, cookieDefaultConfig);
      cookie.save("UserEmail", fbloginData.result_set.customer_email, cookieDefaultConfig);
      cookie.save(
        "UserFname",
        fbloginData.result_set.customer_first_name !== ""
          ? fbloginData.result_set.customer_first_name
          : "",
        cookieDefaultConfig
      );
      cookie.save(
        "UserLname",
        fbloginData.result_set.customer_last_name !== ""
          ? fbloginData.result_set.customer_last_name
          : "",
        cookieDefaultConfig
      );
      cookie.save("UserMobile", mobileno, cookieDefaultConfig);
      cookie.save("UserBirthdate", cust_birthdate, cookieDefaultConfig);
      cookie.save(
        "UserDefaultAddress",
        fbloginData.result_set.customer_address_name,
        cookieDefaultConfig
      );
      cookie.save(
        "UserDefaultUnitOne",
        fbloginData.result_set.customer_address_line1,
        cookieDefaultConfig
      );
      cookie.save(
        "UserDefaultUnitTwo",
        fbloginData.result_set.customer_address_line2,
        cookieDefaultConfig
      );
      cookie.save(
        "UserDefaultPostalCode",
        fbloginData.result_set.customer_postal_code,
        cookieDefaultConfig
      );
      const { history } = this.props;

      var qs = require("qs");
      var postObject = {
        app_id: appId,
        reference_id: getReferenceID(),
        customer_id: fbloginData.result_set.customer_id,
        availability_id: cookie.load("defaultAvilablityId"),
      };

      axios
        .post(apiUrl + "cart/update_customer_info", qs.stringify(postObject))
        .then((res) => {
          showAlert("Success", "Logged in Successfully!");
          $.magnificPopup.open({
            items: {
              src: ".alert_popup",
            },
            type: "inline",
          });
          if (res.data.status === "ok") {
            if (cookie.load("loginpopupTrigger") === "fromcheckout") {
              cookie.remove("loginpopupTrigger", cookieDefaultConfig);
              history.push("/checkout");
            } else {
              history.push("/myaccount");
            }
          } else {
            history.push("/myaccount");
          }
        });
    } else {
      cookie.remove("loginpopupTrigger", cookieDefaultConfig);
      /*showAlert('Error', 'Invalid Login Credentials','trigger_login','#login-popup');*/
      showAlert("Error", fbloginData.message);
      $.magnificPopup.open({
        items: {
          src: ".alert_popup",
        },
        type: "inline",
      });
    }
  }

  /* Google Login */
  prepareLoginButton = () => {
    if (this.state.trigerGlogin == false) {
      this.setState({ trigerGlogin: true }, function () {
        setTimeout(function () {
          $(".loginBtn--google").trigger("click");
        }, 1000);
      });
    }
    var current = this;
    this.auth2.attachClickHandler(
      this.refs.googleLoginBtn,
      {},
      (googleUser) => {
        let profile = googleUser.getBasicProfile();
        var resultRes = {
          name: profile.getName(),
          email: profile.getEmail(),
          picture: profile.getImageUrl(),
          id: profile.getId(),
        };
        current.loginGoogle(resultRes);
      },
      (error) => {
        console.log(error, "googleerror");
        //alert(JSON.stringify(error, undefined, 2));
      }
    );
  };

  googleSDK() {
    window["googleSDKLoaded"] = () => {
      window["gapi"].load("auth2", () => {
        this.auth2 = window["gapi"].auth2.init({
          client_id: googleAppId,
          cookiepolicy: "single_host_origin",
          scope: "profile email",
        });

        this.prepareLoginButton();
      });
    };

    (function (d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = "https://apis.google.com/js/platform.js?onload=googleSDKLoaded";
      fjs.parentNode.insertBefore(js, fjs);
    })(document, "script", "google-jssdk");
  }

  loginGoogle(response) {
    if (
      response.name !== "" &&
      response.email !== "" &&
      response.name !== undefined &&
      response.email !== undefined
    ) {
      var vSplitName = response.name.split(" ");
      var firstname = vSplitName[0];
      var lastname = vSplitName[1];

      var qs = require("qs");
      var photo = response.picture;
      /* update gender field */

      var postObject = {
        app_id: appId,
        type: "web",
        login_firstname: firstname,
        login_lastname: lastname,
        login_username: response.email,
        customer_google_id: response.id,
        customer_photo: photo,
      };
      this.setState({ googlestatus: "loading" });
      this.props.getGoogleLoginData(qs.stringify(postObject));
    }
  }

  closepopup(event) {
    event.preventDefault();

    $.magnificPopup.open({
      items: {
        src: "#order-popup",
      },
      type: "inline",
    });
  }

  gobckOutletpopup() {
    $.magnificPopup.open({
      items: {
        src: "#delevery-popup",
      },
      type: "inline",
    });
  }

  gobckPkupOutletpopup() {
    $.magnificPopup.open({
      items: {
        src: "#takeaway-popup",
      },
      type: "inline",
    });
  }

  changeAvailability() {
    var tempArr = [],
      tempVl = "";
    this.setState({
      seletedOutletId: tempVl,
      deliveryInfo: tempArr,
      pickupInfo: tempArr,
      seleted_ord_date: tempVl,
      seleted_ord_time: tempVl,
    });

    /* For Advanced Slot Start */
    this.setState({
      seletedOutletId: tempVl,
      deliveryInfo: tempArr,
      pickupInfo: tempArr,
      seleted_ord_date: tempVl,
      seleted_ord_time: tempVl,
      slotType: tempVl,
      seleted_ord_slot: tempVl,
      seleted_ord_slotTxt: tempVl,
      seleted_ord_slot_str: tempVl,
      seleted_ord_slot_end: tempVl,
    });
    /* For Advanced Slot End */

    this.destroyCart("Yes");

    var popupIdtxt = "";
    if (this.state.nextavail === deliveryId) {
      popupIdtxt = "#delevery-postcode-popup";
    } else if (this.state.nextavail === pickupId) {
      popupIdtxt = "#takeaway-popup";
    } else {
      $.magnificPopup.close();
      popupIdtxt = "#order-popup";
      this.props.history.push("/");
    }

    if (popupIdtxt !== "") {
      $.magnificPopup.open({
        items: {
          src: popupIdtxt,
        },
        type: "inline",
      });
    }
  }

  destroyCart(clear = "No") {
    this.props.destroyCartDetail();
    this.deleteOrderCookie(clear);
  }

  deleteOrderCookie(clear = "Yes") {
    if (clear == "Yes") {
      cookie.remove("orderZoneId", cookieDefaultConfig);
      cookie.remove("orderOutletId", cookieDefaultConfig);
      cookie.remove("outletchosen", cookieDefaultConfig);
    }

    removeOrderDateTime();
    removePromoCkValue();

    cookie.remove("orderPaymentMode", cookieDefaultConfig);
    cookie.remove("orderTableNo", cookieDefaultConfig);
    cookie.remove("product_remarks", cookieDefaultConfig);
    cookie.remove("orderOutletName", cookieDefaultConfig);
    cookie.remove("carttotalitems", cookieDefaultConfig);
    cookie.remove("cartsubtotal", cookieDefaultConfig);
    cookie.remove("cartid", cookieDefaultConfig);
    cookie.remove("firstNavigation", cookieDefaultConfig);

    /* Delivery avilablity */
    cookie.remove("orderDateTime", cookieDefaultConfig);
    cookie.remove("deliveryDate", cookieDefaultConfig);
    cookie.remove("deliveryTime", cookieDefaultConfig);
    cookie.remove("unitNoOne", cookieDefaultConfig);
    cookie.remove("unitNoTwo", cookieDefaultConfig);

    /* For Advanced Slot */
    cookie.remove("isAdvanced", cookieDefaultConfig);
    cookie.remove("slotType", cookieDefaultConfig);
    cookie.remove("orderSlotVal", cookieDefaultConfig);
    cookie.remove("orderSlotTxt", cookieDefaultConfig);
    cookie.remove("orderSlotStrTime", cookieDefaultConfig);
    cookie.remove("orderSlotEndTime", cookieDefaultConfig);

    cookie.remove("promotion_id", cookieDefaultConfig);
    cookie.remove("promotion_applied", cookieDefaultConfig);
    cookie.remove("promotion_code", cookieDefaultConfig);
    cookie.remove("promotion_delivery_charge_applied", cookieDefaultConfig);
    cookie.remove("promotion_amount", cookieDefaultConfig);
    cookie.remove("promotion_category", cookieDefaultConfig);
    cookie.remove("prmo_type", cookieDefaultConfig);

    /*Remove voucher*/
    cookie.remove("voucher_applied", cookieDefaultConfig);
    cookie.remove("voucher_code", cookieDefaultConfig);
    cookie.remove("voucher_amount", cookieDefaultConfig);

    cookie.remove("points_redeemed", cookieDefaultConfig);
    cookie.remove("points_used", cookieDefaultConfig);
    cookie.remove("points_amount", cookieDefaultConfig);
    cookie.remove("prmo_type", cookieDefaultConfig);
  }

  /* find Zone*/
  findOutletBasedZone(first, availability) {
    if (first) {
      var postalcode = $("#postalcode").val();
    } else {
      var postalcode = $("#postalcode1").val();
    }

    /*  var outletIdTxt = this.state.delivery_outlet_id;

    if (outletIdTxt === "") {
      $(".postal_error").html(
        '<span class="error">Go Back and Select your delivery outlet.</span>'
      );
      return false;
    } */

    if (postalcode.length < 5) {
      $(".postal_error").html(
        '<span class="error">Please enter valid postal code.</span>'
      );
      return false;
    }

    showLoader("delivery_submit_cls", "class");

    axios
      .all([
        axios.get(
          apiUrlV2 +
          "outlets/findOutletZone?app_id=" +
          appId +
          "&skip_timing=Yes&availability_id=" +
          availability +
          "&postal_code=" +
          postalcode +
          "&&postalcode_basedoutlet=yes"
        ),
      ])
      .then(
        axios.spread((res, timeslt) => {
          var deliveryInfo = [];
          /* Success response */
          if (res.data.status === "ok") {
            cookie.save("outletchosen", availability, cookieDefaultConfig);

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
                    hideLoader("delivery_submit_cls", "class");
                    $.magnificPopup.close();
                    /* Success time slot response */
                    if (timeslt.data.status === "success") {
                      /* For Advanced Slot */
                      var isAdvanced = timeslt.data.isAdvanced,
                        slotType = "0";
                      if (isAdvanced === "yes") {
                        slotType = timeslt.data.slotType;
                      }
                      this.setState({
                        getDateTimeFlg: "yes",
                        isAdvanced: isAdvanced,
                        slotType: slotType,
                      });
                      removeOrderDateTime();
                      removePromoCkValue();

                      $.magnificPopup.open({
                        items: {
                          src: "#awesome-popup",
                        },
                        type: "inline",
                      });
                    } else {
                      $.magnificPopup.open({
                        items: {
                          src: "#outlet-error-popup",
                        },
                        type: "inline",
                      });
                    }
                  });
              }
            );
          }

          /* Error response */
          if (res.data.status === "error") {
            this.setState({ deliveryInfo: deliveryInfo });
            hideLoader("delivery_submit_cls", "class");
            $.magnificPopup.close();
            $.magnificPopup.open({
              items: {
                src: "#error-postal-popup",
              },
              type: "inline",
            });

            if (first === 0) {
              var mgsTxt =
                res.data.message !== ""
                  ? res.data.message
                  : "Please enter valid postal code.";
              $(".postal_error").html(
                '<span class="error">' + mgsTxt + "</span>"
              );
            }
          }
        })
      );
  }
  /* Select outlet */
  selectOutlet(first, availability) {
    if (first) {
      var postalcode = $("#postalcode").val();
    } else {
      var postalcode = $("#postalcode1").val();
    }

    if (postalcode.length < 5) {
      $(".postal_error").html(
        '<span class="error">Please enter valid postal code.</span>'
      );
      return false;
    }

    showLoader("delivery_submit_cls", "class");

    axios
      .get(
        apiUrl +
        "outlets/find_outlet?skip_timing=Yes&app_id=" +
        appId +
        "&availability_id=" +
        availability +
        "&postal_code=" +
        postalcode
      )
      .then((res) => {
        hideLoader("delivery_submit_cls", "class");

        /* Success response */
        if (res.data.status === "ok") {
          $.magnificPopup.close();
          cookie.save("outletchosen", availability, cookieDefaultConfig);
          var orderDeliveryAddress =
            res.data.result_set.postal_code_information.zip_buno +
            " " +
            res.data.result_set.postal_code_information.zip_sname;
          var orderHandled =
            stripslashes(res.data.result_set.outlet_name) +
            ", Crew will be seeing you in " +
            res.data.result_set.outlet_delivery_timing +
            " Minutes";
          this.setState({
            orderDeliveryAddress:
              orderDeliveryAddress +
              " Singapore " +
              res.data.result_set.postal_code_information.zip_code,
          });
          this.setState({ orderHandled: orderHandled });
          cookie.save("orderOutletId", res.data.result_set.outlet_id, cookieDefaultConfig);
          cookie.save(
            "orderOutletName",
            stripslashes(res.data.result_set.outlet_name),
            cookieDefaultConfig
          );
          cookie.save(
            "orderPostalCode",
            res.data.result_set.postal_code_information.zip_code,
            cookieDefaultConfig
          );
          cookie.save("orderTAT", res.data.result_set.outlet_delivery_timing, cookieDefaultConfig);
          cookie.save("orderDeliveryAddress", orderDeliveryAddress, cookieDefaultConfig);
          cookie.save("orderHandled", orderHandled, cookieDefaultConfig);
          cookie.save("defaultAvilablityId", availability, cookieDefaultConfig);

          var orderHandledText =
            res.data.result_set.outlet_address_line1 +
            " " +
            res.data.result_set.outlet_address_line2 +
            ", Singapore " +
            postalcode;
          cookie.save("orderHandledByText", orderHandledText, cookieDefaultConfig);

          removeOrderDateTime();
          removePromoCkValue();

          $.magnificPopup.open({
            items: {
              src: "#awesome-popup",
            },
            type: "inline",
          });
        }

        /* Error response */
        if (res.data.status === "error") {
          $.magnificPopup.close();
          $.magnificPopup.open({
            items: {
              src: "#error-postal-popup",
            },
            type: "inline",
          });

          if (first === 0) {
            var mgsTxt =
              res.data.message !== ""
                ? res.data.message
                : "Please enter valid postal code.";
            $(".postal_error").html(
              '<span class="error">' + mgsTxt + "</span>"
            );
          }
        }
      });
  }

  gotoProducts() {
    if (
      cookie.load("orderOutletId") == undefined ||
      cookie.load("orderOutletId") == ""
    ) {
      $(".outlet_error").html(
        '<span class="error"> Please choose one outlet.</span>'
      );
    } else {
      cookie.save("outletchosen", cookie.load("defaultAvilablityId"), cookieDefaultConfig);
      $.magnificPopup.close();
      if (cookie.load("popuptriggerFrom") === "FeaturedPro") {
        cookie.remove("popuptriggerFrom", cookieDefaultConfig);
        this.props.history.push("/");
      } else {
        this.props.history.push("/products");
      }
    }
  }

  selectDatetm() {
    var seletedOutletId = this.state.seletedOutletId;
    var pickupInfo = this.state.pickupInfo;
    if (seletedOutletId !== "" && Object.keys(pickupInfo).length > 0) {
      showLoader("takeaway-btn-act", "class");

      axios
        .get(
          apiUrlV2 +
          "settings/chkTimeslotIsAvaiable?app_id=" +
          appId +
          "&availability_id=" +
          pickupId +
          "&outletId=" +
          seletedOutletId
        )
        .then((res) => {
          hideLoader("takeaway-btn-act", "class");

          /* Success response */
          if (res.data.status === "success") {
            /* For Advanced Slot */
            var isAdvanced = res.data.isAdvanced,
              slotType = "0";
            if (isAdvanced === "yes") {
              slotType = res.data.slotType;
            }
            this.setState({
              getDateTimeFlg: "yes",
              isAdvanced: isAdvanced,
              slotType: slotType,
            });

            removeOrderDateTime();
            removePromoCkValue();

            $.magnificPopup.open({
              items: {
                src: "#awesome-popup",
              },
              type: "inline",
            });
          } else {
            $.magnificPopup.open({
              items: {
                src: "#outlet-error-popup",
              },
              type: "inline",
            });
          }
        });
    } else {
      $(".outlet_error").html(
        '<span class="error"> Please choose one outlet.</span>'
      );
    }
  }

  selectDlyOutlet() {
    if (this.state.delivery_outlet_id === "") {
      $(".delivery_outletpoup")
        .find(".outlet_error")
        .html('<span class="error"> Please choose one outlet.</span>');
    } else {
      $.magnificPopup.close();
      $.magnificPopup.open({
        items: {
          src: "#delevery-postcode-popup",
        },
        type: "inline",
      });
    }
  }

  handleKeyPress = (event) => {
    var value = event.target.value.toLowerCase(),
      matches = this.state.pickupOutletsList.filter(function (item) {
        return (
          item.outlet_address_line1.substring(0, value.length).toLowerCase() ===
          value ||
          item.outlet_postal_code.substring(0, value.length).toLowerCase() ===
          value ||
          stripslashes(item.outlet_name)
            .substring(0, value.length)
            .toLowerCase() === value
        );
      });

    this.setState({ pickupOutlets: matches });
  };

  /* load outlets  */
  loadOutletsList() {
    if (Object.keys(this.state.pickupOutlets).length > 0) {
      return this.state.pickupOutlets.map((loaddata, index) => (
        <li key={index} className={this.activeOutlet(loaddata.outlet_id)}>
          <a href="/" onClick={this.pickOutlet.bind(this, loaddata)}>
            {stripslashes(loaddata.outlet_name)},{" "}
            {loaddata.outlet_address_line1},{" "}
            {this.showUnitNum(
              loaddata.outlet_unit_number1,
              loaddata.outlet_unit_number2
            )}
            Singapore {loaddata.outlet_postal_code}
          </a>
        </li>
      ));
    } else {
      return (
        <li>
          <a>No Outlet found</a>
        </li>
      );
    }
  }

  activeOutlet(outletID) {
    var seletedOutletId = this.state.seletedOutletId;
    var pickupInfo = this.state.pickupInfo;
    var actTxt =
      parseInt(seletedOutletId) === parseInt(outletID) &&
        Object.keys(pickupInfo).length > 0
        ? "active"
        : "";
    return actTxt;
  }

  handleKeyPressDly = (event) => {
    var value = event.target.value.toLowerCase(),
      matches = this.state.deliveryOutletsList.filter(function (item) {
        return (
          item.outlet_address_line1.substring(0, value.length).toLowerCase() ===
          value ||
          item.outlet_postal_code.substring(0, value.length).toLowerCase() ===
          value ||
          stripslashes(item.outlet_name)
            .substring(0, value.length)
            .toLowerCase() === value
        );
      });

    this.setState({ deliveryOutlets: matches });
  };

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

  /* load delivery outlets  */
  loadDeliveryOutletsList() {
    if (Object.keys(this.state.deliveryOutlets).length > 0) {
      return this.state.deliveryOutlets.map((loaddata, index) => (
        <li key={index} className={this.activeDlyOutlet(loaddata.outlet_id)}>
          <a href="/" onClick={this.deliveryOutlet.bind(this, loaddata)}>
            {stripslashes(loaddata.outlet_name)},{" "}
            {loaddata.outlet_address_line1},{" "}
            {this.showUnitNum(
              loaddata.outlet_unit_number1,
              loaddata.outlet_unit_number2
            )}
            Singapore {loaddata.outlet_postal_code}
          </a>
        </li>
      ));
    } else {
      return (
        <li>
          <a>No Outlet found</a>
        </li>
      );
    }
  }

  activeDlyOutlet(outletID) {
    var orderOutletId =
      this.state.delivery_outlet_id !== ""
        ? this.state.delivery_outlet_id
        : cookie.load("orderOutletId");

    return orderOutletId === outletID ? "active" : "";
  }

  /* pick outlet */
  pickOutlet(loaddata, event) {
    event.preventDefault();
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
    pickupInfo["orderOutletId"] = loaddata.outlet_id;
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
        this.selectDatetm();
      }.bind(this)
    );
  }

  deliveryOutlet(loaddata, event) {
    event.preventDefault();
    $(".delivery_outletpoup").find(".outlet_error").html("");
    this.setState(
      { delivery_outlet_id: loaddata.outlet_id },
      function () {
        this.selectDlyOutlet();
      }.bind(this)
    );
  }

  trgContinuBtn(idTxt) {
    $("#" + idTxt).trigger("click");
  }

  componentDidMount() {
    if (
      cookie.load("openLogin") !== undefined &&
      typeof cookie.load("openLogin") !== undefined &&
      typeof cookie.load("openLogin") !== "undefined"
    ) {
      cookie.remove("openLogin", cookieDefaultConfig);
      $.magnificPopup.open({
        items: {
          src: "#login-popup",
        },
        type: "inline",
      });
    }

    if (this.props.match.path === "/sign-in") {
      $.magnificPopup.open({
        items: {
          src: "#signup-popup",
        },
        type: "inline",
      });
    }

    $(".custom_close").click(function (e) {
      e.preventDefault();
      $(".custom_alertcls, .custom_center_alertcls").hide();
    });

    $("html, body").animate(
      {
        scrollTop: $("body").offset().top,
      },
      100
    );

    $(".test-popup-link").magnificPopup({
      type: "image",
      showCloseBtn: true,
      verticalFit: true,
      callbacks: {
        change: function () {
          this.wrap.addClass("awardpopup");
        },
      },
      // other options
    });

    this.props.getMenuData("grains-header-menu");
    if ($(".open-popup-link").length > 0) {
      $(".open-popup-link").magnificPopup({
        type: "inline",
        midClick: true,
      });
    }

    if ($(".trigger_login").length > 0) {
      $(".trigger_login").magnificPopup({
        type: "inline",
        midClick: true,
      });
    }

    /* Input lable animation */
    if ($(".input-focus").length > 0) {
      $(".input-focus").focus(function () {
        $(this).parents(".focus-out").addClass("focused");
      });
      $(".input-focus").blur(function () {
        var inputValue = $(this).val();
        if (inputValue == "") {
          $(this).removeClass("filled");
          $(this).parents(".focus-out").removeClass("focused");
        } else {
          $(this).addClass("filled");
        }
      });
    }

    if ($(".hsearch_trigger").length > 0) {
      $(".hsearch_trigger").click(function (e) {
        e.preventDefault();
        e.stopPropagation();
        $(".search_result").hide();
        $(this).toggleClass("active");
        $(".hsearch_sec").toggleClass("open");
        $(".hsearch_sec .form-control").focus();
      });
      $(document).click(function (e) {
        if (
          !$(e.target).is(".hsearch_trigger, .hsearch_sec, .hsearch_sec * ")
        ) {
          if ($(".hsearch_sec").is(":visible")) {
            $(".hsearch_sec").removeClass("open");
            $(".hsearch_trigger").removeClass("active");
            $(".hsearch_sec .form-control").blur();
          }
        }
      });
    }

    if ($(".hsearch_trigger_mbl").length > 0) {
      $(".hsearch_trigger_mbl").click(function (e) {
        e.preventDefault();
        e.stopPropagation();
        $(".search_result_mbl").hide();
        $(this).toggleClass("active");
        $(".hsearch_sec_mbl").toggleClass("open");
        $(".hsearch_sec_mbl .form-control").focus();
      });
      $(document).click(function (e) {
        if (
          !$(e.target).is(
            ".hsearch_trigger_mbl, .hsearch_sec_mbl, .hsearch_sec_mbl * "
          )
        ) {
          if ($(".hsearch_sec_mbl").is(":visible")) {
            $(".hsearch_sec_mbl").removeClass("open");
            $(".hsearch_trigger_mbl").removeClass("active");
            $(".hsearch_sec_mbl .form-control").blur();
          }
        }
      });
    }

    if ($(".mobile_mainacc_menutrigger").length > 0) {
      $(".mobile_mainacc_menutrigger").click(function (e) {
        e.stopPropagation();
        if ($(".mobile_mainacc_menulist").is(":visible")) {
          $(".mobile_mainacc_menulist").hide();
        } else {
          $(".mobile_mainacc_menulist").show();
        }
      });
      $(document).click(function (e) {
        if (!$(e.target).is(".mobile_account_item, .mobile_account_item * ")) {
          if ($(".mobile_mainacc_menulist").is(":visible")) {
            $(".mobile_mainacc_menulist").hide();
          }
        }
      });
    }

    /*NEW MENU SECTION*/
    if ($(".mobile_account_menu_click").length > 0) {
      $(".mobile_account_menu_click").click(function (e) {
        e.preventDefault();
        e.stopPropagation();
        $(".mobile_account_menu").slideToggle();
      });
      $(document).click(function (e) {
        if (!$(e.target).is(".arrow_myaccount, .mobile_account_menu_col")) {
          if ($(".mobile_account_menu").is(":visible")) {
            $(".mobile_account_menu").slideToggle();
          }
        }
      });
    }

    /* Mobile header menu */
    $(".hcategory_trigger").click(function () {
      $(this).toggleClass("active");
      $(".hcategory_menu").toggleClass("open");
    });

    $(document).click(function (e) {
      if (!$(e.target).is(".hcategory_trigger")) {
        if ($(".hcategory_menu").hasClass("open")) {
          $(".hcategory_menu").removeClass("open");
          $(".hcategory_trigger").removeClass("active");
        }
      }
    });

    $(".disbl_href_action").click(function (e) {
      e.preventDefault();
    });

    /*this.getOptions.bind(this,"mill");*/
    this.getSearchProductList();
  }

  componentDidUpdate() { }

  getSearchProductList() {
    var orderOutletIdtext = cookie.load("orderOutletId");
    var addquery_txt = "";
    if (typeof orderOutletIdtext !== "undefined" && orderOutletIdtext !== "") {
      addquery_txt = "&outletId=" + orderOutletIdtext;
    }
    var searchResult = [];
    return axios
      .get(
        apiUrlV2 +
        "products/search_products?app_id=" +
        appId +
        "&status=A&availability=" +
        cookie.load("defaultAvilablityId") +
        addquery_txt
      )
      .then((response) => {
        if (response.data.status === "ok") {
          var resultData = response.data.result_set;
          for (var key in resultData) {
            var subcatListArr = !("product_list" in resultData[key])
              ? Array()
              : resultData[key].product_list;

            if (Object.keys(subcatListArr).length > 0) {
              if (Object.keys(subcatListArr[0]).length > 0) {
                var subCatArr = !("subcategorie" in subcatListArr[0][0])
                  ? Array()
                  : subcatListArr[0][0].subcategorie;

                for (var sctkey in subCatArr) {
                  var productsArr = !("products" in subCatArr[sctkey])
                    ? Array()
                    : subCatArr[sctkey].products;
                  for (var prokey in productsArr) {
                    var proNameTxt = getAliasName(
                      productsArr[prokey].product_alias,
                      productsArr[prokey].product_name
                    );
                    searchResult.push({
                      cate_slug: subCatArr[sctkey].pro_cate_slug,
                      subcate_slug: subCatArr[sctkey].pro_subcate_slug,
                      value: productsArr[prokey].product_slug,
                      label: stripslashes(proNameTxt),
                    });
                  }
                }
              }
            }
          }
        }
        if (
          this.props.match.path === "/products/:slugType/:slugValue" ||
          this.props.match.path === "/products"
        ) {
          this.props.sateValChange("productlist", searchResult);
        }

        this.setState({
          searchProResult: searchResult,
          selectedProResult: searchResult,
        });
      });
  }

  searchProKeyPress = (event) => {
    $(".search_result").show();

    var value = event.target.value.toLowerCase(),
      matches = this.state.searchProResult.filter(function (item) {
        return item.label.substring(0, value.length).toLowerCase() === value;
      });

    $("#clearSearch").show();
    if (value === "") {
      $("#clearSearch").hide();
    }

    this.setState({ selectedProResult: matches });
  };

  /* load product search result  */
  loadProSearchList() {
    if (Object.keys(this.state.selectedProResult).length > 0) {
      return this.state.selectedProResult.map((loaddata, index) => (
        <li key={index}>
          <Link
            to={
              "/products/" +
              loaddata.cate_slug +
              "/" +
              loaddata.subcate_slug +
              "/" +
              loaddata.value
            }
            title="Product Details"
          >
            {loaddata.label}
          </Link>
        </li>
      ));
    } else {
      return <li className="no-pro-found">No Product found</li>;
    }
  }

  clearSearchFun() {
    var emtytxt = "";
    $(".productsearch").val(emtytxt);
    this.setState({ selectedProResult: this.state.searchProResult });
  }

  getOptions = (input) => {
    var searchProResult = this.state.searchProResult;
    var searchResult = [];
    /*if (Object.keys(searchProResult).length > 0) {*/
    /*searchProResult.map((loadData) =>
        searchResult.push({ value: loadData.value, label: loadData.label })
       );*/
    searchResult.push({ value: "wqewrr", label: "fish cury" });
    searchResult.push({ value: "werew3", label: "fish cury2" });
    console.log("wlll");
    console.log(searchResult);
    console.log("input");
    console.log(input);
    return { options: searchResult };
    /*}*/
  };

  ViewProducts(event) {
    var productSlug = event.value;
    this.props.history.push("/products/cat-ftrpro/slug-ftrpro/" + productSlug);
  }

  checkAblBtn() {
    var availability = cookie.load("defaultAvilablityId");
    var orderOutletId = cookie.load("orderOutletId");
    var actText = "Order Now";
    if (
      availability === deliveryId &&
      orderOutletId !== "" &&
      orderOutletId !== undefined
    ) {
      actText = "Delivery";
    } else if (
      availability === pickupId &&
      orderOutletId !== "" &&
      orderOutletId !== undefined
    ) {
      actText = "Takeaway";
    }
    return (
      <a
        href="/"
        onClick={this.closepopup.bind(this)}
        className="hordertype_btn"
        title={actText}
      >
        {actText}
      </a>
    );
  }

  checkActiveDivHd(avlType) {
    var clsTxt = "ordericon_link ";
    var availability = cookie.load("defaultAvilablityId");
    var orderOutletId = cookie.load("orderOutletId");
    if (
      availability == avlType &&
      orderOutletId !== "" &&
      orderOutletId !== undefined
    ) {
      clsTxt += "active";
    }
    return clsTxt;
  }

  checkActiveDivMbl(avlType) {
    var clsTxt = "";
    var availability = cookie.load("defaultAvilablityId");
    var orderOutletId = cookie.load("orderOutletId");
    if (
      availability == avlType &&
      orderOutletId !== "" &&
      orderOutletId !== undefined
    ) {
      clsTxt += "active";
    }
    return clsTxt;
  }

  myAccountAction() {
    var currenturl = window.location.href;
    var substringtxt = "myaccount";

    if (currenturl.includes(substringtxt) !== true) {
      return (
        <div>
          <a
            href={baseUrl + "myaccount"}
            className="myacunt_act"
            title="My Account"
          >
            {" "}
            My Account{" "}
          </a>
          <span className="mobile_mainacc_menutrigger"></span>
        </div>
      );
    } else {
      return (
        <div>
          <a className="myacunt_act disbl_href_action" href="/">
            {" "}
            My Account{" "}
          </a>
          <span className="mobile_mainacc_menutrigger"></span>
        </div>
      );
    }
  }

  changPostalValue(type, pstVl) {
    if (type === 1) {
      $("#postalcode").val(pstVl);
    } else {
      $("#postalcode1").val(pstVl);
    }
  }

  userAddressList(typeTxt) {
    if (this.state.secondaryaddresslist.length > 0) {
      var addListTxt = this.state.secondaryaddresslist.map((addr, index) => (
        <div className="address_linfo" key={typeTxt + "-" + index}>
          <div className="custom_radio">
            <input
              type="radio"
              name={"address_chk" + typeTxt}
              value={addr.postal_code}
              className="address_chk"
              onChange={this.changPostalValue.bind(
                this,
                typeTxt,
                addr.postal_code
              )}
            />
            <span>
              {addressFormat(
                addr.unit_code,
                addr.unit_code2,
                addr.address,
                addr.country,
                addr.postal_code
              )}
            </span>
          </div>
        </div>
      ));

      return (
        <div>
          {addListTxt}
          <div className="address_linfo" key={typeTxt + "dfl"}>
            <div className="custom_radio">
              <input
                type="radio"
                name={"address_chk" + typeTxt}
                value=""
                defaultChecked={true}
                className="address_chk"
                onChange={this.changPostalValue.bind(this, typeTxt, "")}
              />
              <span>Enter New Address</span>
            </div>
          </div>
        </div>
      );
    } else {
      return "";
    }
  }
  /* For Advanced Slot */
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
    } else if (field == "triggerErrorPopup") {
      $.magnificPopup.open({
        items: {
          src: "#outlet-error-popup",
        },
        type: "inline",
      });
    }
  };

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
        var OrderDate = format(seletedOrdDate, "yyyy-MM-dd");
        /* For Advanced Slot */
        var OrderHours = seletedOrdTime.getHours();
        var OrderMunts = seletedOrdTime.getMinutes();
        var OrderSecnd = seletedOrdTime.getSeconds();
        var orderDateTime = new Date(OrderDate);
        orderDateTime.setHours(OrderHours);
        orderDateTime.setMinutes(OrderMunts);
        orderDateTime.setSeconds(OrderSecnd);

        var deliveryDate = format(seletedOrdDate, "dd/MM/yyyy");
        var deliveryTime =
          this.convPad(OrderHours) +
          ":" +
          this.convPad(OrderMunts) +
          ":" +
          this.convPad(OrderSecnd);
        cookie.save("orderDateTime", orderDateTime, cookieDefaultConfig);
        cookie.save("deliveryDate", deliveryDate, cookieDefaultConfig);
        cookie.save("deliveryTime", deliveryTime, cookieDefaultConfig);

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
        cookie.save("isAdvanced", isAdvanced, cookieDefaultConfig);
        cookie.save("slotType", slotType, cookieDefaultConfig);
        cookie.save("orderSlotVal", orderSlotVal, cookieDefaultConfig);
        cookie.save("orderSlotTxt", orderSlotTxt, cookieDefaultConfig);
        cookie.save("orderSlotStrTime", orderSlotStrTime, cookieDefaultConfig);
        cookie.save("orderSlotEndTime", orderSlotEndTime, cookieDefaultConfig);
        /* For Advanced Slot End */

        if (this.state.seletedAvilablityId === deliveryId) {
          cookie.save("orderZoneId", orderInfoData["orderZoneId"], cookieDefaultConfig);
          cookie.save(
            "orderDeliveryAddress",
            orderInfoData["orderDeliveryAddress"],
            cookieDefaultConfig
          );
        }

        cookie.save("orderOutletId", orderInfoData["orderOutletId"], cookieDefaultConfig);
        cookie.save("orderOutletName", orderInfoData["orderOutletName"], cookieDefaultConfig);
        cookie.save("orderPostalCode", orderInfoData["orderPostalCode"], cookieDefaultConfig);
        cookie.save("orderTAT", orderInfoData["orderTAT"], cookieDefaultConfig);
        cookie.save("orderHandled", orderInfoData["orderHandled"], cookieDefaultConfig);
        cookie.save(
          "defaultAvilablityId",
          orderInfoData["defaultAvilablityId"],
          cookieDefaultConfig
        );
        cookie.save("orderHandledByText", orderInfoData["orderHandledByText"], cookieDefaultConfig);
        cookie.save("outletchosen", orderInfoData["defaultAvilablityId"], cookieDefaultConfig);

        $.magnificPopup.close();
        if (cookie.load("popuptriggerFrom") === "FeaturedPro") {
          cookie.remove("popuptriggerFrom", cookieDefaultConfig);
          this.props.history.push("/");
        } else {
          if (
            this.props.match.path === "/products" ||
            this.props.match.path ===
            "/products/:slugType/:slugValue/:proValue" ||
            this.props.match.path === "/products/:slugType/:slugValue"
          ) {
            location.reload();
          } else {
            this.props.history.push("/products");
          }
        }
      } else {
        $.magnificPopup.open({
          items: {
            src: "#outlet-error-popup",
          },
          type: "inline",
        });
      }
    } else {
      $(".ordrdatetime_error").html(
        '<span class="error"> Please select order date and time.</span>'
      );
    }
  }

  convPad(d) {
    return d < 10 ? "0" + d.toString() : d.toString();
  }

  searBlkFun(typeTxt) {
    var defaultAvilTyId = cookie.load("defaultAvilablityId");
    var liTopCls = "htico_search";
    var scearDivTopCls = "hsearch_sec";
    var triggerActCls = "hsearch_trigger";
    var searchResultCls = "search_result";
    var searchIconcls = "search_i_icon";
    if (typeTxt === "mbl") {
      liTopCls = "htico_search_mbl";
      scearDivTopCls = "hsearch_sec_mbl";
      triggerActCls = "hsearch_trigger_mbl";
      searchResultCls = "search_result_mbl";
      searchIconcls = "fa fa-search";
    }

    return (
      <li className={liTopCls}>
        {cookie.load("orderOutletId") !== undefined && (
          <a href="/" className={triggerActCls} title="Search">
            <img src={loupe} alt="" />
          </a>
        )}

        {cookie.load("orderOutletId") === undefined && (
          <a
            href="#order-popup"
            data-effect="mfp-zoom-in"
            className={triggerActCls + " open-popup-link"}
            title="Search"
          >
            <img src={loupe} alt="" />
          </a>
        )}

        <div className={scearDivTopCls}>
          <div className="input-sec">
            <input
              type="text"
              name="searchkey"
              className="productsearch"
              id={"productsearch_" + typeTxt}
              placeholder="Search..."
              onKeyUp={this.searchProKeyPress}
            />

            <a
              href="/"
              id="clearSearch"
              onClick={this.clearSearchFun.bind(this)}
              className="search_text_clear disbl_href_action"
            >
              X
            </a>
          </div>

          <ul className={searchResultCls} id={searchResultCls}>
            {this.loadProSearchList()}
          </ul>
        </div>
      </li>
    );
  }

  sateValChange = (field, value) => {
    if (field === "cartflg") {
      this.setState({ cartTriggerFlg: value });
    }
    if (field === "closeedit") {
      this.setState(
        { editItemID: "", editProductID: "", viewProductSlug: "" },
        function () {
          this.props.sateValChange("editItemID", "");
        }
      );
    }
  };
  prpStateCartChange = (field, value) => {
    if (field === "cartedit" && value !== "") {
      var editValue = value.split("_");
      this.props.sateValChange("editItemID", editValue[0]);
      this.setState(
        { editItemID: editValue[0], editProductID: editValue[1] },
        function () {
          this.setState(
            { editItemID: editValue[0], editProductID: editValue[1] },
            function () {
              setTimeout(function () {
                $("#ProductDetailMdl").modal();
              }, 1000);
            }
          );
        }
      );
    }
    if (field === "cartItem") {
      this.setState({ cartItem: value });
    }
  };

  /* ViewProducts */

  render() {
    var currenturl = window.location.href;
    var substring = "products";
    var isCheckout = "checkout";

    var showCatryName =
      typeof this.props.showCatryName !== "undefined"
        ? this.props.showCatryName
        : "Category Name";

    /* For Advanced Slot Start */
    var defaultAvilTyId = cookie.load("defaultAvilablityId");
    var settingsArr = this.props.globalsettings;
    var advancedTimeslotEnable = "0";
    if (Object.keys(settingsArr).length > 0) {
      if (Object.keys(settingsArr[0].result_set).length > 0) {
        advancedTimeslotEnable =
          settingsArr[0].result_set.client_advanced_timeslot_enable;
      }
    }

    return (
      <>
        <header>
          <div className="header-top-cls">
            <div className="container-full">
              <div className="logo-main-section">
                <div className="menu_icon trigger_menunav_act">
                  <span className="icon-bar icon-bar1"></span>
                  <span className="icon-bar icon-bar2"></span>
                  <span className="icon-bar icon-bar3"></span>
                </div>
                <div className="mobile-login">
                  <a href="#" className="controller-nav">
                    <img src={avicon} alt="avatar" />
                  </a>

                  <ul className="mobile-login-list">
                    {!cookie.load("UserId") && (
                      <li>
                        <a
                          href="#login-popup"
                          data-effect="mfp-zoom-in"
                          className="open-popup-link htico_sign"
                          title="Login"
                        >
                          <span>Login</span>
                        </a>
                        <span>|</span>
                        <a
                          href="#signup-popup"
                          data-effect="mfp-zoom-in"
                          className="open-popup-link"
                          title="Sign up"
                        >
                          <span>Register</span>
                        </a>
                      </li>
                    )}

                    {cookie.load("UserId") && (
                      <li className="" key="2">
                        <a href={baseUrl + "myaccount"} title="My Account">
                          <span>My Account</span>
                        </a>
                        <Link to="/logout" title="Logout">
                          <span>Logout</span>
                        </Link>
                      </li>
                    )}
                  </ul>
                </div>
                <div className="mobile-menu">
                  <div className="mobile-menu-header">
                    <div className="mobile-menu-close">
                      <span id="close_mobile_menu"></span>
                    </div>
                  </div>
                  <div className="mobile-menu-body">
                    <ul className="menu">
                      {this.state.menudata && this.listMainNavigation()}
                    </ul>
                  </div>
                </div>
                <div className="logo">
                  <Link to={"/"} title="Grains & Co">
                    <img src={mainLogo} alt="Logo" />
                  </Link>
                </div>
                <div className="hmenu_sec">
                  <ul className="hmenu_list desktop_hmenu_list">
                    {this.state.menudata && this.listMainNavigation()}
                  </ul>
                </div>
                <div className="hmenu-login-section">
                  <ul className="hmenu-login-act">
                    {!cookie.load("UserId") && (
                      <li className="hsign_sec" key="1">
                        <a
                          href="#login-popup"
                          data-effect="mfp-zoom-in"
                          className="open-popup-link htico_sign"
                          title="Login"
                        >
                          <span>Login</span>
                        </a>
                        <span>|</span>
                        <a
                          href="#signup-popup"
                          data-effect="mfp-zoom-in"
                          className="open-popup-link"
                          title="Sign up"
                        >
                          {" "}
                          <span>Register</span>
                        </a>
                      </li>
                    )}

                    {cookie.load("UserId") && (
                      <li className="hsign_sec" key="2">
                        <a
                          className="htico_sign"
                          className={
                            this.props.match.path === "/myaccount" ||
                              this.props.match.path === "/myorders" ||
                              this.props.match.path === "/rewards" ||
                              this.props.match.path === "/mypromotions"
                              ? "htico_sign active"
                              : "htico_sign"
                          }
                          href={baseUrl + "myaccount"}
                          title="My Account"
                        >
                          <i /> <span>My Account</span>
                        </a>
                        <span>|</span>
                        <Link
                          className="htico_sign"
                          to="/logout"
                          title="Logout"
                        >
                          <i /> <span>Logout</span>
                        </Link>
                      </li>
                    )}

                    {/* this.searBlkFun("mbl") */}
                    <li className="hordertype_sec" key="3">
                      {this.checkAblBtn()}
                    </li>
                    {this.searBlkFun("desktop")}
                    <CartSideBar
                      {...this.props}
                      headerState={this.state}
                      prpSateValChange={this.props.sateValChange}
                      pageName="header"
                      prpStateCartChange={this.prpStateCartChange}
                    />
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* mobile_accountdel_body - start */}
          <div className="mobile-order-nowbtn">{this.checkAblBtn()}</div>
          {/* mobile_accountdel_body - end */}

          {/* currenturl.includes(substring) && (
          <div className="hcategory_sec">
            <a href="/" className="hcategory_selected_text disbl_href_action">
              {showCatryName} <span className="hcategory_trigger"></span>
            </a>
            <div className="hcategory_menu ">
              <MenuNavigationmob />
            </div>
          </div>
        ) */}

          <div
            className="custom_alertcls alert-success alert-dismissible1 alert_fixed success_hide"
            id="jquery-success-msg"
            style={{ display: "none" }}
          >
            {" "}
            <a
              href="/"
              type="button"
              className="custom_close"
              data-dismiss="alert"
              aria-label="Close"
            >
              {" "}
              <span aria-hidden="true">×</span>{" "}
            </a>{" "}
            <p className="jquery-success-msg">
              Nice! Products added to your cart
            </p>{" "}
          </div>

          <div
            className="custom_alertcls alert-danger single-danger alert-dismissible alert_fixed error_hide"
            id="jquery-error-msg"
            style={{ display: "none" }}
          >
            {" "}
            <a
              href="/"
              className="custom_close"
              data-dismiss="alert"
              aria-label="Close"
            >
              {" "}
              <span aria-hidden="true">×</span>{" "}
            </a>{" "}
            <p className="jquery-error-msg">Something went wrong</p>{" "}
          </div>

          <div
            className="custom_center_alertcls alert-success alert-dismissible1 alert_fixed success_hide"
            id="jquery-common-success-msg"
            style={{ display: "none" }}
          >
            {" "}
            <a
              href="/"
              type="button"
              className="custom_close"
              data-dismiss="alert"
              aria-label="Close"
            >
              {" "}
              <span aria-hidden="true">×</span>{" "}
            </a>{" "}
            <p className="jquery-common-success-msg">
              Nice! Products added to your cart
            </p>{" "}
          </div>

          <div
            className="custom_center_alertcls alert-danger single-danger alert-dismissible alert_fixed error_hide"
            id="jquery-common-error-msg"
            style={{ display: "none" }}
          >
            {" "}
            <a
              href="/"
              className="custom_close"
              data-dismiss="alert"
              aria-label="Close"
            >
              {" "}
              <span aria-hidden="true">×</span>{" "}
            </a>{" "}
            <p className="jquery-common-error-msg">Something went wrong</p>{" "}
          </div>

          {/* login popup */}

          <div
            id="login-popup"
            className="white-popup mfp-hide popup_sec login-popup"
          >
            <div className="pop-whole">
              <div className="pop-whole-lhs">
                <div className="pop-whole-lhs-inner">
                  <img src={loginav} alt="Login" />
                  <h3>Login</h3>
                  <p>Update your information and continue</p>
                </div>
              </div>
              <div className="inside-popup-rhs">
                <div className="popup-header textcenter">
                  <h4>Enter Your Information</h4>
                </div>
                <Login
                  fields={this.state.fields}
                  onChange={this.fieldChange}
                  onValid={this.handleSignin}
                  onInvalid={() => console.log("Form invalid!")}
                />
                <div className="or-seperator">
                  <span>Or Sign in With</span>
                </div>
                <div className="form-group">
                  <div className="login_pop_sub">
                    <button
                      className="btn btn_black btn_minwid login_submit_lign_gray loginBtn loginBtn--google"
                      onClick={this.googleSDK.bind(this)}
                      ref="googleLoginBtn"
                    >
                      {" "}
                      <i className="fa fa-google" aria-hidden="true"></i>{" "}
                      <span className="span_line"></span> Sign in with Google{" "}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Signup popup */}
          <div
            id="signup-popup"
            className="white-popup mfp-hide popup_sec signup-popup"
          >
            <div className="pop-whole">
              <div className="pop-whole-lhs">
                <div className="pop-whole-lhs-inner">
                  <img src={loginav} alt="Register" />
                  <h3>Register</h3>
                  <p>Create Your Account with us.</p>
                </div>
              </div>
              <div className="inside-popup-rhs">
                <Signup
                  fields={this.state.fieldssignup}
                  onChange={this.fieldChangeSignup}
                  onValid={this.handleSignup}
                  onInvalid={() => console.log("Form invalid!")}
                />
                <div className="or-seperator">
                  <span>Or Sign in With</span>
                </div>
                <div className="form-group">
                  <div className="login_pop_sub">
                    <button
                      className="btn btn_black btn_minwid login_submit_lign_gray loginBtn loginBtn--google"
                      onClick={this.googleSDK.bind(this)}
                      ref="googleLoginBtn"
                    >
                      {" "}
                      <i className="fa fa-google" aria-hidden="true"></i>{" "}
                      <span className="span_line"></span> Sign in with Google{" "}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Forgot Password Popup */}

          <div
            id="forgot-password-popup"
            className="white-popup mfp-hide popup_sec login-popup forgot-password-popup"
          >
            <div className="pop-whole">
              <div className="pop-whole-lhs">
                <div className="pop-whole-lhs-inner">
                  <img src={loginav} alt="Forgot your PIN" />
                  <h3>Forgot your PIN?</h3>
                  <p>You can reset your PIN here.</p>
                </div>
              </div>

              <div className="inside-popup-rhs">
                <div className="popup-header textcenter">
                  <h4>
                    <img src={mainLogo} />
                  </h4>
                </div>
                <Forgotpassword
                  fields={this.state.fieldsfgtpassword}
                  onChange={this.fieldforgot}
                  onValid={this.forgotpassword}
                  onInvalid={() => console.log("Form invalid!")}
                />
              </div>
            </div>
          </div>

          {/* Order popup - start */}
          <div
            id="order-popup"
            className="white-popup mfp-hide popup_sec order_popup"
          >
            <div className="order-body">
              <h2>Order Now</h2>
              <p>Select your order type</p>
              <div className="order_delivery_row">
                <div className="order_delivery_col">
                  <ul className="order_delivery_item">
                    <li>
                      <a
                        href="/"
                        onClick={this.chooseAvailabilityFun.bind(
                          this,
                          deliveryId
                        )}
                        className={this.checkActiveDivHd(deliveryId)}
                      >
                        <div className="header-ordernow-single-img">
                          <img className="order_type_img" src={deliveryImg} />
                          <h3>Delivery</h3>
                        </div>
                      </a>
                    </li>

                    <li>
                      <a
                        href="/"
                        onClick={this.chooseAvailabilityFun.bind(
                          this,
                          pickupId
                        )}
                        className={this.checkActiveDivHd(pickupId)}
                      >
                        <div className="header-ordernow-single-img">
                          <img className="order_type_img" src={takeawayImg} />
                          <h3>Takeaway</h3>
                        </div>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          {/* Order popup - end */}

          {/* Delivery Popup - Start */}
          <div
            id="delevery-popup"
            className="white-popup mfp-hide popup_sec delivery_outletpoup self_popup"
          >
            <div className="order-body">
              <div className="self_popup_hea_row">
                <div className="self_popup_hea_col_left">
                  <img className="outlet-scooter-img" src={deliveryImg} />
                </div>
                <div className="self_popup_hea_col">
                  <h2>Please Select</h2>
                  <p>Your Delivery Outlet</p>
                </div>
              </div>

              <div className="self_pop_row">
                <div className="self_pop_col self_pop_col_right">
                  <div className="self_pop_item">
                    <div className="self_pop_locbx">
                      <div className="form-group">
                        <div className="focus-out">
                          <label>Search Outlet</label>
                          <input
                            type="input"
                            className="form-control input-focus"
                            onKeyUp={this.handleKeyPressDly}
                          />
                          <div className="outlet_error"></div>
                        </div>
                      </div>
                    </div>

                    <div className="self_outlet">
                      <h2>Nearby Outlets</h2>
                      <ul className="self_outlet_inner">
                        {this.loadDeliveryOutletsList()}
                      </ul>
                      <a
                        className="button disbl_href_action"
                        id="delivery-continue-link"
                        href="/"
                        onClick={this.selectDlyOutlet.bind(this)}
                      >
                        Continue
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Delivery Popup - end */}

          {/*  Delivery Postal code Popup - start */}
          <div
            id="delevery-postcode-popup"
            className="white-popup mfp-hide popup_sec delevery_popup"
          >
            <div className="popup_equalrw">
              <div className="popup_ttsec">
                <div className="innervmid_in">
                  <div className="pop_title">
                    <img className="pop-scooter-img" src={deliveryImg} />
                    <h2 className="text-uppercase">Let us know</h2>
                    <small>Your Delivery Location</small>
                  </div>
                </div>
              </div>
              <div className="popup_right">
                <div className="innervmid_in">
                  {cookie.load("UserId") && (
                    <div className="address-list-cls address-list-main">
                      {this.userAddressList(1)}
                    </div>
                  )}

                  <div className="form-group">
                    <div
                      className={
                        this.state.secondaryaddresslist.length > 0
                          ? "focus-out focused"
                          : "focus-out"
                      }
                    >
                      <label>Enter your postal code</label>
                      <input
                        type="text"
                        id="postalcode"
                        pattern="\d*"
                        maxLength="6"
                        className="form-control input-focus"
                      />
                      <div className="postal_error"></div>
                    </div>
                  </div>
                  <div className="btn_sec">
                    <div className="two-button-row">
                      <div className="go_second">
                        {/*<a href="javascript:;" onClick={this.closepopup.bind(this)} className="button button-left" title="Go Back">Go Back</a>*/}
                        <a
                          href="/"
                          onClick={this.gobckOutletpopup.bind(this)}
                          className="button button-left disbl_href_action"
                          title="Go Back"
                        >
                          Go Back
                        </a>
                      </div>
                      <div className="con_first delivery_submit_cls">
                        {/*<input type="button" onClick={this.selectOutlet.bind(this, 1, deliveryId)} className="button button-right delivery_submit" value="Continue" />*/}
                        <input
                          type="button"
                          onClick={this.findOutletBasedZone.bind(
                            this,
                            1,
                            deliveryId
                          )}
                          className="button button-right delivery_submit"
                          value="Continue"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Delevery Popup - end */}

          {/* Delevery Popup error - start */}
          <div
            id="error-postal-popup"
            className="white-popup mfp-hide popup_sec error_postal_popup"
          >
            <div className="popup_equalrw">
              <div className="popup_ttsec">
                <div className="innervmid_in">
                  <div className="pop_title poptt_icontop text-center">
                    <img src={iconUnhappy} />
                    <h2 className="text-uppercase">Sorry </h2>
                    <small>We cant find your postal code</small>
                  </div>
                </div>
              </div>
              <div className="popup_right">
                <div className="innervmid_in">
                  {/*<h4>Enter your postal code</h4>*/}

                  {cookie.load("UserId") && (
                    <div className="address-list-cls address-list-error">
                      {this.userAddressList(2)}
                    </div>
                  )}

                  <form className="form_sec">
                    <div className="form-group">
                      <div
                        className={
                          this.state.secondaryaddresslist.length > 0
                            ? "focus-out focused"
                            : "focus-out"
                        }
                      >
                        <label>Enter your postal code</label>
                        <input
                          type="text"
                          id="postalcode1"
                          pattern="\d*"
                          maxLength="6"
                          className="form-control input-focus"
                        />
                        <div className="postal_error"></div>
                      </div>
                    </div>
                    <div className="btn_sec delivery_submit_cls delivery_submit_div">
                      {/*<input type="button" onClick={this.selectOutlet.bind(this, 0, deliveryId)} className="button delivery_submit" value="Continue" />*/}
                      <input
                        type="button"
                        onClick={this.findOutletBasedZone.bind(
                          this,
                          0,
                          deliveryId
                        )}
                        className="button delivery_submit"
                        value="Continue"
                      />
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          {/* Delevery Popup error - Start */}

          {/* success popup - Start */}
          <div
            id="awesome-popup"
            className="white-popup mfp-hide popup_sec delevery_popup delevery_popup_datetime"
          >
            <div className="popup_equalrw">
              <div className="popup_ttsec">
                <div className="innervmid_in">
                  <div className="pop_title">
                    <img className="pop-scooter-img" src={iconWin} />
                    <h2 className="text-uppercase">Awesome</h2>
                    {this.state.seletedAvilablityId === deliveryId && (
                      <small>We can Deliver !</small>
                    )}
                  </div>
                  {this.state.seletedAvilablityId === deliveryId ? (
                    <div className="awesome_del">
                      <h5>Your Delivery Address :</h5>
                      <h2>{this.state.orderDeliveryAddress}</h2>
                    </div>
                  ) : (
                    <div className="awesome_del">
                      <h5>Your Pickup location Is :</h5>
                      <h2>{this.state.orderHandled}</h2>
                    </div>
                  )}
                </div>
              </div>
              <div className="popup_right">
                <div className="innervmid_in">
                  <div className="datetime_selt_sec">
                    <div className="datetime_selt_lbl">
                      {this.state.seletedAvilablityId === deliveryId
                        ? "Select Your Delivery Date & Time"
                        : "Select Your Pickup Date & Time"}
                    </div>

                    {!currenturl.includes(isCheckout) && (
                      <div>
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
                      </div>
                    )}

                    <div className="ordrdatetime_error"></div>
                  </div>

                  <div className="btn_sec">
                    <input
                      type="button"
                      onClick={this.setOrderOutletDateTimeData.bind(this)}
                      className="button"
                      value="Continue"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* success popup - end */}

          {/* success popup - Start */}
          <div
            id="awesome-popup-old"
            className="white-popup mfp-hide awesome_popup"
          >
            <div className="popup_equalrw">
              <div className="popup_ttsec">
                <div className="innervmid_in">
                  <div className="pop_title poptt_icontop text-center">
                    <img src={iconWin} />
                    <h2 className="text-uppercase">Awesome</h2>
                    <small>We can Deliver !</small>
                  </div>
                  <div className="awesome_del">
                    <h5>Your Delivery Address :</h5>
                    <h2>{this.state.orderDeliveryAddress}</h2>
                  </div>
                  <div className="btn_sec">
                    <input
                      type="button"
                      onClick={this.gotoProducts.bind(this)}
                      className="button"
                      value="Continue"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* success popup - end */}

          {/* error Popup - start */}
          <div
            id="outlet-error-popup"
            className="white-popup mfp-hide popup_sec warning_popup outlet_error_popup"
          >
            <div className="custom_alert">
              <div className="custom_alertin">
                <div className="alert_height">
                  <div className="alert_body">
                    <img className="warning-popup-img" src={warningImg} />
                    <h2 className="text-uppercase">Sorry</h2>
                    <p>{"We can`t Deliver At the Moment!"}</p>
                    <p>Please come back again.</p>
                    <div className="alt_btns">
                      {this.state.seletedAvilablityId === pickupId ? (
                        <a
                          href="/"
                          onClick={this.gobckPkupOutletpopup.bind(this)}
                          className="button button-right popup-modal-dismiss disbl_href_action"
                        >
                          change outlet
                        </a>
                      ) : (
                        <a
                          href="/"
                          onClick={this.gobckOutletpopup.bind(this)}
                          className="button button-right popup-modal-dismiss disbl_href_action"
                        >
                          change address
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* error Popup - end */}

          {/* Takeaway Popup - Start */}
          <div
            id="takeaway-popup"
            className="white-popup mfp-hide popup_sec self_popup"
          >
            <div className="order-body">
              <div className="self_popup_hea_row">
                <div className="self_popup_hea_col_left">
                  <img src={takeawayImg} />
                </div>
                <div className="self_popup_hea_col">
                  <h2>Please Select</h2>
                  <p>Your Self Collection Outlet</p>
                </div>
              </div>

              <div className="self_pop_row">
                <div className="self_pop_col self_pop_col_right">
                  <div className="self_pop_item">
                    <div className="self_pop_locbx">
                      {/*<h4>Search Cedele Outlet.</h4>*/}
                      <div className="form-group">
                        <div className="focus-out">
                          <label>Search Outlet</label>
                          <input
                            type="input"
                            className="form-control input-focus"
                            onKeyUp={this.handleKeyPress}
                          />
                          <div className="outlet_error"></div>
                        </div>
                      </div>
                    </div>

                    <div className="self_outlet">
                      <h2>Nearby Outlets</h2>
                      <ul className="self_outlet_inner">
                        {this.loadOutletsList()}
                      </ul>
                      <a
                        className="button takeaway-btn-act disbl_href_action"
                        id="takeaway-continue-link"
                        href="/"
                        onClick={this.selectDatetm.bind(this)}
                      >
                        Continue
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Takeaway Popup - end */}

          {/*  Coming Soon Popup - start */}
          <div
            id="comingsoon-popup"
            className="white-popup mfp-hide popup_sec comingsoon_popup"
          >
            <div className="order-body">
              <div className="comingsoon_popup_hea_row">
                <div className="comingsoon_popup_hea_col">
                  <h2>COMING SOON.</h2>
                </div>
              </div>
              <div className="comingsoon_pop_row">
                <p> can you select another availability.</p>
                <a
                  href="/"
                  onClick={this.closepopup.bind(this)}
                  className="button disbl_href_action"
                  title="Go Back"
                >
                  Go Back
                </a>
              </div>
            </div>
          </div>
          {/* Coming Soon Popup - end */}

          {/* Warning Popup - start */}
          <div
            id="warning-popup"
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
                        onClick={this.changeAvailability.bind(this)}
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

          <div className="mbl-menu-overly"></div>
        </header>

        {this.state.editItemID !== "" && (
          <ProductDetail
            productState={this.state}
            sateValChange={this.sateValChange}
          />
        )}
      </>
    );
  }
}

const mapStateTopProps = (state) => {
  var zonedetailArr = Array();
  if (Object.keys(state.zonedetail).length > 0) {
    if (state.zonedetail[0].status === "ok") {
      zonedetailArr = state.zonedetail[0].result_set;
    }
  }

  var outletsArr = Array();
  if (Object.keys(state.outlets).length > 0) {
    if (state.outlets[0].status === "ok") {
      outletsArr = state.outlets[0].result_set;
    }
  }

  var alloutletsArr = Array();
  if (Object.keys(state.alloutlets).length > 0) {
    if (state.alloutlets[0].status === "ok") {
      alloutletsArr = state.alloutlets[0].result_set;
    }
  }

  var secondarydataArr = Array();
  if (Object.keys(state.secondaryaddress).length > 0) {
    if (state.secondaryaddress[0].status === "ok") {
      secondarydataArr = state.secondaryaddress[0].result_set;
    }
  }

  return {
    globalsettings: state.settings,
    zonedetails: zonedetailArr,
    outletslist: outletsArr,
    alloutletslist: alloutletsArr,
    logindata: state.login,
    fblogin: state.fblogin,
    googlelogin: state.googlelogin,
    forgetpassword: state.forgetpassword,
    registration: state.registration,
    menudata: state.menudata,
    secondaryaddresslist: secondarydataArr,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getGlobalSettings: () => {
      dispatch({ type: GET_GLOBAL_SETTINGS });
    },
    getZoneDetail: (outletId, zoneId) => {
      dispatch({ type: GET_ZONE_DETAIL, outletId, zoneId });
    },
    getPickupOutlets: () => {
      dispatch({ type: GET_PICKUP_OUTLETS });
    },
    getAllOutlets: (availability) => {
      dispatch({ type: GET_ALL_OUTLETS, availability });
    },
    destroyCartDetail: () => {
      dispatch({ type: DESTROY_CART_DETAIL });
    },
    getLoginData: (formPayload) => {
      dispatch({ type: GET_LOGINDATA, formPayload });
    },
    getFbLoginData: (formPayload) => {
      dispatch({ type: GET_FBLOGINDATA, formPayload });
    },
    getGoogleLoginData: (formPayload) => {
      dispatch({ type: GET_GOOGLELOGINDATA, formPayload });
    },
    getRegistration: (formPayload) => {
      dispatch({ type: GET_REGISTRATION, formPayload });
    },
    getForgetPassword: (formPayload) => {
      dispatch({ type: GET_FORGET_PASSWORD, formPayload });
    },
    getMenuData: (menuslug) => {
      dispatch({ type: GET_MENUDATA, menuslug });
    },
    getSecondaryAddress: () => {
      dispatch({ type: GET_ALLUSERSECADDRDATA });
    },
  };
};
export default connect(
  mapStateTopProps,
  mapDispatchToProps
)(withRouter(Header));
