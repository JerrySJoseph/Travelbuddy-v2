package com.zain.locationservice.repo;

import com.zain.locationservice.model.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LocationRepo extends JpaRepository<Location, Long> {

    List<Location> findByNameIgnoreCaseContaining(String name);
    List<Location> findByCountryIgnoreCaseContaining(String country);

    Optional<Location> findByNameIgnoreCaseAndCountryIgnoreCase(String name, String country);
}
