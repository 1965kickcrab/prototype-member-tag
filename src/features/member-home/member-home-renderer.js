import { createEmptyStateElement } from "../../shared/components/empty-state.js";
import { createHeaderIconButton } from "../../shared/components/header-icon-button.js";
import { renderMemberTagChips } from "../../shared/components/member-tag-chips.js";
import { createBusinessNavigation, createDefaultAppBottomNavigation } from "../../shared/components/navigation.js";
import { createToast, TOAST_AUTO_DISMISS_MS } from "../../shared/components/toast.js";
import { ACTION_BUTTON_STATE } from "../../shared/constants/ui-state.js";
import { normalizeMemberTagName, sanitizeTagList, sortMemberTagNames } from "../../shared/services/member-tag-service.js";
import {
  createMemberTag,
  deleteMemberTag,
  deleteStoredMember,
  getMemberPetRows,
  renameMemberTag,
  saveStoredMembers,
} from "../../shared/storage/member-storage.js";
import { createElement } from "../../shared/utils/dom.js";
import { formatText } from "../../shared/utils/format.js";
import { formatMemberBirthDate, formatMemberGender, formatMemberWeight, getAgeOutputText, normalizeBirthDateParts } from "../../shared/utils/member-date.js";
import { formatPhoneNumber, normalizePhoneNumber } from "../../shared/utils/phone.js";
import { getFilteredMembers, getMemberListState } from "./member-home-state.js";

const MEMBER_SEARCH_FIELDS = ["petName", "breed", "guardianName", "phoneNumber"];
const MENU_FOLD_ICON_PATH = "../assets/menuFold.svg";
const MENU_FOLD_OPEN_ICON_PATH = "../assets/menuFold_fold.svg";
const DEFAULT_DOG_PROFILE_IMAGE = "../assets/defaultProfile_dog.svg";
const CHEVRON_RIGHT_ICON_PATH = "../assets/iconChevronRight.svg";
const CHEVRON_LEFT_ICON_PATH = "../assets/iconChevronLeft.svg";
const CAMERA_ICON_PATH = "../assets/iconCamera.svg";
const MEMBER_TAG_DUPLICATE_MESSAGE = "이미 존재하는 태그입니다.";
const MEMBER_TAG_MAX_CATALOG_MESSAGE = "태그는 최대 20개까지 등록할 수 있습니다.";
let toastDismissTimer = null;

export function renderMemberHome(rootElement, memberHomeState) {
  rootElement.innerHTML = "";

  if (memberHomeState.activeScreen === "memberEdit") {
    rootElement.append(createMemberEditScreen(memberHomeState));
    scheduleToastDismiss(memberHomeState);
    return;
  }

  if (memberHomeState.isMemberRegistrationPageOpen) {
    rootElement.append(createGuardianRegistrationPage(memberHomeState));
    return;
  }

  rootElement.append(createMemberHomeShell(memberHomeState));
  scheduleToastDismiss(memberHomeState);
}

function scheduleToastDismiss(memberHomeState) {
  window.clearTimeout(toastDismissTimer);

  if (!memberHomeState.toastMessage) {
    return;
  }

  toastDismissTimer = window.setTimeout(() => {
    memberHomeState.toastMessage = "";
    renderMemberHome(document.querySelector("#app"), memberHomeState);
  }, TOAST_AUTO_DISMISS_MS);
}

function createMemberHomeShell(memberHomeState) {
  const shell = createElement("main", {
    className: "member-home-shell",
    dataset: {
      screen: "memberHome",
      state: "ready",
    },
  });

  shell.append(createHeader(memberHomeState));
  shell.append(createNavigation());
  shell.append(createContent(memberHomeState));

  if (memberHomeState.isGuardianLookupModalOpen) {
    shell.append(createGuardianLookupModal(memberHomeState));
  }

  if (memberHomeState.isMemberTagManagementOpen) {
    shell.append(createMemberTagManagementModal(memberHomeState));
  }

  if (memberHomeState.toastMessage) {
    shell.append(createToast(memberHomeState.toastMessage));
  }

  return shell;
}

function createHeader(memberHomeState) {
  const header = createElement("header", {
    className: "header",
    dataset: { area: "header" },
  });

  header.append(createElement("strong", { className: "brand-name", textContent: "다이얼독 비즈" }));
  header.append(createElement("h1", { textContent: "회원" }));
  header.append(createCreateMemberButton("icon-button header-add-button", "+", memberHomeState));
  header.append(createHeaderUtility());

  return header;
}

function createHeaderUtility() {
  const utility = createElement("span", { className: "header-utility" });
  const settingsButton = createElement("button", {
    className: "header-utility-button",
    type: "button",
    textContent: "설정",
    dataset: { action: "openSettings" },
  });
  settingsButton.addEventListener("click", () => {
    window.location.href = "./settings/member/tag-management.html";
  });
  utility.append(settingsButton);
  utility.append(createElement("span", { textContent: "알림" }));
  utility.append(createElement("span", { textContent: "계정" }));
  return utility;
}

function createNavigation() {
  const sharedNavigation = createBusinessNavigation({
    className: "business-navigation member-navigation",
    dataset: { area: "navigation" },
    profile: {
      imageSrc: DEFAULT_DOG_PROFILE_IMAGE,
      title: "다이얼독",
      subtitle: "애견유치원",
    },
    footerText: "개인정보 처리방침  이용약관  문의",
    items: ["대시보드", "유치원", "호텔링", "알림장", "회원", "이용권"].map((label) => ({
      label,
      selected: label === "회원",
      href: label === "대시보드" || label === "유치원"
        ? "./index.html"
        : label === "호텔링"
          ? "./hotel-home.html"
          : label === "회원"
            ? "./member-home.html"
            : ""
    }))
  });

  sharedNavigation.append(createDefaultAppBottomNavigation({
    className: "mobile-bottom-nav",
    dataset: { area: "bottomNavigation" },
    selectedLabel: "회원",
  }));

  return sharedNavigation;
}
function createContent(memberHomeState) {
  const content = createElement("section", {
    className: "content",
    dataset: { area: "content", feature: "memberHome" },
  });

  const titleBar = createElement("div", {
    className: "page-title-bar",
    dataset: { area: "title" },
  });
  titleBar.append(createElement("h1", { textContent: "회원" }));
  titleBar.append(createCreateMemberButton("primary-button", "회원 등록", memberHomeState));

  const panel = createElement("section", {
    className: "member-panel",
    dataset: { area: "memberPanel" },
  });
  panel.append(createPanelHeader(memberHomeState));
  panel.append(createMemberFilterArea(memberHomeState));
  panel.append(createMemberListArea(memberHomeState));

  content.append(titleBar);
  content.append(panel);

  return content;
}

function createPanelHeader(memberHomeState) {
  const panelHeader = createElement("div", {
    className: "member-panel-header",
    dataset: { area: "memberPanelHeader" },
  });

  panelHeader.append(createElement("h2", { textContent: "회원 목록" }));

  if (!isMobileLayout()) {
    return panelHeader;
  }

  const controlRow = createElement("div", {
    className: "member-panel-controls",
    dataset: { area: "memberControls" },
  });

  controlRow.append(createMobileTagFilterButton(memberHomeState));
  controlRow.append(createMemberSearchField(memberHomeState, {
    fieldClassName: "member-search-suggestion-field mobile-member-search-field",
    inputClassName: "search-input",
  }));
  panelHeader.append(controlRow);

  return panelHeader;
}

function createCreateMemberButton(className, textContent, memberHomeState) {
  const button = createElement("button", {
    className,
    type: "button",
    textContent,
    dataset: { action: "createMember" },
    ariaLabel: textContent === "+" ? "회원 등록" : undefined,
  });

  button.addEventListener("click", () => {
    if (isMobileLayout()) {
      memberHomeState.isMemberRegistrationPageOpen = true;
      memberHomeState.isGuardianLookupModalOpen = false;
    } else {
      memberHomeState.isGuardianLookupModalOpen = true;
      memberHomeState.isMemberRegistrationPageOpen = false;
    }

    renderMemberHome(document.querySelector("#app"), memberHomeState);
  });

  return button;
}

function createGuardianLookupModal(memberHomeState) {
  const overlay = createElement("section", {
    className: "guardian-modal-overlay",
    dataset: { area: "guardianLookupModal", modal: "guardianLookup", state: "open" },
  });
  const modal = createElement("div", { className: "guardian-modal" });
  const header = createElement("div", { className: "modal-header" });
  header.append(createElement("h2", { textContent: "보호자 조회" }));
  header.append(createCloseRegistrationButton(memberHomeState, "modal-close-button", "✕", "보호자 조회 닫기"));

  const body = createElement("div", { className: "registration-form" });
  body.append(createRegistrationNotice("등록 전, 다이얼독에 가입한 회원인지 조회합니다.\n보호자의 성함과 전화번호는 아이디로 사용되니 정확하게 입력해 주세요."));
  body.append(createFormField("보호자 성함", "이름 입력", true, {
    value: memberHomeState.guardianLookup.guardianName,
    hasError: Boolean(memberHomeState.guardianLookup.error),
    errorMessage: memberHomeState.guardianLookup.error,
    onInput: (value) => {
      memberHomeState.guardianLookup.guardianName = value;
      memberHomeState.guardianLookup.error = "";
      syncGuardianLookupButtonState(memberHomeState);
    },
  }));
  body.append(createFormField("전화번호", "010-0000-0000", true, {
    value: formatPhoneNumber(memberHomeState.guardianLookup.phoneNumber),
    inputFormatter: formatPhoneNumber,
    onInput: (value) => {
      memberHomeState.guardianLookup.phoneNumber = value;
      syncGuardianLookupButtonState(memberHomeState);
    },
  }));
  body.append(createLookupGuardianButton(memberHomeState, "조회"));

  modal.append(header);
  modal.append(body);
  overlay.append(modal);

  return overlay;
}

function createGuardianRegistrationPage(memberHomeState) {
  const page = createElement("main", {
    className: "member-registration-page",
    dataset: { screen: "memberRegistration", state: "creating" },
  });
  const header = createElement("header", {
    className: "registration-page-header",
    dataset: { area: "header" },
  });
  header.append(createCloseRegistrationButton(memberHomeState, "page-close-button", "✕", "회원 등록 닫기"));
  header.append(createElement("h1", { textContent: "회원 등록" }));
  header.append(createElement("span", { className: "header-spacer" }));

  const form = createElement("section", {
    className: "registration-form registration-page-form",
    dataset: { area: "memberRegistrationForm" },
  });
  form.append(createRegistrationNotice("보호자 이름과 번호는 회원 아이디로 사용됩니다.\n올바른 보호자 정보를 입력해 주세요."));
  form.append(createFormField("보호자 이름", "한글, 영문 10자 이내 입력", true, {
    value: memberHomeState.guardianLookup.guardianName,
    hasError: Boolean(memberHomeState.guardianLookup.error),
    errorMessage: memberHomeState.guardianLookup.error,
    onInput: (value) => {
      memberHomeState.guardianLookup.guardianName = value;
      memberHomeState.guardianLookup.error = "";
      syncGuardianLookupButtonState(memberHomeState);
    },
  }));
  form.append(createFormField("전화번호", "010-0000-0000", true, {
    value: formatPhoneNumber(memberHomeState.guardianLookup.phoneNumber),
    inputFormatter: formatPhoneNumber,
    onInput: (value) => {
      memberHomeState.guardianLookup.phoneNumber = value;
      syncGuardianLookupButtonState(memberHomeState);
    },
  }));

  page.append(header);
  page.append(form);
  page.append(createLookupGuardianButton(memberHomeState, "다음", "large-disabled-button mobile-next-button"));

  return page;
}

