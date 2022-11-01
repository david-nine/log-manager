package com.spynet.logmanager.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.spynet.logmanager.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class FormattedLogTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(FormattedLog.class);
        FormattedLog formattedLog1 = new FormattedLog();
        formattedLog1.setId(1L);
        FormattedLog formattedLog2 = new FormattedLog();
        formattedLog2.setId(formattedLog1.getId());
        assertThat(formattedLog1).isEqualTo(formattedLog2);
        formattedLog2.setId(2L);
        assertThat(formattedLog1).isNotEqualTo(formattedLog2);
        formattedLog1.setId(null);
        assertThat(formattedLog1).isNotEqualTo(formattedLog2);
    }
}
