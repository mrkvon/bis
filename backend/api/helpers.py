def parse_request_data(serializer_class):
    def decorator(fn):
        def wrapper(request):
            serializer = serializer_class(data=request.data)
            serializer.is_valid(raise_exception=True)
            return fn(request, serializer.validated_data)

        return wrapper

    return decorator
