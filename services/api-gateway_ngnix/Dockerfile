# Use the official NGINX image as the base image
FROM nginx:latest

# Copy your NGINX configuration file for the API gateway
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose the necessary ports (443 by default)
EXPOSE 443

# Start NGINX when the container starts
CMD ["nginx", "-g", "daemon off;"]
