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
     const id = Math.floor(Math.random() * (999999 - 111111) + 111111);
     if(id !== 99999 && id !== 111111 && !this.idUi.includes(id)) this.idUi.push(id);
     else this.generatorIdentifiant();
  }
}