function createCloseRegistrationButton(memberHomeState, className, textContent, ariaLabel) {
  const actionClassName = textContent === "←" ? "back-button" : "close-button";
  const button = createHeaderIconButton({
    className: `${className} ${actionClassName}`,
    icon: textContent === "←" ? "back" : "close",
    ariaLabel,
    dataset: { action: "closeMemberRegistration" },
  });

  button.addEventListener("click", () => {
    memberHomeState.isGuardianLookupModalOpen = false;
    memberHomeState.isMemberRegistrationPageOpen = false;
    memberHomeState.activeScreen = "memberHome";
    memberHomeState.selectedMember = null;
    memberHomeState.toastMessage = "";
    renderMemberHome(document.querySelector("#app"), memberHomeState);
  });

  return button;
}

function createRegistrationNotice(textContent) {
  return createElement("section", {
    className: "registration-notice",
    textContent,
    dataset: { area: "registrationNotice" },
  });
}

function createFormField(labelText, placeholder, isRequired, options = {}) {
  const field = createElement("label", {
    className: options.hasError ? "registration-field has-error" : "registration-field",
    dataset: {
      field: labelText,
      state: options.hasError ? "validationError" : "idle",
    },
  });
  const label = createElement("span", { className: "registration-label", textContent: labelText });

  if (isRequired) {
    label.append(createElement("span", { className: "required-mark", textContent: " *" }));
  }

  const input = createElement("input", {
    className: "registration-input",
    type: "text",
    placeholder,
    value: options.value || "",
  });
  input.addEventListener("input", (event) => {
    if (options.inputFormatter) {
      event.target.value = options.inputFormatter(event.target.value);
    }

    if (options.onInput) {
      options.onInput(event.target.value);
    }
  });

  field.append(label);
  field.append(input);

  if (options.errorMessage) {
    field.append(createElement("p", { className: "field-error-message", textContent: options.errorMessage }));
  }

  return field;
}

function createLookupGuardianButton(memberHomeState, textContent, className = "large-disabled-button") {
  const isReady = isGuardianLookupReady(memberHomeState);
  const button = createElement("button", {
    className,
    type: "button",
    textContent,
    dataset: {
      action: "lookupGuardian",
      state: isReady ? ACTION_BUTTON_STATE.enabled : ACTION_BUTTON_STATE.disabled,
    },
  });
  button.disabled = !isReady;

  button.addEventListener("click", () => {
    if (!isGuardianLookupReady(memberHomeState)) {
      syncGuardianLookupButtonState(memberHomeState);
      return;
    }

    const didRedirect = handleGuardianLookup(memberHomeState);

    if (didRedirect) {
      return;
    }

    renderMemberHome(document.querySelector("#app"), memberHomeState);
  });

  return button;
}

function syncGuardianLookupButtonState(memberHomeState) {
  const lookupButton = document.querySelector("[data-action='lookupGuardian']");

  if (!lookupButton) {
    return;
  }

  const isReady = isGuardianLookupReady(memberHomeState);
  lookupButton.disabled = !isReady;
  lookupButton.dataset.state = isReady ? ACTION_BUTTON_STATE.enabled : ACTION_BUTTON_STATE.disabled;
}

function isGuardianLookupReady(memberHomeState) {
  const guardianName = normalizeLookupText(memberHomeState.guardianLookup.guardianName);
  const phoneNumber = normalizePhoneNumber(memberHomeState.guardianLookup.phoneNumber);
  return Boolean(guardianName && phoneNumber.length >= 10);
}

function handleGuardianLookup(memberHomeState) {
  const inputPhoneNumber = normalizePhoneNumber(memberHomeState.guardianLookup.phoneNumber);
  const inputGuardianName = normalizeLookupText(memberHomeState.guardianLookup.guardianName);
  const matchedByPhone = inputPhoneNumber
    ? memberHomeState.members.find((member) => {
        return normalizePhoneNumber(member.phoneNumber) === inputPhoneNumber;
      })
    : null;

  if (matchedByPhone && normalizeLookupText(matchedByPhone.guardianName) !== inputGuardianName) {
    memberHomeState.guardianLookup.error = "회원 정보가 일치하지 않습니다";
    return false;
  }

  const selectedMember = matchedByPhone || {
    id: "",
    petName: "",
    dogName: "",
    guardianName: memberHomeState.guardianLookup.guardianName,
    phoneNumber: memberHomeState.guardianLookup.phoneNumber,
    address: "",
    breed: "",
    ownerTags: [],
    petTags: [],
    isRegistered: false,
  };

  memberHomeState.selectedMember = selectedMember;
  memberHomeState.guardianLookup.error = "";
  memberHomeState.isGuardianLookupModalOpen = false;
  memberHomeState.isMemberRegistrationPageOpen = false;

  if (matchedByPhone && matchedByPhone.isRegistered) {
    memberHomeState.activeScreen = isMobileLayout() ? "memberEdit" : "memberDetail";
    memberHomeState.toastMessage = "이미 등록된 회원입니다. 반려견 정보를 확인해 주세요.";
    return false;
  }

  window.location.href = createMemberRegistrationUrl(selectedMember, matchedByPhone);
  return true;
}

function createMemberRegistrationUrl(member, matchedByPhone) {
  const queryParams = new URLSearchParams();

  if (member.id) {
    queryParams.set("memberId", member.id);
  }

  queryParams.set("guardianName", member.guardianName || "");
  queryParams.set("phoneNumber", member.phoneNumber || "");
  queryParams.set("address", member.address || "");

  if (matchedByPhone) {
    queryParams.set("toast", "loaded");
  }

  return `./member-registration.html?${queryParams.toString()}`;
}

function createMemberDetailUrl(member) {
  const queryParams = new URLSearchParams();

  if (member?.id) {
    queryParams.set("memberId", member.id);
  }

  if (member?.petId) {
    queryParams.set("petId", member.petId);
  }

  return `./member-detail.html?${queryParams.toString()}`;
}

function createMemberDetailScreen(memberHomeState) {
  if (isMobileLayout()) {
    return createAppMemberDetailScreen(memberHomeState);
  }

  return createWebMemberDetailScreen(memberHomeState);
}

function createMemberEditScreen(memberHomeState) {
  return createMemberProfileFlowScreen({
    memberHomeState,
    screenName: "memberEdit",
    title: "회원 수정",
    primaryActionText: "저장",
  });
}

function createMemberProfileFlowScreen({ memberHomeState, screenName, title, primaryActionText }) {
  const screen = createElement("main", {
    className: "member-profile-flow is-summary",
    dataset: { screen: screenName },
  });
  const selectedMember = memberHomeState.selectedMember || {};

  screen.append(createProfileFlowHeader(memberHomeState, title));

  const content = createElement("section", { className: "profile-flow-content" });
  content.append(createGuardianSummarySection(selectedMember));
  content.append(createPetSummarySection(selectedMember, screenName));

  screen.append(content);
  screen.append(createProfileFlowActions(memberHomeState, primaryActionText));

  if (memberHomeState.toastMessage) {
    screen.append(createToast(memberHomeState.toastMessage));
  }

  return screen;
}

function createProfileFlowActions(memberHomeState, primaryActionText) {
  const actions = createElement("div", { className: "profile-flow-actions" });
  const deleteButton = createElement("button", {
    className: "profile-flow-delete-button",
    type: "button",
    textContent: "회원 삭제",
    dataset: { action: "deleteMember" },
  });
  deleteButton.addEventListener("click", () => {
    deleteSelectedMember(memberHomeState);
  });

  actions.append(deleteButton);
  actions.append(createElement("button", {
    className: "large-disabled-button profile-flow-primary-button",
    type: "button",
    textContent: primaryActionText,
  }));
  return actions;
}

function createWebMemberDetailScreen(memberHomeState) {
  const screen = createElement("main", {
    className: "member-home-shell member-detail-shell",
    dataset: { screen: "memberDetail" },
  });

  screen.append(createHeader(memberHomeState));
  screen.append(createNavigation());
  screen.append(createWebMemberDetailContent(memberHomeState));

  if (memberHomeState.toastMessage) {
    screen.append(createToast(memberHomeState.toastMessage));
  }

  return screen;
}

function createWebMemberDetailContent(memberHomeState) {
  const member = memberHomeState.selectedMember || {};
  const content = createElement("section", {
    className: "content member-detail-content",
    dataset: { area: "content", feature: "memberDetail" },
  });
  const titleBar = createElement("div", {
    className: "member-detail-title-bar",
    dataset: { area: "detailTitle" },
  });
  titleBar.append(createBackNavigationButton(memberHomeState));
  titleBar.append(createElement("h1", { textContent: "회원 상세" }));

  const summaryCard = createElement("section", {
    className: "member-detail-summary-card",
    dataset: { area: "memberSummary" },
  });
  const profile = createElement("div", { className: "member-detail-profile" });
  profile.append(createMemberProfileImage("member-detail-avatar"));
  const profileText = createElement("div", { className: "member-detail-profile-text" });
  profileText.append(createElement("strong", { textContent: getMemberPetName(member) }));
  profileText.append(createElement("p", { textContent: formatText(member.breed) }));
  appendInlineMemberTags(profileText, member.petTags);
  profile.append(profileText);
  summaryCard.append(profile);
  summaryCard.append(createReservationHighlightCard(member));

  const panel = createElement("section", {
    className: "member-detail-panel",
    dataset: { area: "detailPanel", state: "memberInfo" },
  });
  panel.append(createWebMemoSection(memberHomeState, member));
  panel.append(createWebGuardianInfoSection(member));
  panel.append(createWebPetDetailSection(memberHomeState, member));
  panel.append(createWebSiblingPetsSection(memberHomeState, member));

  const detailPanelGroup = createElement("div", {
    className: "member-detail-tab-panel-group",
    dataset: { area: "detailPanelGroup" },
  });
  detailPanelGroup.append(createWebMemberDetailTabs());
  detailPanelGroup.append(panel);

  content.append(titleBar);
  content.append(summaryCard);
  content.append(detailPanelGroup);

  if (memberHomeState.isPetDetailModalOpen) {
    content.append(createPetDetailModal(memberHomeState));
  }

  return content;
}

function createWebMemberDetailTabs() {
  const tabs = createElement("div", {
    className: "member-detail-tabs",
    dataset: { area: "memberDetailTabs" },
  });
  tabs.setAttribute("role", "tablist");

  const memberInfoTab = createElement("button", {
    className: "member-detail-tab is-selected",
    type: "button",
    textContent: "회원 정보",
    dataset: { action: "selectMemberDetailTab", target: "memberInfo", state: "selected" },
  });
  memberInfoTab.setAttribute("role", "tab");
  memberInfoTab.setAttribute("aria-selected", "true");
  tabs.append(memberInfoTab);

  const ticketTab = createElement("button", {
    className: "member-detail-tab",
    type: "button",
    textContent: "이용권 내역",
    dataset: { action: "selectMemberDetailTab", target: "ticketHistory", state: "disabled" },
  });
  ticketTab.setAttribute("role", "tab");
  ticketTab.setAttribute("aria-selected", "false");
  ticketTab.setAttribute("aria-disabled", "true");
  ticketTab.disabled = true;
  tabs.append(ticketTab);

  return tabs;
}

function createAppMemberDetailScreen(memberHomeState) {
  const member = memberHomeState.selectedMember || {};
  const screen = createElement("main", {
    className: "member-detail-app-screen",
    dataset: { screen: "memberDetail" },
  });

  screen.append(createAppMemberDetailHeader(memberHomeState));

  const content = createElement("section", {
    className: "member-detail-app-content",
    dataset: { area: "detailContent" },
  });
  content.append(createAppMemberProfileSection(member));
  content.append(createAppAccordionSection(memberHomeState, "detailInfo", "상세 정보", createAppDetailInfoBody(member)));
  content.append(createAppAccordionSection(memberHomeState, "memo", "메모", createAppMemoBody(member)));
  content.append(createAppTicketSection(member));

  screen.append(content);

  if (memberHomeState.isPetDetailBottomSheetOpen) {
    screen.append(createPetDetailBottomSheet(memberHomeState));
  }

  if (memberHomeState.toastMessage) {
    screen.append(createToast(memberHomeState.toastMessage));
  }

  return screen;
}

