import { Component, OnInit, ViewChild } from "@angular/core";
import { Observable, from, timer, Subject, race, interval } from "rxjs";
import { tap, take, takeUntil } from "rxjs/operators";

declare var MediaRecorder: any;

@Component({
  selector: "app-camera-component",
  templateUrl: "./camera-component.component.html",
  styleUrls: ["./camera-component.component.css"]
})
export class CameraComponentComponent implements OnInit {
  @ViewChild("preview", { static: true }) video;
  previewElement: HTMLVideoElement;
  @ViewChild("recording", { static: true }) playVideo;
  playElement: HTMLVideoElement;
  videoConstraints = {
    audio: {
      echoCancellation: true
    },
    video: { facingMode: { exact: "environment" } }
  };

  mediaRecorder: any;
  recordedChunks = [];
  lengthInMS = 15000;

  recordShow = false;
  recordDisable = true;
  showPlay = true;

  mediaObservable$: Observable<MediaStream>;
  timeOut$ = timer(this.lengthInMS);
  stopped$ = new Subject<void>();
  interval$ = interval(this.lengthInMS / 10).pipe(
    take(15),
    takeUntil(this.stopped$)
  );
  currentNumber: number;

  constructor() {}

  ngOnInit() {
    this.previewElement = this.video.nativeElement;
    this.playElement = this.playVideo.nativeElement;

    this.mediaObservable$ = from(
      navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 1280, height: 720 }
      })
    );
  }

  startCamera = () => {
    this.mediaObservable$.subscribe(
      stream => {
        /* use the stream */
        this.previewElement.srcObject = stream;
        this.mediaRecorder = new MediaRecorder(stream);
        this.recordDisable = false;
      },
      error => console.log("This error" + error)
    );
  };

  record() {
    this.recordShow = true;
    this.mediaRecorder.start();
    this.interval$.subscribe(i => (this.currentNumber = i + 1));
    console.log(this.mediaRecorder.state);
    console.log("recorder started");

    // push data to array
    this.mediaRecorder.ondataavailable = event =>
      this.recordedChunks.push(event.data);
    console.log(
      this.mediaRecorder.state +
        " for " +
        this.lengthInMS / 1000 +
        " seconds..."
    );

    race(this.timeOut$, this.stopped$).subscribe(stop => {
      this.mediaRecorder.stop();
      console.log("Stopped Recording");
      this.recordShow = false;
      this.showPlay = false;
    });
  }

  stop() {
    console.log(this.mediaRecorder.state);
    console.log("recorder stopped");
    //stream.getTracks().forEach(track => track.stop());
    this.stopped$.next();
  }

  play() {
    const superBuffer = new Blob(this.recordedChunks, { type: "video/webm" });
    this.playElement.src = null;
    this.playElement.srcObject = null;
    this.playElement.src = window.URL.createObjectURL(superBuffer);
    this.playElement.controls = true;
    this.playElement.play();
  }

  /* download() {
    const blob = new Blob(this.recordedChunks, { type: "video/webm" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = "test.webm";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 100);
  } */
}
