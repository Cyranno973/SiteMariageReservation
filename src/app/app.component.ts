import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'AndreStella';
  idUi: number[] = [];
  generatorIdentifiant(): void{
     const id = Math.floor(Math.random() * (99999 - 11111) + 11111);
     if(id !== 9999 && id !== 11111 && !this.idUi.includes(id)) this.idUi.push(id);
     else this.generatorIdentifiant();
  }
}
