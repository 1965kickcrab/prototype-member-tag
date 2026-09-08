import { createAlertDialog } from "../../shared/components/alert.js";
import { createEmptyStateElement } from "../../shared/components/empty-state.js";
import { createToast, TOAST_AUTO_DISMISS_MS } from "../../shared/components/toast.js";
import {
  applyMemberTagCatalogEdits,
  createMemberTag,
  deleteMemberTag,
  getStoredMembers,
  loadMemberTagCatalog,
  renameMemberTag,
} from "../../shared/storage/member-storage.js";
import {
  buildTagSuggestions,
  MAX_MEMBER_TAG_CATALOG_SIZE,
  normalizeMemberTagName,
  sortMemberTagNames,
} from "../../shared/services/member-tag-service.js";
import { createElement } from "../../shared/utils/dom.js";
import {
  getActiveMemberTagCatalog,
  getVisibleMemberTags,
  hasMemberTagDraftChanges,
} from "./member-tag-management-state.js";

const MEMBER_TAG_DUPLICATE_MESSAGE = "이미 존재하는 태그입니다.";
const MEMBER_TAG_MAX_CATALOG_MESSAGE = "태그는 최대 20개까지 등록할 수 있습니다.";
const MEMBER_TAG_SAVE_MESSAGE = "변경된 설정을 저장했습니다.";
const MEMBER_TAG_CREATE_MESSAGE = "태그를 생성했습니다.";
const MEMBER_TAG_EDIT_MESSAGE = "태그를 수정했습니다.";
const MEMBER_TAG_DELETE_MESSAGE = "삭제했습니다.";
const MAX_MEMBER_TAG_NAME_LENGTH = 10;
const CHEVRON_LEFT_ICON_PATH = "../assets/iconChevronLeft.svg";
const CHEVRON_RIGHT_ICON_PATH = "../assets/iconChevronRight.svg";
const CLOSE_ICON_PATH = "../assets/iconClose.svg";
const EDIT_ICON_PATH = "../../../assets/iconEdit.svg";
const DELETE_ICON_PATH = "../../../assets/iconDelete.svg";
const WEB_MEMBER_HOME_HREF = "../../member-home.html";
const WEB_SCHOOL_HOME_HREF = "../../index.html";
const WEB_HOTEL_HOME_HREF = "../../hotel-home.html";
let toastDismissTimer = null;

export function renderMemberTagManagementScreen(rootElement, state) {
  rootElement.innerHTML = "";
  rootElement.append(state.mode === "web" ? createWebSettingsScreen(state) : createAppScreen(state));
  scheduleToastDismiss(state);
}

function rerender(state) {
  renderMemberTagManagementScreen(document.querySelector("#app"), state);
}

function scheduleToastDismiss(state) {
  window.clearTimeout(toastDismissTimer);

  if (!state.toastMessage) {
    return;
  }

  toastDismissTimer = window.setTimeout(() => {
    state.toastMessage = "";
    rerender(state);
  }, TOAST_AUTO_DISMISS_MS);
}

function createAppScreen(state) {
  const screen = createElement("main", {
    className: state.isDeleteReplacementScreenOpen
      ? "member-tag-management-screen is-replacement-mode"
      : "member-tag-management-screen",
    dataset: { screen: "memberTagManagement", platform: "app" },
  });

  if (state.isDeleteReplacementScreenOpen) {
    screen.append(createAppDeleteReplacementScreen(state));
    if (state.isDataConflictAlertOpen) {
      screen.append(createDataConflictAlert(state));
    }
    return screen;
  }

  screen.append(createAppHeader(state));
  screen.append(createBody(state));

  if (state.activeMemberTagSheetTagName) {
    screen.append(createMemberTagEditBottomSheet(state));
  }

  if (state.isMemberTagCreateSheetOpen) {
    screen.append(createMemberTagCreateSheet(state));
  }

  if (state.isDeleteReplacementModalOpen) {
    screen.append(createDeleteReplacementModal(state));
  }

  if (state.isDeleteConfirmationAlertOpen) {
    screen.append(createAppConnectedDeleteAlert(state));
  }

  if (state.isDataConflictAlertOpen) {
    screen.append(createDataConflictAlert(state));
  }

  if (state.toastMessage) {
    screen.append(createToast(state.toastMessage));
  }

  return screen;
}

function createAppHeader(state) {
  const header = createElement("header", { className: "member-tag-management-page-header" });
  const backButton = createElement("button", {
    className: "member-tag-management-back-button",
    type: "button",
    ariaLabel: "뒤로가기",
    dataset: { action: "backToAppMore" },
  });
  backButton.append(createElement("img", {
    className: "member-tag-management-back-icon",
    src: CHEVRON_LEFT_ICON_PATH,
    alt: "",
  }));
  backButton.addEventListener("click", () => {
    window.location.href = "./app-more.html";
  });
  header.append(backButton);
  header.append(createElement("h1", { textContent: "태그 관리" }));
  const createButton = createElement("button", {
    className: "text-button is-primary member-tag-management-header-create-button",
    type: "button",
    textContent: "생성",
    dataset: { action: "openMemberTagCreateSheet" },
  });
  createButton.disabled = getActiveMemberTagCatalog(state).length >= MAX_MEMBER_TAG_CATALOG_SIZE;
  createButton.addEventListener("click", () => {
    openMemberTagCreateSheet(state);
  });
  header.append(createButton);
  return header;
}

function createWebSettingsScreen(state) {
  const screen = createElement("main", {
    className: "settings-member-tag-management-screen",
    dataset: { screen: "settingsMemberTagManagement", platform: "web" },
  });
  screen.append(createSettingsTopbar(state));
  screen.append(createSettingsLayout(state));

  if (hasMemberTagDraftChanges(state)) {
    screen.append(createSettingsSaveBar(state));
  }

  if (state.isDiscardAlertOpen) {
    screen.append(createDiscardChangesAlert(state));
  }

  if (state.isDeleteReplacementModalOpen) {
    screen.append(createDeleteReplacementModal(state));
  }
  if (state.isDataConflictAlertOpen) {
    screen.append(createDataConflictAlert(state));
  }
  if (state.toastMessage) {
    screen.append(createToast(state.toastMessage));
  }

  return screen;
}

function createSettingsTopbar(state) {
  const topbar = createElement("header", { className: "settings-topbar" });
  const backButton = createElement("button", {
    className: "settings-back-button",
    type: "button",
    textContent: "←",
    ariaLabel: "설정 나가기",
    dataset: { action: "backToMemberHome" },
  });
  backButton.addEventListener("click", () => {
    requestWebNavigation(state, WEB_MEMBER_HOME_HREF);
  });
  topbar.append(backButton);
  topbar.append(createElement("h1", { textContent: "업장 설정" }));
  return topbar;
}

function createSettingsLayout(state) {
  const layout = createElement("div", { className: "settings-layout" });
  layout.append(createSettingsSidebar(state));
  layout.append(createSettingsContent(state));
  return layout;
}

function createSettingsSidebar(state) {
  const sidebar = createElement("aside", {
    className: "settings-sidebar",
    dataset: { area: "settingsNavigation" },
  });

  sidebar.append(createSettingsNavButton({
    label: "유치원",
    iconSrc: "../../../assets/menuIcon_daycare.svg",
    href: WEB_SCHOOL_HOME_HREF,
    state,
  }));
  sidebar.append(createSettingsNavButton({
    label: "호텔링",
    iconSrc: "../../../assets/menuIcon_hotel.svg",
    href: WEB_HOTEL_HOME_HREF,
    state,
  }));

  const memberGroup = createElement("section", {
    className: "settings-nav-group is-open",
    dataset: { state: "selected", area: "memberSettingsMenu" },
  });
  memberGroup.append(createSettingsNavButton({
    label: "회원",
    iconSrc: "../../../assets/menuIcon_member.svg",
    selected: true,
    state,
  }));

  const subnav = createElement("div", { className: "settings-subnav" });
  subnav.append(createElement("button", {
    className: "settings-subnav-button is-selected",
    type: "button",
    textContent: "태그 관리",
    dataset: { action: "openMemberTagSettings", state: "selected" },
  }));
  memberGroup.append(subnav);
  sidebar.append(memberGroup);
  return sidebar;
}

