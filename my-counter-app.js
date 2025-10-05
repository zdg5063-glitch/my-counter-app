/*** Copyright 2025 zdg5063-glitch
 * @license Apache-2.0, see LICENSE for full text. */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

/*** `my-counter-app` 
 * @demo index.html
 * @element my-counter-app*/
export class MyCounterApp extends DDDSuper(I18NMixin(LitElement)) {
  

  
  static get tag() { /*static gettter property, statically returns counter app*/
    return "my-counter-app";
  }

  constructor() {
    super(); /*Helps call the child class's constructor*/
    this.count = 10; /*Counter starts at 10, when RESET it goes to 10*/
    this.min = 10; /*Counter min is 10*/
    this.max = 25; /*Counter max is 25*/
    }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      count: { type: Number },
      min: { type: Number },
      max: { type: Number },
    };
  }

  // Lit scoped styles
  static get styles() {
  return [super.styles,
  css`
      :host {
        display: block;
        color: var(--ddd-theme-primary);color:
        background-color: var(--ddd-theme-accent);
        font-family: var(--ddd-font-secondary);
        font-size: 32px;
      }

      .wrapper { /*CSS for items in the wrapper*/
        margin: var(--ddd-spacing-2);
        padding: var(--ddd-spacing-1);
        background-color: var(--ddd-theme-default-keystoneYellow);
      }

      .counter { /*CSS for the counter numbers*/
       color: Black; 
       font-size: 72px;
       text-align: center;
      }

   
      .counter.eighteen { 
        color: green; /*When counter hits 18 it turns red. Gets called below in render class*/
      }

  
      .counter.twentyone { 
        color: red; /*When counter turns 21 it turns red. Gets called below in render class*/
      }

  
      Button { /*CSS for the +1 and =1 buttons*/
        background-color: var(--ddd-theme-default-wonderPurple); 
        color: var(--ddd-theme-default-globalNeon);
        margin: var(--ddd-spacing-3);
        padding: var(--ddd-spacing-1);
        font-size: 36px;
        height: 72px;
        width: 72px;
        border-color: var(--ddd-theme-default-original87Pink);
        border-radius: var(--ddd-radius-lg);
        cursor: grab;
      }
      
    
      button.reset { /*CSS for the RESET button*/
      background-color: var(--ddd-theme-default-original87Pink);
      color: var(--ddd-theme-default-slateMaxLight);
      border-color: var(--ddd-theme-default-wonderPurple);
      width: 144px; 
      font-size: 24px;
      }
      

/* pulse effect for the buttons, I did not generate this myself, AI did*/
/* scale(1.05) makes the button 5% larger*/
/* rgba is the colors, 0.6 starts the glowing effect*/
/* percentages are the progress of the animation*/
/* px controls how big the shadow gets*/
/* animation pulse time controls how fast the infinite loop repeats*/
      @keyframes pulse { 
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(98, 0, 218, 7.6); }
  60% { transform: scale(1.3); box-shadow: 0 0 0 25px rgba(98, 0, 238, 0); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(98, 0, 238, 0); }
}
.buttons button:hover {
  animation: pulse 1.3s infinite;
}
    `];
  }

  // Lit render the HTML
  render() {
let counterClass = ""; /*initialized the counter*/

if (this.count === 18) { /*renders .counter.eighteen css if count = 18 which makes counter green*/
  counterClass = "eighteen";

} else if (this.count === 21) { /*renders .counter.twentyone css if count = 21 which turns counter red and pops confetti*/
  counterClass = "twentyone";
}

return html`
  <!-- wraps whats on the screen with the confetti -->
  <!-- wrapper class holds buttons and counter -->
  <!-- counter class gets count from the static get property count -->
  <!-- ?disabled makes it so the counter does not go beyond the scope of the min/max values that are set -->
   <!-- .decrease and .increase and .reset are pulled from the methods below -->

  <confetti-container id="confetti"> 

  <div class="wrapper">
  
  <div class="counter ${counterClass}">${this.count}</div>
  
  <div class="buttons">

  <button @click="${this.decrease}"
  ?disabled="${this.min === this.counter}">-1</button>

  <button class="reset" @click="${this.reset}">RESET</button>

  <button @click="${this.increase}"
  ?disabled="${this.max === this.counter}">+1</button>

    </div>
  </confetti-container>
</div>
`;
}
  // increases the counter count by 1 only if it is below the count max of 25
  increase() {
    if (this.count < this.max) {
    this.count++;
  }
}
// decreases the counter count by 1 only if it is greater than the minimum count of 10
  decrease() {
    if (this.count > this.min) {
    this.count--;
  }
}
// resets the count to 10. Can be changed to any number between 10 and 25.
  reset() {
    this.count = 10;
  }

  //Code from class. If count = 25, then cofetti rains. Added 21 to the confetti with the OR function (||)
  updated(changedProperties) {
  if (super.updated) {
    super.updated(changedProperties);
  }
  if (changedProperties.has('count')) {
    if(this.count ===21) {
      this.makeItRain();
    }
  }
}


  // this is called a dynamic import. It means it won't import the code for confetti until this method is called
  // the .then() syntax after is because dynamic imports return a Promise object. Meaning the then() code
  // will only run AFTER the code is imported and available to us
makeItRain() {
  import("https://cdn.jsdelivr.net/npm/@haxtheweb/multiple-choice/lib/confetti-container.js")
    .then(() => {
       // This is a minor timing 'hack'. We know the code library above will import prior to this running
      // The "set timeout 0" means "wait 1 microtask and run it on the next cycle.
      // this "hack" ensures the element has had time to process in the DOM so that when we set popped
      // it's listening for changes so it can react
      setTimeout(() => {
                // forcibly set the poppped attribute on something with id confetti
        // while I've said in general NOT to do this, the confetti container element will reset this
        // after the animation runs so it's a simple way to generate the effect over and over again
        const confetti = this.shadowRoot?.querySelector("#confetti");
        if (confetti) confetti.setAttribute("popped", "");
      }, 0);
    })
}

  /*** haxProperties integration via file reference */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(MyCounterApp.tag, MyCounterApp);