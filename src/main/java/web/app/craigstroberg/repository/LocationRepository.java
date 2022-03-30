package web.app.craigstroberg.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import web.app.craigstroberg.domain.Location;

/**
 * Spring Data SQL repository for the Location entity.
 */
@SuppressWarnings("unused")
@Repository
public interface LocationRepository extends JpaRepository<Location, String> {}
