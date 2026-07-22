package com.TuraTrip.backend.configs;

import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${app.uploads-dir}")
    private String uploadsDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Convertimos la ruta física a un URI absoluto compatible con Tomcat
        Path uploadPath = Paths.get(uploadsDir).toAbsolutePath();
        String location = uploadPath.toUri().toString();

        // Mapea cualquier ruta que empiece por /uploads/ a la carpeta física raíz
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(location);
    }
}
