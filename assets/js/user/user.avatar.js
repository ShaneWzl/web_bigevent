$(function(){
      // 1.1 获取裁剪区域的 DOM 元素
  var $image = $('#image')
  // 1.2 配置选项
  const options = {
    // 纵横比可以写16/9或者4/3，1就是正方形
    aspectRatio: 1,
    // 指定预览区域
    preview: '.img-preview'
  }

  // 1.3 创建裁剪区域
  $image.cropper(options)

//上传图片点击事件
$('#chooseImage').on('click' , function(){
    $('#file').click()
})

//检测input上传图片的change事件
$('#file').on('change' , function(e) {
    //图片上传框的e.target.files可以得到上传的图片伪数组，数组的每项是一个对象
    console.log(e.target.files)
    if(e.target.files <= 0) { return layui.layer.msg('请选择上传图片')}
    //如果上传了图片
    //1. 拿到用户选择的文件
    let file = e.target.files[0]
    //2. 为文件获取一个url地址
    let newImgUrl = URL.createObjectURL(file)
    //3. 先销毁旧的剪裁区域，设置新图片后，创建新的建材区域
    $image.cropper('destroy')
    .attr('src' , newImgUrl)
    .cropper(options)
})



//监听确定点击事件
$('#btnUpload').on('click' , function(){
//拿到上传区域的图片
let dataURL = $image
      .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
        width: 100,
        height: 100
      })
      .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串

      //发起上传的ajax请求
      $.ajax({
        method:'POST',
        url:'/my/update/avatar',
        data:{
            avatar:dataURL
        },
        success:function(res) {
            if(res.status !== 0) return layui.layer.msg('上传失败')
            layui.layer.msg('上传成功')
            window.parent.getUserInfo()
        }
      })
})
})