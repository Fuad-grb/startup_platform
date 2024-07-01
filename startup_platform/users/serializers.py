from rest_framework import serializers
from .models import CustomUser, Profile, Notification, Message, Achievement, UserAchievement
from startups.models import Industry

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['skills', 'experience']

class IndustrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Industry
        fields = ['id', 'name']

class CustomUserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(required=False)
    interests = serializers.PrimaryKeyRelatedField(queryset=Industry.objects.all(), many=True, required=False)

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'user_type', 'bio', 'profile_picture', 'profile', 'interests']
        extra_kwargs = {'password': {'write_only': True}}
        extra_kwargs = {
            'username': {'required': False},
            'email': {'required': False},
            'bio': {'required': False},
            'interests': {'required': False},
            'profile_picture': {'required': False},
            'user_type': {'required': False},
        }

    def create(self, validated_data):
        profile_data = validated_data.pop('profile', None)
        user = CustomUser.objects.create_user(**validated_data)
        if profile_data:
            Profile.objects.create(user=user, **profile_data)
        return user
    
    def update(self, instance, validated_data):
        interests_data = validated_data.pop('interests', None)
        instance = super().update(instance, validated_data)
        if interests_data is not None:
            instance.interests.set([Industry.objects.get(name=interest) for interest in interests_data])
        return instance
    

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'content', 'is_read', 'created_at']


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['id', 'sender', 'recipient', 'content', 'timestamp', 'is_read']
        read_only_fields = ['sender', 'timestamp']


class AchievementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Achievement
        fields = ['id', 'name', 'description', 'icon']

class UserAchievementSerializer(serializers.ModelSerializer):
    achievement = AchievementSerializer()

    class Meta:
        model = UserAchievement
        fields = ['id', 'achievement', 'date_earned']


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['username', 'password', 'email', 'user_type']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            email=validated_data['email'],
            user_type=validated_data['user_type']
        )
        return user
    
    def validate(self, data):
        if data['user_type'] not in ['startup', 'investor', 'specialist']:
            raise serializers.ValidationError("Invalid user type")
        return data