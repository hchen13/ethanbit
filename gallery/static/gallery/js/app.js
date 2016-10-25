var addImages = function (list) {
	var $container = $('div.gallery')
	var templateHTML = $('script#gallery_img_template').html()

	list.forEach(function(elem, index) {
		elem.thumb_url = elem.source + '?size=small'
		var $elem = templateHTML.template(elem)
		$container.append(templateHTML.template(elem))
	})

	// activate thumbnail ui for the img tags just created
	$('img.thumb').thumbnail()
};

$(document).on('ready', function() {
	var $upload_button	= $('#btn-upload')
	var $upload_input	= $('input#image-upload')
	var $form_upload = $('form') 

	$.ajax({
		url: "images",
		type: 'get',
		success: function(data) {
			addImages(data)
		}
	})

	$upload_button.on('click', function (e) {
		$upload_input.click()
	})

	$upload_input.on('change', function (e) {
		var files = this.files
		if (files.length === 0)
			return 

		var form_data = new FormData($form_upload[0])

		$.ajax({
			url: $form_upload.attr('action'),
			type: $form_upload.attr('method'),
			data: form_data,
			processData: false,
			contentType: false,
			success: function (response) {
				console.log(response)
			}
		})
	})

	$(document).on('keyup', function (e) {
		switch (e.which) {
		case 192:
			call_terminal()
			break
		}
	})
})