function createSettingsNavButton(options) {
  const button = createElement("button", {
    className: options.selected ? "settings-nav-button is-selected" : "settings-nav-button",
    type: "button",
    dataset: {
      action: options.href ? "navigateSettingsMenu" : "toggleSettingsMenu",
      state: options.selected ? "selected" : "idle",
    },
  });

  if (options.iconSrc) {
    button.append(createElement("img", { src: options.iconSrc, alt: "" }));
  }

  button.append(createElement("span", { textContent: options.label }));

  if (options.href) {
    button.addEventListener("click", () => {
      requestWebNavigation(options.state, options.href);
    });
  }

  return button;
}

function createSettingsContent(state) {
  const content = createElement("section", {
    className: "settings-content",
    dataset: { area: "settingsContent" },
  });
  const card = createElement("section", { className: "settings-content-card" });
  const header = createElement("header", { className: "settings-content-heading" });
  const iconBox = createElement("div", { className: "settings-icon-box" });
  iconBox.append(createElement("img", { src: "../../../assets/menuIcon_setting.svg", alt: "" }));
  header.append(iconBox);
  const titleGroup = createElement("div", { className: "settings-title-group" });
  titleGroup.append(createElement("h2", { textContent: "태그 관리" }));
  titleGroup.append(createElement("p", {
    textContent: "회원 별로 구분할 수 있는 태그를 등록하고 관리할 수 있습니다. (최대 20개)",
  }));
  header.append(titleGroup);
  card.append(header);

  const section = createElement("section", { className: "settings-section-card" });
  section.append(createBody(state));
  card.append(section);
  content.append(card);
  return content;
}

function createSettingsSaveBar(state) {
  const hasChanges = hasMemberTagDraftChanges(state);
  const bar = createElement("section", {
    className: "settings-save-bar",
    dataset: { area: "settingsSaveBar", state: hasChanges ? "dirty" : "idle" },
  });
  const saveButton = createElement("button", {
    className: "primary-button settings-save-button",
    type: "button",
    textContent: "저장",
    dataset: { action: "saveMemberTagSettings" },
  });
  saveButton.disabled = !hasChanges;
  saveButton.addEventListener("click", () => {
    saveWebDrafts(state);
  });
  bar.append(saveButton);
  return bar;
}

function createDiscardChangesAlert(state) {
  return createAlertDialog({
    message: "변경을 취소하시겠습니까?\n변경한 설정은 저장되지 않습니다.",
    actions: [
      {
        label: "닫기",
        variant: "secondary",
        action: "closeDiscardChangesAlert",
        onClick: () => {
          state.isDiscardAlertOpen = false;
          state.pendingNavigationHref = "";
          rerender(state);
        },
      },
      {
        label: "변경 취소",
        variant: "danger",
        action: "discardSettingsChanges",
        onClick: () => {
          const href = state.pendingNavigationHref;
          state.draftMemberTagCatalog = [...state.memberTagCatalog];
          state.memberTagDrafts = [];
          state.deletedDraftMemberTagNames = [];
          state.editingMemberTagName = "";
          state.isCreatingMemberTag = false;
          state.memberTagCreateDraftName = "";
          state.memberTagCreateErrorMessage = "";
          state.memberTagEditDraftName = "";
          state.memberTagEditErrorMessage = "";
          clearDeleteReplacementState(state);
          state.isDiscardAlertOpen = false;
          state.pendingNavigationHref = "";
          if (href) {
            window.location.href = href;
            return;
          }
          rerender(state);
        },
      },
    ],
  });
}

function createBody(state) {
  const body = createElement("section", {
    className: "member-tag-management-page-body",
    dataset: { area: "memberTagManagement" },
  });
  if (state.mode === "web") {
    body.append(createWebMemberTagSectionHeader(state));
    body.append(createWebMemberTagControls(state));
  } else {
    body.append(createElement("p", {
      className: "member-tag-management-app-count",
      textContent: `태그 (${getActiveMemberTagCatalog(state).length}/${MAX_MEMBER_TAG_CATALOG_SIZE})`,
      dataset: { area: "memberTagCount" },
    }));
  }
  body.append(createMemberTagList(state));
  return body;
}

function createWebMemberTagSectionHeader(state) {
  const header = createElement("header", { className: "member-tag-management-section-header" });
  header.append(createElement("h3", { textContent: "회원 태그" }));

  const actions = createElement("div", { className: "member-tag-management-section-actions" });
  actions.append(createElement("span", {
    className: "member-tag-management-count",
    textContent: `${getActiveMemberTagCatalog(state).length} / ${MAX_MEMBER_TAG_CATALOG_SIZE}`,
    dataset: { area: "memberTagCount" },
  }));
  const createButton = createElement("button", {
    className: "member-tag-management-register-button",
    type: "button",
    textContent: "태그 생성",
    dataset: { action: "startCreateMemberTag" },
  });
  createButton.disabled = getActiveMemberTagCatalog(state).length >= MAX_MEMBER_TAG_CATALOG_SIZE;
  createButton.addEventListener("click", () => startWebMemberTagCreate(state));
  actions.append(createButton);
  header.append(actions);
  return header;
}

function createWebMemberTagControls(state) {
  const controls = createElement("div", {
    className: "member-tag-management-controls",
    dataset: { area: "memberTagManagementControls" },
  });
  controls.append(createSearch(state));
  return controls;
}

function createSearch(state) {
  let isComposing = false;
  const field = createElement("label", {
    className: "member-tag-management-search",
    dataset: { field: "memberTagManagementSearch" },
  });
  const input = createElement("input", {
    className: "member-tag-management-search-input",
    type: "search",
    value: state.memberTagManagementQuery || "",
    placeholder: "태그 검색",
    dataset: { field: "memberTagSearch" },
  });
  input.addEventListener("compositionstart", () => {
    isComposing = true;
  });
  input.addEventListener("compositionend", (event) => {
    isComposing = false;
    window.setTimeout(() => {
      state.memberTagManagementQuery = event.target.value;
      state.openMemberTagMenuTagName = "";
      rerender(state);
      focusSearchInput();
    }, 0);
  });
  input.addEventListener("input", (event) => {
    state.memberTagManagementQuery = event.target.value;
    state.openMemberTagMenuTagName = "";

    if (isComposing) {
      syncMemberTagList(state);
      return;
    }

    rerender(state);
    focusSearchInput();
  });
  field.append(input);
  return field;
}

function syncMemberTagList(state) {
  const list = document.querySelector("[data-area='memberTagManagementList']");
  if (!list) {
    return;
  }

  list.replaceWith(createMemberTagList(state));
}

function focusSearchInput() {
  window.setTimeout(() => {
    const input = document.querySelector(".member-tag-management-search-input");
    if (!input) {
      return;
    }

    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
  }, 0);
}

function createMemberTagList(state) {
  const visibleMemberTags = getVisibleMemberTags(state);
  const activeCatalog = getActiveMemberTagCatalog(state);
  const hasQuery = Boolean(String(state.memberTagManagementQuery || "").trim());
  const hasCreateDraft = state.mode === "web" && state.isCreatingMemberTag;
  const list = createElement("div", {
    className: "member-tag-management-list",
    dataset: {
      area: "memberTagManagementList",
      state: visibleMemberTags.length || hasCreateDraft ? "list" : hasQuery ? "searchEmpty" : "empty",
    },
  });

  if (!activeCatalog.length && !hasCreateDraft) {
    list.append(createEmptyStateElement({ title: "등록된 태그가 없습니다." }));
    return list;
  }

  if (hasCreateDraft) {
    list.append(createMemberTagRow(state, ""));
  }

  if (!visibleMemberTags.length && !hasCreateDraft) {
    list.append(createEmptyStateElement({ title: "검색 결과가 없습니다." }));
    return list;
  }

  visibleMemberTags.forEach((memberTagName) => {
    list.append(createMemberTagRow(state, memberTagName));
  });
  return list;
}

