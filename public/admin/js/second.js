$(function(){


	// 需要发送ajax请求，获取用户数据
	// 所谓 渲染，就是发送ajax请求，重新获取数据

	var page = 1; //记录当前页码
	var pageSize = 5;   //记录每页的数量


	function render(){
		$.ajax({
		type:"get",
		url:"/category/querySecondCategoryPaging",
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
;$(".btn_add").on("click",function(){
	$("#secondModal").modal("show");

	// 需要发送ajax请求，获取到所有的一级分类，渲染到下拉菜单中
	$.ajax({
		type:"get",
		url:"/category/queryTopCategoryPaging",
		data:{
			page:1,
			pageSize:100
		},
		success:function(data){
			console.log(data);
			$(".dropdown-menu").html(template("tpl2",data));
		}
	})
});



// 需要给下拉框中所有的a标签注册点击事件
$(".dropdown-menu").on("click","a",function(){
	// 获取到当前a标签的文本，设置给按钮的文本
	$(".dropdown-text").text($(this).text());

	// 获取到id值，设置给categoryId
	$("[name='categoryId']").val($(this).data("id"));

	// 让categoryId校验成功
	$form.data("bootstrapValidator").updateStatus("categoryId","VALID");
});


// 图片上传
$("#fileupload").fileupload({
	dataType:"json",
	done:function(e,data){
		$(".img_box img").attr("src",data.result.picAddr);

		$("[name='brandLogo']").val(data.result.picAddr);

		$form.data("bootstrapValidator").updateStatus("brandLogo","VALID");
	}
});





// 表单校验

var $form=$('form');

$form.bootstrapValidator({
		excluded:[],

		// 小图标
		feedbackIcons: {
    		valid: 'glyphicon glyphicon-ok',
    		invalid: 'glyphicon glyphicon-remove',
    		validating: 'glyphicon glyphicon-refresh'
 		 },


		// 校验字段
		fields:{
		categoryId:{
			validators:{
				notEmpty:{
					message:'请选择一级分类'
				}
				
			}
		},

		brandName:{
			validators:{
				notEmpty:{
					message:'请输入二级分类名称'
				}
				
			}
		},

		brandLogo:{
			validators:{
				notEmpty:{
					message:'请上传图片'
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
			url:"/category/addSecondCategory",
			dataType:'json',//如果后端返回的响应头有text/html
			data:$form.serialize(),
			success:function(data){
				if(data.success){
					
					// 关闭模态框
					$("#secondModal").modal("hide");

					// 重新渲染第一页，因为新增的分类在第一页
					page=1;
					render();

					// 需要清空表单的值和样式
					$form.data("bootstrapValidator").resetForm();
					// 重置表单的value值
					$form[0].reset();


					$(".dropdown-text").text("请选择一级分类");
					$(".img_box img").attr("src","images/none.png");
					$("[type='hidden']").val('');
				}

				

			}
		})

	});


	




}); 