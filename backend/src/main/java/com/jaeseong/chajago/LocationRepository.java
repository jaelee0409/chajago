// LocationRepository.java
package com.jaeseong.chajago;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface LocationRepository extends JpaRepository<Location, Long> {
    List<Location> findByNameContaining(String name);
}