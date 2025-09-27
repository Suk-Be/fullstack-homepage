FROM php:8.2-apache

# Apache Rewrite Modul aktivieren
RUN a2enmod rewrite

# PHP Extensions & Tools
RUN apt-get update && apt-get install -y \
    libonig-dev \
    libzip-dev \
    unzip \
    git \
    curl \
    && docker-php-ext-install pdo_mysql zip mbstring

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Optimiertes Cache-Build: zuerst composer.json + lock
COPY composer.json composer.lock ./
RUN composer install --no-scripts --no-autoloader

# Rest kopieren
COPY . .

RUN composer dump-autoload --optimize

# Apache auf public/ zeigen
RUN sed -i 's|/var/www/html|/var/www/html/public|g' /etc/apache2/sites-available/000-default.conf
