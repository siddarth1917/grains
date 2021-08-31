/* eslint-disable */
import React, { Component } from "react";
import Header from "../Layout/Header";
import Footer from "../Layout/Footer";
import { connect } from "react-redux";
import { GET_GLOBAL_SETTINGS, GET_REQUESTPAGEDATA } from "../../actions";

import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import innerbanner from "../../common/images/inner-banner.jpg";
var Parser = require("html-react-parser");
class Pages extends Component {
  constructor(props) {
    super(props);
    //  console.log(this.props);
    this.state = {
      pagedata: [],
      pagedetail: "",
      pagetitle_txt: "",
      pagecommon: [],
      pagegallery: [],
    };

    if (
      this.props.match.params !== "" &&
      this.props.match.params.page_slug !== undefined
    ) {
      var page_slug = this.props.match.params.page_slug;
    } else {
      var page_slug = this.props.match.url.replace(/\\|\//g, "");
    }
    //  console.log(page_slug);
    //const { page_slug } = this.props.match.params;
    this.props.getSettings();
    this.props.getRequestpage(page_slug);
  }

  componentDidMount() {
    $(".dvLoadrCls").show();
    setTimeout(function () {
      $(".test-popup-link").magnificPopup({ type: "image" });
    }, 2000);
  }

  componentWillReceiveProps(nextProps) {
    /* if (
      nextProps.match.params.page_slug !== this.props.match.params.page_slug
    ) {
      if ($(".trigger_menu").length > 0) {
        $(".trigger_menu").toggleClass("active");
        if ($(".hmenu_list").hasClass("open")) {
          $(".mega_menu").slideUp();
        }
        $(".hmenu_list").toggleClass("open");
      }
      this.props.getRequestpage(nextProps.match.params.page_slug);
    } */
    if (nextProps.match.path !== this.props.match.path) {
      if ($(".trigger_menu").length > 0) {
        $(".trigger_menu").toggleClass("active");
        if ($(".hmenu_list").hasClass("open")) {
          $(".mega_menu").slideUp();
        }
        $(".hmenu_list").toggleClass("open");
      }
      var pageslug = nextProps.match.path.replace(/\\|\//g, "");
      this.props.getRequestpage(pageslug);
    }

    if (nextProps.pagedata !== this.state.pagedata) {
      $(".dvLoadrCls").fadeOut(500);
      var pageDetails = "";
      var pageTitleTxt = "";
      var pagegallery = [];
      if (Object.keys(nextProps.pagedata).length > 0) {
        var pagedataTxt = nextProps.pagedata[0].cmspage_description;
        pageTitleTxt = nextProps.pagedata[0].cmspage_title;
        pagegallery = nextProps.pagedata[0].gallery_images;
        pageDetails = pagedataTxt !== "" ? Parser(pagedataTxt) : "";
      }

      this.setState({
        pagedata: nextProps.pagedata,
        pagedetail: pageDetails,
        pagetitle_txt: pageTitleTxt,
        pagecommon: nextProps.pagecommon,
        pagegallery: pagegallery,
      });
    }
  }
  sateValChange = (field, value) => {};
  render() {
    return (
      <div className="pagesList-main-div">
        {/* Header start */}
        <Header sateValChange={this.sateValChange} />
        {/* Header End */}
        <div className="common-inner-blckdiv">
          <div className="common-inner-banner">
            <div className="page-banner">
              <img
                src={
                  this.state.pagegallery.length > 0 &&
                  this.state.pagecommon !== "" &&
                  typeof this.state.pagecommon !== undefined &&
                  typeof this.state.pagecommon !== "undefined"
                    ? this.state.pagecommon.gallery_image_path +
                      "/" +
                      this.state.pagegallery[0]
                    : innerbanner
                }
                alt=""
              />
              <div className="inner-banner-content">
                <h2>{this.state.pagetitle_txt}</h2>
              </div>
            </div>
          </div>
        </div>
        {/* <div className="common-inner-blckdiv">
          <div className="common-inner-banner">
            <p>{this.state.pagetitle_txt}</p>
          </div>
        </div> */}

        <div className="cms-page">
          <div className="container-one cms-content">
            <div className="container cms-content">{this.state.pagedetail}</div>
          </div>
        </div>

        <Footer />
        <div id="dvLoading" className="dvLoadrCls"></div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  var pagedataRst = Array();
  if (Object.keys(state.pagedata).length > 0) {
    if (state.pagedata[0].status === "ok") {
      pagedataRst = state.pagedata[0].result_set;
    }
  }

  return {
    globalsettings: state.settings,
    pagedata: pagedataRst,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getSettings: () => {
      dispatch({ type: GET_GLOBAL_SETTINGS });
    },
    getRequestpage: (slug) => {
      dispatch({ type: GET_REQUESTPAGEDATA, slug });
    },
  };
};

Pages.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }),
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Pages));
