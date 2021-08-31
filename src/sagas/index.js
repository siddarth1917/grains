import { all } from "redux-saga/effects";
import { watchGetSettings } from "./settings";
import { watchGetStaticBlack } from "./staticblack";
import {
  watchGetCartDetail,
  watchUpdateCartDetail,
  watchDeleteCartDetail,
  watchDestroyCartDetail,
} from "./cartlist";
import { watchGetPickupOutlets } from "./outlets";
import { watchGetAllOutlets } from "./alloutlets";
import { watchGetZonedetail } from "./zonedetail";
import { watchGetBanner } from "./banner";
import { watchGetFeaturePro } from "./featureproduct";
import { watchGetMenuNavigation, watchGetProducts } from "./product";
import { watchGetProductDetail } from "./productdetail";
import { watchGetOrderDetail } from "./orderdetail";
import { watchGetAddonPro } from "./addonproduct";
import { watchGetLoginData } from "./login";
import { watchGetFbLoginData } from "./fblogin";
import { watchGetGoogleLoginData } from "./googlelogin";
import { watchGetCustomerDetail } from "./customerdetail";
import { watchGetForgetPassword } from "./forgetpassword";
import { watchGetRegistration } from "./registration";
import { watchGetChangePassword } from "./changepassword";
import { watchGetUpdateCustomerProfile } from "./updatecustomerprofile";
import { watchGetCorderDetail } from "./corderdetail";
import { watchGetPorderDetail } from "./porderdetail";
import { watchGetPrintOrder } from "./printorder";
import { watchGetOrderHistory } from "./orderhistory";
import { watchGetPromotionList } from "./promotionlist";
import { watchGetPromotionReceipt } from "./promotionreceipt";
import { watchGetApplyPromotion } from "./applypromotion";
import { watchGetActivityCount } from "./activitycount";
import { watchGetRewardEarned } from "./rewardearned";
import { watchGetRewardRedeem } from "./rewardredeem";
import { watchGetRequestpage } from "./pages";
import { watchGetMenuData } from "./menudata";
import { watchGetContactData } from "./contactdata";
import { watchGetNewsData } from "./news";
import { watchGetHolidays } from "./holidays";
import { watchGetSecAddress, watchAddSecAddress } from "./secondaryaddress";
import { watchGetNormalpopup } from "./normalpopup";

export default function* () {
  yield all([
    watchGetSettings(),
    watchGetStaticBlack(),
    watchGetCartDetail(),
    watchUpdateCartDetail(),
    watchDeleteCartDetail(),
    watchDestroyCartDetail(),
    watchGetPickupOutlets(),
    watchGetAllOutlets(),
    watchGetZonedetail(),
    watchGetBanner(),
    watchGetFeaturePro(),
    watchGetMenuNavigation(),
    watchGetProducts(),
    watchGetProductDetail(),
    watchGetAddonPro(),
    watchGetOrderDetail(),
    watchGetLoginData(),
    watchGetFbLoginData(),
    watchGetGoogleLoginData(),
    watchGetCustomerDetail(),
    watchGetForgetPassword(),
    watchGetRegistration(),
    watchGetChangePassword(),
    watchGetUpdateCustomerProfile(),
    watchGetCorderDetail(),
    watchGetPorderDetail(),
    watchGetPrintOrder(),
    watchGetOrderHistory(),
    watchGetPromotionList(),
    watchGetPromotionReceipt(),
    watchGetApplyPromotion(),
    watchGetActivityCount(),
    watchGetRewardEarned(),
    watchGetRewardRedeem(),
    watchGetRequestpage(),
    watchGetMenuData(),
    watchGetContactData(),
    watchGetNewsData(),
    watchGetHolidays(),
    watchGetSecAddress(),
    watchAddSecAddress(),
    watchGetNormalpopup(),
  ]);
}
