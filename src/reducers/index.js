import settings from "./settings";
import staticblack from "./staticblack";
import cartlistdetail from "./cartlistdetail";
import outlets from "./outlets";
import alloutlets from "./alloutlets";
import zonedetail from "./zonedetail";
import banner from "./banner";
import featureproduct from "./featureproduct";
import product from "./product";
import productdetail from "./productdetail";
import addonproduct from "./addonproduct";
import login from "./login";
import fblogin from "./fblogin";
import googlelogin from "./googlelogin";
import customerdetail from "./customerdetail";
import forgetpassword from "./forgetpassword";
import registration from "./registration";
import changepassword from "./changepassword";
import updatecartdetail from "./updatecartdetail";
import updatecustomerprofile from "./updatecustomerprofile";
import corderdetail from "./corderdetail";
import porderdetail from "./porderdetail";
import orderdetail from "./orderdetail";
import printorder from "./printorder";
import orderhistory from "./orderhistory";
import promotionlist from "./promotionlist";
import promotionreceipt from "./promotionreceipt";
import applypromotion from "./applypromotion";
import activitycount from "./activitycount";
import rewardearned from "./rewardearned";
import rewardredeem from "./rewardredeem";
import pagedata from "./pages";
import menudata from "./menudata";
import contactdata from "./contactdata";
import newsdata from "./news";
import holidays from "./holidays";
import availabiledate from "./availabiledate";
import availabiletime from "./availabiletime";
import orderrequestlist from "./orderrequestlist";
import secondaryaddress from "./secondaryaddress";
import normalpopup from "./normalpopup";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
  settings: settings,
  staticblack: staticblack,
  cartlistdetail: cartlistdetail,
  updatecartdetail: updatecartdetail,
  outlets: outlets,
  alloutlets: alloutlets,
  zonedetail: zonedetail,
  banner: banner,
  featureproduct: featureproduct,
  product: product,
  productdetail: productdetail,
  addonproduct: addonproduct,
  login: login,
  fblogin: fblogin,
  googlelogin: googlelogin,
  customerdetail: customerdetail,
  forgetpassword: forgetpassword,
  registration: registration,
  changepassword: changepassword,
  updatecustomerprofile: updatecustomerprofile,
  corderdetail: corderdetail,
  porderdetail: porderdetail,
  orderdetail: orderdetail,
  printorder: printorder,
  orderhistory: orderhistory,
  promotionlist: promotionlist,
  promotionreceipt: promotionreceipt,
  applypromotion: applypromotion,
  activitycount: activitycount,
  rewardearned: rewardearned,
  rewardredeem: rewardredeem,
  pagedata: pagedata,
  menudata: menudata,
  contactdata: contactdata,
  newsdata: newsdata,
  holidays: holidays,
  availabiledate: availabiledate,
  availabiletime: availabiletime,
  orderrequestlist: orderrequestlist,
  secondaryaddress: secondaryaddress,
  normalpopuplist: normalpopup,
});

export default rootReducer;
