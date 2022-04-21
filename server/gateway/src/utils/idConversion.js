function fromRemotaToXPEId(id) {
  return `xp${id.toString().padStart(18, '0')}`;
}

module.exports = {
  fromRemotaToXPEId,
};
