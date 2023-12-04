import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import { NgModel } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  isChecked: any;
  @ViewChild('table') table!: ElementRef;
  @ViewChild('column') column!: ElementRef;

  sqlQuery: string = '';
  columns: string[] = [];
  //columnsTable: contains the all fields
  columnsTable: string[] = [];
  tableName: string = '';
  matrixTable: string[][] = [];
  //matrixTableTranspone: contains the fields and types
  matrixTableTranspone: string[][] = [];
  pKeyCheckbox: boolean[] = new Array(500).fill(false);
  delCheckbox: boolean[] = new Array(500).fill(false);
  isnullCheckbox: boolean[] = new Array(500).fill(false);

  title = 'sql-query-executor';
  regexTable: RegExp = /(from|join)\s+(\w+)/g;
  regexColumn: RegExp = /SELECT\s+(.+?)\s+FROM/i;

  constructor(private clipboardService: ClipboardService,
    private snackBar: MatSnackBar
  ) { }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  adRow() {
    let typeText: string;
    const tableFields = document.getElementById('columnTable') as HTMLTableElement;
    const newTableRow = tableFields.insertRow();
    const cellCheckbox = newTableRow.insertCell(0);
    const checkboxField = document.createElement('input');
    checkboxField.type = 'checkbox';

    cellCheckbox.appendChild(checkboxField);
    const cellCheckboxNotNull = newTableRow.insertCell(1);
    const checkboxNotNull = document.createElement('input');
    checkboxNotNull.type = 'checkbox';
    cellCheckboxNotNull.appendChild(checkboxNotNull);

    const cellFieldName = newTableRow.insertCell(2);
    const inputFieldName = document.createElement('input');
    inputFieldName.type = 'text';
    inputFieldName.size = 6;
    inputFieldName.placeholder = "new field";
    cellFieldName.appendChild(inputFieldName);
    const cellFieldDataType = newTableRow.insertCell(3);
    const inputDataType = document.createElement('input');
    inputDataType.type = 'text';
    inputDataType.size = 4;
    cellFieldDataType.appendChild(inputDataType);
    const cellCheckboxDel = newTableRow.insertCell(4);
    const button = document.createElement("button");
    button.textContent = "ok";
    button.style.color = "blue";
    button.className = "btn btn-primary";

    button.addEventListener("click", () => {
      let newInstance: string[] = [];
      newInstance.push(inputFieldName.value);
      newInstance.push(inputDataType.value);
      this.matrixTableTranspone.push(newInstance);
      this.columnsTable.push(inputFieldName.value);
      typeText = inputDataType.value;
      //console.log(typeText);
      tableFields.deleteRow(this.columnsTable.length);
      this.pKeyCheckbox[tableFields.rows.length - 1] = checkboxField.checked;
      this.isnullCheckbox[tableFields.rows.length - 1] = checkboxNotNull.checked;
    });
    cellCheckboxDel.appendChild(button);
    console.log(this.columnsTable);
  }


  /* onKeydownEvent($event: KeyboardEvent){
    // <textarea name="" id="" cols="5" rows="1" (keydown)="onKeydownEvent($event)"></textarea>
    // you can use the following for checking enter key pressed or not
    if ($event.key === 'Enter') {
      console.log("ez a lenyomás "+$event.key); // Enter
    }
    if ($event.key === 'Enter') {
           //This is 'Shift+Enter'
    }
  } */


  // get back the data types of fields
  getDataType(): string[] {
    const tableFields = document.getElementById('columnTable') as HTMLTableElement;
    let dataTypes: string[] | any = [];
    for (let i = 0; i < tableFields.rows.length - 1; i++) {

      dataTypes.push(tableFields.rows[i + 1].cells[2].textContent);
    }
    return dataTypes;
  }

  deleteRow() {

    const tableFields = document.getElementById('columnTable') as HTMLTableElement;
    let delIndex = 0;
    for (let i = 0; i < tableFields.rows.length - 1; i++) {
      if (this.delCheckbox[i]) {

        this.columnsTable.splice(delIndex, 1);
        this.matrixTableTranspone.splice(delIndex, 1);
        this.delCheckbox[i] = false;
        for (let k = i; k < tableFields.rows.length - 1; k++) {
          this.pKeyCheckbox[k] = this.pKeyCheckbox[k + 1];
          this.isnullCheckbox[k] = this.isnullCheckbox[k + 1];
        }
        delIndex--;
      }
      delIndex++;
      // console.log("ez a "+i+" -dik nagyteszt a deletnek: "+this.approvalCheckboxes2[i]);
      // console.log("ez a "+i+" -dik nagyteszt a pkeynek: "+this.approvalCheckboxes[i]);
      //console.log("hányszor fut a ciklus: " + i);
    }
    console.log(this.columnsTable);
  }

  private transposeMatrix(matrix: string[][]): string[][] {
    return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
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

  executeQuery() {
    // Parse the SQL query to extract column names
    this.columns = this.parseSqlQuery(this.sqlQuery);
    this.columnsTable = this.columns.slice();
    this.matrixTable[0] = this.columns.slice();
    let emptyArray: string[] = [];
    emptyArray.fill("", 0, this.columns.length);
    this.matrixTable[1] = emptyArray.slice();
    this.matrixTable[1].fill("", 0, this.columns.length);
    this.matrixTableTranspone = this.transposeMatrix(this.matrixTable);


  }
  /*
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
    */

  /*
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
  */

  private parseSqlQuery(sqlQuery: string): string[] {
    const selectIndex = sqlQuery.toUpperCase().indexOf('SELECT');
    const fromIndex = sqlQuery.toUpperCase().lastIndexOf('FROM');

    if (selectIndex !== -1 && fromIndex !== -1 && selectIndex < fromIndex) {
      const selectClause = sqlQuery.substring(selectIndex + 'SELECT'.length, fromIndex).trim();
      // console.log("Select Clause: " + selectClause);

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
    const columnsWithTableName = this.columnsTable.map(column => `${this.tableName}.${column}`).join(', ');
    return `${columnsWithTableName}`;
  }

  displayColumn(): string {
    // Prefix each column with the table name and join them with commas
    const columnsName = this.columnsTable.map(column => `${column}`).join(', ');
    return `${columnsName}`;
  }

  displayMatrixTableTranspone(): string {
    const columnAndType = this.matrixTableTranspone.map(matrix => `${matrix[0]}` + ' ' + `${matrix[1]}`).join(', ');
    console.log(this.matrixTableTranspone);
    return `${columnAndType}`;
  }

}



