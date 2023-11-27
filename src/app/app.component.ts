import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  sqlQuery: string = '';
  columns: string[] = [];


  title = 'sql-query-executor';

  regexTable: RegExp = /(from|join)\s+(\w+)/g;
  regexColumn: RegExp = /SELECT\s+(.+?)\s+FROM/i;

  constructor() {

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
    // Simple logic to extract column names (assumes a SELECT statement)
    const selectIndex = sqlQuery.toUpperCase().indexOf('SELECT');
    const fromIndex = sqlQuery.toUpperCase().indexOf('FROM');

    if (selectIndex !== -1 && fromIndex !== -1 && selectIndex < fromIndex) {
        const selectClause = sqlQuery.substring(selectIndex + 'SELECT'.length, fromIndex).trim();

        // Function to recursively extract column names from nested SELECT statements
        const extractColumns = (clause: string, nestedParenCount: number = 0): string[] => {
            const columnParts = clause.split(',').map(part => part.trim());

            return columnParts.flatMap((part: string): string[] => {
                // Check for nested SELECT inside parentheses (indicating a subquery)
                const nestedSelectIndex = part.toUpperCase().indexOf('SELECT');
                const openParenIndex = part.indexOf('(');
                const closeParenIndex = part.indexOf(')');

                if (
                    nestedSelectIndex !== -1 &&
                    (openParenIndex === -1 ||
                        (nestedSelectIndex < openParenIndex && nestedSelectIndex > closeParenIndex))
                ) {
                    // Recursively extract columns from nested SELECT
                    return extractColumns(part.substring(nestedSelectIndex), nestedParenCount + 1);
                }

                // Extract the column name considering "AS" aliases
                const asIndex = part.toUpperCase().lastIndexOf(' AS ');

                if (asIndex !== -1) {
                    return [part.substring(asIndex + ' AS '.length, part.length).trim()];
                } else {
                    const dotIndex = part.lastIndexOf('.');
                    return dotIndex !== -1 ? [part.substring(dotIndex + 1)] : [part];
                }
            });
        };

        // Extract the column names from the main select clause
        const columnNames: string[] = extractColumns(selectClause);

        return columnNames;
    } else {
        return ['Invalid SQL query'];
    }
}









}
