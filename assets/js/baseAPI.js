//每次调用$.post()  $.get()  $.ajax()之前都会调用下面这个函数
//ajaxPrefilter这个函数
//这个函数的形参options是我们配置给请求函数的 对象
$.ajaxPrefilter(function(options) {
    options.url = 'http://www.liulongbin.top:3007' + options.url
})