function createMemberTagRow(state, memberTagName) {
  const isCreateRow = !memberTagName;
  const isEditing = state.mode === "web"
    && (isCreateRow
      ? state.isCreatingMemberTag
      : normalizeMemberTagName(state.editingMemberTagName) === normalizeMemberTagName(memberTagName));
  const isDeleted = isWebDraftTagDeleted(state, memberTagName);
  const replacementTagName = isDeleted ? getDeleteReplacementTagName(state, memberTagName) : "";
  const rowState = isCreateRow ? "creating" : isEditing ? "editing" : isDeleted ? replacementTagName ? "changed" : "deleted" : "idle";

  if (state.mode === "app") {
    const row = createElement("button", {
      className: "member-tag-management-row member-tag-management-card-row",
      type: "button",
      ariaLabel: `${memberTagName} 태그 편집`,
      dataset: {
        action: "openMemberTagEditSheet",
        entity: "memberTag",
        entityId: memberTagName,
        state: "idle",
      },
    });
    row.append(createElement("span", { className: "member-tag-management-name", textContent: memberTagName }));
    const chevron = createElement("span", {
      className: "member-tag-management-row-icon",
      dataset: { area: "memberTagRowChevron" },
    });
    chevron.append(createElement("img", { src: CHEVRON_RIGHT_ICON_PATH, alt: "" }));
    row.append(chevron);
    row.addEventListener("click", () => {
      openMemberTagEditSheet(state, memberTagName);
    });
    return row;
  }

  const row = createElement("div", {
    className: "member-tag-management-row",
    dataset: { entity: "memberTag", entityId: memberTagName, state: rowState },
  });

  if (isEditing) {
    row.append(createWebMemberTagInput(state, memberTagName, replacementTagName, isDeleted));
  } else {
    row.append(createWebMemberTagReadView(state, memberTagName, replacementTagName));
  }

  if (state.mode === "web") {
    row.append(createWebEditButton(state, memberTagName, isEditing));
    row.append(createWebDeleteToggleButton(state, memberTagName, isDeleted));
  }

  return row;
}

function getMemberTagRowInputValue(memberTagName, replacementTagName) {
  return replacementTagName ? `${memberTagName} -> ${replacementTagName}` : memberTagName;
}

function createWebMemberTagInput(state, memberTagName, replacementTagName, isDeleted) {
  const errorMessage = getWebMemberTagInputError(state, memberTagName);
  const field = createElement("div", {
    className: "member-tag-management-field",
    dataset: { field: "memberTagField" },
  });
  const input = createElement("input", {
    className: "member-tag-management-input",
    type: "text",
    value: getWebMemberTagInputValue(state, memberTagName, replacementTagName),
    placeholder: "태그명",
    dataset: { field: "memberTag" },
  });
  input.maxLength = MAX_MEMBER_TAG_NAME_LENGTH;
  input.disabled = isDeleted;
  input.addEventListener("input", (event) => {
    event.target.value = limitMemberTagInputLength(event.target.value);
    setWebMemberTagInputDraft(state, memberTagName, event.target.value);
    clearWebMemberTagInputError(state, memberTagName);
    field.dataset.state = "idle";
    const visibleErrorMessage = field.querySelector("[data-field='memberTagError']");
    if (visibleErrorMessage) {
      visibleErrorMessage.remove();
    }
    const saveButton = field.closest("[data-entity='memberTag']")?.querySelector("[data-action='confirmMemberTagEdit']");
    if (saveButton) {
      saveButton.disabled = !isWebMemberTagDraftReady(state, memberTagName, event.target.value);
      saveButton.dataset.state = saveButton.disabled ? "disabled" : "enabled";
    }
  });
  input.addEventListener("blur", (event) => {
    validateWebMemberTagInput(state, memberTagName, event.target.value, { rerenderOnError: true });
  });
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (isWebMemberTagDraftReady(state, memberTagName, event.target.value)) {
        commitWebMemberTagRow(state, memberTagName, event.target.value);
      }
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      cancelWebMemberTagEdit(state);
    }
  });
  field.append(input);
  if (errorMessage) {
    field.dataset.state = "error";
    field.append(createElement("p", {
      className: "member-tag-management-error-message",
      textContent: errorMessage,
      dataset: { field: "memberTagError" },
    }));
  }
  return field;
}

function createWebMemberTagReadView(state, memberTagName, replacementTagName) {
  const content = createElement("div", {
    className: "member-tag-management-read",
    dataset: { field: "memberTagRead" },
  });
  content.append(createElement("span", {
    className: "member-tag-management-read-name",
    textContent: getMemberTagRowInputValue(memberTagName, replacementTagName),
    dataset: { field: "memberTagName" },
  }));
  return content;
}

function createWebEditButton(state, memberTagName, isEditing) {
  const isReady = !isEditing || isWebMemberTagDraftReady(
    state,
    memberTagName,
    getWebMemberTagInputValue(state, memberTagName, "")
  );
  const button = createElement("button", {
    className: isEditing ? "member-tag-management-row-action is-save" : "member-tag-management-icon-button",
    type: "button",
    textContent: isEditing ? "저장" : "",
    ariaLabel: isEditing ? "태그 저장" : `${memberTagName} 태그 수정`,
    dataset: {
      action: isEditing ? "confirmMemberTagEdit" : "editMemberTag",
      entityId: memberTagName,
      state: isEditing ? "editing" : "idle",
    },
  });
  button.disabled = !isReady;
  if (!isEditing) {
    button.append(createElement("img", { src: EDIT_ICON_PATH, alt: "" }));
  }
  button.addEventListener("click", () => {
    if (isEditing) {
      const row = button.closest("[data-entity='memberTag']");
      const input = row?.querySelector("[data-field='memberTag']");
      commitWebMemberTagRow(state, memberTagName, input?.value || "");
      return;
    }

    startWebMemberTagEdit(state, memberTagName);
  });
  return button;
}

function createWebDeleteToggleButton(state, memberTagName, isDeleted) {
  const isEditing = !memberTagName
    || normalizeMemberTagName(state.editingMemberTagName) === normalizeMemberTagName(memberTagName);
  const button = createElement("button", {
    className: isEditing ? "member-tag-management-row-action is-cancel" : "member-tag-management-icon-button",
    type: "button",
    textContent: isEditing ? "취소" : "",
    ariaLabel: isEditing ? "편집 취소" : `${memberTagName} 태그 삭제`,
    dataset: {
      action: "deleteMemberTag",
      entityId: memberTagName,
      state: "idle",
    },
  });
  if (!isEditing) {
    button.append(createElement("img", { src: DELETE_ICON_PATH, alt: "" }));
  }
  button.addEventListener("click", () => {
    if (isEditing) {
      cancelWebMemberTagEdit(state);
      return;
    }

    applyMemberTagDelete(state, memberTagName, {
      closeMenu: true,
      closeInlineEditor: true,
    });
  });
  return button;
}

function openMemberTagEditSheet(state, memberTagName) {
  state.activeMemberTagSheetTagName = memberTagName;
  state.isMemberTagCreateSheetOpen = false;
  state.memberTagSheetDraftName = memberTagName;
  state.memberTagSheetErrorMessage = "";
  rerender(state);
  focusMemberTagSheetInput();
}

function openMemberTagCreateSheet(state) {
  state.activeMemberTagSheetTagName = "";
  state.isMemberTagCreateSheetOpen = true;
  state.memberTagSheetDraftName = "";
  state.memberTagSheetErrorMessage = "";
  rerender(state);
  focusMemberTagSheetInput();
}

function createMemberTagCreateSheet(state) {
  const validation = getMemberTagSheetValidation(state, "");
  const overlay = createElement("section", {
    className: "member-tag-edit-sheet-overlay",
    dataset: { area: "memberTagCreateSheet", modal: "memberTagCreateSheet", state: "open" },
  });
  overlay.addEventListener("click", (event) => {
    if (event.target !== overlay) {
      return;
    }

    closeMemberTagCreateSheet(state);
  });

  const sheet = createElement("div", { className: "member-tag-edit-sheet member-tag-create-sheet" });

  const header = createElement("header", { className: "member-tag-edit-sheet-header" });
  header.append(createSheetCloseButton(() => closeMemberTagCreateSheet(state)));
  header.append(createElement("h2", { textContent: "태그 생성" }));
  header.append(createElement("span", { className: "member-tag-edit-sheet-spacer" }));
  sheet.append(header);

  const field = createMemberTagSheetField(state, "");
  sheet.append(field.element);

  const doneButton = createElement("button", {
    className: "member-tag-edit-primary-button",
    type: "button",
    textContent: "생성",
    dataset: { action: "createMemberTag", state: validation.valid ? "enabled" : "disabled" },
  });
  doneButton.disabled = !validation.valid;
  doneButton.addEventListener("click", () => {
    commitMemberTagCreateSheet(state, field.input.value);
  });
  field.input.addEventListener("input", () => syncMemberTagSheetButton(state, doneButton, ""));
  field.input.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !doneButton.disabled) {
      event.preventDefault();
      commitMemberTagCreateSheet(state, field.input.value);
    }
  });
  sheet.append(doneButton);
  overlay.append(sheet);
  return overlay;
}

