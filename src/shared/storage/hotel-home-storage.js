import { readJsonStorage } from "./storage-utils.js";

export const HOTEL_HOME_RESERVATION_STORAGE_KEY = "prototype.hotelHome.reservations";
export const HOTEL_HOME_INITIAL_VIEW_STORAGE_KEY = "prototype.hotelHome.initialView";

export function getHotelHomeReservations() {
  const storedReservations = readJsonStorage(HOTEL_HOME_RESERVATION_STORAGE_KEY, HOTEL_HOME_RESERVATIONS);

  if (!Array.isArray(storedReservations)) {
    return HOTEL_HOME_RESERVATIONS.map(cloneReservation);
  }

  return storedReservations.map(normalizeReservation).filter((reservation) => {
    return reservation.id && reservation.date;
  });
}

export function getHotelHomeReservationMembers() {
  return createMembersFromReservations(HOTEL_HOME_RESERVATIONS);
}

export function getHotelHomeInitialView() {
  const storedInitialView = readJsonStorage(HOTEL_HOME_INITIAL_VIEW_STORAGE_KEY, HOTEL_HOME_INITIAL_VIEW);
  return normalizeInitialView(storedInitialView);
}

function normalizeInitialView(initialView) {
  const currentMonth = typeof initialView?.currentMonth === "string" && initialView.currentMonth
    ? initialView.currentMonth
    : HOTEL_HOME_INITIAL_VIEW.currentMonth;
  const selectedDate = typeof initialView?.selectedDate === "string" ? initialView.selectedDate : "";
  const selectedReservationIds = Array.isArray(initialView?.selectedReservationIds)
    ? initialView.selectedReservationIds.filter((reservationId) => typeof reservationId === "string" && reservationId)
    : [];

  return {
    currentMonth,
    selectedDate,
    selectedReservationIds,
  };
}

function normalizeReservation(reservation) {
  const defaultReservation = HOTEL_HOME_RESERVATIONS.find((defaultItem) => defaultItem.id === reservation?.id) || {};

  return {
    id: reservation?.id || "",
    date: reservation?.date || "",
    type: normalizeType(reservation?.type),
    status: normalizeStatus(reservation?.status),
    memberId: reservation?.memberId || defaultReservation.memberId || "",
    petId: reservation?.petId || defaultReservation.petId || "",
    petName: reservation?.petName || defaultReservation.petName || "",
    guardianName: reservation?.guardianName || defaultReservation.guardianName || "",
    phoneNumber: reservation?.phoneNumber || defaultReservation.phoneNumber || "",
    breed: reservation?.breed || defaultReservation.breed || "",
    weight: reservation?.weight || defaultReservation.weight || "",
    time: reservation?.time || "",
    memo: reservation?.memo || "",
    petTags: Array.isArray(reservation?.petTags)
      ? [...reservation.petTags]
      : Array.isArray(defaultReservation.petTags) ? [...defaultReservation.petTags] : [],
  };
}

function normalizeType(type) {
  return ["checkin", "checkout", "staying"].includes(type) ? type : "staying";
}

function normalizeStatus(status) {
  return status === "완료" ? "완료" : "대기";
}

function cloneReservation(reservation) {
  return { ...reservation };
}

const HOTEL_HOME_INITIAL_VIEW = {
  currentMonth: "2026-06",
  selectedDate: "",
  selectedReservationIds: [],
};

