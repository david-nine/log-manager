package com.spynet.logmanager.service;

import com.spynet.logmanager.domain.FormattedLog;
import com.spynet.logmanager.domain.dto.Log;
import com.spynet.logmanager.domain.enumeration.StatusType;
import com.spynet.logmanager.repository.FormattedLogRepository;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.Comparator;
import java.util.LinkedList;
import java.util.List;
import java.util.stream.Collectors;
import lombok.AccessLevel;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Setter(onMethod_ = @Autowired)
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LogService {

    private FormattedLogRepository formattedLogRepository;

    public void saveLogs(List<Log> logs, String hostname) {
        List<Log> sortedLogs = logs.stream().sorted(Comparator.comparing(log -> log.dateTime)).collect(Collectors.toUnmodifiableList());
        Instant startDateController = logs.get(0).dateTime;
        StatusType statusController = logs.get(0).activity;
        LinkedList<FormattedLog> formattedLogs = new LinkedList<>();
        for (int i = 0; i < sortedLogs.size(); i++) {
            Log log = sortedLogs.get(i);
            if (log.activity != statusController) {
                FormattedLog formattedLog = createFormattedLog(
                    hostname,
                    startDateController,
                    statusController,
                    sortedLogs.get(i - 1).dateTime
                );
                formattedLogs.add(formattedLog);
                statusController = log.activity;
                startDateController = log.dateTime;
            }
        }
        this.formattedLogRepository.saveAll(formattedLogs);
    }

    private static FormattedLog createFormattedLog(
        String hostname,
        Instant startDateTime,
        StatusType statusController,
        Instant endDateTime
    ) {
        FormattedLog formattedLog = new FormattedLog();
        formattedLog.setStartDate(LocalDate.ofInstant(startDateTime, ZoneOffset.UTC));
        formattedLog.setStartHour(startDateTime);
        formattedLog.setEndDate(LocalDate.ofInstant(endDateTime, ZoneOffset.UTC));
        formattedLog.setEndHour(endDateTime);
        formattedLog.setHostname(hostname);
        formattedLog.setStatus(statusController);
        return formattedLog;
    }
}
