import store from '../../store/index'

export default {
    open(obj: object){
        const { title, message, confirmMessage, callbackOK, callbackCancel }: any = obj;
        store.commit('modal', {
            display: true,
            title: title,
            message: message,
            confirmMessage: confirmMessage,
            callbackOK: callbackOK,
            callbackCancel: callbackCancel
            
        });
    },
    close(){
        store.commit('modal', {
            display: false,
        });
    }
}