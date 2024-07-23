// Navbar //
const searchBtn = document.querySelector(".search-btn")
const searchBtnSubtitle = document.querySelector(".search-subtitle")

const handleSubtitleOver = (elm) => {
  elm.classList.add("active")
}
const handleSubtitleOut = (elm) => {
  elm.classList.remove("active")
}

searchBtn.addEventListener("mouseover", () =>
  handleSubtitleOver(searchBtnSubtitle)
)
searchBtn.addEventListener("mouseout", () =>
  handleSubtitleOut(searchBtnSubtitle)
)

const mic = document.querySelector(".mic")
const micSubtitle = document.querySelector(".mic-subtitle")

mic.addEventListener("mouseover", () => handleSubtitleOver(micSubtitle))
mic.addEventListener("mouseout", () => handleSubtitleOut(micSubtitle))
mic.addEventListener("click", () => vocalModel.classList.add("active"))

const create = document.querySelector(".create")
const createSubtitle = document.querySelector(".create-subtitle")
const createWindow = document.querySelector(".create-window")

create.addEventListener("mouseover", () => handleSubtitleOver(createSubtitle))
create.addEventListener("mouseout", () => handleSubtitleOut(createSubtitle))
create.addEventListener("click", () => {
  if (createWindow.classList.contains("active")) {
    createWindow.classList.remove("active")
  } else {
    createWindow.classList.add("active")
  }
})
const notification = document.querySelector(".notification")
const notificationSubtitle = document.querySelector(".notification-subtitle")

notification.addEventListener("mouseover", () =>
  handleSubtitleOver(notificationSubtitle)
)
notification.addEventListener("mouseout", () =>
  handleSubtitleOut(notificationSubtitle)
)

const vocalModel = document.querySelector(".vocal-model")
const closeModalMic = document.querySelector(".close-vocal-model")

closeModalMic.addEventListener("click", () => {
  vocalModel.classList.remove("active")
})

// Categories Bar //
const categoriesBox = document.querySelector(".categories")
const categoriesItem = document.querySelectorAll(".categories-item")
const categoriesList = document.querySelector(".categories-list")
const rightArrow = document.querySelector(".right-arrow")
const leftArrow = document.querySelector(".left-arrow")

const removeAllActiveClasses = () => {
  categoriesItem.forEach((tab) => {
    tab.classList.remove("active")
  })
}

const handleScroll = () => {
  if (categoriesList.scrollLeft >= 20) {
    leftArrow.classList.add("active")
  } else {
    leftArrow.classList.remove("active")
  }
  const maxScrollValue =
    categoriesList.scrollWidth - categoriesList.clientWidth - 20

  if (categoriesList.scrollLeft >= maxScrollValue) {
    rightArrow.classList.remove("active")
  } else {
    rightArrow.classList.add("active")
  }
}

const handleDrag = (e) => {
  if (!dragging) return

  categoriesList.classList.add("dragging")
  categoriesList.scrollLeft -= e.movementX
}

categoriesItem.forEach((tab) => {
  tab.addEventListener("click", () => {
    removeAllActiveClasses()
    tab.classList.add("active")
  })
})

let dragging = false
document.addEventListener("mousedown", () => {
  dragging = true
})

categoriesList.addEventListener("mousemove", handleDrag)

document.addEventListener("mouseup", () => {
  dragging = false
  categoriesList.classList.remove("dragging")
})

categoriesList.addEventListener("scroll", handleScroll)

rightArrow.addEventListener("click", () => {
  categoriesList.scrollLeft += 200
})
leftArrow.addEventListener("click", () => {
  categoriesList.scrollLeft -= 200
})

// Fetch Video  //
const api_key = "AIzaSyCiuk2nUco9gVIX6LWLO4sPVb50U4CjOhY"
const video_http = "https://www.googleapis.com/youtube/v3/videos?"
const channel_http = "https://www.googleapis.com/youtube/v3/channels?"
const videoContainer = document.querySelector(".video-container")

const fetchChannelImg = async (video_data) => {
  try {
    const res = await fetch(
      channel_http +
        new URLSearchParams({
          key: api_key,
          part: "snippet",
          id: video_data.snippet.channelId,
        })
    )
    const data = await res.json()
    video_data.channelThumbnail = data.items[0].snippet.thumbnails.default.url
    displayVideo(video_data)
  } catch (error) {
    console.log(error)
  }
}

const fetchVideo = async () => {
  try {
    const res = await fetch(
      video_http +
        new URLSearchParams({
          key: api_key,
          part: "snippet",
          chart: "mostPopular",
          maxResults: 50,
          regionCode: "IT",
        })
    )
    const data = await res.json()
    data.items.forEach((video_data) => {
      fetchChannelImg(video_data)
    })
  } catch (error) {
    console.log(error)
  }
}
const displayVideo = (video_data) => {
  // check for all the data
  if (
    !video_data.snippet.thumbnails.maxres.url ||
    !video_data.snippet.thumbnails.high.url ||
    !video_data.channelThumbnail ||
    !video_data.snippet.title ||
    !video_data.snippet.channelTitle ||
    !video_data.snippet.publishedAt
  )
    return

  const videoCard = document.createElement("div")
  videoCard.classList.add("video-card")
  const videoBox = document.createElement("div")
  videoBox.classList.add("video-box")
  const video = document.createElement("img")
  const videoInfo = document.createElement("div")
  videoInfo.classList.add("video-info-box")
  const infoText = document.createElement("div")
  infoText.classList.add("info-text")
  const channelImgDiv = document.createElement("div")
  channelImgDiv.classList.add("channel-img-div")
  const channelImg = document.createElement("img")
  const title = document.createElement("h3")
  const channel = document.createElement("h4")
  const time = document.createElement("p")
  const options = document.createElement("span")
  options.classList.add("options")
  options.innerHTML =
    "<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor' class='size-6'><path stroke-linecap='round' stroke-linejoin='round' d='M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z' /></svg>"
  videoContainer.appendChild(videoCard)
  videoBox.appendChild(video)
  videoCard.appendChild(videoBox)
  channelImgDiv.appendChild(channelImg)
  videoInfo.appendChild(channelImgDiv)
  infoText.appendChild(title)
  infoText.appendChild(channel)
  infoText.appendChild(time)
  videoInfo.appendChild(infoText)
  videoInfo.appendChild(options)
  videoCard.appendChild(videoInfo)

  video.src =
    video_data.snippet.thumbnails.maxres.url ||
    video_data.snippet.thumbnails.high.url
  channelImg.src = video_data.channelThumbnail
  title.textContent = video_data.snippet.title
  channel.textContent = video_data.snippet.channelTitle
  time.textContent = `${Math.floor(
    Math.random() * (1000000 - 0) + 0
  )} visualizzazioni · ${video_data.snippet.publishedAt.slice(0, 10)}`
}

fetchVideo()
