$(function(){


	// 需要发送ajax请求，获取用户数据
	// 所谓 渲染，就是发送ajax请求，重新获取数据

	var currentPage = 1; //记录当前页码
	var pageSize = 5;   //记录每页的数量


	function render(){
		$.ajax({
		type:"get",
		url:"/user/queryUser",
		data:{
			page:currentPage,
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
				currentPage: currentPage,
				totalPages:Math.ceil(data.total/data.size),
				numberOfPages:5,
				onPageClicked:function(a,b,c,page){
					// 修改当前页码
					currentPage=page;
					// 重新渲染
					render();
				}

			});

		}
	});
}

render();



// 启用禁用功能（委托事件）
$("tbody").on("click",".btn",function(){
	// 显示模态框
	$("#userModal").modal("show");

	// 获取到id
	var id=$(this).parent().data("id");
	// 获取到isDelete
	var isDelete=$(this).hasClass("btn-danger")?0:1;



	$(".btn_confirm").off().on("click",function(){
		// 发送ajax请求，禁用用户
		$.ajax({
			type:"post",
			url:"/user/updateUser",
			data:{
				id:id,
				isDelete:isDelete
			},
			success:function(data){
				if(data.success){
					// 关闭模态框
					$("#userModal").modal("hide");
					// 重新渲染页面 
					render();
				}
			}
		})
	})


})




}); 