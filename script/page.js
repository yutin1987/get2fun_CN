(function() {
    Date.format = function(t, e) {
        var a = Date.formatLogic, r = -1 !== e.indexOf("a") || -1 !== e.indexOf("A"), s = [];
        s.d = t.getDate(), s.dd = a.pad(s.d, 2), s.ddd = a.i18n.shortDayNames[t.getDay()], 
        s.dddd = a.i18n.dayNames[t.getDay()], s.M = t.getMonth() + 1, s.MM = a.pad(s.M, 2), 
        s.MMM = a.i18n.shortMonthNames[s.M - 1], s.MMMM = a.i18n.monthNames[s.M - 1], s.yyyy = t.getFullYear(), 
        s.yyy = a.pad(s.yyyy, 2) + "y", s.yy = a.pad(s.yyyy, 2), s.y = "y", s.H = t.getHours(), 
        s.hh = a.pad(r ? a.convertTo12Hour(s.H) : s.H, 2), s.h = r ? a.convertTo12Hour(s.H) : s.H, 
        s.HH = a.pad(s.H, 2), s.m = t.getMinutes(), s.mm = a.pad(s.m, 2), s.s = t.getSeconds(), 
        s.ss = a.pad(s.s, 2), s.z = t.getMilliseconds(), s.zz = s.z + "z", s.zzz = a.pad(s.z, 3), 
        s.ap = 12 > s.H ? "am" : "pm", s.a = 12 > s.H ? "am" : "pm", s.AP = 12 > s.H ? "AM" : "PM", 
        s.A = 12 > s.H ? "AM" : "PM";
        for (var n = 0, o = "", u = ""; e.length > n; ) {
            for (u = e.charAt(n); e.length > n + 1 && void 0 !== s[u + e.charAt(n + 1)]; ) u += e.charAt(++n);
            o += void 0 !== s[u] ? s[u] : u, n++;
        }
        return o;
    }, Date.formatLogic = {
        pad: function(t, e) {
            var a = 1, r = "";
            if (1 > e) return "";
            for (var s = 0; e > s; s++) a *= 10, r += "0";
            var n = t;
            return n = r + t, n = n.substring(n.length - e);
        },
        convertTo12Hour: function(t) {
            return 0 === t % 12 ? 12 : t % 12;
        },
        i18n: {
            dayNames: [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ],
            shortDayNames: [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ],
            monthNames: [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ],
            shortMonthNames: [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ]
        }
    }, Date.prototype.toFormat = function(t) {
        return Date.format(this, t);
    }, Date.parseFormat = function(t, e) {
        var a = new Date(2e3, 0, 1), r = [];
        r.d = "([0-9][0-9]?)", r.dd = "([0-9][0-9])", r.M = "([0-9][0-9]?)", r.MM = "([0-9][0-9])", 
        r.yyyy = "([0-9][0-9][0-9][0-9])", r.yyy = "([0-9][0-9])[y]", r.yy = "([0-9][0-9])", 
        r.H = "([0-9][0-9]?)", r.hh = "([0-9][0-9])", r.h = "([0-9][0-9]?)", r.HH = "([0-9][0-9])", 
        r.m = "([0-9][0-9]?)", r.mm = "([0-9][0-9])", r.s = "([0-9][0-9]?)", r.ss = "([0-9][0-9])", 
        r.z = "([0-9][0-9]?[0-9]?)", r.zz = "([0-9][0-9]?[0-9]?)[z]", r.zzz = "([0-9][0-9][0-9])", 
        r.ap = "([ap][m])", r.a = "([ap][m])", r.AP = "([AP][M])", r.A = "([AP][M])";
        for (var s = Date.parseLogic, n = 0, o = "", u = Array(""), c = ""; e.length > n; ) {
            for (c = e.charAt(n); e.length > n + 1 && void 0 !== r[c + e.charAt(n + 1)]; ) c += e.charAt(++n);
            void 0 !== r[c] ? (o += r[c], u[u.length] = c) : o += c, n++;
        }
        var i = RegExp(o), p = t.match(i);
        if (void 0 === p || p.length !== u.length) return void 0;
        for (n = 0; u.length > n; n++) if ("" !== u[n]) switch (u[n]) {
          case "yyyy":
          case "yyy":
            a.setYear(s.parseInt(p[n]));
            break;

          case "yy":
            a.setYear(2e3 + s.parseInt(p[n]));
            break;

          case "MM":
          case "M":
            a.setMonth(s.parseInt(p[n]) - 1);
            break;

          case "dd":
          case "d":
            a.setDate(s.parseInt(p[n]));
            break;

          case "hh":
          case "h":
          case "HH":
          case "H":
            a.setHours(s.parseInt(p[n]));
            break;

          case "mm":
          case "m":
            a.setMinutes(s.parseInt(p[n]));
            break;

          case "ss":
          case "s":
            a.setSeconds(s.parseInt(p[n]));
            break;

          case "zzz":
          case "zz":
          case "z":
            a.setMilliseconds(s.parseInt(p[n]));
            break;

          case "AP":
          case "A":
          case "ap":
          case "a":
            ("PM" === p[n] || "pm" === p[n]) && 12 > a.getHours() && a.setHours(a.getHours() + 12), 
            "AM" !== p[n] && "am" !== p[n] || 12 !== a.getHours() || a.setHours(0);
        }
        return a;
    }, Date.parseLogic = {
        unpad: function(t) {
            for (var e = t; e.length > 1 && "0" === e[0]; ) e = e.substring(1, e.length);
            return e;
        },
        parseInt: function(t) {
            return parseInt(this.unpad(t), 10);
        }
    }, Date.prototype.fromFormat = function(t, e) {
        return this.setTime(Date.parseFormat(t, e).getTime()), this;
    };
})(), String.prototype.toSize = function(t) {
    var e, a, r, s, n, o, u;
    for (null == t && (t = 0), n = [ "bytes", "KB", "MB", "GB", "TB" ], r = parseInt(this, 10) || 0, 
    e = o = 0, u = n.length; u > o; e = ++o) if (a = n[e], s = r / Math.pow(1024, e), 
    1024 > s) return 0 === e ? 0 === r ? "0KB" : "> 1KB" : s.toFixed(t) + n[e];
    return (r / Math.pow(1024, n.length - 1)).toFixed(t) + n[n.length - 1];
};

