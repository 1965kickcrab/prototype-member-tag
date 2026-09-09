import { renderSchoolReservationSearch } from "../features/school-home/school-home-renderer.js";
import { createSchoolHomeState } from "../features/school-home/school-home-state.js";

renderSchoolReservationSearch(document.querySelector("#app"), createSchoolHomeState());
