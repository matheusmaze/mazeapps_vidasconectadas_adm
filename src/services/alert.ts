import store from '../../store/index'

export default {
    open(title: string, message: string, type: string){
        store.commit('alert', {
            display: true,
            title: title,
            message: message,
            type: type
        });
        setTimeout(() => {
            this.close();
        }, 6000)
    },
    close(){
        store.commit('alert', {
            display: false,
        });
    }
}