function createAppMemberDetailHeader(memberHomeState) {
  const header = createElement("header", {
    className: "member-detail-app-header",
    dataset: { area: "header" },
  });
  header.append(createBackNavigationButton(memberHomeState));
  header.append(createElement("h1", { textContent: "회원 상세" }));

  const editButton = createElement("button", {
    className: "member-detail-edit-button",
    type: "button",
    textContent: "수정",
    dataset: { action: "openMemberEdit" },
  });
  editButton.addEventListener("click", () => {
    memberHomeState.petDetailDraft = createPetDetailDraft(memberHomeState.selectedMember);
    memberHomeState.isPetDetailBottomSheetOpen = true;
    renderMemberHome(document.querySelector("#app"), memberHomeState);
  });
  header.append(editButton);

  return header;
}

function createBackNavigationButton(memberHomeState) {
  const button = createHeaderIconButton({
    className: "back-button icon-button",
    icon: "back",
    ariaLabel: "회원 목록으로 돌아가기",
    dataset: { action: "backToMemberHome" },
  });
  button.addEventListener("click", () => {
    window.location.href = "./member-home.html";
  });
  return button;
}

function createTicketIssuePrimaryButton(member) {
  return createElement("button", {
    className: "primary-button member-ticket-issue-button",
    type: "button",
    textContent: "이용권 지급",
    dataset: { action: "issueTicket", entityId: formatText(member.id) },
  });
}

function createReservationHighlightCard(member) {
  const availability = getReservationAvailability(member);
  const card = createElement("aside", {
    className: "member-detail-reservation-card",
    dataset: { area: "reservationSummary", state: availability.state },
  });
  card.append(createElement("span", { textContent: "예약 가능" }));
  card.append(createElement("strong", { textContent: availability.text }));
  return card;
}

function createWebMemoSection(memberHomeState, member) {
  const section = createElement("section", {
    className: "member-detail-card member-detail-memo-section",
    dataset: { area: "memberMemo" },
  });
  section.append(createElement("h2", { textContent: "메모" }));
  const memoField = createElement("textarea", {
    className: "member-detail-memo-box",
    value: String(member.memo || "").trim(),
  });
  memoField.placeholder = "성격, 알러지 등 필요한 내용을 입력해 주세요. (최대 500자)";
  memoField.dataset.state = String(member.memo || "").trim() ? "filled" : "empty";
  memoField.addEventListener("input", (event) => {
    member.memo = event.target.value;
    memoField.dataset.state = event.target.value.trim() ? "filled" : "empty";
  });
  section.append(memoField);
  return section;
}

function createWebGuardianInfoSection(member) {
  const section = createDetailInfoCard("보호자 정보", { area: "guardianInfo", actionText: "수정" });
  section.append(createInfoList([
    ["보호자", formatText(member.guardianName)],
    ["연락처", formatText(formatPhoneNumber(member.phoneNumber))],
    ["주소", formatText([member.address, member.addressDetail].filter(Boolean).join(" "))],
  ]));
  return section;
}

function createWebPetDetailSection(memberHomeState, member) {
  const section = createDetailInfoCard("반려견 세부 정보", { area: "petDetailInfo", actionText: "수정", actionName: "openPetDetail" });
  section.append(createInfoList([
    ["생년월일", formatMemberBirthDate(member.birthDate)],
    ["동물등록번호", formatText(member.animalRegistrationNumber)],
    ["모색", formatText(member.coatColor)],
    ["몸무게", formatMemberWeight(member.weight)],
    ["성별", formatMemberGender(member.gender, member.neuteredStatus)],
  ]));
  const actionButton = section.querySelector('[data-action="openPetDetail"]');
  if (actionButton) {
    actionButton.addEventListener("click", () => {
      memberHomeState.petDetailDraft = createPetDetailDraft(memberHomeState.selectedMember);
      memberHomeState.isPetDetailModalOpen = true;
      renderMemberHome(document.querySelector("#app"), memberHomeState);
    });
  }
  return section;
}

function createWebSiblingPetsSection(memberHomeState, member) {
  const section = createDetailInfoCard("형제 반려견", { area: "siblingPets", actionText: "추가 등록" });
  const siblings = getSiblingMembers(memberHomeState.members, member);

  if (siblings.length === 0) {
    section.append(createElement("p", {
      className: "member-detail-empty-inline",
      textContent: "등록된 형제 반려견이 없습니다.",
      dataset: { state: "empty" },
    }));
    return section;
  }

  const list = createElement("div", { className: "member-sibling-list", dataset: { state: "list" } });
  siblings.forEach((sibling) => {
    const item = createElement("article", {
      className: "member-sibling-item",
      dataset: { entity: "member", entityId: formatText(sibling.id) },
    });
    item.append(createMemberProfileImage("member-sibling-avatar"));
    const text = createElement("div", { className: "member-sibling-text" });
    text.append(createElement("strong", { textContent: getMemberPetName(sibling) }));
    text.append(createElement("span", { textContent: formatText(sibling.breed) }));
    item.append(text);
    item.append(createElement("span", { className: "member-sibling-arrow", textContent: "›" }));
    list.append(item);
  });
  section.append(list);
  return section;
}

function createWebTicketHistorySection(member) {
  const section = createElement("section", {
    className: "member-detail-card member-ticket-history-section",
    dataset: { area: "ticketHistory" },
  });
  section.append(createElement("h2", { textContent: "이용권 내역" }));

  const ticketHistories = getMemberTicketHistories(member);
  if (ticketHistories.length === 0) {
    section.append(createTicketHistoryPlaceholder());
    return section;
  }

  const table = createElement("div", {
    className: "member-ticket-table",
    dataset: { state: "list" },
  });
  ["이용권 상태", "이용권", "예약 가능", "유효기간 / 만료일", "금액", "내역"].forEach((label) => {
    table.append(createElement("strong", { className: "member-ticket-table-header", textContent: label }));
  });

  ticketHistories.forEach((ticketHistory) => {
    table.append(createElement("span", {
      className: `member-ticket-status status-${getTicketStatusTone(ticketHistory.status)}`,
      textContent: getTicketStatusLabel(ticketHistory.status),
    }));
    table.append(createElement("span", { textContent: ticketHistory.ticketName }));
    table.append(createElement("span", { textContent: `${ticketHistory.remainingCount}회` }));
    table.append(createElement("span", { textContent: getTicketValidityText(ticketHistory) }));
    table.append(createElement("span", { textContent: formatTicketAmount(ticketHistory.amount) }));
    table.append(createElement("span", { className: "member-ticket-history-arrow", textContent: "›" }));
  });

  section.append(table);
  return section;
}

function createAppMemberProfileSection(member) {
  const section = createElement("section", {
    className: "member-detail-app-profile",
    dataset: { area: "profileSummary" },
  });
  section.append(createMemberProfileImage("member-detail-app-avatar"));

  const text = createElement("div", { className: "member-detail-app-profile-text" });
  text.append(createElement("strong", { textContent: getMemberPetName(member) }));
  text.append(createElement("p", { textContent: formatText(member.breed) }));
  appendInlineMemberTags(text, member.petTags);

  const guardian = createElement("p", { className: "member-detail-app-guardian-line" });
  guardian.append(createElement("span", { textContent: `${formatText(member.guardianName)} 보호자` }));
  guardian.append(createElement("span", { textContent: ` (${formatText(formatPhoneNumber(member.phoneNumber))})` }));
  text.append(guardian);

  section.append(text);
  return section;
}

function createAppAccordionSection(memberHomeState, sectionName, label, body) {
  const isOpen = sectionName === "detailInfo" ? memberHomeState.isDetailInfoExpanded : memberHomeState.isDetailMemoExpanded;
  const section = createElement("section", {
    className: "member-detail-app-accordion",
    dataset: { area: sectionName, state: isOpen ? "open" : "closed" },
  });
  const button = createElement("button", {
    className: "member-detail-app-accordion-button",
    type: "button",
    dataset: { action: "toggleDetailAccordion", target: sectionName },
  });
  button.append(createElement("span", { textContent: label }));
  button.append(createElement("span", { className: isOpen ? "member-detail-chevron is-open" : "member-detail-chevron", textContent: "⌄" }));
  button.addEventListener("click", () => {
    if (sectionName === "detailInfo") {
      memberHomeState.isDetailInfoExpanded = !memberHomeState.isDetailInfoExpanded;
    } else {
      memberHomeState.isDetailMemoExpanded = !memberHomeState.isDetailMemoExpanded;
    }
    renderMemberHome(document.querySelector("#app"), memberHomeState);
  });
  section.append(button);

  if (isOpen) {
    section.append(body);
  }

  return section;
}

function createAppDetailInfoBody(member) {
  return createInfoList([
    ["기본 주소", formatText(member.address)],
    ["상세 주소", formatText(member.addressDetail)],
    ["생년월일", formatMemberBirthDate(member.birthDate)],
    ["동물등록번호", formatText(member.animalRegistrationNumber)],
    ["모색", formatText(member.coatColor)],
    ["몸무게", formatMemberWeight(member.weight)],
    ["성별", formatMemberGender(member.gender, member.neuteredStatus)],
  ], "member-detail-app-info-list");
}

function createAppMemoBody(member) {
  return createElement("div", {
    className: "member-detail-app-memo-body",
    textContent: String(member.memo || "").trim(),
    dataset: { state: String(member.memo || "").trim() ? "filled" : "empty" },
  });
}

function createAppTicketSection(member) {
  const section = createElement("section", {
    className: "member-detail-app-ticket-section",
    dataset: { area: "ticketSection" },
  });
  const title = createElement("div", { className: "member-detail-app-ticket-title" });
  title.append(createElement("strong", { textContent: "이용권" }));
  title.append(createElement("span", { textContent: `(예약 가능 ${getReservationAvailability(member).text})` }));
  section.append(title);
  section.append(createTicketIssuePrimaryButton(member));

  const ticketHistories = getMemberTicketHistories(member);
  if (ticketHistories.length === 0) {
    section.append(createTicketHistoryPlaceholder("member-detail-app-ticket-placeholder"));
    return section;
  }

  const list = createElement("div", {
    className: "member-detail-app-ticket-list",
    dataset: { state: "list" },
  });
  ticketHistories.forEach((ticketHistory) => {
    const card = createElement("article", {
      className: "member-detail-app-ticket-card",
      dataset: { entity: "ticket", entityId: ticketHistory.id || ticketHistory.ticketName },
    });
    const titleGroup = createElement("div", { className: "member-detail-app-ticket-card-title" });
    titleGroup.append(createElement("span", {
      className: `member-ticket-status status-${getTicketStatusTone(ticketHistory.status)}`,
      textContent: getTicketStatusLabel(ticketHistory.status),
    }));
    titleGroup.append(createElement("strong", { textContent: ticketHistory.ticketName }));
    card.append(titleGroup);

    const caption = createElement("p", {
      className: "member-detail-app-ticket-card-caption",
      textContent: `예약 가능: ${ticketHistory.remainingCount}회 | 유효기간: ${getTicketValidityText(ticketHistory)}`,
    });
    card.append(caption);
    card.append(createElement("span", { className: "member-detail-app-ticket-card-arrow", textContent: "›" }));
    list.append(card);
  });
  section.append(list);

  return section;
}

function createDetailInfoCard(title, options = {}) {
  const section = createElement("section", {
    className: "member-detail-card",
    dataset: { area: options.area || "detailCard" },
  });
  const header = createElement("div", { className: "member-detail-card-header" });
  header.append(createElement("h2", { textContent: title }));
  appendHeaderMemberTags(header, options.headerTags);

  if (options.actionText) {
    header.append(createElement("button", {
      className: "member-detail-card-action",
      type: "button",
      textContent: options.actionText,
      dataset: { action: options.actionName || "detailCardAction", target: options.area || title },
    }));
  }

  section.append(header);
  return section;
}

function appendHeaderMemberTags(header, tags) {
  const memberTags = sanitizeTagList(tags);
  if (memberTags.length === 0) {
    return;
  }

  const chipList = createElement("div", {
    className: "member-tag-chip-list member-detail-header-tags",
    dataset: { area: "memberTagChips", state: "list" },
  });
  renderMemberTagChips(chipList, memberTags);
  header.append(chipList);
}

