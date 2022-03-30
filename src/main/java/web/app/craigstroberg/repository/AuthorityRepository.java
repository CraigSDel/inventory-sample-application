package web.app.craigstroberg.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import web.app.craigstroberg.domain.Authority;

/**
 * Spring Data JPA repository for the {@link Authority} entity.
 */
public interface AuthorityRepository extends JpaRepository<Authority, String> {}
