var make_url = function (name, age) {
	return "some url with " + name + " and " + age
}

$(document).on('ready', function () {

	// 全局变量
	var name 	= null,
		age		= null

	$('.a').on('click', function () {
		// 在事件callback function中update其中一个全局变量
		name = $(this).text()

		// 触发获取到数据的事件
		$(document).trigger('retrieved')
	})

	$('.b').on('click', function () {
		// 在事件callback function中update另一个全局变量
		age = $(this).text()

		// 触发获取到数据的事件
		$(document).trigger('retrieved')
	})

	$(document).on('retrieved', function (event, arg) {

		console.log(arg)

		// 检查是否所有数据都不为空
		if (!name || !age)
			return 

		// 使用获取到的数据做后续操作
		var url = make_url(name, age)
		console.log(url)
	})
})

