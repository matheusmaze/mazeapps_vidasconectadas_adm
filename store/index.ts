import { createStore } from "vuex" 

const store = createStore({
   state:{
      name: "Vue",
      alert:{
        display: false,
        title: "",
        message: "",
        type: ""
      },
      modal:{
        display: false,
        title: "",
        message: "",
        confirmMessage: "",
        callbackOK: "",
        callbackCancel: ""
      },
      loading: false,
   },
   getters:{
     alert: (state) => state.alert,
     loading: (state) => state.loading,
     modal: (state) => state.modal,
   },
   mutations: {
    changeName: (state, value) => state.name = value,
    loading:(state, value) => state.loading = value,
    alert:(state, value) => state.alert = value,
    modal: (state, value) => state.modal = value
  }
})

export default store