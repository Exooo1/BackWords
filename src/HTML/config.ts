import path from "path";
import handlebars from "handlebars";
import fs from "fs";

type ValueHandle = {
    username: string
    verify:string
}
export const createHandlebars = (value: ValueHandle) => {
    const filePath = path.join(__dirname, './sendEmail.html')
    const source = fs.readFileSync(filePath, 'utf-8').toString();
    const template = handlebars.compile(source);
    return template(value)
}