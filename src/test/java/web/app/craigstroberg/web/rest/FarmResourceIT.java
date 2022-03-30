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
import web.app.craigstroberg.domain.Farm;
import web.app.craigstroberg.repository.FarmRepository;

/**
 * Integration tests for the {@link FarmResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class FarmResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final Instant DEFAULT_DATE_ADDED = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE_ADDED = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_LAST_MODIFIED = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_LAST_MODIFIED = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/farms";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private FarmRepository farmRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restFarmMockMvc;

    private Farm farm;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Farm createEntity(EntityManager em) {
        Farm farm = new Farm().name(DEFAULT_NAME).dateAdded(DEFAULT_DATE_ADDED).lastModified(DEFAULT_LAST_MODIFIED);
        return farm;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Farm createUpdatedEntity(EntityManager em) {
        Farm farm = new Farm().name(UPDATED_NAME).dateAdded(UPDATED_DATE_ADDED).lastModified(UPDATED_LAST_MODIFIED);
        return farm;
    }

    @BeforeEach
    public void initTest() {
        farm = createEntity(em);
    }

    @Test
    @Transactional
    void createFarm() throws Exception {
        int databaseSizeBeforeCreate = farmRepository.findAll().size();
        // Create the Farm
        restFarmMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(farm)))
            .andExpect(status().isCreated());

        // Validate the Farm in the database
        List<Farm> farmList = farmRepository.findAll();
        assertThat(farmList).hasSize(databaseSizeBeforeCreate + 1);
        Farm testFarm = farmList.get(farmList.size() - 1);
        assertThat(testFarm.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testFarm.getDateAdded()).isEqualTo(DEFAULT_DATE_ADDED);
        assertThat(testFarm.getLastModified()).isEqualTo(DEFAULT_LAST_MODIFIED);
    }

    @Test
    @Transactional
    void createFarmWithExistingId() throws Exception {
        // Create the Farm with an existing ID
        farm.setId("existing_id");

        int databaseSizeBeforeCreate = farmRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restFarmMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(farm)))
            .andExpect(status().isBadRequest());

        // Validate the Farm in the database
        List<Farm> farmList = farmRepository.findAll();
        assertThat(farmList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllFarms() throws Exception {
        // Initialize the database
        farm.setId(UUID.randomUUID().toString());
        farmRepository.saveAndFlush(farm);

        // Get all the farmList
        restFarmMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(farm.getId())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].dateAdded").value(hasItem(DEFAULT_DATE_ADDED.toString())))
            .andExpect(jsonPath("$.[*].lastModified").value(hasItem(DEFAULT_LAST_MODIFIED.toString())));
    }

    @Test
    @Transactional
    void getFarm() throws Exception {
        // Initialize the database
        farm.setId(UUID.randomUUID().toString());
        farmRepository.saveAndFlush(farm);

        // Get the farm
        restFarmMockMvc
            .perform(get(ENTITY_API_URL_ID, farm.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(farm.getId()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.dateAdded").value(DEFAULT_DATE_ADDED.toString()))
            .andExpect(jsonPath("$.lastModified").value(DEFAULT_LAST_MODIFIED.toString()));
    }

    @Test
    @Transactional
    void getNonExistingFarm() throws Exception {
        // Get the farm
        restFarmMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewFarm() throws Exception {
        // Initialize the database
        farm.setId(UUID.randomUUID().toString());
        farmRepository.saveAndFlush(farm);

        int databaseSizeBeforeUpdate = farmRepository.findAll().size();

        // Update the farm
        Farm updatedFarm = farmRepository.findById(farm.getId()).get();
        // Disconnect from session so that the updates on updatedFarm are not directly saved in db
        em.detach(updatedFarm);
        updatedFarm.name(UPDATED_NAME).dateAdded(UPDATED_DATE_ADDED).lastModified(UPDATED_LAST_MODIFIED);

        restFarmMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedFarm.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedFarm))
            )
            .andExpect(status().isOk());

        // Validate the Farm in the database
        List<Farm> farmList = farmRepository.findAll();
        assertThat(farmList).hasSize(databaseSizeBeforeUpdate);
        Farm testFarm = farmList.get(farmList.size() - 1);
        assertThat(testFarm.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testFarm.getDateAdded()).isEqualTo(UPDATED_DATE_ADDED);
        assertThat(testFarm.getLastModified()).isEqualTo(UPDATED_LAST_MODIFIED);
    }

    @Test
    @Transactional
    void putNonExistingFarm() throws Exception {
        int databaseSizeBeforeUpdate = farmRepository.findAll().size();
        farm.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFarmMockMvc
            .perform(
                put(ENTITY_API_URL_ID, farm.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(farm))
            )
            .andExpect(status().isBadRequest());

        // Validate the Farm in the database
        List<Farm> farmList = farmRepository.findAll();
        assertThat(farmList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchFarm() throws Exception {
        int databaseSizeBeforeUpdate = farmRepository.findAll().size();
        farm.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFarmMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(farm))
            )
            .andExpect(status().isBadRequest());

        // Validate the Farm in the database
        List<Farm> farmList = farmRepository.findAll();
        assertThat(farmList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamFarm() throws Exception {
        int databaseSizeBeforeUpdate = farmRepository.findAll().size();
        farm.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFarmMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(farm)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Farm in the database
        List<Farm> farmList = farmRepository.findAll();
        assertThat(farmList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateFarmWithPatch() throws Exception {
        // Initialize the database
        farm.setId(UUID.randomUUID().toString());
        farmRepository.saveAndFlush(farm);

        int databaseSizeBeforeUpdate = farmRepository.findAll().size();

        // Update the farm using partial update
        Farm partialUpdatedFarm = new Farm();
        partialUpdatedFarm.setId(farm.getId());

        partialUpdatedFarm.dateAdded(UPDATED_DATE_ADDED).lastModified(UPDATED_LAST_MODIFIED);

        restFarmMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFarm.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFarm))
            )
            .andExpect(status().isOk());

        // Validate the Farm in the database
        List<Farm> farmList = farmRepository.findAll();
        assertThat(farmList).hasSize(databaseSizeBeforeUpdate);
        Farm testFarm = farmList.get(farmList.size() - 1);
        assertThat(testFarm.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testFarm.getDateAdded()).isEqualTo(UPDATED_DATE_ADDED);
        assertThat(testFarm.getLastModified()).isEqualTo(UPDATED_LAST_MODIFIED);
    }

    @Test
    @Transactional
    void fullUpdateFarmWithPatch() throws Exception {
        // Initialize the database
        farm.setId(UUID.randomUUID().toString());
        farmRepository.saveAndFlush(farm);

        int databaseSizeBeforeUpdate = farmRepository.findAll().size();

        // Update the farm using partial update
        Farm partialUpdatedFarm = new Farm();
        partialUpdatedFarm.setId(farm.getId());

        partialUpdatedFarm.name(UPDATED_NAME).dateAdded(UPDATED_DATE_ADDED).lastModified(UPDATED_LAST_MODIFIED);

        restFarmMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFarm.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFarm))
            )
            .andExpect(status().isOk());

        // Validate the Farm in the database
        List<Farm> farmList = farmRepository.findAll();
        assertThat(farmList).hasSize(databaseSizeBeforeUpdate);
        Farm testFarm = farmList.get(farmList.size() - 1);
        assertThat(testFarm.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testFarm.getDateAdded()).isEqualTo(UPDATED_DATE_ADDED);
        assertThat(testFarm.getLastModified()).isEqualTo(UPDATED_LAST_MODIFIED);
    }

    @Test
    @Transactional
    void patchNonExistingFarm() throws Exception {
        int databaseSizeBeforeUpdate = farmRepository.findAll().size();
        farm.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFarmMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, farm.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(farm))
            )
            .andExpect(status().isBadRequest());

        // Validate the Farm in the database
        List<Farm> farmList = farmRepository.findAll();
        assertThat(farmList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchFarm() throws Exception {
        int databaseSizeBeforeUpdate = farmRepository.findAll().size();
        farm.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFarmMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(farm))
            )
            .andExpect(status().isBadRequest());

        // Validate the Farm in the database
        List<Farm> farmList = farmRepository.findAll();
        assertThat(farmList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamFarm() throws Exception {
        int databaseSizeBeforeUpdate = farmRepository.findAll().size();
        farm.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFarmMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(farm)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Farm in the database
        List<Farm> farmList = farmRepository.findAll();
        assertThat(farmList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteFarm() throws Exception {
        // Initialize the database
        farm.setId(UUID.randomUUID().toString());
        farmRepository.saveAndFlush(farm);

        int databaseSizeBeforeDelete = farmRepository.findAll().size();

        // Delete the farm
        restFarmMockMvc
            .perform(delete(ENTITY_API_URL_ID, farm.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Farm> farmList = farmRepository.findAll();
        assertThat(farmList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
