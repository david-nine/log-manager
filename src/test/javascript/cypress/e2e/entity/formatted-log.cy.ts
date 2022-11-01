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

describe('FormattedLog e2e test', () => {
  const formattedLogPageUrl = '/formatted-log';
  const formattedLogPageUrlPattern = new RegExp('/formatted-log(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const formattedLogSample = {
    hostname: 'mobile',
    startDate: '2022-10-31',
    endDate: '2022-10-31',
    startHour: '2022-10-31T10:55:09.305Z',
    endHour: '2022-10-31T14:24:44.506Z',
  };

  let formattedLog;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/formatted-logs+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/formatted-logs').as('postEntityRequest');
    cy.intercept('DELETE', '/api/formatted-logs/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (formattedLog) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/formatted-logs/${formattedLog.id}`,
      }).then(() => {
        formattedLog = undefined;
      });
    }
  });

  it('FormattedLogs menu should load FormattedLogs page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('formatted-log');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('FormattedLog').should('exist');
    cy.url().should('match', formattedLogPageUrlPattern);
  });

  describe('FormattedLog page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(formattedLogPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create FormattedLog page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/formatted-log/new$'));
        cy.getEntityCreateUpdateHeading('FormattedLog');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', formattedLogPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/formatted-logs',
          body: formattedLogSample,
        }).then(({ body }) => {
          formattedLog = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/formatted-logs+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/formatted-logs?page=0&size=20>; rel="last",<http://localhost/api/formatted-logs?page=0&size=20>; rel="first"',
              },
              body: [formattedLog],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(formattedLogPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details FormattedLog page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('formattedLog');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', formattedLogPageUrlPattern);
      });

      it('edit button click should load edit FormattedLog page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('FormattedLog');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', formattedLogPageUrlPattern);
      });

      it('edit button click should load edit FormattedLog page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('FormattedLog');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', formattedLogPageUrlPattern);
      });

      it('last delete button click should delete instance of FormattedLog', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('formattedLog').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', formattedLogPageUrlPattern);

        formattedLog = undefined;
      });
    });
  });

  describe('new FormattedLog page', () => {
    beforeEach(() => {
      cy.visit(`${formattedLogPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('FormattedLog');
    });

    it('should create an instance of FormattedLog', () => {
      cy.get(`[data-cy="hostname"]`).type('Checking Marketing Rodovia').should('have.value', 'Checking Marketing Rodovia');

      cy.get(`[data-cy="startDate"]`).type('2022-10-31').blur().should('have.value', '2022-10-31');

      cy.get(`[data-cy="endDate"]`).type('2022-10-31').blur().should('have.value', '2022-10-31');

      cy.get(`[data-cy="startHour"]`).type('2022-10-31T07:19').blur().should('have.value', '2022-10-31T07:19');

      cy.get(`[data-cy="endHour"]`).type('2022-10-31T16:19').blur().should('have.value', '2022-10-31T16:19');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        formattedLog = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', formattedLogPageUrlPattern);
    });
  });
});
