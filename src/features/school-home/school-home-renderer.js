import { createEmptyStateElement } from "../../shared/components/empty-state.js";
import { createBusinessNavigation, createDefaultAppBottomNavigation } from "../../shared/components/navigation.js";
import { createReservationSearchFilter } from "../../shared/components/reservation-search-filter.js";
import { getSchoolHomeInitialView } from "../../shared/storage/school-home-storage.js";
import { createElement } from "../../shared/utils/dom.js";
import {
  getCalendarMatrix,
  getMonthLabel,
  getFilteredReservationsByDate,
  getSelectedDateSummary,
  isSchoolCapacityClosed,
  shiftMonth,
} from "./school-home-state.js";

const DEFAULT_PROFILE_IMAGE = "../assets/defaultProfile_dog.svg";
const DAYCARE_ICON_PATH = "../assets/menuIcon_daycare_on.svg";
const SETTING_ICON_PATH = "../assets/menuIcon_setting.svg";
const ALARM_ICON_PATH = "../assets/iconTime.svg";
const PROFILE_ICON_PATH = "../assets/menuIcon_profile.svg";
const SEARCH_ICON_PATH = "../assets/searchIcon.svg";
const CHEVRON_LEFT_ICON_PATH = "../assets/iconChevronLeft.svg";
const CHEVRON_RIGHT_ICON_PATH = "../assets/iconChevronRight.svg";
const DAYOFF_ICON_PATH = "../assets/iconDayoff.svg";
const CALENDAR_ICON_PATH = "../assets/iconCalendar.svg";
const HEADER_ICON_ACTIONS = {
  설정: "openSettings",
  알림: "openNotifications",
  계정: "openProfile",
  검색: "openSearch",
};

export function renderSchoolHome(rootElement, schoolHomeState) {
  rootElement.innerHTML = "";
  rootElement.append(createSchoolHomeScreen(schoolHomeState));
}

function rerender(schoolHomeState) {
  renderSchoolHome(document.querySelector("#app"), schoolHomeState);
}

function createSchoolHomeScreen(schoolHomeState) {
  const screen = createElement("main", {
    className: "school-home-screen",
    dataset: { screen: "schoolHome" },
  });
  screen.append(createSchoolHomeWebShell(schoolHomeState));
  screen.append(schoolHomeState.isReservationSearchScreenOpen
    ? createReservationSearchAppScreen(schoolHomeState)
    : createSchoolHomeAppShell(schoolHomeState));
  return screen;
}

function createSchoolHomeWebShell(schoolHomeState) {
  const shell = createElement("section", {
    className: "school-home-web-shell",
    dataset: { area: "schoolHomeWeb" },
  });
  shell.append(createWebHeader());

  const content = createElement("div", { className: "school-home-web-layout" });
  content.append(createSchoolNavigation("web"));
  content.append(createSchoolWebContent(schoolHomeState));
  shell.append(content);
  return shell;
}

