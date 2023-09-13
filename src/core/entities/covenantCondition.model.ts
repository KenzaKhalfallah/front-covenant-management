import { CovenantResult } from './covenantResult.model';
import { FinancialData } from './financialData.model';

export enum BreachWeight {
  MAJOR = 1,
  MODERATE = 2,
  MINOR = 3,
}

// Class to represent CovenantCondition
export class CovenantCondition {
  idCondition!: number;
  startDateCondition!: Date;
  endDateCondition!: Date;
  lowerLimitCondition!: number;
  upperLimitCondition!: number;
  contractualFlagCondition!: boolean;
  exceptionFlagCondition!: boolean;
  breachWeight!: BreachWeight;
  idCovenant!: number; // Required foreign key property
  covenantResult!: CovenantResult;
  financialData!: FinancialData;
}
