import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
//npm install ngx-clipboard --save
import { ClipboardService } from 'ngx-clipboard';
import { NgModel } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
//ng add @angular/material
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  template: `
  <textarea appExpandable [(expanded)]="textarea1Expanded"></textarea>
  <textarea appExpandable [(expanded)]="textarea2Expanded"></textarea>
  <!-- Add more textareas as needed -->
`
})
export class AppComponent implements OnInit {
  isChecked: any;
  @ViewChild('table') table!: ElementRef;
  @ViewChild('column') column!: ElementRef;
  @ViewChild('tempTable') tempTable!: ElementRef;

  textarea1Expanded: boolean = false;
  textarea2Expanded: boolean = false;
  textarea3Expanded: boolean = false;
  textarea4Expanded: boolean = false;
  textarea5Expanded: boolean = false;
  textarea6Expanded: boolean = false;

  sqlQuery: string = '';
  columns: string[] = [];
  //columnsTable: contains the all fields
  columnsTable: string[] = [];
  tableName: string = '';
  tempTableName: string = '';
  mergeTableName: string = '';
  groupName: string = '';
  tabName: string = '';
  tabAfterName: string = '';
  tabBeforeName: string = '';
  tab4: string = '';
  beginning: string = '';
  end: string = '';
  freeHelper: string = '';
  freeHelperBefore: string = '';
  matrixTable: string[][] = [];
  //matrixTableTranspone: contains the fields and types
  matrixTableTranspone: string[][] = [];
  //pKeyCheckbox: boolean[] = [];
  pKeyCheckbox: boolean[] = []; //new Array(1).fill(false);
  delCheckbox: boolean[] = []; // new Array(500).fill(false);
  isnullCheckbox: boolean[] = [] // new Array(500).fill(false);
  showTextarea: boolean = false;
  title = 'sql-query-executor';
  regexTable: RegExp = /(from|join)\s+(\w+)/g;
  regexColumn: RegExp = /SELECT\s+(.+?)\s+FROM/i;

  constructor(private clipboardService: ClipboardService,
    private snackBar: MatSnackBar
  ) { }
  ngOnInit(): void {

  }

  onCheckboxChange() {
    alert("változás :)");
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
  editRows() {
    const tableFields = document.getElementById('columnTable') as HTMLTableElement;
    for (let i = 0; i < tableFields.rows.length - 1; i++) {
      tableFields.rows[i + 1].cells[2].contentEditable = 'true';
      tableFields.rows[i + 1].cells[2].style.backgroundColor = 'Cornsilk';
      tableFields.rows[i + 1].cells[3].contentEditable = 'true';
      tableFields.rows[i + 1].cells[3].style.backgroundColor = 'Cornsilk';
    }
    let updateBtn = document.getElementById('updateButton') as HTMLElement;
    updateBtn.hidden = false;
    let editBtn = document.getElementById('editButton') as HTMLElement;
    editBtn.hidden = true;
  }

  updateRows() {
    const tableFields = document.getElementById('columnTable') as HTMLTableElement;
    for (let i = 0; i < tableFields.rows.length - 1; i++) {
      const checkboxField = document.createElement('input');
      checkboxField.type = 'checkbox';
      let name1 = tableFields.rows[i + 1].cells[2].textContent?.trim() as string;
      let name2 = tableFields.rows[i + 1].cells[3].textContent?.trim() as string;
      this.matrixTableTranspone[i][0] = name1;
      this.matrixTableTranspone[i][1] = name2;
      tableFields.rows[i + 1].cells[2].style.backgroundColor = '#fff';
      tableFields.rows[i + 1].cells[3].style.backgroundColor = '#fff';
    }
    let updateBtn = document.getElementById('updateButton') as HTMLElement;
    updateBtn.hidden = true;
    let editBtn = document.getElementById('editButton') as HTMLElement;
    editBtn.hidden = false;
  }

  // get back the data types of fields
  getDataType(): string[] {
    const tableFields = document.getElementById('dataTable') as HTMLTableElement;
    let dataTypes: string[] | any = [];
    for (let i = 0; i < tableFields.rows.length - 1; i++) {

      dataTypes.push(tableFields.rows[i + 1].cells[3].textContent);
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
  }

  private transposeMatrix(matrix: string[][]): string[][] {
    return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
  }

  copyToClipboard(content: string, inputId: string): void {
    // Get the native input element using the provided inputId
    const copyText: HTMLInputElement = (this as any)[inputId].nativeElement;
    // Replace newline characters with appropriate line break characters
    const contentWithLineBreaks = content.replace(/\n/g, '\r\n');
    // Select the text field
    copyText.select();
    // Copy the modified text using the ClipboardService
    this.clipboardService.copyFromContent(contentWithLineBreaks);
    // Show a MatSnackBar notification
    this.snackBar.open(`Copied the text: ${content}`, 'Close', {
      duration: 3000,
    });
  }

  teszt() {
    for (let i = 0; i < 10; i++) {
      console.log("true vagy false: " + this.pKeyCheckbox[i]);
    }
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
      this.matrixTable[1][i] = " ";
      this.pKeyCheckbox[i] = false;
      this.isnullCheckbox[i] = false;
      this.delCheckbox[i] = false;
    }
    //this.matrixTable[1].fill("d", 0, this.columns.length);
    this.matrixTableTranspone = this.transposeMatrix(this.matrixTable);



  }

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
            const combinedMatch = part.match(/(?:\w+\.)?(\w+)\s*(?:AS)?\s*(?:\[([^\]]+)\]|'([^']*)'|"([^"]*)"|(\w+))?/i);

