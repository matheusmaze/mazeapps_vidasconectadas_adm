const isEmpty = (payload: object)  => {
    const emptyFields: Array<string | void> = []
    Object.entries(payload).forEach(element => {
        if(element[1] === ""){
            emptyFields.push(element[0])
        }
    });
    let returnMessage = ""
    emptyFields.forEach(el => {
        el === 'name' ? el = 'Nome' : el;
        el === 'birthday' ? el = 'Data de aniversário' : el;
        el === 'document' ? el = 'CPF ou CNPJ' : el;
        el === 'cpf' ? el = 'CPF' : el;
        el === 'cnpj' ? el = 'CNPJ' : el;
        el === 'phone_number' ? el = 'Whatsapp' : el;
        el === 'email' ? el = 'E-mail' : el;
        el === 'password' ? el = 'Senha' : el;
        el === 'welcome_email' ? el = 'Boas-vindas' : el;
        el === 'blood_donator' ? el = 'Doador de sangue' : el;
        el === 'code' ? el = 'Código' : el;
        el === 'logo' ? el = 'Logotipo' : el;
        el === 'value' || el === 'fixed_value' ? el = 'Valor' : el;
        el === 'description' ? el = 'Descrição' : el;
        el === 'recurrence_day' ? el = 'Dia da doação' : el;
        el === 'recurrence_interval' ? el = 'Recorrência' : el;
        el === 'institutions_id' ? el = 'Instituição' : el;
        el === 'users_id' ? el = 'Comprador' : el;
        el === 'purchase_voucher' ? el = 'Comprovante de compra' : el;
        el === 'created_at' || el === 'updated_at' ? el = 'Data' : el;

        returnMessage += `* O Campo <b>${el}</b> está vazio <br/>`
    })
    return returnMessage
}

//isEmail retornará uma string em vez de boolean
const isEmail = (email: string): string => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const test = re.test(String(email).toLowerCase());
    let returnMessage = "";
    if(!test){
        returnMessage = '* Email inválido.';
    }
    return returnMessage;
}

const isBirthday = (date: string): boolean => {
    const year = new Date().getFullYear();
    let yearValidate = false;
    if(date.split('/')[2] && date.split('/')[2].length === 4) {
        if (Number(date.split('/')[2]) > (year - 110) && Number(date.split('/')[2]) <= year) {
            yearValidate = true;
        }
    }
    const monthValidate = Number(date.split('/')[1]) <= 12;
    const dayValidate = Number(date.split('/')[0]) <= 31;
    const fullDateValidate = date.length === 10 ? true : false;
    const birthdayValidate = (yearValidate && monthValidate && dayValidate && fullDateValidate) ? true : false;
    return birthdayValidate;
}



export { isEmpty, isEmail, isBirthday }