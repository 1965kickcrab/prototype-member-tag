import { getHotelHomeInitialView, getHotelHomeReservations } from "../../shared/storage/hotel-home-storage.js";
import { getStoredMembers, loadMemberTagCatalog } from "../../shared/storage/member-storage.js";

const DEFAULT_APP_FILTERS = ["checkin", "checkout", "staying"];

export function createHotelHomeState() {
  const initialView = getHotelHomeInitialView();

  return {
    currentMonth: initialView.currentMonth,
    selectedDate: initialView.selectedDate,
    searchTerm: "",
    selectedReservationMember: null,
    isReservationSearchMenuOpen: false,
    isReservationSearchScreenOpen: false,
    members: getStoredMembers(),
    reservations: attachMemberTagsToReservations(getHotelHomeReservations(), getStoredMembers()),
    memberTagCatalog: loadMemberTagCatalog(),
    selectedMemberTagNames: [],
    tagFilterQuery: "",
    isTagMenuOpen: false,
    isDetailPanelOpen: Boolean(initialView.selectedDate),
    selectedReservationIds: initialView.selectedReservationIds,
    activeFilters: [...DEFAULT_APP_FILTERS],
    isModeMenuOpen: false,
  };
}

export function createMonthDate(currentMonth) {
  const [yearText, monthText] = String(currentMonth || "").split("-");
  const year = Number(yearText);
  const month = Number(monthText);

  if (!year || !month) {
    return new Date();
  }

  return new Date(year, month - 1, 1);
}

export function getCalendarMatrix(currentMonth) {
  const monthDate = createMonthDate(currentMonth);
  const firstDate = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const firstVisibleDate = new Date(firstDate);
  firstVisibleDate.setDate(firstDate.getDate() - firstDate.getDay());

  return Array.from({ length: 6 }, (_, weekIndex) => {
    return Array.from({ length: 7 }, (_, dayIndex) => {
      const date = new Date(firstVisibleDate);
      date.setDate(firstVisibleDate.getDate() + weekIndex * 7 + dayIndex);
      return createCalendarCell(date, monthDate);
    });
  });
}

export function getReservationsByDate(reservations, selectedDate) {
  return (reservations || []).filter((reservation) => reservation.date === selectedDate);
}

export function getCalendarCountsByDate(reservations, selectedDate) {
  const reservationsByDate = getReservationsByDate(reservations, selectedDate);
  const checkinCount = reservationsByDate.filter((reservation) => reservation.type === "checkin").length;
  const checkoutCount = reservationsByDate.filter((reservation) => reservation.type === "checkout").length;
  const stayingCount = reservationsByDate.filter((reservation) => reservation.type === "staying").length;

  return {
    totalCount: checkinCount + checkoutCount + stayingCount,
    checkinCount,
    checkoutCount,
    stayingCount,
  };
}

export function getFilteredReservationsByDate(hotelHomeState, selectedDate = hotelHomeState.selectedDate) {
  let reservations = getReservationsByDate(hotelHomeState.reservations, selectedDate);

  return getFilteredReservations(hotelHomeState, reservations);
}

export function getFilteredReservations(hotelHomeState, reservations = hotelHomeState.reservations) {
  let filteredReservations = [...(reservations || [])];

  filteredReservations = filterReservationsBySelectedMember(filteredReservations, hotelHomeState.selectedReservationMember);
  filteredReservations = filterReservationsBySearchTerm(filteredReservations, hotelHomeState.searchTerm, hotelHomeState.selectedReservationMember);
  filteredReservations = filterReservationsByMemberTags(filteredReservations, hotelHomeState.selectedMemberTagNames);

  return filterReservationsByTypes(filteredReservations, hotelHomeState.activeFilters);
}

export function getFilteredReservationDateRangeRows(hotelHomeState) {
  const reservations = getFilteredReservations(hotelHomeState);
  const rowMap = new Map();

  reservations.forEach((reservation) => {
    const key = createReservationFilterGroupKey(reservation);
    const currentRow = rowMap.get(key);
    const nextRow = currentRow || {
      id: key,
      petName: reservation.petName || "-",
      breed: reservation.breed || "",
      guardianName: reservation.guardianName || "",
      startDate: reservation.date,
      endDate: reservation.date,
      reservations: [],
    };

    nextRow.reservations.push(reservation);
    nextRow.startDate = getEarlierDateKey(nextRow.startDate, reservation.date);
    nextRow.endDate = getLaterDateKey(nextRow.endDate, reservation.date);
    rowMap.set(key, nextRow);
  });

  return Array.from(rowMap.values()).sort((leftRow, rightRow) => {
    const dateCompare = String(leftRow.startDate || "").localeCompare(String(rightRow.startDate || ""));
    if (dateCompare !== 0) {
      return dateCompare;
    }

    return String(leftRow.petName || "").localeCompare(String(rightRow.petName || ""), "ko");
  });
}

