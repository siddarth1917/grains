/* eslint-disable */
import React, { Component } from "react";
import Header from "../Layout/Header";
import Footer from "../Layout/Footer";

import { GET_STATIC_BLOCK } from "../../actions";
import { connect } from "react-redux";
import axios from "axios";
import { appId, apiUrl } from "../Helpers/Config";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { Accordion, AccordionItem } from "react-light-accordion";
import "react-light-accordion/demo/css/index.css";
import innerbanner from "../../common/images/inner-banner.jpg";
var Parser = require("html-react-parser");
class Faq extends Component {
  constructor(props) {
    super(props);
    this.state = {
      FaqList: [],
      FaqDisplay: "",
      staticblacks: [],
      menuheader: "",
      imageLink: "",
    };
    this.props.getStaticBlock();
  }

  componentDidMount() {
    $("#dvLoading").hide();
    var urlShringTxt = apiUrl + "cms/faq?status=A&app_id=" + appId;

    axios.get(urlShringTxt).then((res) => {
      var FaqList = "";
      console.log(res.data, "res.datares.data");
      if (res.data.status === "ok") {
        var FaqList = res.data.result_set;
      }
      this.setState(
        {
          FaqList: FaqList,
        },
        function () {
          this.loadFaq();
        }
      );
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.staticblack !== this.state.staticblacks) {
      var menuheader = "";
      var imageLink = "";
      if (Object.keys(nextProps.staticblack).length > 0) {
        nextProps.staticblack.map((data) => {
          if (data.staticblocks_slug === "faq-header") {
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
  loadFaq() {
    var Faq_List = "";
    if (this.state.FaqList.length > 0) {
      Faq_List = (
        <Accordion>
          {this.state.FaqList.map((item, index) => {
            if (Object.keys(item.faqs).length > 0) {
              var faqListNew = item.faqs;
              return Object.keys(item.faqs).map((item1, index1) => {
                var faqListCurrent = faqListNew[item1];
                if (
                  faqListCurrent.faq_title !== "" &&
                  faqListCurrent.faq_title !== null
                ) {
                  return (
                    <AccordionItem
                      title={
                        faqListCurrent.faq_title !== null
                          ? Parser(faqListCurrent.faq_title)
                          : ""
                      }
                      key={index + index1}
                    >
                      {faqListCurrent.faq_description !== "" &&
                      faqListCurrent.faq_description !== null
                        ? Parser(faqListCurrent.faq_description)
                        : ""}
                    </AccordionItem>
                  );
                }
              });
            }
          })}
        </Accordion>
      );
    }
    this.setState({ FaqDisplay: Faq_List });
  }
  render() {
    return (
      <div className="pagesList-main-div">
        {/* Header start */}
        <Header />
        {/* Header End */}
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

        <div className="cms-page">
          <div className="container-one cms-content">
            <div className="container cms-content">{this.state.FaqDisplay}</div>
          </div>
        </div>

        <Footer />
        <div id="dvLoading" className="dvLoadrCls"></div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  var blacksArr = Array();
  if (Object.keys(state.staticblack).length > 0) {
    if (state.staticblack[0].status === "ok") {
      blacksArr = state.staticblack[0].result_set;
    }
  }
  return {
    staticblack: blacksArr,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getStaticBlock: () => {
      dispatch({ type: GET_STATIC_BLOCK });
    },
  };
};

Faq.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }),
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Faq));
