String.prototype.format = function() {
    var formatted = this
    for (var i = 0; i < arguments.length; i++) {
        var regexp = new RegExp('\\{'+i+'\\}', 'gi')
        formatted = formatted.replace(regexp, arguments[i])
    }
    return formatted
}

String.prototype.containsCapital = function () {
    for (var i = 0; i < this.length; i++) {
        if (this[i].toLowerCase() !== this[i])
            return true
    }
    return false
}

String.prototype.template = function (replacements) {
	var pattern = String(this)

	if (!replacements)
		replacements = {}

	if (typeof replacements == 'object') {
		for (var key in replacements) {
			var regex = new RegExp('\\{{0}\\}'.format(key), 'gi')
			pattern = pattern.replace(regex, replacements[key])
		}
		return $(pattern)
	} else {
		return $(pattern)
	}
};

var modalVerticalCenterClass = ".modal";
function centerModals($element) {
    var $modals;
    if ($element.length) {
        $modals = $element;
    } else {
        $modals = $(modalVerticalCenterClass + ':visible');
    }
    $modals.each( function(i) {
        var $clone = $(this).clone().css('display', 'block').appendTo('body');
        var top = Math.round(($clone.height() - $clone.find('.modal-content').height()) / 2);
        top = top > 0 ? top : 0;
        $clone.remove();
        $(this).find('.modal-content').css("margin-top", top);
    });
}

Array.prototype.subarray = function (start, end) {
    if (!end) {
        end = -1;
    } 
    return this.slice(start, this.length + 1 - (end * -1));
}

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
// var csrftoken = getCookie('csrftoken');