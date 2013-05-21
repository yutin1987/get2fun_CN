API =
  GET_TASKS: './api/dls5.php?v=get_tasks'
  CANCEL_TASKS: './api/dls5.php?v=cancel_task'
  RELOAD_TASKS: './api/dls5.php?v=redownload_task'
  REMOVE_TASKS: './api/dls5.php?v=delete_tasks'
  CLEAR_TASKS: './api/dls5.php?v=clear_tasks'
  LOGIN: './api2/login2.php'
  INFO: './api2/info.php'

STATUS =
  RELOAD: 0
  CANCEL: 1
  WAIT: 2
  DOWNLOAD: 3
  COMPLETE: 4
  FAIL: 5

STATUS_CODE = ['reload', 'cancel', 'wait', 'download', 'complete', 'fail']

class Task extends Backbone.Model
  idAttribute: 'tid'
  defaults:
    owner: "admin"
    playlist: ''
    name: ''
    quality: ["Audio"]
    srcType: ''
    srcUrl: ''
    cover: ''
    added_time: 0
    status: 3
    size: ''
    dlSize: ''
    time: 0
    percent: 0
    err_msg: ""

class TaskList extends Backbone.Collection
  model: Task

class App extends Backbone.Model
  defaults:
    user: ''
    status: 0

#

app = 
  up_time: 0

$.task = new TaskList()
$.app = new App()

#

