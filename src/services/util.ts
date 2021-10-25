import router from '../router'
const decodeJwt = (jwt: string) => {
    const base64Url = jwt.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    
    return JSON.parse(jsonPayload);
}

const retornaLogin = (erro: string) => {
    if(erro.includes("Token")){
        router.push({ path: '/login' });
      }
}

const passwordStrength = (password: string): string => {
    const scorePassword = (password) => {
        let score = 0;
        if (!password)
            return score;
        const letters = new Object();
        for (let i = 0; i < password.length; i++) {
            letters[password[i]] = (letters[password[i]] || 0) + 1;
            score += 5.0 / letters[password[i]];
        }
        const variations = {
            digits: /\d/.test(password),
            lower: /[a-z]/.test(password),
            upper: /[A-Z]/.test(password),
            nonWords: /\W/.test(password),
        }
        let variationCount = 0;
        for (const check in variations) {
            variationCount += (variations[check] == true) ? 1 : 0;
        }
        score += (variationCount - 1) * 10;
        return Number(score);
    }


    const score = scorePassword(password);
    if (score > 80)
        return "Forte";
    if (score > 60)
        return "Moderada";
    if (score > 30 || score <= 30)
        return "Fraca";

    return "";

}


export { decodeJwt, passwordStrength, retornaLogin }