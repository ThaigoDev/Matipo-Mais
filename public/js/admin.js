// Matipó + — interações do painel administrativo
(function () {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const normalize = (t) => (t || "").toString().normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
  const pathValue = (obj, name) =>
    name.replace(/\]/g, "").split("[").reduce((o, k) => (o == null ? undefined : o[k]), obj);

  // ---------- Notificações ----------
  const toastBox = $(".toasts");
  function dismiss(toast) {
    toast.classList.add("is-leaving");
    setTimeout(() => toast.remove(), 250);
  }
  function toast(message, type = "success") {
    const el = document.createElement("div");
    el.className = `toast ${type}`;
    el.setAttribute("role", type === "error" ? "alert" : "status");
    el.innerHTML = `<i class="ph-fill ${type === "error" ? "ph-warning-circle" : "ph-check-circle"}"></i><span></span><button type="button" aria-label="Fechar" data-toast-close><i class="ph-bold ph-x"></i></button>`;
    el.querySelector("span").textContent = message;
    toastBox.appendChild(el);
    setTimeout(() => el.isConnected && dismiss(el), 5000);
  }
  $$(".toast").forEach((t) => setTimeout(() => t.isConnected && dismiss(t), t.classList.contains("error") ? 8000 : 5000));
  document.addEventListener("click", (e) => {
    const close = e.target.closest("[data-toast-close]");
    if (close) dismiss(close.closest(".toast"));
  });

  // ---------- Sidebar (mobile) ----------
  const sidebar = $("#sidebar");
  $$("[data-open-sidebar]").forEach((b) => b.addEventListener("click", () => sidebar.classList.add("is-open")));
  $$("[data-close-sidebar]").forEach((b) => b.addEventListener("click", () => sidebar.classList.remove("is-open")));

  // Atalho "/" para a busca global
  document.addEventListener("keydown", (e) => {
    if (e.key === "/" && !e.target.closest("input, textarea, select, [contenteditable]") && !$("dialog[open]")) {
      e.preventDefault();
      $(".global-search input").focus();
    }
  });

  // ---------- Menus suspensos ----------
  document.addEventListener("click", (e) => {
    const toggle = e.target.closest("[data-menu-toggle]");
    $$(".menu.is-open").forEach((m) => {
      if (!toggle || m !== toggle.closest(".menu")) m.classList.remove("is-open");
    });
    if (toggle) {
      e.stopPropagation();
      toggle.closest(".menu").classList.toggle("is-open");
    }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") $$(".menu.is-open").forEach((m) => m.classList.remove("is-open"));
  });

  // ---------- POST a partir de botões ----------
  function postTo(url, fields = {}) {
    const form = document.createElement("form");
    form.method = "post";
    form.action = url;
    Object.entries(fields).forEach(([name, value]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = name;
      input.value = value;
      form.appendChild(input);
    });
    document.body.appendChild(form);
    form.submit();
  }
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-post]");
    if (!btn) return;
    e.preventDefault();
    btn.disabled = true;
    postTo(btn.dataset.post, btn.dataset.postFields ? JSON.parse(btn.dataset.postFields) : {});
  });

  // ---------- Confirmação ----------
  const confirmDialog = $("#confirm-dialog");
  let confirmCallback = null;
  function askConfirm({ title, text, label = "Excluir", action, onConfirm }) {
    $("[data-confirm-title]", confirmDialog).textContent = title;
    $("[data-confirm-text]", confirmDialog).textContent = text || "Essa ação não pode ser desfeita.";
    $("[data-confirm-submit]", confirmDialog).textContent = label;
    const form = $("form", confirmDialog);
    form.action = action || "";
    confirmCallback = onConfirm || null;
    confirmDialog.showModal();
    $("[data-dialog-close]", confirmDialog).focus();
  }
  if (confirmDialog) {
    $("form", confirmDialog).addEventListener("submit", (e) => {
      if (confirmCallback) {
        e.preventDefault();
        confirmDialog.close();
        confirmCallback();
      }
    });
    $$("[data-dialog-close]", confirmDialog).forEach((b) => b.addEventListener("click", () => confirmDialog.close()));
    confirmDialog.addEventListener("click", (e) => e.target === confirmDialog && confirmDialog.close());
  }
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-confirm]");
    if (!btn) return;
    e.preventDefault();
    askConfirm({ title: btn.dataset.confirm, text: btn.dataset.confirmText, label: btn.dataset.confirmLabel, action: btn.dataset.action });
  });

  // ---------- Copiar link ----------
  document.addEventListener("click", async (e) => {
    const btn = e.target.closest("[data-copy-link]");
    if (!btn) return;
    const url = new URL(btn.dataset.copyLink, window.location.origin).href;
    try {
      await navigator.clipboard.writeText(url);
      toast("Link copiado! Cole no WhatsApp ou nas redes sociais.");
    } catch (err) {
      window.prompt("Copie o link:", url);
    }
  });

  // =========================================================
  // TABELA DA SEÇÃO
  // =========================================================
  const table = $("[data-table]");
  const drawer = $("#record-drawer");
  const config = drawer ? JSON.parse(drawer.dataset.config) : {};

  if (table) {
    const tbody = table.tBodies[0];
    const rows = () => $$("tr[data-row]", tbody);
    const filters = { text: "", status: "", category: "", featured: false, incomplete: false };
    const emptyFilter = $("[data-empty-filter]");

    function applyFilters() {
      const q = normalize(filters.text);
      let visible = 0;
      rows().forEach((row) => {
        const d = row.dataset;
        const show =
          (!q || normalize(d.search).includes(q)) &&
          (!filters.status || d.status === filters.status) &&
          (!filters.category || d.category === filters.category) &&
          (!filters.featured || d.featured === "1") &&
          (!filters.incomplete || Number(d.pct) < 100);
        row.hidden = !show;
        if (show) visible++;
        if (!show) $("[data-select-row]", row).checked = false;
      });
      if (emptyFilter) emptyFilter.hidden = visible > 0;
      table.closest(".table-wrap").hidden = visible === 0;
      updateSelection();
    }

    $("[data-filter-text]").addEventListener("input", (e) => {
      filters.text = e.target.value;
      applyFilters();
    });
    $$("[data-filter-status]").forEach((chip) =>
      chip.addEventListener("click", () => {
        $$("[data-filter-status]").forEach((c) => c.classList.toggle("is-active", c === chip));
        filters.status = chip.dataset.filterStatus;
        applyFilters();
      })
    );
    $("[data-filter-category]").addEventListener("change", (e) => {
      filters.category = e.target.value;
      applyFilters();
    });
    $("[data-filter-featured]").addEventListener("change", (e) => {
      filters.featured = e.target.checked;
      applyFilters();
    });
    $("[data-filter-incomplete]").addEventListener("change", (e) => {
      filters.incomplete = e.target.checked;
      applyFilters();
    });
    $$("[data-clear-filters]").forEach((b) =>
      b.addEventListener("click", () => {
        Object.assign(filters, { text: "", status: "", category: "", featured: false, incomplete: false });
        $("[data-filter-text]").value = "";
        $("[data-filter-category]").value = "";
        $("[data-filter-featured]").checked = false;
        $("[data-filter-incomplete]").checked = false;
        $$("[data-filter-status]").forEach((c, i) => c.classList.toggle("is-active", i === 0));
        applyFilters();
      })
    );

    // Ordenação
    $$("th[data-sort]", table).forEach((th) =>
      th.addEventListener("click", () => {
        const key = th.dataset.sort;
        const asc = !th.classList.contains("sorted-asc");
        $$("th[data-sort]", table).forEach((h) => h.classList.remove("sorted-asc", "sorted-desc"));
        th.classList.add(asc ? "sorted-asc" : "sorted-desc");
        const sorted = rows().sort((a, b) => {
          const va = a.dataset[key];
          const vb = b.dataset[key];
          const cmp = key === "name" ? va.localeCompare(vb, "pt-BR") : Number(va) - Number(vb);
          return asc ? cmp : -cmp;
        });
        sorted.forEach((r) => tbody.appendChild(r));
      })
    );

    // Seleção e ações em massa
    const bulkForm = $("#bulk-form");
    const selectAll = $("[data-select-all]");
    function updateSelection() {
      const visibleRows = rows().filter((r) => !r.hidden);
      const selected = visibleRows.filter((r) => $("[data-select-row]", r).checked);
      rows().forEach((r) => r.classList.toggle("is-selected", $("[data-select-row]", r).checked));
      bulkForm.hidden = selected.length === 0;
      $("[data-selected-count]").textContent = selected.length;
      selectAll.checked = selected.length > 0 && selected.length === visibleRows.length;
      selectAll.indeterminate = selected.length > 0 && selected.length < visibleRows.length;
    }
    selectAll.addEventListener("change", () => {
      rows().forEach((r) => {
        if (!r.hidden) $("[data-select-row]", r).checked = selectAll.checked;
      });
      updateSelection();
    });
    tbody.addEventListener("change", (e) => e.target.matches("[data-select-row]") && updateSelection());
    $("[data-bulk-clear]").addEventListener("click", () => {
      $$("[data-select-row]").forEach((c) => (c.checked = false));
      updateSelection();
    });
    $$("[data-bulk]").forEach((btn) =>
      btn.addEventListener("click", () => {
        const action = btn.dataset.bulk;
        const count = $("[data-selected-count]").textContent;
        bulkForm.elements.action.value = action;
        if (action === "delete") {
          askConfirm({
            title: `Excluir ${count} registro(s)?`,
            text: "Eles saem do site imediatamente. Essa ação não pode ser desfeita.",
            label: "Excluir todos",
            onConfirm: () => bulkForm.submit(),
          });
        } else {
          bulkForm.submit();
        }
      })
    );

    // Exportar CSV (respeita os filtros)
    $$("[data-export]").forEach((btn) =>
      btn.addEventListener("click", () => {
        const head = ["Nome", "Categoria", "Endereço", "WhatsApp", "Telefone", "E-mail", "Status", "Destaque", "Perfil (%)", "Visitas", "Atualizado em"];
        const lines = rows()
          .filter((r) => !r.hidden)
          .map((r) => {
            const rec = JSON.parse(r.dataset.record);
            const c = rec[config.contactKey] || {};
            return [
              rec[config.nameField], rec.categoryName, rec[config.locationField], c.whatsApp, c[config.phoneKey], c.email,
              rec.status, rec.featured ? "Sim" : "Não", r.dataset.pct, rec.views || 0,
              rec.updatedAt ? new Date(rec.updatedAt).toLocaleString("pt-BR") : "",
            ];
          });
        const csv = [head, ...lines].map((cols) => cols.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(";")).join("\r\n");
        const link = document.createElement("a");
        link.href = URL.createObjectURL(new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" }));
        link.download = `${btn.dataset.filename}-${new Date().toISOString().slice(0, 10)}.csv`;
        link.click();
        URL.revokeObjectURL(link.href);
        toast(`${lines.length} registro(s) exportado(s).`);
      })
    );

    // Editar ao clicar
    tbody.addEventListener("click", (e) => {
      const edit = e.target.closest("[data-edit]");
      if (edit) window.openDrawer(JSON.parse(edit.closest("tr").dataset.record));
    });
  }

  // =========================================================
  // DRAWER (criar / editar)
  // =========================================================
  let snapshot = "";
  let fileChosen = false;

  if (drawer) {
    const form = $("[data-record-form]", drawer);
    const base = drawer.dataset.base;
    const singular = drawer.dataset.singular;
    const fileInput = $("#photo-input", drawer);
    const preview = $("[data-photo-preview]", drawer);
    const dropzone = $("[data-dropzone]", drawer);

    const serialize = () => {
      const data = new FormData(form);
      data.delete("photo");
      return new URLSearchParams(data).toString() + (fileChosen ? "|file" : "");
    };
    const isDirty = () => serialize() !== snapshot;
    const updateDirty = () => ($("[data-dirty-flag]", drawer).hidden = !isDirty());

    function setPhoto(src) {
      preview.hidden = !src;
      if (src) preview.src = src;
      $("[data-dz-empty]", drawer).hidden = Boolean(src);
      $("[data-dz-actions]", drawer).hidden = !src;
    }

    function fillForm(record) {
      form.reset();
      fileChosen = false;
      form.elements.removePhoto.value = "";
      $$(".field.has-error", form).forEach((f) => f.classList.remove("has-error"));
      $$(".error-text", form).forEach((t) => t.remove());

      Array.from(form.elements).forEach((el) => {
        if (!el.name || ["photo", "removePhoto"].includes(el.name) || el.type === "hidden") return;
        const value = pathValue(record, el.name);
        if (el.type === "checkbox") {
          el.checked = el.name === "featured" ? Boolean(record.featured) : Array.isArray(value) && value.includes(el.value);
        } else if (el.type === "radio") {
          if (value !== undefined) el.checked = value === el.value;
        } else if (el.tagName === "SELECT") {
          if (value && !Array.from(el.options).some((o) => o.value === value)) el.add(new Option(value, value));
          el.value = value || "";
        } else {
          el.value = value ?? "";
        }
      });
      // Status desconhecido: marca a primeira opção
      if (!$("input[name=status]:checked", form)) {
        const first = $("input[name=status]", form);
        if (first) first.checked = true;
      }
      setPhoto(record[config.photoField] ? `/uploads/${record[config.photoField]}` : "");
      refreshMap();
      refreshCounters();
      $$("[data-mask=phone]", form).forEach((i) => (i.value = maskPhone(i.value)));
    }

    function openDrawer(record) {
      const isEdit = Boolean(record && record._id);
      fillForm(record || {});
      form.action = isEdit ? `${base}/update/${record._id}` : `${base}/new`;
      $("[data-drawer-title]", drawer).textContent = isEdit ? record[config.nameField] : `Novo(a) ${singular}`;
      $("[data-submit-label]", drawer).textContent = isEdit ? "Salvar alterações" : "Publicar";
      const pub = $("[data-view-public]", drawer);
      pub.hidden = !isEdit;
      if (isEdit) pub.href = drawer.dataset.publicUrl.replace("__ID__", record._id);
      const meta = $("[data-meta-line]", drawer);
      meta.hidden = !isEdit;
      if (isEdit) {
        const parts = [];
        if (record.publisher) parts.push(`Publicado por ${record.publisher}`);
        if (record.createdAt) parts.push(`criado em ${new Date(record.createdAt).toLocaleDateString("pt-BR")}`);
        if (record.updatedAt) parts.push(`última alteração ${new Date(record.updatedAt).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}`);
        parts.push(`${record.views || 0} visita(s)`);
        meta.textContent = parts.join(" · ");
      }
      const btn = $("[data-submit]", drawer);
      btn.disabled = false;
      btn.classList.remove("is-loading");
      $("[data-completeness]", drawer).hidden = !isEdit;
      refreshCompleteness();
      drawer.showModal();
      drawer.querySelector(".drawer-body").scrollTop = 0;
      setTimeout(() => {
        snapshot = serialize();
        updateDirty();
        const first = $("input:not([type=hidden]):not([type=file]), textarea", $(".form-section:nth-of-type(2)", drawer));
        if (first && !isEdit) first.focus();
      }, 30);
    }
    window.openDrawer = openDrawer;

    function closeDrawer(force) {
      if (!force && isDirty() && !window.confirm("Descartar as alterações não salvas?")) return;
      drawer.close();
    }
    $$("[data-drawer-close]", drawer).forEach((b) => b.addEventListener("click", () => closeDrawer()));
    drawer.addEventListener("cancel", (e) => {
      e.preventDefault();
      closeDrawer();
    });
    drawer.addEventListener("mousedown", (e) => {
      if (e.target === drawer) closeDrawer();
    });
    window.addEventListener("beforeunload", (e) => {
      if (drawer.open && isDirty() && !form.dataset.submitting) {
        e.preventDefault();
        e.returnValue = "";
      }
    });
    form.addEventListener("input", () => {
      updateDirty();
      refreshCompleteness();
    });
    form.addEventListener("change", () => {
      updateDirty();
      refreshCompleteness();
    });

    $$("[data-open-form]").forEach((b) => b.addEventListener("click", () => openDrawer(null)));

    // Validação com mensagens em português
    form.addEventListener(
      "invalid",
      (e) => {
        const field = e.target.closest(".field");
        if (!field) return;
        field.classList.add("has-error");
        if (!$(".error-text", field)) {
          const msg = document.createElement("span");
          msg.className = "error-text";
          msg.textContent = e.target.validity.valueMissing ? "Campo obrigatório." : "Valor inválido.";
          field.appendChild(msg);
        }
      },
      true
    );
    form.addEventListener("input", (e) => {
      const field = e.target.closest(".field.has-error");
      if (field && e.target.checkValidity()) {
        field.classList.remove("has-error");
        const msg = $(".error-text", field);
        if (msg) msg.remove();
      }
    });
    $("[data-submit]", drawer).addEventListener("click", () => {
      const invalid = $(":invalid:not(fieldset)", form);
      if (invalid) setTimeout(() => invalid.scrollIntoView({ behavior: "smooth", block: "center" }), 0);
    });
    form.addEventListener("submit", () => {
      form.dataset.submitting = "1";
      const btn = $("[data-submit]", drawer);
      btn.classList.add("is-loading");
      btn.querySelector("i").className = "ph-bold ph-spinner-gap";
      setTimeout(() => (btn.disabled = true), 0);
    });

    // ---------- Foto ----------
    function useFile(file) {
      if (!file) return;
      if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) return toast("Envie uma imagem PNG, JPG ou WEBP.", "error");
      if (file.size > 5 * 1024 * 1024) return toast("A imagem é muito grande (máximo 5 MB).", "error");
      fileChosen = true;
      form.elements.removePhoto.value = "";
      setPhoto(URL.createObjectURL(file));
      updateDirty();
      refreshCompleteness();
    }
    fileInput.addEventListener("change", () => useFile(fileInput.files[0]));
    ["dragenter", "dragover"].forEach((ev) =>
      dropzone.addEventListener(ev, (e) => {
        e.preventDefault();
        dropzone.classList.add("is-over");
      })
    );
    ["dragleave", "drop"].forEach((ev) => dropzone.addEventListener(ev, () => dropzone.classList.remove("is-over")));
    dropzone.addEventListener("drop", (e) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (!file) return;
      const dt = new DataTransfer();
      dt.items.add(file);
      fileInput.files = dt.files;
      useFile(file);
    });
    $("[data-photo-remove]", drawer).addEventListener("click", () => {
      fileInput.value = "";
      fileChosen = false;
      form.elements.removePhoto.value = "1";
      setPhoto("");
      updateDirty();
      refreshCompleteness();
    });

    // ---------- Dias da semana ----------
    $$("[data-days]", drawer).forEach((btn) =>
      btn.addEventListener("click", () => {
        const boxes = $$("input[type=checkbox]", btn.closest(".field"));
        boxes.forEach((b, i) => {
          b.checked = btn.dataset.days === "all" || (btn.dataset.days === "weekdays" && i >= 1 && i <= 5);
        });
        form.dispatchEvent(new Event("change"));
      })
    );

    // ---------- Mapa ----------
    const mapField = $("[data-map-field]", drawer);
    function embedUrl(value) {
      const v = (value || "").trim();
      const m = v.match(/src=["']([^"']+)["']/i);
      const url = m ? m[1] : v;
      if (!/^https:\/\//i.test(url)) return "";
      return /\/maps\/embed|output=embed/.test(url) ? url : "";
    }
    function refreshMap() {
      if (!mapField) return;
      const input = $("input", mapField);
      const box = $("[data-map-preview]", mapField);
      const url = embedUrl(input.value);
      const address = form.elements[mapField.dataset.addressFrom];
      $("[data-map-open]", mapField).href = address && address.value
        ? `https://www.google.com/maps/search/${encodeURIComponent(address.value + ", Matipó - MG")}`
        : "https://www.google.com/maps";
      if (url) {
        if (!box.querySelector("iframe") || box.querySelector("iframe").src !== url) {
          box.innerHTML = `<iframe loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="Prévia do mapa"></iframe>`;
          box.querySelector("iframe").src = url;
        }
      } else {
        box.innerHTML = input.value.trim()
          ? `<div class="map-placeholder"><i class="ph-bold ph-warning"></i><span>Use o código de “Incorporar um mapa” do Google Maps, ou gere pelo endereço.</span></div>`
          : `<div class="map-placeholder"><i class="ph-bold ph-map-trifold"></i><span>A prévia do mapa aparece aqui</span></div>`;
      }
    }
    if (mapField) {
      const input = $("input", mapField);
      let timer;
      input.addEventListener("input", () => {
        clearTimeout(timer);
        timer = setTimeout(refreshMap, 400);
      });
      $("[data-map-generate]", mapField).addEventListener("click", () => {
        const address = form.elements[mapField.dataset.addressFrom];
        if (!address || !address.value.trim()) {
          toast("Preencha o endereço primeiro.", "error");
          return address && address.focus();
        }
        input.value = `https://maps.google.com/maps?q=${encodeURIComponent(address.value.trim() + ", Matipó - MG")}&z=16&output=embed`;
        refreshMap();
        form.dispatchEvent(new Event("change"));
      });
      $("[data-map-clear]", mapField).addEventListener("click", () => {
        input.value = "";
        refreshMap();
        form.dispatchEvent(new Event("change"));
      });
      const address = form.elements[mapField.dataset.addressFrom];
      if (address) address.addEventListener("input", refreshMap);
    }

    // ---------- Contadores de caracteres ----------
    function refreshCounters() {
      $$("[data-counter-for]", drawer).forEach((c) => {
        const el = document.getElementById(c.dataset.counterFor);
        c.textContent = `${el.value.length}/${el.maxLength}`;
      });
    }
    form.addEventListener("input", (e) => e.target.tagName === "TEXTAREA" && refreshCounters());

    // ---------- Completude ao vivo ----------
    function refreshCompleteness() {
      const box = $("[data-completeness]", drawer);
      const val = (name) => (form.elements[name] ? String(form.elements[name].value || "").trim() : "");
      const checks = [
        ["Foto", !preview.hidden],
        ["Descrição", Boolean(val(config.descriptionField))],
        ["Contato", ["whatsApp", config.phoneKey, "email"].some((k) => val(`${config.contactKey}[${k}]`))],
        ["Mapa", Boolean(val(config.mapField))],
      ];
      if (config.hasHours) checks.push(["Horário", Boolean(val("openingTime") && val("closingTime"))]);
      const missing = checks.filter(([, ok]) => !ok).map(([l]) => l);
      const pct = Math.round(((checks.length - missing.length) / checks.length) * 100);
      const bar = $("[data-completeness-bar]", box);
      bar.style.width = pct + "%";
      bar.className = pct === 100 ? "full" : pct >= 60 ? "mid" : "low";
      $("[data-completeness-pct]", box).textContent = pct + "%";
      $("[data-completeness-text]", box).textContent = missing.length ? `Falta: ${missing.join(", ")}` : "Cadastro completo!";
      box.classList.toggle("done", pct === 100);
    }

    // Abre automaticamente (?new=1 ou ?edit=ID)
    if (drawer.dataset.openNew) openDrawer(null);
    if (drawer.dataset.openEdit) {
      const row = $(`tr[data-id="${CSS.escape(drawer.dataset.openEdit)}"]`);
      if (row) {
        row.scrollIntoView({ block: "center" });
        openDrawer(JSON.parse(row.dataset.record));
      }
    }
    if (drawer.dataset.openNew || drawer.dataset.openEdit) history.replaceState(null, "", window.location.pathname);
  }

  // ---------- Máscara de telefone ----------
  function maskPhone(value) {
    const d = (value || "").replace(/\D/g, "").slice(0, 11);
    if (!d) return "";
    if (d.length <= 2) return `(${d}`;
    if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  }
  document.addEventListener("input", (e) => {
    if (e.target.matches("[data-mask=phone]")) e.target.value = maskPhone(e.target.value);
  });

  // ---------- Categorias: filtro e edição inline ----------
  $$("[data-filter-list]").forEach((input) =>
    input.addEventListener("input", () => {
      const q = normalize(input.value);
      $$("[data-list-item]", $(input.dataset.filterList)).forEach((li) => (li.hidden = q && !normalize(li.dataset.search).includes(q)));
    })
  );
  $$("[data-inline-start]").forEach((btn) =>
    btn.addEventListener("click", () => {
      const form = btn.closest(".list-item").querySelector("[data-inline-edit]");
      const input = form.elements.category;
      input.readOnly = false;
      input.focus();
      input.select();
      $("[data-inline-save]", form).hidden = false;
    })
  );
  $$("[data-inline-edit] input").forEach((input) =>
    input.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        input.value = input.defaultValue;
        input.readOnly = true;
        $("[data-inline-save]", input.form).hidden = true;
      }
    })
  );

  // ---------- Senhas ----------
  $$("[data-generate-password]").forEach((btn) =>
    btn.addEventListener("click", () => {
      const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%";
      const values = crypto.getRandomValues(new Uint32Array(12));
      $(btn.dataset.generatePassword).value = Array.from(values, (v) => chars[v % chars.length]).join("");
    })
  );
  $$("[data-strength]").forEach((input) =>
    input.addEventListener("input", () => {
      const v = input.value;
      let score = 0;
      if (v.length >= 8) score++;
      if (v.length >= 12) score++;
      if (/[A-Z]/.test(v) && /[a-z]/.test(v)) score++;
      if (/\d/.test(v) && /[^A-Za-z0-9]/.test(v)) score++;
      const meter = $("[data-strength-meter]", input.closest(".field"));
      meter.dataset.score = v ? Math.max(1, score) : 0;
      $("[data-strength-text]", input.closest(".field")).textContent = !v
        ? "Use pelo menos 8 caracteres, misturando letras, números e símbolos."
        : ["Muito fraca", "Fraca", "Razoável", "Boa", "Forte"][Math.max(1, score)];
    })
  );
  $$("[data-password-form]").forEach((form) =>
    form.addEventListener("submit", (e) => {
      if (form.elements.newPassword.value !== form.elements.confirmPassword.value) {
        e.preventDefault();
        toast("A confirmação não confere com a nova senha.", "error");
      }
    })
  );
})();