function appendInlineMemberTags(parent, tags) {
  const memberTags = sanitizeTagList(tags);
  if (memberTags.length === 0) {
    return;
  }

  const chipList = createElement("div", {
    className: "member-tag-chip-list member-detail-profile-tags",
    dataset: { area: "memberTagChips", state: "list" },
  });
  renderMemberTagChips(chipList, memberTags);
  parent.append(chipList);
}

function createInfoList(items, className = "member-detail-info-list") {
  const list = createElement("div", { className, dataset: { role: "infoList" } });
  items.forEach(([label, value]) => {
    const row = createElement("div", { className: "member-detail-info-row" });
    row.append(createElement("span", { className: "member-detail-info-label", textContent: label }));
    row.append(createElement("strong", { className: "member-detail-info-value", textContent: value }));
    list.append(row);
  });
  return list;
}

function createTicketHistoryPlaceholder(className = "member-ticket-history-placeholder") {
  return createElement("p", {
    className,
    textContent: "지급한 이용권 내역이 없습니다.",
    dataset: { state: "empty" },
  });
}

function createPetDetailDraft(member) {
  return {
    id: member?.id || "",
    petName: member?.petName || member?.dogName || "",
    breed: member?.breed || "",
    birthDate: member?.birthDate || "",
    animalRegistrationNumber: member?.animalRegistrationNumber || "",
    coatColor: member?.coatColor || "",
    weight: member?.weight || "",
    gender: member?.gender || "",
    neuteredStatus: member?.neuteredStatus || "",
    memo: member?.memo || "",
  };
}

function createPetDetailModal(memberHomeState) {
  const overlay = createElement("section", {
    className: "pet-detail-modal-overlay",
    dataset: { area: "petDetailModal", modal: "petDetail", state: "open" },
  });
  const modal = createElement("div", { className: "pet-detail-modal" });
  const header = createElement("div", { className: "pet-detail-modal-header" });
  header.append(createElement("h2", { textContent: "반려견 수정" }));

  const closeButton = createHeaderIconButton({
    className: "close-button",
    icon: "close",
    ariaLabel: "반려견 수정 닫기",
    dataset: { action: "closePetDetail" },
  });
  closeButton.addEventListener("click", () => {
    memberHomeState.isPetDetailModalOpen = false;
    renderMemberHome(document.querySelector("#app"), memberHomeState);
  });
  header.append(closeButton);

  modal.append(header);
  modal.append(createPetDetailEditor(memberHomeState, "web"));
  overlay.append(modal);
  return overlay;
}

function createPetDetailBottomSheet(memberHomeState) {
  const overlay = createElement("section", {
    className: "pet-bottom-sheet-overlay",
    dataset: { area: "petDetailBottomSheet", modal: "petDetailBottomSheet", state: "open" },
  });
  const sheet = createElement("div", { className: "pet-bottom-sheet pet-detail-bottom-sheet" });
  const header = createElement("header", { className: "bottom-sheet-header" });

  const closeButton = createHeaderIconButton({
    className: "bottom-sheet-close-button close-button",
    icon: "close",
    ariaLabel: "반려견 상세 닫기",
    dataset: { action: "closePetDetail" },
  });
  closeButton.addEventListener("click", () => {
    memberHomeState.isPetDetailBottomSheetOpen = false;
    renderMemberHome(document.querySelector("#app"), memberHomeState);
  });
  header.append(closeButton);
  header.append(createElement("h2", { textContent: "반려견 상세" }));
  header.append(createElement("span", { className: "header-spacer" }));

  const body = createElement("section", { className: "bottom-sheet-body" });
  body.append(createPetDetailEditor(memberHomeState, "mobile"));

  sheet.append(header);
  sheet.append(body);
  sheet.append(createPetDetailBottomSheetActions(memberHomeState));
  overlay.append(sheet);
  return overlay;
}

function createPetDetailEditor(memberHomeState, layoutMode) {
  const wrapper = createElement("section", {
    className: layoutMode === "web" ? "pet-detail-editor is-web" : "pet-detail-editor is-mobile",
    dataset: { area: "petDetailEditor", platform: layoutMode },
  });
  const draft = memberHomeState.petDetailDraft;

  if (layoutMode === "web") {
    const columns = createElement("div", { className: "pet-detail-editor-columns" });
    columns.append(createPetDetailColumnLeft(memberHomeState, draft));
    columns.append(createPetDetailColumnRight(memberHomeState, draft));
    wrapper.append(columns);
    wrapper.append(createPetDetailWebSubmit(memberHomeState));
    return wrapper;
  }

  wrapper.append(createPetDetailColumnLeft(memberHomeState, draft, true));
  wrapper.append(createPetDetailColumnRight(memberHomeState, draft, true));
  return wrapper;
}

function createPetDetailColumnLeft(memberHomeState, draft, isMobile = false) {
  const column = createElement("div", { className: isMobile ? "pet-detail-column mobile" : "pet-detail-column" });
  column.append(createPetDetailPhotoArea());
  column.append(createPetDetailTextField(memberHomeState, "이름", "petName", "한글, 영문, 숫자 입력 가능 (12자 이내)", true, draft));
  column.append(createPetDetailSearchField(memberHomeState, "견종", "breed", "견종을 검색해 주세요.", true, draft));
  if (isMobile) {
    column.append(createPetDetailTextArea(memberHomeState, "메모", "memo", "성격, 알러지 등 필요한 내용을 입력해 주세요. (최대 500자)", draft));
  }
  column.append(createPetDetailTextField(memberHomeState, "몸무게", "weight", "0~999 사이 숫자만 입력", false, draft, { suffix: "kg" }));
  return column;
}

function createPetDetailColumnRight(memberHomeState, draft, isMobile = false) {
  const column = createElement("div", { className: isMobile ? "pet-detail-column mobile" : "pet-detail-column" });
  column.append(createPetDetailTextField(memberHomeState, "동물등록번호", "animalRegistrationNumber", "410XXXXXXXXXXXX", false, draft));
  column.append(createPetDetailTextField(memberHomeState, "모색", "coatColor", "20자 이내 입력", false, draft));
  column.append(createPetDetailBirthDateField(memberHomeState, draft));
  column.append(createPetDetailRadioGroup(memberHomeState, "성별", "gender", ["선택 안함", "남아", "여아"], draft));
  column.append(createPetDetailRadioGroup(memberHomeState, "중성화 여부", "neuteredStatus", ["선택안함", "완료", "미완료"], draft));
  return column;
}

function createPetDetailPhotoArea() {
  const area = createElement("div", { className: "pet-detail-photo-area", dataset: { area: "petProfileImage" } });
  area.append(createElement("img", { className: "pet-detail-photo-image", src: DEFAULT_DOG_PROFILE_IMAGE, alt: "반려견 프로필" }));
  const button = createElement("button", {
    className: "pet-detail-photo-button",
    type: "button",
    ariaLabel: "반려견 사진 수정",
    dataset: { action: "editPetPhoto" },
  });
  button.append(createElement("img", { className: "button-icon pet-detail-photo-icon", src: CAMERA_ICON_PATH, alt: "" }));
  area.append(button);
  return area;
}

function createPetDetailTextField(memberHomeState, labelText, fieldName, placeholder, isRequired, draft, options = {}) {
  const field = createElement("label", { className: "pet-detail-field", dataset: { field: fieldName } });
  const label = createElement("span", { className: "pet-detail-label", textContent: labelText });
  if (isRequired) {
    label.append(createElement("span", { className: "required-mark", textContent: " *" }));
  }
  const input = createElement("input", {
    className: "pet-detail-input",
    type: "text",
    value: draft[fieldName] || "",
    placeholder,
  });
  input.addEventListener("input", (event) => {
    draft[fieldName] = event.target.value;
    syncPetDetailSubmitState(memberHomeState);
  });
  field.append(label);
  field.append(input);
  if (options.suffix) {
    field.className = `${field.className} has-suffix`;
    field.append(createElement("span", { className: "pet-detail-input-suffix", textContent: options.suffix }));
  }
  return field;
}

function createPetDetailSearchField(memberHomeState, labelText, fieldName, placeholder, isRequired, draft) {
  const field = createPetDetailTextField(memberHomeState, labelText, fieldName, placeholder, isRequired, draft);
  field.dataset.search = "true";
  return field;
}

function createPetDetailTextArea(memberHomeState, labelText, fieldName, placeholder, draft) {
  const field = createElement("label", { className: "pet-detail-field is-wide", dataset: { field: fieldName } });
  field.append(createElement("span", { className: "pet-detail-label", textContent: labelText }));
  const textarea = createElement("textarea", {
    className: "pet-detail-textarea",
    value: draft[fieldName] || "",
    placeholder,
  });
  textarea.addEventListener("input", (event) => {
    draft[fieldName] = event.target.value;
    syncPetDetailSubmitState(memberHomeState);
  });
  field.append(textarea);
  return field;
}

function createPetDetailBirthDateField(memberHomeState, draft) {
  const field = createElement("fieldset", { className: "pet-detail-field", dataset: { field: "birthDate" } });
  field.append(createElement("legend", { className: "pet-detail-label", textContent: "생년월일" }));
  const row = createElement("div", { className: "pet-detail-birth-row" });
  const parts = String(draft.birthDate || "").split("-");
  ["연도", "월", "일"].forEach((placeholder, index) => {
    const input = createElement("input", {
      className: "pet-detail-birth-input",
      type: "text",
      value: parts[index] || "",
      placeholder,
    });
    input.addEventListener("input", () => {
      const dateParts = Array.from(row.querySelectorAll(".pet-detail-birth-input")).map((dateInput) => dateInput.value);
      draft.birthDate = normalizeBirthDateParts(dateParts);
      ageOutput.textContent = getAgeOutputText(draft.birthDate);
      syncPetDetailSubmitState(memberHomeState);
    });
    row.append(input);
  });
  const ageOutput = createElement("output", { className: "pet-detail-age-output", textContent: getAgeOutputText(draft.birthDate) });
  row.append(ageOutput);
  field.append(row);
  field.append(createElement("p", { className: "pet-detail-guide", textContent: "정확한 생년월일을 모르면 연도만 적어 주세요." }));
  return field;
}

function createPetDetailRadioGroup(memberHomeState, labelText, fieldName, options, draft) {
  const field = createElement("fieldset", { className: "pet-detail-field", dataset: { field: fieldName } });
  field.append(createElement("legend", { className: "pet-detail-label", textContent: labelText }));
  const row = createElement("div", { className: "pet-detail-radio-row" });
  const groupName = `pet-detail-${fieldName}`;
  options.forEach((optionText, optionIndex) => {
    const optionValue = ["선택안함", "선택 안함"].includes(optionText) ? "" : optionText;
    const isSelected = draft[fieldName] === optionValue || (!draft[fieldName] && optionIndex === 0 && optionValue === "");
    const option = createElement("label", {
      className: "pet-detail-radio-option",
      dataset: { state: isSelected ? "selected" : "idle" },
    });
    const input = createElement("input", { className: "pet-detail-radio-input", type: "radio", value: optionValue });
    input.name = groupName;
    input.checked = isSelected;
    input.addEventListener("change", () => {
      draft[fieldName] = input.value;
      row.querySelectorAll(".pet-detail-radio-option").forEach((optionElement) => {
        optionElement.dataset.state = "idle";
      });
      option.dataset.state = "selected";
      syncPetDetailSubmitState(memberHomeState);
    });
    option.append(input);
    option.append(createElement("span", { textContent: optionText }));
    row.append(option);
  });
  field.append(row);
  return field;
}

