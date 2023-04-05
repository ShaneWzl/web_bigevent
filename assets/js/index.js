$(function(){
    //导入弹出框
    let layer = layui.layer

    $.ajax({
        method:'GET',
        url:'/my/userinfo',

        // 凡是my的api接口，都需要密码访问，也就是token
        headers: {
           Authorization: localStorage.getItem('token') || ''
        },
        success: function(res) {
            console.log(res)
            //如果没有找到登录信息则提示需要登陆
            if(res.status !== 0) {
                // layer.open({
                //     content: '请先登录',
                //     yes: function(){
                //         localStorage.removeItem('token')
                //       location.href='./login.html'
                //     }
                //   });  
                layer.msg('未登录') 
                return
            }

            //如果找到了登录信息
            render(res.data)
        },

        //无论是否成功请求都会执行Complete
        //因为每个界面都要验证是否要弹出，所以可以加入到ajaxPrefilter里
    /*     complete: function(res) {
            if(res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！'){
                //1. 强制清楚localStorage
                localStorage.removeItem('token')
                //2. 返回登陆界面
                location.href='./login.html'
            }
        }
    }) */
    })

    
    //点击按钮退出功能
    $('#btnLogout').on('click' , function(){
        console.log('ok')
      
     layer.confirm('确认退出吗？', {icon: 3, title:'提示'}, function(index){
    //do something
    //1. 清楚本地localStorage
    localStorage.removeItem('token')
    //2. 跳转到登录页
    location.href='./login.html'
    layer.close(index);
  });
    })


    //定义一个渲染用户头像和昵称的函数
    function render (user) {
        //1. 获取用户的名字，nickname优先级高
        let name = user.nickname || user.username
        //2. 如果用户有头像图片，那么就显示头像图片
        if(user.user_pic) {
            $('.layui-nav-img').attr('src' , user.user_pic).show()
            $('.text-avatar').hide()
        } else  {
            $('.layui-nav-img').hide()
            $('.text-avatar').html(name[0].toUpperCase()).show()
        }
        //3. 渲染用户名字
        $('#welcome').html(`欢迎&nbsp&nbsp${name}`)
    }})