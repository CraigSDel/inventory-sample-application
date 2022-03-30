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
import web.app.craigstroberg.domain.SemenDonor;
import web.app.craigstroberg.repository.SemenDonorRepository;
import web.app.craigstroberg.web.rest.errors.BadRequestAlertException;

/**
 * REST controller for managing {@link web.app.craigstroberg.domain.SemenDonor}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class SemenDonorResource {

    private final Logger log = LoggerFactory.getLogger(SemenDonorResource.class);

    private static final String ENTITY_NAME = "semenDonor";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SemenDonorRepository semenDonorRepository;

    public SemenDonorResource(SemenDonorRepository semenDonorRepository) {
        this.semenDonorRepository = semenDonorRepository;
    }

    /**
     * {@code POST  /semen-donors} : Create a new semenDonor.
     *
     * @param semenDonor the semenDonor to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new semenDonor, or with status {@code 400 (Bad Request)} if the semenDonor has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/semen-donors")
    public ResponseEntity<SemenDonor> createSemenDonor(@RequestBody SemenDonor semenDonor) throws URISyntaxException {
        log.debug("REST request to save SemenDonor : {}", semenDonor);
        if (semenDonor.getId() != null) {
            throw new BadRequestAlertException("A new semenDonor cannot already have an ID", ENTITY_NAME, "idexists");
        }
        SemenDonor result = semenDonorRepository.save(semenDonor);
        return ResponseEntity
            .created(new URI("/api/semen-donors/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId()))
            .body(result);
    }

    /**
     * {@code PUT  /semen-donors/:id} : Updates an existing semenDonor.
     *
     * @param id the id of the semenDonor to save.
     * @param semenDonor the semenDonor to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated semenDonor,
     * or with status {@code 400 (Bad Request)} if the semenDonor is not valid,
     * or with status {@code 500 (Internal Server Error)} if the semenDonor couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/semen-donors/{id}")
    public ResponseEntity<SemenDonor> updateSemenDonor(
        @PathVariable(value = "id", required = false) final String id,
        @RequestBody SemenDonor semenDonor
    ) throws URISyntaxException {
        log.debug("REST request to update SemenDonor : {}, {}", id, semenDonor);
        if (semenDonor.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, semenDonor.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!semenDonorRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        SemenDonor result = semenDonorRepository.save(semenDonor);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, semenDonor.getId()))
            .body(result);
    }

    /**
     * {@code PATCH  /semen-donors/:id} : Partial updates given fields of an existing semenDonor, field will ignore if it is null
     *
     * @param id the id of the semenDonor to save.
     * @param semenDonor the semenDonor to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated semenDonor,
     * or with status {@code 400 (Bad Request)} if the semenDonor is not valid,
     * or with status {@code 404 (Not Found)} if the semenDonor is not found,
     * or with status {@code 500 (Internal Server Error)} if the semenDonor couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/semen-donors/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<SemenDonor> partialUpdateSemenDonor(
        @PathVariable(value = "id", required = false) final String id,
        @RequestBody SemenDonor semenDonor
    ) throws URISyntaxException {
        log.debug("REST request to partial update SemenDonor partially : {}, {}", id, semenDonor);
        if (semenDonor.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, semenDonor.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!semenDonorRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<SemenDonor> result = semenDonorRepository
            .findById(semenDonor.getId())
            .map(existingSemenDonor -> {
                if (semenDonor.getProducing() != null) {
                    existingSemenDonor.setProducing(semenDonor.getProducing());
                }
                if (semenDonor.getLastModified() != null) {
                    existingSemenDonor.setLastModified(semenDonor.getLastModified());
                }

                return existingSemenDonor;
            })
            .map(semenDonorRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, semenDonor.getId())
        );
    }

    /**
     * {@code GET  /semen-donors} : get all the semenDonors.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of semenDonors in body.
     */
    @GetMapping("/semen-donors")
    public ResponseEntity<List<SemenDonor>> getAllSemenDonors(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of SemenDonors");
        Page<SemenDonor> page = semenDonorRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /semen-donors/:id} : get the "id" semenDonor.
     *
     * @param id the id of the semenDonor to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the semenDonor, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/semen-donors/{id}")
    public ResponseEntity<SemenDonor> getSemenDonor(@PathVariable String id) {
        log.debug("REST request to get SemenDonor : {}", id);
        Optional<SemenDonor> semenDonor = semenDonorRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(semenDonor);
    }

    /**
     * {@code DELETE  /semen-donors/:id} : delete the "id" semenDonor.
     *
     * @param id the id of the semenDonor to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/semen-donors/{id}")
    public ResponseEntity<Void> deleteSemenDonor(@PathVariable String id) {
        log.debug("REST request to delete SemenDonor : {}", id);
        semenDonorRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id)).build();
    }
}
