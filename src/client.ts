function clientScript(url: string) {
    const root = document.querySelector("[data-template-root]") as HTMLElement;

    fetch(url + window.location.search, { method: "POST", body: root.innerHTML })
        .then(res => res.text())
        .then(data => root.innerHTML = data)
        .catch(err => root.innerHTML = err)
        .finally(() => root.style.display = "");
}

export function getScript(url: string) {
    return `(${clientScript.toString()})("${url}")`
}