function filterReservationsBySelectedMember(reservations, selectedReservationMember) {
  if (!selectedReservationMember) {
    return reservations;
  }

  return reservations.filter((reservation) => {
    if (selectedReservationMember.memberId && reservation.memberId) {
      if (selectedReservationMember.memberId !== reservation.memberId) {
        return false;
      }

      if (selectedReservationMember.petId && reservation.petId) {
        return selectedReservationMember.petId === reservation.petId;
      }

      return true;
    }

    const sameGuardian = normalizeSearchText(reservation.guardianName) === normalizeSearchText(selectedReservationMember.guardianName);
    const samePet = normalizeSearchText(reservation.petName) === normalizeSearchText(selectedReservationMember.petName);

    if (selectedReservationMember.guardianName && selectedReservationMember.petName) {
      return sameGuardian && samePet;
    }

    return sameGuardian || samePet;
  });
}

function filterReservationsBySearchTerm(reservations, searchTerm, selectedReservationMember) {
  const normalizedSearchTerm = normalizeSearchText(searchTerm);

  if (!normalizedSearchTerm || selectedReservationMember) {
    return reservations;
  }

  return reservations.filter((reservation) => {
    return [reservation.guardianName, reservation.petName].some((fieldValue) => {
      return normalizeSearchText(fieldValue).includes(normalizedSearchTerm);
    });
  });
}

function filterReservationsByMemberTags(reservations, selectedMemberTagNames = []) {
  if (!Array.isArray(selectedMemberTagNames) || selectedMemberTagNames.length === 0) {
    return reservations;
  }

  return reservations.filter((reservation) => {
    const reservationTags = reservation.petTags || [];
    return selectedMemberTagNames.every((memberTagName) => reservationTags.includes(memberTagName));
  });
}

export function filterReservationsByTypes(reservations, activeFilters = DEFAULT_APP_FILTERS) {
  if (!Array.isArray(activeFilters) || activeFilters.length === 0) {
    return [];
  }

  return reservations.filter((reservation) => activeFilters.includes(reservation.type));
}

export function getReservationGroups(reservations) {
  return [
    { key: "checkin", label: "입실", reservations: reservations.filter((reservation) => reservation.type === "checkin") },
    { key: "checkout", label: "퇴실", reservations: reservations.filter((reservation) => reservation.type === "checkout") },
    { key: "staying", label: "숙박", reservations: reservations.filter((reservation) => reservation.type === "staying") },
  ];
}

export function sortReservationsForApp(reservations) {
  return [...reservations].sort((leftReservation, rightReservation) => {
    const leftMovement = leftReservation.type === "checkin" || leftReservation.type === "checkout";
    const rightMovement = rightReservation.type === "checkin" || rightReservation.type === "checkout";

    if (leftMovement && rightMovement) {
      return compareTimes(leftReservation.time, rightReservation.time);
    }

    if (leftMovement !== rightMovement) {
      return leftMovement ? -1 : 1;
    }

    return String(leftReservation.petName || "").localeCompare(String(rightReservation.petName || ""), "ko");
  });
}

export function getMonthLabel(currentMonth) {
  const monthDate = createMonthDate(currentMonth);
  return `${monthDate.getFullYear()}년 ${monthDate.getMonth() + 1}월`;
}

export function getDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function shiftMonth(currentMonth, offset) {
  const monthDate = createMonthDate(currentMonth);
  monthDate.setMonth(monthDate.getMonth() + offset);
  return `${monthDate.getFullYear()}-${String(monthDate.getMonth() + 1).padStart(2, "0")}`;
}

export function getSelectedDateSummary(hotelHomeState, selectedDate = hotelHomeState.selectedDate) {
  const reservations = getFilteredReservationsByDate(hotelHomeState, selectedDate);
  const groups = getReservationGroups(reservations);
  const counts = getCalendarCountsByDate(reservations, selectedDate);

  return {
    dateText: formatSelectedDate(selectedDate),
    reservationCount: counts.totalCount,
    stayingCount: counts.stayingCount,
    checkinCount: counts.checkinCount,
    checkoutCount: counts.checkoutCount,
    reservations,
    groups,
  };
}

