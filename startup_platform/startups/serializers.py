from rest_framework import serializers
from .models import Startup, StartupUpdate, StartupRating, StartupComment, Tag, Event, EventAttendee


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name']
class StartupSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, read_only=True)

    class Meta:
        model = Startup
        fields = ['id', 'name', 'founder', 'description', 'founded_date', 'industry', 'website', 'funding_stage', 'tags']
        

class StartupUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = StartupUpdate
        fields = ['id', 'startup', 'title', 'content', 'date_posted']

class StartupRatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = StartupRating
        fields = ['id', 'startup', 'user', 'rating', 'created_at']

class StartupCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = StartupComment
        fields = ['id', 'startup', 'user', 'content', 'created_at']



class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['id', 'startup', 'title', 'description', 'date', 'location', 'is_online']

class EventAttendeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventAttendee
        fields = ['id', 'event', 'user', 'rsvp_status']