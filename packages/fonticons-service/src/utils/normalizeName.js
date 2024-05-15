function normalizeName(name) {
  return name.trim().toLowerCase().replaceAll(" ", "-");
}

module.exports = { normalizeName };