            if (combinedMatch) {
              console.log("Combined Match: " + JSON.stringify(combinedMatch));
              const [, columnName, alias1, alias2, alias3, alias4] = combinedMatch;
              const alias = alias1 || alias2 || alias3 || alias4;
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
    const columnsWithTableName = this.matrixTableTranspone.map(matrix => `${this.tableName}.${matrix[0]}`).join(', ');
    return `${columnsWithTableName}`;
  }

  displayColumn(): string {
    const columnsName = this.matrixTableTranspone.map(matrix => `${matrix[0]}`).join(', ');
    return `${columnsName}`;
  }

  displayMatrixTableTranspone(): string {
    const combinedInfo = this.matrixTableTranspone.map(matrix => `${matrix[0]} ${matrix[1]}`).join(', ');
    return combinedInfo;
  }

  displayEverything(): string {
    const combinedInfo = this.matrixTableTranspone.map((matrix, index) => {
      const checkboxInfo = this.isnullCheckbox[index] ? `not null` : `null`;
      return `${matrix[0]} ${matrix[1]} ${checkboxInfo}`;
    }).join(', ');

    return combinedInfo;
  }

  displayPKey(): string {
    const combinedInfo = this.matrixTableTranspone.map((matrix, index) => {
      const checkboxInfo = this.pKeyCheckbox[index] ? `${matrix[0]}` : '';
      return `${checkboxInfo}`;
    }).filter(Boolean).join(', ').trim();
    return combinedInfo;
  }

  displayTableAndField(): string {
    const tableNameAndField = this.matrixTableTranspone.map(matrix => `${this.tableName}` + '.' + `${matrix[0]}`).join(', ');
    return `${tableNameAndField}`
  }

