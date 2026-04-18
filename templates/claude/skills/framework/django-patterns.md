---
name: django-patterns
description: Thin views, fat models, class-based views for CRUD, forms for validation.
triggers: django, model, view, cbv, form, orm, queryset, template
---

## Problem
Business logic leaks into views and templates where it is hard to test. Django wants logic in models and managers.

## Rule
- Keep views thin: parse input, call model method, render response.
- Put domain logic in models and custom managers; unit-test them directly.
- Use class-based views (CBVs) for standard CRUD; FBVs only for one-offs.
- Validate with Django forms or DRF serializers; no ad-hoc `request.POST['x']`.
- Use `select_related`/`prefetch_related` to kill N+1 queries.
- Migrations are code: review them, never edit applied ones in place.

## Example
```python
# models.py
class OrderManager(models.Manager):
    def place(self, user, items):
        with transaction.atomic():
            order = self.create(user=user)
            order.add_items(items)
            return order

class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    objects = OrderManager()

# views.py
class PlaceOrderView(LoginRequiredMixin, FormView):
    form_class = PlaceOrderForm
    def form_valid(self, form):
        Order.objects.place(self.request.user, form.cleaned_data["items"])
        return redirect("orders")
```
