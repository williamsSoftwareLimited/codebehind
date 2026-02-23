class Codebehind extends HTMLElement {
  constructor(){
      super();
  }
  connectedCallback() {
    // Create a shadow root
    //const shadow = this.attachShadow({ mode: "open" });

      //shadow.appendChild(style);
  }
}
customElements.define("code-behind", Codebehind);