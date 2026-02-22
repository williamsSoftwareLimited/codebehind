class Codebehind extends HTMLElement {
  constructor(){
      super();
  }
  connectedCallback() {
    // Create a shadow root
    //const shadow = this.attachShadow({ mode: "open" });
    const style = document.createElement("style");

    style.textContent=
      `code-behind {
        font: sans-serif bold 50px;
        display: flex;
        flex: 1;
        align-items: center;
        justify-content: center;
        color: #112;
        font: bold 5rem 'Raleway';
        text-shadow: #333 1px 0 10px;
      }`;
      //shadow.appendChild(style);
  }
}
customElements.define("code-behind", Codebehind);