const HOTEL_HOME_RESERVATIONS = [
  { id: "hotel-1", date: "2026-06-28", type: "checkout", status: "완료", memberId: "member-kang-somin", petId: "pet-bori", petName: "보리", guardianName: "강소민", phoneNumber: "010-2345-1010", breed: "말티즈", time: "오전 8:00", memo: "" },
  { id: "hotel-2", date: "2026-06-28", type: "checkin", status: "대기", memberId: "member-yoon-jiho", petId: "pet-mango", petName: "망고", guardianName: "윤지호", phoneNumber: "010-2345-1011", breed: "말티푸", time: "오전 8:20", memo: "" },
  { id: "hotel-3", date: "2026-06-28", type: "checkout", status: "완료", memberId: "member-han-jisoo", petId: "pet-choco", petName: "초코", guardianName: "한지수", phoneNumber: "010-2345-1006", breed: "토이 푸들", time: "오후 8:15", memo: "" },
  { id: "hotel-4", date: "2026-06-28", type: "staying", status: "완료", memberId: "member-baek-seoyeon", petId: "pet-louis", petName: "루이", guardianName: "백서연", phoneNumber: "010-2345-1012", breed: "비숑 프리제", time: "-", memo: "저녁 산책 필요" },
  { id: "hotel-5", date: "2026-06-28", type: "staying", status: "대기", memberId: "member-moon-gayeon", petId: "pet-haneul", petName: "하늘", guardianName: "문가연", phoneNumber: "010-2345-1013", breed: "믹스견", time: "-", memo: "약 급여" },
  { id: "hotel-6", date: "2026-06-29", type: "staying", status: "완료", memberId: "member-shin-yujin", petId: "pet-gureum", petName: "구름", guardianName: "신유진", phoneNumber: "010-2345-1014", breed: "말티즈", time: "-", memo: "식이 알러지" },
  { id: "hotel-7", date: "2026-06-29", type: "staying", status: "대기", memberId: "member-lee-seojun", petId: "pet-coco", petName: "코코", guardianName: "이서준", phoneNumber: "010-2345-1002", breed: "토이 푸들", time: "-", memo: "낯가림 있음" },
  { id: "hotel-8", date: "2026-06-29", type: "staying", status: "완료", memberId: "member-lim-taeoh", petId: "pet-lotto", petName: "로또", guardianName: "임태오", phoneNumber: "010-2345-1015", breed: "스탠더드 푸들", time: "-", memo: "활동량 많음" },
  { id: "hotel-9", date: "2026-06-30", type: "staying", status: "대기", memberId: "member-park-hana", petId: "pet-cherry", petName: "체리", guardianName: "박하나", phoneNumber: "010-2345-1003", breed: "말티푸", time: "-", memo: "귀 청소 필요" },
  { id: "hotel-10", date: "2026-06-30", type: "checkin", status: "대기", memberId: "member-oh-seoyeon", petId: "pet-dubu", petName: "두부", guardianName: "오서연", phoneNumber: "010-2345-1007", breed: "말티즈", time: "오전 9:00", memo: "" },
  { id: "hotel-11", date: "2026-07-01", type: "checkin", status: "대기", memberId: "member-jang-harin", petId: "pet-mocha", petName: "모카", guardianName: "장하린", phoneNumber: "010-2345-1016", breed: "믹스견", time: "오전 9:30", memo: "" },
  { id: "hotel-12", date: "2026-07-01", type: "checkin", status: "완료", memberId: "member-kwon-dohyun", petId: "pet-miru", petName: "미르", guardianName: "권도현", phoneNumber: "010-2345-1017", breed: "믹스견", time: "오전 10:00", memo: "" },
  { id: "hotel-13", date: "2026-07-01", type: "checkin", status: "완료", memberId: "member-cho-eunseo", petId: "pet-chorong", petName: "초롱", guardianName: "조은서", phoneNumber: "010-2345-1018", breed: "토이 푸들", time: "오전 10:30", memo: "" },
  { id: "hotel-14", date: "2026-07-02", type: "checkin", status: "대기", memberId: "member-song-jiwon", petId: "pet-nari", petName: "나리", guardianName: "송지원", phoneNumber: "010-2345-1019", breed: "비숑 프리제", time: "오전 11:00", memo: "" },
  { id: "hotel-15", date: "2026-07-02", type: "checkout", status: "완료", memberId: "member-park-hana", petId: "pet-cherry", petName: "체리", guardianName: "박하나", phoneNumber: "010-2345-1003", breed: "말티푸", time: "오전 9:30", memo: "" },
  { id: "hotel-16", date: "2026-07-02", type: "checkout", status: "대기", memberId: "member-yang-eunwoo", petId: "pet-seori", petName: "서리", guardianName: "양은우", phoneNumber: "010-2345-1020", breed: "말티즈", time: "오후 9:00", memo: "" },
  { id: "hotel-17", date: "2026-07-03", type: "staying", status: "대기", memberId: "member-hwang-minseo", petId: "pet-bona", petName: "보나", guardianName: "황민서", phoneNumber: "010-2345-1021", breed: "비숑 프리제", time: "-", memo: "분리 불안 있음" },
  { id: "hotel-18", date: "2026-07-03", type: "staying", status: "완료", memberId: "member-kim-dain", petId: "pet-kkami", petName: "까미", guardianName: "김다인", phoneNumber: "010-2345-1022", breed: "푸들", time: "-", memo: "약 급여 완료" },
  { id: "hotel-19", date: "2026-07-03", type: "staying", status: "완료", memberId: "member-rha-joon", petId: "pet-dalkong", petName: "달콩", guardianName: "나준", phoneNumber: "010-2345-1023", breed: "포메라니안", time: "-", memo: "저녁 급여 완료" },
  { id: "hotel-20", date: "2026-07-04", type: "staying", status: "대기", memberId: "member-choi-yuna", petId: "pet-yuli", petName: "율이", guardianName: "최유나", phoneNumber: "010-2345-1004", breed: "이탈리안 그레이하운드", time: "-", memo: "실내 배변 체크" },
];

