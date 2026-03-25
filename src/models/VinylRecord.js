class VinylRecord {
  /**
   * @param {object} params
   * @param {string} params.id
   * @param {string} params.albumTitle
   * @param {string} params.artistName
   * @param {number} params.year
   * @param {string} params.genre
   * @param {string} [params.vinylCondition]
   * @param {boolean} [params.isForTrade]
   * @param {string} params.ownerUsername
   */
  constructor({
    id,
    albumTitle,
    artistName,
    year,
    genre,
    vinylCondition = "VG",
    isForTrade = false,
    ownerUsername,
  }) {
    if (!id) throw new Error("VinylRecord requires id");
    if (!albumTitle) throw new Error("VinylRecord requires albumTitle");
    if (!artistName) throw new Error("VinylRecord requires artistName");
    if (!ownerUsername) throw new Error("VinylRecord requires ownerUsername");
    if (!Number.isFinite(year)) throw new Error("VinylRecord requires year");
    if (!genre) throw new Error("VinylRecord requires genre");

    this.id = String(id);
    this.albumTitle = String(albumTitle);
    this.artistName = String(artistName);
    this.year = Number(year);
    this.genre = String(genre);
    this.vinylCondition = String(vinylCondition);
    this.isForTrade = Boolean(isForTrade);
    this.ownerUsername = String(ownerUsername);
  }
}

module.exports = { VinylRecord };

