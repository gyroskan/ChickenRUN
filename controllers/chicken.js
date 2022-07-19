/**
 * The chicken object
 * @typedef {object} Chicken
 * @property {number} id - The chicken id
 * @property {string} name.required - The name of the chicken
 * @property {string} birthday - The birthday of the chicken - date
 * @property {number} weight.required - The weight of the chicken
 * @property {number} steps - The steps of the chicken
 * @property {boolean} isRunning - Whether the chicken is running
 */

/**
 * The object used to create a chicken
 * @typedef {object} ChickenCreation
 * @property {string} name.required - The name of the chicken
 * @property {string} birthday - The birthday of the chicken - date
 * @property {number} weight.required - The weight of the chicken
 * @property {number} steps=0 - The steps of the chicken
 * @property {boolean} isRunning=false - Whether the chicken is running
 */

/**
 * The object used to patch a chicken
 * @typedef {object} ChickenPatch
 * @property {string} name - The name of the chicken
 * @property {string} birthday - The birthday of the chicken - date
 * @property {number} weight - The weight of the chicken
 * @property {number} steps - The steps of the chicken
 * @property {boolean} isRunning - Whether the chicken is running
 */

export function getChickens(req, res) {
    res.send('chickens');
}

export function getChicken(req, res) {
    res.send('chicken');
}

export function createChicken(req, res) {
    res.send('create chicken');
}

export function updateChicken(req, res) {
    res.send('update chicken');
}

export function replaceChicken(req, res) {
    res.send('replace chicken');
}

export function deleteChicken(req, res) {
    res.send('delete chicken');
}

export function chickenRun(req, res) {
    res.send('chicken run');
}

export function chickenStop(req, res) {
    res.send('chicken stop');
}
