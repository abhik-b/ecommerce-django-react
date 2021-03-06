from django.urls import path
from .views import (ItemListView,
                    AddToCartView,
                    OrderDetailView,
                    PaymentAPIView,
                    AddCouponView
                    )

urlpatterns = [
    path('product-list/', ItemListView.as_view(), name='product-list'),
    path('add-to-cart/', AddToCartView.as_view(), name='add-to-cart'),
    path('order-summary/', OrderDetailView.as_view(), name='order-summary'),
    path('checkout/', PaymentAPIView.as_view(), name='checkout'),
    path('add-coupon/', AddCouponView.as_view(), name="add-coupon")
]
