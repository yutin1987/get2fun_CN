(function() {
    Date.format = function(t, e) {
        var a = Date.formatLogic, r = -1 !== e.indexOf("a") || -1 !== e.indexOf("A"), n = [];
        n.d = t.getDate(), n.dd = a.pad(n.d, 2), n.ddd = a.i18n.shortDayNames[t.getDay()], 
        n.dddd = a.i18n.dayNames[t.getDay()], n.M = t.getMonth() + 1, n.MM = a.pad(n.M, 2), 
        n.MMM = a.i18n.shortMonthNames[n.M - 1], n.MMMM = a.i18n.monthNames[n.M - 1], n.yyyy = t.getFullYear(), 
        n.yyy = a.pad(n.yyyy, 2) + "y", n.yy = a.pad(n.yyyy, 2), n.y = "y", n.H = t.getHours(), 
        n.hh = a.pad(r ? a.convertTo12Hour(n.H) : n.H, 2), n.h = r ? a.convertTo12Hour(n.H) : n.H, 
        n.HH = a.pad(n.H, 2), n.m = t.getMinutes(), n.mm = a.pad(n.m, 2), n.s = t.getSeconds(), 
        n.ss = a.pad(n.s, 2), n.z = t.getMilliseconds(), n.zz = n.z + "z", n.zzz = a.pad(n.z, 3), 
        n.ap = 12 > n.H ? "am" : "pm", n.a = 12 > n.H ? "am" : "pm", n.AP = 12 > n.H ? "AM" : "PM", 
        n.A = 12 > n.H ? "AM" : "PM";
        for (var s = 0, o = "", i = ""; e.length > s; ) {
            for (i = e.charAt(s); e.length > s + 1 && void 0 !== n[i + e.charAt(s + 1)]; ) i += e.charAt(++s);
            o += void 0 !== n[i] ? n[i] : i, s++;
        }
        return o;
    }, Date.formatLogic = {
        pad: function(t, e) {
            var a = 1, r = "";
            if (1 > e) return "";
            for (var n = 0; e > n; n++) a *= 10, r += "0";
            var s = t;
            return s = r + t, s = s.substring(s.length - e);
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
        for (var n = Date.parseLogic, s = 0, o = "", i = Array(""), u = ""; e.length > s; ) {
            for (u = e.charAt(s); e.length > s + 1 && void 0 !== r[u + e.charAt(s + 1)]; ) u += e.charAt(++s);
            void 0 !== r[u] ? (o += r[u], i[i.length] = u) : o += u, s++;
        }
        var c = RegExp(o), d = t.match(c);
        if (void 0 === d || d.length !== i.length) return void 0;
        for (s = 0; i.length > s; s++) if ("" !== i[s]) switch (i[s]) {
          case "yyyy":
          case "yyy":
            a.setYear(n.parseInt(d[s]));
            break;

          case "yy":
            a.setYear(2e3 + n.parseInt(d[s]));
            break;

          case "MM":
          case "M":
            a.setMonth(n.parseInt(d[s]) - 1);
            break;

          case "dd":
          case "d":
            a.setDate(n.parseInt(d[s]));
            break;

          case "hh":
          case "h":
          case "HH":
          case "H":
            a.setHours(n.parseInt(d[s]));
            break;

          case "mm":
          case "m":
            a.setMinutes(n.parseInt(d[s]));
            break;

          case "ss":
          case "s":
            a.setSeconds(n.parseInt(d[s]));
            break;

          case "zzz":
          case "zz":
          case "z":
            a.setMilliseconds(n.parseInt(d[s]));
            break;

          case "AP":
          case "A":
          case "ap":
          case "a":
            ("PM" === d[s] || "pm" === d[s]) && 12 > a.getHours() && a.setHours(a.getHours() + 12), 
            "AM" !== d[s] && "am" !== d[s] || 12 !== a.getHours() || a.setHours(0);
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
    var e, a, r, n, s, o, i;
    for (null == t && (t = 0), s = [ "bytes", "KB", "MB", "GB", "TB" ], r = parseInt(this, 10) || 0, 
    e = o = 0, i = s.length; i > o; e = ++o) if (a = s[e], n = r / Math.pow(1024, e), 
    1024 > n) return 0 === e ? 0 === r ? "0KB" : "> 1KB" : n.toFixed(t) + s[e];
    return (r / Math.pow(1024, s.length - 1)).toFixed(t) + s[s.length - 1];
};

var API, STATUS, STATUS_CODE, Task, TaskList, User, app, _ref, _ref1, _ref2, __hasProp = {}.hasOwnProperty, __extends = function(t, e) {
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
    LOGIN: "./api2/login2.php"
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
}(Backbone.Collection), User = function(t) {
    function e() {
        return _ref2 = e.__super__.constructor.apply(this, arguments);
    }
    return __extends(e, t), e.prototype.defaults = {
        user: "",
        status: 0
    }, e;
}(Backbone.Model), app = {
    up_time: 0
}, $.task = new TaskList(), $.user = new User(), $(function() {
    var t, e, a, r, n, s, o, i;
    return i = $(window), n = $("#contents .list tbody"), s = $("#toolbar .subject"), 
    r = $(".item", n).detach(), $.task.on("add", function(t) {
        var e;
        return e = r.clone().data("tid", t.id), $(e).addClass(STATUS_CODE[t.get("status")]), 
        $(".thumb span", e).css("background-image", "url(" + t.get("cover") + ")"), $(".name span.group", e).text(t.get("playlist")), 
        $(".name span.title", e).text(t.get("name")), $(".owner span", e).text(t.get("owner")), 
        $(".src span a", e).text(t.get("srcType")).attr("href", t.get("srcUrl")), $(".size span", e).text((t.get("size") + "").toSize()), 
        $(".percentage .bar", e).width(100 * (t.get("dlSize") / t.get("size")) + "%"), $(".add_time span", e).text(new Date(1e3 * t.get("added_time")).toFormat("yyyy-MM-dd")), 
        t.dom = e, n.append(e);
    }), $.task.on("change:dlSize", function(t, e) {
        return $(".percentage .bar", t.dom).width(100 * (e / t.get("size")) + "%");
    }), $.task.on("change:size", function(t, e) {
        return $(".size span", t.dom).text((e + "").toSize());
    }), $.task.on("change:status", function(t, e) {
        return $(t.dom).removeClass(STATUS_CODE.join(" ")).addClass(STATUS_CODE[e]);
    }), $.task.on("remove", function(t) {
        return $(t.dom).remove();
    }), o = function() {
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
            return a = $("#control"), "success" === e && t.code >= 0 ? ($(t.value).each(function() {
                return $.task.add(this, {
                    merge: !0
                }), this.time > app.up_time ? app.up_time = this.time : void 0;
            }), a.attr("class", "server-running")) : a.attr("class", "server-stopped"), setTimeout(function() {
                return o();
            }, 1500);
        });
    }, o(), $.user.on("change:status", function(t, e) {
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
        }).always(function(r, n) {
            return !("success" === n && r.code >= 0) && 5 > a ? e(t, ++a) : void 0;
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
        }).always(function(r, n) {
            return !("success" === n && r.code >= 0) && 5 > a ? t(e, ++a) : void 0;
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
        }).always(function(r, n) {
            return !("success" === n && r.code >= 0) && 5 > e ? a(t, ++e) : void 0;
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
            return "success" === a && "true" == t + "" ? $.user.set({
                user: e,
                status: "admin" === e ? 2 : 1
            }) : ($.user.set({
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
        return $("#viewport").addClass("guest"), $.user.set({
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
        return e = $("tr.selected", n), e.length > 0 ? (e = e.map(function() {
            return $(this).data("tid");
        }), t($.makeArray(e)), $(e).each(function() {
            return $.task.get(this).set("status", STATUS.CANCEL);
        })) : void 0;
    }), $("#toolbar .toolbar .reload").on("click", function() {
        var t;
        return t = $("tr.selected", n), t.length > 0 ? (t = t.map(function() {
            return $(this).data("tid");
        }), e($.makeArray(t)), $(t).each(function() {
            return $.task.get(this).set("status", STATUS.RELOAD);
        })) : void 0;
    }), $("#toolbar .toolbar .remove").on("click", function() {
        var t;
        return t = $("tr.selected", n), t.length > 0 ? (t = t.map(function() {
            return $(this).data("tid");
        }), a($.makeArray(t)), $(t).each(function() {
            return $.task.remove($.task.get(this));
        })) : void 0;
    }), $(".choose", s).on("click", function() {
        return $("tr.selected", n).length > 0 ? $("tr", n).removeClass("selected") : $("tr", n).addClass("selected");
    }), $(n).on("click", ".choose, .thumb, .name", function() {
        return $(this).parents("tr:first").toggleClass("selected");
    }), $(n).on("click", ".btn-cancel", function() {
        var e;
        return e = $(this).parents("tr:first").data("tid"), $.task.get(e).set("status", STATUS.CANCEL), 
        t([ e ]);
    }), $(n).on("click", ".btn-reload", function() {
        var t;
        return t = $(this).parents("tr:first").data("tid"), $.task.get(t).set("status", STATUS.RELOAD), 
        e([ t ]);
    }), $(n).on("click", ".btn-remove", function() {
        var t;
        return t = $(this).parents("tr:first").data("tid"), $.task.remove($.task.get(t)), 
        a([ t ]);
    });
});