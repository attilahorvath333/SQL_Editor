import { Component, OnInit } from '@angular/core';
import { NgModel } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
isChecked: any;

sqlQuery: string = '';
columns: string[] = [];
//columnsTable: contains the all fields
columnsTable: string[] = [];
tableName: string = '';
matrixTable: string [][]=[];
//matrixTableTranspone: contains the fields and types
matrixTableTranspone: string[][]=[];
pKeyCheckbox: boolean[] = new Array(500).fill(false);
delCheckbox: boolean[] = new Array(500).fill(false);
isnullCheckbox: boolean[] = new Array(500).fill(false);
title = 'sql-query-executor';
regexTable: RegExp = /(from|join)\s+(\w+)/g;
regexColumn: RegExp = /SELECT\s+(.+?)\s+FROM/i;


constructor() {
}

adRow() {
  let typeText:string;
  const tableFields = document.getElementById('columnTable') as HTMLTableElement;
  const newTableRow = tableFields.insertRow();
  const cellCheckbox = newTableRow.insertCell(0);
  const checkboxField = document.createElement('input');
  checkboxField.type='checkbox';

  cellCheckbox.appendChild(checkboxField);
  const cellCheckboxNotNull = newTableRow.insertCell(1);
  const checkboxNotNull = document.createElement('input');
  checkboxNotNull.type='checkbox';
  cellCheckboxNotNull.appendChild(checkboxNotNull);

  const cellFieldName = newTableRow.insertCell(2);
  const inputFieldName = document.createElement('input');
  inputFieldName.type = 'text';
  inputFieldName.size=6;
  inputFieldName.placeholder="new field";
  cellFieldName.appendChild(inputFieldName);
  const cellFieldDataType = newTableRow.insertCell(3);
  const inputDataType = document.createElement('input');
  inputDataType.type= 'text';
  inputDataType.size=4;
  cellFieldDataType.appendChild(inputDataType);
  const cellCheckboxDel = newTableRow.insertCell(4);
  const button = document.createElement("button");
  button.textContent="ok";
  button.style.color="blue";
  button.className="btn btn-primary";
  
  button.addEventListener("click", () => {
    let newIstance:string[]=[];
    newIstance.push(inputFieldName.value);
    newIstance.push(inputDataType.value);
    this.matrixTableTranspone.push(newIstance);
    this.columnsTable.push(inputFieldName.value);
    typeText=inputDataType.value;
    console.log(typeText);
    tableFields.deleteRow(this.columnsTable.length);
    this.pKeyCheckbox[tableFields.rows.length-1]=checkboxField.checked;
    this.isnullCheckbox[tableFields.rows.length-1]=checkboxNotNull.checked;
  });
  cellCheckboxDel.appendChild(button);
}


onKeydownEvent($event: KeyboardEvent){
  
  if ($event.key) {
    console.log("valamiféle lenyomás történt"+$event.key); // Enter
  }
  if ($event.key === 'Enter') {
    console.log("ez a lenyomás "+$event.key); // Enter
  }
  if ($event.key === 'Enter') {
         //This is 'Shift+Enter' 
  }
}

editRows(){
  const tableFields = document.getElementById('columnTable') as HTMLTableElement;
  for (let i =0; i<tableFields.rows.length-1; i++){
  tableFields.rows[i+1].cells[2].contentEditable='true';
  tableFields.rows[i+1].cells[2].style.backgroundColor= 'Cornsilk';
  tableFields.rows[i+1].cells[3].contentEditable='true';
  tableFields.rows[i+1].cells[3].style.backgroundColor= 'Cornsilk';
  }
  let updateBtn = document.getElementById('updateButton') as HTMLElement;
  updateBtn.hidden=false;
  let editBtn = document.getElementById('editButton') as HTMLElement;
  editBtn.hidden=true;
}


updateRows(){
  const tableFields = document.getElementById('columnTable') as HTMLTableElement;
  for (let i =0; i<tableFields.rows.length-1; i++){
     const checkboxField = document.createElement('input');
     checkboxField.type='checkbox';
     let name1 =   tableFields.rows[i+1].cells[2].textContent as string;
     let name2 =   tableFields.rows[i+1].cells[3].textContent as string; 
     this.matrixTableTranspone[i][0]=name1;
     this.matrixTableTranspone[i][1]=name2;
     tableFields.rows[i+1].cells[2].style.backgroundColor= '#fff';
     tableFields.rows[i+1].cells[3].style.backgroundColor= '#fff';
    }
    let updateBtn = document.getElementById('updateButton') as HTMLElement;
    updateBtn.hidden=true;
    let editBtn = document.getElementById('editButton') as HTMLElement;
    editBtn.hidden=false;
  }



// get back the data types of fields
getDataType():string[] {
  const tableFields = document.getElementById('columnTable') as HTMLTableElement;
 let  dataTypes: string[] | any =[];
  for (let i =0; i<tableFields.rows.length-1; i++){
    
    dataTypes.push(tableFields.rows[i+1].cells[2].textContent);
  }
  return dataTypes;
}

deleteRow() {
  
  const tableFields = document.getElementById('columnTable') as HTMLTableElement;
  let delIndex=0;
  for (let i =0; i<tableFields.rows.length-1; i++){
    if (this.delCheckbox[i]) {
    this.columnsTable.splice(delIndex,1);
    this.matrixTableTranspone.splice(delIndex,1);
    this.delCheckbox[i]=false;
    for (let k =i; k<tableFields.rows.length-1; k++){
    this.pKeyCheckbox[k]= this.pKeyCheckbox[k+1];
    this.isnullCheckbox[k]= this.isnullCheckbox[k+1];
    }
    delIndex--;
    }
    delIndex++;
  }
  }

  private transposeMatrix(matrix: string[][]): string[][] {
    return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
  }



  executeQuery() {
    // Parse the SQL query to extract column names
    this.columns = this.parseSqlQuery(this.sqlQuery);
    this.columnsTable = this.columns.slice();
    this.matrixTable[0] = this.columns.slice();
    let emptyArray: string[] = [];
    emptyArray.fill("", 0, this.columns.length);
    this.matrixTable[1] = emptyArray.slice();
    for (let i = 0; i < this.columns.length; i++) {
      this.matrixTable[1][i]= " ";
    }
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
  const columnsWithTableName = this.columns.map(column => `${this.tableName}.${column}`).join(', ');
  return `${columnsWithTableName}`;
}
}
