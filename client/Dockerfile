FROM node:23-alpine as builder

WORKDIR /usr/src/app

COPY package* ./

RUN npm install

COPY . .

# Build the project
RUN npm run build

FROM nginx:stable-alpine

# Copy conf file  
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Remove default nginx index page
RUN rm -rf /usr/share/nginx/html/*

# Copy build files from stage 1
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]