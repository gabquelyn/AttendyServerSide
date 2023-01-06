module.exports = isMatricNumber = (value) => {
    /[a-zA-Z]{3}\/[0-9]{2}\/[0-9]{4}/.test(value)
}