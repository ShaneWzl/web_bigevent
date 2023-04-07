$(function(){
    let layer = layui.layer
    let form = layui.form
    let laypage = layui.laypage

    //定义template中的事件过滤器
    template.defaults.imports.timeFormat = function(data) {
        let time = new Date(data)

        let y = padZero(time.getFullYear())
        let m = padZero(time.getMonth() + 1)
        let d = padZero(time.getDate())

        let hh = padZero(time.getHours())
        let mm = padZero(time.getMinutes())
        let ss = padZero(time.getSeconds())

        return `y-m-d hh:mm:ss`
    }

    //定义补0函数
    function padZero (n) {
        return n>9? n : `0${n}`
    }



    //定义一个查询文章列的查询参数
    let q = {
        pagenum:1,  //显示文章第几页的数据，默认显示第一页
        pagesize:2,    //每页显示多少条数据，默认每页显示2条数据
        cate_id:'' ,     //文章分类的id
        state:''          //文章的状态，有已发布和存草稿状态
    }
    

    initArtList()
    initArtCate()

    //定义一个渲染文章列表的函数
    function initArtList() {
        $.ajax({
            method:'GET',
            url:'/my/article/list',
            data:q,
            success:function(res) {
                if(res.status !== 0) return layer.msg('获取文章列表失败')
                layer.msg('获取文章列表成功')
                let htmlStr = template('tpl-artList' , res)
                $('tbody').html(htmlStr)

                //渲染完毕文章列表后，要渲染分页区域
                renderPage(res.total)
            }
        })
    }

    //定义一个渲染下拉菜单文章分类的函数
    function initArtCate () {
        $.ajax({
            method:'GET',
            url:'/my/article/cates',
            success:function(res) {
               if(res.status !== 0) return layer.msg('出错了')
               
               let htmlStr = template('tpl-artCate' , res)
               console.log(htmlStr)
               $('[name=cate_id]').html(htmlStr)
               //表单动态添加UI结构，要刷新，表单模块直接调用render()可以刷新
               form.render()
            }
        })
    }


    //为删选表单绑定submit提交事件 实现筛选功能
    $('#form-select').submit(function(e) {
        e.preventDefault()

        //根据属性选择器获取表单中的值
        let cate_id = $('[name=cate_id]').val()
        let status = $('[name=status]').val()
        //为查询对象q中的 两个属性赋值，分别是状态和id要修改值
        q.cate_id = cate_id
        q.status = status
        
        //根据最新的筛选条件渲染表格数据
        initArtList()
    })


    //定义一个渲染分页区域的函数
    //参数是有多少条数据一共，这样助于计算有几页
    function renderPage (total) {
         laypage.render({
            elem:'pageBox',    //分页容器的id
            count:total,        //数据一共有多少条
            curr:q.pagenum,     //当前所处第几页
            limit:q.pagesize,    //每页多少条数据

            limits:[2,3,5,10],   //为条目选项区域写选项
           
            //layout表示可以有哪些模块在分页区域中，一定要按顺序
            layout:['count' , 'limit' , 'prev' , 'page' , 'next' , 'skip'],
            //分页点击后触发 jump 回调函数
            //触发jump回调函数的方法有两种
            //一： 点击切换页码
            //二： 调用laypage.render() 会天然触发一次，调用一次 触发一次
            //jump 回调函数 参数有两个 obj表示上面的配置的对象，first表示是否是刷新页面后第一次触发这个函数,如果是第一次为true，不是第一次为undefined
            jump:function(obj,first) {
                //让当前点击第几页 赋值给q.pagenum
                q.pagenum = obj.curr

                //把最新的条目数赋值到q.pagesize
                q.pagesize = obj.limit

                if(!first) { initArtList() }
            }
         })
    }


    //通过代理的形式为删除按钮绑定点击事件
    $('tbody'),on('click' , '#btn-delete' , function(){
        //获取当前页还有几条数据
        let len = $('#btn-delete').length
        //获取到点击删除的文章Id
        let id = $(this).attr('data-id')
        //弹出询问框
        layer.confirm('确认删除吗？', {icon: 3, title:'提示'}, function(index){
            $.ajax({
                method:'GET',
                url:`/my/article/delete/${id}`,
                success:function(res) {
                   if(res.status !== 0) return layer.msg('出错了')
                   layer.msg('删除成功')
                   //会有一个bug，因为如果是最后一页的最后一条数据，此时页码q.pagenum还是没变，所以没有数据，所以如果判断是最后一页的最后一条数据，那么页码要-1再渲染数据
                   //如果只有1个删除按钮了 那么需要让页码-1
                   if(len === 1) {
                    q.pagenum = q.pagenum <= 1? q.pagenum : q.pagenum-1
                   }
                   initArtList()
                }
            })
            
            layer.close(index);
          });
        
    })
})