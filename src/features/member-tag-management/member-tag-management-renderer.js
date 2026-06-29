import { createAlertDialog } from "../../shared/components/alert.js";
import { createEmptyStateElement } from "../../shared/components/empty-state.js";
import { createToast, TOAST_AUTO_DISMISS_MS } from "../../shared/components/toast.js";
import {
  applyMemberTagCatalogEdits,
  createMemberTag,
  deleteMemberTag,
  getStoredMembers,
  renameMemberTag,
} from "../../shared/storage/member-storage.js";
import {
  MAX_MEMBER_TAG_CATALOG_SIZE,
  normalizeMemberTagName,
  sortMemberTagNames,
} from "../../shared/services/member-tag-service.js";
import { createElement } from "../../shared/utils/dom.js";
import {
  getActiveMemberTagCatalog,
  getCreatableMemberTagName,
  getVisibleMemberTags,
  hasMemberTagDraftChanges,
} from "./member-tag-management-state.js";

const MEMBER_TAG_DUPLICATE_MESSAGE = "이미 존재하는 태그입니다.";
const MEMBER_TAG_MAX_CATALOG_MESSAGE = "태그는 최대 20개까지 등록할 수 있습니다.";
const MEMBER_TAG_SAVE_MESSAGE = "저장했습니다.";
const MEMBER_TAG_DELETE_MESSAGE = "삭제했습니다.";
const CHEVRON_LEFT_ICON_PATH = "../assets/iconChevronLeft.svg";
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
    className: "member-tag-management-screen",
    dataset: { screen: "memberTagManagement", platform: "app" },
  });
  screen.append(createAppHeader());
  screen.append(createBody(state));

  if (state.activeMemberTagSheetTagName) {
    screen.append(createMemberTagEditBottomSheet(state));
  }

  if (state.isDeleteReplacementModalOpen) {
    screen.append(createDeleteReplacementModal(state));
  }

  if (state.toastMessage) {
    screen.append(createToast(state.toastMessage));
  }

  return screen;
}

function createAppHeader() {
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
  header.append(createElement("span", { className: "header-spacer" }));
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
  titleGroup.append(createElement("p", { textContent: "회원 태그를 등록하고 관리합니다." }));
  header.append(titleGroup);
  card.append(header);

  const section = createElement("section", { className: "settings-section-card" });
  section.append(createBody(state));
  card.append(section);
  content.append(card);
  return content;
}

function createSettingsSaveBar(state) {
  const bar = createElement("section", {
    className: "settings-save-bar",
    dataset: { area: "settingsSaveBar", state: "dirty" },
  });
  const resetButton = createElement("button", {
    className: "secondary-button settings-reset-button",
    type: "button",
    textContent: "초기화",
    dataset: { action: "resetMemberTagSettings" },
  });
  resetButton.addEventListener("click", () => {
    resetWebDrafts(state);
  });
  const saveButton = createElement("button", {
    className: "primary-button settings-save-button",
    type: "button",
    textContent: "저장",
    dataset: { action: "saveMemberTagSettings" },
  });
  saveButton.addEventListener("click", () => {
    saveWebDrafts(state);
  });
  bar.append(resetButton);
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
  body.append(createSearch(state));
  body.append(createMemberTagList(state));
  return body;
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
    placeholder: "태그 입력 또는 조회",
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
  const creatableTagName = getCreatableMemberTagName(state);
  const canCreateTag = Boolean(creatableTagName);
  const list = createElement("div", {
    className: "member-tag-management-list",
    dataset: {
      area: "memberTagManagementList",
      state: visibleMemberTags.length || canCreateTag ? "list" : hasQuery ? "searchEmpty" : "empty",
    },
  });

  if (!activeCatalog.length && !canCreateTag) {
    list.append(createEmptyStateElement({ title: "등록된 태그가 없습니다" }));
    return list;
  }

  if (canCreateTag) {
    list.append(createMemberTagCreateRow(state, creatableTagName));
  }

  if (!visibleMemberTags.length && !canCreateTag) {
    list.append(createEmptyStateElement({ title: "조건과 일치하는 결과가 없습니다" }));
    return list;
  }

  visibleMemberTags.forEach((memberTagName) => {
    list.append(createMemberTagRow(state, memberTagName));
  });
  return list;
}