$ ->
  win = $(window)
  list = $('#contents .list')
  subject = $('#toolbar .subject')
  item = $('.item',list).detach()
  
  # Task
  $.task.on 'add', (m, c, opt) ->
    new_item = item.clone().data 'tid', m.id
    $(new_item).addClass STATUS_CODE[m.get('status')]
    $('.thumb span',new_item).css('background-image','url('+m.get('cover')+')')
    $('.name span.group',new_item).text(m.get('playlist'))
    $('.name span.title',new_item).text(m.get('name'))
    $('.owner span',new_item).text(m.get('owner'))
    $('.src span a',new_item).text(m.get('srcType')).attr('href',m.get('srcUrl'))
    $('.size span',new_item).text(String(m.get('size')).toSize())
    $('.percentage .bar', new_item).width(m.get('dlSize') / m.get('size') * 100 + '%')
    #$('.status span',new_item).text(STATUS_CODE[m.get('status')])
    $('.add_time span',new_item).text(new Date(m.get('added_time')*1000).toFormat('yyyy-MM-dd'))

    m.dom = new_item
    list.append(new_item)

  $.task.on 'change:dlSize', (m, v, opt) ->
    $('.percentage .bar', m.dom).width(v / m.get('size') * 100 + '%')


  $.task.on 'change:size', (m, v, opt) ->
    $('.size span', m.dom).text(String(v).toSize())

  $.task.on 'change:status', (m, v, opt) ->
    $(m.dom).removeClass(STATUS_CODE.join(' '))
            .addClass(STATUS_CODE[v])

  $.task.on 'remove', (m, v, opt) ->
    $(m.dom).remove()

  update = () ->

    $.ajax({
      type: "POST"
      url: API.GET_TASKS
      data: {time: app.up_time}
      dataType: 'json'
      cache: no
    }).always (res,s) ->
      control = $('#control')

      if s is 'success' and res.code >= 0
        $(res.value).each ->
          $.task.add @, {merge: true}
          app.up_time = @.time if @.time > app.up_time
      else
        sys_user off

      setTimeout (-> update()), 1500

  update()

  # User
  $.app.on 'change:status', (m, v, opt) ->
    if v in [1,2]
      $('#viewport').removeClass 'guest'
    else
      $('#viewport').addClass 'guest'


  event_reload = (tid, num=0) ->
    $.ajax({
      type: "POST"
      url: API.RELOAD_TASKS
      data: {tid: tid}
      dataType: 'json'
      cache: no
    }).always (res,s) ->
      event_reload(tid, ++num) if !(s is 'success' and res.code >= 0) and num<5

  event_cancel = (tid, num=0) ->
    $.ajax({
      type: "POST"
      url: API.CANCEL_TASKS
      data: {tid: tid}
      dataType: 'json'
      cache: no
    }).always (res,s) ->
      event_cancel(tid, ++num) if !(s is 'success' and res.code >= 0) and num<5

  event_remove = (tid, num=0) ->
    $.ajax({
      type: "POST"
      url: API.REMOVE_TASKS
      data: {tid: tid}
      dataType: 'json'
      cache: no
    }).always (res,s) ->
      event_remove(tid, ++num) if !(s is 'success' and res.code >= 0) and num<5

  # user
  $('.login .remember').on 'click', () ->
    $(@).toggleClass 'checked'

  $('#login-submit').on 'click', () ->

    user = $('#username').val()
    pwd = $('#password').val()

    $('.login').removeClass('invalid')
               .addClass('proceed')

    $.ajax({
      type: "POST"
      url: API.LOGIN
      data: { user: user, pwd: pwd}
      dataType: 'json'
      timeout: 4000
      cache: no
    }).always (res,s) ->
      if s is 'success' and String(res) is 'true'
        $.app.set 
          user: user
          status: if user is 'admin' then 2 else 1
      else
        $.app.set
          user: ''
          status: 0

        $('.login').addClass 'invalid'
        
      $('.login').removeClass 'proceed'

  # dialog System Check
  $('#dialog-chrome a').click () ->
    $('#viewport').removeClass 'no-chrome'
    $.cookie('donot-chrome', '1', { expiress: 365}) if $('#dialog-chrome .donot').is(':checked')

  $('#viewport').addClass('no-chrome') unless window.navigator.userAgent.indexOf("Chrome") isnt -1 or $.cookie('donot-chrome')?

  $('#dialog-ext a').click () ->
    $('#viewport').addClass 'has-ext'
    $.cookie('donot-ext', '1', { expiress: 365}) if $('#dialog-ext .donot').is(':checked')

  $('#viewport').addClass('has-ext') if window.navigator.userAgent.indexOf("Chrome") is -1 or $.cookie('donot-ext')?

  $('#dialog-qpkg a, #dialog-error a').click () ->
    $('#viewport').removeClass 'has-error no-qpkg'

  # box nav
  $('.box-nav .nav-refresh').on 'click', () ->
    $('.list tbody').empty()
    $.task.reset()
    app.up_time = 0

  $('.box-nav .nav-clear').on 'click', () ->
    $.ajax({
      type: "POST"
      url: API.CLEAR_TASKS
      data: {time: app.up_time}
      dataType: 'json'
      cache: no
    })
    $('.list tbody').empty()
    $.task.reset()
    app.up_time = 0
    # $.task.forEach (item) ->
    #   if item.get('status') in [STATUS.RELOAD, STATUS.CANCEL, STATUS.COMPLETE]
    #     $.task.remove(item)

  $('.box-nav .nav-logout').on 'click', () ->
    $('#viewport').addClass 'guest'
    $.app.set {status: 0}

    $.ajax({
      type: "POST"
      url: API.LOGIN
      data: {logout: true}
      dataType: 'json'
      cache: no
    })

  # toolber
  $('#toolbar .toolbar .cancel').on 'click', () ->
    selected = $('.item.selected', list)
    if selected.length > 0
      selected = selected.map -> $(@).data 'tid'
      event_cancel $.makeArray(selected)
      $(selected).each () -> $.task.get(@).set 'status', STATUS.CANCEL

  $('#toolbar .toolbar .reload').on 'click', () ->
    selected = $('.item.selected', list)
    if selected.length > 0
      selected = selected.map -> $(@).data 'tid'
      event_reload $.makeArray(selected)
      $(selected).each () -> $.task.get(@).set 'status', STATUS.RELOAD

  $('#toolbar .toolbar .remove').on 'click', () ->
    selected = $('.item.selected', list)
    if selected.length > 0
      selected = selected.map -> $(@).data 'tid'
      event_remove $.makeArray(selected) 
      $(selected).each () -> $.task.remove($.task.get(@))

  # list  
  $('.choose', subject).on 'click', () ->
    if $('.item.selected', list).length > 0
      $('.item', list).removeClass 'selected'
    else
      $('.item', list).addClass 'selected'

  # item
  $(list).on 'click', '.choose, .thumb, .name', () ->
    $(@).parents('.item:first').toggleClass('selected')

  $(list).on 'click', '.btn-cancel', () ->
    tid = $(@).parents('.item:first').data('tid')
    $.task.get(tid).set 'status', STATUS.CANCEL
    event_cancel [tid]

  $(list).on 'click', '.btn-reload', () ->
    tid = $(@).parents('.item:first').data('tid')
    $.task.get(tid).set 'status', STATUS.RELOAD
    event_reload [tid]

  $(list).on 'click', '.btn-remove', () ->
    tid = $(@).parents('.item:first').data('tid')
    $.task.remove $.task.get(tid)
    event_remove [tid]

  # listen
  sys_status = (listen) ->
    $.ajax({
      type: "POST"
      url: API.INFO
      dataType: 'json'
      timeout: 4000
      cache: no
    }).always (res,s) ->
      if s is 'success'
        if res.server?
          if res.server.qpkg_status isnt 'TRUE'
            $('body').addClass 'no-qpkg'
          else if res.server.process_status isnt 1 || res.server.server_status is 0
            $('body').addClass 'has-error'
          else
            $('body').removeClass 'no-qpkg has-error'

          switch res.server.server_status
            when 0
              $('#control').attr 'class', 'server-stopped'
            when 1
              $('#control').attr 'class', 'server-running'
            when 2
              $('#control').attr 'class', 'server-paused'
        else
          $('body').addClass 'has-error'
      else
        $('#control').attr 'class', 'server-stopped'

      setTimeout(sys_status, 10000)

  sys_status()

  sys_user = (listen) ->
    $.ajax({
      type: "POST"
      url: API.LOGIN
      data: {check: true}
      dataType: 'json'
      timeout: 4000
      cache: no
    }).always (res,s) ->
      if s is 'success' and res.status is "true"
        $.app.set 
          user: res.user
          status: if res.user is 'admin' then 2 else 1
      else
        $.app.set 
          user: ''
          status: 0

      setTimeout(sys_user, 10000) if listen isnt off

  sys_user()