import { Component, OnInit, ViewChild } from "@angular/core";

@Component({
  selector: "app-camera-component",
  templateUrl: "./camera-component.component.html",
  styleUrls: ["./camera-component.component.css"]
})
export class CameraComponentComponent implements OnInit {
  @ViewChild('video', { static: true }) video;
  videoConstraints = { 
    audio: true, 
    video: { facingMode: { exact: "environment" }}};

  constructor() {}

  ngOnInit() {
    const videoElement: HTMLVideoElement = this.video.nativeElement;

    navigator.mediaDevices
      .getUserMedia({
      video: { facingMode: 'user' }
    })
      .then((stream) => {
        /* use the stream */
        videoElement.srcObject = stream;
      })
      .catch((err) => {
        /* handle the error */
      });
  }
}
