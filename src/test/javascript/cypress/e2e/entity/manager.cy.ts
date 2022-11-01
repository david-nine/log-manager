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

describe('Manager e2e test', () => {
  const managerPageUrl = '/manager';
  const managerPageUrlPattern = new RegExp('/manager(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const managerSample = {};

  let manager;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/managers+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/managers').as('postEntityRequest');
    cy.intercept('DELETE', '/api/managers/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (manager) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/managers/${manager.id}`,
      }).then(() => {
        manager = undefined;
      });
    }
  });

  it('Managers menu should load Managers page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('manager');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Manager').should('exist');
    cy.url().should('match', managerPageUrlPattern);
  });

  describe('Manager page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(managerPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Manager page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/manager/new$'));
        cy.getEntityCreateUpdateHeading('Manager');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', managerPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/managers',
          body: managerSample,
        }).then(({ body }) => {
          manager = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/managers+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/managers?page=0&size=20>; rel="last",<http://localhost/api/managers?page=0&size=20>; rel="first"',
              },
              body: [manager],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(managerPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Manager page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('manager');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', managerPageUrlPattern);
      });

      it('edit button click should load edit Manager page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Manager');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', managerPageUrlPattern);
      });

      it('edit button click should load edit Manager page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Manager');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', managerPageUrlPattern);
      });

      it('last delete button click should delete instance of Manager', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('manager').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', managerPageUrlPattern);

        manager = undefined;
      });
    });
  });

  describe('new Manager page', () => {
    beforeEach(() => {
      cy.visit(`${managerPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Manager');
    });

    it('should create an instance of Manager', () => {
      cy.get(`[data-cy="token"]`)
        .type('c5e786bb-bd4a-4504-91d4-3af1219532b4')
        .invoke('val')
        .should('match', new RegExp('c5e786bb-bd4a-4504-91d4-3af1219532b4'));

      cy.get(`[data-cy="userType"]`).select('ADMIN');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        manager = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', managerPageUrlPattern);
    });
  });
});
