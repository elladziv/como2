import "Components/shared/ui/background_container/background_video.scss";

import React from 'react';

class BackgroundVideo extends React.Component{
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.video.setAttribute('webkit-playsinline','webkit-playsinline');
    if(window.fatlady.utils.isMobile()) {
      setTimeout(function(){
        this.video.play();
      }.bind(this),500);
    }
    if(this.props.play) {
      this.playVideo();
    }
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.focus != nextProps.focus) {
      var isFocus = nextProps.focus;
      if(isFocus) {
        this.video.play();
      } else {
        this.video.pause();
      }
    }
    //
    if(this.props.play != nextProps.play) {
      var isPlay = nextProps.play;
      //trace('play vid: ',isPlay);
      if(isPlay) {
        this.playVideo();
      } else {
        this.stopVideo();
      }
    }
  }

  componentDidUpdate() {
    if(this.video) {
      this.video.removeEventListener('progress',this.onVideoProgress.bind(this));
      this.video.removeEventListener('timeupdate',this.onVideoTime.bind(this));
      this.video.removeEventListener('play',this.onVideoPlay.bind(this));
      this.video.removeEventListener('pause',this.onVideoPause.bind(this));
      this.video.removeEventListener('ended',this.onVideoEnded.bind(this));
      //
      this.video.addEventListener('progress',this.onVideoProgress.bind(this));
      this.video.addEventListener('timeupdate',this.onVideoTime.bind(this));
      this.video.addEventListener('play',this.onVideoPlay.bind(this));
      this.video.addEventListener('pause',this.onVideoPause.bind(this));
      this.video.addEventListener('ended',this.onVideoEnded.bind(this));
    }
  }

  onVideoProgress(e) {
    // Video loading progress
    //trace('progress',e);
  }

  onVideoTime(e) {
    // video play time change
    //trace('time',this.video.currentTime,this.video.duration);
    if(typeof this.props.onTime == 'function') {
      this.props.onTime(this.video.currentTime, this.video.duration);
    }
  }

  onVideoPlay(e) {
    // video started playing
    this.setStatus('playing');
  }

  onVideoPause(e) {
    // video paused
    this.setStatus('paused');
  }

  onVideoEnded(e) {
    // video ended
    this.setStatus('ended');
  }

  playVideo() {
    this.video.play();
  }

  stopVideo() {
    this.video.pause();
  }

  setStatus(status) {
    if(this.status != status) {
      this.status = status;
      //trace(status);
      if(status == 'playing') {
        if(typeof this.props.onPlay == 'function') {
          this.props.onPlay();
        }
      } else if(status == 'paused') {
        if(typeof this.props.onPause == 'function') {
          this.props.onPause();
        }
      } else if(status == 'ended') {
        if(typeof this.props.onEnd == 'function') {
          this.props.onEnd();
        }
      }
    }
  }

  render() {
    var cover = "";
    if(this.props.cover) {
      cover = <div className="bg-video-cover" style={{backgroundImage:"url('"+this.props.cover+"')"}} ></div>
    }
    var autoplay = this.props.autoplay;
    if(typeof this.props.autoplay == 'undefined') {
      autoPlay = true;
    }
    return (
      <div className={"bg-video "+(this.props.play===false ? 'hidden' : '')}>
        <video ref={(elem) => {this.video = elem;}} className="bg-video-vid" src={this.props.src} poster={this.props.poster} loop={this.props.loop ? "loop" : false} preload="auto" autoPlay={autoplay} muted={this.props.muted}>
          <source src={this.props.src} type="video/mp4" />
        </video>
        {cover}
      </div>
    );
  }
}

export default BackgroundVideo;