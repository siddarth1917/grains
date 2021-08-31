/* eslint-disable */
import React, { Component } from "react";
import cookie from "react-cookies";
import axios from "axios";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { setMinutes, setHours, getDay, format } from "date-fns";

import { appId, apiUrlV2 } from "../Helpers/Config";
import { cnvrtStr } from "../Helpers/SettingHelper";

var dateFormat = require("dateformat");
var Parser = require("html-react-parser");

class OrderAdvancedDatetimeSlot extends Component {
  constructor(props) {
    super(props);

    var minDateTxt = new Date();
    var startDate = new Date();
    var startTime = setHours(setMinutes(new Date(), 0), 17);

    this.state = {
      showDatePk: "no",
      showTimePk: "no",
      timeSlotType: "1",
      dateTimeErroTxt: "",
      timeErroTxt: "",
      timeSlotHtmlDrwn: "",
      slctTimeValue: "",
      startDate: startDate,
      startTime: startTime,
      minDate: minDateTxt,
      maxDate: minDateTxt,
      holidays: [],
      weekdays: [],
      order_tatTm: 0,
      min_date_int: 0,
      max_date_int: 0,
      interval_time: 5,
      cut_off_time: 0,
      resultSetdata: [],
      includeTimesList: [],
      timeSlotListArr: [],
    };

    this.handleChangeDate = this.handleChangeDate.bind(this);
    this.handleChangeTime = this.handleChangeTime.bind(this);
    this.isWeekday = this.isWeekday.bind(this);
  }

  componentWillReceiveProps(propsDtTm) {
    if (Object.keys(propsDtTm).length > 0) {
      var getDateTimeFlg = propsDtTm.hdrState.getDateTimeFlg;
      var sldAvilablityId = propsDtTm.hdrState.seletedAvilablityId;
      var sldOutletId = propsDtTm.hdrState.seletedOutletId;
      var orderTatTm = propsDtTm.hdrState.order_tat_time;
      if (getDateTimeFlg === "yes") {
        this.setState(
          { dateTimeErroTxt: "" },
          function () {
            this.getAvailableDates(sldAvilablityId, sldOutletId, orderTatTm);
          }.bind(this)
        );
        propsDtTm.setdateTimeFlg("tmflg", "ok");
      }
    }
  }

  getAvailableDates(sldAvilablityId, sldOutletId, orderTatTm) {
    if (sldAvilablityId !== "" && sldOutletId !== "") {
      axios
        .get(
          apiUrlV2 +
            "settings/availableDatesAdvanced?app_id=" +
            appId +
            "&availability_id=" +
            sldAvilablityId +
            "&outletId=" +
            sldOutletId +
            "&tatTime=" +
            orderTatTm
        )
        .then((res) => {
          var minDateInt = 0;
          var maxDateInt = 0;
          var cutOffTime = 0;
          var intervalTime = 0;
          var resultSetArr = [];
          var weekdays = [];
          var holidaysArr = [];
          var holidaysDates = [];
          var timeSlotListArr = [];
          var dateTimeErroTxt = "";
          var timeSlotType = "1";
          /* Success response */
          if (res.data.status === "success") {
            resultSetArr = res.data.result_set;
            weekdays = resultSetArr.weekDays_data;
            minDateInt = resultSetArr.weekDays_data;
            maxDateInt = resultSetArr.weekDays_data;
            var timeslotData = res.data.timeslot_data;
            var holidaysListArr = Array();
            if (Object.keys(timeslotData).length > 0) {
              holidaysListArr =
                Object.keys(timeslotData).length > 0
                  ? timeslotData.holidayresult
                  : Array();
              var dateRstData = timeslotData.result_set;
              if (Object.keys(dateRstData).length > 0) {
                timeSlotType = dateRstData[0].time_slot_type;
                timeSlotListArr =
                  dateRstData[0].slot !== "" &&
                  dateRstData[0].slot !== null &&
                  dateRstData[0].slot !== "null"
                    ? dateRstData[0].slot
                    : [];
                minDateInt =
                  dateRstData[0].minimum_date !== ""
                    ? dateRstData[0].minimum_date
                    : 0;
                maxDateInt =
                  dateRstData[0].maximum_date !== ""
                    ? dateRstData[0].maximum_date
                    : 0;
                intervalTime =
                  dateRstData[0].interval_time !== ""
                    ? dateRstData[0].interval_time
                    : 5;
                cutOffTime =
                  dateRstData[0].cut_off !== "" ? dateRstData[0].cut_off : 0;
              }
            }

            if (Object.keys(holidaysListArr).length > 0) {
              holidaysListArr.map(function (holiday, i) {
                holidaysArr.push(new Date(holiday));
                holidaysDates.push(holiday);
              });
            }
          } else {
            dateTimeErroTxt =
              "Sorry!. Time slot not available for selected outlet.<span>Please select any other outlet.</span>";
          }

          this.setState(
            {
              resultSetdata: resultSetArr,
              timeSlotListArr: timeSlotListArr,
              order_tatTm: orderTatTm,
              min_date_int: minDateInt,
              max_date_int: maxDateInt,
              interval_time: intervalTime,
              cut_off_time: cutOffTime,
              weekdays: weekdays,
              holidaysDates: holidaysDates,
              holidays: holidaysArr,
              timeSlotType: timeSlotType,
              dateTimeErroTxt: dateTimeErroTxt,
            },
            function () {
              this.setOrderDateFun();
            }.bind(this)
          );

          if (dateTimeErroTxt !== "") {
            this.props.setdateTimeFlg("triggerErrorPopup", "yes");
          }
        });
    }
  }

