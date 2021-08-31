/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link} from 'react-router-dom';
import Slider from "react-slick";

import { timThumpUrl } from "../../Helpers/Config";
import { stripslashes, callImage } from "../../Helpers/SettingHelper";
import homeBannerImg from "../../../common/images/banner.jpg";
import noimage from "../../../common/images/noimg-470x240.jpg";
import { GET_PICKUP_OUTLETS } from '../../../actions';

var Parser = require('html-react-parser');

class OurOutlets extends Component {
	  constructor(props) {
		super(props);
	  }
	  
	  componentWillMount() {
		this.props.getPickupOutlets();
	  }
	  
	  componentDidMount() {
		/*console.log('DidMount');*/
	  }
	  
	  callPhoneOptn(phoneTxt) {
		var resultTxt = '';
		if(phoneTxt !== '') {
			if(phoneTxt.indexOf("+65") !== -1) {
				resultTxt = "tel:"+phoneTxt;
			} else if((phoneTxt.indexOf("65") !== -1) && (phoneTxt.length >= 10)) {
				resultTxt = "tel:+"+phoneTxt;
			} else {
				resultTxt = "tel:+65"+phoneTxt;
			}
		} else {
			resultTxt = 'javascript:void(0);';
		}
		
		return resultTxt;
	}
	  
	  /* componentDidUpdate() {
		console.log('this called last - after page loading');
	  } */
	  
	  render() {
		  
		let outletsArr = this.props.outlets;
		let outletslist = [];
		let outletsimagesource = '';

		if(Object.keys(outletsArr).length > 0) {
			if(outletsArr[0].status === 'ok') {
				outletslist = outletsArr[0].result_set;
				outletsimagesource = outletsArr[0].common.image_source;
			}
		}  
		  
		var outletsGallery = {
			infinite: false,
            slidesToShow: 3,
            slidesToScroll: 3,
			dots:false,
			responsive: [{
				breakpoint: 1191,
				settings: {
					slidesToShow: 3,
					slidesToScroll: 3,
					infinite: false

				}
			},
			{
				breakpoint: 900,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 2,
					dots:true,
					infinite: false
				}
			},
			{
				breakpoint: 520,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
					dots:true,
					infinite: false
				}
			}
			]
        };
		
		if(Object.keys(outletslist).length > 0) {
		
		return (<div className="home-outlets-list">
				  <div className="container">
					<div className="center-header"><h2>Our Outlets</h2></div>
					<Slider {...outletsGallery}>
						   {
							  (outletslist).map(
							  (outlets,index) => {
								  return (
									<div key={index} className="outlets-intvl">
										{(outlets.outlet_image !== '') ?  <img src={outletsimagesource+outlets.outlet_image} alt="Outlet Img" /> : <img src={noimage} alt="No Img" />}
										<div className="outlets-info">
											<h4>{stripslashes(outlets.outlet_name)}</h4>
											<div className="outlets-info-innr">
											<p className="outlets-address-line">{outlets.outlet_address_line1.toLowerCase()} {(outlets.outlet_unit_number2 !== '')?'#'+outlets.outlet_unit_number1+'-'+outlets.outlet_unit_number2:outlets.outlet_unit_number1} , Singapore {outlets.outlet_postal_code}</p>
											{(outlets.outlet_phone !== '') && <p>Tel - <span className="phone-show-dskp">{outlets.outlet_phone}</span><span className="phone-show-mbl"> <a href={this.callPhoneOptn(outlets.outlet_phone)}>{outlets.outlet_phone}</a></span></p>}
											{(outlets.outlet_informations!='')?Parser(stripslashes(outlets.outlet_informations)):''}
											</div>
										</div>   
									</div>
								  )
								 }
								) 
						   }
					</Slider>
				  </div>
				</div>)
		} else {
			return '';
		}
	  }	
}

const mapStateTopProps = (state) => {
  return {
    outlets: state.outlets
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getPickupOutlets: () => {
	dispatch({ type: GET_PICKUP_OUTLETS});
	},
  }
}

export default connect(mapStateTopProps, mapDispatchToProps)(OurOutlets);
