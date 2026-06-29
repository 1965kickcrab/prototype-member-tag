# Feature Spec: 회원 태그

## Output Metadata

| Field | Value |
| --- | --- |
| Project | `회원 태그` |
| Feature output folder | `outputs/case-inventory-output` |
| Last updated | `2026-05-29` |
| Markdown validation | `Passed` |

## Screen Header

| Field | Value |
| --- | --- |
| Platform | Web |
| User | 비즈 |
| Screen | Logic in member-home-renderer.js |
| Entry Path | Prototype: ../../../OneDrive/문서/prototype-member-tag/src/features/member-home/member-home-renderer.js:164 외 6개 trace |
| Primary User Goal | Logic in member-home-renderer.js |
| Related Screens | - |

## META / Case

| Field | Value |
| --- | --- |
| 플랫폼 | Web |
| 유저 | 비즈 |
| 화면명 | Logic in member-home-renderer.js |
| 화면 경로 | Prototype: ../../../OneDrive/문서/prototype-member-tag/src/features/member-home/member-home-renderer.js:164 외 6개 trace |
| Case | Logic in member-home-renderer.js |

## Context

회원 태그 기능에서 Logic in member-home-renderer.js 흐름의 사용자 동작과 화면 반응을 정의한다. 이 최종 case는 7개의 JS-derived trace case를 근거로 집계한다.

## Screen Areas

| Screen Area | Purpose | Main UI Items | Visibility / Entry Condition |
| --- | --- | --- | --- |
| Logic in member-home-renderer.js | Logic in member-home-renderer.js | [data-state] | !isMobileLayout(); isMobileLayout(); options.clearMode === "selection"; tagsCell; excessCount > 0 |

## UI Item Spec

