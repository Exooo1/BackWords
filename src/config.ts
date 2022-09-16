export const morganConfig = (morgan) => {
    morgan.token('body', (req) => {
        return JSON.stringify(req.body)
    })
    morgan.token('method', (req) => {
        return JSON.stringify(req.method)
    })
    return ':date[clf] :method :url :body :status :res[content-length] - :response-time ms'
}

export const secretJWT = 'wordsAuth'
export type userIType = {
    userId: String
}