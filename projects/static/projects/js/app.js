$(document).on('ready', function () {

	// request project list
	// var list = [{
	// 	project_name: "Leetcode",
	// 	intro: "I haven't spent much time on this but I've been trying to solve algorithm problems on Leetcode for a while, and so far this is going well.",
	// 	image: '/assets/leetcode_background.png'
	// }, {
	// 	project_name: "Machine Learning",
	// 	intro: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
	// 	image: '/assets/machine_learning.png'
	// }]
	$.ajax({
		url: '/projects/projects',
		type: 'get',
		success: function (list) {
			console.log(list)
			render_project_list(list)
		}
	})
})