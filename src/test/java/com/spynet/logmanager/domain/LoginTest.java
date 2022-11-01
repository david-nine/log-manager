package com.spynet.logmanager.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.spynet.logmanager.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class LoginTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Login.class);
        Login login1 = new Login();
        login1.setId(1L);
        Login login2 = new Login();
        login2.setId(login1.getId());
        assertThat(login1).isEqualTo(login2);
        login2.setId(2L);
        assertThat(login1).isNotEqualTo(login2);
        login1.setId(null);
        assertThat(login1).isNotEqualTo(login2);
    }
}
