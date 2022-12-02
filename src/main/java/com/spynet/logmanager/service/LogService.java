package com.spynet.logmanager.service;

import com.spynet.logmanager.domain.FormattedLog;
import com.spynet.logmanager.domain.dto.Log;
import com.spynet.logmanager.domain.enumeration.StatusType;
import com.spynet.logmanager.repository.FormattedLogRepository;
import com.spynet.logmanager.web.rest.LoginResource;
import java.time.Instant;
import java.util.Comparator;
import java.util.LinkedList;
import java.util.List;
import java.util.stream.Collectors;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import lombok.AccessLevel;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Setter(onMethod_ = @Autowired)
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LogService {

    private final Logger log = LoggerFactory.getLogger(LoginResource.class);
    public static final String GET_LAST_LOG = "SELECT l FROM formatted_log where f.hostname = :hostname ORDER BY end_hour DESC";
    private FormattedLogRepository formattedLogRepository;

    @PersistenceContext
    EntityManager em;

    @Transactional
    public void saveLogs(List<Log> logs, String hostname) {
        List<Log> sortedLogs = logs.stream().sorted(Comparator.comparing(log -> log.dateTime)).collect(Collectors.toUnmodifiableList());
        FormattedLog existedLog = em.createNamedQuery(GET_LAST_LOG.replace(":hostname", hostname), FormattedLog.class).getSingleResult();
        //FormattedLog existedLog = formattedLogRepository.findByHostnameOrderByEndHourDesc(hostname).orElse(null);

        log.info(existedLog.getHostname());

        if (existedLog == null) {
            Log log = sortedLogs.get(0);
            existedLog = createFormattedLog(hostname, log.dateTime, log.activity);
        }

        LinkedList<FormattedLog> formattedLogs = new LinkedList<>();
        formattedLogs.add(existedLog);

        for (int i = 0; i < sortedLogs.size(); i++) {
            Log log = sortedLogs.get(i);
            FormattedLog lastLog = getLast(formattedLogs);
            if (log.activity != lastLog.getStatus()) {
                formattedLogs.add(createFormattedLog(hostname, sortedLogs.get(i).dateTime, lastLog.getStatus()));
            } else {
                lastLog.endHour(log.dateTime);
            }
        }
        this.formattedLogRepository.saveAll(formattedLogs);
    }

    private static FormattedLog getLast(LinkedList<FormattedLog> formattedLogs) {
        return formattedLogs.get(formattedLogs.size() - 1);
    }

    private static FormattedLog createFormattedLog(String hostname, Instant dateTime, StatusType statusController) {
        FormattedLog formattedLog = new FormattedLog();
        formattedLog.setStartHour(dateTime);
        formattedLog.setEndHour(dateTime);
        formattedLog.setHostname(hostname);
        formattedLog.setStatus(statusController);
        return formattedLog;
    }
}