function createMemberTagEditBottomSheet(state) {
  const sourceTag = state.activeMemberTagSheetTagName;
  const validation = getMemberTagSheetValidation(state, sourceTag);
  const overlay = createElement("section", {
    className: "member-tag-edit-sheet-overlay",
    dataset: { area: "memberTagEditBottomSheet", modal: "memberTagEditBottomSheet", state: "open" },
  });
  overlay.addEventListener("click", (event) => {
    if (event.target !== overlay) {
      return;
    }

    closeMemberTagEditSheet(state);
  });

  const sheet = createElement("div", { className: "member-tag-edit-sheet" });

  const header = createElement("header", { className: "member-tag-edit-sheet-header" });
  header.append(createSheetCloseButton(() => closeMemberTagEditSheet(state)));
  header.append(createElement("h2", { textContent: "태그 상세" }));
  header.append(createElement("span", { className: "member-tag-edit-sheet-spacer" }));
  sheet.append(header);

  const field = createMemberTagSheetField(state, sourceTag);
  sheet.append(field.element);

  const actions = createElement("div", { className: "member-tag-edit-actions" });
  const deleteButton = createElement("button", {
    className: "member-tag-edit-delete-button",
    type: "button",
    textContent: "삭제",
    dataset: { action: "deleteMemberTag", entityId: sourceTag },
  });
  deleteButton.addEventListener("click", () => {
    applyMemberTagDelete(state, sourceTag, {
      closeSheet: true,
    });
  });
  actions.append(deleteButton);

  const doneButton = createElement("button", {
    className: "member-tag-edit-primary-button",
    type: "button",
    textContent: "수정",
    dataset: { action: "saveMemberTagEdit", state: validation.valid && validation.changed ? "enabled" : "disabled" },
  });
  doneButton.disabled = !validation.valid || !validation.changed;
  doneButton.addEventListener("click", () => {
    commitMemberTagRename(state, sourceTag, field.input.value, { closeSheet: true });
  });
  field.input.addEventListener("input", () => syncMemberTagSheetButton(state, doneButton, sourceTag));
  actions.append(doneButton);
  sheet.append(actions);
  overlay.append(sheet);
  return overlay;
}

function createSheetCloseButton(onClick) {
  const button = createElement("button", {
    className: "member-tag-edit-close-button",
    type: "button",
    ariaLabel: "닫기",
    dataset: { action: "closeMemberTagSheet" },
  });
  button.append(createElement("img", { src: CLOSE_ICON_PATH, alt: "" }));
  button.addEventListener("click", onClick);
  return button;
}

function isWebMemberTagDraftReady(state, sourceTag, value) {
  const normalizedNextTag = normalizeMemberTagName(normalizeMemberTagInput(value));
  const normalizedSourceTag = normalizeMemberTagName(sourceTag);
  if (!normalizedNextTag || (normalizedSourceTag && normalizedNextTag === normalizedSourceTag)) {
    return false;
  }
  return !getActiveMemberTagCatalog(state).some((memberTagName) => {
    const normalizedMemberTagName = normalizeMemberTagName(memberTagName);
    return normalizedMemberTagName === normalizedNextTag && normalizedMemberTagName !== normalizedSourceTag;
  });
}

function createMemberTagSheetField(state, sourceTag) {
  const field = createElement("label", {
    className: "member-tag-edit-field",
    dataset: { field: "memberTagField", state: state.memberTagSheetErrorMessage ? "error" : "idle" },
  });
  const label = createElement("span", { className: "member-tag-edit-label" });
  label.append("태그 명 ");
  label.append(createElement("em", { textContent: "*" }));
  field.append(label);

  const input = createElement("input", {
    className: "member-tag-edit-input",
    type: "text",
    value: state.memberTagSheetDraftName || sourceTag || "",
    placeholder: "태그명 입력(최대 10자 이내)",
    dataset: { field: "memberTag" },
  });
  input.maxLength = MAX_MEMBER_TAG_NAME_LENGTH;
  input.addEventListener("input", (event) => {
    state.memberTagSheetDraftName = limitMemberTagInputLength(event.target.value);
    state.memberTagSheetErrorMessage = "";
    event.target.value = state.memberTagSheetDraftName;
    field.dataset.state = "idle";
    field.querySelector(".member-tag-edit-error")?.remove();
  });
  input.addEventListener("blur", () => {
    const validation = getMemberTagSheetValidation(state, sourceTag);
    if (!validation.duplicate) {
      return;
    }
    state.memberTagSheetErrorMessage = MEMBER_TAG_DUPLICATE_MESSAGE;
    rerender(state);
  });
  field.append(input);
  if (state.memberTagSheetErrorMessage) {
    field.append(createElement("span", {
      className: "member-tag-edit-error",
      textContent: state.memberTagSheetErrorMessage,
      dataset: { field: "memberTagError" },
    }));
  }
  return { element: field, input };
}

function getMemberTagSheetValidation(state, sourceTag) {
  const value = normalizeMemberTagInput(state.memberTagSheetDraftName);
  const source = normalizeMemberTagName(sourceTag);
  const normalizedValue = normalizeMemberTagName(value);
  const duplicate = Boolean(normalizedValue) && state.memberTagCatalog.some((memberTagName) => {
    const normalizedTagName = normalizeMemberTagName(memberTagName);
    return normalizedTagName === normalizedValue && normalizedTagName !== source;
  });
  return {
    value,
    duplicate,
    changed: Boolean(source) && normalizedValue !== source,
    valid: Boolean(value) && !duplicate,
  };
}

function syncMemberTagSheetButton(state, button, sourceTag) {
  const validation = getMemberTagSheetValidation(state, sourceTag);
  const enabled = validation.valid && (!sourceTag || validation.changed);
  button.disabled = !enabled;
  button.dataset.state = enabled ? "enabled" : "disabled";
}

function createDeleteReplacementModal(state) {
  const sourceTag = state.pendingDeleteMemberTagName;
  const usageSummary = getMemberTagUsageSummary(findOriginalSourceForDraft(state, sourceTag));
  const content = createElement("div", {
    className: "member-tag-delete-replacement-content",
    dataset: { area: "memberTagDeleteReplacementContent" },
  });

  content.append(createDeleteReplacementMessage(usageSummary.count));
  content.append(createDeleteReplacementSelector(state, sourceTag));

  return createAlertDialog({
    className: "alert-dialog member-tag-delete-replacement-dialog",
    area: "memberTagDeleteReplacementDialog",
    modal: "memberTagDeleteReplacementDialog",
    contentNode: content,
    actions: [
      {
        label: "닫기",
        variant: "secondary",
        action: "cancelDeleteMemberTag",
        onClick: () => {
          closeDeleteReplacementModal(state);
        },
      },
      {
        label: state.deleteReplacementTagName ? "변경 후 태그 삭제" : "제거",
        variant: "danger",
        action: "confirmDeleteMemberTag",
        onClick: () => {
          confirmDeleteReplacement(state);
        },
      },
    ],
  });
}

function createAppConnectedDeleteAlert(state) {
  return createAlertDialog({
    className: "alert-dialog member-tag-connected-delete-alert",
    message: "해당 태그에 연결된 반려견이 있습니다.\n연결할 다른 태그를 선택하시겠습니까?",
    area: "memberTagConnectedDeleteAlert",
    modal: "memberTagConnectedDeleteAlert",
    actions: [
      {
        label: "닫기",
        variant: "secondary",
        action: "closeConnectedDeleteAlert",
        onClick: () => {
          state.isDeleteConfirmationAlertOpen = false;
          rerender(state);
        },
      },
      {
        label: "태그 선택",
        variant: "primary",
        action: "openDeleteReplacementScreen",
        onClick: () => {
          state.isDeleteConfirmationAlertOpen = false;
          state.activeMemberTagSheetTagName = "";
          state.memberTagSheetDraftName = "";
          state.isDeleteReplacementScreenOpen = true;
          rerender(state);
        },
      },
    ],
  });
}