  setOrderDateFun() {
    var resultSetdata = this.state.resultSetdata;
    this.props.setdateTimeFlg("ordDate", "");
    if (Object.keys(resultSetdata).length > 0) {
      var datetime = new Date();
      var currentDateValue = datetime.getDate();
      var minDateInt = this.state.min_date_int;
      minDateInt = minDateInt !== "" ? parseInt(minDateInt) : 0;
      var maxDateInt = this.state.max_date_int;
      maxDateInt = maxDateInt !== "" ? parseInt(maxDateInt) : 0;
      var cutOffTime = this.state.cut_off_time;
      cutOffTime =
        cutOffTime !== "" && parseInt(cutOffTime) !== 0
          ? parseInt(cutOffTime)
          : 24;
      var incr_minimum_days = minDateInt;
      var max_days = maxDateInt;
      var itsCurtDy = "no";
      var chkng_text = "yes";

      var weekDays_data = this.state.weekdays;
      var holiDays_data = this.state.holidaysDates;

      var str_datetime = new Date(
        new Date(datetime).setDate(currentDateValue + incr_minimum_days)
      );

      var crtutc = new Date().toJSON().slice(0, 10).replace(/-/g, "/");
      /*var sltutc = str_datetime.toJSON().slice(0,10).replace(/-/g,'/');*/
      var sltutc = format(str_datetime, "yyyy/MM/dd");

      if (crtutc === sltutc) {
        var crtdtobj = new Date();
        var currentTimeNew = crtdtobj.getHours();
        if (parseInt(currentTimeNew) < parseInt(cutOffTime)) {
          itsCurtDy = "yes";
        } else {
          incr_minimum_days = 1;
          str_datetime = new Date(
            new Date(datetime).setDate(currentDateValue + incr_minimum_days)
          );
        }
      } else if (parseInt(incr_minimum_days) > 0) {
        var currentTimeLst = dateFormat(new Date(), "H");
        if (parseInt(currentTimeLst) >= parseInt(cutOffTime)) {
          incr_minimum_days = incr_minimum_days + 1;
          str_datetime = new Date(
            new Date(datetime).setDate(currentDateValue + incr_minimum_days)
          );
        }
      }

      var min_datetime_obj = new Date(
        new Date(datetime).setDate(currentDateValue + incr_minimum_days)
      );
      var max_datetime_obj = new Date(
        new Date(datetime).setDate(
          currentDateValue + incr_minimum_days + max_days
        )
      );

      var day_intt = str_datetime.getDay();
      if (weekDays_data.indexOf(day_intt) != -1) {
        minDateInt = parseInt(minDateInt) + 1;
        chkng_text = "no";
        this.setState(
          { min_date_int: minDateInt },
          function () {
            this.setOrderDateFun();
          }.bind(this)
        );
        return false;
      }

      var datefrmt_txt = format(str_datetime, "yyyy-MM-dd");
      if (holiDays_data.indexOf(datefrmt_txt) != -1) {
        minDateInt = parseInt(minDateInt) + 1;
        chkng_text = "no";
        this.setState(
          { min_date_int: minDateInt },
          function () {
            this.setOrderDateFun();
          }.bind(this)
        );
        return false;
      }

      var orderDateTime =
        cookie.load("orderDateTime") === undefined
          ? ""
          : cookie.load("orderDateTime");

      var secc_text = "no";
      if (orderDateTime !== "") {
        secc_text = "yes";
        var dateTxtArr = orderDateTime.split("T");
        var odrDatefrmtTxt = dateTxtArr[0];
        odrDatefrmtTxt = odrDatefrmtTxt.replace('"', "");
        var odrDatefrmtObj = new Date(odrDatefrmtTxt);
        orderDateTime = odrDatefrmtObj;
        var crtDatefrmtTxt = format(datetime, "yyyy-MM-dd");
        var crtDatefrmtObj = new Date(crtDatefrmtTxt);
        if (odrDatefrmtObj < crtDatefrmtObj) {
          secc_text = "no";
        }

        var day_intt = odrDatefrmtObj.getDay();
        if (weekDays_data.indexOf(day_intt) != -1) {
          secc_text = "no";
        }

        var datefrmt_txt = format(odrDatefrmtObj, "yyyy-MM-dd");
        if (holiDays_data.indexOf(datefrmt_txt) != -1) {
          secc_text = "no";
        }
      }

      if (secc_text == "yes") {
        str_datetime = orderDateTime;
      }

      this.setState(
        {
          showDatePk: "yes",
          startDate: str_datetime,
          minDate: min_datetime_obj,
          maxDate: max_datetime_obj,
        },
        function () {
          if (this.state.timeSlotType === "2") {
            this.setOrderTimeSlotFun();
          } else {
            this.setOrderTimeFun();
          }
        }.bind(this)
      );
    }
  }

