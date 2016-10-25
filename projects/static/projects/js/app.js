$(document).on('ready', function () {

	// request project list
	$.ajax({
		url: '/projects/projects',
		type: 'get',
		success: function (list) {
			render_project_list(list)
		}
	})
})