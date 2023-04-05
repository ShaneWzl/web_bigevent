//每次调用$.post()  $.get()  $.ajax()之前都会调用下面这个函数
//ajaxPrefilter这个函数
//这个函数的形参options是我们配置给请求函数的 对象
$.ajaxPrefilter(function(options) {
    options.url = 'http://www.liulongbin.top:3007' + options.url

    //为有权限的接口统一设置headers
    if(options.url.indexOf('/my/') !== -1){
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    //配置权限函数，这个函数在每个ajax请求后都会执行，无论成功失败
    options.complete = function(res) {
        if(res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！'){
            //1. 强制清楚localStorage
            localStorage.removeItem('token')
            //2. 返回登陆界面
            location.href='./login.html'
        }
    }
})