export function getReservationDateRangeStatus(endDate) {
  const checkoutDate = parseDateKey(endDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (!checkoutDate || checkoutDate < today) {
    return {
      label: "이용 완료",
      state: "complete",
    };
  }

  return {
    label: "이용 예정",
    state: "pending",
  };
}

export function formatReservationDateRange(startDate, endDate) {
  return `${formatDateWithWeekday(startDate)} - ${formatDateWithWeekday(endDate || startDate)}`;
}

function createCalendarCell(date, monthDate) {
  const dateKey = getDateKey(date);
  return {
    dateKey,
    dayNumber: date.getDate(),
    isCurrentMonth: date.getMonth() === monthDate.getMonth(),
    isToday: dateKey === getDateKey(new Date()),
  };
}

function formatSelectedDate(dateText) {
  const date = new Date(dateText);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
}

function formatDateWithWeekday(dateText) {
  const date = parseDateKey(dateText);

  if (!date) {
    return "-";
  }

  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
  return `${date.getMonth() + 1}월${date.getDate()}일 (${weekdays[date.getDay()]})`;
}

function normalizeSearchText(value) {
  return String(value || "").trim().toLowerCase();
}

function parseDateKey(dateText) {
  const [yearText, monthText, dayText] = String(dateText || "").split("-");
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);

  if (!year || !month || !day) {
    return null;
  }

  const date = new Date(year, month - 1, day);
  date.setHours(0, 0, 0, 0);
  return Number.isNaN(date.getTime()) ? null : date;
}

function getEarlierDateKey(leftDate, rightDate) {
  if (!leftDate) {
    return rightDate || "";
  }

  if (!rightDate) {
    return leftDate;
  }

  return String(rightDate).localeCompare(String(leftDate)) < 0 ? rightDate : leftDate;
}

function getLaterDateKey(leftDate, rightDate) {
  if (!leftDate) {
    return rightDate || "";
  }

  if (!rightDate) {
    return leftDate;
  }

  return String(rightDate).localeCompare(String(leftDate)) > 0 ? rightDate : leftDate;
}

function createReservationFilterGroupKey(reservation) {
  const memberKey = reservation.memberId || normalizeSearchText(reservation.guardianName);
  const petKey = reservation.petId || normalizeSearchText(reservation.petName);
  return `${memberKey}:${petKey}`;
}

function attachMemberTagsToReservations(reservations, members) {
  return (reservations || []).map((reservation) => {
    const matchedMemberPet = findReservationMemberPet(reservation, members);
    return {
      ...reservation,
      memberId: reservation.memberId || matchedMemberPet?.member?.id || "",
      petId: reservation.petId || matchedMemberPet?.pet?.id || "",
      guardianName: reservation.guardianName || matchedMemberPet?.member?.guardianName || "",
      phoneNumber: reservation.phoneNumber || matchedMemberPet?.member?.phoneNumber || "",
      breed: reservation.breed || matchedMemberPet?.pet?.breed || "",
      weight: reservation.weight || matchedMemberPet?.pet?.weight || "",
      ownerTags: Array.isArray(matchedMemberPet?.member?.ownerTags) ? [...matchedMemberPet.member.ownerTags] : [],
      petTags: Array.isArray(matchedMemberPet?.pet?.petTags) ? [...matchedMemberPet.pet.petTags] : [],
    };
  });
}

function findReservationMemberPet(reservation, members) {
  if (reservation.memberId) {
    const memberById = members.find((member) => member.id === reservation.memberId);
    if (memberById && reservation.petId) {
      const petById = (memberById.pets || []).find((pet) => pet.id === reservation.petId);
      if (petById) {
        return { member: memberById, pet: petById };
      }
    }

    if (memberById) {
      const matchedPet = findReservationPet(reservation, memberById);
      if (matchedPet) {
        return { member: memberById, pet: matchedPet };
      }
    }
  }

  const reservationKey = createReservationMemberKey(reservation);
  for (const member of members || []) {
    const matchedPet = (member.pets || []).find((pet) => {
      return `${normalizeSearchText(pet?.petName || pet?.dogName)}:${normalizeSearchText(member?.guardianName)}` === reservationKey;
    });

    if (matchedPet) {
      return { member, pet: matchedPet };
    }
  }

  return null;
}

function findReservationPet(reservation, member) {
  const reservationPetName = normalizeSearchText(reservation?.petName || reservation?.dogName);
  return (member?.pets || []).find((pet) => {
    return normalizeSearchText(pet?.petName || pet?.dogName) === reservationPetName;
  }) || (member?.pets || [])[0];
}

function createReservationMemberKey(value) {
  return `${normalizeSearchText(value?.petName || value?.dogName)}:${normalizeSearchText(value?.guardianName)}`;
}

function compareTimes(leftTime, rightTime) {
  return convertTimeToMinutes(leftTime) - convertTimeToMinutes(rightTime);
}

function convertTimeToMinutes(timeText) {
  const normalizedText = String(timeText || "").trim();
  const match = normalizedText.match(/(오전|오후)\s*(\d{1,2}):(\d{2})/);

  if (!match) {
    return Number.MAX_SAFE_INTEGER;
  }

  const meridiem = match[1];
  let hour = Number(match[2]);
  const minute = Number(match[3]);

  if (meridiem === "오후" && hour !== 12) {
    hour += 12;
  }

  if (meridiem === "오전" && hour === 12) {
    hour = 0;
  }

  return hour * 60 + minute;
}
