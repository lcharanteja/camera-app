import { Component, OnInit, ViewChild } from "@angular/core";
import { Observable, from, timer, Subject, race } from "rxjs";
import { tap, map } from 'rxjs/operators';

declare var MediaRecorder: any;

@Component({
  selector: "app-camera-component",
  templateUrl: "./camera-component.component.html",
  styleUrls: ["./camera-component.component.css"]
})
export class CameraComponentComponent implements OnInit {
  @ViewChild("preview", { static: true }) video;
  previewElement: HTMLVideoElement;
  videoConstraints = {
    audio: true,
    video: { facingMode: { exact: "environment" } }
  };

  mediaRecorder: any;
  recordedChunks = [];
  lengthInMS = 10000;

  show = false;

  mediaObservable$: Observable<MediaStream>;
  timeOut$ = timer(this.lengthInMS);
  stopped$ = new Subject<void>()
  

  

  constructor() {}

  ngOnInit() {
    this.previewElement = this.video.nativeElement;

    this.mediaObservable$ = from(
      navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 1280, height: 720 }
      })
    );

    this.startCamera();
  }

  startCamera = () => {
    this.mediaObservable$.subscribe(
      stream => {
        /* use the stream */
        this.previewElement.srcObject = stream;
        this.mediaRecorder = new MediaRecorder(stream);
      },
      error => console.log('This error' + error)
    );
  }

  record() {
    this.show = true;
    this.mediaRecorder.start();
    console.log(this.mediaRecorder.state);
    console.log("recorder started");

    // push data to array
    this.mediaRecorder.ondataavailable = event => this.recordedChunks.push(event.data);

    this.mediaRecorder.start();
    console.log(this.mediaRecorder.state + " for " + this.lengthInMS / 1000 + " seconds...");

    race(this.timeOut$, this.stopped$).subscribe(
      stop => this.mediaRecorder.stop()
    );
  }
  stop() {
    
    console.log(this.mediaRecorder.state);
    console.log("recorder stopped");
    this.stopped$.next();
  }

}
