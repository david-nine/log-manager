package com.spynet.logmanager.web.rest;

import com.spynet.logmanager.domain.FormattedLog;
import com.spynet.logmanager.repository.FormattedLogRepository;
import com.spynet.logmanager.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
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

/**
 * REST controller for managing {@link com.spynet.logmanager.domain.FormattedLog}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class FormattedLogResource {

    private final Logger log = LoggerFactory.getLogger(FormattedLogResource.class);

    private static final String ENTITY_NAME = "formattedLog";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final FormattedLogRepository formattedLogRepository;

    public FormattedLogResource(FormattedLogRepository formattedLogRepository) {
        this.formattedLogRepository = formattedLogRepository;
    }

    /**
     * {@code POST  /formatted-logs} : Create a new formattedLog.
     *
     * @param formattedLog the formattedLog to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new formattedLog, or with status {@code 400 (Bad Request)} if the formattedLog has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/formatted-logs")
    public ResponseEntity<FormattedLog> createFormattedLog(@Valid @RequestBody FormattedLog formattedLog) throws URISyntaxException {
        log.debug("REST request to save FormattedLog : {}", formattedLog);
        if (formattedLog.getId() != null) {
            throw new BadRequestAlertException("A new formattedLog cannot already have an ID", ENTITY_NAME, "idexists");
        }
        FormattedLog result = formattedLogRepository.save(formattedLog);
        return ResponseEntity
            .created(new URI("/api/formatted-logs/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /formatted-logs/:id} : Updates an existing formattedLog.
     *
     * @param id the id of the formattedLog to save.
     * @param formattedLog the formattedLog to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated formattedLog,
     * or with status {@code 400 (Bad Request)} if the formattedLog is not valid,
     * or with status {@code 500 (Internal Server Error)} if the formattedLog couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/formatted-logs/{id}")
    public ResponseEntity<FormattedLog> updateFormattedLog(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody FormattedLog formattedLog
    ) throws URISyntaxException {
        log.debug("REST request to update FormattedLog : {}, {}", id, formattedLog);
        if (formattedLog.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, formattedLog.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!formattedLogRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        FormattedLog result = formattedLogRepository.save(formattedLog);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, formattedLog.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /formatted-logs/:id} : Partial updates given fields of an existing formattedLog, field will ignore if it is null
     *
     * @param id the id of the formattedLog to save.
     * @param formattedLog the formattedLog to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated formattedLog,
     * or with status {@code 400 (Bad Request)} if the formattedLog is not valid,
     * or with status {@code 404 (Not Found)} if the formattedLog is not found,
     * or with status {@code 500 (Internal Server Error)} if the formattedLog couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/formatted-logs/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<FormattedLog> partialUpdateFormattedLog(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody FormattedLog formattedLog
    ) throws URISyntaxException {
        log.debug("REST request to partial update FormattedLog partially : {}, {}", id, formattedLog);
        if (formattedLog.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, formattedLog.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!formattedLogRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<FormattedLog> result = formattedLogRepository
            .findById(formattedLog.getId())
            .map(existingFormattedLog -> {
                if (formattedLog.getHostname() != null) {
                    existingFormattedLog.setHostname(formattedLog.getHostname());
                }
                if (formattedLog.getStartDate() != null) {
                    existingFormattedLog.setStartDate(formattedLog.getStartDate());
                }
                if (formattedLog.getEndDate() != null) {
                    existingFormattedLog.setEndDate(formattedLog.getEndDate());
                }
                if (formattedLog.getStartHour() != null) {
                    existingFormattedLog.setStartHour(formattedLog.getStartHour());
                }
                if (formattedLog.getEndHour() != null) {
                    existingFormattedLog.setEndHour(formattedLog.getEndHour());
                }

                return existingFormattedLog;
            })
            .map(formattedLogRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, formattedLog.getId().toString())
        );
    }

    /**
     * {@code GET  /formatted-logs} : get all the formattedLogs.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of formattedLogs in body.
     */
    @GetMapping("/formatted-logs")
    public ResponseEntity<List<FormattedLog>> getAllFormattedLogs(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of FormattedLogs");
        Page<FormattedLog> page = formattedLogRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /formatted-logs/:id} : get the "id" formattedLog.
     *
     * @param id the id of the formattedLog to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the formattedLog, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/formatted-logs/{id}")
    public ResponseEntity<FormattedLog> getFormattedLog(@PathVariable Long id) {
        log.debug("REST request to get FormattedLog : {}", id);
        Optional<FormattedLog> formattedLog = formattedLogRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(formattedLog);
    }

    /**
     * {@code DELETE  /formatted-logs/:id} : delete the "id" formattedLog.
     *
     * @param id the id of the formattedLog to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/formatted-logs/{id}")
    public ResponseEntity<Void> deleteFormattedLog(@PathVariable Long id) {
        log.debug("REST request to delete FormattedLog : {}", id);
        formattedLogRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
