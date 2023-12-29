from rest_framework import serializers
from django.conf import settings
from core.abstract.serializers import AbstractSerializer
from core.user.models import User

class UserSerializer(AbstractSerializer):
    name = serializers.SerializerMethodField()
    posts_count = serializers.SerializerMethodField()

    def get_posts_count(self, instance):
        return instance.post_set.count()
    def get_name(self,instance):
        return instance.first_name+" "+instance.last_name
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if not representation["avatar"]:
            representation["avatar"] = settings.DEFAULT_AVATAR_URL
            return representation
        if settings.DEBUG:  # debug enabled for dev
            request = self.context.get("request")
            representation["avatar"] = request.build_absolute_uri(representation["avatar"])
        return representation
    class Meta:
       model = User
       fields = ['id', 'username','name', 'first_name',
           'last_name','bio','posts_count','avatar','email',
           'is_active', 'created', 'updated']
       read_only_field = ['is_active']