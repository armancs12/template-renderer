export const TOKEN_REGEX = /\[\[(.*?)\]\]/g;

type ModeCaseKeys = keyof typeof MODE_CASES;
const MODE_CASES = {
    "normal": {
        execute: (v: string) => v,
    },
    "upper": {
        execute: (v: string) => v.toUpperCase(),
    },
    "title": {
        execute: (v: string) => v
            .split("-")
            .map(v => v[0].toUpperCase() + v.slice(1))
            .join("-")
            .split(" ")
            .map(v => v[0].toUpperCase() + v.slice(1))
            .join(" "),
    },
}

function changeCase(value: string, modeCaseKey: ModeCaseKeys) {
    const modeCase = MODE_CASES[modeCaseKey]
    return modeCase.execute(value);
}

function isUppercase(value: string) {
    return value === value.toUpperCase();
}

function convertHypensToSpace(value: string) {
    return value.split("-").join(" ");
}

function parseMatch(match: string) {
    let shouldConvertHypens = true;
    let mode = "normal";

    if (match.startsWith("**")) {
        shouldConvertHypens = false;
        match = match.replace("**", "");
    }

    const [key, defaultValue] = match.split(":");

    if (isUppercase(key)) {
        mode = "upper"
    } else if (isUppercase(key[0])) {
        mode = "title"
    }

    return {
        key,
        shouldConvertHypens,
        mode: mode as ModeCaseKeys,
        defaultValue: defaultValue ?? "",
    }
}

export function compileTemplate(template: string, values: Record<string, string> = {}) {
    return template.replaceAll(TOKEN_REGEX, (_, match) => {
        const { key, mode, defaultValue, shouldConvertHypens } = parseMatch(match);
        let value = values[key] ?? defaultValue;

        
        value = changeCase(value, mode);

        if (shouldConvertHypens) {
            value = convertHypensToSpace(value)
        }

        return value;
    });
}