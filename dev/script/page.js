var API, App, STATUS, STATUS_CODE, Task, TaskList, app, _ref, _ref1, _ref2,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

API = {
  GET_TASKS: './api/dls5.php?v=get_tasks',
  CANCEL_TASKS: './api/dls5.php?v=cancel_task',
  RELOAD_TASKS: './api/dls5.php?v=redownload_task',
  REMOVE_TASKS: './api/dls5.php?v=delete_tasks',
  CLEAR_TASKS: './api/dls5.php?v=clear_tasks',
  LOGIN: './api2/login2.php',
  INFO: './api2/info.php'
};

STATUS = {
  RELOAD: 0,
  CANCEL: 1,
  WAIT: 2,
  DOWNLOAD: 3,
  COMPLETE: 4,
  FAIL: 5
};

STATUS_CODE = ['reload', 'cancel', 'wait', 'download', 'complete', 'fail'];

Task = (function(_super) {
  __extends(Task, _super);

  function Task() {
    _ref = Task.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Task.prototype.idAttribute = 'tid';

  Task.prototype.defaults = {
    owner: "admin",
    playlist: '',
    name: '',
    quality: ["Audio"],
    srcType: '',
    srcUrl: '',
    cover: '',
    added_time: 0,
    status: 3,
    size: '',
    dlSize: '',
    time: 0,
    percent: 0,
    err_msg: ""
  };

  return Task;

})(Backbone.Model);

TaskList = (function(_super) {
  __extends(TaskList, _super);

  function TaskList() {
    _ref1 = TaskList.__super__.constructor.apply(this, arguments);
    return _ref1;
  }

  TaskList.prototype.model = Task;

  return TaskList;

})(Backbone.Collection);

App = (function(_super) {
  __extends(App, _super);

  function App() {
    _ref2 = App.__super__.constructor.apply(this, arguments);
    return _ref2;
  }

  App.prototype.defaults = {
    user: '',
    status: 0
  };

  return App;

})(Backbone.Model);

app = {
  up_time: 0
};

$.task = new TaskList();

$.app = new App();

$(function() {
  var event_cancel, event_reload, event_remove, item, list, subject, sys_status, sys_user, update, win;

  win = $(window);
  list = $('#contents .list');
  subject = $('#toolbar .subject');
  item = $('.item', list).detach();
  $.task.on('add', function(m, c, opt) {
    var new_item;

    new_item = item.clone().data('tid', m.id);
    $(new_item).addClass(STATUS_CODE[m.get('status')]);
    if ($.app.get('user') === m.get('owner')) {
      $(new_item).addClass('is-myself');
    }
    $('.thumb span', new_item).css('background-image', 'url(' + m.get('cover') + ')');
    $('.name span.group', new_item).text(m.get('playlist'));
    $('.name span.title', new_item).text(m.get('name'));
    $('.owner span', new_item).text(m.get('owner'));
    $('.src span a', new_item).text(m.get('srcType')).attr('href', m.get('srcUrl'));
    $('.size span', new_item).text(String(m.get('size')).toSize());
    $('.percentage .bar', new_item).width(m.get('dlSize') / m.get('size') * 100 + '%');
    $('.add_time span', new_item).text(new Date(m.get('added_time') * 1000).toFormat('yyyy-MM-dd'));
    m.dom = new_item;
    return list.append(new_item);
  });
  $.task.on('change:dlSize', function(m, v, opt) {
    return $('.percentage .bar', m.dom).width(v / m.get('size') * 100 + '%');
  });
  $.task.on('change:size', function(m, v, opt) {
    return $('.size span', m.dom).text(String(v).toSize());
  });
  $.task.on('change:status', function(m, v, opt) {
    return $(m.dom).removeClass(STATUS_CODE.join(' ')).addClass(STATUS_CODE[v]);
  });
  $.task.on('remove', function(m, v, opt) {
    return $(m.dom).remove();
  });
  update = function() {
    return $.ajax({
      type: "POST",
      url: API.GET_TASKS,
      data: {
        time: app.up_time
      },
      dataType: 'json',
      cache: false
    }).always(function(res, s) {
      var control;

      control = $('#control');
      if (s === 'success' && res.code >= 0) {
        $(res.value).each(function() {
          $.task.add(this, {
            merge: true
          });
          if (this.time > app.up_time) {
            return app.up_time = this.time;
          }
        });
      } else {
        sys_user(false);
      }
      return setTimeout((function() {
        return update();
      }), 1500);
    });
  };
  update();
  $.app.on('change:status', function(m, v, opt) {
    if (v === 1 || v === 2) {
      return $('#viewport').removeClass('guest');
    } else {
      return $('#viewport').addClass('guest');
    }
  });
  $.app.on('change:user', function(m, v, opt) {
    if (v === 'admin') {
      $('body').addClass('is-admin');
    } else {
      $('body').removeClass('is-admin');
    }
    return $('.item', list).each(function() {
      if ($.task.get($(this).data('tid')).get('owner') === v) {
        return $(this).addClass('is-myself');
      } else {
        return $(this).removeClass('is-myself');
      }
    });
  });
  event_reload = function(tid, num) {
    if (num == null) {
      num = 0;
    }
    return $.ajax({
      type: "POST",
      url: API.RELOAD_TASKS,
      data: {
        tid: tid
      },
      dataType: 'json',
      cache: false
    }).always(function(res, s) {
      if (!(s === 'success' && res.code >= 0) && num < 5) {
        return event_reload(tid, ++num);
      }
    });
  };
  event_cancel = function(tid, num) {
    if (num == null) {
      num = 0;
    }
    return $.ajax({
      type: "POST",
      url: API.CANCEL_TASKS,
      data: {
        tid: tid
      },
      dataType: 'json',
      cache: false
    }).always(function(res, s) {
      if (!(s === 'success' && res.code >= 0) && num < 5) {
        return event_cancel(tid, ++num);
      }
    });
  };
  event_remove = function(tid, num) {
    if (num == null) {
      num = 0;
    }
    return $.ajax({
      type: "POST",
      url: API.REMOVE_TASKS,
      data: {
        tid: tid
      },
      dataType: 'json',
      cache: false
    }).always(function(res, s) {
      if (!(s === 'success' && res.code >= 0) && num < 5) {
        return event_remove(tid, ++num);
      }
    });
  };
  $('.login .remember').on('click', function() {
    return $(this).toggleClass('checked');
  });
  $('#login-submit').on('click', function() {
    var pwd, user;

    user = $('#username').val();
    pwd = $('#password').val();
    $('.login').removeClass('invalid').addClass('proceed');
    return $.ajax({
      type: "POST",
      url: API.LOGIN,
      data: {
        user: user,
        pwd: pwd
      },
      dataType: 'json',
      timeout: 4000,
      cache: false
    }).always(function(res, s) {
      if (s === 'success' && String(res) === 'true') {
        $.app.set({
          user: user,
          status: user === 'admin' ? 2 : 1
        });
      } else {
        $.app.set({
          user: '',
          status: 0
        });
        $('.login').addClass('invalid');
      }
      return $('.login').removeClass('proceed');
    });
  });
  $('#dialog-chrome a').click(function() {
    $('#viewport').removeClass('no-chrome');
    if ($('#dialog-chrome .donot').is(':checked')) {
      return $.cookie('donot-chrome', '1', {
        expiress: 365
      });
    }
  });
  if (!(window.navigator.userAgent.indexOf("Chrome") !== -1 || ($.cookie('donot-chrome') != null))) {
    $('#viewport').addClass('no-chrome');
  }
  $('#dialog-ext a').click(function() {
    $('#viewport').addClass('has-ext');
    if ($('#dialog-ext .donot').is(':checked')) {
      return $.cookie('donot-ext', '1', {
        expiress: 365
      });
    }
  });
  if (window.navigator.userAgent.indexOf("Chrome") === -1 || ($.cookie('donot-ext') != null)) {
    $('#viewport').addClass('has-ext');
  }
  $('#dialog-qpkg a, #dialog-error a').click(function() {
    return $('#viewport').removeClass('has-error no-qpkg');
  });
  $('.box-nav .nav-refresh').on('click', function() {
    $('.list').empty();
    $.task.reset();
    return app.up_time = 0;
  });
  $('.box-nav .nav-clear').on('click', function() {
    $.ajax({
      type: "POST",
      url: API.CLEAR_TASKS,
      data: {
        time: app.up_time
      },
      dataType: 'json',
      cache: false
    });
    $('.list').empty();
    $.task.reset();
    return app.up_time = 0;
  });
  $('.box-nav .nav-logout').on('click', function() {
    $('#viewport').addClass('guest');
    $.app.set({
      status: 0
    });
    return $.ajax({
      type: "POST",
      url: API.LOGIN,
      data: {
        logout: true
      },
      dataType: 'json',
      cache: false
    });
  });
  $('#toolbar .toolbar .cancel').on('click', function() {
    var selected;

    selected = $('.item.selected', list);
    if (selected.length > 0) {
      selected = selected.map(function() {
        return $(this).data('tid');
      });
      event_cancel($.makeArray(selected));
      return $(selected).each(function() {
        return $.task.get(this).set('status', STATUS.CANCEL);
      });
    }
  });
  $('#toolbar .toolbar .reload').on('click', function() {
    var selected;

    selected = $('.item.selected', list);
    if (selected.length > 0) {
      selected = selected.map(function() {
        return $(this).data('tid');
      });
      event_reload($.makeArray(selected));
      return $(selected).each(function() {
        return $.task.get(this).set('status', STATUS.RELOAD);
      });
    }
  });
  $('#toolbar .toolbar .remove').on('click', function() {
    var selected;

    selected = $('.item.selected', list);
    if (selected.length > 0) {
      selected = selected.map(function() {
        return $(this).data('tid');
      });
      event_remove($.makeArray(selected));
      return $(selected).each(function() {
        return $.task.remove($.task.get(this));
      });
    }
  });
  $('.choose', subject).on('click', function() {
    if ($('.item.selected', list).length > 0) {
      return $('.item', list).removeClass('selected');
    } else {
      return $('.item', list).addClass('selected');
    }
  });
  $(list).on('click', '.choose, .thumb, .name', function() {
    return $(this).parents('.item:first').toggleClass('selected');
  });
  $(list).on('click', '.btn-cancel', function() {
    var tid;

    tid = $(this).parents('.item:first').data('tid');
    $.task.get(tid).set('status', STATUS.CANCEL);
    return event_cancel([tid]);
  });
  $(list).on('click', '.btn-reload', function() {
    var tid;

    tid = $(this).parents('.item:first').data('tid');
    $.task.get(tid).set('status', STATUS.RELOAD);
    return event_reload([tid]);
  });
  $(list).on('click', '.btn-remove', function() {
    var tid;

    item = $(this).parents('.item:first');
    tid = item.data('tid');
    $.task.remove($.task.get(tid));
    return event_remove([tid]);
  });
  sys_status = function(listen) {
    return $.ajax({
      type: "POST",
      url: API.INFO,
      dataType: 'json',
      timeout: 4000,
      cache: false
    }).always(function(res, s) {
      if (s === 'success') {
        if (res.server != null) {
          if (res.server.qpkg_status !== 'TRUE') {
            $('body').addClass('no-qpkg');
          } else if (res.server.process_status !== 1 || res.server.server_status === 0) {
            $('body').addClass('has-error');
          } else {
            $('body').removeClass('no-qpkg has-error');
          }
          switch (res.server.server_status) {
            case 0:
              $('#control').attr('class', 'server-stopped');
              break;
            case 1:
              $('#control').attr('class', 'server-running');
              break;
            case 2:
              $('#control').attr('class', 'server-paused');
          }
        } else {
          $('body').addClass('has-error');
        }
      } else {
        $('#control').attr('class', 'server-stopped');
      }
      return setTimeout(sys_status, 10000);
    });
  };
  sys_status();
  sys_user = function(listen) {
    return $.ajax({
      type: "POST",
      url: API.LOGIN,
      data: {
        check: true
      },
      dataType: 'json',
      timeout: 4000,
      cache: false
    }).always(function(res, s) {
      if (s === 'success' && res.status === "true") {
        $.app.set({
          user: res.user,
          status: res.user === 'admin' ? 2 : 1
        });
      } else {
        $.app.set({
          user: '',
          status: 0
        });
      }
      if (listen !== false) {
        return setTimeout(sys_user, 10000);
      }
    });
  };
  return sys_user();
});
