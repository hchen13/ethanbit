$(document).on('ready', function() {
	
	var message = "If you see this message, you should know that this website has a hidden " +
	"command line interface that you can play with, try pressing ` and have some fun"
	
	var style = "color: #fff; font-size: 14px; font-family: monospace; background-color: #000;"

	console.log("%c" + message, style)

	$(document).on('keyup', function (e) {
		switch (e.which) {
		case 192:
			call_terminal()
			break
		}
	})
})