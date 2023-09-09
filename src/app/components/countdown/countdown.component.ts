import {AfterViewInit, Component} from '@angular/core';

@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.scss']
})
export class CountdownComponent implements AfterViewInit {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPulsating: boolean = true;

  constructor() {
    // Mettre à jour le minuteur toutes les secondes
    setInterval(() => {
      this.updateCountdown();
    }, 1000);

    // Appeler la fonction pour la première mise à jour immédiate
    this.updateCountdown();
  }

  ngAfterViewInit() {
    this.togglePulsatingClass();
  }

  updateCountdown() {
    const weddingDate = new Date('2023-11-18T11:30:00');
    const currentDate = new Date();
    const timeRemaining = weddingDate.getTime() - currentDate.getTime();

    if (timeRemaining <= 0) {
      const countdownElement = document.getElementById('countdown');
      if (countdownElement) countdownElement.textContent = 'Le mariage a eu lieu !';
      return;
    }
    this.days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    this.hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    this.minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    this.seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
  }

  togglePulsatingClass() {
    const dayEl = document.getElementById('days');
    const segondEl = document.getElementById('seconds');
    const countdownElement = document.getElementById('countdown');
    if (countdownElement) {
      //countdownElement.classList.toggle('pulsating', this.isPulsating);
      segondEl!.classList.toggle('pulsating', this.isPulsating);
    }
  }
}
