(function () {
  "use strict";

  var config = window.BURANAVI_CONFIG || {};
  var downloads = {
    mobile: config.mobileApkUrl || "",
    wear: config.wearApkUrl || ""
  };

  function isUsableUrl(value) {
    return typeof value === "string" && /^https:\/\//i.test(value.trim());
  }

  function setTextValues() {
    var elements = document.querySelectorAll("[data-config-text]");
    elements.forEach(function (element) {
      var key = element.getAttribute("data-config-text");
      if (typeof config[key] === "string" && config[key].trim()) {
        element.textContent = config[key];
      }
    });
  }

  function configureDownloads() {
    var enabledCount = 0;
    var buttons = document.querySelectorAll("[data-download]");

    buttons.forEach(function (button) {
      var type = button.getAttribute("data-download");
      var url = downloads[type];

      if (isUsableUrl(url)) {
        button.href = url;
        button.removeAttribute("aria-disabled");
        button.classList.remove("is-disabled");
        enabledCount += 1;
      } else {
        button.href = "#download";
        button.setAttribute("aria-disabled", "true");
        button.classList.add("is-disabled");
        button.addEventListener("click", function (event) {
          event.preventDefault();
          var status = document.querySelector("[data-download-status]");
          if (status) {
            status.textContent = "APKの公開URLはまだ設定されていません。";
          }
        });
      }
    });

    var status = document.querySelector("[data-download-status]");
    if (status && enabledCount === 2) {
      status.textContent = "スマホ版・Wear OS版のAPKをダウンロードできます。";
    }
  }

  function configureLinks() {
    var actionLinks = document.querySelectorAll("[data-config-link-action]");
    actionLinks.forEach(function (link) {
      var key = link.getAttribute("data-config-link-action");
      var url = config[key];

      if (isUsableUrl(url)) {
        link.href = url;
        link.removeAttribute("aria-disabled");
        link.textContent = link.textContent.replace("（準備中）", "");
      } else {
        link.addEventListener("click", function (event) {
          event.preventDefault();
        });
      }
    });

    var canonical = document.querySelector("[data-config-link='canonicalUrl']");
    if (canonical && isUsableUrl(config.canonicalUrl)) {
      canonical.href = config.canonicalUrl;
    }

    var metaElements = document.querySelectorAll("[data-config-meta]");
    metaElements.forEach(function (meta) {
      var key = meta.getAttribute("data-config-meta");
      if (isUsableUrl(config[key])) {
        meta.setAttribute("content", config[key]);
      } else {
        meta.removeAttribute("content");
      }
    });
  }

  function setCurrentYear() {
    var years = document.querySelectorAll("[data-current-year]");
    var currentYear = String(new Date().getFullYear());
    years.forEach(function (element) {
      element.textContent = currentYear;
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (event) {
      const hash = link.getAttribute("href");

      if (!hash || hash === "#") {
        return;
      }

      const target = document.getElementById(
        decodeURIComponent(hash.slice(1))
      );

      if (!target) {
        return;
      }

      event.preventDefault();

      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

      history.pushState(null, "", hash);
    });
  });

  setTextValues();
  configureDownloads();
  configureLinks();
  setCurrentYear();
}());