  setOrderTimeSlotFun() {
    var timeSlotListObj = this.state.timeSlotListArr;
    var selectedDate = this.state.startDate;
    this.props.setdateTimeFlg("ordSlotDate", selectedDate);
    if (Object.keys(timeSlotListObj).length > 0 && selectedDate !== "") {
      var crtutc = new Date().toJSON().slice(0, 10).replace(/-/g, "/");
      var sltutc = format(selectedDate, "yyyy/MM/dd");
      var dytext = format(selectedDate, "EEE");
      dytext = dytext.toLowerCase();

      var timeSlotListArray = this.objToArray(timeSlotListObj);
      var timeSlotListData =
        Object.keys(timeSlotListArray).length > 0
          ? timeSlotListArray[dytext]
          : Array();

      var orderTatTm = this.state.order_tatTm;

      var currentTime = new Date();
      var timeSlotHtml = "";

      var startTime = "";
      var sldordtime = "";
      var ordSlotVal = "";
      var ordSlotLbl = "";
      var ordSlotStr = "";
      var ordSlotEnd = "";
      var showTimePk = "no";
      var timeErroTxt =
        "Sorry!. Time slot not available for selected Date.<span>Please select any other date.</span>";
      var intlTimeFlg = 0;

      if (
        timeSlotListData !== "" &&
        timeSlotListData !== undefined &&
        Object.keys(timeSlotListData).length > 0
      ) {
        timeSlotListData.map(function (item) {
          if (Object.keys(item).length > 0) {
            var slotTime1 =
              item.slot_time1 !== "" ? item.slot_time1.split(":") : Array();
            var slotTime2 =
              item.slot_time2 !== "" ? item.slot_time2.split(":") : Array();
            if (
              Object.keys(slotTime1).length > 0 &&
              Object.keys(slotTime2).length > 0
            ) {
              var startTimeVal = parseInt(slotTime1[0]);
              var startMinitVal = parseInt(slotTime1[1]);
              var strdatevalobj = new Date();
              strdatevalobj.setHours(startTimeVal);
              strdatevalobj.setMinutes(startMinitVal);

              var endTimeVal = parseInt(slotTime2[0]);
              var endMinitVal = parseInt(slotTime2[1]);
              var enddatevalobj = new Date();
              enddatevalobj.setHours(endTimeVal);
              enddatevalobj.setMinutes(endMinitVal);

              var slctTmlable =
                format(strdatevalobj, "p") + " - " + format(enddatevalobj, "p");
              var slctTmValue =
                item.slot_time1 +
                ":00 - " +
                item.slot_time2 +
                ":00/" +
                slctTmlable;

              /*var curDyHrMt = currentTime.getHours()+'.'+currentTime.getMinutes();
						  var curDyHrMt  = currentTime.getHours()+'.'+currentTime.getMinutes();*/

              var tatValue = orderTatTm !== "" ? parseInt(orderTatTm) : 0;
              var dtnowobj = new Date();
              dtnowobj.setMinutes(dtnowobj.getMinutes() + tatValue);
              var curDyHrMt = dtnowobj.getHours() + "." + dtnowobj.getMinutes();

              var strDyHrMt = startTimeVal + "." + startMinitVal;

              if (crtutc === sltutc) {
                if (parseFloat(curDyHrMt) < parseFloat(strDyHrMt)) {
                  if (intlTimeFlg === 0) {
                    startTime = setHours(
                      setMinutes(new Date(), startMinitVal),
                      startTimeVal
                    );
                    sldordtime =
                      cnvrtStr(startTimeVal) + ":" + cnvrtStr(startMinitVal);
                    ordSlotVal = slctTmValue;
                    ordSlotLbl = slctTmlable;
                    ordSlotStr = item.slot_time1 + ":00";
                    ordSlotEnd = item.slot_time2 + ":00";
                    intlTimeFlg = 1;
                    showTimePk = "yes";
                    timeErroTxt = "";
                  }
                  timeSlotHtml +=
                    "<option value='" +
                    slctTmValue +
                    "'  >" +
                    slctTmlable +
                    "</option>";
                }
              } else {
                if (intlTimeFlg === 0) {
                  startTime = setHours(
                    setMinutes(new Date(), startMinitVal),
                    startTimeVal
                  );
                  sldordtime =
                    cnvrtStr(startTimeVal) + ":" + cnvrtStr(startMinitVal);
                  ordSlotVal = slctTmValue;
                  ordSlotLbl = slctTmlable;
                  ordSlotStr = item.slot_time1 + ":00";
                  ordSlotEnd = item.slot_time2 + ":00";
                  intlTimeFlg = 1;
                  showTimePk = "yes";
                  timeErroTxt = "";
                }
                timeSlotHtml +=
                  "<option value='" +
                  slctTmValue +
                  "'  >" +
                  slctTmlable +
                  "</option>";
              }
            }
          }
        });

        var orderSlotVal =
          cookie.load("orderSlotVal") === undefined
            ? ""
            : cookie.load("orderSlotVal");
        if (orderSlotVal !== "") {
          var ordstdtimevlArr = orderSlotVal.split("/");
          var sltdtimevlArr = ordstdtimevlArr[0].split(" - ");
          var strtimevlArr = sltdtimevlArr[0].split(":");
          var startTimeValNew = parseInt(strtimevlArr[0]);
          var startMinitValNew = parseInt(strtimevlArr[1]);

          var curDyHrMt =
            currentTime.getHours() + "." + currentTime.getMinutes();
          var strDyHrMt = startTimeValNew + "." + startMinitValNew;

          if (crtutc === sltutc) {
            if (parseFloat(curDyHrMt) < parseFloat(strDyHrMt)) {
              startTime = setHours(
                setMinutes(new Date(), startMinitValNew),
                startTimeValNew
              );
              sldordtime =
                cnvrtStr(startTimeValNew) + ":" + cnvrtStr(startMinitValNew);
              ordSlotVal = orderSlotVal;
              ordSlotLbl = cookie.load("orderSlotTxt");
              ordSlotStr = cookie.load("orderSlotStrTime");
              ordSlotEnd = cookie.load("orderSlotEndTime");
            }
          } else {
            startTime = setHours(
              setMinutes(new Date(), startMinitValNew),
              startTimeValNew
            );
            sldordtime =
              cnvrtStr(startTimeValNew) + ":" + cnvrtStr(startMinitValNew);
            ordSlotVal = orderSlotVal;
            ordSlotLbl = cookie.load("orderSlotTxt");
            ordSlotStr = cookie.load("orderSlotStrTime");
            ordSlotEnd = cookie.load("orderSlotEndTime");
          }
        }
      }

      var timeSlotHtmlDrwn = timeSlotHtml !== "" ? Parser(timeSlotHtml) : "";
      var sldorddate = format(selectedDate, "yyyy-MM-dd");

      this.setState({
        showTimePk: showTimePk,
        timeSlotHtmlDrwn: timeSlotHtmlDrwn,
        startTime: startTime,
        slctTimeValue: ordSlotVal,
        timeErroTxt: timeErroTxt,
      });
      var tmSltArr = Array();
      tmSltArr["startTime"] = startTime;
      tmSltArr["sldorddate"] = sldorddate;
      tmSltArr["sldordtime"] = sldordtime;
      tmSltArr["ordSlotVal"] = ordSlotVal;
      tmSltArr["ordSlotLbl"] = ordSlotLbl;
      tmSltArr["ordSlotStr"] = ordSlotStr;
      tmSltArr["ordSlotEnd"] = ordSlotEnd;
      this.props.setdateTimeFlg("ordSlotTime", tmSltArr);
    }
  }