function createWebHeader() {
  const header = createElement("header", {
    className: "header",
    dataset: { area: "header" },
  });

  header.append(createElement("strong", { className: "brand-name", textContent: "다이얼독 비즈" }));
  header.append(createElement("h1", { textContent: "유치원" }));
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

function createHeaderIconButton(iconPath, label) {
  const button = createElement("button", {
    className: "icon-button header-icon-button",
    type: "button",
    ariaLabel: label,
    dataset: { action: HEADER_ICON_ACTIONS[label] || "openHeaderAction" },
  });
  button.append(createElement("img", { className: "button-icon", src: iconPath, alt: "" }));
  return button;
}

function createSchoolNavigation(platform) {
  return createBusinessNavigation({
    className: platform === "web" ? "business-navigation school-navigation web" : "school-navigation app",
    dataset: { area: "navigation", platform },
    profile: {
      imageSrc: DEFAULT_PROFILE_IMAGE,
      title: "다이얼독",
      subtitle: "애견유치원",
    },
    footerText: "개인정보 처리방침  이용약관  문의",
    items: [
      { label: "대시보드", href: "./index.html" },
      { label: "유치원", selected: true, href: "./index.html" },
      { label: "호텔링", href: "./hotel-home.html" },
      { label: "알림장" },
      { label: "회원", href: "./member-home.html" },
      { label: "이용권" }
    ]
  });
}
function createSchoolWebContent(schoolHomeState) {
  const content = createElement("section", {
    className: "content",
    dataset: { area: "content", feature: "schoolHome", platform: "web" },
  });
  const titleBar = createElement("div", { className: "school-web-title-bar" });
  const titleGroup = createElement("div", { className: "school-web-title-group" });
  titleGroup.append(createElement("h1", { textContent: "유치원" }));
  titleGroup.append(createElement("button", {
    className: "secondary-button school-capacity-button",
    type: "button",
    textContent: `정원 ${getSchoolCapacityCount(schoolHomeState)}`,
  }));
  titleBar.append(titleGroup);

  const actions = createElement("div", { className: "school-web-title-actions" });
  actions.append(createElement("button", {
    className: "primary-button school-register-button",
    type: "button",
    textContent: "예약 등록",
  }));
  titleBar.append(actions);

  const sectionGroup = createElement("div", { className: "web-sections", dataset: { area: "webSections", feature: "schoolHome" } });
  sectionGroup.append(createSchoolCalendarPanel(schoolHomeState, "web"));
  sectionGroup.append(createSchoolReservationPanel(schoolHomeState, "web"));

  content.append(titleBar);
  content.append(sectionGroup);
  return content;
}

function createSchoolCalendarPanel(schoolHomeState, platform) {
  const panel = createElement("section", {
    className: "calendar-panel",
    dataset: { area: "calendarPanel", feature: "schoolHome", platform },
  });
  panel.append(createCalendarHeader(schoolHomeState, platform));
  panel.append(createCalendarGrid(schoolHomeState, platform));
  return panel;
}

function createCalendarHeader(schoolHomeState, platform) {
  const header = createElement("div", {
    className: "calendar-header",
    dataset: { area: "calendarHeader", feature: "schoolHome", platform },
  });

  if (platform === "web") {
    const left = createElement("div", { className: "calendar-controls" });
    left.append(createMonthMoveButton("prev", schoolHomeState, "이전 달"));
    left.append(createElement("strong", { className: "calendar-month-label", textContent: getMonthLabel(schoolHomeState.currentMonth) }));
    left.append(createMonthMoveButton("next", schoolHomeState, "다음 달"));

    const todayButton = createElement("button", {
      className: "calendar-today-button",
      type: "button",
      textContent: "오늘",
    });
    todayButton.addEventListener("click", () => {
      resetToInitialView(schoolHomeState);
    });
    left.append(todayButton);
    header.append(left);

    header.append(createReservationSearchFilter(schoolHomeState, {
      className: "reservation-search-filter calendar-search-filter",
      searchInputClassName: "filter-search-input reservation-search-input calendar-search-input",
      rerender,
      onSearchInput: (state) => {
        rerender(state);
      },
    }));
    return header;
  }

  const controls = createElement("div", { className: "calendar-controls", dataset: { platform: "app" } });
  controls.append(createMonthMoveButton("prev", schoolHomeState, "이전 달"));
  controls.append(createElement("strong", { className: "calendar-month-label", textContent: getMonthLabel(schoolHomeState.currentMonth) }));
  controls.append(createMonthMoveButton("next", schoolHomeState, "다음 달"));
  header.append(controls);
  return header;
}

function createAppHeader(schoolHomeState) {
  const header = createElement("header", {
    className: "school-app-header",
    dataset: { area: "header", platform: "app" },
  });

  const searchButton = createHeaderIconButton(SEARCH_ICON_PATH, "검색");
  searchButton.addEventListener("click", () => {
    schoolHomeState.isReservationSearchScreenOpen = true;
    schoolHomeState.isReservationSearchMenuOpen = false;
    rerender(schoolHomeState);
  });
  const appHeaderRow = createElement("div", { className: "school-app-header-row" });
  const left = createElement("div", { className: "school-app-nav-left" });
  const iconBox = createElement("div", { className: "school-app-nav-icon-box" });
  iconBox.append(createElement("img", { src: DAYCARE_ICON_PATH, alt: "" }));
  left.append(iconBox);
  const title = createElement("div", { className: "school-app-nav-title" });
  const titleRow = createElement("button", {
    className: "school-app-header-title-row",
    type: "button",
    ariaLabel: "모드 전환",
  });
  titleRow.append(createElement("strong", { textContent: "유치원" }));
  titleRow.append(createElement("img", { src: "../assets/iconDropdown.svg", alt: "" }));
  titleRow.addEventListener("click", () => {
    schoolHomeState.isModeMenuOpen = !schoolHomeState.isModeMenuOpen;
    rerender(schoolHomeState);
  });
  title.append(titleRow);
  title.append(createElement("span", { textContent: `정원 ${getSchoolCapacityCount(schoolHomeState)}` }));
  if (schoolHomeState.isModeMenuOpen) {
    title.append(createAppModeMenu([
      { label: "유치원", href: "./index.html", selected: true },
      { label: "호텔", href: "./hotel-home.html" },
    ]));
  }
  left.append(title);

  const utility = createElement("div", { className: "school-app-nav-actions" });
  utility.append(createElement("button", {
    className: "secondary-button school-app-register-button",
    type: "button",
    textContent: "예약 등록",
  }));
  utility.append(searchButton);

  appHeaderRow.append(left);
  appHeaderRow.append(utility);
  header.append(appHeaderRow);
  return header;
}

function createMonthMoveButton(direction, schoolHomeState, label) {
  const button = createElement("button", {
    className: "month-move-button",
    type: "button",
    ariaLabel: label,
    dataset: { action: "moveMonth", direction },
  });
  button.append(createElement("img", {
    className: "button-icon month-move-icon",
    src: direction === "prev" ? CHEVRON_LEFT_ICON_PATH : CHEVRON_RIGHT_ICON_PATH,
    alt: "",
  }));
  button.addEventListener("click", () => {
    const nextMonth = shiftMonth(schoolHomeState.currentMonth, direction === "prev" ? -1 : 1);
    schoolHomeState.currentMonth = nextMonth;
    schoolHomeState.selectedDate = `${nextMonth}-01`;
    schoolHomeState.selectedReservationIds = [];
    rerender(schoolHomeState);
  });
  return button;
}

function createCalendarGrid(schoolHomeState, platform) {
  const matrix = getCalendarMatrix(schoolHomeState.currentMonth);
  const grid = createElement("section", {
    className: "calendar-grid",
    dataset: { area: "calendarGrid", feature: "schoolHome", platform },
  });

  const weekHeader = createElement("div", { className: "calendar-weekdays" });
  ["일", "월", "화", "수", "목", "금", "토"].forEach((dayLabel, dayIndex) => {
    weekHeader.append(createElement("span", {
      className: dayIndex === 0 ? "calendar-weekday is-holiday" : "calendar-weekday",
      textContent: dayLabel,
    }));
  });
  grid.append(weekHeader);

  const body = createElement("div", { className: "calendar-body" });
  matrix.forEach((week) => {
    const row = createElement("div", { className: "calendar-row" });
    week.forEach((cell) => {
      row.append(createCalendarDateButton(schoolHomeState, cell, platform));
    });
    body.append(row);
  });
  grid.append(body);
  return grid;
}

function createCalendarDateButton(schoolHomeState, cell, platform) {
  const reservationCount = getFilteredReservationsByDate(schoolHomeState, cell.dateKey).length;
  const isSelected = cell.dateKey === schoolHomeState.selectedDate;
  const hasReservations = reservationCount > 0;
  const isCapacityClosed = isSchoolCapacityClosed(schoolHomeState, cell.dateKey);
  const classNames = [
    "calendar-date",
    cell.isCurrentMonth ? "" : "is-muted",
    cell.isToday ? "is-today" : "",
    isSelected ? "is-selected" : "",
    cell.isHoliday ? "is-holiday" : "",
    isCapacityClosed ? "is-capacity-closed" : "",
  ].filter(Boolean).join(" ");
  const button = createElement("button", {
    className: classNames,
    type: "button",
    dataset: {
      action: "selectSchoolDate",
      entityId: cell.dateKey,
      state: getCalendarDateState({ isSelected, isHoliday: cell.isHoliday, hasReservations, isCapacityClosed }),
    },
  });

  if (platform === "web") {
    button.append(...createWebCalendarDateContent(cell.dayNumber, reservationCount, cell.isHoliday, isCapacityClosed));
  } else {
    button.append(...createAppCalendarDateContent(cell.dayNumber, reservationCount, getSchoolCapacityCount(schoolHomeState)));
  }

  button.addEventListener("click", () => {
    schoolHomeState.currentMonth = `${cell.dateKey.slice(0, 7)}`;
    schoolHomeState.selectedDate = cell.dateKey;
    schoolHomeState.selectedReservationIds = [];
    rerender(schoolHomeState);
  });

  return button;
}

function createWebCalendarDateContent(dayNumber, reservationCount, isHoliday, isCapacityClosed) {
  const content = [];
  const dateBox = createElement("span", { className: "calendar-date-box" });
  dateBox.append(createElement("span", { className: "calendar-date-number", textContent: String(dayNumber) }));
  content.push(dateBox);

  if (isCapacityClosed) {
    content.push(createCalendarBadge("마감", "calendar-badge is-closed"));
  }

  if (isHoliday && reservationCount > 0) {
    content.push(createElement("span", {
      className: "calendar-meta",
      textContent: `휴무 (예약 ${reservationCount}건)`,
    }));
    return content;
  }

  if (reservationCount > 0) {
    content.push(createElement("span", {
      className: "calendar-meta",
      textContent: `예약 ${reservationCount}`,
    }));
  }

  return content;
}

function createAppCalendarDateContent(dayNumber, reservationCount, capacityCount) {
  const content = [];
  const dateBox = createElement("span", { className: "calendar-date-box", dataset: { platform: "app" } });
  dateBox.append(createElement("span", { className: "calendar-date-number", textContent: String(dayNumber) }));
  content.push(dateBox);
  content.push(createElement("span", {
    className: "calendar-capacity-text",
    textContent: `${reservationCount}/${capacityCount}`,
  }));
  return content;
}

function createCalendarBadge(label, className) {
  return createElement("span", {
    className,
    textContent: label,
    dataset: { state: "capacityClosed" },
  });
}

function getCalendarDateState({ isSelected, isHoliday, hasReservations, isCapacityClosed }) {
  if (isSelected) {
    return "selected";
  }

  if (isHoliday && hasReservations) {
    return "holidayReserved";
  }

  if (isCapacityClosed && hasReservations) {
    return "capacityClosed";
  }

  if (hasReservations) {
    return "reserved";
  }

  if (isHoliday) {
    return "holiday";
  }

  return "idle";
}

function createSchoolReservationPanel(schoolHomeState, platform) {
  const summary = getSelectedDateSummary(schoolHomeState);
  const panel = createElement("section", {
    className: platform === "web" ? "school-reservation-panel web" : "school-reservation-panel app",
    dataset: {
      area: "reservationPanel",
      platform,
      state: summary.isHoliday && !summary.hasReservations ? "holiday" : summary.reservations.length > 0 ? "list" : "empty",
    },
  });

  if (platform === "web") {
    const header = createElement("div", { className: "school-reservation-panel-header" });
    const title = createElement("div", { className: "school-reservation-title" });
    const titleRow = createElement("div", { className: "school-reservation-title-row" });
    titleRow.append(createElement("span", { textContent: summary.dateText }));
    if (summary.isCapacityClosed) {
      titleRow.append(createCalendarBadge("마감", "calendar-badge is-closed is-panel"));
    }
    title.append(titleRow);
    title.append(createElement("strong", {
      className: summary.isHoliday ? "school-reservation-count is-holiday" : "school-reservation-count",
      textContent: summary.isHoliday ? "휴무" : `예약 ${summary.reservationCount}`,
    }));
    header.append(title);
    const cancelButton = createElement("button", {
      className: "school-reservation-cancel-button",
      type: "button",
      textContent: "예약 취소",
    });
    cancelButton.disabled = summary.reservations.length === 0;
    header.append(cancelButton);
    panel.append(header);
    panel.append(createWebReservationBody(schoolHomeState, summary));
    return panel;
  }

  const content = createElement("div", { className: "school-app-sheet" });
  const title = createElement("div", { className: "school-app-sheet-title" });
  title.append(createElement("span", { textContent: summary.dateText }));
  title.append(createElement("strong", {
    className: summary.isHoliday ? "school-reservation-count is-holiday" : "school-reservation-count",
    textContent: summary.isHoliday ? "휴무" : `예약 ${summary.reservationCount}`,
  }));
  content.append(title);
  content.append(createAppReservationBody(schoolHomeState, summary));
  panel.append(content);
  return panel;
}

function createWebReservationBody(schoolHomeState, summary) {
  if (summary.isHoliday && !summary.hasReservations) {
    return createHolidayEmptyState("일요일은 휴무입니다.", "휴무 확인용 상태입니다.");
  }

  if (summary.reservations.length === 0 && hasActiveReservationFilters(schoolHomeState)) {
    return createEmptyStateElement({
      title: "조건과 일치하는 결과가 없습니다.",
    });
  }

  const wrapper = createElement("div", { className: "school-reservation-table-wrapper" });
  const table = createElement("div", { className: "school-reservation-table" });
  const header = createElement("div", { className: "school-reservation-table-row is-header" });
  const allCheckbox = createElement("input", { type: "checkbox" });
  allCheckbox.disabled = summary.reservations.length === 0;
  allCheckbox.checked = summary.reservations.length > 0 && summary.reservations.every((reservation) => {
    return schoolHomeState.selectedReservationIds.includes(reservation.id);
  });
  allCheckbox.addEventListener("change", () => {
    schoolHomeState.selectedReservationIds = allCheckbox.checked ? summary.reservations.map((reservation) => reservation.id) : [];
    rerender(schoolHomeState);
  });
  const checkboxCell = createElement("label", { className: "school-reservation-checkbox-cell" });
  checkboxCell.append(allCheckbox);
  header.append(checkboxCell);
  ["상태", "반려견", "견종", "보호자"].forEach((labelText) => {
    header.append(createElement("strong", { textContent: labelText }));
  });
  table.append(header);

  if (summary.reservations.length === 0) {
    table.append(createWebReservationPlaceholderRow(hasActiveReservationFilters(schoolHomeState)));
  } else {
    summary.reservations.forEach((reservation) => {
      table.append(createWebReservationRow(schoolHomeState, reservation));
    });
  }

  wrapper.append(table);
  return wrapper;
}

function createWebReservationPlaceholderRow(isFilteredEmpty = false) {
  const row = createElement("div", {
    className: "school-reservation-table-row school-reservation-table-placeholder-row",
    dataset: { state: "empty" },
  });
  row.append(createElement("span", {
    className: "school-reservation-table-placeholder",
    textContent: isFilteredEmpty ? "조건과 일치하는 결과가 없습니다." : "등록된 예약이 없습니다.",
  }));
  return row;
}

function createWebReservationRow(schoolHomeState, reservation) {
  const row = createElement("div", {
    className: "school-reservation-table-row",
    dataset: { entityId: reservation.id, state: schoolHomeState.selectedReservationIds.includes(reservation.id) ? "selected" : "idle" },
  });
  const checkbox = createElement("input", { type: "checkbox" });
  checkbox.checked = schoolHomeState.selectedReservationIds.includes(reservation.id);
  checkbox.addEventListener("change", () => {
    schoolHomeState.selectedReservationIds = checkbox.checked
      ? [...schoolHomeState.selectedReservationIds, reservation.id]
      : schoolHomeState.selectedReservationIds.filter((reservationId) => reservationId !== reservation.id);
    rerender(schoolHomeState);
  });
  const checkboxCell = createElement("label", { className: "school-reservation-checkbox-cell" });
  checkboxCell.append(checkbox);
  row.append(checkboxCell);
  row.append(createElement("span", { className: "school-reservation-status", textContent: reservation.status }));
  row.append(createElement("span", { textContent: reservation.petName }));
  row.append(createElement("span", { textContent: reservation.breed }));
  row.append(createElement("span", { textContent: reservation.guardianName }));
  return row;
}

function createAppReservationBody(schoolHomeState, summary) {
  if (summary.isHoliday && !summary.hasReservations) {
    return createHolidayEmptyState("일요일은 휴무입니다.", "휴무 확인용 상태입니다.");
  }

  if (summary.reservations.length === 0) {
    return createEmptyStateElement({
      title: hasActiveReservationFilters(schoolHomeState) ? "조건과 일치하는 결과가 없습니다." : "등록된 예약이 없습니다.",
    });
  }

  const list = createElement("div", { className: "app-reservation-list", dataset: { feature: "schoolHome", state: "list" } });
  summary.reservations.forEach((reservation) => {
    const item = createElement("article", { className: "app-reservation-item", dataset: { feature: "schoolHome", entityId: reservation.id } });
    item.append(createElement("strong", { textContent: reservation.petName }));
    item.append(createElement("span", { textContent: reservation.breed }));
    const more = createElement("button", {
      className: "tiny-icon-button",
      type: "button",
      ariaLabel: `${reservation.petName} 더보기`,
      dataset: { action: "openReservationDetail", entityId: reservation.id },
    });
    more.append(createElement("img", { className: "button-icon", src: CHEVRON_RIGHT_ICON_PATH, alt: "" }));
    item.append(more);
    list.append(item);
  });
  return list;
}

function hasActiveReservationFilters(schoolHomeState) {
  return Boolean(
    String(schoolHomeState.searchTerm || "").trim()
    || (schoolHomeState.selectedMemberTagNames || []).length
  );
}

function createHolidayEmptyState(title, description) {
  const state = createEmptyStateElement({ title, description });
  state.className = "empty-state school-holiday-empty-state";
  const icon = createElement("img", { className: "school-holiday-icon", src: DAYOFF_ICON_PATH, alt: "" });
  state.prepend(icon);
  return state;
}

function createSchoolHomeAppShell(schoolHomeState) {
  const shell = createElement("section", {
    className: "school-home-app-shell",
    dataset: { area: "schoolHomeApp" },
  });
  shell.append(createAppHeader(schoolHomeState));
  shell.append(createSchoolCalendarPanel(schoolHomeState, "app"));
  shell.append(createSchoolReservationPanel(schoolHomeState, "app"));
  shell.append(createAppBottomNavigation());
  return shell;
}

function createAppBottomNavigation() {
  return createDefaultAppBottomNavigation({
    className: "mobile-bottom-nav",
    selectedLabel: "일정",
  });
}

function createReservationSearchAppScreen(schoolHomeState) {
  const screen = createElement("section", {
    className: "app-reservation-search-screen",
    dataset: { area: "reservationSearchScreen", platform: "app", service: "school" },
  });
  screen.append(createReservationSearchAppHeader(schoolHomeState, "유치원 예약 검색"));
  screen.append(createReservationSearchFilter(schoolHomeState, {
    className: "reservation-search-filter app-reservation-search-filter",
    searchFieldClassName: "filter-field filter-search-field reservation-search-field member-search-suggestion-field app-reservation-search-field",
    searchInputClassName: "filter-search-input reservation-search-input app-reservation-search-input",
    searchInputSelector: ".app-reservation-search-screen .reservation-search-input",
    tagFilterPresentation: "bottomSheet",
    tagSearchInputSelector: ".reservation-tag-bottom-sheet .member-tag-search-input",
    placeholder: "예약자 / 반려견 검색",
    rerender,
    onSearchInput: (state) => {
      rerender(state);
    },
  }));
  screen.append(createReservationSearchResultList(
    getFilteredReservationSearchResults(schoolHomeState),
    "schoolHome"
  ));
  return screen;
}

function createReservationSearchAppHeader(schoolHomeState, titleText) {
  const header = createElement("header", { className: "app-reservation-search-header" });
  const backButton = createHeaderIconButton(CHEVRON_LEFT_ICON_PATH, "뒤로");
  backButton.addEventListener("click", () => {
    schoolHomeState.isReservationSearchScreenOpen = false;
    schoolHomeState.isReservationSearchMenuOpen = false;
    schoolHomeState.isTagMenuOpen = false;
    rerender(schoolHomeState);
  });
  header.append(backButton);
  header.append(createElement("h1", { textContent: titleText }));
  header.append(createElement("span", { className: "header-spacer" }));
  return header;
}

function createReservationSearchResultList(reservations, featureName) {
  const list = createElement("section", {
    className: "app-reservation-search-results",
    dataset: { area: "reservationSearchResults", feature: featureName, state: reservations.length ? "list" : "empty" },
  });

  if (!reservations.length) {
    list.append(createEmptyStateElement({ title: "조건과 일치하는 결과가 없습니다." }));
    return list;
  }

  reservations.forEach((reservation) => {
    list.append(createReservationSearchResultItem(reservation, featureName));
  });
  return list;
}

function createReservationSearchResultItem(reservation, featureName) {
  const item = createElement("article", {
    className: "app-reservation-search-item",
    dataset: { entity: "reservation", entityId: reservation.id, feature: featureName },
  });
  const row = createElement("div", { className: "app-reservation-search-item-main" });
  row.append(createElement("strong", { textContent: reservation.petName || "-" }));
  row.append(createElement("span", {
    textContent: [reservation.breed || "-", reservation.weight || "-kg", reservation.guardianName || "-"].join(" / "),
  }));
  const more = createElement("button", {
    className: "tiny-icon-button",
    type: "button",
    ariaLabel: `${reservation.petName || "예약"} 상세`,
    dataset: { action: "openReservationDetail", entityId: reservation.id },
  });
  more.append(createElement("img", { className: "button-icon", src: CHEVRON_RIGHT_ICON_PATH, alt: "" }));
  row.append(more);
  item.append(row);
  item.append(createElement("span", {
    className: "app-reservation-search-date",
    textContent: `${formatReservationSearchDate(reservation.date)} 예약`,
  }));
  return item;
}

function getFilteredReservationSearchResults(schoolHomeState) {
  const searchTerm = normalizeReservationSearchText(schoolHomeState.searchTerm);
  return [...(schoolHomeState.reservations || [])]
    .filter((reservation) => {
      if (!searchTerm) {
        return true;
      }
      return [reservation.guardianName, reservation.petName].some((fieldValue) => {
        return normalizeReservationSearchText(fieldValue).includes(searchTerm);
      });
    })
    .filter((reservation) => {
      if (!schoolHomeState.selectedMemberTagNames?.length) {
        return true;
      }
      const reservationTags = reservation.petTags || [];
      return schoolHomeState.selectedMemberTagNames.every((memberTagName) => reservationTags.includes(memberTagName));
    })
    .sort((leftReservation, rightReservation) => String(leftReservation.date || "").localeCompare(String(rightReservation.date || "")));
}

function formatReservationSearchDate(dateText) {
  const date = new Date(dateText);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 (${weekdays[date.getDay()]})`;
}

function normalizeReservationSearchText(value) {
  return String(value || "").trim().toLowerCase();
}

function createAppModeMenu(items) {
  const menu = createElement("div", {
    className: "school-app-mode-menu",
    dataset: { area: "modeMenu" },
  });

  items.forEach((item) => {
    const button = createElement("button", {
      className: item.selected ? "school-app-mode-option is-selected" : "school-app-mode-option",
      type: "button",
      textContent: item.label,
      dataset: { action: "switchMode", state: item.selected ? "selected" : "idle" },
    });
    button.addEventListener("click", () => {
      if (item.href) {
        window.location.href = item.href;
      }
    });
    menu.append(button);
  });

  return menu;
}
function resetToInitialView(schoolHomeState) {
  const initialView = getSchoolHomeInitialView();
  schoolHomeState.currentMonth = initialView.currentMonth;
  schoolHomeState.selectedDate = initialView.selectedDate;
  schoolHomeState.selectedReservationIds = [];
  rerender(schoolHomeState);
}

function getSchoolCapacityCount() {
  return 12;
}
