from rest_framework.serializers import ModelSerializer


def make_serializer(_model):
    class Serializer(ModelSerializer):
        class Meta:
            model = _model
            exclude = ()

    return Serializer
