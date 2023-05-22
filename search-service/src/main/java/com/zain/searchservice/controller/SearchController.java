package com.zain.searchservice.controller;

import com.zain.searchservice.model.GenericResponse;
import com.zain.searchservice.service.SearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/search")
public class SearchController {

    private final SearchService searchService;

    @Autowired
    public SearchController(SearchService searchService) {
        this.searchService = searchService;
    }

    @GetMapping("/location/name/{name}")
    public ResponseEntity<GenericResponse> getLocationByName(@PathVariable String name) {
        return ResponseEntity.ok(searchService.getLocationByName(name));
    }

    @GetMapping("/location/country/{country}")
    public ResponseEntity<GenericResponse> getLocationByCountry(@PathVariable String country) {
        return ResponseEntity.ok(searchService.getLocationByCountry(country));
    }
}
