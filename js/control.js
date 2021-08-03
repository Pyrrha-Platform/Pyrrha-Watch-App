/**
 * Manage the screens.
 */
(function () {
  window.addEventListener("tizenhwkey", function (ev) {
    if (ev.keyName === "back") {
      var page = document.getElementsByClassName("ui-page-active")[0],
        pageid = page ? page.id : "";

      if (pageid === "main") {
        try {
          tizen.application.getCurrentApplication().exit();
        } catch (ignore) {}
      } else {
        window.history.back();
      }
    }
  });
})();

/**
 * Keep the app from going to sleep.
 */
(function () {
  try {
    tizen.power.setScreenStateChangeListener(function (prevState, currState) {
      if (currState === "SCREEN_NORMAL" && prevState === "SCREEN_OFF") {
        // On screen wake
        var app = tizen.application.getCurrentApplication();
        tizen.application.launch(app.appInfo.id, function () {
          // You can do something here when your app has launched
        });
      }
    });
  } catch (e) {}
})();

/**
 * Handle toast alerts.
 */
(function (tau) {
  var toastPopup = document.getElementById("toast");
  toastPopup.addEventListener(
    "popupshow",
    function (ev) {
      setTimeout(function () {
        tau.closePopup();
      }, 3000);
    },
    false
  );
})(window.tau);
