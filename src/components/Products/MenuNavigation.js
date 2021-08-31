/* eslint-disable */
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { stripslashes } from "../Helpers/SettingHelper";
import Slider from "react-slick";
class MenuNavigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      navigateMenu: [],
    };
  }

  componentWillReceiveProps(pdtProps) {}

  navigateMenuList() {
    let navigateMenuArr = this.props.navigateMenu;
    var selectedNav = this.props.productState.selectedNavigation;

    if (Object.keys(navigateMenuArr).length > 0) {
      const mainMenu = navigateMenuArr.map((loaddata, index) => {
        if (index <= 3) {
          if (loaddata.menu_type == "main") {
            return (
              <div
                key={index + 1}
                className={
                  selectedNav === loaddata.pro_cate_slug
                    ? "menu-list-intvl active"
                    : "menu-list-intvl"
                }
              >
                <Link
                  to={"/products/category/" + loaddata.pro_cate_slug}
                  className="menu-title-link"
                  title={loaddata.menu_custom_title}
                >
                  {stripslashes(loaddata.menu_custom_title.toLowerCase())}
                </Link>
              </div>
            );
          } else if (loaddata.menu_type == "sub") {
            return (
              <div
                key={index + 1}
                className={
                  selectedNav === loaddata.pro_subcate_slug
                    ? "menu-list-intvl active"
                    : "menu-list-intvl"
                }
              >
                <Link
                  to={"/products/subcategory/" + loaddata.pro_subcate_slug}
                  className="menu-title-link"
                  title={loaddata.menu_custom_title}
                >
                  {stripslashes(loaddata.menu_custom_title.toLowerCase())}
                </Link>
              </div>
            );
          }
        }
      });

      return mainMenu;
    } else {
      return;
    }
  }

  navigateMobileMenuList() {
    let navigateMenuArr = this.props.navigateMenu;
    var selectedNav = this.props.productState.selectedNavigation;

    if (Object.keys(navigateMenuArr).length > 0) {
      const mainMenu = navigateMenuArr.map((loaddata, index) => {
        if (loaddata.menu_type == "main") {
          return (
            <div
              key={index + 1}
              className={
                selectedNav === loaddata.pro_cate_slug
                  ? "menu-list-intvl active"
                  : "menu-list-intvl"
              }
            >
              <Link
                to={"/products/category/" + loaddata.pro_cate_slug}
                className="menu-title-link"
                title={loaddata.menu_custom_title}
              >
                {stripslashes(loaddata.menu_custom_title.toLowerCase())}
              </Link>
            </div>
          );
        } else if (loaddata.menu_type == "sub") {
          return (
            <div
              key={index + 1}
              className={
                selectedNav === loaddata.pro_subcate_slug
                  ? "menu-list-intvl active"
                  : "menu-list-intvl"
              }
            >
              <Link
                to={"/products/subcategory/" + loaddata.pro_subcate_slug}
                className="menu-title-link"
                title={loaddata.menu_custom_title}
              >
                {stripslashes(loaddata.menu_custom_title.toLowerCase())}
              </Link>
            </div>
          );
        }
      });

      return mainMenu;
    } else {
      return;
    }
  }
  navigateMenuListHidden() {
    let navigateMenuArr = this.props.navigateMenu;
    var selectedNav = this.props.productState.selectedNavigation;
    var i = 0;
    if (Object.keys(navigateMenuArr).length > 0) {
      const mainMenu = navigateMenuArr.map((loaddata, index) => {
        if (index > 3) {
          i++;
          if (loaddata.menu_type == "main") {
            return (
              <li
                key={index + 1}
                className={
                  selectedNav === loaddata.pro_cate_slug
                    ? "menu-list-intvl active"
                    : "menu-list-intvl"
                }
              >
                <Link
                  to={"/products/category/" + loaddata.pro_cate_slug}
                  className="menu-title-link"
                  onClick={this.goCategoryProducts.bind(this)}
                  title={loaddata.menu_custom_title}
                >
                  {stripslashes(loaddata.menu_custom_title.toLowerCase())}
                </Link>
              </li>
            );
          } else if (loaddata.menu_type == "sub") {
            return (
              <li
                key={index + 1}
                className={
                  selectedNav === loaddata.pro_subcate_slug
                    ? "menu-list-intvl active"
                    : "menu-list-intvl"
                }
              >
                <Link
                  to={"/products/subcategory/" + loaddata.pro_subcate_slug}
                  className="menu-title-link"
                  title={loaddata.menu_custom_title}
                >
                  {stripslashes(loaddata.menu_custom_title.toLowerCase())}
                </Link>
              </li>
            );
          }
        }
      });
      setTimeout(function () {
        if ($(".more-menu .menu-list-intvl.active a").length > 0) {
          $(".more-menu .more-menu-name").html(
            $(".more-menu .menu-list-intvl.active a").text()
          );
        } else {
          $(".more-menu .more-menu-name").html("More");
        }
      }, 100);
      if (i > 0) {
        $(".more-menu").show();
      } else {
        $(".more-menu").hide();
      }
      return mainMenu;
    } else {
      return;
    }
  }

  goCategoryProducts(event) {
    $(".more-menu-parent, .more_categor_info").removeClass("active");
    $(".more_categor_info").hide();
    /* $("html, body").animate(
      {
        scrollTop: $("#" + slug).offset().top - 150,
      },
      1000
    ); */
  }

  render() {
    var settingsGallery = {
      infinite: true,
      slidesToShow: 3,
      slidesToScroll: 1,
      responsive: [
        {
          breakpoint: 580,
          settings: {
            slidesToShow: 2,
          },
        },
      ],
    };
    return (
      <>
        <div className="menu-section-left">
          <div className="menu-section-left-inner">
            {this.navigateMenuList()}
          </div>
          <div className="more-menu" style={{ display: "none" }}>
            <div className="more-menu-parent">
              <span className="more-menu-name">More</span>
              <label className="open_more_category">
                {" "}
                <i className="fa fa-angle-double-down"></i>{" "}
              </label>
            </div>
            <ul style={{ display: "none" }} className="more_categor_info">
              {this.navigateMenuListHidden()}
            </ul>
          </div>
        </div>
        <div className="menu-section-mobile-inner">
          <Slider {...settingsGallery}>{this.navigateMobileMenuList()}</Slider>
        </div>
      </>
    );
  }
}

export default MenuNavigation;
