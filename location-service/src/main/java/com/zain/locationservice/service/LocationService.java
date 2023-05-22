package com.zain.locationservice.service;

import com.zain.locationservice.model.Location;
import com.zain.locationservice.model.GenericResponse;
import com.zain.locationservice.repo.LocationRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LocationService {

    @Value("${redis.key.location}")
    private String locationKey;

    private final LocationRepo repo;

    @Autowired
    public LocationService(LocationRepo repo) {
        this.repo = repo;
    }

    private GenericResponse createResponse(List<Location> locations, String successMessage, String failMessage) {
        return Optional.ofNullable(locations)
                .filter(list -> !list.isEmpty())
                .map(list -> new GenericResponse(true, successMessage, list))
                .orElse(new GenericResponse(false, failMessage, null));
    }

    public GenericResponse getAllLocations() {
        return createResponse(repo.findAll(), "Locations found", "No locations found");
    }

    @Cacheable(key = "#name", value = "location")
    public GenericResponse getLocationByName(String name) {
        System.out.println("hit db");
        return createResponse(repo.findByNameIgnoreCaseContaining(name), "Location found", "No location found");
    }

    @Cacheable(key = "#country", value = "location")
    public GenericResponse getLocationByCountry(String country) {
        return createResponse(repo.findByCountryIgnoreCaseContaining(country), "Location found", "No location found");
    }

    public GenericResponse insertLocation(Location newLocation) {
        Optional<Location> existingLocation = repo.findByNameIgnoreCaseAndCountryIgnoreCase(newLocation.getName(), newLocation.getCountry());

        if (existingLocation.isPresent()) {
            return new GenericResponse(false, "Location already exists", null);
        } else {
            Location savedLocation = repo.save(newLocation);
            return new GenericResponse(true, "Location saved", List.of(savedLocation));
        }
    }

    public GenericResponse updateLocation(Long locationId, Location updateLocation) {
        return repo.findById(locationId)
                .map(location -> {
                    location.setName(updateLocation.getName());
                    location.setCountry(updateLocation.getCountry());
                    Location updatedLocation = repo.save(location);
                    return new GenericResponse(true, "Location updated", List.of(updatedLocation));
                })
                .orElse(new GenericResponse(false, "Location not found", null));
    }

    @CacheEvict(value = "location", allEntries = true)
    public String evictAllCacheValues() {
        return "evict all";
    }
}
