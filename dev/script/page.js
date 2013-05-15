var API, STATUS, STATUS_CODE, Task, TaskList, app, _ref, _ref1,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

API = {
  GET_TASKS: './api/dls5.php?v=get_tasks',
  CANCEL_TASKS: './api/dls5.php?v=cancel_task',
  RELOAD_TASKS: './api/dls5.php?v=redownload_task',
  REMOVE_TASKS: './api/dls5.php?v=delete_tasks',
  CLEAR_TASKS: './api/dls5.php?v=clear_tasks'
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

app = {
  up_time: 0
};

$.task = new TaskList();

$(function() {
  var event_cancel, event_reload, event_remove, item, list, subject, update, win;

  win = $(window);
  list = $('#contents .list tbody');
  subject = $('#toolbar .subject');
  item = $('.item', list).detach();
  $.task.on('add', function(m, c, opt) {
    var new_item;

    new_item = item.clone().data('tid', m.id);
    $(new_item).addClass(STATUS_CODE[m.get('status')]);
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
        control.attr('class', 'server-running');
      } else {
        control.attr('class', 'server-stopped');
      }
      return setTimeout((function() {
        return update();
      }), 1500);
    });
  };
  update();
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
  $('.box-nav .nav-refresh').on('click', function() {
    $('.list tbody').empty();
    $.task.reset();
    return app.up_time = 0;
  });
  $('.box-nav .nav-clear').on('click', function() {
    return $.task.forEach(function(item) {
      var _ref2;

      if ((_ref2 = item.get('status')) === STATUS.RELOAD || _ref2 === STATUS.CANCEL || _ref2 === STATUS.COMPLETE) {
        return $.task.remove(item);
      }
    });
  });
  $('#toolbar .toolbar .cancel').on('click', function() {
    var selected;

    selected = $('tr.selected', list);
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

    selected = $('tr.selected', list);
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

    selected = $('tr.selected', list);
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
    if ($('tr.selected', list).length > 0) {
      return $('tr', list).removeClass('selected');
    } else {
      return $('tr', list).addClass('selected');
    }
  });
  $(list).on('click', '.choose, .thumb, .name', function() {
    return $(this).parents('tr:first').toggleClass('selected');
  });
  $(list).on('click', '.btn-cancel', function() {
    var tid;

    tid = $(this).parents('tr:first').data('tid');
    $.task.get(tid).set('status', STATUS.CANCEL);
    return event_cancel([tid]);
  });
  $(list).on('click', '.btn-reload', function() {
    var tid;

    tid = $(this).parents('tr:first').data('tid');
    $.task.get(tid).set('status', STATUS.RELOAD);
    return event_reload([tid]);
  });
  return $(list).on('click', '.btn-remove', function() {
    var tid;

    tid = $(this).parents('tr:first').data('tid');
    $.task.remove($.task.get(tid));
    return event_remove([tid]);
  });
});