  displayMergeCell(): string {
    let mergeContent: string =
      "DECLARE @merge" + this.mergeTableName + "Result as TABLE (mAction nvarchar(10)," + this.matrixTableTranspone.filter((matrix, index) => this.pKeyCheckbox[index]).map(matrix => `${"d" + matrix[0]}` + ' ' + `${matrix[1]}` + ' ' + `${"i" + matrix[0]}` + ' ' + `${matrix[1]}`).join(', ') + ");\n" +
      "WITH cte_mergeSource AS\n" +
      "   (SELECT " + this.matrixTableTranspone.map(matrix => `${this.mergeTableName + "new"}.${matrix[0]}`).join(', ') + "\n" +
      "    FROM dbo." + this.mergeTableName + "new), \n" +
      "   cte_mergeDestination AS \n" +
      "   (SELECT " + this.matrixTableTranspone.map(matrix => `${this.mergeTableName}.${matrix[0]}`).join(', ') + "\n" +
      "    FROM dbo." + this.mergeTableName + ")\n" +
      "   MERGE INTO cte_mergeDestination\n" +
      "   USING cte_mergeSource\n" +
      "   ON " + this.matrixTableTranspone.filter((matrix, index) => this.pKeyCheckbox[index]).map(matrix => 'cte_mergeDestination.' + `${matrix[0]}` + ' = cte_mergeSource.' + `${matrix[0]}`).join(' AND ') + "\n" +
      "   WHEN MATCHED AND NOT EXISTS(SELECT " + this.matrixTableTranspone.filter((matrix, index) => !this.pKeyCheckbox[index]).map(matrix => 'cte_mergeDestination.' + `${matrix[0]}`).join(', ') + "\n" +
      "                               INTERSECT \n" +
      "                               SELECT " + this.matrixTableTranspone.filter((matrix, index) => !this.pKeyCheckbox[index]).map(matrix => 'cte_mergeSource.' + `${matrix[0]}`).join(', ') + ")\n" +
      "                               THEN\n" +
      "       UPDATE SET " + this.matrixTableTranspone.filter((matrix, index) => !this.pKeyCheckbox[index]).map(matrix => `${matrix[0]}` + ' = cte_mergeSource.' + `${matrix[0]}`).join(', ') + "\n" +
      "   WHEN NOT MATCHED BY TARGET THEN\n" +
      "       INSERT (" + this.matrixTableTranspone.map(matrix => `${matrix[0]}`).join(', ') + ")\n" +
      "       VALUES (" + this.matrixTableTranspone.map(matrix => 'cte_mergeSource.' + `${matrix[0]}`).join(', ') + ")\n" +
      "   WHEN NOT MATCHED BY SOURCE THEN\n" +
      "       DELETE\n" +
      "   OUTPUT $action mAction, " + this.matrixTableTranspone.filter((matrix, index) => this.pKeyCheckbox[index]).map(matrix => `${"deleted." + matrix[0]}` + ', ' + `${"inserted." + matrix[0]}`).join(', ') + "\n" +
      "   INTO @merge" + this.mergeTableName + "Result;\n" +
      "DECLARE @stepBez VarChar(max) = ''\n" +
      "SELECT @stepBez = '- Info zu Merge " + this.mergeTableName + " (INSERT = ' + CAST(COUNT(CASE WHEN tabvar.mAction = 'INSERT' THEN 1 END) AS VARCHAR(36)) + ', UPDATE = ' + CAST(COUNT(CASE WHEN tabvar.mAction = 'UPDATE' THEN 1 END) AS VARCHAR(36)) + ', DELETE = ' + CAST(COUNT(CASE WHEN tabvar.mAction = 'DELETE' THEN 1 END) AS VARCHAR(36)) + ') '\n" +
      "FROM @mergekacsaResult tabvar"

    let mergeContentSpBlock: string =
      "-----------------------------------------------------------------------------------------------------------\n" +
      "SELECT @stepBez = '- - merge in " + this.mergeTableName + "', @stepPrintCount = 1, @stepRaiseError = 1;\n" +
      "-----------------------------------------------------------------------------------------------------------\n" +
      "BEGIN TRY\n" +
      "   DECLARE @merge" + this.mergeTableName + "Result as TABLE (mAction nvarchar(10)," + this.matrixTableTranspone.filter((matrix, index) => this.pKeyCheckbox[index]).map(matrix => `${"d" + matrix[0]}` + ' ' + `${matrix[1]}` + ' ' + `${"i" + matrix[0]}` + ' ' + `${matrix[1]}`).join(', ') + ");\n" +
      "   WITH cte_mergeSource AS\n" +
      "       (SELECT " + this.matrixTableTranspone.map(matrix => `${this.mergeTableName + "new"}.${matrix[0]}`).join(', ') + "\n" +
      "       FROM dbo." + this.mergeTableName + "new), \n" +
      "       cte_mergeDestination AS \n" +
      "       (SELECT " + this.matrixTableTranspone.map(matrix => `${this.mergeTableName}.${matrix[0]}`).join(', ') + "\n" +
      "       FROM dbo." + this.mergeTableName + ")\n" +
      "       MERGE INTO cte_mergeDestination\n" +
      "       USING cte_mergeSource\n" +
      "       ON " + this.matrixTableTranspone.filter((matrix, index) => this.pKeyCheckbox[index]).map(matrix => 'cte_mergeDestination.' + `${matrix[0]}` + ' = cte_mergeSource.' + `${matrix[0]}`).join(' AND ') + "\n" +
      "       WHEN MATCHED AND NOT EXISTS(SELECT " + this.matrixTableTranspone.filter((matrix, index) => !this.pKeyCheckbox[index]).map(matrix => 'cte_mergeDestination.' + `${matrix[0]}`).join(', ') + "\n" +
      "                                   INTERSECT \n" +
      "                                   SELECT " + this.matrixTableTranspone.filter((matrix, index) => !this.pKeyCheckbox[index]).map(matrix => 'cte_mergeSource.' + `${matrix[0]}`).join(', ') + ")\n" +
      "                                   THEN\n" +
      "          UPDATE SET " + this.matrixTableTranspone.filter((matrix, index) => !this.pKeyCheckbox[index]).map(matrix => `${matrix[0]}` + ' = cte_mergeSource.' + `${matrix[0]}`).join(', ') + "\n" +
      "       WHEN NOT MATCHED BY TARGET THEN\n" +
      "           INSERT (" + this.matrixTableTranspone.map(matrix => `${matrix[0]}`).join(', ') + ")\n" +
      "          VALUES (" + this.matrixTableTranspone.map(matrix => 'cte_mergeSource.' + `${matrix[0]}`).join(', ') + ")\n" +
      "       WHEN NOT MATCHED BY SOURCE THEN\n" +
      "           DELETE\n" +
      "       OUTPUT $action mAction, " + this.matrixTableTranspone.filter((matrix, index) => this.pKeyCheckbox[index]).map(matrix => `${"deleted." + matrix[0]}` + ', ' + `${"inserted." + matrix[0]}`).join(', ') + "\n" +
      "       INTO @merge" + this.mergeTableName + "Result;\n" +
      "       EXEC dbo.up_setProt @KatID, @stepBez OUTPUT, @SPName, '', @@ERROR, @ProtOnlyITL, 0 /*PrgNr*/, @Version, @DebugPrint, @stepPrintCount, @@RowCount, 2 /*Statement LogLevel*/, @GlobalLogLevel, @ErrorID OUTPUT, @RowCount OUTPUT;\n" +
      "END TRY\n" +
      "BEGIN CATCH\n" +
      "   EXEC dbo.up_setProt @KatID, @stepBez OUTPUT, @SPName, '', @@ERROR, @ProtOnlyITL, 0 /*PrgNr*/, @Version, @DebugPrint, @stepPrintCount, @@RowCount, 4 /*Error LogLevel*/, @GlobalLogLevel, @ErrorID OUTPUT, @RowCount OUTPUT;\n" +
      "   IF @stepRaiseError=1 RAISERROR (@stepBez, 11, 1, N'number', 5);\n" +
      "   GOTO FEHLERHAFTESENDE;\n" +
      "END CATCH\n" +
      "\n" +
      "-----------------------------------------------------------------------------------------------------------\n" +
      "SELECT @stepBez = '- Info zu merge in " + this.mergeTableName + "', @stepPrintCount = 0, @stepRaiseError = 1;\n" +
      "-----------------------------------------------------------------------------------------------------------\n" +
      "BEGIN TRY\n" +
      "   SELECT @stepBez = '- Info zu Merge " + this.mergeTableName + " (INSERT = ' + CAST(COUNT(CASE WHEN tabvar.mAction = 'INSERT' THEN 1 END) AS VARCHAR(36)) + ', UPDATE = ' + CAST(COUNT(CASE WHEN tabvar.mAction = 'UPDATE' THEN 1 END) AS VARCHAR(36)) + ', DELETE = ' + CAST(COUNT(CASE WHEN tabvar.mAction = 'DELETE' THEN 1 END) AS VARCHAR(36)) + ') '\n" +
      "   FROM @mergekacsaResult tabvar\n" +
      "   EXEC dbo.up_setProt @KatID, @stepBez OUTPUT, @SPName, '', @@ERROR, @ProtOnlyITL, 0 /*PrgNr*/, @Version, @DebugPrint, @stepPrintCount, @@RowCount, 2 /*Statement LogLevel*/, @GlobalLogLevel, @ErrorID OUTPUT, @RowCount OUTPUT;\n" +
      "END TRY\n" +
      "BEGIN CATCH\n" +
      "   EXEC dbo.up_setProt @KatID, @stepBez OUTPUT, @SPName, '', @@ERROR, @ProtOnlyITL, 0 /*PrgNr*/, @Version, @DebugPrint, @stepPrintCount, @@RowCount, 4 /*Error LogLevel*/, @GlobalLogLevel, @ErrorID OUTPUT, @RowCount OUTPUT;\n" +
      "   IF @stepRaiseError=1 RAISERROR (@stepBez, 11, 1, N'number', 5);\n" +
      "   GOTO FEHLERHAFTESENDE;\n" +
      "END CATCH"


    let existTrue: boolean = this.pKeyCheckbox.some(value => value === true);
    let mergeChk = document.getElementById('mergeCheck') as HTMLInputElement;


    if (!existTrue) { return "No Primary key selected" }
    else {
      if (mergeChk.checked) { return mergeContentSpBlock }
      else {
        return mergeContent
      }
    }
  }

