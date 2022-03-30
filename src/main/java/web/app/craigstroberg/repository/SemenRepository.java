package web.app.craigstroberg.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import web.app.craigstroberg.domain.Semen;

/**
 * Spring Data SQL repository for the Semen entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SemenRepository extends JpaRepository<Semen, String> {}
