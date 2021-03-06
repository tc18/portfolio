! function(t) {
  "use strict";

  function e() {
    return b.urlPrefix + b.visitsUrl
  }

  function n() {
    return b.urlPrefix + b.eventsUrl
  }

  function i() {
    return (b.useBeacon || b.trackNow) && P && "undefined" != typeof t.navigator.sendBeacon
  }

  function r(t, e, n) {
    var i = "",
      r = "";
    if (n) {
      var o = new Date;
      o.setTime(o.getTime() + 60 * n * 1e3), i = "; expires=" + o.toGMTString()
    }
    var a = b.cookieDomain || b.domain;
    a && (r = "; domain=" + a), document.cookie = t + "=" + escape(e) + i + r + "; path=/"
  }

  function o(t) {
    var e, n, i = t + "=",
      r = document.cookie.split(";");
    for (e = 0; e < r.length; e++) {
      for (n = r[e];
        " " === n.charAt(0);) n = n.substring(1, n.length);
      if (0 === n.indexOf(i)) return unescape(n.substring(i.length, n.length))
    }
    return null
  }

  function a(t) {
    r(t, "", -1)
  }

  function c(e) {
    o("ahoy_debug") && t.console.log(e)
  }

  function s() {
    for (var t; t = J.shift();) t();
    I = !0
  }

  function u(t) {
    I ? t() : J.push(t)
  }

  function f() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(t) {
      var e = 16 * Math.random() | 0,
        n = "x" == t ? e : 3 & e | 8;
      return n.toString(16)
    })
  }

  function h() {
    P && r("ahoy_events", JSON.stringify(j), 1)
  }

  function v() {
    return O("meta[name=csrf-token]").attr("content")
  }

  function g() {
    return O("meta[name=csrf-param]").attr("content")
  }

  function l(t) {
    var e = v();
    e && t.setRequestHeader("X-CSRF-Token", e)
  }

  function d(t, e, n) {
    P && O.ajax({
      type: "POST",
      url: t,
      data: JSON.stringify(e),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      beforeSend: l,
      success: n
    })
  }

  function k(t) {
    var e = {
      events: [t],
      visit_token: t.visit_token,
      visitor_token: t.visitor_token
    };
    return delete t.visit_token, delete t.visitor_token, e
  }

  function p(t) {
    u(function() {
      d(n(), k(t), function() {
        for (var e = 0; e < j.length; e++)
          if (j[e].id == t.id) {
            j.splice(e, 1);
            break
          }
        h()
      })
    })
  }

  function x(t) {
    u(function() {
      var e = k(t),
        i = g(),
        r = v();
      i && r && (e[i] = r);
      var o = new Blob([JSON.stringify(e)], {
        type: "application/json; charset=utf-8"
      });
      navigator.sendBeacon(n(), o)
    })
  }

  function y() {
    return b.page || t.location.pathname
  }

  function m(t) {
    var e = O(t.currentTarget);
    return {
      tag: e.get(0).tagName.toLowerCase(),
      id: e.attr("id"),
      "class": e.attr("class"),
      page: y(),
      section: e.closest("*[data-section]").data("section")
    }
  }

  function _() {
    if (I = !1, S = w.getVisitId(), T = w.getVisitorId(), V = o("ahoy_track"), S && T && !V) c("Active visit"), s();
    else if (V && a("ahoy_track"), S || (S = f(), r("ahoy_visit", S, N)), o("ahoy_visit")) {
      c("Visit started"), T || (T = f(), r("ahoy_visitor", T, C));
      var n = {
        visit_token: S,
        visitor_token: T,
        platform: b.platform,
        landing_page: t.location.href,
        screen_width: t.screen.width,
        screen_height: t.screen.height
      };
      document.referrer.length > 0 && (n.referrer = document.referrer), c(n), d(e(), n, s)
    } else c("Cookies disabled"), s()
  }
  var b = {
      urlPrefix: "",
      visitsUrl: "https://usebasin.com/ahoy/visits",
      eventsUrl: "https://usebasin.com/ahoy/events",
      cookieDomain: null,
      page: "363b98eca5af",
      platform: "Web",
      useBeacon: !1,
      startOnReady: !0
    },
    w = t.ahoy || t.Ahoy || {};
  w.configure = function(t) {
    for (var e in t) t.hasOwnProperty(e) && (b[e] = t[e])
  }, w.configure(w);
  var S, T, V, O = t.jQuery || t.Zepto || t.$,
    N = 240,
    C = 1051200,
    I = !1,
    J = [],
    P = "undefined" != typeof JSON && "undefined" != typeof JSON.stringify,
    j = [];
  w.getVisitId = w.getVisitToken = function() {
    return o("ahoy_visit")
  }, w.getVisitorId = w.getVisitorToken = function() {
    return o("ahoy_visitor")
  }, w.reset = function() {
    return a("ahoy_visit"), a("ahoy_visitor"), a("ahoy_events"), a("ahoy_track"), !0
  }, w.debug = function(t) {
    return t === !1 ? a("ahoy_debug") : r("ahoy_debug", "t", 525600), !0
  }, w.track = function(t, e) {
    var n = {
      id: f(),
      name: t,
      properties: e || {},
      time: (new Date).getTime() / 1e3
    };
    O(function() {
      c(n)
    }), u(function() {
      w.getVisitId() || _(), n.visit_token = w.getVisitId(), n.visitor_token = w.getVisitorId(), i() ? x(n) : (j.push(n), h(), setTimeout(function() {
        p(n)
      }, 1e3))
    })
  }, w.trackView = function(e) {
    var n = {
      url: t.location.href,
      title: document.title,
      page: y()
    };
    if (e)
      for (var i in e) e.hasOwnProperty(i) && (n[i] = e[i]);
    w.track("$view", n)
  }, w.trackClicks = function() {
    O(document).on("click", "a, button, input[type=submit]", function(t) {
      var e = O(t.currentTarget),
        n = m(t);
      n.text = "input" == n.tag ? e.val() : O.trim(e.text().replace(/[\s\r\n]+/g, " ")), n.href = e.attr("href"), w.track("$click", n)
    })
  }, w.trackSubmits = function() {
    O(document).on("submit", "form", function(t) {
      var e = m(t);
      w.track("$submit", e)
    })
  }, w.trackChanges = function() {
    O(document).on("change", "input, textarea, select", function(t) {
      var e = m(t);
      w.track("$change", e)
    })
  }, w.trackAll = function() {
    w.trackView(), w.trackClicks(), w.trackSubmits(), w.trackChanges()
  };
  try {
    j = JSON.parse(o("ahoy_events") || "[]")
  } catch (t) {}
  for (var B = 0; B < j.length; B++) p(j[B]);
  w.start = function() {
    _(), w.trackView(), w.trackSubmits(), w.start = function() {}
  }, O(function() {
    b.startOnReady && w.start()
  }), t.ahoy = w
}(window);