function createAppDeleteReplacementScreen(state) {
  const page = createElement("section", {
    className: "member-tag-replacement-screen",
    dataset: { screen: "memberTagReplacement", state: "open" },
  });
  const header = createElement("header", { className: "member-tag-replacement-header" });
  header.append(createSheetCloseButton(() => {
    state.isDeleteReplacementScreenOpen = false;
    clearDeleteReplacementState(state);
    rerender(state);
  }));
  header.append(createElement("h1", { textContent: "태그 대체" }));
  header.append(createElement("span", { className: "member-tag-edit-sheet-spacer" }));
  page.append(header);

  const body = createElement("div", { className: "member-tag-replacement-body" });
  body.append(createElement("p", {
    className: "member-tag-replacement-notice",
    textContent: `“${state.pendingDeleteMemberTagName}” 태그에 연결된 반려견이 있습니다.\n삭제 전 반려견을 연결할 다른 태그를 선택해 주세요.`,
  }));
  body.append(createAppReplacementSearch(state));
  body.append(createAppReplacementOptionList(state));
  page.append(body);

  const removeButton = createElement("button", {
    className: "member-tag-replacement-submit",
    type: "button",
    textContent: state.deleteReplacementTagName ? "변경 후 태그 제거" : "제거",
    dataset: { action: "confirmDeleteMemberTag" },
  });
  removeButton.addEventListener("click", () => confirmDeleteReplacement(state));
  page.append(removeButton);
  return page;
}

function createAppReplacementSearch(state) {
  const input = createElement("input", {
    className: "member-tag-replacement-search",
    type: "search",
    value: state.deleteReplacementQuery || "",
    placeholder: "태그 검색",
    maxLength: MAX_MEMBER_TAG_NAME_LENGTH,
    dataset: { field: "deleteReplacementTagSearch" },
  });
  input.maxLength = MAX_MEMBER_TAG_NAME_LENGTH;
  input.addEventListener("input", (event) => {
    state.deleteReplacementQuery = limitMemberTagInputLength(event.target.value);
    rerender(state);
    focusDeleteReplacementSearch();
  });
  return input;
}

function createAppReplacementOptionList(state) {
  const list = createElement("div", {
    className: "member-tag-replacement-options",
    dataset: { area: "deleteReplacementOptionList" },
  });
  const query = normalizeMemberTagInput(state.deleteReplacementQuery);
  const availableTags = getDeleteReplacementCandidates(state, query);
  list.append(createAppReplacementOption(state, "선택 안함", ""));
  availableTags.forEach((memberTagName) => {
    list.append(createAppReplacementOption(state, memberTagName, memberTagName));
  });
  if (query && !availableTags.length) {
    list.append(createEmptyStateElement({ title: "검색 결과가 없습니다." }));
  } else if (!query && !availableTags.length) {
    list.append(createEmptyStateElement({ title: "등록된 태그가 없습니다." }));
  }
  return list;
}

function createAppReplacementOption(state, label, value) {
  const selected = normalizeMemberTagName(state.deleteReplacementTagName) === normalizeMemberTagName(value);
  const button = createElement("button", {
    className: "member-tag-replacement-option",
    type: "button",
    dataset: { action: "selectDeleteReplacementTag", entityId: value, state: selected ? "selected" : "idle" },
  });
  button.append(createElement("span", { className: "member-tag-replacement-radio" }));
  button.append(createElement("span", { textContent: label }));
  button.addEventListener("click", () => {
    state.deleteReplacementTagName = value;
    rerender(state);
  });
  return button;
}

function getDeleteReplacementCandidates(state, query = "") {
  const sourceTagName = normalizeMemberTagName(state.pendingDeleteMemberTagName);
  const availableTags = sortMemberTagNames(getActiveMemberTagCatalog(state)).filter((memberTagName) => {
    return normalizeMemberTagName(memberTagName) !== sourceTagName;
  });
  return query ? buildTagSuggestions(availableTags, query, [], availableTags.length) : availableTags;
}

function createDeleteReplacementMessage(count) {
  const message = createElement("p", {
    className: "member-tag-delete-replacement-message",
  });
  message.append("해당 태그에 연결된 반려견이 있습니다.\n연결된 반려견에 적용할 태그를 선택해 주세요.");
  return message;
}

function createDeleteReplacementSelector(state, sourceTag) {
  const selector = createElement("div", {
    className: "member-tag-delete-replacement-selector",
    dataset: { area: "deleteReplacementSelector", state: state.isDeleteReplacementListOpen ? "open" : "closed" },
  });
  selector.append(createElement("strong", {
    className: "member-tag-delete-replacement-source",
    textContent: sourceTag,
  }));
  selector.append(createElement("span", {
    className: "member-tag-delete-replacement-arrow",
    textContent: "->",
  }));

  const picker = createElement("div", {
    className: "member-tag-delete-replacement-picker member-tag-search-stack",
    dataset: { state: state.isDeleteReplacementListOpen ? "open" : "closed" },
  });
  picker.append(createDeleteReplacementSelectControl(state));
  if (state.isDeleteReplacementListOpen) {
    picker.append(createDeleteReplacementOptionList(state));
  }
  selector.append(picker);
  return selector;
}

function createDeleteReplacementSelectControl(state) {
  const displayValue = state.isDeleteReplacementListOpen
    ? state.deleteReplacementTagName || "선택 안함 (태그 제거)"
    : state.deleteReplacementTagName || "선택 안함 (태그 제거)";
  const control = createElement("div", {
    className: "member-tag-search-control member-tag-delete-replacement-control",
    dataset: { state: state.isDeleteReplacementListOpen ? "open" : "closed" },
  });
  const button = createElement("button", {
    className: "member-tag-delete-replacement-select-button",
    type: "button",
    textContent: displayValue,
    dataset: { action: "toggleDeleteReplacementList" },
  });
  button.addEventListener("click", () => {
    state.isDeleteReplacementListOpen = !state.isDeleteReplacementListOpen;
    if (!state.isDeleteReplacementListOpen) {
      state.deleteReplacementQuery = "";
    }
    rerender(state);
    if (state.isDeleteReplacementListOpen) {
      focusDeleteReplacementSearch();
    }
  });
  control.append(button);
  return control;
}

function createDeleteReplacementSearch(state) {
  let isComposing = false;
  const control = createElement("div", {
    className: "member-tag-search-control member-tag-delete-replacement-search-control",
    dataset: { state: "input" },
  });
  const input = createElement("input", {
    className: "member-tag-search-input member-tag-delete-replacement-search",
    type: "text",
    value: state.deleteReplacementQuery || "",
    placeholder: "태그 검색",
    dataset: { field: "deleteReplacementTagSearch" },
  });
  input.addEventListener("compositionstart", () => {
    isComposing = true;
  });
  input.addEventListener("compositionend", (event) => {
    isComposing = false;
    window.setTimeout(() => {
      state.isDeleteReplacementListOpen = true;
      state.deleteReplacementQuery = event.target.value;
      rerender(state);
      focusDeleteReplacementSearch();
    }, 0);
  });
  input.addEventListener("input", (event) => {
    if (isComposing) {
      return;
    }

    state.isDeleteReplacementListOpen = true;
    state.deleteReplacementQuery = event.target.value;
    rerender(state);
    focusDeleteReplacementSearch();
  });
  control.append(input);
  return control;
}

function createDeleteReplacementOptionList(state) {
  const list = createElement("div", {
    className: "tag-multi-select-menu member-tag-delete-replacement-list",
    dataset: { area: "deleteReplacementOptionList" },
  });
  list.append(createDeleteReplacementSearch(state));

  const optionList = createElement("div", {
    className: "member-tag-data-list",
    dataset: { area: "deleteReplacementOptionDataList" },
  });
  const query = normalizeMemberTagInput(state.deleteReplacementQuery);
  const selectedTagName = normalizeMemberTagName(state.deleteReplacementTagName);
  const originalSourceTagName = normalizeMemberTagName(findOriginalSourceForDraft(state, state.pendingDeleteMemberTagName));

  optionList.append(createDeleteReplacementOption(state, {
    label: "선택 안함 (태그 제거)",
    value: "",
    selected: !selectedTagName,
  }));

  const availableTags = getDeleteReplacementCandidates(state, query).filter((memberTagName) => {
    return normalizeMemberTagName(memberTagName) !== originalSourceTagName;
  });

  availableTags.forEach((memberTagName) => {
    optionList.append(createDeleteReplacementOption(state, {
      label: memberTagName,
      value: memberTagName,
      selected: normalizeMemberTagName(memberTagName) === selectedTagName,
    }));
  });

  if (query && !availableTags.length) {
    optionList.append(createEmptyStateElement({ title: "검색 결과가 없습니다." }));
  }

  list.append(optionList);
  return list;
}

