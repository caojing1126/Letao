$(function(){


	$('form').bootstrapValidator({

		// 小图标
		feedbackIcons: {
    		valid: 'glyphicon glyphicon-ok',
    		invalid: 'glyphicon glyphicon-remove',
    		validating: 'glyphicon glyphicon-refresh'
 		 },


		// 校验字段
		fields:{
		username:{
			validators:{
				notEmpty:{
					message:'用户名不能为空'
				},
				callback:{
					message:'用户名不存在'
				}

			}
		},
		password:{
			validators:{
				notEmpty:{
					message:'密码不能为空'
				},
				stringLength:{
					min:6,
					max:12,
					message:'密码长度必须在6到12位之间'
				},
				callback:{
					message:'密码错误'
				}

			}

		}
	
		}
});



	// 给表单注册校验成功事件
	$('form').on("success.form.bv",function(e){
		// 禁止表单自动提交
		e.preventDefault();
		

		// 使用ajax提交逻辑
		$.ajax({
			type:"post",
			url:"/employee/employeeLogin",
			dataType:'json',//如果后端返回的响应头有text/html
			data:$('form').serialize(),
			success:function(data){
				if(data.success){
					location.href="index.html";
				}

				if(data.error===1000){
					$('form').data("bootstrapValidator").updateStatus("username","INVALID","callback");
				}


				if(data.error===1001){
					$('form').data("bootstrapValidator").updateStatus("password","INVALID","callback");
				}

			}
		})

	});


	//重置样式
	$("[type='reset']").on('click',function(){
		$('form').data("bootstrapValidator").resetForm();
	});
});











