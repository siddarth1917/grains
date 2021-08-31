/* Header Fixed Script */
$(window).scroll(function () {
  if ($(window).scrollTop() != 0) {
    $("header").addClass("small_sticky");
  } else {
    $("header").removeClass("small_sticky");
  }

  var mycustomscroll =
      $(".product-menu-listing").length > 0
        ? $(".product-menu-listing").offset().top - 92
        : 0,
    wind_toptxt = $(window).scrollTop();

  if (wind_toptxt > mycustomscroll) {
    $(".menu-section-inner").addClass("fxd_lftmenu_div");
  } else {
    $(".menu-section-inner").removeClass("fxd_lftmenu_div");
  }

  if ($(".footer-bottom").length > 0) {
    var top_of_element = $(".footer-bottom").offset().top;
    var tempval = 70;
    /* top_of_element = parseInt(top_of_element) + parseInt(tempval); */
    top_of_element = parseInt(top_of_element);
    var bottom_of_element =
      $(".footer-bottom").offset().top + $(".footer-bottom").outerHeight();
    var bottom_of_screen = $(window).scrollTop() + $(window).height();
    var top_of_screen = $(window).scrollTop();
    if (
      bottom_of_screen > top_of_element &&
      top_of_screen < bottom_of_element
    ) {
      $(".menu-section-inner").removeClass("fxd_lftmenu_div");
      $(".menu-section-inner").addClass("bottom_abs");
    } else {
      $(".menu-section-inner").removeClass("bottom_abs");
    }
  }
});

$(document)
  .off("click", ".hcartdd_trigger_dis")
  .on("click", ".hcartdd_trigger_dis", function (e) {
    e.preventDefault();
    e.stopPropagation();
  });

