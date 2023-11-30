import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import { NgModel } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  styles: [`
    .dark-snackbar {
      background-color: #333;
      color: #fff;
    }
  `],
})
export class AppComponent implements OnInit {
  isChecked: any;
  @ViewChild('table') table!: ElementRef;
  @ViewChild('column') column!: ElementRef;
  @ViewChild('myInput1') myInput1!: ElementRef;
  @ViewChild('myInput2') myInput2!: ElementRef;

  //Data able creation

  adRow() {
    const tableFields = document.getElementById('columnTable') as HTMLTableElement;
    const newTableRow = tableFields.insertRow();
    const cellCheckbox = newTableRow.insertCell(0);
    const checkboxField = document.createElement('input');
    checkboxField.type = 'checkbox';
    cellCheckbox.appendChild(checkboxField);

    const cellFieldName = newTableRow.insertCell(1);
    const inputFieldName = document.createElement('input');
    inputFieldName.type = 'text';
    inputFieldName.size = 6;
    inputFieldName.placeholder = "new field";
    cellFieldName.appendChild(inputFieldName);

    const cellFieldDataType = newTableRow.insertCell(2);
    const inputDataType = document.createElement('input');
    inputDataType.type = 'text';
    inputDataType.size = 4;
    cellFieldDataType.appendChild(inputDataType);

  }

  getTableIndex(tabi: HTMLTableElement): number | null {

    let x: number | null = null;
    for (let i = 0; i < tabi.rows.length; i++) {
      const row = tabi.rows[i];
      row.addEventListener('click', function (event) {
        const clickedRow = event.currentTarget as HTMLTableRowElement;
        x = clickedRow.rowIndex;
        console.log("rowindex ez: " + x)

      })
    }
    return x;

  }



  rowIndex() {

    const tableFields = document.getElementById('columnTable') as HTMLTableElement;
    console.log(tableFields.rows[1].cells[3])
    for (let i = 0; i < tableFields.rows.length; i++) {
      const row = tableFields.rows[i];
      row.addEventListener('click', function (event) {
        const clickedRow = event.currentTarget as HTMLTableRowElement;
        const rowIndex = clickedRow.rowIndex;
        console.log(`Kattintott sor indexe: ${rowIndex}`);
      })
    }
  }

  deleteRow() {

    const tableFields = document.getElementById('columnTable') as HTMLTableElement;

    // const tableFields1 = document.getElementById('kutya') as HTMLInputElement;
    //console.log("mi van: "+tableFields1.checked);
    //console.log("mi ez "+tableFields.rows[1].cells[3].)
    for (let i = 0; i < tableFields.rows.length; i++) {
      const row = tableFields.rows[i];
      row.addEventListener('click', function (event) {
        const clickedRow = event.currentTarget as HTMLTableRowElement;
        const rowIndex = clickedRow.rowIndex;
        console.log(`Kattintott sor indexe: ${rowIndex}`);
      })
    }

  }

  //End of data table

  sqlQuery: string = '';
  columns: string[] = [];
  tableName: string = '';

  title = 'sql-query-executor';
  regexTable: RegExp = /(from|join)\s+(\w+)/g;
  regexColumn: RegExp = /SELECT\s+(.+?)\s+FROM/i;

  constructor(private clipboardService: ClipboardService,
    private snackBar: MatSnackBar
    ) {
  }
  copyToClipboard(content: string, inputId: string): void {
    // Get the native input element using the provided inputId
    const copyText: HTMLInputElement = (this as any)[inputId].nativeElement;
    // Select the text field
    copyText.select();
    // Copy the text using the ClipboardService
    this.clipboardService.copyFromContent(content);
    // Show a MatSnackBar notification
    this.snackBar.open(`Copied the text: ${content}`, 'Close', {
      duration: 3000,
    });
  }


  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  executeQuery() {
    // Parse the SQL query to extract column names
    this.columns = this.parseSqlQuery(this.sqlQuery);
  }

  getTableNames(sqlQuery: string): string[] | null {
    const matchTableName = sqlQuery.match(this.regexTable)?.map(e => e.split(' ')[1]);
    if (matchTableName == null) { return null }
    else { return matchTableName };

  }

  getColumnNames(sqlQuery: string): string[] | null {
    const matchColumnName = sqlQuery.match(this.regexColumn)?.map(e => e.split(' ')[1]);
    if (matchColumnName == null) { return null }
    else { return matchColumnName };

  }


  separate() {
    let sqlCommand = document.getElementById('sqlText') as HTMLInputElement;
    let sqlDetail = document.getElementById('detailText') as HTMLInputElement;
    let kacsa: string[] | null;
    kacsa = this.getColumnNames(sqlCommand.value);
    kacsa?.forEach((value, index) => {
      console.log(`Elem ${index + 1}: ${value}`);
    });
    console.log("tutykos regex2 tábla : " + this.getTableNames(sqlCommand.value));
    console.log("tutykos regex oszlop :  " + this.getColumnNames(sqlCommand.value));
    sqlDetail.value = sqlCommand.value;

  }


  private parseSqlQuery(sqlQuery: string): string[] {
    const selectIndex = sqlQuery.toUpperCase().indexOf('SELECT');
    const fromIndex = sqlQuery.toUpperCase().lastIndexOf('FROM');

    if (selectIndex !== -1 && fromIndex !== -1 && selectIndex < fromIndex) {
      const selectClause = sqlQuery.substring(selectIndex + 'SELECT'.length, fromIndex).trim();
      console.log("Select Clause: " + selectClause);

      const extractColumns = (clause: string): string[] => {
        const columnParts = clause.split(',');

        return columnParts.flatMap((part: string): string[] => {
          const asIndex = part.toUpperCase().lastIndexOf(' AS ');

          if (asIndex !== -1) {
            // Extract the alias as the column name
            return [part.substring(asIndex + ' AS '.length).trim()];
          } else if (part.toUpperCase().includes('SELECT')) {
            // Handle nested SELECT statement inside parentheses
            const nestedSelectMatches = part.match(/\(([^)]+)\)\s*(\w+)?/);

            if (nestedSelectMatches) {
              // Extract what's after the nested SELECT
              const [, nestedSelect, nestedColumn] = nestedSelectMatches;
              return [nestedColumn || nestedSelect];
            }
          } else {
            // Extract the column name and alias, handling table prefix
            const columnMatch = part.match(/(?:\w+\.)?(\w+)(?:\s*AS\s*(\w+))?/);
            if (columnMatch) {
              const [, columnName, alias] = columnMatch;
              return [alias || columnName];
            }
          }
          return [];
        });
      };

      // Extracting column names
      const columnNames: string[] = extractColumns(selectClause);

      console.log("Column Names: " + columnNames);
      return columnNames;

    } else {
      return ['Invalid SQL query'];
    }
  }

  // Method to display the concatenated string in the textarea
  displayTable(): string {
    // Prefix each column with the table name and join them with commas
    const columnsWithTableName = this.columns.map(column => `${this.tableName}.${column}`).join(', ');
    return `${columnsWithTableName}`;
  }

}



