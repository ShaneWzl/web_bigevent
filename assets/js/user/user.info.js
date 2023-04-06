$(function(){
    let form = layui.form
    let layer = layui.layer

    // 使用form.val() 快速给表单赋值


    form.verify({
        nickname:function(value) {
            if(value > 6) {
                return '昵称长度须在1-6个字符之间'
            }
        }
    })

    
    initUserInfo()
    //初始化用户基本信息
    function initUserInfo (){
        $.ajax({
            method:'GET',
            url:'/my/userinfo',
            success:function(res) {
                
                if(res.status !== 0) return layer.msg('获取用户信息失败')
                

                //form.val() 第一个参数为form表单lay-filter的值，第二个值为数据对象
                form.val('userInfo' , res.data)
            }
        })
    }

    //重置表单
    $('#btnReset').on('click' , function(e) {
        e.preventDefault()

        initUserInfo()
    })



    //子页面触达父页面方法
   
    //更新用户信息，监听表单提交事件
    $('.layui-form').submit(function(e) {
        e.preventDefault()
        //发起POST ajax请求
        
        $.ajax({
            method:'POST',
            url:'/my/userinfo',
            data:$(this).serialize(),
            success:function(res) {
                if(res.status !== 0 ) return layer.msg('修改失败')
                layer.msg('修改用户信息成功')

                //要调用父页面中渲染欢迎窗口的方法 要用到window.parent
                window.parent.getUserInfo()
            }
        })
    })
     

 
})