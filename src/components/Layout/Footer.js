/* eslint-disable */
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import footerLogo from "../../common/images/logo.png";
import { GET_STATIC_BLOCK } from "../../actions";
var Parser = require("html-react-parser");
class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = { footerBlocks: "", footerlink: "" };
  }

  componentDidMount() {
    this.props.getStaticBlock();

    var btn = $("#scrollbutton");

    $(window).scroll(function () {
      if ($(window).scrollTop() > 300) {
        btn.addClass("show");
      } else {
        btn.removeClass("show");
      }
    });

    btn.on("click", function (e) {
      e.preventDefault();
      $("html, body").animate({ scrollTop: 0 }, "300");
    });
  }

  componentWillReceiveProps(PropsData) {
    if (PropsData.staticblack !== this.state.footerBlocks) {
      var footerPas = "";
      if (Object.keys(PropsData.staticblack).length > 0) {
        PropsData.staticblack.map((data, index) => {
          if (data.staticblocks_slug === "footer-contents") {
            footerPas = data.staticblocks_description;
            return "";
          }
        });
      }
      footerPas = footerPas !== "" ? Parser(footerPas) : footerPas;
      this.setState({
        footerBlocks: PropsData.staticblack,
        footerlink: footerPas,
      });
    }
  }
  render() {
    var todayTimeSp = new Date();
    var yearSp = todayTimeSp.getFullYear();

    return (
      <footer className="footer-main">
        <div className="footer-top">
          <a title="Grains & Co" href="/">
            <img src={footerLogo} />
          </a>
        </div>
        {this.state.footerlink}
        <div className="copyright-section">
          <p>Copyright {yearSp} Grains & Co. All rights reserved.</p>
        </div>

        <div className="scrolltop" id="scrollbutton">
          <a href="/" className="disbl_href_action">
            <span>
              <i className="fa fa-angle-double-up ars"></i>
              <i className="fa fa-angle-up ars1"></i>
              <i className="fa fa-angle-up ars2"></i>
            </span>
          </a>
        </div>
      </footer>
    );
  }
}

const mapStateTopProps = (state) => {
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

export default connect(mapStateTopProps, mapDispatchToProps)(Footer);
