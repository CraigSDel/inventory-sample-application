package web.app.craigstroberg.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import web.app.craigstroberg.IntegrationTest;
import web.app.craigstroberg.domain.Breed;
import web.app.craigstroberg.repository.BreedRepository;

/**
 * Integration tests for the {@link BreedResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class BreedResourceIT {

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final Instant DEFAULT_DATE_ADDED = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE_ADDED = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_LAST_MODIFIED = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_LAST_MODIFIED = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/breeds";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private BreedRepository breedRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restBreedMockMvc;

    private Breed breed;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Breed createEntity(EntityManager em) {
        Breed breed = new Breed().description(DEFAULT_DESCRIPTION).dateAdded(DEFAULT_DATE_ADDED).lastModified(DEFAULT_LAST_MODIFIED);
        return breed;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Breed createUpdatedEntity(EntityManager em) {
        Breed breed = new Breed().description(UPDATED_DESCRIPTION).dateAdded(UPDATED_DATE_ADDED).lastModified(UPDATED_LAST_MODIFIED);
        return breed;
    }

    @BeforeEach
    public void initTest() {
        breed = createEntity(em);
    }

    @Test
    @Transactional
    void createBreed() throws Exception {
        int databaseSizeBeforeCreate = breedRepository.findAll().size();
        // Create the Breed
        restBreedMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(breed)))
            .andExpect(status().isCreated());

        // Validate the Breed in the database
        List<Breed> breedList = breedRepository.findAll();
        assertThat(breedList).hasSize(databaseSizeBeforeCreate + 1);
        Breed testBreed = breedList.get(breedList.size() - 1);
        assertThat(testBreed.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testBreed.getDateAdded()).isEqualTo(DEFAULT_DATE_ADDED);
        assertThat(testBreed.getLastModified()).isEqualTo(DEFAULT_LAST_MODIFIED);
    }

    @Test
    @Transactional
    void createBreedWithExistingId() throws Exception {
        // Create the Breed with an existing ID
        breed.setId("existing_id");

        int databaseSizeBeforeCreate = breedRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restBreedMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(breed)))
            .andExpect(status().isBadRequest());

        // Validate the Breed in the database
        List<Breed> breedList = breedRepository.findAll();
        assertThat(breedList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllBreeds() throws Exception {
        // Initialize the database
        breed.setId(UUID.randomUUID().toString());
        breedRepository.saveAndFlush(breed);

        // Get all the breedList
        restBreedMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(breed.getId())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].dateAdded").value(hasItem(DEFAULT_DATE_ADDED.toString())))
            .andExpect(jsonPath("$.[*].lastModified").value(hasItem(DEFAULT_LAST_MODIFIED.toString())));
    }

    @Test
    @Transactional
    void getBreed() throws Exception {
        // Initialize the database
        breed.setId(UUID.randomUUID().toString());
        breedRepository.saveAndFlush(breed);

        // Get the breed
        restBreedMockMvc
            .perform(get(ENTITY_API_URL_ID, breed.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(breed.getId()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.dateAdded").value(DEFAULT_DATE_ADDED.toString()))
            .andExpect(jsonPath("$.lastModified").value(DEFAULT_LAST_MODIFIED.toString()));
    }

    @Test
    @Transactional
    void getNonExistingBreed() throws Exception {
        // Get the breed
        restBreedMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewBreed() throws Exception {
        // Initialize the database
        breed.setId(UUID.randomUUID().toString());
        breedRepository.saveAndFlush(breed);

        int databaseSizeBeforeUpdate = breedRepository.findAll().size();

        // Update the breed
        Breed updatedBreed = breedRepository.findById(breed.getId()).get();
        // Disconnect from session so that the updates on updatedBreed are not directly saved in db
        em.detach(updatedBreed);
        updatedBreed.description(UPDATED_DESCRIPTION).dateAdded(UPDATED_DATE_ADDED).lastModified(UPDATED_LAST_MODIFIED);

        restBreedMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedBreed.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedBreed))
            )
            .andExpect(status().isOk());

        // Validate the Breed in the database
        List<Breed> breedList = breedRepository.findAll();
        assertThat(breedList).hasSize(databaseSizeBeforeUpdate);
        Breed testBreed = breedList.get(breedList.size() - 1);
        assertThat(testBreed.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testBreed.getDateAdded()).isEqualTo(UPDATED_DATE_ADDED);
        assertThat(testBreed.getLastModified()).isEqualTo(UPDATED_LAST_MODIFIED);
    }

    @Test
    @Transactional
    void putNonExistingBreed() throws Exception {
        int databaseSizeBeforeUpdate = breedRepository.findAll().size();
        breed.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBreedMockMvc
            .perform(
                put(ENTITY_API_URL_ID, breed.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(breed))
            )
            .andExpect(status().isBadRequest());

        // Validate the Breed in the database
        List<Breed> breedList = breedRepository.findAll();
        assertThat(breedList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchBreed() throws Exception {
        int databaseSizeBeforeUpdate = breedRepository.findAll().size();
        breed.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBreedMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(breed))
            )
            .andExpect(status().isBadRequest());

        // Validate the Breed in the database
        List<Breed> breedList = breedRepository.findAll();
        assertThat(breedList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamBreed() throws Exception {
        int databaseSizeBeforeUpdate = breedRepository.findAll().size();
        breed.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBreedMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(breed)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Breed in the database
        List<Breed> breedList = breedRepository.findAll();
        assertThat(breedList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateBreedWithPatch() throws Exception {
        // Initialize the database
        breed.setId(UUID.randomUUID().toString());
        breedRepository.saveAndFlush(breed);

        int databaseSizeBeforeUpdate = breedRepository.findAll().size();

        // Update the breed using partial update
        Breed partialUpdatedBreed = new Breed();
        partialUpdatedBreed.setId(breed.getId());

        partialUpdatedBreed.lastModified(UPDATED_LAST_MODIFIED);

        restBreedMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBreed.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBreed))
            )
            .andExpect(status().isOk());

        // Validate the Breed in the database
        List<Breed> breedList = breedRepository.findAll();
        assertThat(breedList).hasSize(databaseSizeBeforeUpdate);
        Breed testBreed = breedList.get(breedList.size() - 1);
        assertThat(testBreed.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testBreed.getDateAdded()).isEqualTo(DEFAULT_DATE_ADDED);
        assertThat(testBreed.getLastModified()).isEqualTo(UPDATED_LAST_MODIFIED);
    }

    @Test
    @Transactional
    void fullUpdateBreedWithPatch() throws Exception {
        // Initialize the database
        breed.setId(UUID.randomUUID().toString());
        breedRepository.saveAndFlush(breed);

        int databaseSizeBeforeUpdate = breedRepository.findAll().size();

        // Update the breed using partial update
        Breed partialUpdatedBreed = new Breed();
        partialUpdatedBreed.setId(breed.getId());

        partialUpdatedBreed.description(UPDATED_DESCRIPTION).dateAdded(UPDATED_DATE_ADDED).lastModified(UPDATED_LAST_MODIFIED);

        restBreedMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBreed.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBreed))
            )
            .andExpect(status().isOk());

        // Validate the Breed in the database
        List<Breed> breedList = breedRepository.findAll();
        assertThat(breedList).hasSize(databaseSizeBeforeUpdate);
        Breed testBreed = breedList.get(breedList.size() - 1);
        assertThat(testBreed.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testBreed.getDateAdded()).isEqualTo(UPDATED_DATE_ADDED);
        assertThat(testBreed.getLastModified()).isEqualTo(UPDATED_LAST_MODIFIED);
    }

    @Test
    @Transactional
    void patchNonExistingBreed() throws Exception {
        int databaseSizeBeforeUpdate = breedRepository.findAll().size();
        breed.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBreedMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, breed.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(breed))
            )
            .andExpect(status().isBadRequest());

        // Validate the Breed in the database
        List<Breed> breedList = breedRepository.findAll();
        assertThat(breedList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchBreed() throws Exception {
        int databaseSizeBeforeUpdate = breedRepository.findAll().size();
        breed.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBreedMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(breed))
            )
            .andExpect(status().isBadRequest());

        // Validate the Breed in the database
        List<Breed> breedList = breedRepository.findAll();
        assertThat(breedList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamBreed() throws Exception {
        int databaseSizeBeforeUpdate = breedRepository.findAll().size();
        breed.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBreedMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(breed)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Breed in the database
        List<Breed> breedList = breedRepository.findAll();
        assertThat(breedList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteBreed() throws Exception {
        // Initialize the database
        breed.setId(UUID.randomUUID().toString());
        breedRepository.saveAndFlush(breed);

        int databaseSizeBeforeDelete = breedRepository.findAll().size();

        // Delete the breed
        restBreedMockMvc
            .perform(delete(ENTITY_API_URL_ID, breed.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Breed> breedList = breedRepository.findAll();
        assertThat(breedList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
