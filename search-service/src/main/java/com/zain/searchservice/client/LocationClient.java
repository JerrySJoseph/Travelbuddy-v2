package com.zain.searchservice.client;

import com.zain.searchservice.model.GenericResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(value = "location-service/api/location")
public interface LocationClient {

    @GetMapping("/name/{name}")
    public GenericResponse getLocationByName(@PathVariable("name") String name);

    @GetMapping("/country/{country}")
    public GenericResponse getLocationByCountry(@PathVariable("country") String country);
}
