import uuid
from django.db import models
from core.abstract.models import AbstractManager,AbstractModel
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.http import Http404
from django.core.exceptions import ObjectDoesNotExist

def user_directory_path(instance, filename):
    # file will be uploaded to MEDIA_ROOT/user_<id>/<filename>
    return "user_{0}/{1}".format(instance.public_id, filename)

# Create your models here.
class UserManager(AbstractManager,BaseUserManager):
#     def get_object_by_public_id(self,public_id):
#         try:
#             Object=self.get(public_id=public_id)
#             return Object
#         except (ObjectDoesNotExist,TypeError,ValueError):
#             return Http404
    def create_user(self, username, email, password=None,**kwargs):
        """Create and return a `User` with an email, phone
                number, username and password."""
        if username is None:
                raise TypeError('Users must have a username.')
        if email is None:
                raise TypeError('Users must have an email.')
        if password is None:
                raise TypeError('User must have an email.')
        user = self.model(username=username,
                email=self.normalize_email(email), **kwargs) # normailze email lowercases the domain part
        user.set_password(password) # to make sure password is hashed that is 
        # why we didnot add it to user when creating it
        user.save(using=self._db) # if we have multiple databse connections
        return user
    def create_superuser(self, username, email, password,**kwargs):
        """
        Create and return a `User` with superuser (admin)
                permissions.
        """
        if password is None:
                raise TypeError('Superusers must have apassword.')
        if email is None:
                raise TypeError('Superusers must have an emial.')
        if username is None:
           raise TypeError('Superusers must have an username.')
        user = self.create_user(username, email, password,**kwargs)
        user.is_superuser = True
        user.is_staff = True
        user.save(using=self._db)
        return user
class User(AbstractModel,AbstractBaseUser,PermissionsMixin):
#     public_id = models.UUIDField(db_index=True, unique=True,
#        default=uuid.uuid4, editable=False)
    username = models.CharField(db_index=True,
       max_length=255, unique=True)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    bio = models.TextField(null=True)
    avatar = models.ImageField(null=True,blank=True,upload_to=user_directory_path)
    email = models.EmailField(db_index=True, unique=True)
    is_active = models.BooleanField(default=True)
    is_superuser = models.BooleanField(default=False)
    posts_liked=models.ManyToManyField(
          'core_post.Post',
          related_name='liked_by' # referencing field in the related table
    )
#     created = models.DateTimeField(auto_now=True)
#     updated = models.DateTimeField(auto_now_add=True)
    USERNAME_FIELD = 'email' # user will be identified with their emails 
    # so they login with their emails
    REQUIRED_FIELDS = ['username']
    objects = UserManager()
    @property
    def name(self):
        return f"{self.first_name} {self.last_name}"
    def like(self, post):
       """Like `post` if it hasn't been done yet"""
       return self.posts_liked.add(post)
    def remove_like(self, post):
        """Remove a like from a `post`"""
        return self.posts_liked.remove(post)
    def has_liked(self, post):
        """Return True if the user has liked a `post`; else
        False"""
        return self.posts_liked.filter(pk=post.pk).exists()