package com.spynet.logmanager.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.spynet.logmanager.IntegrationTest;
import com.spynet.logmanager.domain.Login;
import com.spynet.logmanager.repository.LoginRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link LoginResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class LoginResourceIT {

    private static final String DEFAULT_EMAIL = "AAAAAAAAAA";
    private static final String UPDATED_EMAIL = "BBBBBBBBBB";

    private static final String DEFAULT_PASSSWORD = "AAAAAAAAAA";
    private static final String UPDATED_PASSSWORD = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/logins";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private LoginRepository loginRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restLoginMockMvc;

    private Login login;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Login createEntity(EntityManager em) {
        Login login = new Login().email(DEFAULT_EMAIL).passsword(DEFAULT_PASSSWORD);
        return login;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Login createUpdatedEntity(EntityManager em) {
        Login login = new Login().email(UPDATED_EMAIL).passsword(UPDATED_PASSSWORD);
        return login;
    }

    @BeforeEach
    public void initTest() {
        login = createEntity(em);
    }

    @Test
    @Transactional
    void createLogin() throws Exception {
        int databaseSizeBeforeCreate = loginRepository.findAll().size();
        // Create the Login
        restLoginMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(login)))
            .andExpect(status().isCreated());

        // Validate the Login in the database
        List<Login> loginList = loginRepository.findAll();
        assertThat(loginList).hasSize(databaseSizeBeforeCreate + 1);
        Login testLogin = loginList.get(loginList.size() - 1);
        assertThat(testLogin.getEmail()).isEqualTo(DEFAULT_EMAIL);
        assertThat(testLogin.getPasssword()).isEqualTo(DEFAULT_PASSSWORD);
    }

    @Test
    @Transactional
    void createLoginWithExistingId() throws Exception {
        // Create the Login with an existing ID
        login.setId(1L);

        int databaseSizeBeforeCreate = loginRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restLoginMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(login)))
            .andExpect(status().isBadRequest());

        // Validate the Login in the database
        List<Login> loginList = loginRepository.findAll();
        assertThat(loginList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkEmailIsRequired() throws Exception {
        int databaseSizeBeforeTest = loginRepository.findAll().size();
        // set the field null
        login.setEmail(null);

        // Create the Login, which fails.

        restLoginMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(login)))
            .andExpect(status().isBadRequest());

        List<Login> loginList = loginRepository.findAll();
        assertThat(loginList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkPassswordIsRequired() throws Exception {
        int databaseSizeBeforeTest = loginRepository.findAll().size();
        // set the field null
        login.setPasssword(null);

        // Create the Login, which fails.

        restLoginMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(login)))
            .andExpect(status().isBadRequest());

        List<Login> loginList = loginRepository.findAll();
        assertThat(loginList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllLogins() throws Exception {
        // Initialize the database
        loginRepository.saveAndFlush(login);

        // Get all the loginList
        restLoginMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(login.getId().intValue())))
            .andExpect(jsonPath("$.[*].email").value(hasItem(DEFAULT_EMAIL)))
            .andExpect(jsonPath("$.[*].passsword").value(hasItem(DEFAULT_PASSSWORD)));
    }

    @Test
    @Transactional
    void getLogin() throws Exception {
        // Initialize the database
        loginRepository.saveAndFlush(login);

        // Get the login
        restLoginMockMvc
            .perform(get(ENTITY_API_URL_ID, login.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(login.getId().intValue()))
            .andExpect(jsonPath("$.email").value(DEFAULT_EMAIL))
            .andExpect(jsonPath("$.passsword").value(DEFAULT_PASSSWORD));
    }

    @Test
    @Transactional
    void getNonExistingLogin() throws Exception {
        // Get the login
        restLoginMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingLogin() throws Exception {
        // Initialize the database
        loginRepository.saveAndFlush(login);

        int databaseSizeBeforeUpdate = loginRepository.findAll().size();

        // Update the login
        Login updatedLogin = loginRepository.findById(login.getId()).get();
        // Disconnect from session so that the updates on updatedLogin are not directly saved in db
        em.detach(updatedLogin);
        updatedLogin.email(UPDATED_EMAIL).passsword(UPDATED_PASSSWORD);

        restLoginMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedLogin.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedLogin))
            )
            .andExpect(status().isOk());

        // Validate the Login in the database
        List<Login> loginList = loginRepository.findAll();
        assertThat(loginList).hasSize(databaseSizeBeforeUpdate);
        Login testLogin = loginList.get(loginList.size() - 1);
        assertThat(testLogin.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testLogin.getPasssword()).isEqualTo(UPDATED_PASSSWORD);
    }

    @Test
    @Transactional
    void putNonExistingLogin() throws Exception {
        int databaseSizeBeforeUpdate = loginRepository.findAll().size();
        login.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLoginMockMvc
            .perform(
                put(ENTITY_API_URL_ID, login.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(login))
            )
            .andExpect(status().isBadRequest());

        // Validate the Login in the database
        List<Login> loginList = loginRepository.findAll();
        assertThat(loginList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchLogin() throws Exception {
        int databaseSizeBeforeUpdate = loginRepository.findAll().size();
        login.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLoginMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(login))
            )
            .andExpect(status().isBadRequest());

        // Validate the Login in the database
        List<Login> loginList = loginRepository.findAll();
        assertThat(loginList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamLogin() throws Exception {
        int databaseSizeBeforeUpdate = loginRepository.findAll().size();
        login.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLoginMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(login)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Login in the database
        List<Login> loginList = loginRepository.findAll();
        assertThat(loginList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateLoginWithPatch() throws Exception {
        // Initialize the database
        loginRepository.saveAndFlush(login);

        int databaseSizeBeforeUpdate = loginRepository.findAll().size();

        // Update the login using partial update
        Login partialUpdatedLogin = new Login();
        partialUpdatedLogin.setId(login.getId());

        restLoginMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLogin.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLogin))
            )
            .andExpect(status().isOk());

        // Validate the Login in the database
        List<Login> loginList = loginRepository.findAll();
        assertThat(loginList).hasSize(databaseSizeBeforeUpdate);
        Login testLogin = loginList.get(loginList.size() - 1);
        assertThat(testLogin.getEmail()).isEqualTo(DEFAULT_EMAIL);
        assertThat(testLogin.getPasssword()).isEqualTo(DEFAULT_PASSSWORD);
    }

    @Test
    @Transactional
    void fullUpdateLoginWithPatch() throws Exception {
        // Initialize the database
        loginRepository.saveAndFlush(login);

        int databaseSizeBeforeUpdate = loginRepository.findAll().size();

        // Update the login using partial update
        Login partialUpdatedLogin = new Login();
        partialUpdatedLogin.setId(login.getId());

        partialUpdatedLogin.email(UPDATED_EMAIL).passsword(UPDATED_PASSSWORD);

        restLoginMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLogin.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLogin))
            )
            .andExpect(status().isOk());

        // Validate the Login in the database
        List<Login> loginList = loginRepository.findAll();
        assertThat(loginList).hasSize(databaseSizeBeforeUpdate);
        Login testLogin = loginList.get(loginList.size() - 1);
        assertThat(testLogin.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testLogin.getPasssword()).isEqualTo(UPDATED_PASSSWORD);
    }

    @Test
    @Transactional
    void patchNonExistingLogin() throws Exception {
        int databaseSizeBeforeUpdate = loginRepository.findAll().size();
        login.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLoginMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, login.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(login))
            )
            .andExpect(status().isBadRequest());

        // Validate the Login in the database
        List<Login> loginList = loginRepository.findAll();
        assertThat(loginList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchLogin() throws Exception {
        int databaseSizeBeforeUpdate = loginRepository.findAll().size();
        login.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLoginMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(login))
            )
            .andExpect(status().isBadRequest());

        // Validate the Login in the database
        List<Login> loginList = loginRepository.findAll();
        assertThat(loginList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamLogin() throws Exception {
        int databaseSizeBeforeUpdate = loginRepository.findAll().size();
        login.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLoginMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(login)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Login in the database
        List<Login> loginList = loginRepository.findAll();
        assertThat(loginList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteLogin() throws Exception {
        // Initialize the database
        loginRepository.saveAndFlush(login);

        int databaseSizeBeforeDelete = loginRepository.findAll().size();

        // Delete the login
        restLoginMockMvc
            .perform(delete(ENTITY_API_URL_ID, login.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Login> loginList = loginRepository.findAll();
        assertThat(loginList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