var API, App, STATUS, STATUS_CODE, Task, TaskList, app, _ref, _ref1, _ref2, __hasProp = {}.hasOwnProperty, __extends = function(t, e) {
    function a() {
        this.constructor = t;
    }
    for (var r in e) __hasProp.call(e, r) && (t[r] = e[r]);
    return a.prototype = e.prototype, t.prototype = new a(), t.__super__ = e.prototype, 
    t;
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
Task = function(t) {
    function e() {
        return _ref = e.__super__.constructor.apply(this, arguments);
    }
    return __extends(e, t), e.prototype.idAttribute = "tid", e.prototype.defaults = {
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
    }, e;
}(Backbone.Model), TaskList = function(t) {
    function e() {
        return _ref1 = e.__super__.constructor.apply(this, arguments);
    }
    return __extends(e, t), e.prototype.model = Task, e;
}(Backbone.Collection), App = function(t) {
    function e() {
        return _ref2 = e.__super__.constructor.apply(this, arguments);
    }
    return __extends(e, t), e.prototype.defaults = {
        user: "",
        status: 0
    }, e;
}(Backbone.Model), app = {
    up_time: 0
}, $.task = new TaskList(), $.app = new App(), $(function() {
    var t, e, a, r, s, n, o, u, c, i;
    return i = $(window), s = $("#contents .list tbody"), n = $("#toolbar .subject"), 
    r = $(".item", s).detach(), $.task.on("add", function(t) {
        var e;
        return e = r.clone().data("tid", t.id), $(e).addClass(STATUS_CODE[t.get("status")]), 
        $(".thumb span", e).css("background-image", "url(" + t.get("cover") + ")"), $(".name span.group", e).text(t.get("playlist")), 
        $(".name span.title", e).text(t.get("name")), $(".owner span", e).text(t.get("owner")), 
        $(".src span a", e).text(t.get("srcType")).attr("href", t.get("srcUrl")), $(".size span", e).text((t.get("size") + "").toSize()), 
        $(".percentage .bar", e).width(100 * (t.get("dlSize") / t.get("size")) + "%"), $(".add_time span", e).text(new Date(1e3 * t.get("added_time")).toFormat("yyyy-MM-dd")), 
        t.dom = e, s.append(e);
    }), $.task.on("change:dlSize", function(t, e) {
        return $(".percentage .bar", t.dom).width(100 * (e / t.get("size")) + "%");
    }), $.task.on("change:size", function(t, e) {
        return $(".size span", t.dom).text((e + "").toSize());
    }), $.task.on("change:status", function(t, e) {
        return $(t.dom).removeClass(STATUS_CODE.join(" ")).addClass(STATUS_CODE[e]);
    }), $.task.on("remove", function(t) {
        return $(t.dom).remove();
    }), c = function() {
        return $.ajax({
            type: "POST",
            url: API.GET_TASKS,
            data: {
                time: app.up_time
            },
            dataType: "json",
            cache: !1
        }).always(function(t, e) {
            var a;
            return a = $("#control"), "success" === e && t.code >= 0 ? $(t.value).each(function() {
                return $.task.add(this, {
                    merge: !0
                }), this.time > app.up_time ? app.up_time = this.time : void 0;
            }) : u(!1), setTimeout(function() {
                return c();
            }, 1500);
        });
    }, c(), $.app.on("change:status", function(t, e) {
        return 1 === e || 2 === e ? $("#viewport").removeClass("guest") : $("#viewport").addClass("guest");
    }), e = function(t, a) {
        return null == a && (a = 0), $.ajax({
            type: "POST",
            url: API.RELOAD_TASKS,
            data: {
                tid: t
            },
            dataType: "json",
            cache: !1
        }).always(function(r, s) {
            return !("success" === s && r.code >= 0) && 5 > a ? e(t, ++a) : void 0;
        });
    }, t = function(e, a) {
        return null == a && (a = 0), $.ajax({
            type: "POST",
            url: API.CANCEL_TASKS,
            data: {
                tid: e
            },
            dataType: "json",
            cache: !1
        }).always(function(r, s) {
            return !("success" === s && r.code >= 0) && 5 > a ? t(e, ++a) : void 0;
        });
    }, a = function(t, e) {
        return null == e && (e = 0), $.ajax({
            type: "POST",
            url: API.REMOVE_TASKS,
            data: {
                tid: t
            },
            dataType: "json",
            cache: !1
        }).always(function(r, s) {
            return !("success" === s && r.code >= 0) && 5 > e ? a(t, ++e) : void 0;
        });
    }, $(".login .remember").on("click", function() {
        return $(this).toggleClass("checked");
    }), $("#login-submit").on("click", function() {
        var t, e;
        return e = $("#username").val(), t = $("#password").val(), $(".login").removeClass("invalid").addClass("proceed"), 
        $.ajax({
            type: "POST",
            url: API.LOGIN,
            data: {
                user: e,
                pwd: t
            },
            dataType: "json",
            timeout: 4e3,
            cache: !1
        }).always(function(t, a) {
            return "success" === a && "true" == t + "" ? $.app.set({
                user: e,
                status: "admin" === e ? 2 : 1
            }) : ($.app.set({
                user: "",
                status: 0
            }), $(".login").addClass("invalid")), $(".login").removeClass("proceed");
        });
    }), $(".box-nav .nav-refresh").on("click", function() {
        return $(".list tbody").empty(), $.task.reset(), app.up_time = 0;
    }), $(".box-nav .nav-clear").on("click", function() {
        return $.ajax({
            type: "POST",
            url: API.CLEAR_TASKS,
            data: {
                time: app.up_time
            },
            dataType: "json",
            cache: !1
        }), $(".list tbody").empty(), $.task.reset(), app.up_time = 0;
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
        var e;
        return e = $("tr.selected", s), e.length > 0 ? (e = e.map(function() {
            return $(this).data("tid");
        }), t($.makeArray(e)), $(e).each(function() {
            return $.task.get(this).set("status", STATUS.CANCEL);
        })) : void 0;
    }), $("#toolbar .toolbar .reload").on("click", function() {
        var t;
        return t = $("tr.selected", s), t.length > 0 ? (t = t.map(function() {
            return $(this).data("tid");
        }), e($.makeArray(t)), $(t).each(function() {
            return $.task.get(this).set("status", STATUS.RELOAD);
        })) : void 0;
    }), $("#toolbar .toolbar .remove").on("click", function() {
        var t;
        return t = $("tr.selected", s), t.length > 0 ? (t = t.map(function() {
            return $(this).data("tid");
        }), a($.makeArray(t)), $(t).each(function() {
            return $.task.remove($.task.get(this));
        })) : void 0;
    }), $(".choose", n).on("click", function() {
        return $("tr.selected", s).length > 0 ? $("tr", s).removeClass("selected") : $("tr", s).addClass("selected");
    }), $(s).on("click", ".choose, .thumb, .name", function() {
        return $(this).parents("tr:first").toggleClass("selected");
    }), $(s).on("click", ".btn-cancel", function() {
        var e;
        return e = $(this).parents("tr:first").data("tid"), $.task.get(e).set("status", STATUS.CANCEL), 
        t([ e ]);
    }), $(s).on("click", ".btn-reload", function() {
        var t;
        return t = $(this).parents("tr:first").data("tid"), $.task.get(t).set("status", STATUS.RELOAD), 
        e([ t ]);
    }), $(s).on("click", ".btn-remove", function() {
        var t;
        return t = $(this).parents("tr:first").data("tid"), $.task.remove($.task.get(t)), 
        a([ t ]);
    }), o = function() {
        return $.ajax({
            type: "POST",
            url: API.INFO,
            dataType: "json",
            timeout: 4e3,
            cache: !1
        }).always(function(t, e) {
            if ("success" === e) if (null != t.server) switch ("TRUE" !== t.server.qpkg_status ? $("body").addClass("no-qpkg") : 1 !== t.server.process_status || 0 === t.server.server_status ? $("body").addClass("has-error") : $("body").removeClass("no-qpkg has-error"), 
            t.server.server_status) {
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
    }, o(), u = function(t) {
        return $.ajax({
            type: "POST",
            url: API.LOGIN,
            data: {
                check: !0
            },
            dataType: "json",
            timeout: 4e3,
            cache: !1
        }).always(function(e, a) {
            return "success" === a && "true" === e.status ? $.app.set({
                user: e.user,
                status: "admin" === e.user ? 2 : 1
            }) : $.app.set({
                user: "",
                status: 0
            }), t !== !1 ? setTimeout(u, 1e4) : void 0;
        });
    }, u();
});