const getters = {
  user: state => state.user.user,
  token: state => state.user.token,
  admin_token: state => state.user.admin_token,
}
export default getters
