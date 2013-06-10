(function() {
    Date.format = function(e, t) {
        var a = Date.formatLogic, r = -1 !== t.indexOf("a") || -1 !== t.indexOf("A"), s = [];
        s.d = e.getDate(), s.dd = a.pad(s.d, 2), s.ddd = a.i18n.shortDayNames[e.getDay()], 
        s.dddd = a.i18n.dayNames[e.getDay()], s.M = e.getMonth() + 1, s.MM = a.pad(s.M, 2), 
        s.MMM = a.i18n.shortMonthNames[s.M - 1], s.MMMM = a.i18n.monthNames[s.M - 1], s.yyyy = e.getFullYear(), 
        s.yyy = a.pad(s.yyyy, 2) + "y", s.yy = a.pad(s.yyyy, 2), s.y = "y", s.H = e.getHours(), 
        s.hh = a.pad(r ? a.convertTo12Hour(s.H) : s.H, 2), s.h = r ? a.convertTo12Hour(s.H) : s.H, 
        s.HH = a.pad(s.H, 2), s.m = e.getMinutes(), s.mm = a.pad(s.m, 2), s.s = e.getSeconds(), 
        s.ss = a.pad(s.s, 2), s.z = e.getMilliseconds(), s.zz = s.z + "z", s.zzz = a.pad(s.z, 3), 
        s.ap = 12 > s.H ? "am" : "pm", s.a = 12 > s.H ? "am" : "pm", s.AP = 12 > s.H ? "AM" : "PM", 
        s.A = 12 > s.H ? "AM" : "PM";
        for (var n = 0, o = "", i = ""; t.length > n; ) {
            for (i = t.charAt(n); t.length > n + 1 && void 0 !== s[i + t.charAt(n + 1)]; ) i += t.charAt(++n);
            o += void 0 !== s[i] ? s[i] : i, n++;
        }
        return o;
    }, Date.formatLogic = {
        pad: function(e, t) {
            var a = 1, r = "";
            if (1 > t) return "";
            for (var s = 0; t > s; s++) a *= 10, r += "0";
            var n = e;
            return n = r + e, n = n.substring(n.length - t);
        },
        convertTo12Hour: function(e) {
            return 0 === e % 12 ? 12 : e % 12;
        },
        i18n: {
            dayNames: [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ],
            shortDayNames: [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ],
            monthNames: [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ],
            shortMonthNames: [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ]
        }
    }, Date.prototype.toFormat = function(e) {
        return Date.format(this, e);
    }, Date.parseFormat = function(e, t) {
        var a = new Date(2e3, 0, 1), r = [];
        r.d = "([0-9][0-9]?)", r.dd = "([0-9][0-9])", r.M = "([0-9][0-9]?)", r.MM = "([0-9][0-9])", 
        r.yyyy = "([0-9][0-9][0-9][0-9])", r.yyy = "([0-9][0-9])[y]", r.yy = "([0-9][0-9])", 
        r.H = "([0-9][0-9]?)", r.hh = "([0-9][0-9])", r.h = "([0-9][0-9]?)", r.HH = "([0-9][0-9])", 
        r.m = "([0-9][0-9]?)", r.mm = "([0-9][0-9])", r.s = "([0-9][0-9]?)", r.ss = "([0-9][0-9])", 
        r.z = "([0-9][0-9]?[0-9]?)", r.zz = "([0-9][0-9]?[0-9]?)[z]", r.zzz = "([0-9][0-9][0-9])", 
        r.ap = "([ap][m])", r.a = "([ap][m])", r.AP = "([AP][M])", r.A = "([AP][M])";
        for (var s = Date.parseLogic, n = 0, o = "", i = Array(""), c = ""; t.length > n; ) {
            for (c = t.charAt(n); t.length > n + 1 && void 0 !== r[c + t.charAt(n + 1)]; ) c += t.charAt(++n);
            void 0 !== r[c] ? (o += r[c], i[i.length] = c) : o += c, n++;
        }
        var u = RegExp(o), d = e.match(u);
        if (void 0 === d || d.length !== i.length) return void 0;
        for (n = 0; i.length > n; n++) if ("" !== i[n]) switch (i[n]) {
          case "yyyy":
          case "yyy":
            a.setYear(s.parseInt(d[n]));
            break;

          case "yy":
            a.setYear(2e3 + s.parseInt(d[n]));
            break;

          case "MM":
          case "M":
            a.setMonth(s.parseInt(d[n]) - 1);
            break;

          case "dd":
          case "d":
            a.setDate(s.parseInt(d[n]));
            break;

          case "hh":
          case "h":
          case "HH":
          case "H":
            a.setHours(s.parseInt(d[n]));
            break;

          case "mm":
          case "m":
            a.setMinutes(s.parseInt(d[n]));
            break;

          case "ss":
          case "s":
            a.setSeconds(s.parseInt(d[n]));
            break;

          case "zzz":
          case "zz":
          case "z":
            a.setMilliseconds(s.parseInt(d[n]));
            break;

          case "AP":
          case "A":
          case "ap":
          case "a":
            ("PM" === d[n] || "pm" === d[n]) && 12 > a.getHours() && a.setHours(a.getHours() + 12), 
            "AM" !== d[n] && "am" !== d[n] || 12 !== a.getHours() || a.setHours(0);
        }
        return a;
    }, Date.parseLogic = {
        unpad: function(e) {
            for (var t = e; t.length > 1 && "0" === t[0]; ) t = t.substring(1, t.length);
            return t;
        },
        parseInt: function(e) {
            return parseInt(this.unpad(e), 10);
        }
    }, Date.prototype.fromFormat = function(e, t) {
        return this.setTime(Date.parseFormat(e, t).getTime()), this;
    };
})(), String.prototype.toSize = function(e) {
    var t, a, r, s, n, o, i;
    for (null == e && (e = 0), n = [ "bytes", "KB", "MB", "GB", "TB" ], r = parseInt(this, 10) || 0, 
    t = o = 0, i = n.length; i > o; t = ++o) if (a = n[t], s = r / Math.pow(1024, t), 
    1024 > s) return 0 === t ? 0 === r ? "0KB" : "> 1KB" : s.toFixed(e) + n[t];
    return (r / Math.pow(1024, n.length - 1)).toFixed(e) + n[n.length - 1];
};

