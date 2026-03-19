# Stage 1: Build the React application
FROM node:18 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

# Railway gán PORT động, mặc định 80 nếu không có
ENV PORT=80
EXPOSE ${PORT}

# Dùng envsubst để thay thế $PORT trong template rồi chạy nginx
CMD sh -c "envsubst '\$PORT' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"
