import http from "../http-common"

const FilmDataService = {
  getAll() {
    return http.get("/films")
  },
  get(id) {
    return http.get(`/films/${id}`)
  },
  create(data) {
    return http.post("/films", data)
  },
  update(id, data) {
    return http.put(`/films/${id}`, data)
  },
  delete(id) {
    return http.delete(`/films/${id}`)
  },
  deleteAll() {
    return http.delete(`/films`)
  },
  findByTitle(title) {
    return http.get(`/films?title=${title}`)
  },
  findByStar(star) {
    return http.get(`/films?stars=${star}`)
  },
  findDuplicates(data) {
    return http.post(`/films/duplicates`, {
      data: {...data}
    })
  },
  upload(data) {
    return http.post(`/films/upload`, data, {
      headers: {
        "content-type": "multipart/form-data",
      },
    })
  },
}

export default FilmDataService
