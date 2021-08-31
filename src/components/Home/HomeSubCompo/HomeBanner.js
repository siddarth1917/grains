/* eslint-disable */
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Slider from "react-slick";

import { stripslashes } from "../../Helpers/SettingHelper";
import homeBannerImg from "../../../common/images/banner.jpg";
import { GET_BANNER_LIST } from "../../../actions";

var Parser = require("html-react-parser");

class HomeBanner extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    //this.props.getBannerList();
  }

  componentDidMount() {
    /*console.log('DidMount');*/
  }

  /* componentDidUpdate() {
		console.log('this called last - after page loading');
	  } */

  render() {
    let bannerArr = this.props.banner;
    let bannerlist = [];
    let bannerimagesource = "";

    if (Object.keys(bannerArr).length > 0) {
      if (bannerArr[0].status === "ok") {
        bannerlist = bannerArr[0].result_set;
        bannerimagesource = bannerArr[0].common.image_source;
      }
    }

    var settingsGallery = {
      infinite: true,
      slidesToShow: 1,
      slidesToScroll: 1,
    };

    return (
      <div className="home-banner">
        {Object.keys(bannerlist).length > 0 ? (
          <Slider {...settingsGallery}>
            {bannerlist.map((banner, index) => {
              return (
                <div key={index}>
                  <img
                    src={bannerimagesource + banner.banner_image}
                    alt="Banner"
                  />
                  {banner.banner_description != ""
                    ? Parser(stripslashes(banner.banner_description))
                    : ""}
                </div>
              );
            })}
          </Slider>
        ) : (
          <div className="loader-main-cls">
            <img src={homeBannerImg} alt="Banner" />
            <div className="loader-sub-div"></div>
          </div>
        )}
      </div>
    );
  }
}

const mapStateTopProps = (state) => {
  return {
    banner: state.banner,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getBannerList: () => {
      dispatch({ type: GET_BANNER_LIST });
    },
  };
};

export default connect(mapStateTopProps, mapDispatchToProps)(HomeBanner);