$(document).ready(function () {
  $(document)
    .off("click", ".restaurant_filter")
    .on("click", ".restaurant_filter", function (e) {
      if ($(".filter-details").hasClass("active") === false) {
        $(".filter-details").show();
        $(".filter-clear-image").show();
        $(".filter-img").hide();
        $(".filter-details").addClass("active");
      } else {
        $(".filter-details").hide();
        $(".filter-clear-image").hide();
        $(".filter-img").show();
        $(".filter-details").removeClass("active");
      }
    });
  $(document)
    .off("click", ".close_filter_section")
    .on("click", ".close_filter_section", function (e) {
      $(".filter-details").hide();
      $(".filter-details").removeClass("active");
    });
  $(document)
    .off("click", ".controller-nav")
    .on("click", ".controller-nav", function (e) {
      e.preventDefault();
      e.stopPropagation();
      if ($(".mobile-login-list").hasClass("active")) {
        $(".mobile-login-list").removeClass("active");
      } else {
        $(".mobile-login-list").addClass("active");
      }
    });
  $(document)
    .off("click", ".controller-nav")
    .on("click", ".controller-nav", function (e) {
      e.preventDefault();
      e.stopPropagation();
      if ($(".mobile-login-list").hasClass("active")) {
        $(".mobile-login-list").removeClass("active");
      } else {
        $(".mobile-login-list").addClass("active");
      }
    });

  $(document)
    .off("click", ".custom_close")
    .on("click", ".custom_close", function (e) {
      e.preventDefault();
      $(".custom_alertcls, .custom_center_alertcls").hide();
    });

  $(document)
    .off("click", ".compo_acc_action")
    .on("click", ".compo_acc_action", function (e) {
      $(this).closest(".main_combo_div").toggleClass("compo_acc_active");
      $(this)
        .closest(".main_combo_div")
        .find(".compo_acc_innerdiv")
        .slideToggle();
    });

  $(document)
    .off("click", ".submenu-arow")
    .on("click", ".submenu-arow", function (e) {
      $(this).closest("li").toggleClass("open-submenu");
      $(this).closest("li").find(".submenu_list").slideToggle();
    });

  if ($(".open-popup-link").length > 0) {
    $(".open-popup-link").magnificPopup({
      type: "inline",
      midClick: true, // Allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source in href.
    });
  }

  if ($(".disbl_href_action").length > 0) {
    $(".disbl_href_action").click(function (e) {
      e.preventDefault();
    });
  }
  $(document)
    .off("click", ".hcartdd_trigger_dis")
    .on("click", ".hcartdd_trigger_dis", function (e) {
      e.preventDefault();
      e.stopPropagation();
    });

  if ($(".trigger_menu").length > 0) {
    $(document)
      .off("click", ".trigger_menu")
      .on("click", ".trigger_menu", function (e) {
        e.stopPropagation();
        $(this).toggleClass("active");
        $(".mobile_hmenu_list").toggleClass("open");
      });
    $(document).click(function (e) {
      if (
        !$(e.target).is(
          ".trigger_menu, .mobile_hmenu_list, .mobile_hmenu_list * "
        )
      ) {
        if ($(".mobile_hmenu_list").is(":visible")) {
          $(".mobile_hmenu_list").removeClass("open");
          $(".trigger_menu").removeClass("active");
        }
      }
    });
  }

  if ($(".trigger_menunav_act").length > 0) {
    $(document)
      .off("click", ".trigger_menunav_act")
      .on("click", ".trigger_menunav_act", function (e) {
        e.stopPropagation();
        $("body").toggleClass("mbl-hiden");
        $(".mobile-menu").toggleClass("active");
      });
    $(document).click(function (e) {
      if (!$(e.target).is(".trigger_menunav_act, .menu, .menu * ")) {
        if ($(".menu").is(":visible")) {
          $(".mobile-menu").removeClass("active");
          $("body").removeClass("mbl-hiden");
        }
      }
    });
  }

  if ($("#close_mobile_menu").length > 0) {
    $(document)
      .off("click", "#close_mobile_menu")
      .on("click", "#close_mobile_menu", function (e) {
        e.stopPropagation();
        $(".mobile-menu").removeClass("active");
        $("body").removeClass("mbl-hiden");
      });
  }

  $(document)
    .off("click", ".user-profile-action")
    .on("click", ".user-profile-action", function (e) {
      e.stopPropagation();
      $(".user-profile-list").toggleClass("open");
    });

  /* Input lable animation */
  if ($(".input-focus").length > 0) {
    $(".input-focus").focus(function () {
      $(this).parents(".focus-out").addClass("focused");
    });
    $(".input-focus").blur(function () {
      var inputValue = $(this).val();
      if (inputValue == "") {
        $(this).removeClass("filled");
        $(this).parents(".focus-out").removeClass("focused");
      } else {
        $(this).addClass("filled");
      }
    });
  }

  $(document).on(
    "click",
    ".popup-modal-dismiss, .common-mfd-closefun",
    function (e) {
      e.preventDefault();
      $.magnificPopup.close();
    }
  );

  setTimeout(function () {
    if ($(".menu-section-inner").length > 0) {
      $(".menu-section-inner").mCustomScrollbar();
    }
  }, 800);

  $(document).click(function (e) {
    if (!$(e.target).is(".restaurant_filter, .filter-details * ")) {
      if ($(".filter-details").hasClass("active") === true) {
        $(".filter-details").hide();
        $(".filter-clear-image").hide();
        $(".filter-img").show();
        $(".filter-details").removeClass("active");
      }
    }
    if (!$(e.target).is(".more-menu, .more-menu * ")) {
      if ($(".more-menu-parent").hasClass("active")) {
        $(".more-menu-parent").removeClass("active");
        $(".more_categor_info").removeClass("active");
        $(".more_categor_info").hide();
      }
    }
  });

  /* Header cart dropdown */
  if ($(".hcartdd_trigger").length > 0) {
    $(document)
      .off("click", ".hcartdd_trigger")
      .on("click", ".hcartdd_trigger", function (e) {
        e.preventDefault();
        e.stopPropagation();

        if ($("#totalitmcount").val() > 0) {
          $("body").addClass("cart-items-open");
          $(this).toggleClass("active");
          $(".hcart_dropdown").toggleClass("open");
        }
      });

    $(document).click(function (e) {
      if ($("body").width() <= 980) {
        if (!$(e.target).is(".hcart_dropdown, .hcart_dropdown * ")) {
          if ($(".hcartdd_trigger").hasClass("active") == true) {
            $("body").removeClass("cart-items-open");
            $(".hcartdd_trigger").removeClass("active");
            $(".hcart_dropdown").removeClass("open");
          }
        }

        if (!$(e.target).is(".more-menu, .more-menu * ")) {
          if ($(".more-menu-parent").hasClass("active")) {
            $(".more-menu-parent").removeClass("active");
            $(".more_categor_info").removeClass("active");
            $(".more_categor_info").hide();
          }
        }
        if (!$(e.target).is(".mobile-login-list, mobile-login-list * ")) {
          if ($(".mobile-login-list").hasClass("active")) {
            $(".mobile-login-list").removeClass("active");
          }
        }
      }
    });
  }

  $(document)
    .off("click", ".more-menu-parent")
    .on("click", ".more-menu-parent", function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (!$(".more_categor_info").is(":visible")) {
        $(".more_categor_info").show().addClass("active");
        $(".more-menu-parent").addClass("active");
      } else {
        $(".more_categor_info").hide().removeClass("active");
        $(".more-menu-parent").removeClass("active");
      }
    });
});
