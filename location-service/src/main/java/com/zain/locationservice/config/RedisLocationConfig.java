package com.zain.locationservice.config;

import com.zain.locationservice.model.Location;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;

@Configuration
public class RedisLocationConfig {

    @Bean
    public RedisTemplate<Long, Location> redisTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<Long, Location> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);
        return template;
    }
}
