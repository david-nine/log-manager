package com.spynet.logmanager.web.rest;

import com.spynet.logmanager.domain.dto.LogsInput;
import com.spynet.logmanager.service.LogService;
import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/logs")
public class ReceiveLogsResource {

    @Autowired
    private LogService logService;

    @PostMapping
    public void logs(@Valid @RequestBody LogsInput logsInput) {
        logService.saveLogs(logsInput.logs, logsInput.hostname);
    }
}
