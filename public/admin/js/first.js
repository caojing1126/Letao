$(function(){


	// 需要发送ajax请求，获取用户数据
	// 所谓 渲染，就是发送ajax请求，重新获取数据

	var page = 1; //记录当前页码
	var pageSize = 5;   //记录每页的数量


	function render(){
		$.ajax({
		type:"get",
		url:"/category/queryTopCategoryPaging",
		data:{
			page:page,
			pageSize:pageSize
		},
		success:function(data){
			//3、准备数据
			console.log(data);


			//4、模板与数据进行绑定
			var html = template("tpl",data);
			$("tbody").html(html);


			// 渲染分页
			$("#paginator").bootstrapPaginator({
				bootstrapMajorVersion: 3 ,//搭配使用的bootstrap版本，3的话就得用ul
				currentPage: page,
				totalPages:Math.ceil(data.total/data.size),
				numberOfPages:5,
				onPageClicked:function(a,b,c,p){
					// 修改当前页码
					page=p;
					// 重新渲染
					render();
				}

			});

		}
	});
}

render();



// 添加分类功能，显示模态框
$(".btn_add").on("click",function(){
	$("#firstModal").modal("show");
});





// 表单校验

var $form=$('form');

$form.bootstrapValidator({

		// 小图标
		feedbackIcons: {
    		valid: 'glyphicon glyphicon-ok',
    		invalid: 'glyphicon glyphicon-remove',
    		validating: 'glyphicon glyphicon-refresh'
 		 },


		// 校验字段
		fields:{
		categoryName:{
			validators:{
				notEmpty:{
					message:'一级分类名称不能为空'
				}
				
			}
		}
		

	}
	
		
});



	// 给表单注册校验成功事件
	$form.on("success.form.bv",function(e){
		// 禁止表单自动提交
		e.preventDefault();
		

		// 使用ajax提交逻辑
		$.ajax({
			type:"post",
			url:"/category/addTopCategory",
			dataType:'json',//如果后端返回的响应头有text/html
			data:$form.serialize(),
			success:function(data){
				if(data.success){
					
					// 关闭模态框
					$("#firstModal").modal("hide");

					// 重新渲染第一页，因为新增的分类在第一页
					page=1;
					render();

					// 需要清空表单的值和样式
					$form.data("bootstrapValidator").resetForm();
					// 重置表单的value值
					$form[0].reset();
				}

				

			}
		})

	});


	




}); 