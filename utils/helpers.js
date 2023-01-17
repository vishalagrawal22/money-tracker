export function checkObjectIdInArray(idToSearch, array) {
  let present = false;
  for (const object of array) {
    if (object._id.equals(idToSearch)) {
      present = true;
    }
  }
  return present;
}

export function checkUidInArray(uidToSearch, array) {
  let present = false;
  for (const user of array) {
    if (user.uid === uidToSearch) {
      present = true;
    }
  }
  return present;
}

export function capitalize(str) {
  return str.substring(0, 1).toUpperCase() + str.substring(1);
}
