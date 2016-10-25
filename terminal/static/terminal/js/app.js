var toggle_terminal_visibility = function() {
	$('.terminal').toggleClass('hide')
	if (!$('.terminal').hasClass('hide')) {
		$('.terminal').terminal('focus')
	}
}

var call_terminal = function () {
	toggle_terminal_visibility()
}

$('.terminal').terminal()