package web.app.craigstroberg.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import web.app.craigstroberg.domain.Farm;

/**
 * Spring Data SQL repository for the Farm entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FarmRepository extends JpaRepository<Farm, String> {}
