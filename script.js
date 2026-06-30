'use strict';
const btnsShowModals = document.querySelectorAll('.btn--show-modal')
const modal = document.querySelector('.modal')
const overlay = document.querySelector('.overlay')
const btnCloseModal = document.querySelector('.btn--close-modal')

const btnScrollTo = document.querySelector('.btn--scroll-to')
const section1 = document.getElementById('section--1')


const navLinks = document.querySelector('.nav__links')
const navItems = document.querySelectorAll('.nav__item')


const tapContainer = document.querySelector('.operations__tab-container')


const nav = document.querySelector('.nav')


const header = document.querySelector('.header')

const sections = document.querySelectorAll('.section')

const slides = document.querySelectorAll('.slide')
const slider =document.querySelector('.slider')
const leftbtn = document.querySelector('.slider__btn--left')
const rightbtn = document.querySelector('.slider__btn--right')
const dots = document.querySelector('.dots')
///////////////////////////////////////
// Modal window
// adds/removes hiddn class
const modalControling = function(){
    modal.classList.toggle('hidden')
    overlay.classList.toggle('hidden')
}

btnsShowModals.forEach(btn => btn.addEventListener('click', modalControling))
btnCloseModal.addEventListener('click',modalControling)
overlay.addEventListener('click',modalControling)
document.addEventListener('keydown', function(eventObject){
  eventObject.preventDefault()
  if (eventObject.key==='Escape') modalControling()
})



///////////////////////////////////////
// smooth scrolling
btnScrollTo.addEventListener('click',function(){
  section1.scrollIntoView({ behavior: 'smooth' })
})

// const coords= section1.getBoundingClientRect()
// const scrollx = window.scrollX
// const scrolly = window.scrollY
// btnScrollTo.addEventListener('click',function(){
//   window.scrollTo(coords.left+scrollx , coords.top+scrolly )
// })



///////////////////////////////////////
// navigation using delegation
navLinks.addEventListener("click", function(e){
  e.preventDefault();
  const hrefAtt = (e.target).getAttribute('href')
  if (hrefAtt){
    document.querySelector(hrefAtt).scrollIntoView({behavior : 'smooth'})
  }
})



///////////////////////////////////////
// tabbed component
tapContainer.addEventListener('click', function(e){
  e.preventDefault()
  if (e.target.classList.contains('operations__tab')){
    document.querySelector('.operations__tab--active').classList.remove('operations__tab--active')
    document.querySelector('.operations__content--active').classList.remove('operations__content--active')

    e.target.classList.add('operations__tab--active')
    const contentNum = e.target.dataset.tab
    const content = document.querySelector(`.operations__content--${contentNum}`)
    content.classList.add('operations__content--active')
  }
})


///////////////////////////////////////
// Menue fade animation

const handleHover = function(e, opacity){
  if (e.target.classList.contains('nav__link')){
    const target = e.target
    const siblings = target.closest('.nav').querySelectorAll('.nav__link');
    siblings.forEach((el)=>{
      if (el !== target) el.style.opacity = opacity;
    })
  }
}

nav.addEventListener('mouseover',function(e){
  handleHover(e,0.5)
})

nav.addEventListener('mouseout',function(e){
  handleHover(e,1)
})



///////////////////////////////////////
// sticky navigation
const stickyNav = function(entries){
  if (!entries[0].isIntersecting){
    nav.classList.add('sticky')
  } else {
    nav.classList.remove('sticky')
  }
}

const navObserver = new IntersectionObserver(stickyNav , {
  root:null,
  threshold:0,
})


navObserver.observe(header)


///////////////////////////////////////
// Revealing elements on scroll

const revealSection = function(entries , observer){
  entries.forEach((ent)=>{
    if (ent.isIntersecting){
      ent.target.classList.remove('section--hidden')
      observer.unobserve(ent.target)
    }
  })
}

const revealObserver = new IntersectionObserver(revealSection, {
  root:null,
  threshold:0.15,
})

sections.forEach((sec)=>{
  sec.classList.add('section--hidden')
  revealObserver.observe(sec)
})


///////////////////////////////////////
// Lazy image loading

const images = document.querySelectorAll('img[data-src]')

const loadImg = function(entries, observer){
  const curimg = entries[0]
  if (!curimg.isIntersecting) return

  curimg.target.src = curimg.target.dataset.src
  curimg.target.addEventListener('load',function(){
    curimg.target.classList.remove('lazy-img')
  })
  observer.unobserve(curimg.target)
}

const lazyObserver = new IntersectionObserver(loadImg)

images.forEach((img)=>{
  lazyObserver.observe(img)
})



///////////////////////////////////////
// Slider Component
let curSlide = 0
const totalSlides= slides.length

const createDots = function(){
  slides.forEach((_, i)=>{
    
    if( i ===0){
      dots.insertAdjacentHTML('beforeend',`<button class="dots__dot dots__dot--active" data-slide="${i}"></button>`)
    } else {
      dots.insertAdjacentHTML('beforeend',`<button class="dots__dot" data-slide="${i}"></button>`)
    }
  })
}

const handleDots= function(i){
  document.querySelector('.dots__dot--active').classList.remove('dots__dot--active')
  document.querySelector(`.dots__dot[data-slide="${i}"]`).classList.add('dots__dot--active')
}

const sliding = function(slides, curSlide){
  slides.forEach((slide , i)=>{
    slide.style.transform = `translateX(${100 * (i - curSlide)}%)`
    if (i === curSlide){
      handleDots(i)
    }
  })
}


const slideRight = function(){
  if (curSlide === totalSlides-1){
    curSlide =0 
  } else {
    curSlide+=1
  }
  sliding(slides, curSlide)
}

const slideLeft = function(){
  if (curSlide === 0){
    curSlide =totalSlides-1
  } else {
    curSlide-=1
  }
  sliding(slides, curSlide)
}

leftbtn.addEventListener('click', function(e){
  e.preventDefault()
  slideLeft()
})

rightbtn.addEventListener('click',function(e){
  e.preventDefault()
  slideRight()
})

document.addEventListener('keydown', function(e){
  if (e.key === "ArrowRight") slideRight()
  else if (e.key === "ArrowLeft") slideLeft()
})


dots.addEventListener('click', function(e){
  e.preventDefault()
  if (e.target.classList.contains('dots__dot')){
    const idx = Number(e.target.dataset.slide)
    sliding(slides ,idx)
  }
})

createDots()
sliding(slides, curSlide)
