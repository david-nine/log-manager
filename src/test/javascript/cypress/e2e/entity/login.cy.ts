import {
  entityTableSelector,
  entityDetailsButtonSelector,
  entityDetailsBackButtonSelector,
  entityCreateButtonSelector,
  entityCreateSaveButtonSelector,
  entityCreateCancelButtonSelector,
  entityEditButtonSelector,
  entityDeleteButtonSelector,
  entityConfirmDeleteButtonSelector,
} from '../../support/entity';

describe('Login e2e test', () => {
  const loginPageUrl = '/login';
  const loginPageUrlPattern = new RegExp('/login(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const loginSample = { email: 'Nbia.Saraiva@bol.com.br', passsword: 'HTTPXXXX' };

  let login;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/logins+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/logins').as('postEntityRequest');
    cy.intercept('DELETE', '/api/logins/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (login) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/logins/${login.id}`,
      }).then(() => {
        login = undefined;
      });
    }
  });

  it('Logins menu should load Logins page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('login');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Login').should('exist');
    cy.url().should('match', loginPageUrlPattern);
  });

  describe('Login page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(loginPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Login page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/login/new$'));
        cy.getEntityCreateUpdateHeading('Login');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', loginPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/logins',
          body: loginSample,
        }).then(({ body }) => {
          login = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/logins+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/logins?page=0&size=20>; rel="last",<http://localhost/api/logins?page=0&size=20>; rel="first"',
              },
              body: [login],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(loginPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Login page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('login');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', loginPageUrlPattern);
      });

      it('edit button click should load edit Login page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Login');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', loginPageUrlPattern);
      });

      it('edit button click should load edit Login page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Login');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', loginPageUrlPattern);
      });

      it('last delete button click should delete instance of Login', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('login').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', loginPageUrlPattern);

        login = undefined;
      });
    });
  });

  describe('new Login page', () => {
    beforeEach(() => {
      cy.visit(`${loginPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Login');
    });

    it('should create an instance of Login', () => {
      cy.get(`[data-cy="email"]`).type('Sirineu_Carvalho49@hotmail.com').should('have.value', 'Sirineu_Carvalho49@hotmail.com');

      cy.get(`[data-cy="passsword"]`).type('tertiary').should('have.value', 'tertiary');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        login = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', loginPageUrlPattern);
    });
  });
});
