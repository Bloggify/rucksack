const math = require("./math")
    , camelo = require("camelo")
    ;

console.log(math.square(2, 4));
//console.log($("#my-id"));
console.log(camelo("hey there"));

const sleep = async ms => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
    console.log(1)
    await sleep(420)
    console.log(2)
})()
