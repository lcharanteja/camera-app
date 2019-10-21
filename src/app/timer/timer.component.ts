import { Component, OnInit, ElementRef } from '@angular/core';
import { interval, Observable, fromEvent } from 'rxjs';
import { takeWhile, tap} from 'rxjs/operators';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent implements OnInit {

  max = 1;
  current = 0;
  button: any = null;
  // @ViewChild('cliclMe') button: ElementRef;
  constructor(private elRef: ElementRef) {
    // this.button = document.querySelector('button');
    // console.log(this.button);
    // fromEvent(this.button, 'click').subscribe(event => console.table(event));
  }

  ngOnInit() {
    this.button = this.elRef.nativeElement.querySelector('button');
    // console.log(this.button);
    fromEvent(this.button, 'click').subscribe(event => console.table(event['clientX']));
  }
  // Event handers for app

  start() {
    const i = interval(100);
    i.pipe(
      takeWhile(_ => !this.isFinished),
      tap( x => this.current += 0.1)
      ).subscribe();
  }
    /// finish timer
    finish() {
    this.current = this.max;
  }

  /// reset timer
  reset() {
    this.current = 0;
  }


  // getters to prevent NaN errors

  get maxVal() {
    return isNaN(this.max) || this.max < 0.1 ? 0.1 : this.max;
  }

  get currentVal() {
    return isNaN(this.current) || this.current < 0 ? 0 : this.current;
  }

  get isFinished() {
    return this.currentVal >= this.maxVal;
  }

  /* clickMe() {
    fromEvent(button, 'click').subscribe(_ => console.log(_));
  } */

}