function createDeleteReplacementOption(state, options) {
  const button = createElement("button", {
    className: "member-tag-option",
    type: "button",
    textContent: options.label,
    dataset: {
      action: "selectDeleteReplacementTag",
      state: options.selected ? "selected" : "idle",
      entityId: options.value,
    },
  });
  button.addEventListener("click", () => {
    state.deleteReplacementTagName = options.value;
    state.deleteReplacementQuery = "";
    state.isDeleteReplacementListOpen = false;
    rerender(state);
  });
  return button;
}

function focusDeleteReplacementSearch() {
  window.setTimeout(() => {
    const input = document.querySelector(".member-tag-delete-replacement-search");
    if (!input) {
      return;
    }

    input.focus();
    if (!input.value || input.value === "태그 제거") {
      input.select();
      return;
    }

    input.setSelectionRange(input.value.length, input.value.length);
  }, 0);
}

function closeMemberTagEditSheet(state) {
  state.activeMemberTagSheetTagName = "";
  state.memberTagSheetDraftName = "";
  state.memberTagSheetErrorMessage = "";
  rerender(state);
}

function closeMemberTagCreateSheet(state) {
  state.isMemberTagCreateSheetOpen = false;
  state.memberTagSheetDraftName = "";
  state.memberTagSheetErrorMessage = "";
  rerender(state);
}

function focusMemberTagSheetInput() {
  window.setTimeout(() => {
    const input = document.querySelector(".member-tag-edit-input");
    if (!input) {
      return;
    }

    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
  }, 0);
}

function commitMemberTagRename(state, sourceTag, nextTagName, options = {}) {
  const trimmedTagName = normalizeMemberTagInput(nextTagName);
  if (!trimmedTagName) {
    if (options.closeSheet) {
      closeMemberTagEditSheet(state);
      return;
    }

    rerender(state);
    return;
  }

  applyMemberTagRename(state, sourceTag, trimmedTagName, options);
}

function commitMemberTagCreateSheet(state, memberTagName) {
  applyMemberTagCreate(state, memberTagName, {
    clearQuery: true,
    closeCreateSheet: true,
  });
}

function startWebMemberTagCreate(state) {
  if (getActiveMemberTagCatalog(state).length >= MAX_MEMBER_TAG_CATALOG_SIZE) {
    state.toastMessage = MEMBER_TAG_MAX_CATALOG_MESSAGE;
    rerender(state);
    return;
  }

  state.isCreatingMemberTag = true;
  state.memberTagCreateDraftName = "";
  state.memberTagCreateErrorMessage = "";
  state.memberTagEditDraftName = "";
  state.memberTagEditErrorMessage = "";
  state.editingMemberTagName = "";
  rerender(state);
  focusEditingMemberTagInput();
}

function startWebMemberTagEdit(state, memberTagName) {
  state.isCreatingMemberTag = false;
  state.memberTagCreateDraftName = "";
  state.memberTagCreateErrorMessage = "";
  state.memberTagEditDraftName = memberTagName;
  state.memberTagEditErrorMessage = "";
  state.editingMemberTagName = memberTagName;
  rerender(state);
  focusEditingMemberTagInput();
}

function commitWebMemberTagRow(state, sourceTag, nextTagName) {
  if (!validateWebMemberTagInput(state, sourceTag, nextTagName, { rerenderOnError: true })) {
    return;
  }

  if (!sourceTag) {
    applyMemberTagCreate(state, nextTagName, {
      clearQuery: true,
      closeInlineEditor: true,
    });
    return;
  }

  commitMemberTagRename(state, sourceTag, nextTagName, {
    closeInlineEditor: true,
  });
}

function cancelWebMemberTagEdit(state) {
  state.isCreatingMemberTag = false;
  state.memberTagCreateDraftName = "";
  state.memberTagCreateErrorMessage = "";
  state.memberTagEditDraftName = "";
  state.memberTagEditErrorMessage = "";
  state.editingMemberTagName = "";
  rerender(state);
}

function getWebMemberTagInputValue(state, sourceTag, replacementTagName) {
  if (!sourceTag) {
    return state.memberTagCreateDraftName || "";
  }

  return state.memberTagEditDraftName;
}

function getWebMemberTagInputError(state, sourceTag) {
  return sourceTag ? state.memberTagEditErrorMessage : state.memberTagCreateErrorMessage;
}

function setWebMemberTagInputDraft(state, sourceTag, nextTagName) {
  if (sourceTag) {
    state.memberTagEditDraftName = nextTagName;
    return;
  }

  state.memberTagCreateDraftName = nextTagName;
}

function clearWebMemberTagInputError(state, sourceTag) {
  if (sourceTag) {
    state.memberTagEditErrorMessage = "";
    return;
  }

  state.memberTagCreateErrorMessage = "";
}

function validateWebMemberTagInput(state, sourceTag, memberTagName, options = {}) {
  const nextTag = normalizeMemberTagInput(memberTagName);
  setWebMemberTagInputDraft(state, sourceTag, limitMemberTagInputLength(String(memberTagName || "")));
  const normalizedSourceTag = normalizeMemberTagName(sourceTag);
  const normalizedNextTag = normalizeMemberTagName(nextTag);
  const isDuplicate = Boolean(normalizedNextTag) && getActiveMemberTagCatalog(state).some((currentTagName) => {
    const normalizedCurrentTag = normalizeMemberTagName(currentTagName);
    return normalizedCurrentTag === normalizedNextTag && (!normalizedSourceTag || normalizedCurrentTag !== normalizedSourceTag);
  });

  if (sourceTag) {
    state.memberTagEditErrorMessage = isDuplicate ? MEMBER_TAG_DUPLICATE_MESSAGE : "";
  } else {
    state.memberTagCreateErrorMessage = isDuplicate ? MEMBER_TAG_DUPLICATE_MESSAGE : "";
  }

  if (isDuplicate && options.rerenderOnError) {
    rerender(state);
    return false;
  }

  return !isDuplicate;
}

function focusEditingMemberTagInput() {
  window.setTimeout(() => {
    const input = document.querySelector("[data-state='editing'] [data-field='memberTag'], [data-state='creating'] [data-field='memberTag']");
    if (!input) {
      return;
    }

    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
  }, 0);
}

function applyMemberTagCreate(state, memberTagName, options = {}) {
  if (state.mode !== "web") {
    if (openDataConflictAlertIfNeeded(state)) {
      return;
    }
    applyMemberTagMutation(state, createMemberTag(memberTagName), {
      toastMessage: MEMBER_TAG_CREATE_MESSAGE,
      ...options,
    });
    return;
  }

  const nextTag = normalizeMemberTagInput(memberTagName);
  const activeCatalog = getActiveMemberTagCatalog(state);
  if (!nextTag) {
    return;
  }

  if (hasMemberTag(activeCatalog, nextTag)) {
    state.toastMessage = MEMBER_TAG_DUPLICATE_MESSAGE;
    rerender(state);
    return;
  }

  if (activeCatalog.length >= MAX_MEMBER_TAG_CATALOG_SIZE) {
    state.toastMessage = MEMBER_TAG_MAX_CATALOG_MESSAGE;
    rerender(state);
    return;
  }

  state.draftMemberTagCatalog = sortMemberTagNames([...activeCatalog, nextTag]);
  upsertDraft(state, {
    sourceTag: nextTag,
    nextTag,
    isDeleted: false,
  });
  applyMutationOptions(state, options);
  rerender(state);
}

