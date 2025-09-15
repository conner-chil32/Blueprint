FROM wordpress:php8.4-apache

EXPOSE 8000
RUN sed -i 's/Listen 80/Listen 80\nListen 8000/' /etc/apache2/ports.conf && \
    sed -i 's/<VirtualHost *:80>/<VirtualHost *:80 *:8000>/' /etc/apache2/sites-available/000-default.conf;
