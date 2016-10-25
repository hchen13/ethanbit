# coding=utf-8
import json
import sys

from django.contrib.auth.decorators import login_required
from django.http import HttpResponseNotAllowed, \
	HttpResponseBadRequest, HttpResponseNotFound, JsonResponse
from django.views.decorators.http import require_POST

COMMAND_MISSING, ILLEGAL_ARGS = 0, 1


@require_POST
def entry(request):
	data = request.POST

	# get the command to be executed
	cmd = data.get('command', default=None)

	# get parameters (optional)
	args = data.getlist('args[]', default=None)

	dict_files = request.FILES

	files = None
	if 'files[]' in dict_files:
		files = dict_files.getlist('files[]')

	if cmd is None:
		return HttpResponseBadRequest("request must have a command to be executed")

	mod = sys.modules['terminal.programs']
	if hasattr(mod, cmd) and callable(getattr(mod, cmd)):
		func = getattr(mod, cmd)
		try:
			if files is not None:
				args.append(files)
			response = func(request, *args)
		except Exception, e:
			error = {
				'error_type': ILLEGAL_ARGS,
				'error_message': str(e)
			}
			return HttpResponseBadRequest(json.dumps(error), content_type='application/json')
	else:
		msg = {
			"error_type": COMMAND_MISSING,
			"error_message": "command not found"
		}
		resp = HttpResponseNotFound(json.dumps(msg), content_type='application/json')
		return resp

	return JsonResponse(response, safe=False)


@login_required
def upload(request, app_name=None, files_upload=None):
	if app_name is None:
		return _response_ask_for_arg("please specify the app to which you'll upload your files", is_file=False)

	if app_name == 'gallery':
		if files_upload is None or len(files_upload) == 0:
			return _response_ask_for_arg("select a file to upload", True)
		import gallery.apis
		response = gallery.apis.upload_images(files_upload)
		return response

	return "unknown app: %s" % str(app_name)


def talk(request):
	if request.user.is_authenticated():
		return "Dude, you are a logged-in user, you know what to do."
	return "Howdy, this is the server talking.\n"


def _response_ask_for_arg(prompt_str, is_file):
	return {
		"next_step": True,
		"prompt": prompt_str,
		"is_file": is_file
	}


def _response_ask_for_password(prompt_str="passcode"):
	return {
		"next_step": True,
		"prompt": prompt_str,
		"is_file": False,
		"is_password": True
	}


def login(request, username=None, password=None):
	if username is None:
		return _response_ask_for_arg("username", is_file=False)
	if password is None:
		return _response_ask_for_password()

	from django.contrib.auth import authenticate, login
	user = authenticate(username=username, password=password)
	if user is not None:
		if user.is_active:
			login(request, user)
		else:
			return "I'm sorry, but you're currently disabled :("
	else:
		return "Sorry, didn't correctly speak the magic words :("

	login_object = {
		"message": "Greetings, %s" % user.get_short_name(),
		"action": "login",
		"name": user.get_full_name(),
		"username": user.get_username(),
		"is_master": user.is_superuser & user.is_staff,
		"is_admin": user.is_staff
	}
	if user.is_superuser and user.is_staff:
		login_object["message"] = "Welcome back, master.\nTop level permissions granted."
		return login_object

	if user.get_username() == 'grace':
		login_object["message"] = "哈喽! 你这个吃屁小哼汪!"
	return login_object

@login_required
def logout(request):
	from django.contrib import auth
	auth.logout(request)
	return {
		"message": "You have successfully logged out.",
		"action": "logout"
	}
