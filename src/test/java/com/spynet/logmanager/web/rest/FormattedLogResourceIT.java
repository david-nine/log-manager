package com.spynet.logmanager.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.spynet.logmanager.IntegrationTest;
import com.spynet.logmanager.domain.FormattedLog;
import com.spynet.logmanager.repository.FormattedLogRepository;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link FormattedLogResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class FormattedLogResourceIT {

    private static final String DEFAULT_HOSTNAME = "AAAAAAAAAA";
    private static final String UPDATED_HOSTNAME = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_START_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_START_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_END_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_END_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final Instant DEFAULT_START_HOUR = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_START_HOUR = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_END_HOUR = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_END_HOUR = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/formatted-logs";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private FormattedLogRepository formattedLogRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restFormattedLogMockMvc;

    private FormattedLog formattedLog;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static FormattedLog createEntity(EntityManager em) {
        FormattedLog formattedLog = new FormattedLog()
            .hostname(DEFAULT_HOSTNAME)
            .startDate(DEFAULT_START_DATE)
            .endDate(DEFAULT_END_DATE)
            .startHour(DEFAULT_START_HOUR)
            .endHour(DEFAULT_END_HOUR);
        return formattedLog;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static FormattedLog createUpdatedEntity(EntityManager em) {
        FormattedLog formattedLog = new FormattedLog()
            .hostname(UPDATED_HOSTNAME)
            .startDate(UPDATED_START_DATE)
            .endDate(UPDATED_END_DATE)
            .startHour(UPDATED_START_HOUR)
            .endHour(UPDATED_END_HOUR);
        return formattedLog;
    }

    @BeforeEach
    public void initTest() {
        formattedLog = createEntity(em);
    }

    @Test
    @Transactional
    void createFormattedLog() throws Exception {
        int databaseSizeBeforeCreate = formattedLogRepository.findAll().size();
        // Create the FormattedLog
        restFormattedLogMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(formattedLog)))
            .andExpect(status().isCreated());

        // Validate the FormattedLog in the database
        List<FormattedLog> formattedLogList = formattedLogRepository.findAll();
        assertThat(formattedLogList).hasSize(databaseSizeBeforeCreate + 1);
        FormattedLog testFormattedLog = formattedLogList.get(formattedLogList.size() - 1);
        assertThat(testFormattedLog.getHostname()).isEqualTo(DEFAULT_HOSTNAME);
        assertThat(testFormattedLog.getStartDate()).isEqualTo(DEFAULT_START_DATE);
        assertThat(testFormattedLog.getEndDate()).isEqualTo(DEFAULT_END_DATE);
        assertThat(testFormattedLog.getStartHour()).isEqualTo(DEFAULT_START_HOUR);
        assertThat(testFormattedLog.getEndHour()).isEqualTo(DEFAULT_END_HOUR);
    }

    @Test
    @Transactional
    void createFormattedLogWithExistingId() throws Exception {
        // Create the FormattedLog with an existing ID
        formattedLog.setId(1L);

        int databaseSizeBeforeCreate = formattedLogRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restFormattedLogMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(formattedLog)))
            .andExpect(status().isBadRequest());

        // Validate the FormattedLog in the database
        List<FormattedLog> formattedLogList = formattedLogRepository.findAll();
        assertThat(formattedLogList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkHostnameIsRequired() throws Exception {
        int databaseSizeBeforeTest = formattedLogRepository.findAll().size();
        // set the field null
        formattedLog.setHostname(null);

        // Create the FormattedLog, which fails.

        restFormattedLogMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(formattedLog)))
            .andExpect(status().isBadRequest());

        List<FormattedLog> formattedLogList = formattedLogRepository.findAll();
        assertThat(formattedLogList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkStartDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = formattedLogRepository.findAll().size();
        // set the field null
        formattedLog.setStartDate(null);

        // Create the FormattedLog, which fails.

        restFormattedLogMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(formattedLog)))
            .andExpect(status().isBadRequest());

        List<FormattedLog> formattedLogList = formattedLogRepository.findAll();
        assertThat(formattedLogList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkEndDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = formattedLogRepository.findAll().size();
        // set the field null
        formattedLog.setEndDate(null);

        // Create the FormattedLog, which fails.

        restFormattedLogMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(formattedLog)))
            .andExpect(status().isBadRequest());

        List<FormattedLog> formattedLogList = formattedLogRepository.findAll();
        assertThat(formattedLogList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkStartHourIsRequired() throws Exception {
        int databaseSizeBeforeTest = formattedLogRepository.findAll().size();
        // set the field null
        formattedLog.setStartHour(null);

        // Create the FormattedLog, which fails.

        restFormattedLogMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(formattedLog)))
            .andExpect(status().isBadRequest());

        List<FormattedLog> formattedLogList = formattedLogRepository.findAll();
        assertThat(formattedLogList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkEndHourIsRequired() throws Exception {
        int databaseSizeBeforeTest = formattedLogRepository.findAll().size();
        // set the field null
        formattedLog.setEndHour(null);

        // Create the FormattedLog, which fails.

        restFormattedLogMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(formattedLog)))
            .andExpect(status().isBadRequest());

        List<FormattedLog> formattedLogList = formattedLogRepository.findAll();
        assertThat(formattedLogList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllFormattedLogs() throws Exception {
        // Initialize the database
        formattedLogRepository.saveAndFlush(formattedLog);

        // Get all the formattedLogList
        restFormattedLogMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(formattedLog.getId().intValue())))
            .andExpect(jsonPath("$.[*].hostname").value(hasItem(DEFAULT_HOSTNAME)))
            .andExpect(jsonPath("$.[*].startDate").value(hasItem(DEFAULT_START_DATE.toString())))
            .andExpect(jsonPath("$.[*].endDate").value(hasItem(DEFAULT_END_DATE.toString())))
            .andExpect(jsonPath("$.[*].startHour").value(hasItem(DEFAULT_START_HOUR.toString())))
            .andExpect(jsonPath("$.[*].endHour").value(hasItem(DEFAULT_END_HOUR.toString())));
    }

    @Test
    @Transactional
    void getFormattedLog() throws Exception {
        // Initialize the database
        formattedLogRepository.saveAndFlush(formattedLog);

        // Get the formattedLog
        restFormattedLogMockMvc
            .perform(get(ENTITY_API_URL_ID, formattedLog.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(formattedLog.getId().intValue()))
            .andExpect(jsonPath("$.hostname").value(DEFAULT_HOSTNAME))
            .andExpect(jsonPath("$.startDate").value(DEFAULT_START_DATE.toString()))
            .andExpect(jsonPath("$.endDate").value(DEFAULT_END_DATE.toString()))
            .andExpect(jsonPath("$.startHour").value(DEFAULT_START_HOUR.toString()))
            .andExpect(jsonPath("$.endHour").value(DEFAULT_END_HOUR.toString()));
    }

    @Test
    @Transactional
    void getNonExistingFormattedLog() throws Exception {
        // Get the formattedLog
        restFormattedLogMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingFormattedLog() throws Exception {
        // Initialize the database
        formattedLogRepository.saveAndFlush(formattedLog);

        int databaseSizeBeforeUpdate = formattedLogRepository.findAll().size();

        // Update the formattedLog
        FormattedLog updatedFormattedLog = formattedLogRepository.findById(formattedLog.getId()).get();
        // Disconnect from session so that the updates on updatedFormattedLog are not directly saved in db
        em.detach(updatedFormattedLog);
        updatedFormattedLog
            .hostname(UPDATED_HOSTNAME)
            .startDate(UPDATED_START_DATE)
            .endDate(UPDATED_END_DATE)
            .startHour(UPDATED_START_HOUR)
            .endHour(UPDATED_END_HOUR);

        restFormattedLogMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedFormattedLog.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedFormattedLog))
            )
            .andExpect(status().isOk());

        // Validate the FormattedLog in the database
        List<FormattedLog> formattedLogList = formattedLogRepository.findAll();
        assertThat(formattedLogList).hasSize(databaseSizeBeforeUpdate);
        FormattedLog testFormattedLog = formattedLogList.get(formattedLogList.size() - 1);
        assertThat(testFormattedLog.getHostname()).isEqualTo(UPDATED_HOSTNAME);
        assertThat(testFormattedLog.getStartDate()).isEqualTo(UPDATED_START_DATE);
        assertThat(testFormattedLog.getEndDate()).isEqualTo(UPDATED_END_DATE);
        assertThat(testFormattedLog.getStartHour()).isEqualTo(UPDATED_START_HOUR);
        assertThat(testFormattedLog.getEndHour()).isEqualTo(UPDATED_END_HOUR);
    }

    @Test
    @Transactional
    void putNonExistingFormattedLog() throws Exception {
        int databaseSizeBeforeUpdate = formattedLogRepository.findAll().size();
        formattedLog.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFormattedLogMockMvc
            .perform(
                put(ENTITY_API_URL_ID, formattedLog.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(formattedLog))
            )
            .andExpect(status().isBadRequest());

        // Validate the FormattedLog in the database
        List<FormattedLog> formattedLogList = formattedLogRepository.findAll();
        assertThat(formattedLogList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchFormattedLog() throws Exception {
        int databaseSizeBeforeUpdate = formattedLogRepository.findAll().size();
        formattedLog.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFormattedLogMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(formattedLog))
            )
            .andExpect(status().isBadRequest());

        // Validate the FormattedLog in the database
        List<FormattedLog> formattedLogList = formattedLogRepository.findAll();
        assertThat(formattedLogList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamFormattedLog() throws Exception {
        int databaseSizeBeforeUpdate = formattedLogRepository.findAll().size();
        formattedLog.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFormattedLogMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(formattedLog)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the FormattedLog in the database
        List<FormattedLog> formattedLogList = formattedLogRepository.findAll();
        assertThat(formattedLogList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateFormattedLogWithPatch() throws Exception {
        // Initialize the database
        formattedLogRepository.saveAndFlush(formattedLog);

        int databaseSizeBeforeUpdate = formattedLogRepository.findAll().size();

        // Update the formattedLog using partial update
        FormattedLog partialUpdatedFormattedLog = new FormattedLog();
        partialUpdatedFormattedLog.setId(formattedLog.getId());

        partialUpdatedFormattedLog
            .startDate(UPDATED_START_DATE)
            .endDate(UPDATED_END_DATE)
            .startHour(UPDATED_START_HOUR)
            .endHour(UPDATED_END_HOUR);

        restFormattedLogMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFormattedLog.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFormattedLog))
            )
            .andExpect(status().isOk());

        // Validate the FormattedLog in the database
        List<FormattedLog> formattedLogList = formattedLogRepository.findAll();
        assertThat(formattedLogList).hasSize(databaseSizeBeforeUpdate);
        FormattedLog testFormattedLog = formattedLogList.get(formattedLogList.size() - 1);
        assertThat(testFormattedLog.getHostname()).isEqualTo(DEFAULT_HOSTNAME);
        assertThat(testFormattedLog.getStartDate()).isEqualTo(UPDATED_START_DATE);
        assertThat(testFormattedLog.getEndDate()).isEqualTo(UPDATED_END_DATE);
        assertThat(testFormattedLog.getStartHour()).isEqualTo(UPDATED_START_HOUR);
        assertThat(testFormattedLog.getEndHour()).isEqualTo(UPDATED_END_HOUR);
    }

    @Test
    @Transactional
    void fullUpdateFormattedLogWithPatch() throws Exception {
        // Initialize the database
        formattedLogRepository.saveAndFlush(formattedLog);

        int databaseSizeBeforeUpdate = formattedLogRepository.findAll().size();

        // Update the formattedLog using partial update
        FormattedLog partialUpdatedFormattedLog = new FormattedLog();
        partialUpdatedFormattedLog.setId(formattedLog.getId());

        partialUpdatedFormattedLog
            .hostname(UPDATED_HOSTNAME)
            .startDate(UPDATED_START_DATE)
            .endDate(UPDATED_END_DATE)
            .startHour(UPDATED_START_HOUR)
            .endHour(UPDATED_END_HOUR);

        restFormattedLogMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFormattedLog.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFormattedLog))
            )
            .andExpect(status().isOk());

        // Validate the FormattedLog in the database
        List<FormattedLog> formattedLogList = formattedLogRepository.findAll();
        assertThat(formattedLogList).hasSize(databaseSizeBeforeUpdate);
        FormattedLog testFormattedLog = formattedLogList.get(formattedLogList.size() - 1);
        assertThat(testFormattedLog.getHostname()).isEqualTo(UPDATED_HOSTNAME);
        assertThat(testFormattedLog.getStartDate()).isEqualTo(UPDATED_START_DATE);
        assertThat(testFormattedLog.getEndDate()).isEqualTo(UPDATED_END_DATE);
        assertThat(testFormattedLog.getStartHour()).isEqualTo(UPDATED_START_HOUR);
        assertThat(testFormattedLog.getEndHour()).isEqualTo(UPDATED_END_HOUR);
    }

    @Test
    @Transactional
    void patchNonExistingFormattedLog() throws Exception {
        int databaseSizeBeforeUpdate = formattedLogRepository.findAll().size();
        formattedLog.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFormattedLogMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, formattedLog.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(formattedLog))
            )
            .andExpect(status().isBadRequest());

        // Validate the FormattedLog in the database
        List<FormattedLog> formattedLogList = formattedLogRepository.findAll();
        assertThat(formattedLogList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchFormattedLog() throws Exception {
        int databaseSizeBeforeUpdate = formattedLogRepository.findAll().size();
        formattedLog.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFormattedLogMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(formattedLog))
            )
            .andExpect(status().isBadRequest());

        // Validate the FormattedLog in the database
        List<FormattedLog> formattedLogList = formattedLogRepository.findAll();
        assertThat(formattedLogList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamFormattedLog() throws Exception {
        int databaseSizeBeforeUpdate = formattedLogRepository.findAll().size();
        formattedLog.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFormattedLogMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(formattedLog))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the FormattedLog in the database
        List<FormattedLog> formattedLogList = formattedLogRepository.findAll();
        assertThat(formattedLogList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteFormattedLog() throws Exception {
        // Initialize the database
        formattedLogRepository.saveAndFlush(formattedLog);

        int databaseSizeBeforeDelete = formattedLogRepository.findAll().size();

        // Delete the formattedLog
        restFormattedLogMockMvc
            .perform(delete(ENTITY_API_URL_ID, formattedLog.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<FormattedLog> formattedLogList = formattedLogRepository.findAll();
        assertThat(formattedLogList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
