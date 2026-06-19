import { loadMemberTagCatalog } from "../../shared/storage/member-storage.js";
import { normalizeMemberTagName, sortMemberTagNames } from "../../shared/services/member-tag-service.js";

export function createMemberTagManagementState(options = {}) {
  const memberTagCatalog = loadMemberTagCatalog();

  return {
    mode: options.mode === "web" ? "web" : "app",
    memberTagCatalog,
    draftMemberTagCatalog: [...memberTagCatalog],
    memberTagDrafts: [],
    deletedDraftMemberTagNames: [],
    memberTagManagementQuery: "",
    openMemberTagMenuTagName: "",
    activeMemberTagSheetTagName: "",
    memberTagSheetDraftName: "",
    isDiscardAlertOpen: false,
    pendingNavigationHref: "",
    toastMessage: "",
  };
}

export function getActiveMemberTagCatalog(state) {
  return state.mode === "web" ? state.draftMemberTagCatalog || [] : state.memberTagCatalog || [];
}

export function hasMemberTagDraftChanges(state) {
  if (state.mode !== "web") {
    return false;
  }

  return !areCatalogsEqual(state.memberTagCatalog || [], state.draftMemberTagCatalog || [])
    || Boolean((state.deletedDraftMemberTagNames || []).length);
}

export function getVisibleMemberTags(state) {
  const query = normalizeMemberTagName(state.memberTagManagementQuery);
  const memberTags = sortMemberTagNames(getActiveMemberTagCatalog(state));

  if (!query) {
    return memberTags;
  }

  return memberTags.filter((memberTagName) => {
    return normalizeMemberTagName(memberTagName).includes(query);
  });
}

export function getCreatableMemberTagName(state) {
  const tagName = String(state.memberTagManagementQuery || "").trim().replace(/\s+/g, " ");
  const normalizedTagName = normalizeMemberTagName(tagName);

  if (!normalizedTagName) {
    return "";
  }

  const isExistingTag = getActiveMemberTagCatalog(state).some((memberTagName) => {
    return normalizeMemberTagName(memberTagName) === normalizedTagName;
  });

  return isExistingTag ? "" : tagName;
}

function areCatalogsEqual(firstCatalog, secondCatalog) {
  const firstTags = sortMemberTagNames(firstCatalog).map(normalizeMemberTagName);
  const secondTags = sortMemberTagNames(secondCatalog).map(normalizeMemberTagName);

  if (firstTags.length !== secondTags.length) {
    return false;
  }

  return firstTags.every((memberTagName, index) => memberTagName === secondTags[index]);
}
