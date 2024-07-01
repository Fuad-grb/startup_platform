from rest_framework import permissions

class IsFounderOrReadOnly(permissions.BasePermission):
    """
    for only startup funders could edit it.
    """

    def has_object_permission(self, request, view, obj):
        # get, head, options requests are allowed for any requestor
        if request.method in permissions.SAFE_METHODS:
            return True

        # only startup funders could edit it
        return obj.founder == request.user