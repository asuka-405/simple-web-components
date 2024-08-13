const sidebar = document.querySelector(".sidebar")
const toggleBtn = document.querySelector(".sidebar__toggle")
const sidebarTitle = document.querySelector(".sidebar-title")
const sidebarHeadLogo = document.querySelector(".sidebar-head-logo")
const accordions = document.querySelectorAll(".accordion")

sidebar.querySelectorAll(".sidebar-actions > *").forEach((action) => {
  action.setAttribute("tabindex", "0")
})

accordions.forEach((accordion) => {
  accordion.querySelector(".summary").addEventListener("click", (e) => {
    if (accordion.classList.contains("active")) {
      accordion.classList.remove("active")
      return
    }
    accordions.forEach((accordion) => {
      accordion.classList.remove("active")
    })
    accordion.classList.add("active")
  })
})

toggleBtn.addEventListener("click", (e) => {
  if (sidebar.classList.contains("collapse")) {
    // toggleBtn.querySelector(".icon").src = "./assets/close.svg"
    sidebarTitle.style.transitionDelay = "0.3s"
    sidebarHeadLogo.style.transitionDelay = "0.3s"
    accordions.forEach((accordion) => {
      accordion.classList.add("accordion")
    })
  } else {
    // toggleBtn.querySelector(".icon").src = "./assets/menu.svg"
    sidebarTitle.style.transitionDelay = "0s"
    sidebarHeadLogo.style.transitionDelay = "0s"
    accordions.forEach((accordion) => {
      accordion.classList.remove("active")
      accordion.classList.remove("accordion")
    })
  }
  sidebar.classList.toggle("collapse")
})
