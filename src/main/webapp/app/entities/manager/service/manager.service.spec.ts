import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IManager } from '../manager.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../manager.test-samples';

import { ManagerService } from './manager.service';

const requireRestSample: IManager = {
  ...sampleWithRequiredData,
};

describe('Manager Service', () => {
  let service: ManagerService;
  let httpMock: HttpTestingController;
  let expectedResult: IManager | IManager[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ManagerService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Manager', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const manager = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(manager).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Manager', () => {
      const manager = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(manager).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Manager', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Manager', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Manager', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addManagerToCollectionIfMissing', () => {
      it('should add a Manager to an empty array', () => {
        const manager: IManager = sampleWithRequiredData;
        expectedResult = service.addManagerToCollectionIfMissing([], manager);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(manager);
      });

      it('should not add a Manager to an array that contains it', () => {
        const manager: IManager = sampleWithRequiredData;
        const managerCollection: IManager[] = [
          {
            ...manager,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addManagerToCollectionIfMissing(managerCollection, manager);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Manager to an array that doesn't contain it", () => {
        const manager: IManager = sampleWithRequiredData;
        const managerCollection: IManager[] = [sampleWithPartialData];
        expectedResult = service.addManagerToCollectionIfMissing(managerCollection, manager);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(manager);
      });

      it('should add only unique Manager to an array', () => {
        const managerArray: IManager[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const managerCollection: IManager[] = [sampleWithRequiredData];
        expectedResult = service.addManagerToCollectionIfMissing(managerCollection, ...managerArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const manager: IManager = sampleWithRequiredData;
        const manager2: IManager = sampleWithPartialData;
        expectedResult = service.addManagerToCollectionIfMissing([], manager, manager2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(manager);
        expect(expectedResult).toContain(manager2);
      });

      it('should accept null and undefined values', () => {
        const manager: IManager = sampleWithRequiredData;
        expectedResult = service.addManagerToCollectionIfMissing([], null, manager, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(manager);
      });

      it('should return initial array if no Manager is added', () => {
        const managerCollection: IManager[] = [sampleWithRequiredData];
        expectedResult = service.addManagerToCollectionIfMissing(managerCollection, undefined, null);
        expect(expectedResult).toEqual(managerCollection);
      });
    });

    describe('compareManager', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareManager(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareManager(entity1, entity2);
        const compareResult2 = service.compareManager(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareManager(entity1, entity2);
        const compareResult2 = service.compareManager(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareManager(entity1, entity2);
        const compareResult2 = service.compareManager(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
