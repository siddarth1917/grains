/* eslint-disable */
import React, { Component } from "react";
import { appId, apiUrl, deliveryId, apiUrlV2, cookieDefaultConfig } from "../../Helpers/Config";
import { stripslashes } from "../../Helpers/SettingHelper";
import { Link } from "react-router-dom";
import axios from "axios";
import _ from "underscore";
var Parser = require("html-react-parser");
import cookie from "react-cookies";
export default class MenuNavigationmob extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuList: [],
      subCategory: [],
    };
  }

  componentDidMount() {
    var availabilityId = cookie.load("defaultAvilablityId");
    var orderOutletId =
      cookie.load("orderOutletId") === undefined ||
        cookie.load("orderOutletId") === "null" ||
        cookie.load("orderOutletId") == ""
        ? ""
        : cookie.load("orderOutletId");
    axios
      .get(
        apiUrlV2 +
        "products/getMenuNavigation?app_id=" +
        appId +
        "&availability=" +
        availabilityId +
        "&outletId=" +
        orderOutletId
      )
      .then((res) => {
        if (res.data.status == "ok") {
          this.setState({ menuList: res.data.result_set });
          cookie.save("firstNavigation", res.data.result_set[0].pro_cate_slug, cookieDefaultConfig);
        }
      });
  }
  endSubMenuItems(submenu, categorySlug) {
    return submenu.map((loaddata, index) => (
      <li key={index}>
        {" "}
        <Link
          to={"/products/category/" + categorySlug}
          title={stripslashes(loaddata.pro_subcate_name)}
        >
          {stripslashes(loaddata.pro_subcate_name)}{" "}
        </Link>
      </li>
    ));

    /*return submenu.map((loaddata, index) => <li key={index} > <Link to={"/products/category/" + categorySlug + "/" + loaddata.pro_subcate_slug} title={stripslashes(loaddata
      .pro_subcate_name)} >{stripslashes(loaddata.pro_subcate_name)} </Link></li >);*/
  }

  /* submenu listing */
  showSubMenu(isSubMenu, objects, categorySlug) {
    if (isSubMenu == "Yes") {
      var chunkValues = _.chunk(objects.sub_result_set, 4);
      const listingItems = chunkValues.map((submenu, index) => {
        return (
          <ul className="hcategory_submenu" key={index}>
            {this.endSubMenuItems(submenu, categorySlug)}{" "}
          </ul>
        );
      });
      return listingItems;
    }
  }

  render() {
    var currenturl = window.location.href;
    const mainMenu = this.state.menuList.map((loaddata, index) => {
      if (loaddata.menu_type == "main") {
        return (
          <li
            key={index}
            className={
              currenturl.includes(loaddata.pro_cate_slug) ? "active" : ""
            }
          >
            {" "}
            <Link
              to={"/products/category/" + loaddata.pro_cate_slug}
              title={loaddata.menu_custom_title}
            >
              {stripslashes(loaddata.menu_custom_title)}{" "}
            </Link>{" "}
            {this.showSubMenu(
              loaddata.is_sub_list,
              loaddata.subcat_list_arr,
              loaddata.pro_cate_slug
            )}{" "}
          </li>
        );
      } else if (loaddata.menu_type == "sub") {
        return (
          <li
            key={index}
            className={
              currenturl.includes(loaddata.pro_cate_slug) ? "active" : ""
            }
          >
            {" "}
            <Link
              to={"/products/subcategory/" + loaddata.pro_subcate_slug}
              title={stripslashes(loaddata.menu_custom_title)}
            >
              {" "}
              {loaddata.menu_custom_title}{" "}
            </Link>{" "}
          </li>
        );
      }
    });
    return <ul className="hcategory_menulist">{mainMenu} </ul>;
  }
}
