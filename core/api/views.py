from rest_framework.generics import ListAPIView
from rest_framework.permissions import AllowAny
from core.models import Item
from .serializers import ItemSerializer


class ItemListView(ListAPIView):
    permission_classes = (AllowAny,)  # never forget this comma after AllowAny
    serializer_class = ItemSerializer
    queryset = Item.objects.all()
