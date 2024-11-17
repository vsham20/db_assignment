class FlagRenderer {
  eGui;

  init(params) {
    let flagImg = document.createElement('img');
    flagImg.src = params.value;
    flagImg.setAttribute('class', 'logo');

    this.eGui = document.createElement('span');
    this.eGui.setAttribute('class', 'imgSpanLogo');
    this.eGui.appendChild(flagImg);
  }

  getGui() {
    return this.eGui;
  }

  refresh() {
    return false;
  }
}

export default FlagRenderer;
