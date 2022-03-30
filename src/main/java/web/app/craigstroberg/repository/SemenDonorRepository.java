package web.app.craigstroberg.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import web.app.craigstroberg.domain.SemenDonor;

/**
 * Spring Data SQL repository for the SemenDonor entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SemenDonorRepository extends JpaRepository<SemenDonor, String> {}
