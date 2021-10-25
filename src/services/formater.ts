
const numberToCpf = (n: string) => n.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
const numberToCnpj = (n: string) => n.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
const cpfToNumber = (n: string) => n.replace(/[^\w\s]/gi, '');
const toMoney = (n: string) => parseFloat(n).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 3,
    style: 'currency',
    currency: 'BRL'
})
const toPhone = (n: string) => n.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
const toCelPhone = (n: string) => n.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
const toDate = (d: string): string => {
    let firstSplit: string;
    let day: string;
    let mounth: string;
    let year: string;
    if(d && d.length > 0){
        if(String(d).split("").includes("T")){
            firstSplit = d.split("T")[0];
            day = firstSplit.split("-")[2];
            mounth = firstSplit.split("-")[1];
            year = firstSplit.split("-")[0];
        }else{
            firstSplit = String(d).split(" ")[0];
            day = firstSplit.split("-")[2];
            mounth = firstSplit.split("-")[1];
            year = firstSplit.split("-")[0];
        }
        return `${day}/${mounth}/${year}`
    }
    return "-"
}
const toHour = (d: string): string => {
    let secondSplit: string;
    let thirdSplit: string;
    let hour: string;
    let minute: string;
    let second: string;
    if(d && d.length > 0){
        if(String(d).split("").includes("T")){
            secondSplit = d.split("T")[1];
            thirdSplit = secondSplit.split(".")[0];
            hour = thirdSplit.split(":")[0];
            minute = thirdSplit.split(":")[1];
            second = thirdSplit.split(":")[2];
        }else{
            secondSplit = String(d).split(" ")[1];
            thirdSplit = secondSplit.split(".")[0];
            hour = thirdSplit.split(":")[0];
            minute = thirdSplit.split(":")[1];
            second = thirdSplit.split(":")[2];
        }
        return `${hour}:${minute}:${second}`
    }
    return ""
}
const toDateTime = (d: string): string => {
    let firstSplit: string;
    let secondSplit: string;
    let thirdSplit: string;
    let day: string;
    let mounth: string;
    let year: string;
    let hour: string;
    let minute: string;
    let second: string;
    if(d && d.length > 0){
        if(String(d).split("").includes("T")){
            firstSplit = d.split("T")[0];
            secondSplit = d.split("T")[1];
            thirdSplit = secondSplit.split(".")[0];
            day = firstSplit.split("-")[2];
            mounth = firstSplit.split("-")[1];
            year = firstSplit.split("-")[0];
            hour = thirdSplit.split(":")[0];
            minute = thirdSplit.split(":")[1];
            second = thirdSplit.split(":")[2];
        }else{
            firstSplit = String(d).split(" ")[0];
            secondSplit = String(d).split(" ")[1];
            thirdSplit = secondSplit.split(".")[0];
            day = firstSplit.split("-")[2];
            mounth = firstSplit.split("-")[1];
            year = firstSplit.split("-")[0];
            hour = thirdSplit.split(":")[0];
            minute = thirdSplit.split(":")[1];
            second = thirdSplit.split(":")[2];
        }
        return `${day}/${mounth}/${year} ${hour}:${minute}:${second}`
    }
    return ""
}
const toDateUS = (d: string): string => {
    const firstSplit: string = d.split(" ")[0];
    const day: string = firstSplit.split("-")[2];
    const mounth: string = firstSplit.split("-")[1];
    const year: string = firstSplit.split("-")[0];
    return `${year}-${mounth}-${day}`
}


const toTimeStamp = (d: string): string => {
    const day: string = d.split("-")[0];
    const mounth: string = d.split("-")[1];
    const year: string = d.split("-")[2];
    return `${year}-${mounth}-${day}`
}




export { numberToCpf, numberToCnpj, toPhone, toCelPhone, cpfToNumber, toDate, toDateTime, toDateUS, toHour, toMoney, toTimeStamp}