+function ($) {
	'use strict';

	// INPUTS WITH ICON CLASS DEFINITION
	// =================================

	var selector = '.eb-input-view',
		$user = $('<i>', {class: "fa fa-user"}),
		$pass = $('<i>', {class: "fa fa-lock"}),
		$mail = $('<i>', {class: "fa fa-envelope"})

	var InputView = function (element, options) {
		this.$element = $(element)
		this.options = $.extend({}, InputView.DEFAULTS, options)
	}

	InputView.DEFAULTS = {}

	InputView.prototype.init = function () {
		var $el = $('<div>', {class: 'input-group eb-input-view-container'})
		var $self = this.$element.clone()

		if ($self.hasClass('user'))
			var $icon = $user.clone()
		else if ($self.hasClass('pass'))
			var $icon = $pass.clone()
		else if ($self.hasClass('email'))
			var $icon = $mail.clone()

		$self.css('z-index', $self.css('z-index') != '' ? $self.css('z-index') : 0)
		$icon.css('z-index', $self.css('z-index') != '' ? $self.css('z-index') : 0 + 1)
		$el.append($self).append($icon)
		this.$element.replaceWith($el)
	}

	// INPUTS PLUGIN DEFINITION
	// ========================

	function Plugin (option) {
		return this.each(function () {
			var $this = $(this)
			var obj = $this.data('ethanbit.inputview')
			var options = typeof option == 'object' && option

			if (!obj) {
				$this.data('ethanbit.inputview', (obj = new InputView(this, options)))
				obj.init()
			}
			if (typeof option == 'string') obj[option]()
		})
	}

	var old = $.fn.inputview

	$.fn.inputview = Plugin
	$.fn.inputview.Constructor = InputView

	$(document).ready(function () {
		$(selector).inputview()
	})

}(jQuery);

+function ($) {
	'use strict';

	// NAV SWITCH CLASS DEFINITION
	// ===========================

	var selector = '.eb-navigator',
		tabSelector = '.eb-navigator-tab',
		lineSelector = '.eb-navigator-underline'

	var Navigator = function (element, options) {
		this.$element = $(element)
		this.options = $.extend({}, Navigator.DEFAULTS, options)
	}

	Navigator.VERSION = '0.0.1'

	Navigator.DEFAULTS = {}

	Navigator.prototype.init = function () {
		this.$tabs = this.$element.children(tabSelector)
		this.$line = this.$element.children()
		this.$pages = $(this.$element.data('target'))
		this.$element.on('click', this.onClick)
		this.activate(0)
	}

	Navigator.prototype.onClick = function (e) {
		var self = $(this).data('ethanbit.navigator')
		var index = Array.prototype.indexOf.call(self.$tabs, e.target)
		self.activate(index)
	}

	Navigator.prototype.activate = function (tabNumber) {
		if (tabNumber < 0 || tabNumber >= this.$tabs.length)
			return 
		this.$tabs.removeClass('active')
		$(this.$tabs[tabNumber]).addClass('active')

		// animate the line 
		var width = $(this.$tabs[0]).width()
		this.$line.css("left", tabNumber * width)

		// animate the controls
		this.$pages.css("left", "-{0}%".format(tabNumber * 200))
	}

	// NAV SWITCH PLUGIN DEFINITION
	// ============================

	function Plugin (option) {
		return this.each(function () {
			var $this = $(this)
			var obj = $this.data('ethanbit.navigator')
			var options = typeof option == 'object' && option

			if (!obj) $this.data('ethanbit.navigator', (obj = new Navigator(this, options)))
			obj.init()
		})
	}

	var old = $.fn.ebnavigator

	$.fn.ebnavigator = Plugin
	$.fn.ebnavigator.Constructor = Navigator

}(jQuery);