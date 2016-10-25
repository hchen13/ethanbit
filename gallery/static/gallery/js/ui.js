
+function ($) {
	'use strict';

	// THUMBNAIL IMAGE PUBLIC CLASS DEFINITION
	// =============================

	var Thumbnail = function (element, options) {
		this.$element	= $(element)
		this.options	= $.extend({}, Thumbnail.DEFAULTS, options)
		this.isLoading	= true
	}

	Thumbnail.VERSION = '0.0.1'

	Thumbnail.DEFAULTS = {
		loadingText: 'loading'
	}

	Thumbnail.prototype.resize = function () {
		var $el	 = this.$element
		var data = $el.data()
		var width = $el.width()
		
		if (width % 2) width = width - 1
		$el.width(width)
		$el.height(width)
	}

	Thumbnail.prototype.init = function () {
		var $el = this.$element
		$el.attr('data-loading', this.isLoading)
	}

	Thumbnail.prototype.display = function() {
		var $el = this.$element

		$el.attr('data-loading', this.isLoading)
	}

	Thumbnail.prototype.crop = function() {
		if (!this.isLoading)
			return 
		this.isLoading = false

		var $el = this.$element
		var source = new Image()
		var canvas = document.createElement("canvas")

		source.src = $el[0].src
		
		var width = source.width
		var height = source.height
		var length = width < height ? width : height
		var left = width / 2 - length / 2
		var top = height / 2 - length / 2

		canvas.width = length
		canvas.height = length

		canvas.getContext('2d').drawImage(source, left, top, length, length, 0, 0, length, length)
		$el.attr('src', canvas.toDataURL('image/png'))
	}

	Thumbnail.prototype.showOriginal = function (e) {
		var $this = $(this)
		var srcURL = $this.attr('data-src')

		$('#gallery-modal img#gallery-img-origin').attr('src', srcURL)
		$('#gallery-modal').modal()

		$('#gallery-modal img#gallery-img-origin').on('load', function() {
			centerModals($('#gallery-modal'))
		})
	}

	// THUMBNAIL IMAGE PLUGIN DEFINITION
	// =================================

	function Plugin(option) {
		return this.each(function() {
			var $this   = $(this)
			var obj     = $this.data('gallery.thumbnail')
			var options = typeof option == 'object' && option

			if (!obj)
				$this.data('gallery.thumbnail', (obj = new Thumbnail(this, options)))

			obj.init()
			obj.resize()

			$(this).on('load', function() {
				obj.crop()
				obj.display()
			})

			$(this).on('click', obj.showOriginal)
		})
	}

	var old = $.fn.thumbnail

	$.fn.thumbnail = Plugin
	$.fn.thumbnail.Constructor = Thumbnail

	// activating static img tags
	// $(document).on('ready', function() {
	// 	$('img.thumb').thumbnail()
	// })

}(jQuery);

