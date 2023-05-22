package com.zain.locationservice.controller;

import com.zain.locationservice.model.GenericResponse;
import com.zain.locationservice.model.Location;
import com.zain.locationservice.service.LocationService;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.core.GenericEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class LocationController {

    private final LocationService service;

    @Autowired
    public LocationController(LocationService service) {
        this.service = service;
    }

    @GetMapping("/all")
    public ResponseEntity<GenericResponse> getAllLocations() {
        return ResponseEntity.ok(service.getAllLocations());
    }

    @GetMapping("/name")
    public ResponseEntity<GenericResponse> getLocationByName(@RequestParam String name) {
        return ResponseEntity.ok(service.getLocationByName(name));
    }

    @GetMapping("/country")
    public ResponseEntity<GenericResponse> getLocationByCountry(@RequestParam String country) {
        return ResponseEntity.ok(service.getLocationByCountry(country));
    }

    @PostMapping("/insert")
    public ResponseEntity<GenericResponse> insertLocation(@RequestBody Location newLocation) {
        return ResponseEntity.ok(service.insertLocation(newLocation));
    }
}