  setOrderTimeFun() {
    var resultSetdata = this.state.resultSetdata;
    var selectedDate = this.state.startDate;
    this.props.setdateTimeFlg("ordDate", selectedDate);
    if (Object.keys(resultSetdata).length > 0 && selectedDate !== "") {
      var crtutc = new Date().toJSON().slice(0, 10).replace(/-/g, "/");
      var sltutc = format(selectedDate, "yyyy/MM/dd");
      var dytext = format(selectedDate, "EEE");
      dytext = dytext.toLowerCase();

      var currentdayslotData = resultSetdata.currentdayslot_data;
      var naxtdayslotData = resultSetdata.naxtdayslot_data;
      var currentdayslotArray = this.objToArray(currentdayslotData);
      var nextdayslotArray = this.objToArray(naxtdayslotData);

      var its_current_daytxt = "no";
      if (crtutc === sltutc) {
        var finaldays_data = this.filterDaysData(
          "yes",
          currentdayslotArray,
          dytext
        );
        its_current_daytxt = "yes";
      } else {
        var finaldays_data = this.filterDaysData(
          "no",
          nextdayslotArray,
          dytext
        );
      }

      var chkFinalIndex =
        finaldays_data.length > 1 ? finaldays_data.length - 1 : 0;
      if (chkFinalIndex > 0) {
        if (finaldays_data[chkFinalIndex] == "00:00") {
          finaldays_data.splice(chkFinalIndex, 1);
        }
      }

      var startTime = "";
      var sldordtime = "";
      var includeTimesList = [];
      var showTimePk = "no";
      var timeErroTxt =
        "Sorry!. Time slot not available for selected Date.<span>Please select any other date.</span>";
      var orderTatTm = this.state.order_tatTm;

      if (finaldays_data.length > 0) {
        includeTimesList = this.setIncludeTimes(finaldays_data);
        showTimePk = "yes";
        timeErroTxt = "";

        var timeArrdt = finaldays_data[0].split(":");
        var time_hr =
          parseInt(timeArrdt[0]) < 10
            ? "0" + parseInt(timeArrdt[0])
            : timeArrdt[0];
        var time_mt =
          parseInt(timeArrdt[1]) < 10
            ? "0" + parseInt(timeArrdt[1])
            : timeArrdt[1];
        var frstSlotTime = time_hr + ":" + time_mt;

        var selectedTime =
          cookie.load("deliveryTime") === undefined
            ? ""
            : cookie.load("deliveryTime");

        var startTimeTemp = frstSlotTime;

        if (selectedTime !== "") {
          var slt_time = selectedTime.split(":");
          var slt_hour = slt_time[0];
          if (slt_hour == "00") {
            slt_hour = 24;
          }
          var slt_min = slt_time[1];
          var selectedTime2Dg = slt_time[0] + ":" + slt_time[1];
          var SltTmCal = slt_hour + "." + slt_min;

          if (its_current_daytxt == "yes") {
            var tatvalnew = orderTatTm !== "" ? parseInt(orderTatTm) : 0;
            var dtnowobj = new Date();
            dtnowobj.setMinutes(dtnowobj.getMinutes() + tatvalnew);
            var currentTimetat = dtnowobj.getHours();
            var currentMinstat = dtnowobj.getMinutes();

            var Crt_Time = currentTimetat + "." + currentMinstat;

            var totalTimeTxt = SltTmCal - Crt_Time;

            if (
              totalTimeTxt > 0 &&
              finaldays_data.indexOf(selectedTime2Dg) != -1
            ) {
              startTimeTemp = selectedTime2Dg;
            } else {
              startTimeTemp = frstSlotTime;
            }
          } else {
            if (finaldays_data.indexOf(selectedTime2Dg) != -1) {
              startTimeTemp = selectedTime2Dg;
            } else {
              startTimeTemp = frstSlotTime;
            }
          }
        }

        var startTimeTempArr = startTimeTemp.split(":");
        startTime = setHours(
          setMinutes(new Date(), startTimeTempArr[1]),
          startTimeTempArr[0]
        );
        sldordtime =
          cnvrtStr(startTimeTempArr[0]) + ":" + cnvrtStr(startTimeTempArr[1]);
      }

      var sldorddate = format(selectedDate, "yyyy-MM-dd");

      this.setState({
        showTimePk: showTimePk,
        includeTimesList: includeTimesList,
        startTime: startTime,
        timeErroTxt: timeErroTxt,
      });
      var tmDatatArr = Array();
      tmDatatArr["startTime"] = startTime;
      tmDatatArr["sldorddate"] = sldorddate;
      tmDatatArr["sldordtime"] = sldordtime;
      this.props.setdateTimeFlg("ordTime", tmDatatArr);
    }
  }

