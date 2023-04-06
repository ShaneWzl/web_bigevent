// 导入提示模块
let layer = layui.layer

// 导入表单模块
let form = layui.form

//验证输入的新密码
form.verify({
    pwd: [
        /^[\S]{6,12}$/
        ,'密码必须6到12位，且不能出现空格'
      ],
    newPwd:function(value) {
        if(value === $('[name=oldPwd]').val()){
            return '新密码不可与原密码一致'
        }
    },
    rePwd:function(value) {
        if(value !== $('[name=newPwd]').val()) {
            return '两次输入的密码不一致'
        }
    }
})

//表单提交事件
$('.layui-form').submit(function(e) {
    e.preventDefault()
    //发起ajax
    $.ajax({
        method:'POST',
        url:'/my/updatepwd',
        data:$(this).serialize(),
        success:function(res){
           if(res.status !== 0 ) return layer.msg('重置密码失败')
           layer.msg('重置密码成功')
           $('.layui-form')[0].reset()
        }

    })
})