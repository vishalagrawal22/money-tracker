export function checkUidInArray(uidToSearch, array) {
  let present = false;
  for (const user of array) {
    if (user.uid === uidToSearch) {
      present = true;
    }
  }
  return present;
}
