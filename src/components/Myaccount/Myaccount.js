/* eslint-disable */
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { appId, cookieDefaultConfig } from "../Helpers/Config";
import cookie from "react-cookies";
import Slider from "react-slick";
var dateFormat = require("dateformat");

import validator from "validator";
import update from "immutability-helper";
import { validated } from "react-custom-validation";
import { showCustomAlert } from "../Helpers/SettingHelper";
import {
  GET_CUSTOMER_DETAIL,
  GET_UPDATECUSTOMERPROFILE,
  GET_ACTIVITYCOUNT,
} from "../../actions";

import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

/* import modules */
import Header from "../Layout/Header";
import Footer from "../Layout/Footer";
import Myaccountheader from "./Myaccountheader";
import Form from "./Form";
var base64 = require("base-64");
var qs = require("qs");

class Myaccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: {
        firstname: "",
        lastname: "",
        nickname: "",
        email: "",
        mobile: "",
        postal: "",
        unitnumber2: "",
        unitnumber1: "",
        company: "",
        birthdate: "",
        fbid: "",
        image_source: "",
        photo: "",
        gender: "",
      },
      status: "OK",
      date1: "",
      defaultDispaly: "",
      order_all: 0,
      overall_orders: 0,

      activityPoints: {
        reward_ponits: "",
        reward_ponits_monthly: "",
        order_all: "",
        promotion: "",
      },
      ordercount: 0,
    };

    if (cookie.load("UserId") == "" || cookie.load("UserId") == undefined) {
      props.history.push("/");
    }
  }

  componentDidMount() {
    var params =
      "&status=A&refrence=" + base64.encode(cookie.load("UserId")) + "&enc=Y";
    $("#dvLoading").fadeOut(2000);
    this.props.getCustomerDetail(params);
    this.getActivityCountsNew();

    setTimeout(function () {
      if ($(".mCustomScrollbar").length > 0) {
        $(".mCustomScrollbar").mCustomScrollbar();
      }
    }, 400);
  }

  getActivityCountsNew() {
    const inputKeys = ["order_all", "overall_orders"];
    this.props.getActivityCount(JSON.stringify(inputKeys));
  }

  fieldChange = (field, value) => {
    this.setState(update(this.state, { fields: { [field]: { $set: value } } }));
  };

  /* To Submit the personal informartion form */
  handleFormSubmit = () => {
    const formPayload = this.state.fields;

    var postObject = {
      app_id: appId,
      type: "web",
      customer_first_name: formPayload.firstname,
      customer_last_name: formPayload.lastname,
      customer_nick_name: formPayload.nickname,
      customer_phone: formPayload.mobile,
      customer_email: formPayload.email,
      customer_birthdate: cookie
        .load("birthdate")
        .replace("/", "-")
        .replace("/", "-"),
      customer_postal_code: formPayload.postal,
      customer_address_name2: formPayload.address1,
      customer_company_name: formPayload.company,
      customer_gender: formPayload.gender.value,
      customer_address_line1: formPayload.unitnumber1,
      customer_address_line2: formPayload.unitnumber2,
      customer_id: base64.encode(cookie.load("UserId")),
      enc: "Y",
    };
    $(".myaccount_update").append('<b class="gloading_img"></b>');
    this.props.getUpdateCustomerProfile(qs.stringify(postObject));
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.updatecustomerprofile !== this.props.updatecustomerprofile) {
      const { updatecustomerprofile } = nextProps;
      if (updatecustomerprofile[0].status === "ok") {
        $(".myaccount_update .gloading_img").remove();
        cookie.save(
          "UserFname",
          updatecustomerprofile[0].result_set.customer_first_name,
          cookieDefaultConfig
        );
        cookie.save(
          "UserLname",
          updatecustomerprofile[0].result_set.customer_last_name,
          cookieDefaultConfig
        );
        cookie.save(
          "UserMobile",
          updatecustomerprofile[0].result_set.customer_phone,
          cookieDefaultConfig
        );
        cookie.save(
          "UserEmail",
          updatecustomerprofile[0].result_set.customer_email,
          cookieDefaultConfig
        );
        cookie.save(
          "UserDefaultAddress",
          updatecustomerprofile[0].result_set.customer_address_name,
          cookieDefaultConfig
        );
        cookie.save(
          "UserDefaultUnitOne",
          updatecustomerprofile[0].result_set.customer_address_line1,
          cookieDefaultConfig
        );
        cookie.save(
          "UserDefaultUnitTwo",
          updatecustomerprofile[0].result_set.customer_address_line2,
          cookieDefaultConfig
        );
        cookie.save(
          "UserDefaultPostalCode",
          updatecustomerprofile[0].result_set.customer_postal_code,
          cookieDefaultConfig
        );

        /* Redirect to checkout page .. */
        if (
          cookie.load("isChecoutRedirect") === "Yes" &&
          cookie.load("cartValue") === "Yes"
        ) {
          cookie.save("isChecoutRedirect", "No", cookieDefaultConfig);
          /*hashHistory.push("/checkout");*/
        }
        showCustomAlert("success", "Great choice! Item added to your cart.");
      } else {
        if (updatecustomerprofile[0].form_error) {
          showCustomAlert("error", updatecustomerprofile[0].form_error);
        } else {
          showCustomAlert("error", updatecustomerprofile[0].message);
        }
      }
    }

    if (nextProps.customerdetail !== this.props.customerdetail) {
      //const {customerdetail} = nextProps;
      if (nextProps.customerdetail[0].status === "ok") {
        $("#dvLoading").fadeOut(2000);
        if (
          nextProps.customerdetail[0].result_set.customer_birthdate == null ||
          nextProps.customerdetail[0].result_set.customer_birthdate ==
          "0000-00-00"
        ) {
          var birthdate = "";
        } else {
          var birthdate =
            nextProps.customerdetail[0].result_set.customer_birthdate;
          var birthyear = birthdate.substring(0, 4);
          var birthmonth = birthdate.substring(5, 7);
          var birthdatev = birthdate.substring(8, 10);
          var birthdateTemp = birthdatev + "/" + birthmonth + "/" + birthyear;
          cookie.save("birthdate", birthdateTemp, cookieDefaultConfig);
        }

        this.setState({
          fields: {
            firstname:
              nextProps.customerdetail[0].result_set.customer_first_name !==
                null
                ? nextProps.customerdetail[0].result_set.customer_first_name
                : "",
            birthdate: birthdate,
            lastname:
              nextProps.customerdetail[0].result_set.customer_last_name !== null
                ? nextProps.customerdetail[0].result_set.customer_last_name
                : "",
            nickname:
              nextProps.customerdetail[0].result_set.customer_nick_name !== null
                ? nextProps.customerdetail[0].result_set.customer_nick_name
                : "",
            email:
              nextProps.customerdetail[0].result_set.customer_email !== null
                ? nextProps.customerdetail[0].result_set.customer_email
                : "",
            mobile:
              nextProps.customerdetail[0].result_set.customer_phone !== null
                ? nextProps.customerdetail[0].result_set.customer_phone
                : "",

            photo:
              nextProps.customerdetail[0].result_set.customer_photo !== null &&
                nextProps.customerdetail[0].result_set.customer_photo !== ""
                ? nextProps.customerdetail[0].result_set.customer_photo.indexOf(
                  "http"
                ) > 0
                  ? nextProps.customerdetail[0].result_set.customer_photo
                  : nextProps.customerdetail[0].common.image_source +
                  nextProps.customerdetail[0].result_set.customer_photo
                : "",
            postal:
              nextProps.customerdetail[0].result_set.customer_postal_code !==
                null
                ? nextProps.customerdetail[0].result_set.customer_postal_code
                : "",
            unitnumber2:
              nextProps.customerdetail[0].result_set.customer_address_line2 !==
                null
                ? nextProps.customerdetail[0].result_set.customer_address_line2
                : "",
            unitnumber1:
              nextProps.customerdetail[0].result_set.customer_address_line1 !==
                null
                ? nextProps.customerdetail[0].result_set.customer_address_line1
                : "",
            address:
              nextProps.customerdetail[0].result_set.customer_address_name !==
                null
                ? nextProps.customerdetail[0].result_set.customer_address_name
                : "",
            address1:
              nextProps.customerdetail[0].result_set.customer_address_name2 !==
                null
                ? nextProps.customerdetail[0].result_set.customer_address_name2
                : "",
            company:
              nextProps.customerdetail[0].result_set.customer_company_name !==
                null
                ? nextProps.customerdetail[0].result_set.customer_company_name
                : "",
            fbid: nextProps.customerdetail[0].result_set.customer_fb_id,
            image_source: nextProps.customerdetail[0].common.image_source,
            juicedid:
              nextProps.customerdetail[0].result_set.customer_unique_id !== null
                ? nextProps.customerdetail[0].result_set.customer_unique_id
                : "",
            joinedOn:
              nextProps.customerdetail[0].result_set.customer_created_on !==
                null
                ? nextProps.customerdetail[0].result_set.customer_created_on
                : "",
            gender:
              nextProps.customerdetail[0].result_set.customer_gender !== null &&
                nextProps.customerdetail[0].result_set.customer_gender !== ""
                ? nextProps.customerdetail[0].result_set.customer_gender
                : "M",
          },
          status: nextProps.customerdetail[0].status,
        });

        var vDefaultAddr = "";
        var list = document.getElementsByClassName("form-group-input");
        var n;
        for (n = 0; n < list.length; ++n) {
          if (list[n].getElementsByTagName("input")[0].value !== "") {
            list[n].classList.remove("is-empty");
          } else {
            list[n].classList.add("is-empty");
          }
        }
      }
    }

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
          });
        }
      }
    } else {
      this.setState({ order_all: 0, overall_orders: 0 });
    }
  }

  render() {
    var settingsMyAcc = {
      infinite: false,
      slidesToShow: 4,
      slidesToScroll: 4,
      initialSlide: 0,
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

    return (
      <div className="myacc-main-div">
        <Header />
        <Myaccountheader />
        {/* <div className="common-inner-blckdiv">
          <div className="common-inner-banner">
            <p>My Account</p>
            <span>
              My Account Dashboard allows you to view your recent activities,
              check your reward points and update account information.
            </span>
          </div>
        </div> */}
        <div className="innersection_wrap myadmin_wrap">
          <div className="mainacc_menusec">
            {/* container div - start */}
            <div className="container">
              <div className="mainacc_menuout">
                <ul className="mainacc_menulist">
                  <li className="active">
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
                    <div className="mbacc_mslide active">
                      <Link to="/myaccount" title="My Account">
                        <span>Account Details</span>
                      </Link>
                    </div>
                    <div className="mbacc_mslide">
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
                          <div className="tab_sec filter_tabsec">
                            <Form
                              {...this.props}
                              fields={this.state.fields}
                              activityPoints={this.state.activityPoints}
                              onChange={this.fieldChange}
                              onValid={this.handleFormSubmit}
                              onInvalid={() => console.log("Form invalid!")}
                            />
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
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    customerdetail: state.customerdetail,
    updatecustomerprofile: state.updatecustomerprofile,
    activitycount: state.activitycount,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getCustomerDetail: (params) => {
      dispatch({ type: GET_CUSTOMER_DETAIL, params });
    },
    getUpdateCustomerProfile: (formPayload) => {
      dispatch({ type: GET_UPDATECUSTOMERPROFILE, formPayload });
    },
    getActivityCount: (getObject) => {
      dispatch({ type: GET_ACTIVITYCOUNT, getObject });
    },
  };
};

Myaccount.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }),
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Myaccount)
);
