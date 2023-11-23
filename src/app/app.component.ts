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

 
  regexTable: RegExp= /(from|join)\s+(\w+)/g;
  regexColumn: RegExp= /SELECT\s+(.+?)\s+FROM/i;

  constructor(){
    
  }
  
  getTableNames(sqlQuery: string): string[] | null {
    const matchTableName = sqlQuery.match(this.regexTable)?.map(e => e.split(' ')[1]);
    if (matchTableName==null){return null}
    else
    {return matchTableName};
    
}  

 getColumnNames(sqlQuery: string): string[] | null {

    const matchColumnName = sqlQuery.match(this.regexColumn)?.map(e => e.split(' ')[1]);
    if (matchColumnName==null){return null}
    else
    {return matchColumnName};
    
}  


separate() {
let sqlCommand = document.getElementById('sqlText') as HTMLInputElement;
let sqlDetail = document.getElementById('detailText') as HTMLInputElement;
let kacsa: string[] | null ;
kacsa=this.getColumnNames(sqlCommand.value);
kacsa?.forEach((value, index) => {
  console.log(`Elem ${index + 1}: ${value}`);
});
console.log("tutykos regex2 tábla : "+ this.getTableNames(sqlCommand.value));
console.log("tutykos regex oszlop :  "+ this.getColumnNames(sqlCommand.value));
sqlDetail.value=sqlCommand.value;

}
}
