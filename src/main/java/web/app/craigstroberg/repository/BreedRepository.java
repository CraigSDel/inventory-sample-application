package web.app.craigstroberg.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import web.app.craigstroberg.domain.Breed;

/**
 * Spring Data SQL repository for the Breed entity.
 */
@SuppressWarnings("unused")
@Repository
public interface BreedRepository extends JpaRepository<Breed, String> {}
