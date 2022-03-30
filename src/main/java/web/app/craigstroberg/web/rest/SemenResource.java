package web.app.craigstroberg.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;
import web.app.craigstroberg.domain.Semen;
import web.app.craigstroberg.repository.SemenRepository;
import web.app.craigstroberg.web.rest.errors.BadRequestAlertException;

/**
 * REST controller for managing {@link web.app.craigstroberg.domain.Semen}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class SemenResource {

    private final Logger log = LoggerFactory.getLogger(SemenResource.class);

    private static final String ENTITY_NAME = "semen";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SemenRepository semenRepository;

    public SemenResource(SemenRepository semenRepository) {
        this.semenRepository = semenRepository;
    }

    /**
     * {@code POST  /semen} : Create a new semen.
     *
     * @param semen the semen to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new semen, or with status {@code 400 (Bad Request)} if the semen has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/semen")
    public ResponseEntity<Semen> createSemen(@RequestBody Semen semen) throws URISyntaxException {
        log.debug("REST request to save Semen : {}", semen);
        if (semen.getId() != null) {
            throw new BadRequestAlertException("A new semen cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Semen result = semenRepository.save(semen);
        return ResponseEntity
            .created(new URI("/api/semen/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId()))
            .body(result);
    }

    /**
     * {@code PUT  /semen/:id} : Updates an existing semen.
     *
     * @param id the id of the semen to save.
     * @param semen the semen to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated semen,
     * or with status {@code 400 (Bad Request)} if the semen is not valid,
     * or with status {@code 500 (Internal Server Error)} if the semen couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/semen/{id}")
    public ResponseEntity<Semen> updateSemen(@PathVariable(value = "id", required = false) final String id, @RequestBody Semen semen)
        throws URISyntaxException {
        log.debug("REST request to update Semen : {}, {}", id, semen);
        if (semen.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, semen.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!semenRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Semen result = semenRepository.save(semen);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, semen.getId()))
            .body(result);
    }

    /**
     * {@code PATCH  /semen/:id} : Partial updates given fields of an existing semen, field will ignore if it is null
     *
     * @param id the id of the semen to save.
     * @param semen the semen to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated semen,
     * or with status {@code 400 (Bad Request)} if the semen is not valid,
     * or with status {@code 404 (Not Found)} if the semen is not found,
     * or with status {@code 500 (Internal Server Error)} if the semen couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/semen/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Semen> partialUpdateSemen(
        @PathVariable(value = "id", required = false) final String id,
        @RequestBody Semen semen
    ) throws URISyntaxException {
        log.debug("REST request to partial update Semen partially : {}, {}", id, semen);
        if (semen.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, semen.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!semenRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Semen> result = semenRepository
            .findById(semen.getId())
            .map(existingSemen -> {
                if (semen.getDescription() != null) {
                    existingSemen.setDescription(semen.getDescription());
                }
                if (semen.getReceivedDate() != null) {
                    existingSemen.setReceivedDate(semen.getReceivedDate());
                }
                if (semen.getStatus() != null) {
                    existingSemen.setStatus(semen.getStatus());
                }
                if (semen.getDateAdded() != null) {
                    existingSemen.setDateAdded(semen.getDateAdded());
                }
                if (semen.getLastModified() != null) {
                    existingSemen.setLastModified(semen.getLastModified());
                }

                return existingSemen;
            })
            .map(semenRepository::save);

        return ResponseUtil.wrapOrNotFound(result, HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, semen.getId()));
    }

    /**
     * {@code GET  /semen} : get all the semen.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of semen in body.
     */
    @GetMapping("/semen")
    public ResponseEntity<List<Semen>> getAllSemen(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of Semen");
        Page<Semen> page = semenRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /semen/:id} : get the "id" semen.
     *
     * @param id the id of the semen to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the semen, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/semen/{id}")
    public ResponseEntity<Semen> getSemen(@PathVariable String id) {
        log.debug("REST request to get Semen : {}", id);
        Optional<Semen> semen = semenRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(semen);
    }

    /**
     * {@code DELETE  /semen/:id} : delete the "id" semen.
     *
     * @param id the id of the semen to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/semen/{id}")
    public ResponseEntity<Void> deleteSemen(@PathVariable String id) {
        log.debug("REST request to delete Semen : {}", id);
        semenRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id)).build();
    }
}
