package br.com.autoflex.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    private static final String FORWARD_INDEX = "forward:/index.html";

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        // Forward all non-API routes to index.html for React Router
        registry.addViewController("/").setViewName(FORWARD_INDEX);
        registry.addViewController("/{x:[\\w\\-]+}").setViewName(FORWARD_INDEX);
        registry.addViewController("/{x:^(?!api$).*$}/**/{y:[\\w\\-]+}").setViewName(FORWARD_INDEX);
    }
}