  displayGroup(): string {
    const group = this.matrixTableTranspone.map(matrix => `${this.groupName}` + '(' + `${this.tabName}` + '.' + `${matrix[0]}` + ') ' + `${matrix[0]}`).join(', ');
    return `${group}`;
  }

  displayTab1(): string {
    const group = this.matrixTableTranspone.map(matrix => `${matrix[0]}` + ' = ' + `${this.tabName}` + '.' + `${matrix[0]}`).join(', ');
    return `${group}`;
  }

  displayAfter(): string {
    const after = this.matrixTableTranspone.map(matrix => `${matrix[0]}` + ' ' + `${this.tabAfterName}`).join(', ');
    return `${after}`;
  }

  displayBefore(): string {
    const before = this.matrixTableTranspone.map(matrix => `${this.tabBeforeName}` + ' ' + `${matrix[0]}`).join(', ');
    return `${before}`;
  }

  displayTab4(): string {
    const tabName4 = this.matrixTableTranspone.map(matrix => `${this.tab4}` + '(' + `${this.tabName}` + '.' + `${matrix[0]}` + ', ' + `${this.tabBeforeName}` + ') ' + `${matrix[0]}`).join(', ');
    return `${tabName4}`;
  }

  displayBeginningAndEnd(): string {
    const beginningAndEnd = this.matrixTableTranspone.map(matrix => `${this.beginning}` + `${matrix[0]}` + `${this.end}`).join('\n');
    return `${beginningAndEnd}`;
  }

  displayFreeHelper(): string {
    const freeHelper = this.matrixTableTranspone.map(matrix => `${this.freeHelperBefore}` + `${matrix[0]}` + `${this.freeHelper}` + '.' + `${matrix[0]}`).join(', ');
    return `${freeHelper}`;
  }

  replacer = 'xxCOLxx =cte_mergeSource.xxCOLxx=cte_mergeNo.xxCOLxx=cte_mergeTest.xxCOLxx';

  displayReplacer(replacer: string) {
    return this.matrixTableTranspone.map((subArray: any[]) => {
      const firstElement = subArray[0];
      return replacer.split('xxCOLxx').join(firstElement);
    }).join('\n');
  }

  createTempTable(): string {
    let existTrue: boolean = this.pKeyCheckbox.some((value: boolean) => value === true);
    if (!existTrue) { return "No Primary key selected" }
    const sqlScript = `IF OBJECT_ID('TempDB..#${this.tempTableName}') IS NOT NULL
        DROP TABLE #${this.tempTableName}

        CREATE TABLE #${this.tempTableName} (
        ${this.displayEverything()}
        PRIMARY KEY CLUSTERED(${this.displayPKey()})
      )
    `;
    return sqlScript;
  }

}