function createMemberTagCreateRow(state, memberTagName) {
  const row = createElement("button", {
    className: "member-tag-management-row member-tag-management-create-row",
    type: "button",
    textContent: `"${memberTagName}" 추가`,
    dataset: { action: "createMemberTag", entity: "memberTag", entityId: memberTagName },
  });
  row.addEventListener("click", () => {
    applyMemberTagCreate(state, memberTagName, {
      clearQuery: true,
      closeMenu: true,
    });
  });
  return row;
}

function createMemberTagRow(state, memberTagName) {
  const isDeleted = isWebDraftTagDeleted(state, memberTagName);
  const replacementTagName = isDeleted ? getDeleteReplacementTagName(state, memberTagName) : "";
  const rowState = isDeleted ? replacementTagName ? "changed" : "deleted" : "idle";

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
    row.append(createElement("span", {
      className: "member-tag-management-row-icon",
      textContent: "...",
      ariaLabel: "",
    }));
    row.addEventListener("click", () => {
      openMemberTagEditSheet(state, memberTagName);
    });
    return row;
  }

  const row = createElement("div", {
    className: "member-tag-management-row",
    dataset: { entity: "memberTag", entityId: memberTagName, state: rowState },
  });

  const input = createElement("input", {
    className: "member-tag-management-input",
    type: "text",
    value: getMemberTagRowInputValue(memberTagName, replacementTagName),
    placeholder: "태그명",
    dataset: { field: "memberTag" },
  });
  input.disabled = isDeleted;
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      commitMemberTagRename(state, memberTagName, event.target.value);
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      event.target.value = memberTagName;
      event.target.blur();
    }
  });
  input.addEventListener("blur", (event) => {
    commitMemberTagRename(state, memberTagName, event.target.value);
  });
  row.append(input);

  if (state.mode === "web") {
    row.append(createWebDeleteToggleButton(state, memberTagName, isDeleted));
  }

  return row;
}

function getMemberTagRowInputValue(memberTagName, replacementTagName) {
  return replacementTagName ? `${memberTagName} -> ${replacementTagName}` : memberTagName;
}
function createWebDeleteToggleButton(state, memberTagName, isDeleted) {
  const button = createElement("button", {
    className: isDeleted
      ? "secondary-button member-tag-management-delete-button is-restore"
      : "secondary-button member-tag-management-delete-button",
    type: "button",
    textContent: isDeleted ? "복구" : "삭제",
    dataset: {
      action: isDeleted ? "restoreMemberTag" : "deleteMemberTag",
      entityId: memberTagName,
      state: isDeleted ? "deleted" : "idle",
    },
  });
  button.addEventListener("click", () => {
    if (isDeleted) {
      restoreWebDraftMemberTag(state, memberTagName);
      return;
    }

    applyMemberTagDelete(state, memberTagName, {
      closeMenu: true,
    });
  });
  return button;
}

function openMemberTagEditSheet(state, memberTagName) {
  state.activeMemberTagSheetTagName = memberTagName;
  state.memberTagSheetDraftName = memberTagName;
  rerender(state);
  focusMemberTagSheetInput();
}

