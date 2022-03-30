package web.app.craigstroberg.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;
import web.app.craigstroberg.domain.Breed;
import web.app.craigstroberg.repository.BreedRepository;
import web.app.craigstroberg.web.rest.errors.BadRequestAlertException;

/**
 * REST controller for managing {@link web.app.craigstroberg.domain.Breed}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class BreedResource {

    private final Logger log = LoggerFactory.getLogger(BreedResource.class);

    private static final String ENTITY_NAME = "breed";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final BreedRepository breedRepository;

    public BreedResource(BreedRepository breedRepository) {
        this.breedRepository = breedRepository;
    }

    /**
     * {@code POST  /breeds} : Create a new breed.
     *
     * @param breed the breed to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new breed, or with status {@code 400 (Bad Request)} if the breed has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/breeds")
    public ResponseEntity<Breed> createBreed(@RequestBody Breed breed) throws URISyntaxException {
        log.debug("REST request to save Breed : {}", breed);
        if (breed.getId() != null) {
            throw new BadRequestAlertException("A new breed cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Breed result = breedRepository.save(breed);
        return ResponseEntity
            .created(new URI("/api/breeds/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId()))
            .body(result);
    }

    /**
     * {@code PUT  /breeds/:id} : Updates an existing breed.
     *
     * @param id the id of the breed to save.
     * @param breed the breed to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated breed,
     * or with status {@code 400 (Bad Request)} if the breed is not valid,
     * or with status {@code 500 (Internal Server Error)} if the breed couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/breeds/{id}")
    public ResponseEntity<Breed> updateBreed(@PathVariable(value = "id", required = false) final String id, @RequestBody Breed breed)
        throws URISyntaxException {
        log.debug("REST request to update Breed : {}, {}", id, breed);
        if (breed.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, breed.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!breedRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Breed result = breedRepository.save(breed);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, breed.getId()))
            .body(result);
    }

    /**
     * {@code PATCH  /breeds/:id} : Partial updates given fields of an existing breed, field will ignore if it is null
     *
     * @param id the id of the breed to save.
     * @param breed the breed to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated breed,
     * or with status {@code 400 (Bad Request)} if the breed is not valid,
     * or with status {@code 404 (Not Found)} if the breed is not found,
     * or with status {@code 500 (Internal Server Error)} if the breed couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/breeds/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Breed> partialUpdateBreed(
        @PathVariable(value = "id", required = false) final String id,
        @RequestBody Breed breed
    ) throws URISyntaxException {
        log.debug("REST request to partial update Breed partially : {}, {}", id, breed);
        if (breed.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, breed.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!breedRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Breed> result = breedRepository
            .findById(breed.getId())
            .map(existingBreed -> {
                if (breed.getDescription() != null) {
                    existingBreed.setDescription(breed.getDescription());
                }
                if (breed.getDateAdded() != null) {
                    existingBreed.setDateAdded(breed.getDateAdded());
                }
                if (breed.getLastModified() != null) {
                    existingBreed.setLastModified(breed.getLastModified());
                }

                return existingBreed;
            })
            .map(breedRepository::save);

        return ResponseUtil.wrapOrNotFound(result, HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, breed.getId()));
    }

    /**
     * {@code GET  /breeds} : get all the breeds.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of breeds in body.
     */
    @GetMapping("/breeds")
    public List<Breed> getAllBreeds() {
        log.debug("REST request to get all Breeds");
        return breedRepository.findAll();
    }

    /**
     * {@code GET  /breeds/:id} : get the "id" breed.
     *
     * @param id the id of the breed to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the breed, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/breeds/{id}")
    public ResponseEntity<Breed> getBreed(@PathVariable String id) {
        log.debug("REST request to get Breed : {}", id);
        Optional<Breed> breed = breedRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(breed);
    }

    /**
     * {@code DELETE  /breeds/:id} : delete the "id" breed.
     *
     * @param id the id of the breed to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/breeds/{id}")
    public ResponseEntity<Void> deleteBreed(@PathVariable String id) {
        log.debug("REST request to delete Breed : {}", id);
        breedRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id)).build();
    }
}
