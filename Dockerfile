FROM node:10
RUN mkdir -p /app
WORKDIR /app
ADD . /app
RUN cd helmviewer-server && npm run init
EXPOSE 3000
WORKDIR /app/helmviewer-server
CMD ["node", "app"]