function createMemberTagEditBottomSheet(state) {
  const sourceTag = state.activeMemberTagSheetTagName;
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
  sheet.append(createElement("div", { className: "member-tag-edit-sheet-handle" }));

  const header = createElement("header", { className: "member-tag-edit-sheet-header" });
  header.append(createElement("span", { className: "member-tag-edit-sheet-spacer" }));
  header.append(createElement("h2", { textContent: sourceTag }));
  const doneButton = createElement("button", {
    className: "text-button member-tag-edit-done-button",
    type: "button",
    textContent: "완료",
    dataset: { action: "saveMemberTagEdit" },
  });
  header.append(doneButton);
  sheet.append(header);

  const input = createElement("input", {
    className: "member-tag-edit-input",
    type: "text",
    value: state.memberTagSheetDraftName || sourceTag,
    placeholder: "태그명",
    dataset: { field: "memberTag" },
  });
  doneButton.addEventListener("click", () => {
    commitMemberTagRename(state, sourceTag, input.value, { closeSheet: true });
  });
  sheet.append(input);

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
  sheet.append(deleteButton);
  overlay.append(sheet);
  return overlay;
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
    title: "태그 삭제",
    contentNode: content,
    actions: [
      {
        label: "취소",
        variant: "secondary",
        action: "cancelDeleteMemberTag",
        onClick: () => {
          closeDeleteReplacementModal(state);
        },
      },
      {
        label: "확인",
        variant: "primary",
        action: "confirmDeleteMemberTag",
        onClick: () => {
          confirmDeleteReplacement(state);
        },
      },
    ],
  });
}

function createDeleteReplacementMessage(count) {
  const message = createElement("p", {
    className: "member-tag-delete-replacement-message",
  });
  message.append("태그가 연결된 반려견이 ");
  message.append(createElement("strong", {
    className: "member-tag-delete-replacement-count",
    textContent: `${count}마리`,
  }));
  message.append(" 있습니다.\n태그 대체를 원한다면 아래에서 선택해 주세요.");
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
  picker.append(createDeleteReplacementSearch(state));
  if (state.isDeleteReplacementListOpen) {
    picker.append(createDeleteReplacementOptionList(state));
  }
  selector.append(picker);
  return selector;
}

function createDeleteReplacementSearch(state) {
  let isComposing = false;
  const displayValue = state.isDeleteReplacementListOpen
    ? state.deleteReplacementQuery || state.deleteReplacementTagName || "선택 안함"
    : state.deleteReplacementTagName || "선택 안함";
  const control = createElement("div", {
    className: "member-tag-search-control member-tag-delete-replacement-control",
    dataset: { state: state.isDeleteReplacementListOpen ? "open" : "closed" },
  });
  const input = createElement("input", {
    className: "member-tag-search-input member-tag-delete-replacement-search",
    type: "text",
    value: displayValue,
    placeholder: "태그 검색",
    dataset: { field: "deleteReplacementTagSearch" },
  });
  input.addEventListener("focus", () => {
    if (state.isDeleteReplacementListOpen) {
      return;
    }

    state.isDeleteReplacementListOpen = true;
    state.deleteReplacementQuery = "";
    rerender(state);
    focusDeleteReplacementSearch();
  });
  input.addEventListener("click", () => {
    if (state.isDeleteReplacementListOpen) {
      return;
    }

    state.isDeleteReplacementListOpen = true;
    rerender(state);
    focusDeleteReplacementSearch();
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
  const query = normalizeMemberTagInput(state.deleteReplacementQuery);
  const normalizedQuery = normalizeMemberTagName(query);
  const selectedTagName = normalizeMemberTagName(state.deleteReplacementTagName);
  const sourceTagName = normalizeMemberTagName(state.pendingDeleteMemberTagName);
  const originalSourceTagName = normalizeMemberTagName(findOriginalSourceForDraft(state, state.pendingDeleteMemberTagName));

  list.append(createDeleteReplacementOption(state, {
    label: "선택 안함",
    value: "",
    selected: !selectedTagName,
  }));

  const activeCatalog = getActiveMemberTagCatalog(state);
  if (selectedTagName && !hasMemberTag(activeCatalog, state.deleteReplacementTagName)) {
    list.append(createDeleteReplacementOption(state, {
      label: `"${state.deleteReplacementTagName}" 추가`,
      value: state.deleteReplacementTagName,
      selected: true,
    }));
  }

  const availableTags = sortMemberTagNames(activeCatalog).filter((memberTagName) => {
    const normalizedTagName = normalizeMemberTagName(memberTagName);
    return normalizedTagName !== sourceTagName
      && normalizedTagName !== originalSourceTagName
      && (!normalizedQuery || normalizeMemberTagName(memberTagName).includes(normalizedQuery));
  });

  availableTags.forEach((memberTagName) => {
    list.append(createDeleteReplacementOption(state, {
      label: memberTagName,
      value: memberTagName,
      selected: normalizeMemberTagName(memberTagName) === selectedTagName,
    }));
  });

  const canCreateTag = query
    && normalizeMemberTagName(query) !== sourceTagName
    && normalizeMemberTagName(query) !== originalSourceTagName
    && !hasMemberTag(activeCatalog, query);
  if (canCreateTag) {
    list.append(createDeleteReplacementOption(state, {
      label: `"${query}" 추가`,
      value: query,
      selected: normalizeMemberTagName(query) === selectedTagName,
    }));
  }

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
    if (!input.value || input.value === "선택 안함") {
      input.select();
      return;
    }

    input.setSelectionRange(input.value.length, input.value.length);
  }, 0);
}