  filterDaysData(is_currentday, currentlot_data, dytext) {
    var orderTatTm = this.state.order_tatTm;
    var resultSetdata = this.state.resultSetdata;
    var days_arr_data = currentlot_data;
    var crtslt_str_arr = this.objToArray(resultSetdata.currentslot_str_data);
    var crtslt_end_arr = this.objToArray(resultSetdata.currentslot_end_data);
    var its_spl_dayarr = this.objToArray(resultSetdata.its_spl_data);

    var currentday_data =
      Object.keys(days_arr_data).length > 0 ? days_arr_data[dytext] : Array();
    var currentslot_strdata =
      Object.keys(crtslt_str_arr).length > 0 ? crtslt_str_arr[dytext] : Array();
    var currentslot_enddata =
      Object.keys(crtslt_end_arr).length > 0 ? crtslt_end_arr[dytext] : Array();
    var its_spl_datatxt =
      Object.keys(its_spl_dayarr).length > 0 ? its_spl_dayarr[dytext] : "";

    if (is_currentday == "yes") {
      var new_updated_arr = Array();
      var crt_d = new Date();
      var crt_hr_mt = crt_d.getTime();
      if (typeof currentday_data !== "undefined") {
        for (var i = 0; i < currentday_data.length; i++) {
          var splits_arr = currentday_data[i].split(":");
          var strTimeVal = parseInt(splits_arr[0]);
          var strMinitVal = parseInt(splits_arr[1]);
          var crntdatevalobj = new Date();
          crntdatevalobj.setHours(strTimeVal);
          crntdatevalobj.setMinutes(strMinitVal);

          var str_hr_mt = crntdatevalobj.getTime();
          var end_time_val = this.getEndtimeTxt(
            str_hr_mt,
            currentslot_strdata,
            currentslot_enddata
          );

          if (str_hr_mt > crt_hr_mt) {
            var ingrendMinits = parseInt(strMinitVal) + parseInt(orderTatTm);
            crntdatevalobj.setMinutes(ingrendMinits);
            var fnl_hr_mt = crntdatevalobj.getTime();
            if (fnl_hr_mt <= end_time_val) {
              var gt_hrtxt =
                parseInt(crntdatevalobj.getHours()) < 10
                  ? "0" + parseInt(crntdatevalobj.getHours())
                  : crntdatevalobj.getHours();
              var gt_mttxt =
                parseInt(crntdatevalobj.getMinutes()) < 10
                  ? "0" + parseInt(crntdatevalobj.getMinutes())
                  : crntdatevalobj.getMinutes();
              var timemin_txt = gt_hrtxt + ":" + gt_mttxt;
              new_updated_arr.push(timemin_txt);
            }
          }
        }
      }
      currentday_data = new_updated_arr;
    }

    if (typeof currentday_data === "undefined") {
      currentday_data = Array();
    }

    return currentday_data;
  }