function applyMemberTagRename(state, sourceTag, nextTagName, options = {}) {
  if (state.mode !== "web") {
    if (openDataConflictAlertIfNeeded(state)) {
      return;
    }
    applyMemberTagMutation(state, renameMemberTag(sourceTag, nextTagName), {
      toastMessage: MEMBER_TAG_EDIT_MESSAGE,
      ...options,
    });
    return;
  }

  const sourceTagName = normalizeMemberTagInput(sourceTag);
  const nextTag = normalizeMemberTagInput(nextTagName);
  const activeCatalog = getActiveMemberTagCatalog(state);

  if (!sourceTagName || !nextTag) {
    applyMutationOptions(state, options);
    rerender(state);
    return;
  }

  if (normalizeMemberTagName(sourceTagName) === normalizeMemberTagName(nextTag)) {
    applyMutationOptions(state, options);
    rerender(state);
    return;
  }

  const isDuplicate = activeCatalog.some((memberTagName) => {
    return normalizeMemberTagName(memberTagName) !== normalizeMemberTagName(sourceTagName)
      && normalizeMemberTagName(memberTagName) === normalizeMemberTagName(nextTag);
  });

  if (isDuplicate) {
    state.toastMessage = MEMBER_TAG_DUPLICATE_MESSAGE;
    rerender(state);
    return;
  }

  state.draftMemberTagCatalog = sortMemberTagNames(activeCatalog.map((memberTagName) => {
    return normalizeMemberTagName(memberTagName) === normalizeMemberTagName(sourceTagName) ? nextTag : memberTagName;
  }));
  upsertRenameDraft(state, sourceTagName, nextTag);
  applyMutationOptions(state, options);
  rerender(state);
}

function applyMemberTagDelete(state, memberTagName, options = {}) {
  if (state.mode !== "web" && openDataConflictAlertIfNeeded(state)) {
    return;
  }
  const usageSummary = getMemberTagUsageSummary(findOriginalSourceForDraft(state, memberTagName));
  if (usageSummary.count > 0) {
    if (state.mode !== "web") {
      state.pendingDeleteMemberTagName = memberTagName;
      state.deleteReplacementTagName = "";
      state.deleteReplacementQuery = "";
      state.isDeleteConfirmationAlertOpen = true;
      rerender(state);
      return;
    }
    openDeleteReplacementModal(state, memberTagName, options);
    return;
  }

  applyMemberTagDeleteDraft(state, memberTagName, "", options);
}

function openDeleteReplacementModal(state, memberTagName, options = {}) {
  state.pendingDeleteMemberTagName = memberTagName;
  state.deleteReplacementTagName = "";
  state.deleteReplacementQuery = "";
  state.isDeleteReplacementListOpen = false;
  state.isDeleteReplacementModalOpen = true;
  applyMutationOptions(state, options);
  rerender(state);
}

function closeDeleteReplacementModal(state) {
  clearDeleteReplacementState(state);
  rerender(state);
}

function confirmDeleteReplacement(state) {
  if (openDataConflictAlertIfNeeded(state)) {
    return;
  }
  const sourceTagName = state.pendingDeleteMemberTagName;
  const replacementTagName = normalizeMemberTagInput(state.deleteReplacementTagName);
  clearDeleteReplacementState(state);
  applyMemberTagDeleteDraft(state, sourceTagName, replacementTagName, {
    closeMenu: true,
    closeSheet: true,
  });
}

function clearDeleteReplacementState(state) {
  state.pendingDeleteMemberTagName = "";
  state.deleteReplacementTagName = "";
  state.deleteReplacementQuery = "";
  state.isDeleteReplacementListOpen = false;
  state.isDeleteReplacementModalOpen = false;
  state.isDeleteConfirmationAlertOpen = false;
  state.isDeleteReplacementScreenOpen = false;
}

function applyMemberTagDeleteDraft(state, memberTagName, replacementTagName = "", options = {}) {
  if (state.mode !== "web") {
    const appDeleteOptions = {
      ...options,
      toastMessage: MEMBER_TAG_DELETE_MESSAGE,
    };
    if (replacementTagName) {
      applyMemberTagMutation(state, {
        ok: true,
        reason: "",
        ...applyMemberTagCatalogEdits([{
          sourceTag: memberTagName,
          nextTag: replacementTagName,
          isDeleted: true,
        }]),
      }, appDeleteOptions);
      return;
    }

    applyMemberTagMutation(state, deleteMemberTag(memberTagName), appDeleteOptions);
    return;
  }

  const sourceTagName = normalizeMemberTagInput(memberTagName);
  if (!sourceTagName) {
    return;
  }

  const nextCatalog = buildDeleteDraftCatalog(state, sourceTagName, replacementTagName);
  if (nextCatalog.length > MAX_MEMBER_TAG_CATALOG_SIZE) {
    state.toastMessage = MEMBER_TAG_MAX_CATALOG_MESSAGE;
    rerender(state);
    return;
  }

  const originalSourceTagName = findOriginalSourceForDraft(state, sourceTagName);
  state.draftMemberTagCatalog = nextCatalog;
  if (hasMemberTag(state.memberTagCatalog, originalSourceTagName)) {
    markWebDraftTagDeleted(state, originalSourceTagName);
  }
  upsertDeleteDraft(state, sourceTagName, replacementTagName);
  applyMutationOptions(state, options);
  rerender(state);
}

function buildDeleteDraftCatalog(state, sourceTagName, replacementTagName = "") {
  const normalizedSourceTagName = normalizeMemberTagName(sourceTagName);
  const normalizedReplacementTagName = normalizeMemberTagName(replacementTagName);
  const activeCatalog = getActiveMemberTagCatalog(state).filter((memberTagName) => {
    return normalizeMemberTagName(memberTagName) !== normalizedSourceTagName;
  });

  if (!normalizedReplacementTagName) {
    return sortMemberTagNames(activeCatalog);
  }

  const hasReplacementTag = activeCatalog.some((memberTagName) => {
    return normalizeMemberTagName(memberTagName) === normalizedReplacementTagName;
  });

  return sortMemberTagNames(hasReplacementTag ? activeCatalog : [...activeCatalog, replacementTagName]);
}

function applyMemberTagMutation(state, result, options = {}) {
  if (!result.ok) {
    state.toastMessage = getMutationErrorMessage(result.reason);
    rerender(state);
    return;
  }

  state.memberTagCatalog = result.memberTagCatalog;
  state.draftMemberTagCatalog = [...result.memberTagCatalog];
  state.memberTagDrafts = [];
  state.deletedDraftMemberTagNames = [];
  applyMutationOptions(state, options);
  rerender(state);
}

function applyMutationOptions(state, options = {}) {
  if (options.clearQuery) {
    state.memberTagManagementQuery = "";
  }

  if (options.closeMenu) {
    state.openMemberTagMenuTagName = "";
  }

  if (options.closeSheet) {
    state.activeMemberTagSheetTagName = "";
    state.memberTagSheetDraftName = "";
    state.memberTagSheetErrorMessage = "";
  }

  if (options.closeCreateSheet) {
    state.isMemberTagCreateSheetOpen = false;
    state.memberTagSheetDraftName = "";
    state.memberTagSheetErrorMessage = "";
  }

  if (options.closeInlineEditor) {
    state.editingMemberTagName = "";
    state.isCreatingMemberTag = false;
    state.memberTagCreateDraftName = "";
    state.memberTagCreateErrorMessage = "";
    state.memberTagEditDraftName = "";
    state.memberTagEditErrorMessage = "";
  }

  if (options.toastMessage) {
    state.toastMessage = options.toastMessage;
  }
}

function saveWebDrafts(state) {
  if (!hasMemberTagDraftChanges(state)) {
    return;
  }

  if (openDataConflictAlertIfNeeded(state)) {
    return;
  }

  const result = applyMemberTagCatalogEdits(state.memberTagDrafts);
  state.memberTagCatalog = result.memberTagCatalog;
  state.draftMemberTagCatalog = [...result.memberTagCatalog];
  state.memberTagDrafts = [];
  state.deletedDraftMemberTagNames = [];
  state.editingMemberTagName = "";
  state.isCreatingMemberTag = false;
  state.memberTagCreateDraftName = "";
  state.memberTagCreateErrorMessage = "";
  state.memberTagEditDraftName = "";
  state.memberTagEditErrorMessage = "";
  clearDeleteReplacementState(state);
  state.toastMessage = MEMBER_TAG_SAVE_MESSAGE;
  rerender(state);
}

