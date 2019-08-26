const getters = {
  user: state => state.user.user,
  token: state => state.user.token,
  admin_token: state => state.user.admin_token,

  recordId: state => state.app.recordId,
  mapSt: state => state.app.mapSt,
  mapDt: state => state.app.mapDt,
}
export default getters
