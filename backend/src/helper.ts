
const generate = () => {
    const dict = "abcdefghijklmnopqrstuvwxyz1234567890";

    const n = dict.length
    let idd = ""
    for (let i=0; i<5; i++) {
        let idx = Math.floor(Math.random()*n)
        idd += dict.charAt(idx);
    }
    
    return idd
}

export default generate;