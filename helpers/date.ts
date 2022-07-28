export const getDate = (date: string) => {
    const day = new Date(date).getDate() + 1
    const year = new Date(date).getFullYear()
    const month = new Date(date).getMonth() + 1

    const newDate = `${day}/${month}/${year}`

    return newDate;
}