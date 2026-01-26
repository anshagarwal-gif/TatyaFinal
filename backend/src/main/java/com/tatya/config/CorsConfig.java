package com.tatya.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.List;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {

        CorsConfiguration config = new CorsConfiguration();

        // 🔐 Required when using cookies / auth headers
        config.setAllowCredentials(true);

        // ✅ Production-safe (works behind nginx / proxies)
        config.setAllowedOriginPatterns(List.of(
                "https://taaran.app",
                "https://www.taaran.app"));

        // 🧾 Allow all headers from frontend
        config.setAllowedHeaders(List.of("*"));

        // 🔓 Allow common HTTP methods
        config.setAllowedMethods(List.of(
                "GET",
                "POST",
                "PUT",
                "DELETE",
                "OPTIONS",
                "PATCH"));

        // 📤 (Optional but recommended)
        config.setExposedHeaders(List.of(
                "Authorization",
                "Content-Type"));

        // ⏱ Cache preflight response (seconds)
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", config);

        return new CorsFilter(source);
    }
}
