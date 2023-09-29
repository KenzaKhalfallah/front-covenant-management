import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';

@Injectable({
  providedIn: 'root',
})
export class PdfService {
  constructor() {}

  formatDate(dateString: any) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Add leading zero if needed
    const day = String(date.getDate()).padStart(2, '0'); // Add leading zero if needed
    return `${year}-${month}-${day}`;
  }

  generatePdf(counterpartyData: any, covenantData: any, conditionData: any) {
    const pdf = new jsPDF();
    let categoryCovenant = '';
    if (covenantData.categoryCovenant === 1) {
      categoryCovenant = 'Financial';
    } else if (covenantData.categoryCovenant === 2) {
      categoryCovenant = ' Non Financial';
    }
    let typeCovenant = '';
    if (covenantData.typeCovenant === 1) {
      typeCovenant = 'Affirmative';
    } else if (covenantData.typeCovenant === 2) {
      typeCovenant = ' Negative';
    }
    let periodTypeCovenant = '';
    if (covenantData.periodTypeCovenant === 1) {
      periodTypeCovenant = 'Annual';
    } else if (covenantData.periodTypeCovenant === 2) {
      periodTypeCovenant = ' YTD';
    } else if (covenantData.periodTypeCovenant === 3) {
      periodTypeCovenant = 'Interim';
    }
    let statementSourceCovenant = '';
    if (covenantData.statementSourceCovenant === 1) {
      statementSourceCovenant = 'Company';
    } else if (covenantData.statementSourceCovenant === 2) {
      statementSourceCovenant = 'Consolidation';
    }
    let linkedLineItem = '';
    if (covenantData.linkedLineItem === 1) {
      linkedLineItem = 'EBITDA';
    } else if (covenantData.linkedLineItem === 2) {
      linkedLineItem = 'EquityRatio';
    } else if (covenantData.linkedLineItem === 3) {
      linkedLineItem = 'DebtServiceCoverageRatio';
    } else if (covenantData.linkedLineItem === 4) {
      linkedLineItem = 'OperatingCashFlow';
    } else if (covenantData.linkedLineItem === 5) {
      linkedLineItem = 'CurrentRatio';
    } else if (covenantData.linkedLineItem === 6) {
      linkedLineItem = 'GrossProfit';
    } else if (covenantData.linkedLineItem === 7) {
      linkedLineItem = 'DebtToEquityRatio';
    } else if (covenantData.linkedLineItem === 8) {
      linkedLineItem = 'InterestCoverageRatio';
    } else if (covenantData.linkedLineItem === 9) {
      linkedLineItem = 'InventoryTurnover';
    }

    //Title, covenant Name
    const covenantTitle = covenantData.nameCovenant;
    const titleX =
      pdf.internal.pageSize.getWidth() / 2 -
      (pdf.getStringUnitWidth(covenantTitle) * 12) / 2;
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(18);
    pdf.text(covenantTitle, titleX, 20);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(12);
    const attributeY = 40;
    pdf.text(`Category: ${categoryCovenant}`, 10, attributeY);
    pdf.text(`Type: ${typeCovenant}`, 10, attributeY + 10);
    pdf.text(`Period Type: ${periodTypeCovenant}`, 10, attributeY + 20);
    pdf.text(
      `Statement Source: ${statementSourceCovenant}`,
      10,
      attributeY + 30
    );
    pdf.text(`Linked Line Item: ${linkedLineItem}`, 10, attributeY + 40);
    // Split the description into multiple lines if it's too long
    const descriptionLines = pdf.splitTextToSize(
      `Description: ${covenantData.descriptionCovenant}`,
      pdf.internal.pageSize.getWidth() - 20
    );
    pdf.text(descriptionLines, 10, attributeY + 50);

    //Counterparty
    pdf.text(`Counterparty : ${counterpartyData.name}`, 10, attributeY + 100);
    pdf.text(`Email : ${counterpartyData.email}`, 10, attributeY + 110);
    pdf.text(
      `Phone Number: ${counterpartyData.phoneNumber}`,
      10,
      attributeY + 120
    );

    //Conditions
    pdf.text(`Table of Conditions`, titleX, attributeY + 140);
    const tableHeaders = [
      'Start Date',
      'End Date',
      'Lower Limit',
      'Upper Limit',
      'Contractual',
      'Exception',
      'Breach',
    ];
    let tableY = attributeY + 150;
    const availableWidth = pdf.internal.pageSize.getWidth() - 20;
    const columnWidth = availableWidth / tableHeaders.length;
    let tableX = 10;
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    for (let i = 0; i < tableHeaders.length; i++) {
      pdf.rect(tableX, tableY, columnWidth, 10);
      pdf.text(tableHeaders[i], tableX + 2, tableY + 5);
      tableX += columnWidth;
    }
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(12);
    tableY += 10;
    conditionData.forEach((condition: any) => {
      // Determine the breachWeight text
      let breachWeight = '';
      if (condition.breachWeight === 1) {
        breachWeight = 'major';
      } else if (condition.breachWeight === 2) {
        breachWeight = 'moderate';
      } else if (condition.breachWeight === 3) {
        breachWeight = 'minor';
      }

      const rowData = [
        this.formatDate(condition.startDateCondition),
        this.formatDate(condition.endDateCondition),
        condition.lowerLimitCondition,
        condition.upperLimitCondition,
        condition.contractualFlagCondition,
        condition.exceptionFlagCondition,
        breachWeight,
      ];
      tableX = 10;
      for (let i = 0; i < tableHeaders.length; i++) {
        pdf.rect(tableX, tableY, columnWidth, 10);
        pdf.text(String(rowData[i]), tableX + 2, tableY + 5);
        tableX += columnWidth;
      }
      tableY += 10;
    });

    const pdfBlob = pdf.output('blob');

    return pdfBlob;
  }
}
