package com.zain.searchservice.service;

import com.zain.searchservice.client.LocationClient;
import com.zain.searchservice.model.GenericResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SearchService {

    private final LocationClient locationClient;

    @Autowired
    public SearchService(LocationClient locationClient) {
        this.locationClient = locationClient;
    }

    public GenericResponse getLocationByName(String name) {
        return locationClient.getLocationByName(name);
    }

    public GenericResponse getLocationByCountry(String country) {
        return locationClient.getLocationByCountry(country);
    }
}
