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
import web.app.craigstroberg.domain.Semen;
import web.app.craigstroberg.domain.enumeration.SemenStatus;
import web.app.craigstroberg.repository.SemenRepository;

/**
 * Integration tests for the {@link SemenResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class SemenResourceIT {

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final Instant DEFAULT_RECEIVED_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_RECEIVED_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final SemenStatus DEFAULT_STATUS = SemenStatus.AVAILABLE;
    private static final SemenStatus UPDATED_STATUS = SemenStatus.USED;

    private static final Instant DEFAULT_DATE_ADDED = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE_ADDED = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_LAST_MODIFIED = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_LAST_MODIFIED = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/semen";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private SemenRepository semenRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSemenMockMvc;

    private Semen semen;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Semen createEntity(EntityManager em) {
        Semen semen = new Semen()
            .description(DEFAULT_DESCRIPTION)
            .receivedDate(DEFAULT_RECEIVED_DATE)
            .status(DEFAULT_STATUS)
            .dateAdded(DEFAULT_DATE_ADDED)
            .lastModified(DEFAULT_LAST_MODIFIED);
        return semen;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Semen createUpdatedEntity(EntityManager em) {
        Semen semen = new Semen()
            .description(UPDATED_DESCRIPTION)
            .receivedDate(UPDATED_RECEIVED_DATE)
            .status(UPDATED_STATUS)
            .dateAdded(UPDATED_DATE_ADDED)
            .lastModified(UPDATED_LAST_MODIFIED);
        return semen;
    }

    @BeforeEach
    public void initTest() {
        semen = createEntity(em);
    }

    @Test
    @Transactional
    void createSemen() throws Exception {
        int databaseSizeBeforeCreate = semenRepository.findAll().size();
        // Create the Semen
        restSemenMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(semen)))
            .andExpect(status().isCreated());

        // Validate the Semen in the database
        List<Semen> semenList = semenRepository.findAll();
        assertThat(semenList).hasSize(databaseSizeBeforeCreate + 1);
        Semen testSemen = semenList.get(semenList.size() - 1);
        assertThat(testSemen.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testSemen.getReceivedDate()).isEqualTo(DEFAULT_RECEIVED_DATE);
        assertThat(testSemen.getStatus()).isEqualTo(DEFAULT_STATUS);
        assertThat(testSemen.getDateAdded()).isEqualTo(DEFAULT_DATE_ADDED);
        assertThat(testSemen.getLastModified()).isEqualTo(DEFAULT_LAST_MODIFIED);
    }

    @Test
    @Transactional
    void createSemenWithExistingId() throws Exception {
        // Create the Semen with an existing ID
        semen.setId("existing_id");

        int databaseSizeBeforeCreate = semenRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSemenMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(semen)))
            .andExpect(status().isBadRequest());

        // Validate the Semen in the database
        List<Semen> semenList = semenRepository.findAll();
        assertThat(semenList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllSemen() throws Exception {
        // Initialize the database
        semen.setId(UUID.randomUUID().toString());
        semenRepository.saveAndFlush(semen);

        // Get all the semenList
        restSemenMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(semen.getId())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].receivedDate").value(hasItem(DEFAULT_RECEIVED_DATE.toString())))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())))
            .andExpect(jsonPath("$.[*].dateAdded").value(hasItem(DEFAULT_DATE_ADDED.toString())))
            .andExpect(jsonPath("$.[*].lastModified").value(hasItem(DEFAULT_LAST_MODIFIED.toString())));
    }

    @Test
    @Transactional
    void getSemen() throws Exception {
        // Initialize the database
        semen.setId(UUID.randomUUID().toString());
        semenRepository.saveAndFlush(semen);

        // Get the semen
        restSemenMockMvc
            .perform(get(ENTITY_API_URL_ID, semen.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(semen.getId()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.receivedDate").value(DEFAULT_RECEIVED_DATE.toString()))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS.toString()))
            .andExpect(jsonPath("$.dateAdded").value(DEFAULT_DATE_ADDED.toString()))
            .andExpect(jsonPath("$.lastModified").value(DEFAULT_LAST_MODIFIED.toString()));
    }

    @Test
    @Transactional
    void getNonExistingSemen() throws Exception {
        // Get the semen
        restSemenMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewSemen() throws Exception {
        // Initialize the database
        semen.setId(UUID.randomUUID().toString());
        semenRepository.saveAndFlush(semen);

        int databaseSizeBeforeUpdate = semenRepository.findAll().size();

        // Update the semen
        Semen updatedSemen = semenRepository.findById(semen.getId()).get();
        // Disconnect from session so that the updates on updatedSemen are not directly saved in db
        em.detach(updatedSemen);
        updatedSemen
            .description(UPDATED_DESCRIPTION)
            .receivedDate(UPDATED_RECEIVED_DATE)
            .status(UPDATED_STATUS)
            .dateAdded(UPDATED_DATE_ADDED)
            .lastModified(UPDATED_LAST_MODIFIED);

        restSemenMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedSemen.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedSemen))
            )
            .andExpect(status().isOk());

        // Validate the Semen in the database
        List<Semen> semenList = semenRepository.findAll();
        assertThat(semenList).hasSize(databaseSizeBeforeUpdate);
        Semen testSemen = semenList.get(semenList.size() - 1);
        assertThat(testSemen.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testSemen.getReceivedDate()).isEqualTo(UPDATED_RECEIVED_DATE);
        assertThat(testSemen.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testSemen.getDateAdded()).isEqualTo(UPDATED_DATE_ADDED);
        assertThat(testSemen.getLastModified()).isEqualTo(UPDATED_LAST_MODIFIED);
    }

    @Test
    @Transactional
    void putNonExistingSemen() throws Exception {
        int databaseSizeBeforeUpdate = semenRepository.findAll().size();
        semen.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSemenMockMvc
            .perform(
                put(ENTITY_API_URL_ID, semen.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(semen))
            )
            .andExpect(status().isBadRequest());

        // Validate the Semen in the database
        List<Semen> semenList = semenRepository.findAll();
        assertThat(semenList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchSemen() throws Exception {
        int databaseSizeBeforeUpdate = semenRepository.findAll().size();
        semen.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSemenMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(semen))
            )
            .andExpect(status().isBadRequest());

        // Validate the Semen in the database
        List<Semen> semenList = semenRepository.findAll();
        assertThat(semenList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamSemen() throws Exception {
        int databaseSizeBeforeUpdate = semenRepository.findAll().size();
        semen.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSemenMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(semen)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Semen in the database
        List<Semen> semenList = semenRepository.findAll();
        assertThat(semenList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateSemenWithPatch() throws Exception {
        // Initialize the database
        semen.setId(UUID.randomUUID().toString());
        semenRepository.saveAndFlush(semen);

        int databaseSizeBeforeUpdate = semenRepository.findAll().size();

        // Update the semen using partial update
        Semen partialUpdatedSemen = new Semen();
        partialUpdatedSemen.setId(semen.getId());

        partialUpdatedSemen
            .description(UPDATED_DESCRIPTION)
            .receivedDate(UPDATED_RECEIVED_DATE)
            .status(UPDATED_STATUS)
            .dateAdded(UPDATED_DATE_ADDED)
            .lastModified(UPDATED_LAST_MODIFIED);

        restSemenMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSemen.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSemen))
            )
            .andExpect(status().isOk());

        // Validate the Semen in the database
        List<Semen> semenList = semenRepository.findAll();
        assertThat(semenList).hasSize(databaseSizeBeforeUpdate);
        Semen testSemen = semenList.get(semenList.size() - 1);
        assertThat(testSemen.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testSemen.getReceivedDate()).isEqualTo(UPDATED_RECEIVED_DATE);
        assertThat(testSemen.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testSemen.getDateAdded()).isEqualTo(UPDATED_DATE_ADDED);
        assertThat(testSemen.getLastModified()).isEqualTo(UPDATED_LAST_MODIFIED);
    }

    @Test
    @Transactional
    void fullUpdateSemenWithPatch() throws Exception {
        // Initialize the database
        semen.setId(UUID.randomUUID().toString());
        semenRepository.saveAndFlush(semen);

        int databaseSizeBeforeUpdate = semenRepository.findAll().size();

        // Update the semen using partial update
        Semen partialUpdatedSemen = new Semen();
        partialUpdatedSemen.setId(semen.getId());

        partialUpdatedSemen
            .description(UPDATED_DESCRIPTION)
            .receivedDate(UPDATED_RECEIVED_DATE)
            .status(UPDATED_STATUS)
            .dateAdded(UPDATED_DATE_ADDED)
            .lastModified(UPDATED_LAST_MODIFIED);

        restSemenMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSemen.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSemen))
            )
            .andExpect(status().isOk());

        // Validate the Semen in the database
        List<Semen> semenList = semenRepository.findAll();
        assertThat(semenList).hasSize(databaseSizeBeforeUpdate);
        Semen testSemen = semenList.get(semenList.size() - 1);
        assertThat(testSemen.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testSemen.getReceivedDate()).isEqualTo(UPDATED_RECEIVED_DATE);
        assertThat(testSemen.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testSemen.getDateAdded()).isEqualTo(UPDATED_DATE_ADDED);
        assertThat(testSemen.getLastModified()).isEqualTo(UPDATED_LAST_MODIFIED);
    }

    @Test
    @Transactional
    void patchNonExistingSemen() throws Exception {
        int databaseSizeBeforeUpdate = semenRepository.findAll().size();
        semen.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSemenMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, semen.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(semen))
            )
            .andExpect(status().isBadRequest());

        // Validate the Semen in the database
        List<Semen> semenList = semenRepository.findAll();
        assertThat(semenList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchSemen() throws Exception {
        int databaseSizeBeforeUpdate = semenRepository.findAll().size();
        semen.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSemenMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(semen))
            )
            .andExpect(status().isBadRequest());

        // Validate the Semen in the database
        List<Semen> semenList = semenRepository.findAll();
        assertThat(semenList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamSemen() throws Exception {
        int databaseSizeBeforeUpdate = semenRepository.findAll().size();
        semen.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSemenMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(semen)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Semen in the database
        List<Semen> semenList = semenRepository.findAll();
        assertThat(semenList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteSemen() throws Exception {
        // Initialize the database
        semen.setId(UUID.randomUUID().toString());
        semenRepository.saveAndFlush(semen);

        int databaseSizeBeforeDelete = semenRepository.findAll().size();

        // Delete the semen
        restSemenMockMvc
            .perform(delete(ENTITY_API_URL_ID, semen.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Semen> semenList = semenRepository.findAll();
        assertThat(semenList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
