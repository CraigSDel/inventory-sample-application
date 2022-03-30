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
import web.app.craigstroberg.domain.SemenDonor;
import web.app.craigstroberg.repository.SemenDonorRepository;

/**
 * Integration tests for the {@link SemenDonorResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class SemenDonorResourceIT {

    private static final Boolean DEFAULT_PRODUCING = false;
    private static final Boolean UPDATED_PRODUCING = true;

    private static final Instant DEFAULT_LAST_MODIFIED = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_LAST_MODIFIED = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/semen-donors";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private SemenDonorRepository semenDonorRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSemenDonorMockMvc;

    private SemenDonor semenDonor;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SemenDonor createEntity(EntityManager em) {
        SemenDonor semenDonor = new SemenDonor().producing(DEFAULT_PRODUCING).lastModified(DEFAULT_LAST_MODIFIED);
        return semenDonor;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SemenDonor createUpdatedEntity(EntityManager em) {
        SemenDonor semenDonor = new SemenDonor().producing(UPDATED_PRODUCING).lastModified(UPDATED_LAST_MODIFIED);
        return semenDonor;
    }

    @BeforeEach
    public void initTest() {
        semenDonor = createEntity(em);
    }

    @Test
    @Transactional
    void createSemenDonor() throws Exception {
        int databaseSizeBeforeCreate = semenDonorRepository.findAll().size();
        // Create the SemenDonor
        restSemenDonorMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(semenDonor)))
            .andExpect(status().isCreated());

        // Validate the SemenDonor in the database
        List<SemenDonor> semenDonorList = semenDonorRepository.findAll();
        assertThat(semenDonorList).hasSize(databaseSizeBeforeCreate + 1);
        SemenDonor testSemenDonor = semenDonorList.get(semenDonorList.size() - 1);
        assertThat(testSemenDonor.getProducing()).isEqualTo(DEFAULT_PRODUCING);
        assertThat(testSemenDonor.getLastModified()).isEqualTo(DEFAULT_LAST_MODIFIED);
    }

    @Test
    @Transactional
    void createSemenDonorWithExistingId() throws Exception {
        // Create the SemenDonor with an existing ID
        semenDonor.setId("existing_id");

        int databaseSizeBeforeCreate = semenDonorRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSemenDonorMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(semenDonor)))
            .andExpect(status().isBadRequest());

        // Validate the SemenDonor in the database
        List<SemenDonor> semenDonorList = semenDonorRepository.findAll();
        assertThat(semenDonorList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllSemenDonors() throws Exception {
        // Initialize the database
        semenDonor.setId(UUID.randomUUID().toString());
        semenDonorRepository.saveAndFlush(semenDonor);

        // Get all the semenDonorList
        restSemenDonorMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(semenDonor.getId())))
            .andExpect(jsonPath("$.[*].producing").value(hasItem(DEFAULT_PRODUCING.booleanValue())))
            .andExpect(jsonPath("$.[*].lastModified").value(hasItem(DEFAULT_LAST_MODIFIED.toString())));
    }

    @Test
    @Transactional
    void getSemenDonor() throws Exception {
        // Initialize the database
        semenDonor.setId(UUID.randomUUID().toString());
        semenDonorRepository.saveAndFlush(semenDonor);

        // Get the semenDonor
        restSemenDonorMockMvc
            .perform(get(ENTITY_API_URL_ID, semenDonor.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(semenDonor.getId()))
            .andExpect(jsonPath("$.producing").value(DEFAULT_PRODUCING.booleanValue()))
            .andExpect(jsonPath("$.lastModified").value(DEFAULT_LAST_MODIFIED.toString()));
    }

    @Test
    @Transactional
    void getNonExistingSemenDonor() throws Exception {
        // Get the semenDonor
        restSemenDonorMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewSemenDonor() throws Exception {
        // Initialize the database
        semenDonor.setId(UUID.randomUUID().toString());
        semenDonorRepository.saveAndFlush(semenDonor);

        int databaseSizeBeforeUpdate = semenDonorRepository.findAll().size();

        // Update the semenDonor
        SemenDonor updatedSemenDonor = semenDonorRepository.findById(semenDonor.getId()).get();
        // Disconnect from session so that the updates on updatedSemenDonor are not directly saved in db
        em.detach(updatedSemenDonor);
        updatedSemenDonor.producing(UPDATED_PRODUCING).lastModified(UPDATED_LAST_MODIFIED);

        restSemenDonorMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedSemenDonor.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedSemenDonor))
            )
            .andExpect(status().isOk());

        // Validate the SemenDonor in the database
        List<SemenDonor> semenDonorList = semenDonorRepository.findAll();
        assertThat(semenDonorList).hasSize(databaseSizeBeforeUpdate);
        SemenDonor testSemenDonor = semenDonorList.get(semenDonorList.size() - 1);
        assertThat(testSemenDonor.getProducing()).isEqualTo(UPDATED_PRODUCING);
        assertThat(testSemenDonor.getLastModified()).isEqualTo(UPDATED_LAST_MODIFIED);
    }

    @Test
    @Transactional
    void putNonExistingSemenDonor() throws Exception {
        int databaseSizeBeforeUpdate = semenDonorRepository.findAll().size();
        semenDonor.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSemenDonorMockMvc
            .perform(
                put(ENTITY_API_URL_ID, semenDonor.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(semenDonor))
            )
            .andExpect(status().isBadRequest());

        // Validate the SemenDonor in the database
        List<SemenDonor> semenDonorList = semenDonorRepository.findAll();
        assertThat(semenDonorList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchSemenDonor() throws Exception {
        int databaseSizeBeforeUpdate = semenDonorRepository.findAll().size();
        semenDonor.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSemenDonorMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(semenDonor))
            )
            .andExpect(status().isBadRequest());

        // Validate the SemenDonor in the database
        List<SemenDonor> semenDonorList = semenDonorRepository.findAll();
        assertThat(semenDonorList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamSemenDonor() throws Exception {
        int databaseSizeBeforeUpdate = semenDonorRepository.findAll().size();
        semenDonor.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSemenDonorMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(semenDonor)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the SemenDonor in the database
        List<SemenDonor> semenDonorList = semenDonorRepository.findAll();
        assertThat(semenDonorList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateSemenDonorWithPatch() throws Exception {
        // Initialize the database
        semenDonor.setId(UUID.randomUUID().toString());
        semenDonorRepository.saveAndFlush(semenDonor);

        int databaseSizeBeforeUpdate = semenDonorRepository.findAll().size();

        // Update the semenDonor using partial update
        SemenDonor partialUpdatedSemenDonor = new SemenDonor();
        partialUpdatedSemenDonor.setId(semenDonor.getId());

        restSemenDonorMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSemenDonor.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSemenDonor))
            )
            .andExpect(status().isOk());

        // Validate the SemenDonor in the database
        List<SemenDonor> semenDonorList = semenDonorRepository.findAll();
        assertThat(semenDonorList).hasSize(databaseSizeBeforeUpdate);
        SemenDonor testSemenDonor = semenDonorList.get(semenDonorList.size() - 1);
        assertThat(testSemenDonor.getProducing()).isEqualTo(DEFAULT_PRODUCING);
        assertThat(testSemenDonor.getLastModified()).isEqualTo(DEFAULT_LAST_MODIFIED);
    }

    @Test
    @Transactional
    void fullUpdateSemenDonorWithPatch() throws Exception {
        // Initialize the database
        semenDonor.setId(UUID.randomUUID().toString());
        semenDonorRepository.saveAndFlush(semenDonor);

        int databaseSizeBeforeUpdate = semenDonorRepository.findAll().size();

        // Update the semenDonor using partial update
        SemenDonor partialUpdatedSemenDonor = new SemenDonor();
        partialUpdatedSemenDonor.setId(semenDonor.getId());

        partialUpdatedSemenDonor.producing(UPDATED_PRODUCING).lastModified(UPDATED_LAST_MODIFIED);

        restSemenDonorMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSemenDonor.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSemenDonor))
            )
            .andExpect(status().isOk());

        // Validate the SemenDonor in the database
        List<SemenDonor> semenDonorList = semenDonorRepository.findAll();
        assertThat(semenDonorList).hasSize(databaseSizeBeforeUpdate);
        SemenDonor testSemenDonor = semenDonorList.get(semenDonorList.size() - 1);
        assertThat(testSemenDonor.getProducing()).isEqualTo(UPDATED_PRODUCING);
        assertThat(testSemenDonor.getLastModified()).isEqualTo(UPDATED_LAST_MODIFIED);
    }

    @Test
    @Transactional
    void patchNonExistingSemenDonor() throws Exception {
        int databaseSizeBeforeUpdate = semenDonorRepository.findAll().size();
        semenDonor.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSemenDonorMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, semenDonor.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(semenDonor))
            )
            .andExpect(status().isBadRequest());

        // Validate the SemenDonor in the database
        List<SemenDonor> semenDonorList = semenDonorRepository.findAll();
        assertThat(semenDonorList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchSemenDonor() throws Exception {
        int databaseSizeBeforeUpdate = semenDonorRepository.findAll().size();
        semenDonor.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSemenDonorMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(semenDonor))
            )
            .andExpect(status().isBadRequest());

        // Validate the SemenDonor in the database
        List<SemenDonor> semenDonorList = semenDonorRepository.findAll();
        assertThat(semenDonorList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamSemenDonor() throws Exception {
        int databaseSizeBeforeUpdate = semenDonorRepository.findAll().size();
        semenDonor.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSemenDonorMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(semenDonor))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the SemenDonor in the database
        List<SemenDonor> semenDonorList = semenDonorRepository.findAll();
        assertThat(semenDonorList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteSemenDonor() throws Exception {
        // Initialize the database
        semenDonor.setId(UUID.randomUUID().toString());
        semenDonorRepository.saveAndFlush(semenDonor);

        int databaseSizeBeforeDelete = semenDonorRepository.findAll().size();

        // Delete the semenDonor
        restSemenDonorMockMvc
            .perform(delete(ENTITY_API_URL_ID, semenDonor.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<SemenDonor> semenDonorList = semenDonorRepository.findAll();
        assertThat(semenDonorList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
