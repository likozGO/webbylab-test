export default function hasDublicates (array) {
    return array.map((value) => value.firstName.toLowerCase() + value.lastName.toLowerCase()).some((value, index, array) => array.indexOf(value) !== array.lastIndexOf(value))
}
