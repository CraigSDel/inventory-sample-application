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
import web.app.craigstroberg.domain.Farm;
import web.app.craigstroberg.repository.FarmRepository;
import web.app.craigstroberg.web.rest.errors.BadRequestAlertException;

/**
 * REST controller for managing {@link web.app.craigstroberg.domain.Farm}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class FarmResource {

    private final Logger log = LoggerFactory.getLogger(FarmResource.class);

    private static final String ENTITY_NAME = "farm";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final FarmRepository farmRepository;

    public FarmResource(FarmRepository farmRepository) {
        this.farmRepository = farmRepository;
    }

    /**
     * {@code POST  /farms} : Create a new farm.
     *
     * @param farm the farm to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new farm, or with status {@code 400 (Bad Request)} if the farm has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/farms")
    public ResponseEntity<Farm> createFarm(@RequestBody Farm farm) throws URISyntaxException {
        log.debug("REST request to save Farm : {}", farm);
        if (farm.getId() != null) {
            throw new BadRequestAlertException("A new farm cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Farm result = farmRepository.save(farm);
        return ResponseEntity
            .created(new URI("/api/farms/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId()))
            .body(result);
    }

    /**
     * {@code PUT  /farms/:id} : Updates an existing farm.
     *
     * @param id the id of the farm to save.
     * @param farm the farm to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated farm,
     * or with status {@code 400 (Bad Request)} if the farm is not valid,
     * or with status {@code 500 (Internal Server Error)} if the farm couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/farms/{id}")
    public ResponseEntity<Farm> updateFarm(@PathVariable(value = "id", required = false) final String id, @RequestBody Farm farm)
        throws URISyntaxException {
        log.debug("REST request to update Farm : {}, {}", id, farm);
        if (farm.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, farm.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!farmRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Farm result = farmRepository.save(farm);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, farm.getId()))
            .body(result);
    }

    /**
     * {@code PATCH  /farms/:id} : Partial updates given fields of an existing farm, field will ignore if it is null
     *
     * @param id the id of the farm to save.
     * @param farm the farm to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated farm,
     * or with status {@code 400 (Bad Request)} if the farm is not valid,
     * or with status {@code 404 (Not Found)} if the farm is not found,
     * or with status {@code 500 (Internal Server Error)} if the farm couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/farms/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Farm> partialUpdateFarm(@PathVariable(value = "id", required = false) final String id, @RequestBody Farm farm)
        throws URISyntaxException {
        log.debug("REST request to partial update Farm partially : {}, {}", id, farm);
        if (farm.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, farm.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!farmRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Farm> result = farmRepository
            .findById(farm.getId())
            .map(existingFarm -> {
                if (farm.getName() != null) {
                    existingFarm.setName(farm.getName());
                }
                if (farm.getDescription() != null) {
                    existingFarm.setDescription(farm.getDescription());
                }
                if (farm.getDateAdded() != null) {
                    existingFarm.setDateAdded(farm.getDateAdded());
                }
                if (farm.getLastModified() != null) {
                    existingFarm.setLastModified(farm.getLastModified());
                }

                return existingFarm;
            })
            .map(farmRepository::save);

        return ResponseUtil.wrapOrNotFound(result, HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, farm.getId()));
    }

    /**
     * {@code GET  /farms} : get all the farms.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of farms in body.
     */
    @GetMapping("/farms")
    public ResponseEntity<List<Farm>> getAllFarms(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of Farms");
        Page<Farm> page = farmRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /farms/:id} : get the "id" farm.
     *
     * @param id the id of the farm to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the farm, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/farms/{id}")
    public ResponseEntity<Farm> getFarm(@PathVariable String id) {
        log.debug("REST request to get Farm : {}", id);
        Optional<Farm> farm = farmRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(farm);
    }

    /**
     * {@code DELETE  /farms/:id} : delete the "id" farm.
     *
     * @param id the id of the farm to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/farms/{id}")
    public ResponseEntity<Void> deleteFarm(@PathVariable String id) {
        log.debug("REST request to delete Farm : {}", id);
        farmRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id)).build();
    }
}
