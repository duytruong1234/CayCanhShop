# Stage 1: Build the React application
FROM node:18 AS build

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy all files and build
COPY . .
# Truyền biến môi trường lúc build bằng ARG
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

# Xóa các trang HTML mặc định của Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copy build từ stage 1 sang thư mục của Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Ghi đè file cấu hình nginx (xử lý pushstate router của React)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
