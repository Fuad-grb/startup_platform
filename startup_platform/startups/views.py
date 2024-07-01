from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Startup, StartupUpdate, Industry, StartupSubscription, UserAction, Event, EventAttendee
from .serializers import StartupSerializer, StartupUpdateSerializer, StartupRatingSerializer, StartupCommentSerializer, EventSerializer, EventAttendeeSerializer
from users.serializers import IndustrySerializer
from .permissions import IsFounderOrReadOnly
from .filters import StartupFilter
from django.db.models import Q
from .models import StartupRating
from django.db.models import Avg
from django.db.models import Count
from rest_framework.permissions import IsAuthenticated
from rest_framework import status




class StartupViewSet(viewsets.ModelViewSet):
    queryset = Startup.objects.all()
    serializer_class = StartupSerializer
    permission_classes = [IsFounderOrReadOnly]
    filterset_class = StartupFilter
    search_fields = ['name', 'description', 'industry']

    @action(detail=False)
    def recommended(self, request):
        user = request.user
        user_interests = user.interests.all()
    
        recommended_startups = Startup.objects.filter(
            Q(industry__in=user_interests) |
            Q(founder__interests__in=user_interests)
        ).annotate(
            relevance=Count('industry', filter=Q(industry__in=user_interests)) +
                    Count('founder__interests', filter=Q(founder__interests__in=user_interests))
        ).order_by('-relevance', '-average_rating')[:10]
    
        serializer = self.get_serializer(recommended_startups, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def rate(self, request, pk=None):
        startup = self.get_object()
        user = request.user
        rating = request.data.get('rating')
        
        if not rating:
            return Response({'error': 'Rating is required'}, status=400)
        
        rating_instance, created = StartupRating.objects.update_or_create(
            startup=startup, user=user,
            defaults={'rating': rating}
        )
        
        # update average rating
        avg_rating = startup.ratings.aggregate(Avg('rating'))['rating__avg']
        startup.average_rating = avg_rating
        startup.total_ratings = startup.ratings.count()
        startup.save()
        
        serializer = StartupRatingSerializer(rating_instance)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def comment(self, request, pk=None):
        startup = self.get_object()
        serializer = StartupCommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(startup=startup, user=request.user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    
    @action(detail=True, methods=['post'])
    def subscribe(self, request, pk=None):
        startup = self.get_object()
        user = request.user
        subscription, created = StartupSubscription.objects.get_or_create(user=user, startup=startup)
        if created:
            return Response({'status': 'subscribed to startup'})
        return Response({'status': 'already subscribed'})

    @action(detail=True, methods=['post'])
    def unsubscribe(self, request, pk=None):
        startup = self.get_object()
        user = request.user
        try:
            subscription = StartupSubscription.objects.get(user=user, startup=startup)
            subscription.delete()
            return Response({'status': 'unsubscribed from startup'})
        except StartupSubscription.DoesNotExist:
            return Response({'status': 'not subscribed'})
        

    @action(detail=False, methods=['get'])
    def search_by_tag(self, request):
        tag_name = request.query_params.get('tag', None)
        if tag_name:
            startups = Startup.objects.filter(tags__name__icontains=tag_name)
            serializer = self.get_serializer(startups, many=True)
            return Response(serializer.data)
        return Response({'error': 'Tag parameter is required'}, status=400)
    
    @action(detail=False, methods=['get'])
    def search(self, request):
        query = request.query_params.get('q', '')
        if query:
            startups = Startup.objects.search(query)
            serializer = self.get_serializer(startups, many=True)
            return Response(serializer.data)
        return Response({'error': 'Query parameter is required'}, status=400)
    

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def recommended(self, request):
        user = request.user
        if user.is_authenticated:
            user_interests = user.interests.all()
            recommended_startups = Startup.objects.filter(
                Q(industry__in=user_interests) |
                Q(founder__interests__in=user_interests)
            ).distinct().order_by('?')[:5]
            serializer = self.get_serializer(recommended_startups, many=True)
            return Response(serializer.data)
        else:
            return Response({"detail": "Authentication required to get recommendations."},
                            status=status.HTTP_401_UNAUTHORIZED)

        serializer = self.get_serializer(similar_startups, many=True)
        return Response(serializer.data)
    


class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    @action(detail=True, methods=['post'])
    def rsvp(self, request, pk=None):
        event = self.get_object()
        user = request.user
        status = request.data.get('status')
        if status not in ['yes', 'maybe', 'no']:
            return Response({'error': 'Invalid RSVP status'}, status=400)
        attendee, created = EventAttendee.objects.update_or_create(
            event=event, user=user, defaults={'rsvp_status': status}
        )
        return Response({'status': 'RSVP updated'})





class StartupUpdateViewSet(viewsets.ModelViewSet):
    queryset = StartupUpdate.objects.all()
    serializer_class = StartupUpdateSerializer
    permission_classes = [IsFounderOrReadOnly]

class IndustryViewSet(viewsets.ModelViewSet):
    queryset = Industry.objects.all()
    serializer_class = IndustrySerializer