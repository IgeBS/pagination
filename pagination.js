class Pagination {
  constructor(options) {
    this.options = Object.assign(
      {},
      {
        total: 50,
        visible: 5,
        current: 1,
        container: document.body,
        callback: () => {},
      },
      options
    );
    this.pages;
    this.currentPageButton = null;
    this.element = document.createElement("div");
    this.element.className = "pagination-buttons";

    this._show();
  }

  _generatePageNumbers() {
    let total = this.options.total;
    let max = this.options.visible;
    let current = this.options.current;

    const half = Math.floor(max / 2);
    let to = max;

    if (current + half >= total) {
      to = total;
    } else if (current > half) {
      to = current + half;
    }

    let from = Math.max(to - max, 0);

    this.pages = Array.from(
      { length: Math.min(total, max) },
      (_, i) => i + 1 + from
    );
  }

  _generateMarkup() {
    let start = () => disabled(this.pages[0] === 1);
    let prev = () =>
      disabled(
        this.options.current === 1 || this.options.current > this.options.total
      );
    let end = () => disabled(this.pages.slice(-1)[0] === this.options.total);
    let next = () => disabled(this.options.current >= this.options.total);
    let disabled = (boolean) => (boolean ? "disabled" : "");

    return `
        <button type="button" class="page-btn start-page" ${start()}></button>
        <button type="button" class="page-btn prev-page" ${prev()}></button>
        ${this.pages
          .map((page) => {
            console.log();
            return ` 
            <button type="button" class="page-btn ${
              parseInt(page) === this.options.current ? "page-btn--active" : ""
            }">${page}</button>
          `;
          })
          .join("")}
        <button type="button" class="page-btn next-page" ${next()}></button>
        <button type="button" class="page-btn end-page" ${end()}></button>
      `;
  }

  _handleClick(el) {
    let otherPages = true;

    if (el.matches(".start-page")) {
      this.options.current = 1;
      otherPages = false;
    }

    if (el.matches(".prev-page")) {
      this.options.current -= 1;
      otherPages = false;
    }

    if (el.matches(".next-page")) {
      this.options.current += 1;
      otherPages = false;
    }

    if (el.matches(".end-page")) {
      this.options.current = this.options.total;
      otherPages = false;
    }

    if (otherPages) {
      this.options.current = Number(el.innerText);
    }

    this._update();
    /* this.options.callback(this.options.current); */
  }

  _update() {
    this._generatePageNumbers();
    const newMarkup = this._generateMarkup();
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll("*"));
    const currentElements = Array.from(this.element.querySelectorAll("*"));

    this.element.innerHTML = this._generateMarkup();
  }

  _show() {
    this.options.total;
    this._generatePageNumbers();
    this.element.innerHTML = this._generateMarkup();

    this.element.addEventListener("click", (e) => {
      e.preventDefault();
      const el = e.target.closest(".page-btn");

      if (!el) return;
      this._handleClick(el);
    });

    this.options.container.appendChild(this.element);
  }

  /*  refresh(total) {
    this.options.current = 1;
    this.options.total = total;
    this._update();
  } */
}

const pagination = new Pagination({
  container: document.querySelector("#section--3 .slider.container"),
});
