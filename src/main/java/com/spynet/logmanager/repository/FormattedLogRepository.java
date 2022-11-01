package com.spynet.logmanager.repository;

import com.spynet.logmanager.domain.FormattedLog;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the FormattedLog entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FormattedLogRepository extends JpaRepository<FormattedLog, Long> {}
