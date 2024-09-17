export function reqBodyIsEmpty(reqBody: any) {
    return !reqBody || Object.keys(reqBody).length === 0
}