| Platform | Screen | Screen Area | UI Item | Behavior | Exception | State | Data Impact |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Web | Logic in member-home-renderer.js | Logic in member-home-renderer.js | Logic in member-home-renderer.js | if (!isMobileLayout()) {; if (isMobileLayout()) {; memoField.addEventListener("input", (event) => {; if (options.clearMode === "selection") {; if (tagsCell) {; if (excessCount > 0) {; input.addEventListener("input", (event) => { | - | !isMobileLayout(); isMobileLayout(); options.clearMode === "selection"; tagsCell; excessCount > 0 | write feature data; mutate form state |

## Component Description

| Number | Type | Title | Bullets |
| --- | --- | --- | --- |
| P | Policy | Logic in member-home-renderer.js | 확정된 추가 서비스 정책 없음 |
| 1 | Section | logic branch | if (!isMobileLayout()) {; 조건: !isMobileLayout() |
| 2 | Section | logic branch | if (isMobileLayout()) {; 조건: isMobileLayout() |
| 3 | Input | input on [data-state] | memoField.addEventListener("input", (event) => { |
| 4 | Section | logic branch | if (options.clearMode === "selection") {; 조건: options.clearMode === "selection" |
| 5 | Section | logic branch | if (tagsCell) {; 조건: tagsCell |
| 6 | Section | logic branch | if (excessCount > 0) {; 조건: excessCount > 0 |
| 7 | Input | input | input.addEventListener("input", (event) => { |
| 8 | Section | 관련 UI 영역 | [data-state] |

## Screen-level States

| State | Trigger | Screen Response | Recovery / Next Step |
| --- | --- | --- | --- |
| Default | logic branch; input on [data-state]; input | if (!isMobileLayout()) {; if (isMobileLayout()) {; memoField.addEventListener("input", (event) => {; if (options.clearMode === "selection") {; if (tagsCell) {; if (excessCount > 0) {; input.addEventListener("input", (event) => { | 사용자는 다음 동작을 계속 진행한다. |
| Error | 저장 또는 처리 실패 | 오류 안내를 표시한다. | 사용자는 현재 화면에서 다시 시도한다. |

## Policy Notes

- 확정된 추가 서비스 정책 없음


## Screen Header

| Field | Value |
| --- | --- |
| Platform | App |
| User | 비즈 |
| Screen | Logic in member-home-renderer.js |
| Entry Path | Prototype: ../../../OneDrive/문서/prototype-member-tag/src/features/member-home/member-home-renderer.js:164 외 15개 trace |
| Primary User Goal | Logic in member-home-renderer.js |
| Related Screens | - |

## META / Case

| Field | Value |
| --- | --- |
| 플랫폼 | App |
| 유저 | 비즈 |
| 화면명 | Logic in member-home-renderer.js |
| 화면 경로 | Prototype: ../../../OneDrive/문서/prototype-member-tag/src/features/member-home/member-home-renderer.js:164 외 15개 trace |
| Case | Logic in member-home-renderer.js |

## Context

회원 태그 기능에서 Logic in member-home-renderer.js 흐름의 사용자 동작과 화면 반응을 정의한다. 이 최종 case는 15개의 JS-derived trace case를 근거로 집계한다.

## Screen Areas

| Screen Area | Purpose | Main UI Items | Visibility / Entry Condition |
| --- | --- | --- | --- |
| Logic in member-home-renderer.js | Logic in member-home-renderer.js | #app; [data-state] | !isMobileLayout(); isMobileLayout(); isComposing; !options.refocusSelector; options.clearMode === "selection"; tagsCell; excessCount > 0 |

## UI Item Spec

| Platform | Screen | Screen Area | UI Item | Behavior | Exception | State | Data Impact |
| --- | --- | --- | --- | --- | --- | --- | --- |
| App | Logic in member-home-renderer.js | Logic in member-home-renderer.js | Logic in member-home-renderer.js | if (!isMobileLayout()) {; button.addEventListener("click", () => {; if (isMobileLayout()) {; memoField.addEventListener("input", (event) => {; closeButton.addEventListener("click", () => {; input.addEventListener("compositionend", (event) => {; input.addEventListener("input", (event) => {; clearButton.addEventListener("click", () => { | - | !isMobileLayout(); isMobileLayout(); isComposing; !options.refocusSelector; options.clearMode === "selection"; tagsCell; excessCount > 0 | write feature data; mutate form state |

## Component Description

| Number | Type | Title | Bullets |
| --- | --- | --- | --- |
| P | Policy | Logic in member-home-renderer.js | 확정된 추가 서비스 정책 없음 |
| 1 | Section | logic branch | if (!isMobileLayout()) {; 조건: !isMobileLayout() |
| 2 | Button | click on #app | button.addEventListener("click", () => {; 조건: isMobileLayout() |
| 3 | Section | logic branch | if (isMobileLayout()) {; 조건: isMobileLayout() |
| 4 | Input | input on [data-state] | memoField.addEventListener("input", (event) => { |
| 5 | Button | click on #app | closeButton.addEventListener("click", () => { |
| 6 | Input | compositionend on #app | input.addEventListener("compositionend", (event) => { |
| 7 | Input | input on #app | input.addEventListener("input", (event) => {; 조건: isComposing; 조건: !options.refocusSelector |
| 8 | Button | click on #app | clearButton.addEventListener("click", () => {; 조건: options.clearMode === "selection" |
| 9 | Section | 관련 UI 영역 | #app; [data-state] |

## Screen-level States

| State | Trigger | Screen Response | Recovery / Next Step |
| --- | --- | --- | --- |
| Default | logic branch; click on #app; input on [data-state]; compositionend on #app; input on #app; input | if (!isMobileLayout()) {; button.addEventListener("click", () => {; if (isMobileLayout()) {; memoField.addEventListener("input", (event) => {; closeButton.addEventListener("click", () => {; input.addEventListener("compositionend", (event) => {; input.addEventListener("input", (event) => {; clearButton.addEventListener("click", () => { | 사용자는 다음 동작을 계속 진행한다. |
| Error | 저장 또는 처리 실패 | 오류 안내를 표시한다. | 사용자는 현재 화면에서 다시 시도한다. |

## Policy Notes

- 확정된 추가 서비스 정책 없음


## Screen Header

| Field | Value |
| --- | --- |
| Platform | Web |
| User | 비즈 |
| Screen | Submit and persistence |
| Entry Path | Prototype: ../../../OneDrive/문서/prototype-member-tag/src/features/member-home/member-home-renderer.js:437 외 63개 trace |
| Primary User Goal | Submit and persistence |
| Related Screens | - |

## META / Case

| Field | Value |
| --- | --- |
| 플랫폼 | Web |
| 유저 | 비즈 |
| 화면명 | Submit and persistence |
| 화면 경로 | Prototype: ../../../OneDrive/문서/prototype-member-tag/src/features/member-home/member-home-renderer.js:437 외 63개 trace |
| Case | Submit and persistence |

## Context

회원 태그 기능에서 Submit and persistence 흐름의 사용자 동작과 화면 반응을 정의한다. 이 최종 case는 49개의 JS-derived trace case를 근거로 집계한다.

## Screen Areas

| Screen Area | Purpose | Main UI Items | Visibility / Entry Condition |
| --- | --- | --- | --- |
| Submit and persistence | Submit and persistence | [data-state="empty"]; [data-entity="member"]; [data-action="openOwnerDetail"]; [data-state="open"]; [data-action="closePetSheet"]; [data-action="submitPet"] | matchedByPhone && matchedByPhone.isRegistered; isMobileLayout(); memberHomeState.isPetDetailBottomSheetOpen; siblings.length === 0; isMobile; member.petName \/\/ member.dogName; isMobileLayout() && memberHomeState.isTagMenuOpen; !isMobileLayout() |

## UI Item Spec

| Platform | Screen | Screen Area | UI Item | Behavior | Exception | State | Data Impact |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Web | Submit and persistence | Submit and persistence | Submit and persistence | if (matchedByPhone && matchedByPhone.isRegistered) {; Submit or save feature data.; Update enabled or disabled state. | - | input.disabled = draft.isDeleted; actionButton.disabled = getSelectedReservationCount(hotelHomeState) === 0; submitButton.disabled = !isPetFormReady(draftPet); submitButton.disabled = !isPetReady(draft); cancelButton.disabled = summary.reservations.length === 0; allCheckbox.disabled = summary.reservations.length === 0; allCheckbox.checked = summary.reservations.length > 0 && summary.reservations.every((reservation) => { | write feature data; delete or remove data; mutate form state |

## Component Description

| Number | Type | Title | Bullets |
| --- | --- | --- | --- |
| P | Policy | Submit and persistence | 확정된 추가 서비스 정책 없음 |
| 1 | Section | logic branch | if (matchedByPhone && matchedByPhone.isRegistered) {; 조건: matchedByPhone && matchedByPhone.isRegistered |
| 2 | Button | logic branch | Submit or save feature data.; 조건: isMobileLayout() |
| 3 | Button | logic branch | Submit or save feature data.; 조건: memberHomeState.isPetDetailBottomSheetOpen |
| 4 | Button | logic branch | Submit or save feature data.; 조건: siblings.length === 0 |
| 5 | Button | logic branch | Submit or save feature data.; 조건: isMobile |
| 6 | Button | submit | Submit or save feature data. |
| 7 | Button | logic branch | Submit or save feature data.; 조건: member.petName \/\/ member.dogName |
| 8 | Button | logic branch | Submit or save feature data.; 조건: isMobileLayout() && memberHomeState.isTagMenuOpen |
| 9 | Section | 관련 UI 영역 | [data-state="empty"]; [data-entity="member"]; [data-action="openOwnerDetail"]; [data-state="open"]; [data-action="closePetSheet"]; [data-action="submitPet"] |

## Screen-level States

| State | Trigger | Screen Response | Recovery / Next Step |
| --- | --- | --- | --- |
| Default | logic branch; submit; input; click; state sync; click on [data-action="closePetSheet"] | if (matchedByPhone && matchedByPhone.isRegistered) {; Submit or save feature data.; Update enabled or disabled state. | 사용자는 다음 동작을 계속 진행한다. |
| Error | 저장 또는 처리 실패 | 오류 안내를 표시한다. | 사용자는 현재 화면에서 다시 시도한다. |

## Policy Notes

- 확정된 추가 서비스 정책 없음


## Screen Header

| Field | Value |
| --- | --- |
| Platform | App |
| User | 비즈 |
| Screen | Submit and persistence |
| Entry Path | Prototype: ../../../OneDrive/문서/prototype-member-tag/src/features/member-home/member-home-renderer.js:437 외 65개 trace |
| Primary User Goal | Submit and persistence |
| Related Screens | - |

## META / Case

| Field | Value |
| --- | --- |
| 플랫폼 | App |
| 유저 | 비즈 |
| 화면명 | Submit and persistence |
| 화면 경로 | Prototype: ../../../OneDrive/문서/prototype-member-tag/src/features/member-home/member-home-renderer.js:437 외 65개 trace |
| Case | Submit and persistence |

## Context

회원 태그 기능에서 Submit and persistence 흐름의 사용자 동작과 화면 반응을 정의한다. 이 최종 case는 50개의 JS-derived trace case를 근거로 집계한다.

## Screen Areas

| Screen Area | Purpose | Main UI Items | Visibility / Entry Condition |
| --- | --- | --- | --- |
| Submit and persistence | Submit and persistence | #app; [data-state="empty"]; [data-entity="member"]; [data-action="openOwnerDetail"]; [data-state="open"]; [data-action="closePetSheet"]; [data-action="submitPet"] | matchedByPhone && matchedByPhone.isRegistered; isMobileLayout(); memberHomeState.isPetDetailBottomSheetOpen; siblings.length === 0; isMobile; !isPetDetailDraftReady(memberHomeState.petDetailDraft); member.petName \/\/ member.dogName; isMobileLayout() && memberHomeState.isTagMenuOpen |

## UI Item Spec

| Platform | Screen | Screen Area | UI Item | Behavior | Exception | State | Data Impact |
| --- | --- | --- | --- | --- | --- | --- | --- |
| App | Submit and persistence | Submit and persistence | Submit and persistence | if (matchedByPhone && matchedByPhone.isRegistered) {; Submit or save feature data.; Update enabled or disabled state.; deleteButton.addEventListener("click", () => { | - | input.disabled = draft.isDeleted; actionButton.disabled = getSelectedReservationCount(hotelHomeState) === 0; submitButton.disabled = !isPetFormReady(draftPet); submitButton.disabled = !isPetReady(draft); cancelButton.disabled = summary.reservations.length === 0; allCheckbox.disabled = summary.reservations.length === 0; allCheckbox.checked = summary.reservations.length > 0 && summary.reservations.every((reservation) => { | write feature data; mutate form state; delete or remove data |

## Component Description

| Number | Type | Title | Bullets |
| --- | --- | --- | --- |
| P | Policy | Submit and persistence | 확정된 추가 서비스 정책 없음 |
| 1 | Section | logic branch | if (matchedByPhone && matchedByPhone.isRegistered) {; 조건: matchedByPhone && matchedByPhone.isRegistered |
| 2 | Button | logic branch | Submit or save feature data.; 조건: isMobileLayout() |
| 3 | Button | logic branch | Submit or save feature data.; 조건: memberHomeState.isPetDetailBottomSheetOpen |
| 4 | Button | click on #app | Submit or save feature data. |
| 5 | Button | logic branch | Submit or save feature data.; 조건: siblings.length === 0 |
| 6 | Button | logic branch | Submit or save feature data.; 조건: isMobile |
| 7 | Button | submit | Submit or save feature data. |
| 8 | Button | submit | Submit or save feature data.; 조건: !isPetDetailDraftReady(memberHomeState.petDetailDraft) |
| 9 | Section | 관련 UI 영역 | #app; [data-state="empty"]; [data-entity="member"]; [data-action="openOwnerDetail"]; [data-state="open"]; [data-action="closePetSheet"]; [data-action="submitPet"] |

## Screen-level States

| State | Trigger | Screen Response | Recovery / Next Step |
| --- | --- | --- | --- |
| Default | logic branch; click on #app; submit; input; click; state sync | if (matchedByPhone && matchedByPhone.isRegistered) {; Submit or save feature data.; Update enabled or disabled state.; deleteButton.addEventListener("click", () => { | 사용자는 다음 동작을 계속 진행한다. |
| Error | 저장 또는 처리 실패 | 오류 안내를 표시한다. | 사용자는 현재 화면에서 다시 시도한다. |

## Policy Notes

- 확정된 추가 서비스 정책 없음


## Screen Header

| Field | Value |
| --- | --- |
| Platform | Web |
| User | 비즈 |
| Screen | Date selection |
| Entry Path | Prototype: ../../../OneDrive/문서/prototype-member-tag/src/features/member-home/member-home-renderer.js:1165 외 7개 trace |
| Primary User Goal | Date selection |
| Related Screens | - |

## META / Case

| Field | Value |
| --- | --- |
| 플랫폼 | Web |
| 유저 | 비즈 |
| 화면명 | Date selection |
| 화면 경로 | Prototype: ../../../OneDrive/문서/prototype-member-tag/src/features/member-home/member-home-renderer.js:1165 외 7개 trace |
| Case | Date selection |

## Context

회원 태그 기능에서 Date selection 흐름의 사용자 동작과 화면 반응을 정의한다. 이 최종 case는 6개의 JS-derived trace case를 근거로 집계한다.

## Screen Areas

| Screen Area | Purpose | Main UI Items | Visibility / Entry Condition |
| --- | --- | --- | --- |
| Date selection | Date selection | .pet-detail-birth-input; .birth-date-input | dateParts = Array.from(row.querySelectorAll(".pet-detail-birth-input")).map((dateInput) => dateInput.value); !hotelHomeState.selectedDate; dateParts = Array.from(birthInputs.querySelectorAll(".birth-date-input")).map((dateInput) => dateInput.value); isHoliday && reservationCount > 0; summary.isHoliday && !summary.hasReservations |

## UI Item Spec

| Platform | Screen | Screen Area | UI Item | Behavior | Exception | State | Data Impact |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Web | Date selection | Date selection | Date selection | input.addEventListener("input", () => {; if (!hotelHomeState.selectedDate) {; Submit or save feature data. | Use current prototype copy as default. | ageOutput.textContent = getAgeOutputText(draft.birthDate); ageOutput.textContent = getAgeOutputText(nextBirthDate) | write feature data; mutate form state |

## Component Description

| Number | Type | Title | Bullets |
| --- | --- | --- | --- |
| P | Policy | Date selection | 확정된 추가 서비스 정책 없음 |
| 1 | Input | input on .pet-detail-birth-input | input.addEventListener("input", () => {; ageOutput.textContent = getAgeOutputText(draft.birthDate); 조건: dateParts = Array.from(row.querySelectorAll(".pet-detail-birth-input")).map((dateInput) => dateInput.value) |
| 2 | State | logic branch | if (!hotelHomeState.selectedDate) {; 조건: !hotelHomeState.selectedDate |
| 3 | Input | input on .birth-date-input | input.addEventListener("input", () => {; ageOutput.textContent = getAgeOutputText(nextBirthDate); 조건: dateParts = Array.from(birthInputs.querySelectorAll(".birth-date-input")).map((dateInput) => dateInput.value) |
| 4 | Input | input on .birth-date-input | input.addEventListener("input", () => {; ageOutput.textContent = getAgeOutputText(draft.birthDate); 조건: dateParts = Array.from(birthInputs.querySelectorAll(".birth-date-input")).map((dateInput) => dateInput.value) |
| 5 | Button | logic branch | Submit or save feature data.; 조건: isHoliday && reservationCount > 0 |
| 6 | Button | logic branch | Submit or save feature data.; 조건: summary.isHoliday && !summary.hasReservations |
| 7 | Section | 관련 UI 영역 | .pet-detail-birth-input; .birth-date-input |
| 8 | State | UI/system handling | Keep the current surface open and show an error toast. |
| 9 | State | Exception behavior | Use current prototype copy as default. |

## Screen-level States

| State | Trigger | Screen Response | Recovery / Next Step |
| --- | --- | --- | --- |
| Default | input on .pet-detail-birth-input; logic branch; input on .birth-date-input | input.addEventListener("input", () => {; if (!hotelHomeState.selectedDate) {; Submit or save feature data. | 사용자는 다음 동작을 계속 진행한다. |
| Error | 저장 또는 처리 실패 | 오류 안내를 표시한다. | 사용자는 현재 화면에서 다시 시도한다. |

## Policy Notes

- 확정된 추가 서비스 정책 없음


## Screen Header

| Field | Value |
| --- | --- |
| Platform | App |
| User | 비즈 |
| Screen | Date selection |
| Entry Path | Prototype: ../../../OneDrive/문서/prototype-member-tag/src/features/member-home/member-home-renderer.js:1165 외 7개 trace |
| Primary User Goal | Date selection |
| Related Screens | - |

## META / Case

| Field | Value |
| --- | --- |
| 플랫폼 | App |
| 유저 | 비즈 |
| 화면명 | Date selection |
| 화면 경로 | Prototype: ../../../OneDrive/문서/prototype-member-tag/src/features/member-home/member-home-renderer.js:1165 외 7개 trace |
| Case | Date selection |

## Context

회원 태그 기능에서 Date selection 흐름의 사용자 동작과 화면 반응을 정의한다. 이 최종 case는 6개의 JS-derived trace case를 근거로 집계한다.

## Screen Areas

| Screen Area | Purpose | Main UI Items | Visibility / Entry Condition |
| --- | --- | --- | --- |
| Date selection | Date selection | .pet-detail-birth-input; .birth-date-input | dateParts = Array.from(row.querySelectorAll(".pet-detail-birth-input")).map((dateInput) => dateInput.value); !hotelHomeState.selectedDate; dateParts = Array.from(birthInputs.querySelectorAll(".birth-date-input")).map((dateInput) => dateInput.value); isHoliday && reservationCount > 0; summary.isHoliday && !summary.hasReservations |

## UI Item Spec

| Platform | Screen | Screen Area | UI Item | Behavior | Exception | State | Data Impact |
| --- | --- | --- | --- | --- | --- | --- | --- |
| App | Date selection | Date selection | Date selection | input.addEventListener("input", () => {; if (!hotelHomeState.selectedDate) {; Submit or save feature data. | Use current prototype copy as default. | ageOutput.textContent = getAgeOutputText(draft.birthDate); ageOutput.textContent = getAgeOutputText(nextBirthDate) | write feature data; mutate form state |

## Component Description

| Number | Type | Title | Bullets |
| --- | --- | --- | --- |
| P | Policy | Date selection | 확정된 추가 서비스 정책 없음 |
| 1 | Input | input on .pet-detail-birth-input | input.addEventListener("input", () => {; ageOutput.textContent = getAgeOutputText(draft.birthDate); 조건: dateParts = Array.from(row.querySelectorAll(".pet-detail-birth-input")).map((dateInput) => dateInput.value) |
| 2 | State | logic branch | if (!hotelHomeState.selectedDate) {; 조건: !hotelHomeState.selectedDate |
| 3 | Input | input on .birth-date-input | input.addEventListener("input", () => {; ageOutput.textContent = getAgeOutputText(nextBirthDate); 조건: dateParts = Array.from(birthInputs.querySelectorAll(".birth-date-input")).map((dateInput) => dateInput.value) |
| 4 | Input | input on .birth-date-input | input.addEventListener("input", () => {; ageOutput.textContent = getAgeOutputText(draft.birthDate); 조건: dateParts = Array.from(birthInputs.querySelectorAll(".birth-date-input")).map((dateInput) => dateInput.value) |
| 5 | Button | logic branch | Submit or save feature data.; 조건: isHoliday && reservationCount > 0 |
| 6 | Button | logic branch | Submit or save feature data.; 조건: summary.isHoliday && !summary.hasReservations |
| 7 | Section | 관련 UI 영역 | .pet-detail-birth-input; .birth-date-input |
| 8 | State | UI/system handling | Keep the current surface open and show an error toast. |
| 9 | State | Exception behavior | Use current prototype copy as default. |

## Screen-level States

| State | Trigger | Screen Response | Recovery / Next Step |
| --- | --- | --- | --- |
| Default | input on .pet-detail-birth-input; logic branch; input on .birth-date-input | input.addEventListener("input", () => {; if (!hotelHomeState.selectedDate) {; Submit or save feature data. | 사용자는 다음 동작을 계속 진행한다. |
| Error | 저장 또는 처리 실패 | 오류 안내를 표시한다. | 사용자는 현재 화면에서 다시 시도한다. |

## Policy Notes

- 확정된 추가 서비스 정책 없음


## Screen Header

| Field | Value |
| --- | --- |
| Platform | Web |
| User | 비즈 |
| Screen | Option selection |
| Entry Path | Prototype: ../../../OneDrive/문서/prototype-member-tag/src/features/member-home/member-home-renderer.js:1195 외 9개 trace |
| Primary User Goal | Option selection |
| Related Screens | - |

## META / Case

| Field | Value |
| --- | --- |
| 플랫폼 | Web |
| 유저 | 비즈 |
| 화면명 | Option selection |
| 화면 경로 | Prototype: ../../../OneDrive/문서/prototype-member-tag/src/features/member-home/member-home-renderer.js:1195 외 9개 trace |
| Case | Option selection |

## Context

회원 태그 기능에서 Option selection 흐름의 사용자 동작과 화면 반응을 정의한다. 이 최종 case는 9개의 JS-derived trace case를 근거로 집계한다.

## Screen Areas

| Screen Area | Purpose | Main UI Items | Visibility / Entry Condition |
| --- | --- | --- | --- |
| Option selection | Option selection | .pet-detail-radio-option; [data-state="idle"]; [data-state="selected"]; [data-action="selectMemberTagSuggestion"]; [data-action="createMemberTag"] | memberHomeState.selectedMemberTagNames.length; memberHomeState.selectedMemberTagNames.includes(memberTagName); memberHomeState.selectedMemberTagNames.length === 0; memberHomeState.selectedMemberTagNames.length === 1; keptIds = hotelHomeState.selectedReservationIds.filter((reservationId) => {; !Array.isArray(selectedMemberTagNames) \/\/ selectedMemberTagNames.length === 0; searchInputSelector === ".member-tag-search-input"; isSuggestionOpen && (suggestions.length \/\/ query.trim()) |

## UI Item Spec

| Platform | Screen | Screen Area | UI Item | Behavior | Exception | State | Data Impact |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Web | Option selection | Option selection | Option selection | input.addEventListener("change", () => {; Submit or save feature data.; if (memberHomeState.selectedMemberTagNames.includes(memberTagName)) {; if (memberHomeState.selectedMemberTagNames.length === 0) {; if (memberHomeState.selectedMemberTagNames.length === 1) {; selectAll.addEventListener("change", () => {; if (!Array.isArray(selectedMemberTagNames) \/\/ selectedMemberTagNames.length === 0) {; if (searchInputSelector === ".member-tag-search-input") { | - | memberHomeState.selectedMemberTagNames.length; memberHomeState.selectedMemberTagNames.includes(memberTagName); memberHomeState.selectedMemberTagNames.length === 0; memberHomeState.selectedMemberTagNames.length === 1; keptIds = hotelHomeState.selectedReservationIds.filter((reservationId) => {; !Array.isArray(selectedMemberTagNames) \/\/ selectedMemberTagNames.length === 0; searchInputSelector === ".member-tag-search-input"; isSuggestionOpen && (suggestions.length \/\/ query.trim()) | write feature data; mutate form state |

## Component Description

| Number | Type | Title | Bullets |
| --- | --- | --- | --- |
| P | Policy | Option selection | 확정된 추가 서비스 정책 없음 |
| 1 | Input | change on [data-state="idle"] | input.addEventListener("change", () => { |
| 2 | Button | logic branch | Submit or save feature data.; 조건: memberHomeState.selectedMemberTagNames.length |
| 3 | State | logic branch | if (memberHomeState.selectedMemberTagNames.includes(memberTagName)) {; 조건: memberHomeState.selectedMemberTagNames.includes(memberTagName) |
| 4 | State | logic branch | if (memberHomeState.selectedMemberTagNames.length === 0) {; 조건: memberHomeState.selectedMemberTagNames.length === 0 |
| 5 | State | logic branch | if (memberHomeState.selectedMemberTagNames.length === 1) {; 조건: memberHomeState.selectedMemberTagNames.length === 1 |
| 6 | List | change | selectAll.addEventListener("change", () => {; 조건: keptIds = hotelHomeState.selectedReservationIds.filter((reservationId) => { |
| 7 | Section | logic branch | if (!Array.isArray(selectedMemberTagNames) \/\/ selectedMemberTagNames.length === 0) {; 조건: !Array.isArray(selectedMemberTagNames) \/\/ selectedMemberTagNames.length === 0 |
| 8 | Input | logic branch | if (searchInputSelector === ".member-tag-search-input") {; 조건: searchInputSelector === ".member-tag-search-input" |
| 9 | Section | 관련 UI 영역 | .pet-detail-radio-option; [data-state="idle"]; [data-state="selected"]; [data-action="selectMemberTagSuggestion"]; [data-action="createMemberTag"] |

## Screen-level States

| State | Trigger | Screen Response | Recovery / Next Step |
| --- | --- | --- | --- |
| Default | change on [data-state="idle"]; logic branch; change; mousedown on [data-action="selectMemberTagSuggestion"] | input.addEventListener("change", () => {; Submit or save feature data.; if (memberHomeState.selectedMemberTagNames.includes(memberTagName)) {; if (memberHomeState.selectedMemberTagNames.length === 0) {; if (memberHomeState.selectedMemberTagNames.length === 1) {; selectAll.addEventListener("change", () => {; if (!Array.isArray(selectedMemberTagNames) \/\/ selectedMemberTagNames.length === 0) {; if (searchInputSelector === ".member-tag-search-input") { | 사용자는 다음 동작을 계속 진행한다. |
| Error | 저장 또는 처리 실패 | 오류 안내를 표시한다. | 사용자는 현재 화면에서 다시 시도한다. |

## Policy Notes

- 확정된 추가 서비스 정책 없음


## Screen Header

| Field | Value |
| --- | --- |
| Platform | App |
| User | 비즈 |
| Screen | Option selection |
| Entry Path | Prototype: ../../../OneDrive/문서/prototype-member-tag/src/features/member-home/member-home-renderer.js:1195 외 9개 trace |
| Primary User Goal | Option selection |
| Related Screens | - |

## META / Case

| Field | Value |
| --- | --- |
| 플랫폼 | App |
| 유저 | 비즈 |
| 화면명 | Option selection |
| 화면 경로 | Prototype: ../../../OneDrive/문서/prototype-member-tag/src/features/member-home/member-home-renderer.js:1195 외 9개 trace |
| Case | Option selection |

## Context

회원 태그 기능에서 Option selection 흐름의 사용자 동작과 화면 반응을 정의한다. 이 최종 case는 9개의 JS-derived trace case를 근거로 집계한다.

## Screen Areas

| Screen Area | Purpose | Main UI Items | Visibility / Entry Condition |
| --- | --- | --- | --- |
| Option selection | Option selection | .pet-detail-radio-option; [data-state="idle"]; [data-state="selected"]; [data-action="selectMemberTagSuggestion"]; [data-action="createMemberTag"] | memberHomeState.selectedMemberTagNames.length; memberHomeState.selectedMemberTagNames.includes(memberTagName); memberHomeState.selectedMemberTagNames.length === 0; memberHomeState.selectedMemberTagNames.length === 1; keptIds = hotelHomeState.selectedReservationIds.filter((reservationId) => {; !Array.isArray(selectedMemberTagNames) \/\/ selectedMemberTagNames.length === 0; searchInputSelector === ".member-tag-search-input"; isSuggestionOpen && (suggestions.length \/\/ query.trim()) |

## UI Item Spec

| Platform | Screen | Screen Area | UI Item | Behavior | Exception | State | Data Impact |
| --- | --- | --- | --- | --- | --- | --- | --- |
| App | Option selection | Option selection | Option selection | input.addEventListener("change", () => {; Submit or save feature data.; if (memberHomeState.selectedMemberTagNames.includes(memberTagName)) {; if (memberHomeState.selectedMemberTagNames.length === 0) {; if (memberHomeState.selectedMemberTagNames.length === 1) {; selectAll.addEventListener("change", () => {; if (!Array.isArray(selectedMemberTagNames) \/\/ selectedMemberTagNames.length === 0) {; if (searchInputSelector === ".member-tag-search-input") { | - | memberHomeState.selectedMemberTagNames.length; memberHomeState.selectedMemberTagNames.includes(memberTagName); memberHomeState.selectedMemberTagNames.length === 0; memberHomeState.selectedMemberTagNames.length === 1; keptIds = hotelHomeState.selectedReservationIds.filter((reservationId) => {; !Array.isArray(selectedMemberTagNames) \/\/ selectedMemberTagNames.length === 0; searchInputSelector === ".member-tag-search-input"; isSuggestionOpen && (suggestions.length \/\/ query.trim()) | write feature data; mutate form state |

## Component Description

| Number | Type | Title | Bullets |
| --- | --- | --- | --- |
| P | Policy | Option selection | 확정된 추가 서비스 정책 없음 |
| 1 | Input | change on [data-state="idle"] | input.addEventListener("change", () => { |
| 2 | Button | logic branch | Submit or save feature data.; 조건: memberHomeState.selectedMemberTagNames.length |
| 3 | State | logic branch | if (memberHomeState.selectedMemberTagNames.includes(memberTagName)) {; 조건: memberHomeState.selectedMemberTagNames.includes(memberTagName) |
| 4 | State | logic branch | if (memberHomeState.selectedMemberTagNames.length === 0) {; 조건: memberHomeState.selectedMemberTagNames.length === 0 |
| 5 | State | logic branch | if (memberHomeState.selectedMemberTagNames.length === 1) {; 조건: memberHomeState.selectedMemberTagNames.length === 1 |
| 6 | List | change | selectAll.addEventListener("change", () => {; 조건: keptIds = hotelHomeState.selectedReservationIds.filter((reservationId) => { |
| 7 | Section | logic branch | if (!Array.isArray(selectedMemberTagNames) \/\/ selectedMemberTagNames.length === 0) {; 조건: !Array.isArray(selectedMemberTagNames) \/\/ selectedMemberTagNames.length === 0 |
| 8 | Input | logic branch | if (searchInputSelector === ".member-tag-search-input") {; 조건: searchInputSelector === ".member-tag-search-input" |
| 9 | Section | 관련 UI 영역 | .pet-detail-radio-option; [data-state="idle"]; [data-state="selected"]; [data-action="selectMemberTagSuggestion"]; [data-action="createMemberTag"] |

## Screen-level States

| State | Trigger | Screen Response | Recovery / Next Step |
| --- | --- | --- | --- |
| Default | change on [data-state="idle"]; logic branch; change; mousedown on [data-action="selectMemberTagSuggestion"] | input.addEventListener("change", () => {; Submit or save feature data.; if (memberHomeState.selectedMemberTagNames.includes(memberTagName)) {; if (memberHomeState.selectedMemberTagNames.length === 0) {; if (memberHomeState.selectedMemberTagNames.length === 1) {; selectAll.addEventListener("change", () => {; if (!Array.isArray(selectedMemberTagNames) \/\/ selectedMemberTagNames.length === 0) {; if (searchInputSelector === ".member-tag-search-input") { | 사용자는 다음 동작을 계속 진행한다. |
| Error | 저장 또는 처리 실패 | 오류 안내를 표시한다. | 사용자는 현재 화면에서 다시 시도한다. |

## Policy Notes

- 확정된 추가 서비스 정책 없음


## Screen Header

| Field | Value |
| --- | --- |
| Platform | Web |
| User | 비즈 |
| Screen | Action: submitPetDetail |
| Entry Path | Prototype: ../../../OneDrive/문서/prototype-member-tag/src/features/member-home/member-home-renderer.js:1236 외 4개 trace |
| Primary User Goal | Action: submitPetDetail |
| Related Screens | - |

## META / Case

| Field | Value |
| --- | --- |
| 플랫폼 | Web |
| 유저 | 비즈 |
| 화면명 | Action: submitPetDetail |
| 화면 경로 | Prototype: ../../../OneDrive/문서/prototype-member-tag/src/features/member-home/member-home-renderer.js:1236 외 4개 trace |
| Case | Action: submitPetDetail |

## Context

회원 태그 기능에서 Action: submitPetDetail 흐름의 사용자 동작과 화면 반응을 정의한다. 이 최종 case는 2개의 JS-derived trace case를 근거로 집계한다.

## Screen Areas

| Screen Area | Purpose | Main UI Items | Visibility / Entry Condition |
| --- | --- | --- | --- |
| Action: submitPetDetail | Action: submitPetDetail | [data-action="submitPetDetail"]; [data-action='submitPetDetail']; [data-state] | - |

## UI Item Spec

| Platform | Screen | Screen Area | UI Item | Behavior | Exception | State | Data Impact |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Web | Action: submitPetDetail | Action: submitPetDetail | Action: submitPetDetail | Submit or save feature data.; Update enabled or disabled state. | - | button.disabled = !isReady | write feature data |

## Component Description

| Number | Type | Title | Bullets |
| --- | --- | --- | --- |
| P | Policy | Action: submitPetDetail | 확정된 추가 서비스 정책 없음 |
| 1 | Button | submitPetDetail | Submit or save feature data. |
| 2 | Button | submitPetDetail | Submit or save feature data.; Update enabled or disabled state.; button.disabled = !isReady |
| 3 | Section | 관련 UI 영역 | [data-action="submitPetDetail"]; [data-action='submitPetDetail']; [data-state] |
| 4 | State | UI/system handling | Keep the current surface open and show an error toast. |
| 5 | State | UI/system handling | Keep the control disabled without tooltip unless the UX spec requires explanatory copy. |

## Screen-level States

| State | Trigger | Screen Response | Recovery / Next Step |
| --- | --- | --- | --- |
| Default | submit | Submit or save feature data.; Update enabled or disabled state. | 사용자는 다음 동작을 계속 진행한다. |
| Error | 저장 또는 처리 실패 | 오류 안내를 표시한다. | 사용자는 현재 화면에서 다시 시도한다. |

## Policy Notes

- 확정된 추가 서비스 정책 없음


## Screen Header

| Field | Value |
| --- | --- |
| Platform | App |
| User | 비즈 |
| Screen | Action: submitPetDetail |
| Entry Path | Prototype: ../../../OneDrive/문서/prototype-member-tag/src/features/member-home/member-home-renderer.js:1236 외 4개 trace |
| Primary User Goal | Action: submitPetDetail |
| Related Screens | - |

## META / Case

| Field | Value |
| --- | --- |
| 플랫폼 | App |
| 유저 | 비즈 |
| 화면명 | Action: submitPetDetail |
| 화면 경로 | Prototype: ../../../OneDrive/문서/prototype-member-tag/src/features/member-home/member-home-renderer.js:1236 외 4개 trace |
| Case | Action: submitPetDetail |

## Context

회원 태그 기능에서 Action: submitPetDetail 흐름의 사용자 동작과 화면 반응을 정의한다. 이 최종 case는 2개의 JS-derived trace case를 근거로 집계한다.

## Screen Areas

| Screen Area | Purpose | Main UI Items | Visibility / Entry Condition |
| --- | --- | --- | --- |
| Action: submitPetDetail | Action: submitPetDetail | [data-action="submitPetDetail"]; [data-action='submitPetDetail']; [data-state] | - |

## UI Item Spec

| Platform | Screen | Screen Area | UI Item | Behavior | Exception | State | Data Impact |
| --- | --- | --- | --- | --- | --- | --- | --- |
| App | Action: submitPetDetail | Action: submitPetDetail | Action: submitPetDetail | Submit or save feature data.; Update enabled or disabled state. | - | button.disabled = !isReady | write feature data |

## Component Description

| Number | Type | Title | Bullets |
| --- | --- | --- | --- |
| P | Policy | Action: submitPetDetail | 확정된 추가 서비스 정책 없음 |
| 1 | Button | submitPetDetail | Submit or save feature data. |
| 2 | Button | submitPetDetail | Submit or save feature data.; Update enabled or disabled state.; button.disabled = !isReady |
| 3 | Section | 관련 UI 영역 | [data-action="submitPetDetail"]; [data-action='submitPetDetail']; [data-state] |
| 4 | State | UI/system handling | Keep the current surface open and show an error toast. |
| 5 | State | UI/system handling | Keep the control disabled without tooltip unless the UX spec requires explanatory copy. |

## Screen-level States

| State | Trigger | Screen Response | Recovery / Next Step |
| --- | --- | --- | --- |
| Default | submit | Submit or save feature data.; Update enabled or disabled state. | 사용자는 다음 동작을 계속 진행한다. |
| Error | 저장 또는 처리 실패 | 오류 안내를 표시한다. | 사용자는 현재 화면에서 다시 시도한다. |

## Policy Notes

- 확정된 추가 서비스 정책 없음


## Screen Header

| Field | Value |
| --- | --- |
| Platform | Web |
| User | 비즈 |
| Screen | Area: memberFilterRow |
| Entry Path | Prototype: ../../../OneDrive/문서/prototype-member-tag/src/features/member-home/member-home-renderer.js:1462 |
| Primary User Goal | Area: memberFilterRow |
| Related Screens | - |

## META / Case

| Field | Value |
| --- | --- |
| 플랫폼 | Web |
| 유저 | 비즈 |
| 화면명 | Area: memberFilterRow |
| 화면 경로 | Prototype: ../../../OneDrive/문서/prototype-member-tag/src/features/member-home/member-home-renderer.js:1462 |
| Case | Area: memberFilterRow |

## Context

회원 태그 기능에서 Area: memberFilterRow 흐름의 사용자 동작과 화면 반응을 정의한다. 이 최종 case는 1개의 JS-derived trace case를 근거로 집계한다.

## Screen Areas

| Screen Area | Purpose | Main UI Items | Visibility / Entry Condition |
| --- | --- | --- | --- |
| Area: memberFilterRow | Area: memberFilterRow | [data-area="memberFilterRow"] | !isMobileLayout(); memberHomeState.isFilterPanelOpen |

## UI Item Spec

| Platform | Screen | Screen Area | UI Item | Behavior | Exception | State | Data Impact |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Web | Area: memberFilterRow | Area: memberFilterRow | Area: memberFilterRow | Submit or save feature data. | - | !isMobileLayout(); memberHomeState.isFilterPanelOpen | write feature data |

## Component Description

| Number | Type | Title | Bullets |
| --- | --- | --- | --- |
| P | Policy | Area: memberFilterRow | 확정된 추가 서비스 정책 없음 |
| 1 | Button | memberFilterRow | Submit or save feature data.; 조건: !isMobileLayout(); 조건: memberHomeState.isFilterPanelOpen |
| 2 | Section | 관련 UI 영역 | [data-area="memberFilterRow"] |
| 3 | State | UI/system handling | Keep the current surface open and show an error toast. |

## Screen-level States

| State | Trigger | Screen Response | Recovery / Next Step |
| --- | --- | --- | --- |
| Default | logic branch | Submit or save feature data. | 사용자는 다음 동작을 계속 진행한다. |
| Error | 저장 또는 처리 실패 | 오류 안내를 표시한다. | 사용자는 현재 화면에서 다시 시도한다. |

## Policy Notes

- 확정된 추가 서비스 정책 없음


## Screen Header

| Field | Value |
| --- | --- |
| Platform | App |
| User | 비즈 |
| Screen | Area: memberFilterRow |
| Entry Path | Prototype: ../../../OneDrive/문서/prototype-member-tag/src/features/member-home/member-home-renderer.js:1462 |
| Primary User Goal | Area: memberFilterRow |
| Related Screens | - |

## META / Case

| Field | Value |
| --- | --- |
| 플랫폼 | App |
| 유저 | 비즈 |
| 화면명 | Area: memberFilterRow |
| 화면 경로 | Prototype: ../../../OneDrive/문서/prototype-member-tag/src/features/member-home/member-home-renderer.js:1462 |
| Case | Area: memberFilterRow |

## Context

회원 태그 기능에서 Area: memberFilterRow 흐름의 사용자 동작과 화면 반응을 정의한다. 이 최종 case는 1개의 JS-derived trace case를 근거로 집계한다.

## Screen Areas

| Screen Area | Purpose | Main UI Items | Visibility / Entry Condition |
| --- | --- | --- | --- |
| Area: memberFilterRow | Area: memberFilterRow | [data-area="memberFilterRow"] | !isMobileLayout(); memberHomeState.isFilterPanelOpen |

## UI Item Spec

| Platform | Screen | Screen Area | UI Item | Behavior | Exception | State | Data Impact |
| --- | --- | --- | --- | --- | --- | --- | --- |
| App | Area: memberFilterRow | Area: memberFilterRow | Area: memberFilterRow | Submit or save feature data. | - | !isMobileLayout(); memberHomeState.isFilterPanelOpen | write feature data |

## Component Description

| Number | Type | Title | Bullets |
| --- | --- | --- | --- |
| P | Policy | Area: memberFilterRow | 확정된 추가 서비스 정책 없음 |
| 1 | Button | memberFilterRow | Submit or save feature data.; 조건: !isMobileLayout(); 조건: memberHomeState.isFilterPanelOpen |
| 2 | Section | 관련 UI 영역 | [data-area="memberFilterRow"] |
| 3 | State | UI/system handling | Keep the current surface open and show an error toast. |

## Screen-level States

| State | Trigger | Screen Response | Recovery / Next Step |
| --- | --- | --- | --- |
| Default | logic branch | Submit or save feature data. | 사용자는 다음 동작을 계속 진행한다. |
| Error | 저장 또는 처리 실패 | 오류 안내를 표시한다. | 사용자는 현재 화면에서 다시 시도한다. |

## Policy Notes

- 확정된 추가 서비스 정책 없음


## Screen Header

| Field | Value |
| --- | --- |
| Platform | Web |
| User | 비즈 |
| Screen | Feature mode transition |
| Entry Path | Prototype: ../../../OneDrive/문서/prototype-member-tag/src/features/member-home/member-home-renderer.js:1744 외 10개 trace |
| Primary User Goal | Feature mode transition |
| Related Screens | - |

## META / Case

| Field | Value |
| --- | --- |
| 플랫폼 | Web |
| 유저 | 비즈 |
| 화면명 | Feature mode transition |
| 화면 경로 | Prototype: ../../../OneDrive/문서/prototype-member-tag/src/features/member-home/member-home-renderer.js:1744 외 10개 trace |
| Case | Feature mode transition |

## Context

회원 태그 기능에서 Feature mode transition 흐름의 사용자 동작과 화면 반응을 정의한다. 이 최종 case는 10개의 JS-derived trace case를 근거로 집계한다.

## Screen Areas

| Screen Area | Purpose | Main UI Items | Visibility / Entry Condition |
| --- | --- | --- | --- |
| Feature mode transition | Feature mode transition | - | !memberHomeState.tagFilterQuery && (!memberHomeState.selectedMemberTagNames.length \/\/ options.clearMode !== "selection"); hotelHomeState.isModeMenuOpen; activeFilters.includes(filterKey); memberEditState.activeSheet === "petDetail"; memberEditState.activeSheet === "addPet"; memberEditState.activeAlert === "deleteAll"; !Array.isArray(activeFilters) \/\/ activeFilters.length === 0; container.contains(document.activeElement) \/\/ isMobileSearchOpen |

## UI Item Spec

| Platform | Screen | Screen Area | UI Item | Behavior | Exception | State | Data Impact |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Web | Feature mode transition | Feature mode transition | Feature mode transition | if (!memberHomeState.tagFilterQuery && (!memberHomeState.selectedMemberTagNames.length \/\/ options.clearMode !== "selection")) {; Submit or save feature data.; if (activeFilters.includes(filterKey)) {; if (!Array.isArray(activeFilters) \/\/ activeFilters.length === 0) {; input.addEventListener("blur", () => {; if (container.contains(document.activeElement) \/\/ isMobileSearchOpen) { | - | !memberHomeState.tagFilterQuery && (!memberHomeState.selectedMemberTagNames.length \/\/ options.clearMode !== "selection"); hotelHomeState.isModeMenuOpen; activeFilters.includes(filterKey); memberEditState.activeSheet === "petDetail"; memberEditState.activeSheet === "addPet"; memberEditState.activeAlert === "deleteAll"; !Array.isArray(activeFilters) \/\/ activeFilters.length === 0; container.contains(document.activeElement) \/\/ isMobileSearchOpen | mutate form state; write feature data; delete or remove data |

## Component Description

| Number | Type | Title | Bullets |
| --- | --- | --- | --- |
| P | Policy | Feature mode transition | 확정된 추가 서비스 정책 없음 |
| 1 | State | logic branch | if (!memberHomeState.tagFilterQuery && (!memberHomeState.selectedMemberTagNames.length \/\/ options.clearMode !== "selection")) {; 조건: !memberHomeState.tagFilterQuery && (!memberHomeState.selectedMemberTagNames.length \/\/ options.clearMode !== "selection") |
| 2 | Button | logic branch | Submit or save feature data.; 조건: hotelHomeState.isModeMenuOpen |
| 3 | Section | logic branch | if (activeFilters.includes(filterKey)) {; 조건: activeFilters.includes(filterKey) |
| 4 | Button | submit | Submit or save feature data.; 조건: memberEditState.activeSheet === "petDetail" |
| 5 | Button | submit | Submit or save feature data.; 조건: memberEditState.activeSheet === "addPet" |
| 6 | Button | submit | Submit or save feature data.; 조건: memberEditState.activeAlert === "deleteAll" |
| 7 | Section | logic branch | if (!Array.isArray(activeFilters) \/\/ activeFilters.length === 0) {; 조건: !Array.isArray(activeFilters) \/\/ activeFilters.length === 0 |
| 8 | Input | blur | input.addEventListener("blur", () => {; 조건: container.contains(document.activeElement) \/\/ isMobileSearchOpen |
| 9 | State | UI/system handling | Keep the current surface open and show an error toast. |

## Screen-level States

| State | Trigger | Screen Response | Recovery / Next Step |
| --- | --- | --- | --- |
| Default | logic branch; submit; blur | if (!memberHomeState.tagFilterQuery && (!memberHomeState.selectedMemberTagNames.length \/\/ options.clearMode !== "selection")) {; Submit or save feature data.; if (activeFilters.includes(filterKey)) {; if (!Array.isArray(activeFilters) \/\/ activeFilters.length === 0) {; input.addEventListener("blur", () => {; if (container.contains(document.activeElement) \/\/ isMobileSearchOpen) { | 사용자는 다음 동작을 계속 진행한다. |
| Error | 저장 또는 처리 실패 | 오류 안내를 표시한다. | 사용자는 현재 화면에서 다시 시도한다. |

## Policy Notes

- 확정된 추가 서비스 정책 없음


## Screen Header

| Field | Value |
| --- | --- |
| Platform | App |
| User | 비즈 |
| Screen | Feature mode transition |
| Entry Path | Prototype: ../../../OneDrive/문서/prototype-member-tag/src/features/member-home/member-home-renderer.js:1744 외 10개 trace |
| Primary User Goal | Feature mode transition |
| Related Screens | - |

## META / Case

| Field | Value |
| --- | --- |
| 플랫폼 | App |
| 유저 | 비즈 |
| 화면명 | Feature mode transition |
| 화면 경로 | Prototype: ../../../OneDrive/문서/prototype-member-tag/src/features/member-home/member-home-renderer.js:1744 외 10개 trace |
| Case | Feature mode transition |

## Context

회원 태그 기능에서 Feature mode transition 흐름의 사용자 동작과 화면 반응을 정의한다. 이 최종 case는 10개의 JS-derived trace case를 근거로 집계한다.

## Screen Areas

| Screen Area | Purpose | Main UI Items | Visibility / Entry Condition |
| --- | --- | --- | --- |
| Feature mode transition | Feature mode transition | - | !memberHomeState.tagFilterQuery && (!memberHomeState.selectedMemberTagNames.length \/\/ options.clearMode !== "selection"); hotelHomeState.isModeMenuOpen; activeFilters.includes(filterKey); memberEditState.activeSheet === "petDetail"; memberEditState.activeSheet === "addPet"; memberEditState.activeAlert === "deleteAll"; !Array.isArray(activeFilters) \/\/ activeFilters.length === 0; container.contains(document.activeElement) \/\/ isMobileSearchOpen |

## UI Item Spec

| Platform | Screen | Screen Area | UI Item | Behavior | Exception | State | Data Impact |
| --- | --- | --- | --- | --- | --- | --- | --- |
| App | Feature mode transition | Feature mode transition | Feature mode transition | if (!memberHomeState.tagFilterQuery && (!memberHomeState.selectedMemberTagNames.length \/\/ options.clearMode !== "selection")) {; Submit or save feature data.; if (activeFilters.includes(filterKey)) {; if (!Array.isArray(activeFilters) \/\/ activeFilters.length === 0) {; input.addEventListener("blur", () => {; if (container.contains(document.activeElement) \/\/ isMobileSearchOpen) { | - | !memberHomeState.tagFilterQuery && (!memberHomeState.selectedMemberTagNames.length \/\/ options.clearMode !== "selection"); hotelHomeState.isModeMenuOpen; activeFilters.includes(filterKey); memberEditState.activeSheet === "petDetail"; memberEditState.activeSheet === "addPet"; memberEditState.activeAlert === "deleteAll"; !Array.isArray(activeFilters) \/\/ activeFilters.length === 0; container.contains(document.activeElement) \/\/ isMobileSearchOpen | mutate form state; write feature data; delete or remove data |

## Component Description

| Number | Type | Title | Bullets |
| --- | --- | --- | --- |
| P | Policy | Feature mode transition | 확정된 추가 서비스 정책 없음 |
| 1 | State | logic branch | if (!memberHomeState.tagFilterQuery && (!memberHomeState.selectedMemberTagNames.length \/\/ options.clearMode !== "selection")) {; 조건: !memberHomeState.tagFilterQuery && (!memberHomeState.selectedMemberTagNames.length \/\/ options.clearMode !== "selection") |
| 2 | Button | logic branch | Submit or save feature data.; 조건: hotelHomeState.isModeMenuOpen |
| 3 | Section | logic branch | if (activeFilters.includes(filterKey)) {; 조건: activeFilters.includes(filterKey) |
| 4 | Button | submit | Submit or save feature data.; 조건: memberEditState.activeSheet === "petDetail" |
| 5 | Button | submit | Submit or save feature data.; 조건: memberEditState.activeSheet === "addPet" |
| 6 | Button | submit | Submit or save feature data.; 조건: memberEditState.activeAlert === "deleteAll" |
| 7 | Section | logic branch | if (!Array.isArray(activeFilters) \/\/ activeFilters.length === 0) {; 조건: !Array.isArray(activeFilters) \/\/ activeFilters.length === 0 |
| 8 | Input | blur | input.addEventListener("blur", () => {; 조건: container.contains(document.activeElement) \/\/ isMobileSearchOpen |
| 9 | State | UI/system handling | Keep the current surface open and show an error toast. |

## Screen-level States

| State | Trigger | Screen Response | Recovery / Next Step |
| --- | --- | --- | --- |
| Default | logic branch; submit; blur | if (!memberHomeState.tagFilterQuery && (!memberHomeState.selectedMemberTagNames.length \/\/ options.clearMode !== "selection")) {; Submit or save feature data.; if (activeFilters.includes(filterKey)) {; if (!Array.isArray(activeFilters) \/\/ activeFilters.length === 0) {; input.addEventListener("blur", () => {; if (container.contains(document.activeElement) \/\/ isMobileSearchOpen) { | 사용자는 다음 동작을 계속 진행한다. |
| Error | 저장 또는 처리 실패 | 오류 안내를 표시한다. | 사용자는 현재 화면에서 다시 시도한다. |

## Policy Notes

- 확정된 추가 서비스 정책 없음


## Screen Header

| Field | Value |
| --- | --- |
| Platform | Web |
| User | 비즈 |
| Screen | Logic in member-detail-renderer.js |
| Entry Path | Prototype: ../../../OneDrive/문서/prototype-member-tag/src/features/member-detail/member-detail-renderer.js:261 외 5개 trace |
| Primary User Goal | Logic in member-detail-renderer.js |
| Related Screens | - |

## META / Case

| Field | Value |
| --- | --- |
| 플랫폼 | Web |
| 유저 | 비즈 |
| 화면명 | Logic in member-detail-renderer.js |
| 화면 경로 | Prototype: ../../../OneDrive/문서/prototype-member-tag/src/features/member-detail/member-detail-renderer.js:261 외 5개 trace |
| Case | Logic in member-detail-renderer.js |

## Context

회원 태그 기능에서 Logic in member-detail-renderer.js 흐름의 사용자 동작과 화면 반응을 정의한다. 이 최종 case는 5개의 JS-derived trace case를 근거로 집계한다.

## Screen Areas

| Screen Area | Purpose | Main UI Items | Visibility / Entry Condition |
| --- | --- | --- | --- |
| Logic in member-detail-renderer.js | Logic in member-detail-renderer.js | [data-state] | excessCount > 0 |

## UI Item Spec

| Platform | Screen | Screen Area | UI Item | Behavior | Exception | State | Data Impact |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Web | Logic in member-detail-renderer.js | Logic in member-detail-renderer.js | Logic in member-detail-renderer.js | memoField.addEventListener("input", (event) => {; closeButton.addEventListener("click", () => {; baseAddressInput.addEventListener("input", (event) => {; detailAddressInput.addEventListener("input", (event) => {; if (excessCount > 0) { | - | excessCount > 0 | write feature data |

## Component Description

| Number | Type | Title | Bullets |
| --- | --- | --- | --- |
| P | Policy | Logic in member-detail-renderer.js | 확정된 추가 서비스 정책 없음 |
| 1 | Input | input on [data-state] | memoField.addEventListener("input", (event) => { |
| 2 | Button | click | closeButton.addEventListener("click", () => { |
| 3 | Input | input | baseAddressInput.addEventListener("input", (event) => { |
| 4 | Input | input | detailAddressInput.addEventListener("input", (event) => { |
| 5 | Section | logic branch | if (excessCount > 0) {; 조건: excessCount > 0 |
| 6 | Section | 관련 UI 영역 | [data-state] |

## Screen-level States

| State | Trigger | Screen Response | Recovery / Next Step |
| --- | --- | --- | --- |
| Default | input on [data-state]; click; input; logic branch | memoField.addEventListener("input", (event) => {; closeButton.addEventListener("click", () => {; baseAddressInput.addEventListener("input", (event) => {; detailAddressInput.addEventListener("input", (event) => {; if (excessCount > 0) { | 사용자는 다음 동작을 계속 진행한다. |
| Error | 저장 또는 처리 실패 | 오류 안내를 표시한다. | 사용자는 현재 화면에서 다시 시도한다. |

## Policy Notes

- 확정된 추가 서비스 정책 없음


## Screen Header

| Field | Value |
| --- | --- |
| Platform | App |
| User | 비즈 |
| Screen | Logic in member-detail-renderer.js |
| Entry Path | Prototype: ../../../OneDrive/문서/prototype-member-tag/src/features/member-detail/member-detail-renderer.js:261 외 5개 trace |
| Primary User Goal | Logic in member-detail-renderer.js |
| Related Screens | - |

## META / Case

| Field | Value |
| --- | --- |
| 플랫폼 | App |
| 유저 | 비즈 |
| 화면명 | Logic in member-detail-renderer.js |
| 화면 경로 | Prototype: ../../../OneDrive/문서/prototype-member-tag/src/features/member-detail/member-detail-renderer.js:261 외 5개 trace |
| Case | Logic in member-detail-renderer.js |

## Context

회원 태그 기능에서 Logic in member-detail-renderer.js 흐름의 사용자 동작과 화면 반응을 정의한다. 이 최종 case는 5개의 JS-derived trace case를 근거로 집계한다.

## Screen Areas

| Screen Area | Purpose | Main UI Items | Visibility / Entry Condition |
| --- | --- | --- | --- |
| Logic in member-detail-renderer.js | Logic in member-detail-renderer.js | [data-state] | excessCount > 0 |

## UI Item Spec

| Platform | Screen | Screen Area | UI Item | Behavior | Exception | State | Data Impact |
| --- | --- | --- | --- | --- | --- | --- | --- |
| App | Logic in member-detail-renderer.js | Logic in member-detail-renderer.js | Logic in member-detail-renderer.js | memoField.addEventListener("input", (event) => {; closeButton.addEventListener("click", () => {; baseAddressInput.addEventListener("input", (event) => {; detailAddressInput.addEventListener("input", (event) => {; if (excessCount > 0) { | - | excessCount > 0 | write feature data |

## Component Description

| Number | Type | Title | Bullets |
| --- | --- | --- | --- |
| P | Policy | Logic in member-detail-renderer.js | 확정된 추가 서비스 정책 없음 |
| 1 | Input | input on [data-state] | memoField.addEventListener("input", (event) => { |
| 2 | Button | click | closeButton.addEventListener("click", () => { |
| 3 | Input | input | baseAddressInput.addEventListener("input", (event) => { |
| 4 | Input | input | detailAddressInput.addEventListener("input", (event) => { |
| 5 | Section | logic branch | if (excessCount > 0) {; 조건: excessCount > 0 |
| 6 | Section | 관련 UI 영역 | [data-state] |

## Screen-level States

| State | Trigger | Screen Response | Recovery / Next Step |
| --- | --- | --- | --- |
| Default | input on [data-state]; click; input; logic branch | memoField.addEventListener("input", (event) => {; closeButton.addEventListener("click", () => {; baseAddressInput.addEventListener("input", (event) => {; detailAddressInput.addEventListener("input", (event) => {; if (excessCount > 0) { | 사용자는 다음 동작을 계속 진행한다. |
| Error | 저장 또는 처리 실패 | 오류 안내를 표시한다. | 사용자는 현재 화면에서 다시 시도한다. |

## Policy Notes

- 확정된 추가 서비스 정책 없음


## Screen Header

| Field | Value |
| --- | --- |
| Platform | Web |
| User | 비즈 |
| Screen | Action: submitOwnerDetail |
| Entry Path | Prototype: ../../../OneDrive/문서/prototype-member-tag/src/features/member-detail/member-detail-renderer.js:723 외 2개 trace |
| Primary User Goal | Action: submitOwnerDetail |
| Related Screens | - |

## META / Case

| Field | Value |
| --- | --- |
| 플랫폼 | Web |
| 유저 | 비즈 |
| 화면명 | Action: submitOwnerDetail |
| 화면 경로 | Prototype: ../../../OneDrive/문서/prototype-member-tag/src/features/member-detail/member-detail-renderer.js:723 외 2개 trace |
| Case | Action: submitOwnerDetail |

## Context

회원 태그 기능에서 Action: submitOwnerDetail 흐름의 사용자 동작과 화면 반응을 정의한다. 이 최종 case는 2개의 JS-derived trace case를 근거로 집계한다.

## Screen Areas

| Screen Area | Purpose | Main UI Items | Visibility / Entry Condition |
| --- | --- | --- | --- |
| Action: submitOwnerDetail | Action: submitOwnerDetail | [data-action="submitOwnerDetail"] | - |

## UI Item Spec

| Platform | Screen | Screen Area | UI Item | Behavior | Exception | State | Data Impact |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Web | Action: submitOwnerDetail | Action: submitOwnerDetail | Action: submitOwnerDetail | Submit or save feature data. | - | - | write feature data |

## Component Description

| Number | Type | Title | Bullets |
| --- | --- | --- | --- |
| P | Policy | Action: submitOwnerDetail | 확정된 추가 서비스 정책 없음 |
| 1 | Button | submitOwnerDetail | Submit or save feature data. |
| 2 | Section | 관련 UI 영역 | [data-action="submitOwnerDetail"] |
| 3 | State | UI/system handling | Keep the current surface open and show an error toast. |

## Screen-level States

| State | Trigger | Screen Response | Recovery / Next Step |
| --- | --- | --- | --- |
| Default | submit | Submit or save feature data. | 사용자는 다음 동작을 계속 진행한다. |
| Error | 저장 또는 처리 실패 | 오류 안내를 표시한다. | 사용자는 현재 화면에서 다시 시도한다. |

## Policy Notes

- 확정된 추가 서비스 정책 없음


## Screen Header

| Field | Value |
| --- | --- |
| Platform | App |
| User | 비즈 |
| Screen | Action: submitOwnerDetail |
| Entry Path | Prototype: ../../../OneDrive/문서/prototype-member-tag/src/features/member-detail/member-detail-renderer.js:727 |
| Primary User Goal | Action: submitOwnerDetail |
| Related Screens | - |

## META / Case

| Field | Value |
| --- | --- |
| 플랫폼 | App |
| 유저 | 비즈 |
| 화면명 | Action: submitOwnerDetail |
| 화면 경로 | Prototype: ../../../OneDrive/문서/prototype-member-tag/src/features/member-detail/member-detail-renderer.js:727 |
| Case | Action: submitOwnerDetail |

## Context

회원 태그 기능에서 Action: submitOwnerDetail 흐름의 사용자 동작과 화면 반응을 정의한다. 이 최종 case는 1개의 JS-derived trace case를 근거로 집계한다.

## Screen Areas

| Screen Area | Purpose | Main UI Items | Visibility / Entry Condition |
| --- | --- | --- | --- |
| Action: submitOwnerDetail | Action: submitOwnerDetail | [data-action="submitOwnerDetail"] | - |

## UI Item Spec

| Platform | Screen | Screen Area | UI Item | Behavior | Exception | State | Data Impact |
| --- | --- | --- | --- | --- | --- | --- | --- |
| App | Action: submitOwnerDetail | Action: submitOwnerDetail | Action: submitOwnerDetail | Submit or save feature data. | - | - | write feature data |

## Component Description

| Number | Type | Title | Bullets |
| --- | --- | --- | --- |
| P | Policy | Action: submitOwnerDetail | 확정된 추가 서비스 정책 없음 |
| 1 | Button | submitOwnerDetail | Submit or save feature data. |
| 2 | Section | 관련 UI 영역 | [data-action="submitOwnerDetail"] |
| 3 | State | UI/system handling | Keep the current surface open and show an error toast. |

## Screen-level States

| State | Trigger | Screen Response | Recovery / Next Step |
| --- | --- | --- | --- |
| Default | submit | Submit or save feature data. | 사용자는 다음 동작을 계속 진행한다. |
| Error | 저장 또는 처리 실패 | 오류 안내를 표시한다. | 사용자는 현재 화면에서 다시 시도한다. |

## Policy Notes

- 확정된 추가 서비스 정책 없음


## Screen Header

| Field | Value |
| --- | --- |
| Platform | Web |
| User | 비즈 |
| Screen | Logic in hotel-home-renderer.js |
| Entry Path | Prototype: ../../../OneDrive/문서/prototype-member-tag/src/features/hotel-home/hotel-home-renderer.js:131 외 5개 trace |
| Primary User Goal | Logic in hotel-home-renderer.js |
| Related Screens | - |

## META / Case

| Field | Value |
| --- | --- |
| 플랫폼 | Web |
| 유저 | 비즈 |
| 화면명 | Logic in hotel-home-renderer.js |
| 화면 경로 | Prototype: ../../../OneDrive/문서/prototype-member-tag/src/features/hotel-home/hotel-home-renderer.js:131 외 5개 trace |
| Case | Logic in hotel-home-renderer.js |

## Context

회원 태그 기능에서 Logic in hotel-home-renderer.js 흐름의 사용자 동작과 화면 반응을 정의한다. 이 최종 case는 6개의 JS-derived trace case를 근거로 집계한다.

## Screen Areas

| Screen Area | Purpose | Main UI Items | Visibility / Entry Condition |
| --- | --- | --- | --- |
| Logic in hotel-home-renderer.js | Logic in hotel-home-renderer.js | - | nextMonth = shiftMonth(hotelHomeState.currentMonth, direction === "prev" ? -1 : 1) |

## UI Item Spec

| Platform | Screen | Screen Area | UI Item | Behavior | Exception | State | Data Impact |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Web | Logic in hotel-home-renderer.js | Logic in hotel-home-renderer.js | Logic in hotel-home-renderer.js | titleRow.addEventListener("click", () => {; button.addEventListener("click", () => {; closeButton.addEventListener("click", () => {; checkbox.addEventListener("change", () => { | - | nextMonth = shiftMonth(hotelHomeState.currentMonth, direction === "prev" ? -1 : 1) | write feature data; mutate form state |

## Component Description

| Number | Type | Title | Bullets |
| --- | --- | --- | --- |
| P | Policy | Logic in hotel-home-renderer.js | 확정된 추가 서비스 정책 없음 |
| 1 | Button | click | titleRow.addEventListener("click", () => { |
| 2 | Button | click | button.addEventListener("click", () => { |
| 3 | Button | click | closeButton.addEventListener("click", () => { |
| 4 | List | change | checkbox.addEventListener("change", () => { |
| 5 | Button | click | button.addEventListener("click", () => {; 조건: nextMonth = shiftMonth(hotelHomeState.currentMonth, direction === "prev" ? -1 : 1) |

## Screen-level States

| State | Trigger | Screen Response | Recovery / Next Step |
| --- | --- | --- | --- |
| Default | click; change | titleRow.addEventListener("click", () => {; button.addEventListener("click", () => {; closeButton.addEventListener("click", () => {; checkbox.addEventListener("change", () => { | 사용자는 다음 동작을 계속 진행한다. |
| Error | 저장 또는 처리 실패 | 오류 안내를 표시한다. | 사용자는 현재 화면에서 다시 시도한다. |

## Policy Notes

- 확정된 추가 서비스 정책 없음


## Screen Header

| Field | Value |
| --- | --- |
| Platform | App |
| User | 비즈 |
| Screen | Logic in hotel-home-renderer.js |
| Entry Path | Prototype: ../../../OneDrive/문서/prototype-member-tag/src/features/hotel-home/hotel-home-renderer.js:131 외 4개 trace |
| Primary User Goal | Logic in hotel-home-renderer.js |
| Related Screens | - |

## META / Case

| Field | Value |
| --- | --- |
| 플랫폼 | App |
| 유저 | 비즈 |
| 화면명 | Logic in hotel-home-renderer.js |
| 화면 경로 | Prototype: ../../../OneDrive/문서/prototype-member-tag/src/features/hotel-home/hotel-home-renderer.js:131 외 4개 trace |
| Case | Logic in hotel-home-renderer.js |

## Context

회원 태그 기능에서 Logic in hotel-home-renderer.js 흐름의 사용자 동작과 화면 반응을 정의한다. 이 최종 case는 5개의 JS-derived trace case를 근거로 집계한다.

## Screen Areas

| Screen Area | Purpose | Main UI Items | Visibility / Entry Condition |
| --- | --- | --- | --- |
| Logic in hotel-home-renderer.js | Logic in hotel-home-renderer.js | - | nextMonth = shiftMonth(hotelHomeState.currentMonth, direction === "prev" ? -1 : 1) |

## UI Item Spec

| Platform | Screen | Screen Area | UI Item | Behavior | Exception | State | Data Impact |
| --- | --- | --- | --- | --- | --- | --- | --- |
| App | Logic in hotel-home-renderer.js | Logic in hotel-home-renderer.js | Logic in hotel-home-renderer.js | titleRow.addEventListener("click", () => {; closeButton.addEventListener("click", () => {; checkbox.addEventListener("change", () => {; button.addEventListener("click", () => { | - | nextMonth = shiftMonth(hotelHomeState.currentMonth, direction === "prev" ? -1 : 1) | write feature data; mutate form state |

## Component Description

| Number | Type | Title | Bullets |
| --- | --- | --- | --- |
| P | Policy | Logic in hotel-home-renderer.js | 확정된 추가 서비스 정책 없음 |
| 1 | Button | click | titleRow.addEventListener("click", () => { |
| 2 | Button | click | closeButton.addEventListener("click", () => { |
| 3 | List | change | checkbox.addEventListener("change", () => { |
| 4 | Button | click | button.addEventListener("click", () => { |
| 5 | Button | click | button.addEventListener("click", () => {; 조건: nextMonth = shiftMonth(hotelHomeState.currentMonth, direction === "prev" ? -1 : 1) |

## Screen-level States

| State | Trigger | Screen Response | Recovery / Next Step |
| --- | --- | --- | --- |
| Default | click; change | titleRow.addEventListener("click", () => {; closeButton.addEventListener("click", () => {; checkbox.addEventListener("change", () => {; button.addEventListener("click", () => { | 사용자는 다음 동작을 계속 진행한다. |
| Error | 저장 또는 처리 실패 | 오류 안내를 표시한다. | 사용자는 현재 화면에서 다시 시도한다. |

## Policy Notes

- 확정된 추가 서비스 정책 없음


## Screen Header

| Field | Value |
| --- | --- |
| Platform | Web |
| User | 비즈 |
| Screen | Logic in member-registration-renderer.js |
| Entry Path | Prototype: ../../../OneDrive/문서/prototype-member-tag/src/features/member-registration/member-registration-renderer.js:178 외 2개 trace |
| Primary User Goal | Logic in member-registration-renderer.js |
| Related Screens | - |

## META / Case

| Field | Value |
| --- | --- |
| 플랫폼 | Web |
| 유저 | 비즈 |
| 화면명 | Logic in member-registration-renderer.js |
| 화면 경로 | Prototype: ../../../OneDrive/문서/prototype-member-tag/src/features/member-registration/member-registration-renderer.js:178 외 2개 trace |
| Case | Logic in member-registration-renderer.js |

## Context

회원 태그 기능에서 Logic in member-registration-renderer.js 흐름의 사용자 동작과 화면 반응을 정의한다. 이 최종 case는 3개의 JS-derived trace case를 근거로 집계한다.

## Screen Areas

| Screen Area | Purpose | Main UI Items | Visibility / Entry Condition |
| --- | --- | --- | --- |
| Logic in member-registration-renderer.js | Logic in member-registration-renderer.js | - | isMobileLayout() |

## UI Item Spec

| Platform | Screen | Screen Area | UI Item | Behavior | Exception | State | Data Impact |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Web | Logic in member-registration-renderer.js | Logic in member-registration-renderer.js | Logic in member-registration-renderer.js | button.addEventListener("click", () => {; if (isMobileLayout()) {; closeButton.addEventListener("click", () => { | - | isMobileLayout() | write feature data |

## Component Description

| Number | Type | Title | Bullets |
| --- | --- | --- | --- |
| P | Policy | Logic in member-registration-renderer.js | 확정된 추가 서비스 정책 없음 |
| 1 | Button | click | button.addEventListener("click", () => {; 조건: isMobileLayout() |
| 2 | Section | logic branch | if (isMobileLayout()) {; 조건: isMobileLayout() |
| 3 | Button | click | closeButton.addEventListener("click", () => { |

## Screen-level States

| State | Trigger | Screen Response | Recovery / Next Step |
| --- | --- | --- | --- |
| Default | click; logic branch | button.addEventListener("click", () => {; if (isMobileLayout()) {; closeButton.addEventListener("click", () => { | 사용자는 다음 동작을 계속 진행한다. |
| Error | 저장 또는 처리 실패 | 오류 안내를 표시한다. | 사용자는 현재 화면에서 다시 시도한다. |

## Policy Notes

- 확정된 추가 서비스 정책 없음


## Screen Header

| Field | Value |
| --- | --- |
| Platform | App |
| User | 비즈 |
| Screen | Logic in member-registration-renderer.js |
| Entry Path | Prototype: ../../../OneDrive/문서/prototype-member-tag/src/features/member-registration/member-registration-renderer.js:178 외 2개 trace |
| Primary User Goal | Logic in member-registration-renderer.js |
| Related Screens | - |

## META / Case

| Field | Value |
| --- | --- |
| 플랫폼 | App |
| 유저 | 비즈 |
| 화면명 | Logic in member-registration-renderer.js |
| 화면 경로 | Prototype: ../../../OneDrive/문서/prototype-member-tag/src/features/member-registration/member-registration-renderer.js:178 외 2개 trace |
| Case | Logic in member-registration-renderer.js |

## Context

회원 태그 기능에서 Logic in member-registration-renderer.js 흐름의 사용자 동작과 화면 반응을 정의한다. 이 최종 case는 3개의 JS-derived trace case를 근거로 집계한다.

## Screen Areas

| Screen Area | Purpose | Main UI Items | Visibility / Entry Condition |
| --- | --- | --- | --- |
| Logic in member-registration-renderer.js | Logic in member-registration-renderer.js | - | isMobileLayout() |

## UI Item Spec

| Platform | Screen | Screen Area | UI Item | Behavior | Exception | State | Data Impact |
| --- | --- | --- | --- | --- | --- | --- | --- |
| App | Logic in member-registration-renderer.js | Logic in member-registration-renderer.js | Logic in member-registration-renderer.js | button.addEventListener("click", () => {; if (isMobileLayout()) {; closeButton.addEventListener("click", () => { | - | isMobileLayout() | write feature data |

## Component Description

| Number | Type | Title | Bullets |
| --- | --- | --- | --- |
| P | Policy | Logic in member-registration-renderer.js | 확정된 추가 서비스 정책 없음 |
| 1 | Button | click | button.addEventListener("click", () => {; 조건: isMobileLayout() |
| 2 | Section | logic branch | if (isMobileLayout()) {; 조건: isMobileLayout() |
| 3 | Button | click | closeButton.addEventListener("click", () => { |

## Screen-level States

| State | Trigger | Screen Response | Recovery / Next Step |
| --- | --- | --- | --- |
| Default | click; logic branch | button.addEventListener("click", () => {; if (isMobileLayout()) {; closeButton.addEventListener("click", () => { | 사용자는 다음 동작을 계속 진행한다. |
| Error | 저장 또는 처리 실패 | 오류 안내를 표시한다. | 사용자는 현재 화면에서 다시 시도한다. |

## Policy Notes

- 확정된 추가 서비스 정책 없음


## Screen Header

| Field | Value |
| --- | --- |
| Platform | Web |
| User | 비즈 |
| Screen | Action: submitAddPet |
| Entry Path | Prototype: ../../../OneDrive/문서/prototype-member-tag/src/features/member-registration/member-registration-renderer.js:749 외 1개 trace |
| Primary User Goal | Action: submitAddPet |
| Related Screens | - |

## META / Case

| Field | Value |
| --- | --- |
| 플랫폼 | Web |
| 유저 | 비즈 |
| 화면명 | Action: submitAddPet |
| 화면 경로 | Prototype: ../../../OneDrive/문서/prototype-member-tag/src/features/member-registration/member-registration-renderer.js:749 외 1개 trace |
| Case | Action: submitAddPet |

## Context

회원 태그 기능에서 Action: submitAddPet 흐름의 사용자 동작과 화면 반응을 정의한다. 이 최종 case는 1개의 JS-derived trace case를 근거로 집계한다.

## Screen Areas

| Screen Area | Purpose | Main UI Items | Visibility / Entry Condition |
| --- | --- | --- | --- |
| Action: submitAddPet | Action: submitAddPet | [data-action="submitAddPet"] | - |

## UI Item Spec

| Platform | Screen | Screen Area | UI Item | Behavior | Exception | State | Data Impact |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Web | Action: submitAddPet | Action: submitAddPet | Action: submitAddPet | Submit or save feature data. | - | - | write feature data |

## Component Description

| Number | Type | Title | Bullets |
| --- | --- | --- | --- |
| P | Policy | Action: submitAddPet | 확정된 추가 서비스 정책 없음 |
| 1 | Button | submitAddPet | Submit or save feature data. |
| 2 | Section | 관련 UI 영역 | [data-action="submitAddPet"] |
| 3 | State | UI/system handling | Keep the current surface open and show an error toast. |

## Screen-level States

| State | Trigger | Screen Response | Recovery / Next Step |
| --- | --- | --- | --- |
| Default | submit | Submit or save feature data. | 사용자는 다음 동작을 계속 진행한다. |
| Error | 저장 또는 처리 실패 | 오류 안내를 표시한다. | 사용자는 현재 화면에서 다시 시도한다. |

## Policy Notes

- 확정된 추가 서비스 정책 없음


## Screen Header

| Field | Value |
| --- | --- |
| Platform | App |
| User | 비즈 |
| Screen | Action: submitAddPet |
| Entry Path | Prototype: ../../../OneDrive/문서/prototype-member-tag/src/features/member-registration/member-registration-renderer.js:749 외 1개 trace |
| Primary User Goal | Action: submitAddPet |
| Related Screens | - |

## META / Case

| Field | Value |
| --- | --- |
| 플랫폼 | App |
| 유저 | 비즈 |
| 화면명 | Action: submitAddPet |
| 화면 경로 | Prototype: ../../../OneDrive/문서/prototype-member-tag/src/features/member-registration/member-registration-renderer.js:749 외 1개 trace |
| Case | Action: submitAddPet |

## Context

회원 태그 기능에서 Action: submitAddPet 흐름의 사용자 동작과 화면 반응을 정의한다. 이 최종 case는 1개의 JS-derived trace case를 근거로 집계한다.

## Screen Areas

| Screen Area | Purpose | Main UI Items | Visibility / Entry Condition |
| --- | --- | --- | --- |
| Action: submitAddPet | Action: submitAddPet | [data-action="submitAddPet"] | - |

## UI Item Spec

| Platform | Screen | Screen Area | UI Item | Behavior | Exception | State | Data Impact |
| --- | --- | --- | --- | --- | --- | --- | --- |
| App | Action: submitAddPet | Action: submitAddPet | Action: submitAddPet | Submit or save feature data. | - | - | write feature data |

## Component Description

| Number | Type | Title | Bullets |
| --- | --- | --- | --- |
| P | Policy | Action: submitAddPet | 확정된 추가 서비스 정책 없음 |
| 1 | Button | submitAddPet | Submit or save feature data. |
| 2 | Section | 관련 UI 영역 | [data-action="submitAddPet"] |
| 3 | State | UI/system handling | Keep the current surface open and show an error toast. |

## Screen-level States

| State | Trigger | Screen Response | Recovery / Next Step |
| --- | --- | --- | --- |
| Default | submit | Submit or save feature data. | 사용자는 다음 동작을 계속 진행한다. |
| Error | 저장 또는 처리 실패 | 오류 안내를 표시한다. | 사용자는 현재 화면에서 다시 시도한다. |

## Policy Notes

- 확정된 추가 서비스 정책 없음


## Screen Header

| Field | Value |
| --- | --- |
| Platform | Web |
| User | 비즈 |
| Screen | Action: submitPet |
| Entry Path | Prototype: ../../../OneDrive/문서/prototype-member-tag/src/features/member-edit/member-edit-renderer.js:186 외 1개 trace |
| Primary User Goal | Action: submitPet |
| Related Screens | - |

## META / Case

| Field | Value |
| --- | --- |
| 플랫폼 | Web |
| 유저 | 비즈 |
| 화면명 | Action: submitPet |
| 화면 경로 | Prototype: ../../../OneDrive/문서/prototype-member-tag/src/features/member-edit/member-edit-renderer.js:186 외 1개 trace |
| Case | Action: submitPet |

## Context

회원 태그 기능에서 Action: submitPet 흐름의 사용자 동작과 화면 반응을 정의한다. 이 최종 case는 1개의 JS-derived trace case를 근거로 집계한다.

## Screen Areas

| Screen Area | Purpose | Main UI Items | Visibility / Entry Condition |
| --- | --- | --- | --- |
| Action: submitPet | Action: submitPet | [data-action="submitPet"] | - |

## UI Item Spec

| Platform | Screen | Screen Area | UI Item | Behavior | Exception | State | Data Impact |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Web | Action: submitPet | Action: submitPet | Action: submitPet | Submit or save feature data. | - | - | write feature data |

## Component Description

| Number | Type | Title | Bullets |
| --- | --- | --- | --- |
| P | Policy | Action: submitPet | 확정된 추가 서비스 정책 없음 |
| 1 | Button | submitPet | Submit or save feature data. |
| 2 | Section | 관련 UI 영역 | [data-action="submitPet"] |
| 3 | State | UI/system handling | Keep the current surface open and show an error toast. |

## Screen-level States

| State | Trigger | Screen Response | Recovery / Next Step |
| --- | --- | --- | --- |
| Default | submit | Submit or save feature data. | 사용자는 다음 동작을 계속 진행한다. |
| Error | 저장 또는 처리 실패 | 오류 안내를 표시한다. | 사용자는 현재 화면에서 다시 시도한다. |

## Policy Notes

- 확정된 추가 서비스 정책 없음


## Screen Header

| Field | Value |
| --- | --- |
| Platform | App |
| User | 비즈 |
| Screen | Action: submitPet |
| Entry Path | Prototype: ../../../OneDrive/문서/prototype-member-tag/src/features/member-edit/member-edit-renderer.js:186 외 1개 trace |
| Primary User Goal | Action: submitPet |
| Related Screens | - |

## META / Case

| Field | Value |
| --- | --- |
| 플랫폼 | App |
| 유저 | 비즈 |
| 화면명 | Action: submitPet |
| 화면 경로 | Prototype: ../../../OneDrive/문서/prototype-member-tag/src/features/member-edit/member-edit-renderer.js:186 외 1개 trace |
| Case | Action: submitPet |

## Context

회원 태그 기능에서 Action: submitPet 흐름의 사용자 동작과 화면 반응을 정의한다. 이 최종 case는 1개의 JS-derived trace case를 근거로 집계한다.

## Screen Areas

| Screen Area | Purpose | Main UI Items | Visibility / Entry Condition |
| --- | --- | --- | --- |
| Action: submitPet | Action: submitPet | [data-action="submitPet"] | - |

## UI Item Spec

| Platform | Screen | Screen Area | UI Item | Behavior | Exception | State | Data Impact |
| --- | --- | --- | --- | --- | --- | --- | --- |
| App | Action: submitPet | Action: submitPet | Action: submitPet | Submit or save feature data. | - | - | write feature data |

## Component Description

| Number | Type | Title | Bullets |
| --- | --- | --- | --- |
| P | Policy | Action: submitPet | 확정된 추가 서비스 정책 없음 |
| 1 | Button | submitPet | Submit or save feature data. |
| 2 | Section | 관련 UI 영역 | [data-action="submitPet"] |
| 3 | State | UI/system handling | Keep the current surface open and show an error toast. |

## Screen-level States

| State | Trigger | Screen Response | Recovery / Next Step |
| --- | --- | --- | --- |
| Default | submit | Submit or save feature data. | 사용자는 다음 동작을 계속 진행한다. |
| Error | 저장 또는 처리 실패 | 오류 안내를 표시한다. | 사용자는 현재 화면에서 다시 시도한다. |

## Policy Notes

- 확정된 추가 서비스 정책 없음


## Screen Header

| Field | Value |
| --- | --- |
| Platform | Web |
| User | 비즈 |
| Screen | Logic in member-edit-renderer.js |
| Entry Path | Prototype: ../../../OneDrive/문서/prototype-member-tag/src/features/member-edit/member-edit-renderer.js:427 |
| Primary User Goal | Logic in member-edit-renderer.js |
| Related Screens | - |

## META / Case

| Field | Value |
| --- | --- |
| 플랫폼 | Web |
| 유저 | 비즈 |
| 화면명 | Logic in member-edit-renderer.js |
| 화면 경로 | Prototype: ../../../OneDrive/문서/prototype-member-tag/src/features/member-edit/member-edit-renderer.js:427 |
| Case | Logic in member-edit-renderer.js |

## Context

회원 태그 기능에서 Logic in member-edit-renderer.js 흐름의 사용자 동작과 화면 반응을 정의한다. 이 최종 case는 1개의 JS-derived trace case를 근거로 집계한다.

## Screen Areas

| Screen Area | Purpose | Main UI Items | Visibility / Entry Condition |
| --- | --- | --- | --- |
| Logic in member-edit-renderer.js | Logic in member-edit-renderer.js | - | - |

## UI Item Spec

| Platform | Screen | Screen Area | UI Item | Behavior | Exception | State | Data Impact |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Web | Logic in member-edit-renderer.js | Logic in member-edit-renderer.js | Logic in member-edit-renderer.js | backButton.addEventListener("click", () => { | - | - | write feature data |

## Component Description

| Number | Type | Title | Bullets |
| --- | --- | --- | --- |
| P | Policy | Logic in member-edit-renderer.js | 확정된 추가 서비스 정책 없음 |
| 1 | Button | click | backButton.addEventListener("click", () => { |

## Screen-level States

| State | Trigger | Screen Response | Recovery / Next Step |
| --- | --- | --- | --- |
| Default | click | backButton.addEventListener("click", () => { | 사용자는 다음 동작을 계속 진행한다. |
| Error | 저장 또는 처리 실패 | 오류 안내를 표시한다. | 사용자는 현재 화면에서 다시 시도한다. |

## Policy Notes

- 확정된 추가 서비스 정책 없음


## Screen Header

| Field | Value |
| --- | --- |
| Platform | App |
| User | 비즈 |
| Screen | Logic in member-edit-renderer.js |
| Entry Path | Prototype: ../../../OneDrive/문서/prototype-member-tag/src/features/member-edit/member-edit-renderer.js:427 |
| Primary User Goal | Logic in member-edit-renderer.js |
| Related Screens | - |

## META / Case

| Field | Value |
| --- | --- |
| 플랫폼 | App |
| 유저 | 비즈 |
| 화면명 | Logic in member-edit-renderer.js |
| 화면 경로 | Prototype: ../../../OneDrive/문서/prototype-member-tag/src/features/member-edit/member-edit-renderer.js:427 |
| Case | Logic in member-edit-renderer.js |

## Context

회원 태그 기능에서 Logic in member-edit-renderer.js 흐름의 사용자 동작과 화면 반응을 정의한다. 이 최종 case는 1개의 JS-derived trace case를 근거로 집계한다.

## Screen Areas

| Screen Area | Purpose | Main UI Items | Visibility / Entry Condition |
| --- | --- | --- | --- |
| Logic in member-edit-renderer.js | Logic in member-edit-renderer.js | - | - |

## UI Item Spec

| Platform | Screen | Screen Area | UI Item | Behavior | Exception | State | Data Impact |
| --- | --- | --- | --- | --- | --- | --- | --- |
| App | Logic in member-edit-renderer.js | Logic in member-edit-renderer.js | Logic in member-edit-renderer.js | backButton.addEventListener("click", () => { | - | - | write feature data |

## Component Description

| Number | Type | Title | Bullets |
| --- | --- | --- | --- |
| P | Policy | Logic in member-edit-renderer.js | 확정된 추가 서비스 정책 없음 |
| 1 | Button | click | backButton.addEventListener("click", () => { |

## Screen-level States

| State | Trigger | Screen Response | Recovery / Next Step |
| --- | --- | --- | --- |
| Default | click | backButton.addEventListener("click", () => { | 사용자는 다음 동작을 계속 진행한다. |
| Error | 저장 또는 처리 실패 | 오류 안내를 표시한다. | 사용자는 현재 화면에서 다시 시도한다. |

## Policy Notes

- 확정된 추가 서비스 정책 없음


## Screen Header

| Field | Value |
| --- | --- |
| Platform | App |
| User | 비즈 |
| Screen | Action: submitGuardianEdit |
| Entry Path | Prototype: ../../../OneDrive/문서/prototype-member-tag/src/features/member-edit/member-edit-renderer.js:520 |
| Primary User Goal | Action: submitGuardianEdit |
| Related Screens | - |

## META / Case

| Field | Value |
| --- | --- |
| 플랫폼 | App |
| 유저 | 비즈 |
| 화면명 | Action: submitGuardianEdit |
| 화면 경로 | Prototype: ../../../OneDrive/문서/prototype-member-tag/src/features/member-edit/member-edit-renderer.js:520 |
| Case | Action: submitGuardianEdit |

## Context

회원 태그 기능에서 Action: submitGuardianEdit 흐름의 사용자 동작과 화면 반응을 정의한다. 이 최종 case는 1개의 JS-derived trace case를 근거로 집계한다.

## Screen Areas

| Screen Area | Purpose | Main UI Items | Visibility / Entry Condition |
| --- | --- | --- | --- |
| Action: submitGuardianEdit | Action: submitGuardianEdit | [data-action="submitGuardianEdit"] | - |

## UI Item Spec

| Platform | Screen | Screen Area | UI Item | Behavior | Exception | State | Data Impact |
| --- | --- | --- | --- | --- | --- | --- | --- |
| App | Action: submitGuardianEdit | Action: submitGuardianEdit | Action: submitGuardianEdit | Submit or save feature data. | - | - | write feature data |

## Component Description

| Number | Type | Title | Bullets |
| --- | --- | --- | --- |
| P | Policy | Action: submitGuardianEdit | 확정된 추가 서비스 정책 없음 |
| 1 | Button | submitGuardianEdit | Submit or save feature data. |
| 2 | Section | 관련 UI 영역 | [data-action="submitGuardianEdit"] |
| 3 | State | UI/system handling | Keep the current surface open and show an error toast. |

## Screen-level States

| State | Trigger | Screen Response | Recovery / Next Step |
| --- | --- | --- | --- |
| Default | submit | Submit or save feature data. | 사용자는 다음 동작을 계속 진행한다. |
| Error | 저장 또는 처리 실패 | 오류 안내를 표시한다. | 사용자는 현재 화면에서 다시 시도한다. |

## Policy Notes

- 확정된 추가 서비스 정책 없음


## Screen Header

| Field | Value |
| --- | --- |
| Platform | Web |
| User | 비즈 |
| Screen | Logic in hotel-home-state.js |
| Entry Path | Prototype: ../../../OneDrive/문서/prototype-member-tag/src/features/hotel-home/hotel-home-state.js:75 |
| Primary User Goal | Logic in hotel-home-state.js |
| Related Screens | - |

## META / Case

| Field | Value |
| --- | --- |
| 플랫폼 | Web |
| 유저 | 비즈 |
| 화면명 | Logic in hotel-home-state.js |
| 화면 경로 | Prototype: ../../../OneDrive/문서/prototype-member-tag/src/features/hotel-home/hotel-home-state.js:75 |
| Case | Logic in hotel-home-state.js |

## Context

회원 태그 기능에서 Logic in hotel-home-state.js 흐름의 사용자 동작과 화면 반응을 정의한다. 이 최종 case는 1개의 JS-derived trace case를 근거로 집계한다.

## Screen Areas

| Screen Area | Purpose | Main UI Items | Visibility / Entry Condition |
| --- | --- | --- | --- |
| Logic in hotel-home-state.js | Logic in hotel-home-state.js | - | searchTerm |

## UI Item Spec

| Platform | Screen | Screen Area | UI Item | Behavior | Exception | State | Data Impact |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Web | Logic in hotel-home-state.js | Logic in hotel-home-state.js | Logic in hotel-home-state.js | if (searchTerm) { | - | searchTerm | - |

## Component Description

| Number | Type | Title | Bullets |
| --- | --- | --- | --- |
| P | Policy | Logic in hotel-home-state.js | 확정된 추가 서비스 정책 없음 |
| 1 | Input | logic branch | if (searchTerm) {; 조건: searchTerm |

## Screen-level States

| State | Trigger | Screen Response | Recovery / Next Step |
| --- | --- | --- | --- |
| Default | logic branch | if (searchTerm) { | 사용자는 다음 동작을 계속 진행한다. |
| Error | 저장 또는 처리 실패 | 오류 안내를 표시한다. | 사용자는 현재 화면에서 다시 시도한다. |

## Policy Notes

- 확정된 추가 서비스 정책 없음


## Screen Header

| Field | Value |
| --- | --- |
| Platform | App |
| User | 비즈 |
| Screen | Logic in hotel-home-state.js |
| Entry Path | Prototype: ../../../OneDrive/문서/prototype-member-tag/src/features/hotel-home/hotel-home-state.js:75 |
| Primary User Goal | Logic in hotel-home-state.js |
| Related Screens | - |

## META / Case

| Field | Value |
| --- | --- |
| 플랫폼 | App |
| 유저 | 비즈 |
| 화면명 | Logic in hotel-home-state.js |
| 화면 경로 | Prototype: ../../../OneDrive/문서/prototype-member-tag/src/features/hotel-home/hotel-home-state.js:75 |
| Case | Logic in hotel-home-state.js |

## Context

회원 태그 기능에서 Logic in hotel-home-state.js 흐름의 사용자 동작과 화면 반응을 정의한다. 이 최종 case는 1개의 JS-derived trace case를 근거로 집계한다.

## Screen Areas

| Screen Area | Purpose | Main UI Items | Visibility / Entry Condition |
| --- | --- | --- | --- |
| Logic in hotel-home-state.js | Logic in hotel-home-state.js | - | searchTerm |

## UI Item Spec

| Platform | Screen | Screen Area | UI Item | Behavior | Exception | State | Data Impact |
| --- | --- | --- | --- | --- | --- | --- | --- |
| App | Logic in hotel-home-state.js | Logic in hotel-home-state.js | Logic in hotel-home-state.js | if (searchTerm) { | - | searchTerm | - |

## Component Description

| Number | Type | Title | Bullets |
| --- | --- | --- | --- |
| P | Policy | Logic in hotel-home-state.js | 확정된 추가 서비스 정책 없음 |
| 1 | Input | logic branch | if (searchTerm) {; 조건: searchTerm |

## Screen-level States

| State | Trigger | Screen Response | Recovery / Next Step |
| --- | --- | --- | --- |
| Default | logic branch | if (searchTerm) { | 사용자는 다음 동작을 계속 진행한다. |
| Error | 저장 또는 처리 실패 | 오류 안내를 표시한다. | 사용자는 현재 화면에서 다시 시도한다. |

## Policy Notes

- 확정된 추가 서비스 정책 없음


## Screen Header

| Field | Value |
| --- | --- |
| Platform | Web |
| User | 비즈 |
| Screen | Logic in member-tag-input.js |
| Entry Path | Prototype: ../../../OneDrive/문서/prototype-member-tag/src/shared/components/member-tag-input.js:29 외 10개 trace |
| Primary User Goal | Logic in member-tag-input.js |
| Related Screens | - |

## META / Case

| Field | Value |
| --- | --- |
| 플랫폼 | Web |
| 유저 | 비즈 |
| 화면명 | Logic in member-tag-input.js |
| 화면 경로 | Prototype: ../../../OneDrive/문서/prototype-member-tag/src/shared/components/member-tag-input.js:29 외 10개 trace |
| Case | Logic in member-tag-input.js |

## Context

회원 태그 기능에서 Logic in member-tag-input.js 흐름의 사용자 동작과 화면 반응을 정의한다. 이 최종 case는 11개의 JS-derived trace case를 근거로 집계한다.

## Screen Areas

| Screen Area | Purpose | Main UI Items | Visibility / Entry Condition |
| --- | --- | --- | --- |
| Logic in member-tag-input.js | Logic in member-tag-input.js | - | !trimmedTagName \/\/ selectedTagSet.has(normalizeMemberTagName(trimmedTagName)); isSelected; !isMobileSearchOpen; shouldFocusSearchInput; isComposing; searchInputSelector === ".member-tag-search-input"; event.key !== "Enter" \/\/ isComposing; isMobileLayout() && !isMobileSearchOpen |

## UI Item Spec

| Platform | Screen | Screen Area | UI Item | Behavior | Exception | State | Data Impact |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Web | Logic in member-tag-input.js | Logic in member-tag-input.js | Logic in member-tag-input.js | if (!trimmedTagName \/\/ selectedTagSet.has(normalizeMemberTagName(trimmedTagName))) {; if (isSelected) {; if (!isMobileSearchOpen) {; if (shouldFocusSearchInput) {; input.addEventListener("compositionend", (event) => {; input.addEventListener("input", (event) => {; if (isComposing) {; input.addEventListener("keydown", (event) => { | - | !trimmedTagName \/\/ selectedTagSet.has(normalizeMemberTagName(trimmedTagName)); isSelected; !isMobileSearchOpen; shouldFocusSearchInput; isComposing; searchInputSelector === ".member-tag-search-input"; event.key !== "Enter" \/\/ isComposing; isMobileLayout() && !isMobileSearchOpen | mutate form state; write feature data |

## Component Description

| Number | Type | Title | Bullets |
| --- | --- | --- | --- |
| P | Policy | Logic in member-tag-input.js | 확정된 추가 서비스 정책 없음 |
| 1 | Section | logic branch | if (!trimmedTagName \/\/ selectedTagSet.has(normalizeMemberTagName(trimmedTagName))) {; 조건: !trimmedTagName \/\/ selectedTagSet.has(normalizeMemberTagName(trimmedTagName)) |
| 2 | Section | logic branch | if (isSelected) {; 조건: isSelected |
| 3 | Input | logic branch | if (!isMobileSearchOpen) {; 조건: !isMobileSearchOpen |
| 4 | Input | logic branch | if (shouldFocusSearchInput) {; 조건: shouldFocusSearchInput |
| 5 | Input | compositionend | input.addEventListener("compositionend", (event) => { |
| 6 | Input | input | input.addEventListener("input", (event) => {; 조건: isComposing; 조건: searchInputSelector === ".member-tag-search-input" |
| 7 | Section | logic branch | if (isComposing) {; 조건: isComposing; 조건: searchInputSelector === ".member-tag-search-input" |
| 8 | Input | keydown | input.addEventListener("keydown", (event) => {; 조건: event.key !== "Enter" \/\/ isComposing |

## Screen-level States

| State | Trigger | Screen Response | Recovery / Next Step |
| --- | --- | --- | --- |
| Default | logic branch; compositionend; input; keydown; focus; click | if (!trimmedTagName \/\/ selectedTagSet.has(normalizeMemberTagName(trimmedTagName))) {; if (isSelected) {; if (!isMobileSearchOpen) {; if (shouldFocusSearchInput) {; input.addEventListener("compositionend", (event) => {; input.addEventListener("input", (event) => {; if (isComposing) {; input.addEventListener("keydown", (event) => { | 사용자는 다음 동작을 계속 진행한다. |
| Error | 저장 또는 처리 실패 | 오류 안내를 표시한다. | 사용자는 현재 화면에서 다시 시도한다. |

## Policy Notes

- 확정된 추가 서비스 정책 없음


## Screen Header

| Field | Value |
| --- | --- |
| Platform | App |
| User | 비즈 |
| Screen | Logic in member-tag-input.js |
| Entry Path | Prototype: ../../../OneDrive/문서/prototype-member-tag/src/shared/components/member-tag-input.js:29 외 10개 trace |
| Primary User Goal | Logic in member-tag-input.js |
| Related Screens | - |

## META / Case

| Field | Value |
| --- | --- |
| 플랫폼 | App |
| 유저 | 비즈 |
| 화면명 | Logic in member-tag-input.js |
| 화면 경로 | Prototype: ../../../OneDrive/문서/prototype-member-tag/src/shared/components/member-tag-input.js:29 외 10개 trace |
| Case | Logic in member-tag-input.js |

## Context

회원 태그 기능에서 Logic in member-tag-input.js 흐름의 사용자 동작과 화면 반응을 정의한다. 이 최종 case는 11개의 JS-derived trace case를 근거로 집계한다.

## Screen Areas

| Screen Area | Purpose | Main UI Items | Visibility / Entry Condition |
| --- | --- | --- | --- |
| Logic in member-tag-input.js | Logic in member-tag-input.js | - | !trimmedTagName \/\/ selectedTagSet.has(normalizeMemberTagName(trimmedTagName)); isSelected; !isMobileSearchOpen; shouldFocusSearchInput; isComposing; searchInputSelector === ".member-tag-search-input"; event.key !== "Enter" \/\/ isComposing; isMobileLayout() && !isMobileSearchOpen |

## UI Item Spec

| Platform | Screen | Screen Area | UI Item | Behavior | Exception | State | Data Impact |
| --- | --- | --- | --- | --- | --- | --- | --- |
| App | Logic in member-tag-input.js | Logic in member-tag-input.js | Logic in member-tag-input.js | if (!trimmedTagName \/\/ selectedTagSet.has(normalizeMemberTagName(trimmedTagName))) {; if (isSelected) {; if (!isMobileSearchOpen) {; if (shouldFocusSearchInput) {; input.addEventListener("compositionend", (event) => {; input.addEventListener("input", (event) => {; if (isComposing) {; input.addEventListener("keydown", (event) => { | - | !trimmedTagName \/\/ selectedTagSet.has(normalizeMemberTagName(trimmedTagName)); isSelected; !isMobileSearchOpen; shouldFocusSearchInput; isComposing; searchInputSelector === ".member-tag-search-input"; event.key !== "Enter" \/\/ isComposing; isMobileLayout() && !isMobileSearchOpen | mutate form state; write feature data |

## Component Description

| Number | Type | Title | Bullets |
| --- | --- | --- | --- |
| P | Policy | Logic in member-tag-input.js | 확정된 추가 서비스 정책 없음 |
| 1 | Section | logic branch | if (!trimmedTagName \/\/ selectedTagSet.has(normalizeMemberTagName(trimmedTagName))) {; 조건: !trimmedTagName \/\/ selectedTagSet.has(normalizeMemberTagName(trimmedTagName)) |
| 2 | Section | logic branch | if (isSelected) {; 조건: isSelected |
| 3 | Input | logic branch | if (!isMobileSearchOpen) {; 조건: !isMobileSearchOpen |
| 4 | Input | logic branch | if (shouldFocusSearchInput) {; 조건: shouldFocusSearchInput |
| 5 | Input | compositionend | input.addEventListener("compositionend", (event) => { |
| 6 | Input | input | input.addEventListener("input", (event) => {; 조건: isComposing; 조건: searchInputSelector === ".member-tag-search-input" |
| 7 | Section | logic branch | if (isComposing) {; 조건: isComposing; 조건: searchInputSelector === ".member-tag-search-input" |
| 8 | Input | keydown | input.addEventListener("keydown", (event) => {; 조건: event.key !== "Enter" \/\/ isComposing |

## Screen-level States

| State | Trigger | Screen Response | Recovery / Next Step |
| --- | --- | --- | --- |
| Default | logic branch; compositionend; input; keydown; focus; click | if (!trimmedTagName \/\/ selectedTagSet.has(normalizeMemberTagName(trimmedTagName))) {; if (isSelected) {; if (!isMobileSearchOpen) {; if (shouldFocusSearchInput) {; input.addEventListener("compositionend", (event) => {; input.addEventListener("input", (event) => {; if (isComposing) {; input.addEventListener("keydown", (event) => { | 사용자는 다음 동작을 계속 진행한다. |
| Error | 저장 또는 처리 실패 | 오류 안내를 표시한다. | 사용자는 현재 화면에서 다시 시도한다. |

## Policy Notes

- 확정된 추가 서비스 정책 없음


## Screen Header

| Field | Value |
| --- | --- |
| Platform | Web |
| User | 비즈 |
| Screen | Logic in school-home-renderer.js |
| Entry Path | Prototype: ../../../OneDrive/문서/prototype-member-tag/src/features/school-home/school-home-renderer.js:175 외 1개 trace |
| Primary User Goal | Logic in school-home-renderer.js |
| Related Screens | - |

## META / Case

| Field | Value |
| --- | --- |
| 플랫폼 | Web |
| 유저 | 비즈 |
| 화면명 | Logic in school-home-renderer.js |
| 화면 경로 | Prototype: ../../../OneDrive/문서/prototype-member-tag/src/features/school-home/school-home-renderer.js:175 외 1개 trace |
| Case | Logic in school-home-renderer.js |

## Context

회원 태그 기능에서 Logic in school-home-renderer.js 흐름의 사용자 동작과 화면 반응을 정의한다. 이 최종 case는 2개의 JS-derived trace case를 근거로 집계한다.

## Screen Areas

| Screen Area | Purpose | Main UI Items | Visibility / Entry Condition |
| --- | --- | --- | --- |
| Logic in school-home-renderer.js | Logic in school-home-renderer.js | - | - |

## UI Item Spec

| Platform | Screen | Screen Area | UI Item | Behavior | Exception | State | Data Impact |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Web | Logic in school-home-renderer.js | Logic in school-home-renderer.js | Logic in school-home-renderer.js | todayButton.addEventListener("click", () => {; allCheckbox.addEventListener("change", () => { | - | - | write feature data; mutate form state |

## Component Description

| Number | Type | Title | Bullets |
| --- | --- | --- | --- |
| P | Policy | Logic in school-home-renderer.js | 확정된 추가 서비스 정책 없음 |
| 1 | Button | click | todayButton.addEventListener("click", () => { |
| 2 | List | change | allCheckbox.addEventListener("change", () => { |

## Screen-level States

| State | Trigger | Screen Response | Recovery / Next Step |
| --- | --- | --- | --- |
| Default | click; change | todayButton.addEventListener("click", () => {; allCheckbox.addEventListener("change", () => { | 사용자는 다음 동작을 계속 진행한다. |
| Error | 저장 또는 처리 실패 | 오류 안내를 표시한다. | 사용자는 현재 화면에서 다시 시도한다. |

## Policy Notes

- 확정된 추가 서비스 정책 없음


## Screen Header

| Field | Value |
| --- | --- |
| Platform | App |
| User | 비즈 |
| Screen | Logic in school-home-renderer.js |
| Entry Path | Prototype: ../../../OneDrive/문서/prototype-member-tag/src/features/school-home/school-home-renderer.js:175 외 1개 trace |
| Primary User Goal | Logic in school-home-renderer.js |
| Related Screens | - |

## META / Case

| Field | Value |
| --- | --- |
| 플랫폼 | App |
| 유저 | 비즈 |
| 화면명 | Logic in school-home-renderer.js |
| 화면 경로 | Prototype: ../../../OneDrive/문서/prototype-member-tag/src/features/school-home/school-home-renderer.js:175 외 1개 trace |
| Case | Logic in school-home-renderer.js |

## Context

회원 태그 기능에서 Logic in school-home-renderer.js 흐름의 사용자 동작과 화면 반응을 정의한다. 이 최종 case는 2개의 JS-derived trace case를 근거로 집계한다.

## Screen Areas

| Screen Area | Purpose | Main UI Items | Visibility / Entry Condition |
| --- | --- | --- | --- |
| Logic in school-home-renderer.js | Logic in school-home-renderer.js | - | - |

## UI Item Spec

| Platform | Screen | Screen Area | UI Item | Behavior | Exception | State | Data Impact |
| --- | --- | --- | --- | --- | --- | --- | --- |
| App | Logic in school-home-renderer.js | Logic in school-home-renderer.js | Logic in school-home-renderer.js | todayButton.addEventListener("click", () => {; allCheckbox.addEventListener("change", () => { | - | - | write feature data; mutate form state |

## Component Description

| Number | Type | Title | Bullets |
| --- | --- | --- | --- |
| P | Policy | Logic in school-home-renderer.js | 확정된 추가 서비스 정책 없음 |
| 1 | Button | click | todayButton.addEventListener("click", () => { |
| 2 | List | change | allCheckbox.addEventListener("change", () => { |

## Screen-level States

| State | Trigger | Screen Response | Recovery / Next Step |
| --- | --- | --- | --- |
| Default | click; change | todayButton.addEventListener("click", () => {; allCheckbox.addEventListener("change", () => { | 사용자는 다음 동작을 계속 진행한다. |
| Error | 저장 또는 처리 실패 | 오류 안내를 표시한다. | 사용자는 현재 화면에서 다시 시도한다. |

## Policy Notes

- 확정된 추가 서비스 정책 없음

