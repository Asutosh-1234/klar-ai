# Use official PostgreSQL image as base
FROM postgres:16

# Optional: set environment variables (can also be passed at runtime)
ENV POSTGRES_USER=myuser
ENV POSTGRES_PASSWORD=mypassword
ENV POSTGRES_DB=mydatabase

# Optional: copy initialization scripts (runs on first container startup)
# Any .sql or .sh files in this folder will be executed automatically
# COPY ./init-scripts/ /docker-entrypoint-initdb.d/

# Expose PostgreSQL default port
EXPOSE 5432

# No need to define CMD or ENTRYPOINT (already handled by base image)