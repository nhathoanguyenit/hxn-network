class CustomModal {

    constructor({ id, onSubmit, onClose }) {
      this.modalEl = document.getElementById(id);
      if (!this.modalEl) throw new Error(`Modal with id "${id}" not found`);
  
      document.body.appendChild(this.modalEl);
      this.bsModal = new bootstrap.Modal(this.modalEl);
      this.submitBtn = this.modalEl.querySelector('button[data-bs-submit]');
      if (this.submitBtn) {
        this.submitBtn.id = `${id}-btn-save`; // auto-generate ID
        if (onSubmit) {
          this.submitBtn.addEventListener('click', (e) => onSubmit(e, this));
        }
      }
  
      if (onClose) {
        this.modalEl.addEventListener('hidden.bs.modal', () => onClose(this));
      }
    }
  
    show() {
      this.bsModal.show();
    }
  
    hide() {
      this.bsModal.hide();
    }
  
    resetForm() {
      const form = this.modalEl.querySelector('form');
      if (form) form.reset();
    }
  
    fillForm(data) {
        Object.keys(data).forEach(key => {
          const input = this.modalEl.querySelector(`[name="${key}"]`);
          if (input) input.value = data[key];
        });
      }
      
  
    getFormData() {
      const form = this.modalEl.querySelector('form');
      if (!form) return {};
      const formData = new FormData(form);
      return Object.fromEntries(formData.entries());
    }
  }
  