function createPetDetailWebSubmit(memberHomeState) {
  const actions = createElement("div", {
    className: canDeleteSelectedPet(memberHomeState)
      ? "pet-detail-web-actions has-delete"
      : "pet-detail-web-actions",
  });

  if (canDeleteSelectedPet(memberHomeState)) {
    const deleteButton = createElement("button", {
      className: "pet-detail-delete-button",
      type: "button",
      textContent: "반려견 삭제",
      dataset: { action: "deletePet" },
    });
    deleteButton.addEventListener("click", () => {
      deleteSelectedPet(memberHomeState);
    });
    actions.append(deleteButton);
  }

  const button = createElement("button", {
    className: "large-disabled-button pet-detail-web-submit-button",
    type: "button",
    textContent: "수정",
    dataset: { action: "submitPetDetail", state: isPetDetailDraftReady(memberHomeState.petDetailDraft) ? ACTION_BUTTON_STATE.enabled : ACTION_BUTTON_STATE.disabled },
  });
  button.disabled = !isPetDetailDraftReady(memberHomeState.petDetailDraft);
  button.addEventListener("click", () => {
    submitPetDetailDraft(memberHomeState, false);
  });
  actions.append(button);
  return actions;
}

function createPetDetailBottomSheetActions(memberHomeState) {
  const actions = createElement("div", {
    className: canDeleteSelectedPet(memberHomeState)
      ? "pet-detail-bottom-sheet-actions has-delete"
      : "pet-detail-bottom-sheet-actions",
  });

  if (canDeleteSelectedPet(memberHomeState)) {
    const deleteButton = createElement("button", {
      className: "pet-detail-delete-button",
      type: "button",
      textContent: "삭제",
      dataset: { action: "deletePet" },
    });
    deleteButton.addEventListener("click", () => {
      deleteSelectedPet(memberHomeState);
    });
    actions.append(deleteButton);
  }

  const submitButton = createElement("button", {
    className: "large-disabled-button bottom-sheet-submit-button",
    type: "button",
    textContent: "수정",
    dataset: { action: "submitPetDetail", state: isPetDetailDraftReady(memberHomeState.petDetailDraft) ? ACTION_BUTTON_STATE.enabled : ACTION_BUTTON_STATE.disabled },
  });
  submitButton.disabled = !isPetDetailDraftReady(memberHomeState.petDetailDraft);
  submitButton.addEventListener("click", () => {
    submitPetDetailDraft(memberHomeState, true);
  });

  actions.append(submitButton);
  return actions;
}

function isPetDetailDraftReady(draft) {
  return Boolean(String(draft?.petName || "").trim() && String(draft?.breed || "").trim());
}

function syncPetDetailSubmitState(memberHomeState) {
  const buttons = document.querySelectorAll("[data-action='submitPetDetail']");
  buttons.forEach((button) => {
    const isReady = isPetDetailDraftReady(memberHomeState.petDetailDraft);
    button.disabled = !isReady;
    button.dataset.state = isReady ? ACTION_BUTTON_STATE.enabled : ACTION_BUTTON_STATE.disabled;
  });
}

function submitPetDetailDraft(memberHomeState, isBottomSheet) {
  if (!isPetDetailDraftReady(memberHomeState.petDetailDraft)) {
    return;
  }

  const sourceMember = getSelectedSourceMember(memberHomeState);
  const sourcePet = getSelectedSourcePet(memberHomeState, sourceMember);
  if (!sourceMember || !sourcePet) {
    return;
  }

  applyPetDetailDraft(sourcePet, memberHomeState.petDetailDraft);
  persistSelectedSourceMember(memberHomeState, sourceMember, sourcePet.id, "정보를 수정했습니다.");
}

function applyPetDetailDraft(member, draft) {
  member.petName = draft.petName || "";
  member.dogName = draft.petName || "";
  member.breed = draft.breed || "";
  member.birthDate = draft.birthDate || "";
  member.animalRegistrationNumber = draft.animalRegistrationNumber || "";
  member.coatColor = draft.coatColor || "";
  member.weight = draft.weight || "";
  member.gender = draft.gender || "";
  member.neuteredStatus = draft.neuteredStatus || "";
  member.memo = draft.memo || "";
}

function deleteSelectedMember(memberHomeState) {
  const memberId = memberHomeState.selectedMember?.memberId || memberHomeState.selectedMember?.id || "";
  if (!memberId) {
    return;
  }

  memberHomeState.members = deleteStoredMember(memberId);
  memberHomeState.selectedMember = null;
  memberHomeState.activeScreen = "memberHome";
  memberHomeState.toastMessage = "회원을 삭제했습니다.";
  renderMemberHome(document.querySelector("#app"), memberHomeState);
}

function deleteSelectedPet(memberHomeState) {
  const sourceMember = getSelectedSourceMember(memberHomeState);
  const sourcePet = getSelectedSourcePet(memberHomeState, sourceMember);

  if (!sourceMember || !sourcePet || !canDeleteSelectedPet(memberHomeState)) {
    return;
  }

  sourceMember.pets = sourceMember.pets.filter((pet) => pet.id !== sourcePet.id);
  const nextSelectedPet = sourceMember.pets[0];
  persistSelectedSourceMember(memberHomeState, sourceMember, nextSelectedPet?.id || "", "반려견을 삭제했습니다.");
}

function persistSelectedSourceMember(memberHomeState, sourceMember, selectedPetId, toastMessage) {
  memberHomeState.members = saveStoredMembers((memberHomeState.members || []).map((member) => {
    return member.id === sourceMember.id ? sourceMember : member;
  }));
  const nextRows = getMemberPetRows(memberHomeState.members);
  memberHomeState.selectedMember = nextRows.find((member) => {
    return member.memberId === sourceMember.id && member.petId === selectedPetId;
  }) || nextRows.find((member) => member.memberId === sourceMember.id) || null;
  memberHomeState.petDetailDraft = createPetDetailDraft(memberHomeState.selectedMember);
  memberHomeState.isPetDetailModalOpen = false;
  memberHomeState.isPetDetailBottomSheetOpen = false;
  memberHomeState.toastMessage = toastMessage;
  renderMemberHome(document.querySelector("#app"), memberHomeState);
}

function canDeleteSelectedPet(memberHomeState) {
  return getSelectedSourcePets(memberHomeState).length >= 2;
}

function getSelectedSourceMember(memberHomeState) {
  const selectedMember = memberHomeState.selectedMember || {};
  const memberId = selectedMember.memberId || selectedMember.id || "";
  return (memberHomeState.members || []).find((member) => member.id === memberId) || null;
}

function getSelectedSourcePet(memberHomeState, sourceMember = getSelectedSourceMember(memberHomeState)) {
  const selectedPetId = memberHomeState.selectedMember?.petId || "";
  return getSelectedSourcePets(memberHomeState, sourceMember).find((pet) => pet.id === selectedPetId) || null;
}

function getSelectedSourcePets(memberHomeState, sourceMember = getSelectedSourceMember(memberHomeState)) {
  return Array.isArray(sourceMember?.pets) ? sourceMember.pets : [];
}

function createMemberProfileImage(className) {
  return createElement("img", {
    className,
    src: DEFAULT_DOG_PROFILE_IMAGE,
    alt: "반려견 프로필",
  });
}

function getMemberPetName(member) {
  return formatText(member.petName || member.dogName);
}

function getSiblingMembers(members, member) {
  if (!member?.phoneNumber) {
    return [];
  }

  return (members || []).filter((candidate) => {
    return candidate.id !== member.id && normalizePhoneNumber(candidate.phoneNumber) === normalizePhoneNumber(member.phoneNumber);
  });
}

function getMemberTicketHistories(member) {
  return Array.isArray(member?.ticketHistories) ? member.ticketHistories : [];
}

function getTicketStatusLabel(status) {
  const normalizedStatus = String(status || "").trim().toLowerCase();
  if (normalizedStatus === "using" || normalizedStatus === "이용 중") {
    return "이용 중";
  }
  if (normalizedStatus === "before" || normalizedStatus === "unused" || normalizedStatus === "사용 전") {
    return "사용 전";
  }
  if (normalizedStatus === "expired" || normalizedStatus === "留뚮즺") {
    return "留뚮즺";
  }
  if (normalizedStatus === "depleted" || normalizedStatus === "?잛닔 ?뚯쭊") {
    return "?잛닔 ?뚯쭊";
  }
  return formatText(status);
}

function getTicketStatusTone(status) {
  const label = getTicketStatusLabel(status);
  if (label === "이용 중") {
    return "active";
  }
  if (label === "사용 전") {
    return "ready";
  }
  return "danger";
}

function getTicketValidityText(ticketHistory) {
  if (ticketHistory.expiresAt) {
    return formatDateLabel(ticketHistory.expiresAt);
  }

  if (ticketHistory.validDays > 0) {
    return `${ticketHistory.validDays}일`;
  }

  return "-";
}

function formatDateLabel(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return formatText(value);
  }
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
}

function formatTicketAmount(amount) {
  const numericAmount = Number(amount);
  if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
    return "-";
  }
  return `${numericAmount.toLocaleString("ko-KR")}원`;
}

function resetMemberDetailViewState(memberHomeState) {
  memberHomeState.activeMemberDetailTab = "memberInfo";
  memberHomeState.isDetailInfoExpanded = false;
  memberHomeState.isDetailMemoExpanded = false;
}

function createProfileFlowHeader(memberHomeState, title) {
  const header = createElement("header", { className: "registration-page-header", dataset: { area: "header" } });
  header.append(createCloseRegistrationButton(memberHomeState, "page-close-button", "✕", `${title} 닫기`));
  header.append(createElement("h1", { textContent: title }));
  header.append(createElement("span", { className: "header-spacer" }));
  return header;
}

function createGuardianSummarySection(member) {
  const section = createElement("section", { className: "profile-flow-section", dataset: { area: "guardianInfo" } });
  section.append(createElement("h2", { textContent: "보호자 정보" }));
  section.append(createSummaryLine("보호자 이름", formatText(member.guardianName)));
  section.append(createSummaryLine("전화번호", formatText(member.phoneNumber)));
  return section;
}

function createPetSummarySection(member, screenName) {
  const section = createElement("section", { className: "profile-flow-section", dataset: { area: "petInfo" } });
  section.append(createElement("h2", { textContent: "반려견 정보" }));
  section.append(createElement("button", { className: "sub-action-button", type: "button", textContent: "반려견 추가", dataset: { action: "addPet" } }));

  if (member.petName || member.dogName) {
    const petRow = createElement("article", {
      className: "pet-summary-row",
      dataset: {
        entity: "member",
        entityId: formatText(member.id),
        state: screenName === "memberEdit" ? "editing" : "detail",
      },
    });
    petRow.append(createElement("strong", { textContent: formatText(member.petName || member.dogName) }));
    petRow.append(createElement("span", { textContent: formatText(member.breed) }));
    section.append(petRow);
  }

  return section;
}

function createSummaryLine(label, value) {
  const line = createElement("p", { className: "summary-line" });
  line.append(createElement("span", { textContent: `${label} : ` }));
  line.append(createElement("strong", { textContent: value }));
  return line;
}

function normalizeLookupText(value) {
  return String(value || "").trim();
}

function isMobileLayout() {
  return window.matchMedia && window.matchMedia("(max-width: 430px)").matches;
}

function createMemberFilterArea(memberHomeState) {
  const filterArea = createElement("section", {
    className: "member-filter-area",
    dataset: {
      area: "memberFilter",
      state: memberHomeState.isFilterPanelOpen ? "open" : "closed",
    },
  });

  if (isMobileLayout() && memberHomeState.isTagMenuOpen) {
    filterArea.append(createMobileTagBottomSheet(memberHomeState));
  }

  if (!isMobileLayout()) {
    const headerRow = createElement("div", {
      className: "member-filter-row",
      dataset: { area: "memberFilterRow" },
    });
    headerRow.append(createWebFilterToggle(memberHomeState));
    headerRow.append(createWebFilterSearchField(memberHomeState));
    filterArea.append(headerRow);

    if (memberHomeState.isFilterPanelOpen) {
      filterArea.append(createWebFilterPanel(memberHomeState));
    }
  }

  return filterArea;
}