  getEndtimeTxt(str_hr_mt, currentslot_strdata, currentslot_enddata) {
    var end_time_str = 0;

    for (var j = 0; j < currentslot_strdata.length; j++) {
      var splits_arr = currentslot_strdata[j].split(":");
      var strTimeVal = parseInt(splits_arr[0]);
      var strMinitVal = parseInt(splits_arr[1]);
      var strdatevalobj = new Date();
      strdatevalobj.setHours(strTimeVal);
      strdatevalobj.setMinutes(strMinitVal);
      var strhr_mt = strdatevalobj.getTime();

      var splits_arr2 = currentslot_enddata[j].split(":");
      var endTimeVal = parseInt(splits_arr2[0]);
      var endMinitVal = parseInt(splits_arr2[1]);
      var enddatevalobj = new Date();
      enddatevalobj.setHours(endTimeVal);
      enddatevalobj.setMinutes(endMinitVal);
      var endhr_mt = enddatevalobj.getTime();

      if (str_hr_mt >= strhr_mt && str_hr_mt <= endhr_mt) {
        end_time_str = endhr_mt;
      }
    }

    return end_time_str;
  }

  objToArray(objVal) {
    var arrayVal = Array();
    if (objVal !== undefined) {
      if (Object.keys(objVal).length > 0) {
        Object.keys(objVal).map(function (key) {
          arrayVal[key] = objVal[key];
        });
      }
    }
    return arrayVal;
  }

