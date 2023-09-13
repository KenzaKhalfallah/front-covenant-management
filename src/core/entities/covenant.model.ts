import { CounterParty } from './counterparty.model';
import { CovenantCondition } from './covenantCondition.model';

export enum CategoryCovenant {
  FINANCIAL = 1,
  NONFINANCIAL = 2,
}

export enum TypeCovenant {
  AFFIRMATIVE = 1,
  NEGATIVE = 2,
}

export enum PeriodTypeCovenant {
  ANNUAL = 1,
  YTD = 2,
  INTERIM = 3,
}

export enum StatementSourceCovenant {
  COMPANY = 1,
  CONSOLIDATION = 2,
}

export enum LinkedLineItemEnum {
  EBITDA = 1,
  EquityRatio = 2,
  DebtServiceCoverageRatio = 3,
  OperatingCashFlow = 4,
  CurrentRatio = 5,
  GrossProfit = 6,
  DebtToEquityRatio = 7,
  InterestCoverageRatio = 8,
  InventoryTurnover = 9,
}

export class Covenant {
  idCovenant!: number;
  nameCovenant!: string;
  categoryCovenant!: CategoryCovenant;
  descriptionCovenant!: string;
  typeCovenant!: TypeCovenant;
  periodTypeCovenant!: PeriodTypeCovenant;
  statementSourceCovenant!: StatementSourceCovenant;
  linkedLineItem!: LinkedLineItemEnum;
  covenantConditions!: Array<CovenantCondition>;
  idCounterparty!: number;

  counterParty?: CounterParty | null;
}
