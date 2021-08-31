/* eslint-disable */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { GET_STATIC_BLOCK } from "../../actions";
import innerbanner from "../../common/images/inner-banner.jpg";
var Parser = require("html-react-parser");
class Pages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      staticblacks: [],
      menuheader: "",
      imageLink: "",
    };
  }

  componentDidMount() {
    this.props.getStaticBlock();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.staticblack !== this.state.staticblacks) {
      var menuheader = "";
      var imageLink = "";
      if (Object.keys(nextProps.staticblack).length > 0) {
        nextProps.staticblack.map((data) => {
          if (data.staticblocks_slug === "my-account-header") {
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

  render() {
    return (
      <div className="common-inner-blckdiv">
        <div className="common-inner-banner">
          <div className="page-banner">
            <img
              src={
                this.state.imageLink !== "" ? this.state.imageLink : innerbanner
              }
              alt=""
            />
            <div className="inner-banner-content">{this.state.menuheader}</div>
          </div>
        </div>
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
Pages.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }),
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Pages));
