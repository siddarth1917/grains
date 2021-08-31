/* eslint-disable */
import React, { Component } from 'react';
import axios from 'axios';
import { appId, apiUrl } from "../Helpers/Config";
//import validator from 'validator'
/*import update from 'immutability-helper'*/
import { validated } from 'react-custom-validation'

function validationConfigPassword(props) {
    const { postalcode, addressline } = props.fields
    return {
        fields: ['postalcode', 'addressline'],
        validations: {
            postalcode: [
                [isEmpty, postalcode],

            ],
            addressline: [
                [isEmpty, addressline]
            ]
        }
    }
}

const isEmpty = (value) =>
    value === '' ? 'This field is required.' : null

class Billingaddress extends Component {
    constructor(props) {
        super(props);
    }
	
	
    loadPstAddress() {
        var postal = $(".postalcode").val();
		document.getElementById("spn-postalcode1-error").innerHTML = '';
        if(postal.length > 5){
            axios.get(apiUrl + '/settings/get_address?app_id=' + appId + "&zip_code=" + postal)
            .then(res => {
                if (res.data.status === "ok") {
                    var address_name = res.data.result_set.zip_buno + " " + res.data.result_set.zip_sname;
					this.props.onChange('addressline', address_name);
                   
                } else {
                    document.getElementById("spn-postalcode1-error").innerHTML = '<span class="error">This is not a valid postal code.</span>';
					this.props.onChange('addressline', '');
                }
            });
        }
	}
	
    render() {

        const { fields, onChange, onValid, onInvalid, $field, $validation } = this.props
        let errMsgPst, errMsgAddrs;

        if ($validation.postalcode.error.reason !== undefined) {
            errMsgPst = ($validation.postalcode.show && <span className="error">{$validation.postalcode.error.reason}</span>)
        }
        if ($validation.addressline.error.reason !== undefined) {
            errMsgAddrs = ($validation.addressline.show && <span className="error">{$validation.addressline.error.reason}</span>)
        }

        return (
            <div className="popup-body">
                <form className="form_sec">
                    <div className="form-group">
                        <div className="focus-out">
                            <label>Postal Code</label>
                            <input type="text" className="form-control input-focus postalcode" {...$field('postalcode', (e) => onChange('postalcode', e.target.value)) } onBlur={this.loadPstAddress.bind(this)} />
                            {errMsgPst}
							<div id="spn-postalcode1-error"></div>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className={(fields.addressline != '' ? 'focus-out focused' : 'focus-out')}>
                            <label>Address line</label>
                            <input type="text" value={fields.addressline || ''} className="form-control input-focus address_line" {...$field('addressline', (e) => onChange('addressline', e.target.value)) } />
                            {errMsgAddrs}
                        </div>
                    </div>
					<div className="form-group">
                        <div className='focus-out'>
                            <label>Unit Number 1</label>
                            <input type="text" className="form-control input-focus floor_no" {...$field('floor_no', (e) => onChange('floor_no', e.target.value)) } />
                        </div>
                    </div>
					<div className="form-group">
                        <div className='focus-out'>
                            <label>Unit Number 2</label>
                            <input type="text" className="form-control input-focus unit_no" {...$field('unit_no', (e) => onChange('unit_no', e.target.value)) } />
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="login_pop_sub billing-addrs-sbmt">
                            <button type="button" className="btn btn_black btn_minwid" onClick={(e) => { e.preventDefault(); this.props.$submit(onValid, onInvalid); }}>Submit</button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}
Billingaddress = validated(validationConfigPassword)(Billingaddress)

export default Billingaddress;
