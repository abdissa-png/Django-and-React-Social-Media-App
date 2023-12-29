from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action
from core.abstract.viewsets import AbstractViewSet
from core.post.serializers import PostSerializer
from core.post.models import Post
from core.auth.permissions import UserPermission
from django_filters.rest_framework import DjangoFilterBackend

class PostViewSet(AbstractViewSet):
    http_method_names = ('post', 'get','put','delete')
    permission_classes = (UserPermission,)
    serializer_class = PostSerializer
    # we declare filterset_fields to fields we want to filter in a get request
    # however to make the filter work we have to specify filterr_backends as django backend
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["author__public_id"]
    def get_queryset(self):
        return Post.objects.all()
    def get_object(self):
        obj = Post.objects.get_object_by_public_id(
            self.kwargs['pk'])
        self.check_object_permissions(self.request, obj)
        return obj
    @action(methods=['post'], detail=True)
    def like(self, request, *args, **kwargs):
       post = self.get_object()
       user = self.request.user
       user.like(post)
       serializer = self.serializer_class(post)
       return Response(serializer.data,
                       status=status.HTTP_200_OK)
    @action(methods=['post'], detail=True)
    def remove_like(self, request, *args, **kwargs):
       post = self.get_object()
       user = self.request.user
       user.remove_like(post)
       serializer = self.serializer_class(post)
       return Response(serializer.data,
                       status=status.HTTP_200_OK)
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True) # this calls the validate_author method in the serializer to check
        # if the author is the user
        self.perform_create(serializer)
        return Response(serializer.data,
                        status=status.HTTP_201_CREATED)
    # def update(self, instance, validated_data):
    #    if not instance.edited:
    #        validated_data['edited'] = True
    #    instance = super().update(instance,validated_data)
    #    return instance