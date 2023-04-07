$(function() {
    let form = layui.form
    getArtCateList()
    //定义渲染列表的函数
    function getArtCateList () {
        $.ajax({
            method:'GET',
            url:'/my/article/cates',
            success:function(res) {
                if(res.status !== 0) return layui.layer.msg('获取文章列表失败')
                
                let htmlStr = template('tpl-artCate' , res)
                $('tbody').html(htmlStr)
            }
        })
    }

    //定义添加类别按钮的点击事件
    let addIndex = null
    $('#addArtCate').click(function(){
        addIndex = layui.layer.open({
            type: 1, 
            area: ['500px', '250px'],
            title: '添加分类',
            content: $('#tpl-addArtCate').html()
        })
    })

    //为添加分类按钮绑定点击事件
    //因为这个按钮在弹出层上面
    //动态添加的标签都只能用代理的形式绑定事件
    $('body').on('submit' , '#dialog-addArtCate' , function(e) {
        e.preventDefault()
        
        $.ajax({
            method:'POST',
            url:'/my/article/addcates',
            data:$(this).serialize(),
            success:function(res) {
                if(res.status !== 0){
                    console.log(res)
                    layui.layer.msg('出错了')
                    return
                }
                getArtCateList()
                layui.layer.msg('添加成功')

                //关闭弹出层layer.close(index)  使用layer.open()会生成一个index
                layui.layer.close(addIndex)
            }
        })
    })
    

    let editIndex = null
    //事件委托绑定每一条表格数据的编辑按钮点击事件
    $('tbody').on('click' , '#btnEdit' , function() {
        editIndex = layui.layer.open({
            type: 1, 
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#tpl-editArtCate').html()
        })
        let editId = $(this).attr('data-id')
        $.ajax({
            method:'GET',
            url:`/my/article/cates/${editId}`,
            success:function(res) {
                if(res.status !== 0) return layui.layer.msg('出错了')
                console.log(res)
                form.val('edit-form' , res.data)
            }
        })
    })


    //更新每条数据的分类名称和别名
    //事件委托绑定submit事件
    $('body').on('submit' , '#dialog-editArtCate' , function(e) {
        e.preventDefault()
        $.ajax({
            method:'POST',
            url:'/my/article/updatecate',
            data:$(this).serialize(),
            success:function(res) {
                if(res.status !== 0) return layui.layer.msg('出错了')
                layui.layer.msg('更新成功')
                layui.layer.close(editIndex)
                getArtCateList()
            }
        })
    })


    //事件委托绑定删除点击事件
    $('tbody').on('click' , '#btn-delete' , function(e) {
        let id = $(this).attr('data-id')
        layui.layer.confirm('确定删除吗？', {icon: 3, title:'提示'}, function(index){
            $.ajax({
                method:'GET',
                url:`/my/article/deletecate/${id}`,
                success:function(res) {
                    if(res.status !== 0) return layui.layer.msg('出错了')
                    layui.layer.msg('删除成功')
                    getArtCateList()
    
                }
            })
            
            layer.close(index);
            
          });
        
    })
})