function createWebFilterToggle(memberHomeState) {
  const button = createElement("button", {
    className: "filter-toggle-button",
    type: "button",
    dataset: {
      action: "toggleFilterPanel",
      state: memberHomeState.isFilterPanelOpen ? "open" : "closed",
    },
    childNodes: [
      createElement("span", { textContent: "필터" }),
      createFoldIcon(memberHomeState.isFilterPanelOpen),
    ],
  });

  button.addEventListener("click", () => {
    memberHomeState.isFilterPanelOpen = !memberHomeState.isFilterPanelOpen;
    memberHomeState.isTagMenuOpen = false;
    renderMemberHome(document.querySelector("#app"), memberHomeState);
  });

  return button;
}

function createWebFilterPanel(memberHomeState) {
  const panel = createElement("div", {
    className: "filter-detail-panel",
    dataset: { area: "filterDetail" },
  });

  const fields = createElement("div", {
    className: "member-filter-fields",
    dataset: { area: "memberFilterFields" },
  });
  fields.append(createWebFilterTagField(memberHomeState));
  panel.append(fields);
  panel.append(createResetFilterButton(memberHomeState));

  return panel;
}

function createWebFilterSearchField(memberHomeState) {
  return createMemberSearchField(memberHomeState, {
    fieldClassName: "filter-field filter-search-field member-search-filter-field member-search-suggestion-field",
    inputClassName: "filter-search-input member-filter-search-input",
  });
}

function createMemberSearchField(memberHomeState, options) {
  const field = createElement("div", {
    className: options.fieldClassName,
    dataset: { field: "memberSearch" },
  });
  field.append(createMemberSearchInput(memberHomeState, options.inputClassName));

  return field;
}

function createWebFilterTagField(memberHomeState) {
  const field = createElement("div", {
    className: "filter-field filter-tag-field member-tag-filter-field",
    dataset: {
      field: "memberTag",
      state: memberHomeState.isTagMenuOpen ? "open" : "closed",
    },
  });
  const tagButton = createElement("button", {
    className: "filter-select-button member-filter-select-button",
    type: "button",
    dataset: { action: "toggleMemberTagMenu" },
    childNodes: [
      createElement("span", { textContent: getSelectedTagSummary(memberHomeState) }),
      createFoldIcon(memberHomeState.isTagMenuOpen),
    ],
  });
  tagButton.addEventListener("click", () => {
    memberHomeState.isTagMenuOpen = !memberHomeState.isTagMenuOpen;
    renderMemberHome(document.querySelector("#app"), memberHomeState);
  });

  field.append(tagButton);

  if (memberHomeState.isTagMenuOpen) {
    field.append(createTagMultiSelectMenu(memberHomeState));
  }

  return field;
}

function createMobileTagFilterButton(memberHomeState) {
  const button = createElement("button", {
    className: "mobile-tag-filter-button",
    type: "button",
    textContent: getSelectedTagSummary(memberHomeState),
    dataset: {
      action: "openMemberTagBottomSheet",
      state: memberHomeState.selectedMemberTagNames.length ? "selected" : "empty",
    },
  });

  button.addEventListener("click", () => {
    memberHomeState.isTagMenuOpen = true;
    renderMemberHome(document.querySelector("#app"), memberHomeState);
  });

  return button;
}

function createMobileTagBottomSheet(memberHomeState) {
  const overlay = createElement("section", {
    className: "tag-bottom-sheet-overlay",
    dataset: { area: "memberTagBottomSheet", modal: "memberTagBottomSheet", state: "open" },
  });
  const sheet = createElement("div", { className: "tag-bottom-sheet" });
  const header = createElement("div", { className: "tag-bottom-sheet-header" });
  header.append(createTagBottomSheetResetButton(memberHomeState));
  header.append(createElement("h3", { textContent: "태그" }));

  const closeButton = createElement("button", {
    className: "text-button",
    type: "button",
    textContent: "닫기",
    dataset: { action: "closeMemberTagBottomSheet" },
  });
  closeButton.addEventListener("click", () => {
    memberHomeState.isTagMenuOpen = false;
    renderMemberHome(document.querySelector("#app"), memberHomeState);
  });
  header.append(closeButton);

  sheet.append(header);
  sheet.append(createTagBottomSheetSearchControl(memberHomeState));
  sheet.append(createTagMultiSelectMenu(memberHomeState));
  overlay.append(sheet);

  return overlay;
}

function createTagBottomSheetResetButton(memberHomeState) {
  const button = createElement("button", {
    className: "reset-filter-button",
    type: "button",
    textContent: "초기화",
    dataset: { action: "resetMemberTagSelection" },
  });
  button.addEventListener("click", () => {
    memberHomeState.selectedMemberTagNames = [];
    memberHomeState.currentPage = 1;
    renderMemberHome(document.querySelector("#app"), memberHomeState);
  });
  return button;
}

function createTagBottomSheetSearchControl(memberHomeState) {
  return createTagSearchControl(memberHomeState, {
    className: "member-tag-search-control member-tag-search-filter-control",
    inputClassName: "member-tag-search-input",
    refocusSelector: ".member-tag-search-filter-control .member-tag-search-input",
    clearMode: "selection",
  });
}

function createTagMultiSelectMenu(memberHomeState) {
  const visibleMemberTags = getVisibleMemberTags(memberHomeState);
  const menu = createElement("div", {
    className: "tag-multi-select-menu",
    dataset: {
      area: "memberTagMenu",
      state: visibleMemberTags.length ? "list" : memberHomeState.memberTagCatalog.length ? "searchEmpty" : "empty",
    },
  });

  if (!isMobileLayout()) {
    menu.append(createTagSearchControl(memberHomeState, {
      className: "member-tag-search-control tag-menu-search-control",
      inputClassName: "member-tag-search-input",
      refocusSelector: ".tag-menu-search-control .member-tag-search-input",
      clearMode: "query",
    }));
  }

  const list = createElement("div", {
    className: "member-tag-data-list",
    dataset: { area: "memberTagOptionList" },
  });

  if (memberHomeState.memberTagCatalog.length === 0) {
    list.append(createTagEmptyState("등록된 태그가 없습니다"));
    menu.append(list);
    return menu;
  }

  if (visibleMemberTags.length === 0) {
    list.append(createTagEmptyState("조건과 일치하는 결과가 없습니다"));
    menu.append(list);
    return menu;
  }

  visibleMemberTags.forEach((memberTagName) => {
    list.append(createTagOptionButton(memberHomeState, memberTagName));
  });

  menu.append(list);
  return menu;
}

function createTagSearchControl(memberHomeState, options = {}) {
  let isComposing = false;
  const wrapper = createElement("div", {
    className: "member-tag-search-stack",
    dataset: { area: "memberTagFilterSearchControl", state: memberHomeState.selectedMemberTagNames.length ? "selected" : "empty" },
  });

  if (memberHomeState.selectedMemberTagNames.length) {
    wrapper.append(createSelectedTagChipList(memberHomeState));
  }

  const control = createElement("div", {
    className: options.className || "member-tag-search-control",
    dataset: { state: "input" },
  });

  const input = createElement("input", {
    className: options.inputClassName || "member-tag-search-input",
    type: "text",
    value: memberHomeState.tagFilterQuery || "",
    placeholder: "태그 입력 또는 조회",
    dataset: { field: "memberTagSearch" },
  });
  input.addEventListener("compositionstart", () => {
    isComposing = true;
  });
  input.addEventListener("compositionend", (event) => {
    isComposing = false;
    const composingInput = event.target;
    window.setTimeout(() => {
      memberHomeState.tagFilterQuery = composingInput.value;
      renderMemberHome(document.querySelector("#app"), memberHomeState);
      focusTagSearchInput(options.refocusSelector);
    }, 0);
  });
  input.addEventListener("input", (event) => {
    memberHomeState.tagFilterQuery = event.target.value;

    if (isComposing) {
      syncMemberTagFilterDataList(memberHomeState, control);
      return;
    }

    renderMemberHome(document.querySelector("#app"), memberHomeState);

    if (!options.refocusSelector) {
      return;
    }

    focusTagSearchInput(options.refocusSelector);
  });
  control.append(input);
  wrapper.append(control);

  if (options.clearMode === "selection" || !memberHomeState.tagFilterQuery) {
    return wrapper;
  }

  const clearButton = createElement("button", {
    className: "member-tag-clear-button",
    type: "button",
    textContent: "×",
    ariaLabel: "태그 검색어 지우기",
    dataset: { action: "clearMemberTagQuery" },
  });
  clearButton.addEventListener("click", () => {
    memberHomeState.tagFilterQuery = "";
    renderMemberHome(document.querySelector("#app"), memberHomeState);
  });
  control.append(clearButton);

  return wrapper;
}

function syncMemberTagFilterDataList(memberHomeState, control) {
  const list = control
    ?.closest(".tag-multi-select-menu, .tag-bottom-sheet")
    ?.querySelector(".member-tag-data-list")
    || document.querySelector(".tag-bottom-sheet .member-tag-data-list");

  if (!list) {
    return;
  }

  populateMemberTagFilterDataList(list, memberHomeState);
}

function populateMemberTagFilterDataList(list, memberHomeState) {
  const visibleMemberTags = getVisibleMemberTags(memberHomeState);
  const hasQuery = Boolean(normalizeLookupText(memberHomeState.tagFilterQuery));

  list.innerHTML = "";
  list.dataset.state = visibleMemberTags.length ? "list" : hasQuery ? "searchEmpty" : "empty";
  list.dataset.query = normalizeLookupText(memberHomeState.tagFilterQuery);

  if (memberHomeState.memberTagCatalog.length === 0) {
    list.append(createTagEmptyState("등록된 태그가 없습니다"));
    return;
  }

  if (visibleMemberTags.length === 0) {
    list.append(createTagEmptyState("조건과 일치하는 결과가 없습니다"));
    return;
  }

  visibleMemberTags.forEach((memberTagName) => {
    list.append(createTagOptionButton(memberHomeState, memberTagName));
  });
}

function createTagEmptyState(title) {
  const emptyState = createEmptyStateElement({ title });
  emptyState.className = "empty-state member-tag-empty-state";
  return emptyState;
}

function focusTagSearchInput(selector) {
  if (!selector) {
    return;
  }

  window.setTimeout(() => {
    const nextInput = document.querySelector(selector);
    if (!nextInput) {
      return;
    }

    nextInput.focus();
    nextInput.setSelectionRange(nextInput.value.length, nextInput.value.length);
  }, 0);
}

function createSelectedTagChipList(memberHomeState) {
  const chipList = createElement("div", {
    className: "member-tag-search-selected",
    dataset: { area: "selectedMemberTags" },
  });

  memberHomeState.selectedMemberTagNames.forEach((memberTagName) => {
    const chip = createElement("span", {
      className: "member-tag-input-chip",
      dataset: { entity: "memberTag", entityId: memberTagName },
    });
    chip.append(createElement("span", { textContent: memberTagName }));
    const removeButton = createElement("button", {
      className: "member-tag-chip-remove",
      type: "button",
      textContent: "×",
      ariaLabel: `${memberTagName} 태그 삭제`,
      dataset: { action: "removeSelectedMemberTag" },
    });
    removeButton.addEventListener("click", () => {
      toggleSelectedMemberTag(memberHomeState, memberTagName);
      memberHomeState.currentPage = 1;
      renderMemberHome(document.querySelector("#app"), memberHomeState);
    });
    chip.append(removeButton);
    chipList.append(chip);
  });

  return chipList;
}

function createMemberSearchInput(memberHomeState, className) {
  let isComposing = false;
  const searchInput = createElement("input", {
    className,
    type: "search",
    value: memberHomeState.searchTerm,
    placeholder: "반려견 / 보호자 / 전화번호 검색",
    dataset: { field: "memberSearch", action: "searchMembers" },
  });
  searchInput.addEventListener("compositionstart", () => {
    isComposing = true;
  });
  searchInput.addEventListener("compositionend", (event) => {
    isComposing = false;
    window.setTimeout(() => {
      memberHomeState.searchTerm = event.target.value;
      memberHomeState.currentPage = 1;
      renderMemberHome(document.querySelector("#app"), memberHomeState);
      focusMemberSearchInput();
    }, 0);
  });
  searchInput.addEventListener("input", (event) => {
    memberHomeState.searchTerm = event.target.value;
    memberHomeState.currentPage = 1;

    if (isComposing) {
      return;
    }

    renderMemberHome(document.querySelector("#app"), memberHomeState);
    focusMemberSearchInput();
  });
  return searchInput;
}