var API, App, STATUS, STATUS_CODE, Task, TaskList, app, _ref, _ref1, _ref2, __hasProp = {}.hasOwnProperty, __extends = function(e, t) {
    function a() {
        this.constructor = e;
    }
    for (var r in t) __hasProp.call(t, r) && (e[r] = t[r]);
    return a.prototype = t.prototype, e.prototype = new a(), e.__super__ = t.prototype, 
    e;
};

API = {
    GET_TASKS: "./api/dls5.php?v=get_tasks",
    CANCEL_TASKS: "./api/dls5.php?v=cancel_task",
    RELOAD_TASKS: "./api/dls5.php?v=redownload_task",
    REMOVE_TASKS: "./api/dls5.php?v=delete_tasks",
    CLEAR_TASKS: "./api/dls5.php?v=clear_tasks",
    LOGIN: "./api2/login2.php",
    INFO: "./api2/info.php"
}, STATUS = {
    RELOAD: 0,
    CANCEL: 1,
    WAIT: 2,
    DOWNLOAD: 3,
    COMPLETE: 4,
    FAIL: 5
}, STATUS_CODE = [ "reload", "cancel", "wait", "download", "complete", "fail" ], 
Task = function(e) {
    function t() {
        return _ref = t.__super__.constructor.apply(this, arguments);
    }
    return __extends(t, e), t.prototype.idAttribute = "tid", t.prototype.defaults = {
        owner: "admin",
        playlist: "",
        name: "",
        quality: [ "Audio" ],
        srcType: "",
        srcUrl: "",
        cover: "",
        added_time: 0,
        status: 3,
        size: "",
        dlSize: "",
        time: 0,
        percent: 0,
        err_msg: ""
    }, t;
}(Backbone.Model), TaskList = function(e) {
    function t() {
        return _ref1 = t.__super__.constructor.apply(this, arguments);
    }
    return __extends(t, e), t.prototype.model = Task, t;
}(Backbone.Collection), App = function(e) {
    function t() {
        return _ref2 = t.__super__.constructor.apply(this, arguments);
    }
    return __extends(t, e), t.prototype.defaults = {
        user: "",
        status: 0
    }, t;
}(Backbone.Model), app = {
    up_time: 0
}, $.task = new TaskList(), $.app = new App(), $(function() {
    var e, t, a, r, s, n, o, i, c, u;
    return u = $(window), s = $("#contents .list"), n = $("#toolbar .subject"), r = $(".item:eq(0)", s).detach(), 
    $.task.on("add", function(e) {
        var t;
        return t = r.clone().data("tid", e.id), $(t).addClass(STATUS_CODE[e.get("status")]), 
        $.app.get("user") === e.get("owner") ? $(t).addClass("is-myself") : $(t).removeClass("is-myself"), 
        $(".thumb span", t).css("background-image", "url(" + e.get("cover") + ")"), $(".name span.group", t).text(e.get("playlist")), 
        $(".name span.title", t).text(e.get("name")), $(".owner span", t).text(e.get("owner")), 
        $(".src span a", t).text(e.get("srcType")).attr("href", e.get("srcUrl")), $(".size span", t).text((e.get("size") + "").toSize()), 
        $(".percentage .bar", t).width(100 * (e.get("dlSize") / e.get("size")) + "%"), $(".add_time span", t).text(new Date(1e3 * e.get("added_time")).toFormat("yyyy-MM-dd")), 
        e.dom = t, s.append(t);
    }), $.task.on("change:dlSize", function(e, t) {
        return $(".percentage .bar", e.dom).width(100 * (t / e.get("size")) + "%");
    }), $.task.on("change:size", function(e, t) {
        return $(".size span", e.dom).text((t + "").toSize());
    }), $.task.on("change:status", function(e, t) {
        return $(e.dom).removeClass(STATUS_CODE.join(" ")).addClass(STATUS_CODE[t]);
    }), $.task.on("remove", function(e) {
        return $(e.dom).remove();
    }), c = function() {
        return $.ajax({
            type: "POST",
            url: API.GET_TASKS,
            data: {
                time: app.up_time
            },
            dataType: "json",
            cache: !1
        }).always(function(e, t) {
            var a;
            return a = $("#control"), "success" === t && e.code >= 0 ? $(e.value).each(function() {
                return $.task.add(this, {
                    merge: !0
                }), this.time > app.up_time ? app.up_time = this.time : void 0;
            }) : i(!1), setTimeout(function() {
                return c();
            }, 1500);
        });
    }, c(), $.app.on("change:status", function(e, t) {
        return 1 === t || 2 === t ? $("#viewport").removeClass("guest") : $("#viewport").addClass("guest");
    }), $.app.on("change:user", function(e, t) {
        return "admin" === t ? $("body").addClass("is-admin") : $("body").removeClass("is-admin"), 
        $(".item", s).each(function() {
            return $.task.get($(this).data("tid")).get("owner") === t ? $(this).addClass("is-myself") : $(this).removeClass("is-myself");
        });
    }), t = function(e, a) {
        return null == a && (a = 0), $.ajax({
            type: "POST",
            url: API.RELOAD_TASKS,
            data: {
                tid: e
            },
            dataType: "json",
            cache: !1
        }).always(function(r, s) {
            return !("success" === s && r.code >= 0) && 5 > a ? t(e, ++a) : void 0;
        });
    }, e = function(t, a) {
        return null == a && (a = 0), $.ajax({
            type: "POST",
            url: API.CANCEL_TASKS,
            data: {
                tid: t
            },
            dataType: "json",
            cache: !1
        }).always(function(r, s) {
            return !("success" === s && r.code >= 0) && 5 > a ? e(t, ++a) : void 0;
        });
    }, a = function(e, t) {
        return null == t && (t = 0), $.ajax({
            type: "POST",
            url: API.REMOVE_TASKS,
            data: {
                tid: e
            },
            dataType: "json",
            cache: !1
        }).always(function(r, s) {
            return !("success" === s && r.code >= 0) && 5 > t ? a(e, ++t) : void 0;
        });
    }, $(".login .remember").on("click", function() {
        return $(this).toggleClass("checked");
    }), $("#login-submit").on("click", function() {
        var e, t;
        return t = $("#username").val(), e = $("#password").val(), $(".login").removeClass("invalid").addClass("proceed"), 
        $.ajax({
            type: "POST",
            url: API.LOGIN,
            data: {
                user: t,
                pwd: e
            },
            dataType: "json",
            timeout: 6e3,
            cache: !1
        }).always(function(e, a) {
            return "success" === a && "true" == e + "" ? $.app.set({
                user: t,
                status: "admin" === t ? 2 : 1
            }) : ($.app.set({
                user: "",
                status: 0
            }), $(".login").addClass("invalid")), $(".login").removeClass("proceed");
        });
    }), $("#dialog-chrome a").click(function() {
        return $("#viewport").removeClass("no-chrome"), $("#dialog-chrome .donot").is(":checked") ? $.cookie("donot-chrome", "1", {
            expiress: 365
        }) : void 0;
    }), -1 === window.navigator.userAgent.indexOf("Chrome") && null == $.cookie("donot-chrome") && $("#viewport").addClass("no-chrome"), 
    $("#dialog-ext a").click(function() {
        return $("#viewport").addClass("has-ext"), $("#dialog-ext .donot").is(":checked") ? $.cookie("donot-ext", "1", {
            expiress: 365
        }) : void 0;
    }), (-1 === window.navigator.userAgent.indexOf("Chrome") || null != $.cookie("donot-ext")) && $("#viewport").addClass("has-ext"), 
    $("#dialog-qpkg a, #dialog-error a").click(function() {
        return $("#viewport").removeClass("has-error no-qpkg");
    }), $(".box-nav .nav-refresh").on("click", function() {
        return $(".list").empty(), $.task.reset(), app.up_time = 0;
    }), $(".box-nav .nav-clear").on("click", function() {
        return $.ajax({
            type: "POST",
            url: API.CLEAR_TASKS,
            data: {
                time: app.up_time
            },
            dataType: "json",
            cache: !1
        }), $(".list").empty(), $.task.reset(), app.up_time = 0;
    }), $(".box-nav .nav-logout").on("click", function() {
        return $("#viewport").addClass("guest"), $.app.set({
            status: 0
        }), $.ajax({
            type: "POST",
            url: API.LOGIN,
            data: {
                logout: !0
            },
            dataType: "json",
            cache: !1
        });
    }), $("#toolbar .toolbar .cancel").on("click", function() {
        var t;
        return t = $(".item.selected", s), t.length > 0 ? (t = t.map(function() {
            return $(this).data("tid");
        }), e($.makeArray(t)), $(t).each(function() {
            return $.task.get(this).set("status", STATUS.CANCEL);
        })) : void 0;
    }), $("#toolbar .toolbar .reload").on("click", function() {
        var e;
        return e = $(".item.selected", s), e.length > 0 ? (e = e.map(function() {
            return $(this).data("tid");
        }), t($.makeArray(e)), $(e).each(function() {
            return $.task.get(this).set("status", STATUS.RELOAD);
        })) : void 0;
    }), $("#toolbar .toolbar .remove").on("click", function() {
        var e;
        return e = $(".item.selected", s), e.length > 0 ? (e = e.map(function() {
            return $(this).data("tid");
        }), a($.makeArray(e)), $(e).each(function() {
            return $.task.remove($.task.get(this));
        })) : void 0;
    }), $(".choose", n).on("click", function() {
        return $(".item.selected", s).length > 0 ? $(".item", s).removeClass("selected") : $(".item", s).addClass("selected");
    }), $(s).on("click", ".choose, .thumb, .name", function() {
        return $(this).parents(".item:first").toggleClass("selected");
    }), $(s).on("click", ".btn-cancel", function() {
        var t;
        return t = $(this).parents(".item:first").data("tid"), $.task.get(t).set("status", STATUS.CANCEL), 
        e([ t ]);
    }), $(s).on("click", ".btn-reload", function() {
        var e;
        return e = $(this).parents(".item:first").data("tid"), $.task.get(e).set("status", STATUS.RELOAD), 
        t([ e ]);
    }), $(s).on("click", ".btn-remove", function() {
        var e;
        return r = $(this).parents(".item:first"), e = r.data("tid"), $.task.remove($.task.get(e)), 
        a([ e ]);
    }), o = function() {
        return $.ajax({
            type: "POST",
            url: API.INFO,
            dataType: "json",
            timeout: 1e4,
            cache: !1
        }).always(function(e, t) {
            if ("success" === t) if (null != e.server) switch ("TRUE" !== e.server.qpkg_status ? $("body").addClass("no-qpkg") : 1 !== e.server.process_status || 0 === e.server.server_status ? $("body").addClass("has-error") : $("body").removeClass("no-qpkg has-error"), 
            e.server.server_status) {
              case 0:
                $("#control").attr("class", "server-stopped");
                break;

              case 1:
                $("#control").attr("class", "server-running");
                break;

              case 2:
                $("#control").attr("class", "server-paused");
            } else $("body").addClass("has-error"); else $("#control").attr("class", "server-stopped");
            return setTimeout(o, 1e4);
        });
    }, o(), i = function(e) {
        return $.ajax({
            type: "POST",
            url: API.LOGIN,
            data: {
                check: !0
            },
            dataType: "json",
            timeout: 1e4,
            cache: !1
        }).always(function(t, a) {
            return "success" === a && "true" === t.status ? $.app.set({
                user: t.user,
                status: "admin" === t.user ? 2 : 1
            }) : $.app.set({
                user: "",
                status: 0
            }), e !== !1 ? setTimeout(i, 1e4) : void 0;
        });
    }, i();
});