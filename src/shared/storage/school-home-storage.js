export function getSchoolHomeReservations() {
  return SCHOOL_HOME_RESERVATIONS.map((reservation) => ({ ...reservation }));
}

export function getSchoolHomeReservationMembers() {
  return createMembersFromReservations(SCHOOL_HOME_RESERVATIONS);
}

export function getSchoolHomeCapacityClosedDates() {
  return [...SCHOOL_HOME_CAPACITY_CLOSED_DATES];
}

export function getSchoolHomeInitialView() {
  return {
    currentMonth: SCHOOL_HOME_INITIAL_VIEW.currentMonth,
    selectedDate: SCHOOL_HOME_INITIAL_VIEW.selectedDate,
  };
}

const SCHOOL_HOME_INITIAL_VIEW = {
  currentMonth: "2025-07",
  selectedDate: "2025-07-04",
};

const SCHOOL_HOME_RESERVATIONS = [
  createSchoolReservation({
    id: "school-reservation-1",
    date: "2025-07-04",
    memberId: "member-kim-minji",
    petId: "pet-byeoli",
    petName: "별이",
    breed: "캐벌리어 킹 찰스 스패니얼",
    guardianName: "김민지",
    phoneNumber: "010-2345-1001",
    address: "서울시 마포구 월드컵북로 12",
    addressDetail: "302호",
    ownerTags: [],
    petTags: [],
    birthDate: "2021-03-12",
    animalRegistrationNumber: "410000000001001",
    coatColor: "브라운 화이트",
    weight: "6.2",
    gender: "여아",
    neuteredStatus: "완료",
    memo: "",
    totalReservableCount: 12,
  }),
  createSchoolReservation({
    id: "school-reservation-2",
    date: "2025-07-04",
    memberId: "member-lee-seojun",
    petId: "pet-coco",
    petName: "코코",
    breed: "토이 푸들",
    guardianName: "이서준",
    phoneNumber: "010-2345-1002",
    address: "서울시 용산구 이태원로 18",
    addressDetail: "101동 1204호",
    ownerTags: [],
    petTags: [],
    birthDate: "2020-11-02",
    animalRegistrationNumber: "410000000001002",
    coatColor: "크림",
    weight: "4.1",
    gender: "남아",
    neuteredStatus: "완료",
    memo: "",
    totalReservableCount: 8,
  }),
  createSchoolReservation({
    id: "school-reservation-3",
    date: "2025-07-04",
    memberId: "member-park-hana",
    petId: "pet-cherry",
    petName: "체리",
    breed: "말티푸",
    guardianName: "박하나",
    phoneNumber: "010-2345-1003",
    address: "서울시 성동구 왕십리로 66",
    addressDetail: "8층",
    ownerTags: [],
    petTags: [],
    birthDate: "2022-05-20",
    animalRegistrationNumber: "410000000001003",
    coatColor: "화이트",
    weight: "3.8",
    gender: "여아",
    neuteredStatus: "미완료",
    memo: "",
    totalReservableCount: 6,
  }),
  createSchoolReservation({
    id: "school-reservation-4",
    date: "2025-07-04",
    memberId: "member-choi-yuna",
    petId: "pet-yuli",
    petName: "율이",
    breed: "이탈리안 그레이하운드",
    guardianName: "최유나",
    phoneNumber: "010-2345-1004",
    address: "서울시 강남구 논현로 33",
    addressDetail: "B동 504호",
    ownerTags: [],
    petTags: [],
    birthDate: "2019-09-14",
    animalRegistrationNumber: "410000000001004",
    coatColor: "그레이",
    weight: "5.0",
    gender: "남아",
    neuteredStatus: "완료",
    memo: "",
    totalReservableCount: 12,
  }),
  createSchoolReservation({
    id: "school-reservation-5",
    date: "2025-07-04",
    memberId: "member-jung-doyoon",
    petId: "pet-kongi",
    petName: "콩이",
    breed: "말티즈",
    guardianName: "정도윤",
    phoneNumber: "010-2345-1005",
    address: "서울시 서초구 반포대로 25",
    addressDetail: "2층",
    ownerTags: [],
    petTags: [],
    birthDate: "2014-01-08",
    animalRegistrationNumber: "410000000001005",
    coatColor: "화이트",
    weight: "3.2",
    gender: "남아",
    neuteredStatus: "완료",
    memo: "",
    totalReservableCount: 8,
  }),
  createSchoolReservation({
    id: "school-reservation-6",
    date: "2025-07-06",
    memberId: "member-han-jisoo",
    petId: "pet-choco",
    petName: "초코",
    breed: "토이 푸들",
    guardianName: "한지수",
    phoneNumber: "010-2345-1006",
    address: "서울시 송파구 올림픽로 120",
    addressDetail: "1501호",
    ownerTags: [],
    petTags: [],
    birthDate: "2021-07-17",
    animalRegistrationNumber: "410000000001006",
    coatColor: "초코",
    weight: "4.6",
    gender: "남아",
    neuteredStatus: "완료",
    memo: "",
    totalReservableCount: 10,
  }),
  createSchoolReservation({
    id: "school-reservation-7",
    date: "2025-07-07",
    memberId: "member-oh-seoyeon",
    petId: "pet-dubu",
    petName: "두부",
    breed: "포메라니안",
    guardianName: "오서연",
    phoneNumber: "010-2345-1007",
    address: "서울시 은평구 통일로 77",
    addressDetail: "403호",
    ownerTags: [],
    petTags: [],
    birthDate: "2023-02-11",
    animalRegistrationNumber: "410000000001007",
    coatColor: "오렌지",
    weight: "2.9",
    gender: "여아",
    neuteredStatus: "미완료",
    memo: "",
    totalReservableCount: 6,
  }),
  createSchoolReservation({
    id: "school-reservation-8",
    date: "2025-06-30",
    memberId: "member-seo-minho",
    petId: "pet-maru",
    petName: "마루",
    breed: "믹스견",
    guardianName: "서민호",
    phoneNumber: "010-2345-1008",
    address: "서울시 중구 다산로 90",
    addressDetail: "1층",
    ownerTags: [],
    petTags: [],
    birthDate: "2018-12-24",
    animalRegistrationNumber: "410000000001008",
    coatColor: "블랙 브라운",
    weight: "9.4",
    gender: "남아",
    neuteredStatus: "완료",
    memo: "",
    totalReservableCount: 12,
  }),
  createSchoolReservation({
    id: "school-reservation-9",
    date: "2025-08-01",
    memberId: "member-nam-sora",
    petId: "pet-momo",
    petName: "모모",
    breed: "비숑 프리제",
    guardianName: "남소라",
    phoneNumber: "010-2345-1009",
    address: "서울시 광진구 아차산로 40",
    addressDetail: "702호",
    ownerTags: [],
    petTags: [],
    birthDate: "2020-04-03",
    animalRegistrationNumber: "410000000001009",
    coatColor: "화이트",
    weight: "5.8",
    gender: "여아",
    neuteredStatus: "완료",
    memo: "",
    totalReservableCount: 10,
  }),
  createSchoolReservation({
    id: "school-reservation-10",
    date: "2025-07-08",
    memberId: "member-kim-minji",
    petId: "pet-byeoli",
    petName: "별이",
    breed: "캐벌리어 킹 찰스 스패니얼",
    guardianName: "김민지",
    phoneNumber: "010-2345-1001",
    address: "서울시 마포구 월드컵북로 12",
    addressDetail: "302호",
    ownerTags: [],
    petTags: [],
    birthDate: "2021-03-12",
    animalRegistrationNumber: "410000000001001",
    coatColor: "브라운 화이트",
    weight: "6.2",
    gender: "여아",
    neuteredStatus: "완료",
    memo: "",
    totalReservableCount: 12,
  }),
  createSchoolReservation({
    id: "school-reservation-11",
    date: "2025-07-08",
    memberId: "member-park-hana",
    petId: "pet-cherry",
    petName: "체리",
    breed: "말티푸",
    guardianName: "박하나",
    phoneNumber: "010-2345-1003",
    address: "서울시 성동구 왕십리로 66",
    addressDetail: "8층",
    ownerTags: [],
    petTags: [],
    birthDate: "2022-05-20",
    animalRegistrationNumber: "410000000001003",
    coatColor: "화이트",
    weight: "3.8",
    gender: "여아",
    neuteredStatus: "미완료",
    memo: "",
    totalReservableCount: 6,
  }),
  createSchoolReservation({
    id: "school-reservation-12",
    date: "2025-07-09",
    memberId: "member-choi-yuna",
    petId: "pet-yuli",
    petName: "율이",
    breed: "이탈리안 그레이하운드",
    guardianName: "최유나",
    phoneNumber: "010-2345-1004",
    address: "서울시 강남구 논현로 33",
    addressDetail: "B동 504호",
    ownerTags: [],
    petTags: [],
    birthDate: "2019-09-14",
    animalRegistrationNumber: "410000000001004",
    coatColor: "그레이",
    weight: "5.0",
    gender: "남아",
    neuteredStatus: "완료",
    memo: "",
    totalReservableCount: 12,
  }),
];

