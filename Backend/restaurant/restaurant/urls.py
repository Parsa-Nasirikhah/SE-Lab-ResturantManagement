from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from users.views import RegisterCustomerView, MeView, StaffListView, StaffCreateView, StaffUpdateView, StaffDisableView
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/register/customer/", RegisterCustomerView.as_view(), name="register-customer"),
    path("api/auth/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/", include("restaurant.urls")),
    path("api/auth/me/", MeView.as_view()),
    path("api/admin/staff/", StaffListView.as_view()),
    path("api/admin/staff/create/", StaffCreateView.as_view()),
    path("api/admin/staff/<int:user_id>/", StaffUpdateView.as_view()),
    path("api/admin/staff/<int:user_id>/disable/", StaffDisableView.as_view()),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