function openDataConflictAlertIfNeeded(state) {
  if (areMemberTagCatalogsEqual(state.memberTagCatalog, loadMemberTagCatalog())) {
    return false;
  }

  state.isDataConflictAlertOpen = true;
  rerender(state);
  return true;
}

function createDataConflictAlert(state) {
  return createAlertDialog({
    className: "alert-dialog member-tag-data-conflict-alert",
    message: "태그 정보가 변경되었습니다.\n최신 정보를 불러온 후 다시 시도해 주세요.",
    area: "memberTagDataConflictAlert",
    modal: "memberTagDataConflictAlert",
    actions: [{
      label: "불러오기",
      variant: "primary",
      action: "reloadMemberTags",
      onClick: () => refreshMemberTagManagement(state),
    }],
  });
}

function refreshMemberTagManagement(state) {
  const memberTagCatalog = loadMemberTagCatalog();
  state.memberTagCatalog = memberTagCatalog;
  state.draftMemberTagCatalog = [...memberTagCatalog];
  state.memberTagDrafts = [];
  state.deletedDraftMemberTagNames = [];
  state.memberTagManagementQuery = "";
  state.editingMemberTagName = "";
  state.isCreatingMemberTag = false;
  state.memberTagCreateDraftName = "";
  state.memberTagCreateErrorMessage = "";
  state.memberTagEditDraftName = "";
  state.memberTagEditErrorMessage = "";
  state.activeMemberTagSheetTagName = "";
  state.isMemberTagCreateSheetOpen = false;
  state.memberTagSheetDraftName = "";
  state.memberTagSheetErrorMessage = "";
  state.isDataConflictAlertOpen = false;
  clearDeleteReplacementState(state);
  rerender(state);
}

function areMemberTagCatalogsEqual(firstCatalog, secondCatalog) {
  const firstTags = sortMemberTagNames(firstCatalog || []).map(normalizeMemberTagName);
  const secondTags = sortMemberTagNames(secondCatalog || []).map(normalizeMemberTagName);
  return firstTags.length === secondTags.length
    && firstTags.every((memberTagName, index) => memberTagName === secondTags[index]);
}


function requestWebNavigation(state, href) {
  if (!hasMemberTagDraftChanges(state)) {
    window.location.href = href;
    return;
  }

  state.pendingNavigationHref = href;
  state.isDiscardAlertOpen = true;
  rerender(state);
}

function isWebDraftTagDeleted(state, memberTagName) {
  const normalizedTagName = normalizeMemberTagName(memberTagName);
  return (state.deletedDraftMemberTagNames || []).some((deletedTagName) => {
    return normalizeMemberTagName(deletedTagName) === normalizedTagName;
  });
}

function markWebDraftTagDeleted(state, memberTagName) {
  if (isWebDraftTagDeleted(state, memberTagName)) {
    return;
  }

  state.deletedDraftMemberTagNames = [
    ...(state.deletedDraftMemberTagNames || []),
    memberTagName,
  ];
}

function restoreWebDraftMemberTag(state, memberTagName) {
  const normalizedTagName = normalizeMemberTagName(memberTagName);
  state.deletedDraftMemberTagNames = (state.deletedDraftMemberTagNames || []).filter((deletedTagName) => {
    return normalizeMemberTagName(deletedTagName) !== normalizedTagName;
  });

  const originalSource = findOriginalSourceForDraft(state, memberTagName);
  const existingDraft = (state.memberTagDrafts || []).find((draft) => {
    return normalizeMemberTagName(draft.sourceTag) === normalizeMemberTagName(originalSource);
  });

  if (existingDraft?.isDeleted) {
    removeDraftBySource(state, originalSource);
  }

  state.draftMemberTagCatalog = sortMemberTagNames([
    ...state.draftMemberTagCatalog,
    originalSource,
  ]);

  if (!hasMemberTag(state.memberTagCatalog, originalSource)) {
    upsertDraft(state, {
      sourceTag: memberTagName,
      nextTag: memberTagName,
      isDeleted: false,
    });
  }

  rerender(state);
}
function upsertRenameDraft(state, sourceTag, nextTag) {
  const originalSource = findOriginalSourceForDraft(state, sourceTag);
  const normalizedOriginalSource = normalizeMemberTagName(originalSource);
  const normalizedNextTag = normalizeMemberTagName(nextTag);

  if (!hasMemberTag(state.memberTagCatalog, originalSource)) {
    removeDraftBySource(state, sourceTag);
    upsertDraft(state, { sourceTag: nextTag, nextTag, isDeleted: false });
    return;
  }

  if (normalizedOriginalSource === normalizedNextTag) {
    removeDraftBySource(state, originalSource);
    return;
  }

  upsertDraft(state, {
    sourceTag: originalSource,
    nextTag,
    isDeleted: false,
  });
}

function upsertDeleteDraft(state, sourceTag, replacementTagName = "") {
  const originalSource = findOriginalSourceForDraft(state, sourceTag);

  if (!hasMemberTag(state.memberTagCatalog, originalSource)) {
    removeDraftBySource(state, originalSource);
    removeDraftBySource(state, sourceTag);
    return;
  }

  upsertDraft(state, {
    sourceTag: originalSource,
    nextTag: normalizeMemberTagInput(replacementTagName),
    isDeleted: true,
  });
}

function findOriginalSourceForDraft(state, currentTagName) {
  const normalizedTagName = normalizeMemberTagName(currentTagName);
  const draft = (state.memberTagDrafts || []).find((currentDraft) => {
    return normalizeMemberTagName(currentDraft.sourceTag) === normalizedTagName
      || normalizeMemberTagName(currentDraft.nextTag) === normalizedTagName;
  });

  return draft ? draft.sourceTag : currentTagName;
}

function upsertDraft(state, nextDraft) {
  const normalizedSourceTag = normalizeMemberTagName(nextDraft.sourceTag);
  const nextDrafts = (state.memberTagDrafts || []).filter((draft) => {
    return normalizeMemberTagName(draft.sourceTag) !== normalizedSourceTag;
  });
  nextDrafts.push(nextDraft);
  state.memberTagDrafts = nextDrafts;
}

function removeDraftBySource(state, sourceTag) {
  const normalizedSourceTag = normalizeMemberTagName(sourceTag);
  state.memberTagDrafts = (state.memberTagDrafts || []).filter((draft) => {
    return normalizeMemberTagName(draft.sourceTag) !== normalizedSourceTag;
  });
}

function getMutationErrorMessage(reason) {
  if (reason === "duplicate") {
    return MEMBER_TAG_DUPLICATE_MESSAGE;
  }

  if (reason === "maxCatalog") {
    return MEMBER_TAG_MAX_CATALOG_MESSAGE;
  }

  return "";
}

function normalizeMemberTagInput(memberTagName) {
  return limitMemberTagInputLength(String(memberTagName || "").trim().replace(/\s+/g, " "));
}

function limitMemberTagInputLength(memberTagName) {
  return String(memberTagName || "").slice(0, MAX_MEMBER_TAG_NAME_LENGTH);
}

function hasMemberTag(memberTagCatalog, memberTagName) {
  const normalizedTagName = normalizeMemberTagName(memberTagName);
  return (memberTagCatalog || []).some((currentTagName) => {
    return normalizeMemberTagName(currentTagName) === normalizedTagName;
  });
}

function getDeleteReplacementTagName(state, memberTagName) {
  const originalSource = findOriginalSourceForDraft(state, memberTagName);
  const draft = (state.memberTagDrafts || []).find((currentDraft) => {
    return normalizeMemberTagName(currentDraft.sourceTag) === normalizeMemberTagName(originalSource);
  });
  return draft?.isDeleted ? draft.nextTag || "" : "";
}

function getMemberTagUsageSummary(memberTagName) {
  const normalizedTagName = normalizeMemberTagName(memberTagName);
  const matchedPetIds = new Set();

  getStoredMembers().forEach((member) => {
    (member.pets || []).forEach((pet) => {
      const hasTag = (pet.petTags || []).some((petTagName) => {
        return normalizeMemberTagName(petTagName) === normalizedTagName;
      });

      if (hasTag) {
        matchedPetIds.add(`${member.id || ""}:${pet.id || pet.petName || pet.dogName || matchedPetIds.size}`);
      }
    });
  });

  return {
    count: matchedPetIds.size,
  };
}
