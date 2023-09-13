export class ResultNote {
  idNote!: number;
  textNote!: string;
  isArchived: boolean = false; // New property to indicate if the note is archived
  idCovenantResult!: number;
}
