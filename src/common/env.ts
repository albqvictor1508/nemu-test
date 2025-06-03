import {cleanEnv, str, url} from "envalid"

export const env = cleanEnv(process.env, {
    POSTGRES_DATABASE: str(),
    POSTGRES_USER: str(),
    POSTGRES_PASSWORD: str(),
    POSTGRES_URL: url()
});