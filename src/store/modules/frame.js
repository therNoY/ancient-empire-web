//渲染单位行动有关的数据

const store = {
    state: {
        globleLoading: false, 
    },
    mutations: {
        setLoading(state){
            state.globleLoading = !state.globleLoading;
        }
    },
    actions: {
    }
  }
  
  export default store;