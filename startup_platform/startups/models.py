from django.db import models
from users.models import CustomUser
from django.core.validators import MinValueValidator, MaxValueValidator
from django.contrib.postgres.search import SearchVector, SearchQuery, SearchRank


class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name
    

class StartupManager(models.Manager):
    def search(self, query):
        search_vector = SearchVector('name', 'description')
        search_query = SearchQuery(query)
        return self.annotate(
            search=search_vector,
            rank=SearchRank(search_vector, search_query)
        ).filter(search=search_query).order_by('-rank')
    


class Startup(models.Model):
    name = models.CharField(max_length=100)
    founder = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    description = models.TextField()
    founded_date = models.DateField()
    industry = models.CharField(max_length=50)
    website = models.URLField(blank=True)
    funding_stage = models.CharField(max_length=50)
    average_rating = models.FloatField(default=0.0)
    total_ratings = models.IntegerField(default=0)
    tags = models.ManyToManyField(Tag, related_name='startups', blank=True)
    objects = StartupManager()
class StartupUpdate(models.Model):
    startup = models.ForeignKey(Startup, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    content = models.TextField()
    date_posted = models.DateTimeField(auto_now_add=True)

class Industry(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name
    
class StartupRating(models.Model):
    startup = models.ForeignKey(Startup, on_delete=models.CASCADE, related_name='ratings')
    user = models.ForeignKey('users.CustomUser', on_delete=models.CASCADE)
    rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    created_at = models.DateTimeField(auto_now_add=True)

class StartupComment(models.Model):
    startup = models.ForeignKey(Startup, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey('users.CustomUser', on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)


class StartupSubscription(models.Model):
    user = models.ForeignKey('users.CustomUser', on_delete=models.CASCADE)
    startup = models.ForeignKey(Startup, on_delete=models.CASCADE)
    subscribed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'startup')


class UserAction(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    startup = models.ForeignKey(Startup, on_delete=models.CASCADE)
    action_type = models.CharField(max_length=20)  # for instance, 'like', 'comment', 'view'
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'startup', 'action_type')



class Event(models.Model):
    startup = models.ForeignKey(Startup, related_name='events', on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField()
    date = models.DateTimeField()
    location = models.CharField(max_length=200)
    is_online = models.BooleanField(default=False)

class EventAttendee(models.Model):
    event = models.ForeignKey(Event, related_name='attendees', on_delete=models.CASCADE)
    user = models.ForeignKey(CustomUser, related_name='events_attending', on_delete=models.CASCADE)
    rsvp_status = models.CharField(max_length=20, choices=[('yes', 'Going'), ('maybe', 'Maybe'), ('no', 'Not Going')])


