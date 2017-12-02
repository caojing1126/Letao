$(function(){


	// 需要发送ajax请求，获取用户数据
	// 所谓 渲染，就是发送ajax请求，重新获取数据

	var page = 1; //记录当前页码
	var pageSize = 5;   //记录每页的数量
	var imgs=[];

	function render(){
		$.ajax({
		type:"get",
		url:"/product/queryProductDetailList",
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

				itemTexts:function(type,page,current){
					switch(type){
						case "first":
							return "首页";
						case "prev":
							return "上一页";
						case "next":
							return "下一页";
						case "last":
							return "尾页";
						default:
							return page;
					}
				},




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



// 添加功能，显示模态框
;$(".btn_add").on("click",function(){
	$("#productModal").modal("show");

	// 需要发送ajax请求，获取到所有的一级分类，渲染到下拉菜单中
	$.ajax({
		type:"get",
		url:"/category/querySecondCategoryPaging",
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
	$("[name='brandId']").val($(this).data("id"));

	// 让categoryId校验成功
	$form.data("bootstrapValidator").updateStatus("brandId","VALID");
});


// 图片上传
$("#fileupload").fileupload({
	dataType:"json",
	done:function(e,data){

		if(imgs.length>=3){
			return false;
		}


		console.log(data.result);
		// 动态的往img_box添加一张图片
		$(".img_box").append('<img src="'+data.result.picAddr+'" width="100" height="100" alt="">');

		// 把这个返回的结果存储起来
		imgs.push(data.result);

		console.log(imgs);

		// 判断imgs的长度，如果imgs的长度等于3，说明上传了3张，把productLogo改成检验成功
		if(imgs.length===3){
			$form.data("bootstrapValidator").updateStatus("productLogo","VALID");
		}else{
			$form.data("bootstrapValidator").updateStatus("productLogo","INVALID");
		}
		
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
		brandId:{
			validators:{
				notEmpty:{
					message:'请选择品牌'
				}
				
			}
		},

		proName:{
			validators:{
				notEmpty:{
					message:'请输入商品名称'
				}
				
			}
		},

		proDesc:{
			validators:{
				notEmpty:{
					message:'请输入商品描述'
				}
				
			}
		},

		num:{
			validators:{
				notEmpty:{
					message:'请输入商品库存'
				},
				regexp:{
					regexp:/^[1-9]\d*$/,
					message:"请输入一个不是0开头的库存"
				}				
			}
		},

		size:{
			validators:{
				notEmpty:{
					message:'请输入商品尺码'
				},
				regexp:{
					regexp:/^\d{2}-\d{2}$/,
					message:"请输入正确的尺码，例如（32-46）"
				}				
			}
		},

		oldPrice:{
			validators:{
				notEmpty:{
					message:'请输入商品原价'
				}
				
			}
		},

		price:{
			validators:{
				notEmpty:{
					message:'请输入商品价格'
				}
				
			}
		},

		productLogo:{
			validators:{
				notEmpty:{
					message:'请上传3张图片'
				}
				
			}
		}
		

	}
	
		
});



	// 给表单注册校验成功事件
	$form.on("success.form.bv",function(e){
		// 禁止表单自动提交
		e.preventDefault();

		var param=$form.serialize();
		param+="$picName1"+imgs[0].picName+"$picAddr1"+imgs[0].picAddr;
		param+="$picName2"+imgs[1].picName+"$picAddr2"+imgs[1].picAddr;
		param+="$picName3"+imgs[2].picName+"$picAddr3"+imgs[2].picAddr;
		

		// 使用ajax提交逻辑
		$.ajax({
			type:"post",
			url:"/product/addProduct",
			dataType:'json',//如果后端返回的响应头有text/html
			data:param,
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


					$(".dropdown-text").text("请选择品牌");
					$(".img_box img").attr("src","images/none.png");
					$("[name='brandLogo']").val('');

					imgs=[];
				}

				

			}
		})

	});


	




}); 