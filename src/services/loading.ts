import store from '../../store/index'

export default {
    open(){
        store.commit('loading', true);
    },
    close(){
        store.commit('loading', false);
    }
}