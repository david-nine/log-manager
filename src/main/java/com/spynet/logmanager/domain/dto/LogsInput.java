package com.spynet.logmanager.domain.dto;

import java.util.List;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;

@FieldDefaults(level = AccessLevel.PUBLIC)
public class LogsInput {

    List<Log> logs;

    String hostname;
}
