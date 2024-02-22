class Player extends HTMLElement {
  tracks = [
    "https://www.bensound.com/bensound-music/bensound-betterdays.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
  ]
  currentTrack = 0

  constructor() {
    super()
    this.attachShadow({ mode: "open" })
  }

  async connectedCallback() {
    const html = await fetch("/components/player/index.wc").then((res) =>
      res.text()
    )
    const css = await fetch("/components/player/index.css").then((res) =>
      res.text()
    )
    this.shadowRoot.innerHTML = `<style>${css}</style>${html}`
    this.setupControls()
  }

  nextBtnHandler(nextTrackHandler) {
    console.log(this.tracks.length)
    this.currentTrack = (this.currentTrack + 1) % this.tracks.length
    nextTrackHandler(this.tracks[this.currentTrack])
  }
  prevBtnHandler(prevTrackHandler) {
    this.currentTrack =
      (this.currentTrack - 1 + this.tracks.length) % this.tracks.length
    prevTrackHandler(this.tracks[this.currentTrack])
  }

  setupControls() {
    const audio = this.shadowRoot.querySelector("audio")
    const playPause = this.shadowRoot.querySelector("#mu-play-pause")
    const stop = this.shadowRoot.querySelector("#mu-stop")
    const next = this.shadowRoot.querySelector("#mu-next")
    const previous = this.shadowRoot.querySelector("#mu-previous")
    const cover = this.shadowRoot.querySelector("#mu-cover")
    const seekbar = this.shadowRoot.querySelector("#mu-seek input")
    const time = this.shadowRoot.querySelector("#mu-time")
    const shadowDom = this.shadowRoot
    const SVG = {
      play: "/images/play.svg",
      pause: "/images/pause.svg",
      stop: "/images/stop.svg",
    }

    playPause.addEventListener("click", playPauseMusic)
    stop.addEventListener("click", stopMusic)
    next.addEventListener("click", () => {
      this.nextBtnHandler(nextTrack)
    })
    previous.addEventListener("click", () => {
      this.prevBtnHandler(previousTrack)
    })
    audio.addEventListener("timeupdate", syncTimeAndSeekbar)
    seekbar.addEventListener("input", () => {
      const time = (seekbar.value / 100) * audio.duration
      audio.currentTime = time
      playPauseMusic()
    })
    audio.addEventListener("ended", nextTrackIfAvailable)
    document.addEventListener("keyup", (e) => {
      if (e.code === "Space") playPauseMusic()
    })

    marqueeText("#mu-title")

    const playOnInit = false // play on init isnt allowd in chrome
    nextTrackIfAvailable(this.tracks[0], playOnInit)

    return {
      audio,
      playPauseMusic,
      stopMusic,
      nextTrack,
      previousTrack,
    }

    function playPauseMusic() {
      if (audio.paused) playMusic()
      else pauseMusic()
    }

    function playMusic() {
      audio.play()
      playPause.querySelector("img").src = SVG.pause
      cover.classList.add("spin-cover")
    }

    function pauseMusic() {
      audio.pause()
      playPause.querySelector("img").src = SVG.play
      cover.classList.remove("spin-cover")
    }

    function stopMusic() {
      audio.pause()
      playPause.querySelector("img").src = SVG.play
      audio.currentTime = 0
      cover.classList.remove("spin-cover")
      seekbar.value = 0
      time.innerHTML = `0:00 / ` + time.innerHTML.split(" / ")[1]
    }

    function marqueeText(selector) {
      const text = shadowDom.querySelector(selector)
      const width = text.offsetWidth
      if (250 > width) {
        text.style.animation = "none"
        return
      }
      const duration = width / 30
      text.style.animation = `marquee ${duration}s linear infinite`
    }

    function syncTimeAndSeekbar() {
      seekbar.value = Math.floor((audio.currentTime / audio.duration) * 100)
      time.innerHTML = `${Math.floor(audio.currentTime / 60)}:${Math.floor(
        audio.currentTime % 60
      )} / ${Math.floor(audio.duration / 60)}:${Math.floor(
        audio.duration % 60
      )}`
    }

    function nextTrackIfAvailable(path, canPlay = true) {
      stopMusic()
      if (!path) return
      audio.src = path
      const title = path.split("/").pop().split(".")[0]
      console.log(title)
      shadowDom.querySelector("#mu-title").innerHTML = title
      shadowDom.querySelector("#mu-artist").innerHTML = "Unknown"
      if (canPlay) playMusic()
    }

    function nextTrack(path) {
      nextTrackIfAvailable(path)
    }

    function previousTrack(path) {
      nextTrackIfAvailable(path)
    }
  }
}

customElements.define("mu-player", Player)
