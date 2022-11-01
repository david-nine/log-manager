import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IFormattedLog } from '../formatted-log.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../formatted-log.test-samples';

import { FormattedLogService, RestFormattedLog } from './formatted-log.service';

const requireRestSample: RestFormattedLog = {
  ...sampleWithRequiredData,
  startDate: sampleWithRequiredData.startDate?.format(DATE_FORMAT),
  endDate: sampleWithRequiredData.endDate?.format(DATE_FORMAT),
  startHour: sampleWithRequiredData.startHour?.toJSON(),
  endHour: sampleWithRequiredData.endHour?.toJSON(),
};

describe('FormattedLog Service', () => {
  let service: FormattedLogService;
  let httpMock: HttpTestingController;
  let expectedResult: IFormattedLog | IFormattedLog[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(FormattedLogService);
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

    it('should create a FormattedLog', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const formattedLog = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(formattedLog).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a FormattedLog', () => {
      const formattedLog = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(formattedLog).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a FormattedLog', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of FormattedLog', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a FormattedLog', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addFormattedLogToCollectionIfMissing', () => {
      it('should add a FormattedLog to an empty array', () => {
        const formattedLog: IFormattedLog = sampleWithRequiredData;
        expectedResult = service.addFormattedLogToCollectionIfMissing([], formattedLog);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(formattedLog);
      });

      it('should not add a FormattedLog to an array that contains it', () => {
        const formattedLog: IFormattedLog = sampleWithRequiredData;
        const formattedLogCollection: IFormattedLog[] = [
          {
            ...formattedLog,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addFormattedLogToCollectionIfMissing(formattedLogCollection, formattedLog);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a FormattedLog to an array that doesn't contain it", () => {
        const formattedLog: IFormattedLog = sampleWithRequiredData;
        const formattedLogCollection: IFormattedLog[] = [sampleWithPartialData];
        expectedResult = service.addFormattedLogToCollectionIfMissing(formattedLogCollection, formattedLog);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(formattedLog);
      });

      it('should add only unique FormattedLog to an array', () => {
        const formattedLogArray: IFormattedLog[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const formattedLogCollection: IFormattedLog[] = [sampleWithRequiredData];
        expectedResult = service.addFormattedLogToCollectionIfMissing(formattedLogCollection, ...formattedLogArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const formattedLog: IFormattedLog = sampleWithRequiredData;
        const formattedLog2: IFormattedLog = sampleWithPartialData;
        expectedResult = service.addFormattedLogToCollectionIfMissing([], formattedLog, formattedLog2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(formattedLog);
        expect(expectedResult).toContain(formattedLog2);
      });

      it('should accept null and undefined values', () => {
        const formattedLog: IFormattedLog = sampleWithRequiredData;
        expectedResult = service.addFormattedLogToCollectionIfMissing([], null, formattedLog, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(formattedLog);
      });

      it('should return initial array if no FormattedLog is added', () => {
        const formattedLogCollection: IFormattedLog[] = [sampleWithRequiredData];
        expectedResult = service.addFormattedLogToCollectionIfMissing(formattedLogCollection, undefined, null);
        expect(expectedResult).toEqual(formattedLogCollection);
      });
    });

    describe('compareFormattedLog', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareFormattedLog(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareFormattedLog(entity1, entity2);
        const compareResult2 = service.compareFormattedLog(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareFormattedLog(entity1, entity2);
        const compareResult2 = service.compareFormattedLog(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareFormattedLog(entity1, entity2);
        const compareResult2 = service.compareFormattedLog(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
