import { ResultNote } from './resultNote.model';

export enum ResultStatus {
  PASSED = 1,
  FAILED = 2,
}

// Class to represent CovenantResult
export class CovenantResult {
  idResult!: number;
  resultStatus!: ResultStatus;
  resultDate!: Date;
  resultNotes!: Array<ResultNote>;
  idCondition!: number;
}
