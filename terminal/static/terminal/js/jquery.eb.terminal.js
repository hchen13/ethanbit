+function ($) {
	'use strict';

	// TERMINAL CLASS DEFINITION
	// =========================

	var selector	 = '.terminal',
		GUEST 		 = 0,
		USER 		 = 1,
		CMD_MISSING  = 0,
		ILLEGAL_ARGS = 1

	var Terminal = function (element, options) {
		this.$element = $(element)
		this.options  = $.extend({}, Terminal.DEFAULTS, options)
		this.user     = GUEST
		this.inApp    = false
	}

	Terminal.VERSION = '0.0.1'

	Terminal.DEFAULTS = {
		guestName: 'guest',
		welcome: 'Welcome, visitor!\nYou\'ve activated the terminal. ',
	}

	Terminal.prototype.init = function () {
		// initialize the terminal CLI
		// creating hidden supporting DOMs 
		// 
		var obj = this
		this.$textbox = $('<input>', {type: 'text', class: 'holder'})
		this.$textbox.appendTo(this.$element)

		this.$fileInput = $('<input>', {type: 'file', class: 'holder'})
		this.$fileInput.appendTo(this.$element)

		this.$element.on('click', function() {
			obj.focus()
		})

		this.$textbox.on('keyup keydown', function (e) {
			if (e.type === 'keyup' && e.which === 13) {
				obj.runCommand()
				return 
			}
			if (e.which === 192) {
				_clearIllegalChar(obj.$textbox)
				return
			}
			obj.syncCommand()
		})

		this.$textbox.on('focus', function() {
			var $caret = obj.$element.find('.caret')
			obj.$element.find('.caret').addClass('active')
		})

		this.$textbox.on('focusout', function() {
			var $caret = obj.$element.find('.caret')
			obj.$element.find('.caret').removeClass('active')
		})

		this.$fileInput.on('change', function () {
			var files = []
			for (var i = 0; i < this.files.length; i++) {
				files.push(this.files[i])
			}
			if (! files.length) {
				return 
			}
			$(this).val('')
			if (obj.inApp) {
				if (! obj.nextCall || ! obj.nextCall.files)
					obj.nextCall.files = files
				else
					obj.nextCall.files = obj.nextCall.files.concat(files)
				obj.runCommand()
			}
		})

		$(document).keypress('c', function (e) {
			if (e.ctrlKey) {
				obj.cancelCommand()
				// obj.runCommand()
			}
		})

		this.programs = []
		for (var i in Terminal.prototype) {
			if (typeof Terminal.prototype[i] === 'function' && Terminal.prototype[i].exe)
				this.programs.push(i)
		}

		$.ajax({
			url: '/terminal/check_login',
			type: 'get',
			async: false,
			success: function (response) {
				if (response.is_user_logged_in)
					obj.login(response.user)
			}
		})
		this.updatePrompt()
		this.syncCommand()
		this.displayContent(this.options.welcome)
	}

	Terminal.prototype.cancelCommand = function () {
		this.inApp = false
		this.nextCall = null
		this.password = false
		this.updatePrompt()
		this.displayContent("command cancelled.")
		this.clearCommand()
	}

	Terminal.prototype.updatePrompt = function (text) {
		if (this.inApp) {
			this.$element.find('.prompt').text("> {0}: ".format(text))		
			return 
		}
		var promptText = "~ {0}{1} "
		if (this.user === GUEST) {
			this.$element.find('.prompt').text(promptText.format(this.options.guestName, '$'))
		} else {
			this.$element.find('.prompt').text(promptText.format(this.username, '#'))
		}
	}

	Terminal.prototype.focus = function () {
		this.$textbox.focus()
	}

	Terminal.prototype.syncCommand = function () {
		var str       = this.$textbox.val()
		var selStart  = this.$textbox.get(0).selectionStart
		var selEnd    = this.$textbox.get(0).selectionEnd

		var previousCaret = this.$element.find('.caret').hasClass('active')
		var strCaret = "<span class='caret {0}'></span>".format(previousCaret ? 'active' : 'active')
		if (this.password) {
			var length = str.length
			str = ''
			for (var i = 0; i < selStart; i++) str += '&bull;'
			str += strCaret
			for (var i = selEnd; i < length; i++) str += '&bull;'
		} else {
			str = str.substring(0, selStart) + strCaret + str.substring(selEnd)
		}
		this.$element.find('.command').html(str)
	}

	Terminal.prototype.runCommand = function () {
		var command = this.$textbox.val().trim()
		var prompt = this.$element.find('.prompt').text()
		var cmdtext = this.$element.find('.command').text()
		this.clearCommand()
		this.displayContent(prompt + cmdtext)
		this.focus()
		if (this.inApp) {
			if (command.length > 0)
				this.nextCall.args.push(command)
			this.remote_exec(
				this.nextCall.cmd, 
				this.nextCall.args,
				this.nextCall.files)
		} else {
			this.exec(command)
		}
	}

	Terminal.prototype.scroll = function (direction) {
		var el = this.$element.get(0)
		if (direction == 'bottom') {
			el.scrollTop = el.scrollHeight
		} else {
			el.scrollTop = 0	
		}
	}

	Terminal.prototype.displayContent = function (content) {
		content = content.replace(/\n/g, '<br>')

		var $content = $('<p>', {class: 'line'}).html(content)
		$content.insertBefore(this.$element.find('.prompt-line'))
		this.scroll('bottom')
	}

	Terminal.prototype.clearCommand = function () {
		this.$element.find('.command').empty()
		this.$textbox.val("")
		this.syncCommand()
	}

	Terminal.prototype.errorCommandNotFound = function (cmd) {
		this.displayContent("-{0}: command not found".format(cmd))
	}

	Terminal.prototype.errorIllegalArguments = function (cmd, reason) {
		this.displayContent("-{0}: illegal arguments given, {1}".format(cmd, reason))
	}

	Terminal.prototype.login = function (response) {
		this.user = USER
		this.username = response.username
		this.isAdmin = response.is_admin
		this.isMaster = response.is_master
		this.name = response.name
	}

	Terminal.prototype.logout = function () {
		this.user = GUEST
	}

	Terminal.prototype.respond = function (response) {
		switch(response.action) {
		case "login":
			this.login(response)
			break
		case "logout":
			this.logout()
			break
		}
	}

	Terminal.prototype.remote_exec = function (cmd, args, files) {
		var self = this,
			token = getCookie('csrftoken')

		var onSuccess = function (response) {
			self.inApp = false
			self.password = false
			if (! response) {
				self.updatePrompt()
			} else if (typeof response === 'string') {
				self.updatePrompt()
				self.displayContent(response)
			}
			else if (typeof response === 'object' && response.next_step) {
				self.inApp = true
				self.updatePrompt(response.prompt)
				self.nextCall = {
					cmd: cmd,
					args: args,
					files: files
				}
				if (response.is_file) {
					self.file([true])
				}
				if (response.is_password) {
					self.password = true
				}
			} else if (typeof response === 'object') {
				self.nextCall = null
				self.respond(response)
				self.updatePrompt()
				self.displayContent(response.message)
			} else {
			}
		}

		var form = new FormData()
		if (files === undefined) {
			files = []
		}
		form.append('command', cmd)
		for (var i = 0; i < args.length; i++) {
			form.append('args[]', args[i])
		}
		for (var i = 0; i < files.length; i++) {
			form.append('files[]', files[i])
		}


		$.ajax({
			url: '/terminal/run_app/',
			type: 'post',
			async: files.length > 0 ? true : false,
			processData: false,
			contentType: false,
			data: form,
			beforeSend: function (xhr, settings) {
				if (! csrfSafeMethod(settings.type) && ! this.crossDomain) {
					xhr.setRequestHeader("X-CSRFTOKEN", token)
				}
			},
			success: onSuccess,
			error: function (e) {
				self.inApp = false
				if (e.responseJSON) {
					if (e.responseJSON.error_type === CMD_MISSING)
						self.errorCommandNotFound(cmd)
					if (e.responseJSON.error_type === ILLEGAL_ARGS)
						self.errorIllegalArguments(cmd, e.responseJSON.error_message)
				}
				self.updatePrompt()
			}
		})
	}

	Terminal.prototype.exec = function (command) {
		var words = command.split(' '),
			cmd   = words[0],
			args  = words.subarray(1),
			self  = this

		if (this.programs.indexOf(cmd) !== -1) {
			this[cmd](args)
		} else {
			this.remote_exec(cmd, args)
		}
	}

	Terminal.prototype.welcome = function () {
		this.clear()
		this.displayContent(this.options.welcome)
	}
	Terminal.prototype.welcome.exe = true

	Terminal.prototype.clear = function () {
		this.$element.find('p.line').remove()
		this.clearCommand()
	}
	Terminal.prototype.clear.exe = true

	Terminal.prototype.rename = function (args) {
		if (!args.length || args.length > 1) {
			this.errorIllegalArguments('rename', 'argument number should be exactly 1.')
			return 
		}
		this.options.guestName = args[0]
		this.updatePrompt()
	}
	Terminal.prototype.rename.exe = true

	Terminal.prototype.file = function (args) {
		var multi = args[0]
		multi = typeof multi === 'undefined' ? false : JSON.parse(multi)
		if (multi)
			this.$fileInput.attr('multiple', 'multiple')
		else
			this.$fileInput.removeAttr('multiple')

		this.$fileInput.trigger('click')
	}
	Terminal.prototype.file.exe = true

	Terminal.prototype.whoami = function () {
		var self = this
		this.displayContent("You name is {0}, a {1} to this site.".format(
			self.user == GUEST ? self.options.guestName : self.name,
			self.user == GUEST ? 'guest' : 'user'
		))
	}
	Terminal.prototype.whoami.exe = true

	Terminal.prototype.time = function () {
		var now = new Date()
		this.displayContent(now.toString())
	}
	Terminal.prototype.time.exe = true

	// TERMINAL PLUGIN DEFINITION
	// ==========================

	function _clearIllegalChar($box) {
		var text = $box.val()
		if (text.endsWith('`'))
			text = text.substring(0, text.length - 1)
		$box.val(text)
	}

	function Plugin(option) {
		return this.each(function() {
			var $this   = $(this)
			var obj     = $this.data('terminal.terminal')
			var options = typeof option == 'object' && option

			if (!obj) {
				$this.data('terminal.terminal', (obj = new Terminal(this, options)))
				obj.init()
			}
			if (typeof option == 'string') obj[option]()
		})
	}

	var old = $.fn.terminal

	$.fn.terminal = Plugin
	$.fn.terminal.Constructor = Terminal

}(jQuery);
