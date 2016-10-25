var render_project_list = function (project_list) {
	var $container 	= $('.project-list'),
		html_str	= $('script#project-item-template').html()

	$container.empty()

	project_list.forEach(function (elem, index) {
		var $el 	= html_str.template(elem),
			$img 	= $el.find('.project-img'),
			$info 	= $el.find('.project-info')
		if (elem.image) {
			$img.css('background-image', 'url({0})'.format(elem.image))
		}

		if (index % 2) {
			$img.css('left', 0)
			$info.css('left', '40%')
		} else {
			$img.css('left', '60%')
			$info.css('left', 0)
		}

		$img.css('opacity', 0)
		$img.waitForImages(function () {
			$img.css('opacity', 1)
		}, $.noop, true)

		$container.append($el)
	})

}