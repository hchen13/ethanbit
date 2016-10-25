from django.shortcuts import render
from django.views.decorators.http import require_GET
from django.http import JsonResponse

# Create your views here.
def index(request):
	return render(request, 'terminal/cli.html')


@require_GET
def check_login(request):
	current_user = request.user
	if current_user.is_anonymous():
		resp = {
			"is_user_logged_in": False
		}
		return JsonResponse(resp, safe=False)
	else:
		resp = {
			"is_user_logged_in": True,
			"user": {
				"name": current_user.get_full_name(),
				"username": current_user.get_username(),
				"is_master": current_user.is_superuser & current_user.is_staff,
				"is_admin": current_user.is_staff
			}
		}
		return JsonResponse(resp, safe=False)