function closeMemberTagEditSheet(state) {
  state.activeMemberTagSheetTagName = "";
  state.memberTagSheetDraftName = "";
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

function applyMemberTagCreate(state, memberTagName, options = {}) {
  if (state.mode !== "web") {
    applyMemberTagMutation(state, createMemberTag(memberTagName), options);
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
    applyMemberTagMutation(state, renameMemberTag(sourceTag, nextTagName), options);
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
  const usageSummary = getMemberTagUsageSummary(findOriginalSourceForDraft(state, memberTagName));
  if (usageSummary.count > 0) {
    openDeleteReplacementModal(state, memberTagName, options);
    return;
  }

  applyMemberTagDeleteDraft(state, memberTagName, "", options);
}

function openDeleteReplacementModal(state, memberTagName, options = {}) {
  state.pendingDeleteMemberTagName = memberTagName;
  state.deleteReplacementTagName = "";
  state.deleteReplacementQuery = "";
  state.isDeleteReplacementModalOpen = true;
  applyMutationOptions(state, options);
  rerender(state);
  focusDeleteReplacementSearch();
}

function closeDeleteReplacementModal(state) {
  clearDeleteReplacementState(state);
  rerender(state);
}

function confirmDeleteReplacement(state) {
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

  markWebDraftTagDeleted(state, sourceTagName);
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
  }

  if (options.toastMessage) {
    state.toastMessage = options.toastMessage;
  }
}

function saveWebDrafts(state) {
  if (!hasMemberTagDraftChanges(state)) {
    return;
  }

  const result = applyMemberTagCatalogEdits(state.memberTagDrafts);
  state.memberTagCatalog = result.memberTagCatalog;
  state.draftMemberTagCatalog = [...result.memberTagCatalog];
  state.memberTagDrafts = [];
  state.deletedDraftMemberTagNames = [];
  clearDeleteReplacementState(state);
  state.toastMessage = MEMBER_TAG_SAVE_MESSAGE;
  rerender(state);
}

function resetWebDrafts(state) {
  state.draftMemberTagCatalog = [...state.memberTagCatalog];
  state.memberTagDrafts = [];
  state.deletedDraftMemberTagNames = [];
  state.openMemberTagMenuTagName = "";
  state.activeMemberTagSheetTagName = "";
  state.memberTagSheetDraftName = "";
  clearDeleteReplacementState(state);
  rerender(state);
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
  return String(memberTagName || "").trim().replace(/\s+/g, " ");
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