function focusMemberSearchInput() {
  window.setTimeout(() => {
    const nextInput = document.querySelector(".member-filter-search-input, .mobile-member-search-field .search-input");
    if (!nextInput) {
      return;
    }

    nextInput.focus();
    nextInput.setSelectionRange(nextInput.value.length, nextInput.value.length);
  }, 0);
}

function createTagOptionButton(memberHomeState, memberTagName) {
  const isSelected = memberHomeState.selectedMemberTagNames.includes(memberTagName);
  const option = createElement("button", {
    className: "member-tag-option",
    type: "button",
    dataset: {
      action: "toggleMemberTagFilter",
      entity: "memberTag",
      entityId: memberTagName,
      state: isSelected ? "selected" : "idle",
    },
  });
  option.addEventListener("click", () => {
    toggleSelectedMemberTag(memberHomeState, memberTagName);
    memberHomeState.currentPage = 1;
    renderMemberHome(document.querySelector("#app"), memberHomeState);
  });
  option.append(createElement("span", { textContent: memberTagName }));

  return option;
}

function getVisibleMemberTags(memberHomeState) {
  const query = normalizeLookupText(memberHomeState.tagFilterQuery).toLowerCase();
  const selectedTagNames = new Set((memberHomeState.selectedMemberTagNames || []).map((memberTagName) => {
    return String(memberTagName || "").trim().toLowerCase();
  }));
  const memberTags = (memberHomeState.memberTagCatalog || []).filter((memberTagName) => {
    return !selectedTagNames.has(String(memberTagName || "").trim().toLowerCase());
  });

  if (!query) {
    return memberTags;
  }

  return memberTags.filter((memberTagName) => {
    return String(memberTagName || "").toLowerCase().includes(query);
  });
}

function createResetFilterButton(memberHomeState) {
  const button = createElement("button", {
    className: "reset-filter-button",
    type: "button",
    textContent: "초기화",
    dataset: { action: "resetMemberFilters" },
  });

  button.addEventListener("click", () => {
    memberHomeState.selectedMemberTagNames = [];
    memberHomeState.tagFilterQuery = "";
    memberHomeState.isTagMenuOpen = false;
    memberHomeState.currentPage = 1;
    renderMemberHome(document.querySelector("#app"), memberHomeState);
  });

  return button;
}

function toggleSelectedMemberTag(memberHomeState, memberTagName) {
  if (memberHomeState.selectedMemberTagNames.includes(memberTagName)) {
    memberHomeState.selectedMemberTagNames = memberHomeState.selectedMemberTagNames.filter((selectedTagName) => {
      return selectedTagName !== memberTagName;
    });
    return;
  }

  memberHomeState.selectedMemberTagNames = [...memberHomeState.selectedMemberTagNames, memberTagName];
}

function getSelectedTagSummary(memberHomeState) {
  if (memberHomeState.selectedMemberTagNames.length === 0) {
    return "태그";
  }

  if (memberHomeState.selectedMemberTagNames.length === 1) {
    return memberHomeState.selectedMemberTagNames[0];
  }

  return `${memberHomeState.selectedMemberTagNames[0]} +${memberHomeState.selectedMemberTagNames.length - 1}`;
}

function createFoldIcon(isOpen) {
  return createElement("img", {
    className: "fold-icon",
    src: isOpen ? MENU_FOLD_OPEN_ICON_PATH : MENU_FOLD_ICON_PATH,
    alt: "",
  });
}

function createMemberListArea(memberHomeState) {
  const filteredMembers = getFilteredMembers(memberHomeState, MEMBER_SEARCH_FIELDS);
  const listState = getMemberListState(memberHomeState, filteredMembers);
  const pagination = getMemberPagination(memberHomeState, filteredMembers);
  const listArea = createElement("section", {
    className: "member-list-area",
    dataset: { area: "memberList", state: listState },
  });

  listArea.append(createMemberListHeader());

  if (listState !== "list") {
    listArea.append(createMemberEmptyState(listState));
    return listArea;
  }

  const visibleMembers = isMobileLayout() ? filteredMembers : pagination.items;
  visibleMembers.forEach((member) => {
    listArea.append(createMemberRow(memberHomeState, member));
  });

  if (!isMobileLayout()) {
    listArea.append(createMemberPaginationControls(memberHomeState, pagination));
  }

  return listArea;
}

function getMemberPagination(memberHomeState, filteredMembers) {
  const pageSize = Number(memberHomeState.pageSize) || 10;
  const totalPages = Math.max(1, Math.ceil(filteredMembers.length / pageSize));
  const currentPage = Math.min(Math.max(Number(memberHomeState.currentPage) || 1, 1), totalPages);

  if (currentPage !== memberHomeState.currentPage) {
    memberHomeState.currentPage = currentPage;
  }

  const startIndex = (currentPage - 1) * pageSize;

  return {
    currentPage,
    totalPages,
    pageSize,
    totalCount: filteredMembers.length,
    items: filteredMembers.slice(startIndex, startIndex + pageSize),
  };
}

function createMemberPaginationControls(memberHomeState, pagination) {
  const controls = createElement("nav", {
    className: "member-pagination",
    dataset: {
      area: "memberPagination",
      state: pagination.totalPages > 1 ? "active" : "single",
    },
  });

  controls.append(createMemberPageMoveButton(memberHomeState, "prev", pagination));

  for (let pageNumber = 1; pageNumber <= pagination.totalPages; pageNumber += 1) {
    const button = createElement("button", {
      className: pageNumber === pagination.currentPage ? "member-page-button is-selected" : "member-page-button",
      type: "button",
      textContent: String(pageNumber),
      ariaLabel: `${pageNumber}페이지`,
      dataset: {
        action: "goToMemberPage",
        page: String(pageNumber),
        state: pageNumber === pagination.currentPage ? "selected" : "idle",
      },
    });
    button.addEventListener("click", () => {
      memberHomeState.currentPage = pageNumber;
      renderMemberHome(document.querySelector("#app"), memberHomeState);
    });
    controls.append(button);
  }

  controls.append(createMemberPageMoveButton(memberHomeState, "next", pagination));
  return controls;
}

function createMemberPageMoveButton(memberHomeState, direction, pagination) {
  const isPrev = direction === "prev";
  const disabled = isPrev ? pagination.currentPage <= 1 : pagination.currentPage >= pagination.totalPages;
  const button = createElement("button", {
    className: "member-page-button member-page-move-button",
    type: "button",
    ariaLabel: isPrev ? "이전 페이지" : "다음 페이지",
    dataset: {
      action: isPrev ? "prevMemberPage" : "nextMemberPage",
      state: disabled ? "disabled" : "idle",
    },
  });
  button.append(createElement("img", {
    className: "member-page-move-icon",
    src: isPrev ? CHEVRON_LEFT_ICON_PATH : CHEVRON_RIGHT_ICON_PATH,
    alt: "",
  }));
  button.disabled = disabled;
  button.addEventListener("click", () => {
    if (disabled) {
      return;
    }

    memberHomeState.currentPage = isPrev ? pagination.currentPage - 1 : pagination.currentPage + 1;
    renderMemberHome(document.querySelector("#app"), memberHomeState);
  });
  return button;
}

function createMemberListHeader() {
  const header = createElement("div", {
    className: "member-list-header",
    dataset: { role: "memberListHeader" },
  });

  ["반려견", "보호자", "전화번호", "예약 가능", "이용권 지급"].forEach((headerText) => {
    header.append(createElement("span", { textContent: headerText }));
  });

  return header;
}

function createMemberRow(memberHomeState, member) {
  const row = createElement("article", {
    className: "member-row",
    dataset: {
      entity: "member",
      entityId: formatText(member.id),
      petId: formatText(member.petId),
    },
  });

  row.append(createMemberIdentity(member));
  row.append(createElement("span", { className: "member-cell guardian-cell", textContent: formatText(member.guardianName) }));
  row.append(createElement("span", { className: "member-cell phone-cell", textContent: formatText(formatPhoneNumber(member.phoneNumber)) }));
  row.append(createReservationAvailabilityCell(member));
  row.append(createTicketIssueCell(member));
  row.append(createMemberRowMoreButton(memberHomeState, member));

  row.addEventListener("click", () => {
    openMemberDetail(memberHomeState, member);
  });

  return row;
}

function createMemberRowMoreButton(memberHomeState, member) {
  const button = createElement("button", {
    className: "row-more-button",
    type: "button",
    ariaLabel: `${formatText(member.petName)} 보기`,
    dataset: {
      action: "openMemberMoreMenu",
      entity: "member",
      entityId: formatText(member.id),
      petId: formatText(member.petId),
    },
    childNodes: [
      createElement("img", { className: "row-more-icon", src: CHEVRON_RIGHT_ICON_PATH, alt: "" }),
    ],
  });

  button.addEventListener("click", (event) => {
    event.stopPropagation();
    openMemberDetail(memberHomeState, member);
  });

  return button;
}

function createMemberIdentity(member) {
  const identity = createElement("span", { className: "member-identity member-cell" });

  const title = createElement("strong", { textContent: `${formatText(member.petName)} (${formatText(member.breed)})` });
  identity.append(title);

  return identity;
}

function createReservationAvailabilityCell(member) {
  const availability = getReservationAvailability(member);
  return createElement("span", {
    className: availability.state === "warning" ? "member-cell reservation-cell is-warning" : "member-cell reservation-cell",
    textContent: availability.text,
    dataset: { state: availability.state, area: "reservationAvailability" },
  });
}

function createTicketIssueCell(member) {
  const cell = createElement("span", { className: "member-cell ticket-issue-cell" });
  const button = createElement("button", {
    className: "secondary-button ticket-issue-button",
    type: "button",
    textContent: "지급",
    dataset: { action: "issueTicket", entityId: formatText(member.id), petId: formatText(member.petId) },
  });
  button.addEventListener("click", (event) => {
    event.stopPropagation();
  });
  cell.append(button);
  return cell;
}

function getReservationAvailability(member) {
  const reservableCount = getTotalCount(member.totalReservableCountByType);
  const reservedCount = getTotalCount(member.totalReservedCountByType);
  const remainingCount = getTotalCount(member.remainingCountByType);
  const excessCount = Math.max(reservedCount - reservableCount, 0);
  const availableCount = Math.max(remainingCount || reservableCount - reservedCount, 0);

  if (excessCount > 0) {
    return {
      state: "warning",
      text: `초과 ${excessCount}회`,
    };
  }

  return {
    state: availableCount <= 2 ? "warning" : "normal",
    text: `${availableCount}회`,
  };
}

function getTotalCount(countMap = {}) {
  return Object.values(countMap).reduce((total, value) => {
    const count = Number(value);
    return total + (Number.isFinite(count) ? count : 0);
  }, 0);
}

function openMemberDetail(memberHomeState, member) {
  window.location.href = createMemberDetailUrl(member);
}

function createMemberEmptyState(listState) {
  return createEmptyStateElement({
    title: listState === "searchEmpty" ? "조건과 일치하는 결과가 없습니다." : "",
    description: listState === "searchEmpty" ? "" : "등록된 회원이 없습니다",
  });
}

function createMemberTagManagementModal(memberHomeState) {
  const overlay = createElement("section", {
    className: "member-tag-management-overlay",
    dataset: { area: "memberTagManagement", modal: "memberTagManagement", state: "open" },
  });
  const modal = createElement("div", { className: "member-tag-management-modal" });
  const header = createElement("div", { className: "member-tag-management-header" });
  header.append(createElement("h2", { textContent: "태그 관리" }));

  const closeButton = createHeaderIconButton({
    className: "modal-close-button close-button",
    icon: "close",
    ariaLabel: "태그 관리 닫기",
    dataset: { action: "closeMemberTagManagement" },
  });
  closeButton.addEventListener("click", () => {
    memberHomeState.isMemberTagManagementOpen = false;
    memberHomeState.memberTagManagementQuery = "";
    memberHomeState.openMemberTagMenuTagName = "";
    memberHomeState.activeMemberTagSheetTagName = "";
    memberHomeState.memberTagSheetDraftName = "";
    renderMemberHome(document.querySelector("#app"), memberHomeState);
  });
  header.append(closeButton);
  modal.append(header);
  modal.append(createMemberTagManagementSearch(memberHomeState));
  modal.append(createMemberTagManagementList(memberHomeState));
  overlay.append(modal);

  if (memberHomeState.activeMemberTagSheetTagName) {
    overlay.append(createMemberTagEditBottomSheet(memberHomeState));
  }

  return overlay;
}

