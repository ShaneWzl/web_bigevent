$(function(){

    let layer = layui.layer

    let form = layui.form

    // 拿到图片裁剪区域的图片元素
    let $image = $('#image')
    const options = {
        // 纵横比可以写16/9或者4/3，1就是正方形
        aspectRatio: 400/280,
        // 指定预览区域
        preview: '.img-preview'
      }


    renderArtList()
    // 初始化富文本编辑器
     initEditor()


    //渲染文章分类选择下拉菜单
    function renderArtList() {
        $.ajax({
            method:'GET',
            url:'/my/article/cates',
            success:function(res) {
                if(res.status !== 0) return layer.msg('无法获取文章类别')
                layer.msg('获取文章下拉菜单成功')
                
                //模板引擎写标签模板
                let htmlStr = template('tpl-artCate' , res)
                
                //插入到select中
                $('[name=cate_id]').html(htmlStr)

                //一定要刷新，因为动态添加的下拉菜单表单结构 会无法显示
                form.render()
            }
        })
    }

    //初始化剪裁区域
    $image.cropper(options)

    // 选择封面按钮的点击事件
    $('#pickImg').on('click' , function(){
        $('[type=file]').click()
    })

    // 监测input上传图片的change事件
    $('[type=file]').on('change' , function(e){
        // e.target.files可以得到上传图片的伪数组
        let file = e.target.files[0]
        //判断用户是否真的选择了图片
        if(e.target.files.length <= 0) return layer.msg('请选择一张封面')
        //为图片设置一个URL对象
        let newImg = URL.createObjectURL(file)
        //三连 销毁旧的cropper 、给图片绑定新的路径属性、开启新的cropper
        $image
        .cropper('destroy')
        .attr('src' , newImg)
        .cropper(options)
    })

    //提交表单事件
    //点击提交和存为草稿的status是不同的
    let art_status = ''
    $('#save1').click(function(){
        art_status = '已发布'
    })

    //为存为草稿绑定点击事件
    $('#save2').on('click' , function(){
        art_status = '草稿'
    })


    //表单绑定提交事件
    $('#form-pub').on('submit' , function(e){
        e.preventDefault()
        //因为提交数据时formData格式 () 要写DOM对象
        //此时的fd对象中已经有三个表单中的参数了
        let fd = new FormData($(this)[0])

        //向fd中追加status
        fd.append('status' , art_status)
        
        //将剪裁后的封面图片变为 图片blob文件
        $image
      .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
        width: 400,
        height: 280
       })
       .toBlob(function(blob) {       // 将 Canvas 画布上的内容，转化为文件对象
         // 得到文件对象后，进行后续的操作
         fd.append('cover_img',blob)
       })

       fd.forEach(function(value,index) {
        console.log(index,value)
       })
       //发布文章
       artPub(fd)
    })


    //渲染一个发布文章的函数
    function artPub (fd) {
        $.ajax({
            method:'POST',
            url:'/my/article/add',
            data:fd,
            contentType:false,                                                                                        //固定写法
            processData:false,    
            success:function(res) {
                if(res.status !== 0) return layer.msg('发表文章失败')
                layer.msg('发表成功')
                location.href='./art_list.html'
            }
        })
    }
})