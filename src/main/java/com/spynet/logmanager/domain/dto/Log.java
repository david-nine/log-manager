package com.spynet.logmanager.domain.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.spynet.logmanager.domain.enumeration.StatusType;
import java.io.Serializable;
import java.time.Instant;
import java.time.format.DateTimeFormatter;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PUBLIC)
public class Log implements Serializable {

    String hostname;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "UTC")
    Instant dateTime;

    StatusType activity;
}
