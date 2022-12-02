package com.spynet.logmanager.repository;

import com.spynet.logmanager.domain.FormattedLog;
import java.util.Optional;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the FormattedLog entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FormattedLogRepository extends JpaRepository<FormattedLog, Long> {
    Optional<FormattedLog> findByHostnameOrderByEndHourDesc(String hostname);
}
