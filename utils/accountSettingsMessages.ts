export const translateAccountMessage = (
    t: (key: string) => string,
    message: string
) => {
    const key = `accountSettings.messages.${message}`;
    const translated = t(key);

    return translated === key ? message : translated;
}
