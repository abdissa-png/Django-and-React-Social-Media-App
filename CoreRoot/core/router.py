from rest_framework_nested import routers
from core.comment.viewsets import CommentViewSet
from core.post.viewsets import PostViewSet
from core.auth.viewsets.refresh import RefreshViewSet
from core.auth.viewsets.login import LoginViewSet
from core.auth.viewsets.register import RegisterViewSet
from core.user.viewsets import UserViewSet
router = routers.SimpleRouter()

#user
router.register(r'user', UserViewSet, basename='user')
#register
router.register(r'auth/register', RegisterViewSet,basename='auth-register')
#login
router.register(r'auth/login', LoginViewSet,basename='auth-login')
#refresh
router.register(r'auth/refresh', RefreshViewSet,basename='auth-refresh')
#post
router.register(r'post', PostViewSet, basename='post')

posts_router = routers.NestedSimpleRouter(router,r'post', lookup='post')
posts_router.register(r'comment', CommentViewSet, basename='post-comment')

urlpatterns = [
   *router.urls,
   *posts_router.urls
]