function createMemberTagManagementSearch(memberHomeState) {
  let isComposing = false;
  const field = createElement("label", {
    className: "member-tag-management-search",
    dataset: { field: "memberTagManagementSearch" },
  });
  const input = createElement("input", {
    className: "member-tag-management-search-input",
    type: "search",
    value: memberHomeState.memberTagManagementQuery || "",
    placeholder: "태그 입력 또는 조회",
    dataset: { field: "memberTagSearch" },
  });
  input.addEventListener("compositionstart", () => {
    isComposing = true;
  });
  input.addEventListener("compositionend", (event) => {
    isComposing = false;
    window.setTimeout(() => {
      memberHomeState.memberTagManagementQuery = event.target.value;
      memberHomeState.openMemberTagMenuTagName = "";
      renderMemberHome(document.querySelector("#app"), memberHomeState);
      focusMemberTagManagementSearch();
    }, 0);
  });
  input.addEventListener("input", (event) => {
    memberHomeState.memberTagManagementQuery = event.target.value;
    memberHomeState.openMemberTagMenuTagName = "";

    if (isComposing) {
      syncMemberTagManagementList(memberHomeState);
      return;
    }

    renderMemberHome(document.querySelector("#app"), memberHomeState);
    focusMemberTagManagementSearch();
  });
  field.append(input);
  return field;
}

function syncMemberTagManagementList(memberHomeState) {
  const list = document.querySelector("[data-area='memberTagManagementList']");
  if (!list) {
    return;
  }

  list.replaceWith(createMemberTagManagementList(memberHomeState));
}

function focusMemberTagManagementSearch() {
  window.setTimeout(() => {
    const input = document.querySelector(".member-tag-management-search-input");
    if (!input) {
      return;
    }

    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
  }, 0);
}

function createMemberTagManagementList(memberHomeState) {
  const visibleMemberTags = getVisibleManagedMemberTags(memberHomeState);
  const hasQuery = Boolean(normalizeLookupText(memberHomeState.memberTagManagementQuery));
  const creatableTagName = getCreatableMemberTagName(memberHomeState);
  const canCreateTag = Boolean(creatableTagName);
  const list = createElement("div", {
    className: "member-tag-management-list",
    dataset: {
      area: "memberTagManagementList",
      state: visibleMemberTags.length || canCreateTag ? "list" : hasQuery ? "searchEmpty" : "empty",
    },
  });

  if (!memberHomeState.memberTagCatalog.length && !canCreateTag) {
    list.append(createElement("p", { className: "empty-inline", textContent: "등록된 태그가 없습니다" }));
    return list;
  }

  if (canCreateTag) {
    list.append(createMemberTagCreateRow(memberHomeState, creatableTagName));
  }

  if (!visibleMemberTags.length && !canCreateTag) {
    list.append(createElement("p", { className: "empty-inline", textContent: "조건과 일치하는 결과가 없습니다" }));
    return list;
  }

  visibleMemberTags.forEach((memberTagName) => {
    list.append(createMemberTagManagementRow(memberHomeState, memberTagName));
  });

  return list;
}

function createMemberTagCreateRow(memberHomeState, memberTagName) {
  const row = createElement("button", {
    className: "member-tag-management-row member-tag-management-create-row",
    type: "button",
    textContent: `"${memberTagName}" 추가`,
    dataset: { action: "createMemberTagDraft", entity: "memberTag", entityId: memberTagName },
  });
  row.addEventListener("click", () => {
    applyMemberHomeTagMutation(memberHomeState, createMemberTag(memberTagName), {
      clearQuery: true,
      closeMenu: true,
    });
  });
  return row;
}

function createMemberTagManagementRow(memberHomeState, memberTagName) {
  const row = createElement("div", {
    className: "member-tag-management-row",
    dataset: { entity: "memberTag", entityId: memberTagName, state: "idle" },
  });

  if (isMobileLayout()) {
    row.append(createElement("span", { className: "member-tag-management-name", textContent: memberTagName }));
    row.append(createMemberTagMoreButton(memberHomeState, memberTagName, { presentation: "sheet" }));
    return row;
  }

  const input = createElement("input", {
    className: "member-tag-management-input",
    type: "text",
    value: memberTagName,
    placeholder: "태그명",
    dataset: { field: "memberTag" },
  });
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      commitMemberHomeTagRename(memberHomeState, memberTagName, event.target.value);
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      event.target.value = memberTagName;
      event.target.blur();
    }
  });
  input.addEventListener("blur", (event) => {
    commitMemberHomeTagRename(memberHomeState, memberTagName, event.target.value);
  });
  row.append(input);
  row.append(createMemberTagMoreButton(memberHomeState, memberTagName, { presentation: "menu" }));

  if (memberHomeState.openMemberTagMenuTagName === memberTagName) {
    row.append(createMemberTagOptionMenu(memberHomeState, memberTagName));
  }

  return row;
}

function createMemberTagMoreButton(memberHomeState, memberTagName, options) {
  const button = createElement("button", {
    className: "member-tag-more-button",
    type: "button",
    textContent: "...",
    ariaLabel: `${memberTagName} 태그 더보기`,
    dataset: { action: "openMemberTagOptions", entityId: memberTagName },
  });
  button.addEventListener("click", () => {
    if (options.presentation === "sheet") {
      memberHomeState.activeMemberTagSheetTagName = memberTagName;
      memberHomeState.memberTagSheetDraftName = memberTagName;
      renderMemberHome(document.querySelector("#app"), memberHomeState);
      focusMemberHomeTagSheetInput();
      return;
    }

    memberHomeState.openMemberTagMenuTagName = memberHomeState.openMemberTagMenuTagName === memberTagName ? "" : memberTagName;
    renderMemberHome(document.querySelector("#app"), memberHomeState);
  });
  return button;
}

function createMemberTagOptionMenu(memberHomeState, memberTagName) {
  const menu = createElement("div", {
    className: "member-tag-option-menu",
    dataset: { area: "memberTagOptionMenu", state: "open" },
  });
  const deleteButton = createElement("button", {
    className: "member-tag-option-button",
    type: "button",
    textContent: "삭제",
    dataset: { action: "deleteMemberTag", entityId: memberTagName },
  });
  deleteButton.addEventListener("click", () => {
    applyMemberHomeTagMutation(memberHomeState, deleteMemberTag(memberTagName), {
      closeMenu: true,
      deletedTag: memberTagName,
    });
  });
  menu.append(deleteButton);
  return menu;
}

function createMemberTagEditBottomSheet(memberHomeState) {
  const sourceTag = memberHomeState.activeMemberTagSheetTagName;
  const overlay = createElement("section", {
    className: "member-tag-edit-sheet-overlay",
    dataset: { area: "memberTagEditBottomSheet", modal: "memberTagEditBottomSheet", state: "open" },
  });
  overlay.addEventListener("click", (event) => {
    if (event.target !== overlay) {
      return;
    }

    closeMemberHomeTagEditSheet(memberHomeState);
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
    value: memberHomeState.memberTagSheetDraftName || sourceTag,
    placeholder: "태그명",
    dataset: { field: "memberTag" },
  });
  doneButton.addEventListener("click", () => {
    commitMemberHomeTagRename(memberHomeState, sourceTag, input.value, { closeSheet: true });
  });
  sheet.append(input);

  const deleteButton = createElement("button", {
    className: "member-tag-edit-delete-button",
    type: "button",
    textContent: "삭제",
    dataset: { action: "deleteMemberTag", entityId: sourceTag },
  });
  deleteButton.addEventListener("click", () => {
    applyMemberHomeTagMutation(memberHomeState, deleteMemberTag(sourceTag), {
      closeSheet: true,
      deletedTag: sourceTag,
    });
  });
  sheet.append(deleteButton);
  overlay.append(sheet);
  return overlay;
}

function closeMemberHomeTagEditSheet(memberHomeState) {
  memberHomeState.activeMemberTagSheetTagName = "";
  memberHomeState.memberTagSheetDraftName = "";
  renderMemberHome(document.querySelector("#app"), memberHomeState);
}

function focusMemberHomeTagSheetInput() {
  window.setTimeout(() => {
    const input = document.querySelector(".member-tag-edit-input");
    if (!input) {
      return;
    }

    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
  }, 0);
}

function commitMemberHomeTagRename(memberHomeState, sourceTag, nextTagName, options = {}) {
  const trimmedTagName = String(nextTagName || "").trim().replace(/\s+/g, " ");
  if (!trimmedTagName) {
    if (options.closeSheet) {
      closeMemberHomeTagEditSheet(memberHomeState);
      return;
    }

    renderMemberHome(document.querySelector("#app"), memberHomeState);
    return;
  }

  applyMemberHomeTagMutation(memberHomeState, renameMemberTag(sourceTag, trimmedTagName), {
    ...options,
    renamedFrom: sourceTag,
    renamedTo: trimmedTagName,
  });
}

function applyMemberHomeTagMutation(memberHomeState, result, options = {}) {
  if (!result.ok) {
    memberHomeState.toastMessage = result.reason === "duplicate"
      ? MEMBER_TAG_DUPLICATE_MESSAGE
      : result.reason === "maxCatalog"
        ? MEMBER_TAG_MAX_CATALOG_MESSAGE
        : "";
    renderMemberHome(document.querySelector("#app"), memberHomeState);
    return;
  }

  memberHomeState.members = result.members;
  memberHomeState.memberTagCatalog = result.memberTagCatalog;

  if (options.renamedFrom) {
    memberHomeState.selectedMemberTagNames = sanitizeTagList(memberHomeState.selectedMemberTagNames.map((selectedTagName) => {
      return normalizeMemberTagName(selectedTagName) === normalizeMemberTagName(options.renamedFrom)
        ? options.renamedTo
        : selectedTagName;
    }));
  }

  if (options.deletedTag) {
    memberHomeState.selectedMemberTagNames = sanitizeTagList(memberHomeState.selectedMemberTagNames.filter((selectedTagName) => {
      return normalizeMemberTagName(selectedTagName) !== normalizeMemberTagName(options.deletedTag);
    }));
  }

  if (options.clearQuery) {
    memberHomeState.memberTagManagementQuery = "";
  }

  if (options.closeMenu) {
    memberHomeState.openMemberTagMenuTagName = "";
  }

  if (options.closeSheet) {
    memberHomeState.activeMemberTagSheetTagName = "";
    memberHomeState.memberTagSheetDraftName = "";
  }

  renderMemberHome(document.querySelector("#app"), memberHomeState);
}

function getCreatableMemberTagName(memberHomeState) {
  const tagName = String(memberHomeState.memberTagManagementQuery || "").trim().replace(/\s+/g, " ");
  const normalizedTagName = normalizeMemberTagName(tagName);

  if (!normalizedTagName) {
    return "";
  }

  const isExistingTag = (memberHomeState.memberTagCatalog || []).some((memberTagName) => {
    return normalizeMemberTagName(memberTagName) === normalizedTagName;
  });

  return isExistingTag ? "" : tagName;
}

function getVisibleManagedMemberTags(memberHomeState) {
  const query = normalizeMemberTagName(memberHomeState.memberTagManagementQuery);
  const memberTags = sortMemberTagNames(memberHomeState.memberTagCatalog || []);

  if (!query) {
    return memberTags;
  }

  return memberTags.filter((memberTagName) => {
    return normalizeMemberTagName(memberTagName).includes(query);
  });
}
