const liveEnabled = true;

function onDomContentLoaded() {
const animationsLive = [
  {
    el: document.querySelector(".xenonAnimation"),
    animClass: "xenonAnimationLiveAnim",
    waitFor: null,
  },
  {
    el: document.querySelector(".xenon_ball"),
    animClass: "xenon_ballLiveAnim",
    waitFor: null,
  },
  {
    el: document.querySelector(".glowFill"),
    animClass: "glowFillLiveAnim",
    waitFor: null,
  },
  {
    el: document.querySelector("#XenonShine"),
    animClass: "xenonLiveAnim",
    waitFor: null,
  },
  {
    el: document.querySelector(".LiveAnimation"),
    animClass: "LiveAnimationLiveAnim",
    waitFor: null,
  },
  {
    el: document.querySelector(".xboxAnimation"),
    animClass: "xboxAnimationLiveAnim",
    waitFor: null,
  },
  {
    el: document.querySelector(".LiveGlow"),
    animClass: "LiveGlowLiveAnim",
    waitFor: "glowContainerAnimation2Half",
  },
  {
    el: document.querySelector(".LiveGlowFill"),
    animClass: "LiveGlowFillLiveAnim",
    waitFor: null,
  },
  {
    el: document.querySelector(".ShineFill"),
    animClass: "ShineFillLiveAnim",
    waitFor: null,
  },
  {
    el: document.querySelector(".Shadow1"),
    animClass: "ShadowLiveAnim",
    waitFor: null,
  },
];

// i dont think this is doing anything to guard against overlapping animations
let isGroupRunning = false, groupPending = false;
function runLiveAnimation() {
  if (isGroupRunning) {
    groupPending = true;
    return;
  }
  isGroupRunning = true;
  groupPending = false;

  let remaining = 0;
  animationsLive.forEach((item) => {
    const el = item.el;
    const animClass = item.animClass;
    const waitFor = item.waitFor;

    if (!el) return;
    remaining++;
    el.classList.add(animClass);

    const onAnimEnd = (evt) => {
      if (waitFor === null || evt.animationName === waitFor) {
        el.removeEventListener("animationend", onAnimEnd);
        el.classList.remove(animClass);

        remaining--;
        if (remaining === 0) {
          isGroupRunning = false;
          if (groupPending) {
            runLiveAnimation();
          } else {
            setTimeout(runLiveAnimation, 30000);
          }
        }
      }
    };

    el.addEventListener("animationend", onAnimEnd);
  });

  if (remaining === 0) {
    isGroupRunning = false;
    setTimeout(runLiveAnimation, 30000);
  }
}

// every 30 secs run the xbl anim
if(liveEnabled)
{
  setTimeout(runLiveAnimation, 30000);
}

// ... so this is just redundant
const XenonShineElement = document.querySelector("#XenonShine");
let isXenonRunning = false, xenonPending = false;
function runXenonAnimation() {
  if (isXenonRunning) {
    xenonPending = true;
    return;
  }
  isXenonRunning = true;
  xenonPending = false;

  XenonShineElement.classList.add("xenon");
  const onAnimEnd = (evt) => {
    XenonShineElement.removeEventListener("animationend", onAnimEnd);
    XenonShineElement.classList.remove("xenon");
    isXenonRunning = false;

    if (xenonPending) {
      runXenonAnimation();
    } else {
      setTimeout(runXenonAnimation, 10000);
    }
  };
  XenonShineElement.addEventListener("animationend", onAnimEnd);
}

// every 10 secs run the regular xenon anim
setTimeout(runXenonAnimation, 10000);

// ripples
(function(){
  const container = document.getElementById('ripple-container');
  const style = getComputedStyle(document.documentElement);
  const duration = parseFloat(style.getPropertyValue('--ripple-duration')) * 1000;
  const intervalMin = parseFloat(style.getPropertyValue('--ripple-interval-min'));
  const intervalMax = parseFloat(style.getPropertyValue('--ripple-interval-max'));
  const layers = parseInt(style.getPropertyValue('--ripple-layers'));

  function createRipple() {
    const ring = document.createElement('div');
    ring.className = 'ripple';
    
    // basically randomizes a bit the origin position of each ripple
    // i thought the xbox wouldve done 2 layers? maybe it does but i don't REALLY care
    // UPDATE: the xbox does 2 layers with different center points and flow, don't care for now
    const offsetRange = 10;
    const offsetX = (Math.random() - 0.5) * offsetRange;
    const offsetY = (Math.random() - 0.5) * offsetRange;
    
    ring.style.left = `calc(50% + ${offsetX}px)`;
    ring.style.top = `calc(50% + ${offsetY}px)`;
    
    container.appendChild(ring);

    setTimeout(() => {
      container.removeChild(ring);
    }, duration);
  }

  function getRandomInterval() {
    return Math.random() * (intervalMax - intervalMin) + intervalMin;
  }

  // ugly
  for (let layer = 0; layer < layers; layer++) {
    function scheduleNextRipple() {
      setTimeout(() => {
        createRipple();
        scheduleNextRipple();
      }, getRandomInterval());
    }
    scheduleNextRipple();
  }
})();

function testTheme1()
{
    document.documentElement.setAttribute("data-test-theme", "1");
    let sphere = document.querySelector(".Sphere");
    if (sphere)
    {
        sphere.setAttribute("data-sphere-color", "white");
    }
}

function testTheme2()
{
    document.documentElement.setAttribute("data-test-theme", "2");
    let sphere = document.querySelector(".Sphere");
    if (sphere)
    {
        sphere.setAttribute("data-sphere-color", "black");
    }
}

function createMobyslot(visual, id, titleText, descriptionText, image1Url = '', image2Url = '', targetElement) 
{
    const slottemplate = document.getElementById(`${visual}-template`);
    if (!slottemplate)
    {
        console.log("Provided template does not exist.");
        return;
    }
    const scenetemplate = document.getElementById('panelscene-template');
    const slot = slottemplate.content.cloneNode(true);
    const panelscene = scenetemplate.content.cloneNode(true);
    panelscene.firstElementChild.id = id;
    panelscene.firstElementChild.querySelector('.NonReflectedItems').id = `NonReflectedItems${id}`;
    
    const titleEl = slot.querySelector('.mobyslottextpresenter1');
    const descEl = slot.querySelector('.mobyslottextpresenter2');
    const image1El = slot.querySelector('.mobyslotimagepresenter1');
    const image2El = slot.querySelector('.mobyslotimagepresenter2');
    
    titleEl.textContent = titleText;
    descEl.textContent = descriptionText;
    
    if (image1Url) {
        image1El.style.backgroundImage = `url(${image1Url})`;
        image1El.style.backgroundSize = 'cover';
        image1El.style.backgroundPosition = 'center';
    }
    
    if (image2Url) {
        image2El.style.backgroundImage = `url(${image2Url})`;
        image2El.style.backgroundSize = 'cover';
        image2El.style.backgroundPosition = 'center';
    }
    
    panelscene.getElementById(`NonReflectedItems${id}`).appendChild(slot);
    panelscene.firstElementChild.querySelector('.Reflection').style.backgroundImage = `-moz-element(#NonReflectedItems${id})`
    
    if (targetElement && targetElement.appendChild) {
        targetElement.appendChild(panelscene);
    } 
    else 
    {
        console.error('Invalid target element provided to createMobyslot');
    }
}
// Template name, slot title, slot description, background image URL, slot icon URL, target element
// createMobyslot('mobyslot', 'Slot title', 'Slot description', null, null, document.querySelector('.MobySlotContainer'));

const testSlots = [
    {
        name: "ExampleSlot1",
        visual: "mobyslot",
        title: "Slot 1",
        description: "Description 1",
        backgroundImage: null,
        iconImage: null,
    },
    {
        name: "ExampleSlot2",
        visual: "mobyslot",
        title: "Slot 2",
        description: "Description 2",
        backgroundImage: 'http://epix.xbox.com/shaXam/0201/04/c6/04c69e0a-7554-46b4-99e8-489e6b0faaca.JPG?v=1',
        iconImage: null,
    },
    {
        name: "ExampleSlot3",
        visual: "mobyslot",
        title: "Slot 3",
        description: "Description 3",
        backgroundImage: null,
        iconImage: null,
    },
    {
        name: "ExampleSlot4",
        visual: "mobyslot",
        title: "Slot 4",
        description: "Description 4",
        backgroundImage: null,
        iconImage: null,
    },
    {
        name: "ExampleSlot5",
        visual: "mobyslot",
        title: "Slot 5",
        description: "Description 5",
        backgroundImage: null,
        iconImage: null,
    },
]
    
for (let i = 0; i < testSlots.length; i++)
{
    createMobyslot(testSlots[i].visual, testSlots[i].name,testSlots[i].title, testSlots[i].description, testSlots[i].backgroundImage, testSlots[i].iconImage, document.querySelector(".SlotContainer"));
    document.getElementById(testSlots[i].name).style.zIndex = testSlots.length - i;
}

// translateZ(${i * -34}px) slot Z transformation
    
function onGlobalKeyDown(e)
{
    switch(e.key)
    {
        case 'ArrowRight':
            if (currentSlotIndex < (testSlots.length - 1) || currentSlotIndex === 0) 
            {
                currentSlotIndex++;
                break;
            } 
            else 
            {
                console.log("Max slot");
                break;
            }
        case 'ArrowLeft':
            if(currentSlotIndex > 0)
            {
                currentSlotIndex--;
                break;
            }
            else
            {
                console.log("Min slot");
                break;    
            }
        case '1':
            testTheme1();
            break;
        case '2':
            testTheme2();
            break;
    }
}

document.addEventListener("keydown", onGlobalKeyDown);

}

document.addEventListener('DOMContentLoaded', onDomContentLoaded);