const SCHOOL_HOME_CAPACITY_CLOSED_DATES = [
  "2025-07-04",
];

function createSchoolReservation(reservation) {
  return {
    status: "예약",
    ...reservation,
  };
}

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
        ownerTags: Array.isArray(reservation.ownerTags) ? [...reservation.ownerTags] : [],
        pets: [],
      });
    }

    const member = memberMap.get(memberId);
    const existingPet = member.pets.find((pet) => pet.id === petId);
    const pet = existingPet || createPetFromReservation(reservation, petId);
    const petCountKey = `${memberId}:${petId}`;
    const reservedCount = (petReservationCounts.get(petCountKey) || 0) + 1;
    const totalReservableCount = Number(reservation.totalReservableCount) || pet.totalReservableCountByType.school || 8;

    petReservationCounts.set(petCountKey, reservedCount);
    pet.totalReservableCountByType.school = totalReservableCount;
    pet.totalReservedCountByType.school = reservedCount;
    pet.remainingCountByType.school = Math.max(totalReservableCount - reservedCount, 0);
    pet.ticketHistories = createTicketHistories(reservation, totalReservableCount, reservedCount);

    if (!existingPet) {
      member.pets.push(pet);
    }
  });

  return Array.from(memberMap.values());
}

function createPetFromReservation(reservation, petId) {
  const totalReservableCount = Number(reservation.totalReservableCount) || 8;
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
    remainingCountByType: { school: totalReservableCount, daycare: 0, hoteling: 0, oneway: 0, roundtrip: 0 },
    totalReservableCountByType: { school: totalReservableCount, daycare: 0, hoteling: 0, oneway: 0, roundtrip: 0 },
    totalReservedCountByType: { school: 0, daycare: 0, hoteling: 0, oneway: 0, roundtrip: 0 },
    ticketHistories: createTicketHistories(reservation, totalReservableCount, 0),
    petTags: Array.isArray(reservation.petTags) ? [...reservation.petTags] : [],
  };
}

function createTicketHistories(reservation, totalCount, reservedCount) {
  return [
    {
      id: `ticket-${reservation.petId || reservation.id}`,
      status: "이용중",
      ticketName: "유치원 정기권",
      remainingCount: Math.max(totalCount - reservedCount, 0),
      totalCount,
      validDays: 30,
      expiresAt: "2025-07-31",
      amount: 280000,
    },
  ];
}

function createStableId(prefix, value) {
  return `${prefix}-${String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9가-힣-]/g, "")}`;
}
