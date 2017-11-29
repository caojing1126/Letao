// 关闭进度环
NProgress.configure({showSpinner:false});

// 注册全局的ajaxstart事件，所有的ajax在开启的时候，会触发这个事件
$(document).ajaxStart(function(){
	// 开启进度条
	NProgress.start();
});

$(document).ajaxStop(function(){
	setTimeout(function(){
		NProgress.done();
	},500);
});


// 二级菜单显示与隐藏效果
$('.child').prev().on("click",function(){
	$(this).next().slideToggle();
});


// 侧边栏显示与隐藏效果
$('.icon_menu').on("click",function(){
	$(".lt_aside").toggleClass("now");
	$(".lt_main").toggleClass("now");

});


// 退出功能
$('.icon_logout').on("click",function(){
	$("#logoutModal").modal("show");
	$(".btn_logout").off().on("click",function(){
		$.ajax({
			type:"get",
			url:"/employee/employeeLogout",
			success:function(data){
				if(data.success){
					location.href="login.html";
				}
			}

		});
	});



});