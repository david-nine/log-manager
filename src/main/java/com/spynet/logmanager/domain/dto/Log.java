package com.spynet.logmanager.domain.dto;

import com.spynet.logmanager.domain.enumeration.StatusType;
import java.io.Serializable;
import java.time.Instant;
import lombok.*;
import lombok.experimental.FieldDefaults;

@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PUBLIC)
public class Log implements Serializable {

    String hostname;

    Instant dateTime;

    StatusType activity;
}
