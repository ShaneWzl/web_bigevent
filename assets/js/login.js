//入口函数
$(function(){
    //绑定去注册界面的 点击事件
    $('#link_reg').on('click' , function(){
        $('.login-box').hide()
        $('.reg-box').show()
    })

    //绑定去登陆界面的 点击事件
    $('#link_login').on('click' , function(){
        $('.login-box').show()
        $('.reg-box').hide()
    })

    //设定表单校验 导入了layui.all.js才有这个layui对象
    let form = layui.form
    //导入layer提示模块
    let layer = layui.layer

    form.verify({
        //设置密码校验 检验规则可以是数组，前面放正则，后面放不符合的提醒
       pwd:[/^[\S]{6,12}$/,'密码必须6到12位，且不能出现空格'],

       //设置密码再次输入校验规则，用函数的校验方式，value为被校验input输入的值
       repwd:function(value) {
        let pass = $('.reg-box [name=password]').val()
        if(value !== pass ){
            return '两次输入密码不一致'
        }
       }
    })


    //监听注册表单的提交事件
    $('#regForm').on('submit' , function(e){
        //1. 阻止表单的默认提交行为
        e.preventDefault()
        //2. 存储用户输入的注册数据
        let data = {
            username:$('.reg-box [name=username]').val(),
            password:$('.reg-box [name=password]').val()
        }
        //3. 发起ajax请求
        $.ajax({
            method:'POST',
            url:'/api/reguser',
            data:data,
            success:function(res){
               if(res.status !== 0) return layer.msg(res.message, {icon: 8}); 
               layer.msg('注册成功请登录', {icon: 1}); 
               //模拟自动跳转到登陆界面
               $('#link_login').click()
            }
        })

    })

    //监听登陆事件
    $('#loginForm').submit(function(e){
        //1. 阻止表单默认提交行为
        e.preventDefault()
        //2. 发起ajax请求
        $.ajax({
            method:'POST',
            url:'/api/login',
            data:$(this).serialize(),
            success:function(res){
                if(res.status !== 0) return layer.msg(res.message , {icon:8})
                
                layer.msg('登陆成功', {icon: 1})
                //将得到的token存储到localStorage
                localStorage.setItem('token' , res.token)
                //自动跳转
                location.href='./index.html'
                // console.log(res.token)
            }
        })

    })

})


