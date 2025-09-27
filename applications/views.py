from rest_framework import generics, permissions, parsers
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny

from rest_framework.response import Response
from openai import OpenAI

from .models import Application
from universities.models import University
from .serializers import ApplicationSerializer, RecommendSerializer
from .permissions import IsOwnerOrStaff


class ApplicationListCreateView(generics.ListCreateAPIView):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        print(serializer.data)
        return Response(serializer.data)

    def filter_queryset(self, queryset):
        user = self.request.user
        return queryset.filter(user=user)

class ApplicationDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer
    permission_classes = [IsOwnerOrStaff]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        print(serializer.data)
        return Response(serializer.data)


@api_view(['POST'])
def recommend_view(request, *args, **kwargs):
    client = OpenAI()
    serializer = RecommendSerializer(data=request.data)
    if serializer.is_valid(raise_exception=True):
        data = serializer.validated_data
        data['interested_in'] = data['interested_in'].lower().replace('i\'m interested in', '')
        data['good_at'] = data['good_at'].lower().replace('i think i\'m good at', '')
    universities = University.objects.prefetch_related('faculty_set').all()
    faculty_names_list = []
    for university in universities:
        faculties = university.faculty_set.all()
        l = [f'{faculty.name} of {university.name}' for faculty in faculties]
        faculty_names_list.extend(l)
    input_text = (f'Here is the list of faculties of universities:\n{",".join(faculty_names_list)}.\n'
                  f'If a person would say that he is good at:\n{data["good_at"]}\n'
                  f'And also if a person would be interested in:\n{data["interested_in"]}'
                  f'Choose exactly 5 of the faculties that would fit that person'
                  f' and return only them separated by comma')
    print('INPUT TEXT', input_text)
    response = client.responses.create(
    model="gpt-5",
    input=input_text
)
    print('OUTPUT TEXT', response.output_text)
    return Response(response.output_text.split(','))
