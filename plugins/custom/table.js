class CustomTable {
  constructor(config) {
    this.container = document.querySelector(config.container);
    this.paginationContainer = document.querySelector(config.pagination);
    this.endpoint = config.endpoint;
    this.limit = config.limit || 10;
    this.columns = config.columns;
    this.emptyState = config.emptyState;
    this.page = 1;
    this.total = 0;
    this.pageCount = 0;
    this.className = config.className || "table table-striped table-bordered";
    // Create limit selector and summary dynamically
    this.createPaginationControls();
    this.fetchData();
  }

  createPaginationControls() {
    if (!this.paginationContainer) return;

    // Limit select
    this.limitSelect = document.createElement("select");
    this.limitSelect.className = "form-select d-inline-block w-auto me-2";
    [5, 10, 25, 50].forEach((n) => {
      const option = document.createElement("option");
      option.value = n;
      option.textContent = n;
      if (n === this.limit) option.selected = true;
      this.limitSelect.appendChild(option);
    });
    this.limitSelect.addEventListener("change", (e) => {
      this.limit = parseInt(e.target.value);
      this.page = 1;
      this.fetchData();
    });

    // Summary text
    this.summaryContainer = document.createElement("div");
    this.summaryContainer.className = "text-muted d-inline-block";

    // Buttons container
    this.buttonsContainer = document.createElement("div");
    this.buttonsContainer.className = "d-inline-block ms-3";

    // Append everything to pagination container
    this.paginationContainer.innerHTML = "";
    this.paginationContainer.classList.add("d-flex", "align-items-center");
    this.paginationContainer.appendChild(document.createTextNode("Show "));
    this.paginationContainer.appendChild(this.limitSelect);
    this.paginationContainer.appendChild(document.createTextNode(" entries "));
    this.paginationContainer.appendChild(this.summaryContainer);
    this.paginationContainer.appendChild(this.buttonsContainer);
  }

  async fetchData() {
    this.renderTable([]);
    try {
      const payload = { page: this.page, limit: this.limit };
      const res = await axios.post(this.endpoint, payload);
      const { data, meta } = res.data;
      this.total = meta.total;
      this.pageCount = meta.pageCount;
      this.limit = meta.limit;
      this.page = meta.page;

      this.renderTable(data);
      this.renderPagination();
      this.renderSummary();
    } catch (err) {
      this.renderTable([]);
      console.error("Error loading data:", err);
      this.container.innerHTML = `<div class="${this.emptyState.className}">${this.emptyState.text}</div>`;
      this.summaryContainer.textContent = "";
      this.buttonsContainer.innerHTML = "";
    }
  }

  renderTable(rows) {
    this.container.innerHTML = "";
  
    const table = document.createElement("table");
    table.style.tableLayout = "fixed";
    table.style.width = "100%";
    table.className = this.className;
  
    // ---- HEADER ----
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    this.columns.forEach((col) => {
      const th = document.createElement("th");
      th.innerHTML = typeof col.header === "function" ? col.header(col) : col.label;
      if (col.width) th.style.width = col.width;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);
  
    // ---- BODY ----
    const tbody = document.createElement("tbody");
  
    if (!rows || rows.length === 0) {
      const tr = document.createElement("tr");
      const td = document.createElement("td");
      td.colSpan = this.columns.length; // span all columns
      td.className = this.emptyState.className;
      td.style.textAlign = "center";
      td.textContent = this.emptyState.text;
      tr.appendChild(td);
      tbody.appendChild(tr);
    } else {
      rows.forEach((row) => {
        const tr = document.createElement("tr");
        this.columns.forEach((col) => {
          const td = document.createElement("td");
          let content = col.cell ? col.cell(row) : (row[col.key] ?? "");
          td.style.whiteSpace = "nowrap";
          td.style.overflow = "hidden";
          td.style.textOverflow = "ellipsis";
          td.style.maxWidth = col.width || "150px";
          td.innerHTML = content;
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });
    }
  
    table.appendChild(tbody);
    this.container.appendChild(table);
  }
  
  renderPagination() {
    if (!this.buttonsContainer) return;
    this.buttonsContainer.innerHTML = "";
  
    if (this.pageCount <= 1) return;
  
    const createButton = (text, page, isActive = false, disabled = false) => {
      const btn = document.createElement("button");
      btn.className = `btn btn-sm mx-1 ${isActive ? "btn-primary" : "btn-outline-primary"}`;
      btn.textContent = text;
      btn.disabled = disabled;
      btn.addEventListener("click", () => {
        this.page = page;
        this.fetchData();
      });
      this.buttonsContainer.appendChild(btn);
    };
  
    // Previous button
    createButton("<", Math.max(this.page - 1, 1), false, this.page === 1);
  
    const pages = [];
    const total = this.pageCount;
  
    for (let i = 1; i <= total; i++) {
      if (
        i <= 3 ||                   // first 3 pages
        i > total - 2 ||             // last 2 pages
        (i >= this.page - 1 && i <= this.page + 1) // current ±1
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }
  
    // Render page buttons
    pages.forEach(p => {
      if (p === "...") {
        const span = document.createElement("span");
        span.textContent = "...";
        span.className = "mx-1";
        this.buttonsContainer.appendChild(span);
      } else {
        createButton(p, p, p === this.page);
      }
    });
  
    // Next button
    createButton(">", Math.min(this.page + 1, total), false, this.page === total);
  }

  renderSummary() {
    const start = (this.page - 1) * this.limit + 1;
    const end = Math.min(this.page * this.limit, this.total);
    this.summaryContainer.textContent = `Showing ${start}–${end} of ${this.total} items`;
  }
}
