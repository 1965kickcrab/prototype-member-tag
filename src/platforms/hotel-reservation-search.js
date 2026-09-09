import { renderHotelReservationSearch } from "../features/hotel-home/hotel-home-renderer.js";
import { createHotelHomeState } from "../features/hotel-home/hotel-home-state.js";

renderHotelReservationSearch(document.querySelector("#app"), createHotelHomeState());