function createMembersFromReservations(reservations) {
  const memberMap = new Map();
  const petReservationCounts = new Map();

  reservations.forEach((reservation) => {
    const memberId = reservation.memberId || createStableId("member", reservation.guardianName);
    const petId = reservation.petId || createStableId("pet", `${reservation.guardianName}-${reservation.petName}`);

    if (!memberMap.has(memberId)) {
      memberMap.set(memberId, {
        id: memberId,
        guardianName: reservation.guardianName || "",
        phoneNumber: reservation.phoneNumber || "",
        address: reservation.address || "",
        addressDetail: reservation.addressDetail || "",
        isRegistered: true,
        ownerTags: [],
        pets: [],
      });
    }

    const member = memberMap.get(memberId);
    const existingPet = member.pets.find((pet) => pet.id === petId);
    const pet = existingPet || createPetFromReservation(reservation, petId);
    const petCountKey = `${memberId}:${petId}`;
    const reservedCount = (petReservationCounts.get(petCountKey) || 0) + 1;

    petReservationCounts.set(petCountKey, reservedCount);
    pet.totalReservedCountByType.hoteling = reservedCount;

    if (!existingPet) {
      member.pets.push(pet);
    }
  });

  return Array.from(memberMap.values());
}

function createPetFromReservation(reservation, petId) {
  return {
    id: petId,
    petName: reservation.petName || "",
    dogName: reservation.petName || "",
    breed: reservation.breed || "",
    memo: reservation.memo || "",
    birthDate: reservation.birthDate || "",
    animalRegistrationNumber: reservation.animalRegistrationNumber || "",
    coatColor: reservation.coatColor || "",
    weight: reservation.weight || "",
    gender: reservation.gender || "",
    neuteredStatus: reservation.neuteredStatus || "",
    remainingCountByType: { school: 0, daycare: 0, hoteling: 0, oneway: 0, roundtrip: 0 },
    totalReservableCountByType: { school: 0, daycare: 0, hoteling: 0, oneway: 0, roundtrip: 0 },
    totalReservedCountByType: { school: 0, daycare: 0, hoteling: 0, oneway: 0, roundtrip: 0 },
    ticketHistories: [],
    petTags: Array.isArray(reservation.petTags) ? [...reservation.petTags] : [],
  };
}

function createStableId(prefix, value) {
  return `${prefix}-${String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9가-힣]/g, "")}`;
}