  handleChangeDate(datevalue) {
    this.setState(
      { startDate: datevalue },
      function () {
        if (this.state.timeSlotType === "2") {
          this.setOrderTimeSlotFun();
        } else {
          this.setOrderTimeFun();
        }
      }.bind(this)
    );
  }

  handleChangeTime(timevalue) {
    this.setState({ startTime: timevalue });
    var selectedDate = this.state.startDate;
    var tmDatatArr = Array();
    tmDatatArr["startTime"] = timevalue;
    tmDatatArr["sldorddate"] = format(selectedDate, "yyyy-MM-dd");
    tmDatatArr["sldordtime"] =
      cnvrtStr(timevalue.getHours()) + ":" + cnvrtStr(timevalue.getMinutes());

    this.props.setdateTimeFlg("ordTime", tmDatatArr);
  }

  ordTimeSlotChange(event) {
    var ordstdtimevl = event.target.value;
    var ordstdtimevlArr = ordstdtimevl.split("/");
    var sltdtimevlArr = ordstdtimevlArr[0].split(" - ");
    var strtimevlArr = sltdtimevlArr[0].split(":");
    var startTimeVal = parseInt(strtimevlArr[0]);
    var startMinitVal = parseInt(strtimevlArr[1]);
    var startTime = setHours(
      setMinutes(new Date(), startMinitVal),
      startTimeVal
    );
    var sldordtime = cnvrtStr(startTimeVal) + ":" + cnvrtStr(startMinitVal);

    var selectedDate = this.state.startDate;

    var tmSltArr = Array();
    tmSltArr["startTime"] = startTime;
    tmSltArr["sldorddate"] = format(selectedDate, "yyyy-MM-dd");
    tmSltArr["sldordtime"] = sldordtime;
    tmSltArr["ordSlotVal"] = ordstdtimevl;
    tmSltArr["ordSlotLbl"] = ordstdtimevlArr[1];
    tmSltArr["ordSlotStr"] = sltdtimevlArr[0];
    tmSltArr["ordSlotEnd"] = sltdtimevlArr[1];

    this.setState({ startTime: startTime, slctTimeValue: ordstdtimevl });

    this.props.setdateTimeFlg("ordSlotTime", tmSltArr);
  }

