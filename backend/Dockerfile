FROM python:3.9-alpine

RUN mkdir app
WORKDIR /app

ARG BUILD_DEPENDENCIES="build-base openssh perl zlib-dev postgresql-dev"

ENV VIRTUAL_ENV=/venv
RUN apk add --no-cache ${BUILD_DEPENDENCIES} db-dev jpeg-dev geos proj gdal binutils postgresql-client git \
 && python3 -m venv $VIRTUAL_ENV

# this 'activates' virtual environment, since classic activate does not work
# https://pythonspeed.com/articles/activate-virtualenv-dockerfile/
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

# set latest pip version to avoid warning messages
RUN pip install pip==21.1.2

# logging dirs
RUN mkdir -p /logs/backend

COPY requirements.txt /requirements.txt
RUN pip install -r /requirements.txt

RUN apk del ${BUILD_DEPENDENCIES}

WORKDIR /app
# Copy files
COPY . .

# default value 8000, can be overwritten in docker-compose build: args: APP_PORT: ...
ARG APP_PORT=8000
EXPOSE ${APP_PORT}

COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["sh", "docker-entrypoint.sh"]
