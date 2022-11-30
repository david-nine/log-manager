package com.spynet.logmanager.domain.dto;

import java.util.List;
import javax.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;

@FieldDefaults(level = AccessLevel.PUBLIC)
public class LogsInput {

    @NotNull(message = "logs is required")
    List<Log> logs;

    String hostname;
}