  isWeekday(date) {
    var day = getDay(date);
    var weekdaysArr = this.state.weekdays;
    return !weekdaysArr.includes(day);

    /*return day !== 0 && day !== 6;*/
  }

  updateDateTm() {
    var tstVl = cookie.load("chkOrderDateTime");
    console.log("coming", tstVl);
    /*var startTime = this.state.startTime;
		var orderDateTime = this.state.startDate;
			orderDateTime.setHours(startTime.getHours());
			orderDateTime.setMinutes(startTime.getMinutes());
		var deliveryDate = dateFormat(orderDateTime, "dd/mm/yyyy");	
		var deliveryTime = dateFormat(orderDateTime, "HH:MM:ss");	
		*/
  }

  setIncludeTimes(finalTimeList) {
    var timeListArr = [];
    finalTimeList.map(function (timeList, i) {
      var timeArr = timeList.split(":");
      timeListArr.push(
        setHours(setMinutes(new Date(), timeArr[1]), timeArr[0])
      );
    });

    return timeListArr;
  }

  render() {
    if (this.state.showDatePk === "yes") {
      return (
        <div>
          {this.state.timeErroTxt !== "" && (
            <div className="timeslot_info">
              {Parser(this.state.timeErroTxt)}
            </div>
          )}
          <div className="syd_merge">
            <div className="syd_date">
              <div className="form-group222">
                <DatePicker
                  className="form-control ordr-datetime-cls"
                  selected={this.state.startDate}
                  minDate={this.state.minDate}
                  maxDate={this.state.maxDate}
                  dateFormat="dd/MM/yyyy"
                  onChange={this.handleChangeDate}
                  filterDate={this.isWeekday}
                  excludeDates={this.state.holidays}
                />
              </div>
            </div>

            {this.state.timeSlotType === "2" ? (
              <div className="syd_time delivery_submit_cls">
                <div className="form-group222">
                  {this.state.showTimePk === "yes" ? (
                    <div
                      className="form-group custom_select"
                      id="ordstdtime_list_div"
                    >
                      <select
                        name="ordstdtime_list_id"
                        onChange={this.ordTimeSlotChange.bind(this)}
                        value={this.state.slctTimeValue}
                        className="form-control"
                      >
                        {this.state.timeSlotHtmlDrwn}
                      </select>
                    </div>
                  ) : (
                    <input
                      type="text"
                      readOnly
                      className="form-control"
                      placeholder={"hh:mm - hh:mm"}
                    />
                  )}
                </div>
              </div>
            ) : (
              <div className="syd_time delivery_submit_cls">
                <div className="form-group222">
                  {this.state.showTimePk === "yes" ? (
                    <DatePicker
                      className="form-control ordr-datetime-cls"
                      selected={this.state.startTime}
                      onChange={this.handleChangeTime}
                      showTimeSelect
                      showTimeSelectOnly
                      timeFormat="hh:mm a"
                      dateFormat="hh:mm a"
                      timeIntervals={5}
                      includeTimes={this.state.includeTimesList}
                      timeCaption="Time"
                    />
                  ) : (
                    <input
                      type="text"
                      readOnly
                      className="form-control"
                      placeholder={"hh:mm"}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      );
    } else {
      return (
        <div className="timeslot_info_main">
          {this.state.dateTimeErroTxt !== "" && (
            <div className="timeslot_info">
              {Parser(this.state.dateTimeErroTxt)}
            </div>
          )}
          <div className="syd_merge">
            <div className="syd_date">
              <div className="form-group222">
                <input
                  type="text"
                  readOnly
                  className="form-control"
                  placeholder={"dd/mm/yyyy"}
                />
              </div>
            </div>
            <div className="syd_time delivery_submit_cls">
              <div className="form-group222">
                <input
                  type="text"
                  readOnly
                  className="form-control"
                  placeholder={"hh:mm"}
                />
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default OrderAdvancedDatetimeSlot;
