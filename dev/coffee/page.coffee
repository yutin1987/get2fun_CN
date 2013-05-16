API =
  GET_TASKS: './api/dls5.php?v=get_tasks'
  CANCEL_TASKS: './api/dls5.php?v=cancel_task'
  RELOAD_TASKS: './api/dls5.php?v=redownload_task'
  REMOVE_TASKS: './api/dls5.php?v=delete_tasks'
  CLEAR_TASKS: './api/dls5.php?v=clear_tasks'

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

#

app = 
  up_time: 0

$.task = new TaskList()

#

$ ->
  win = $(window)
  list = $('#contents .list tbody')
  subject = $('#toolbar .subject')
  item = $('.item',list).detach()
  
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
        control.attr 'class', 'server-running'
      else
        control.attr 'class', 'server-stopped'

      setTimeout (-> update()), 1500

  update()

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

  # box nav
  $('.box-nav .nav-refresh').on 'click', () ->
    $('.list tbody').empty()
    $.task.reset()
    app.up_time = 0

  $('.box-nav .nav-clear').on 'click', () ->
    $.task.forEach (item) ->
      if item.get('status') in [STATUS.RELOAD, STATUS.CANCEL, STATUS.COMPLETE]
        $.task.remove(item)

  $('.box-nav .nav-logout').on 'click', () ->
    $('#viewport').addClass 'guest'

  # toolber
  $('#toolbar .toolbar .cancel').on 'click', () ->
    selected = $('tr.selected', list)
    if selected.length > 0
      selected = selected.map -> $(@).data 'tid'
      event_cancel $.makeArray(selected)
      $(selected).each () -> $.task.get(@).set 'status', STATUS.CANCEL

  $('#toolbar .toolbar .reload').on 'click', () ->
    selected = $('tr.selected', list)
    if selected.length > 0
      selected = selected.map -> $(@).data 'tid'
      event_reload $.makeArray(selected)
      $(selected).each () -> $.task.get(@).set 'status', STATUS.RELOAD

  $('#toolbar .toolbar .remove').on 'click', () ->
    selected = $('tr.selected', list)
    if selected.length > 0
      selected = selected.map -> $(@).data 'tid'
      event_remove $.makeArray(selected) 
      $(selected).each () -> $.task.remove($.task.get(@))

  # list  
  $('.choose', subject).on 'click', () ->
    if $('tr.selected', list).length > 0
      $('tr', list).removeClass 'selected'
    else
      $('tr', list).addClass 'selected'

  # item
  $(list).on 'click', '.choose, .thumb, .name', () ->
    $(@).parents('tr:first').toggleClass('selected')

  $(list).on 'click', '.btn-cancel', () ->
    tid = $(@).parents('tr:first').data('tid')
    $.task.get(tid).set 'status', STATUS.CANCEL
    event_cancel [tid]

  $(list).on 'click', '.btn-reload', () ->
    tid = $(@).parents('tr:first').data('tid')
    $.task.get(tid).set 'status', STATUS.RELOAD
    event_reload [tid]

  $(list).on 'click', '.btn-remove', () ->
    tid = $(@).parents('tr:first').data('tid')
    $.task.remove $.task.get(tid)
    event_remove [tid]