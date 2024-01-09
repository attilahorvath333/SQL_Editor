import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { text } from 'stream/consumers';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  sqlQuery: string = '';
  sqlQuery1244: string = '';
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

      // Split the select clause by commas and trim each part
      const columnParts = selectClause.split(',').map(part => part.trim());

      // Extract the column names considering "AS" aliases
      const columnNames = columnParts.map(part => {
        const asIndex = part.toUpperCase().lastIndexOf(' AS ');

        if (asIndex !== -1) {
          // Extract the alias after the last "AS" and before the comma
          return part.substring(asIndex + ' AS '.length, part.length).trim();
        } else {
          // If no "AS" alias, check for a dot and return the part after the last dot
          const dotIndex = part.lastIndexOf('.');

          if (dotIndex !== -1) {
            return part.substring(dotIndex + 1);
          } else {
            // If no dot, return the original part
            return part;
          }
        }
      });

      return columnNames;
    } else {
      return ['Invalid SQL query'];
    }
  }
}
