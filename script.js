document.getElementById("fileInput").addEventListener("change", function (e) {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()

    reader.onload = function (event) {
        document.getElementById("input").value = event.target.result
    }

    reader.readAsText(file)
})


function clearInput() {
    document.getElementById("input").value = ""
    document.getElementById("output").value = ""
}


function copyOutput() {
    const text = document.getElementById("output").value
    navigator.clipboard.writeText(text)
}


function download() {

    const text = document.getElementById("output").value

    const blob = new Blob([text], { type: "application/json" })

    const a = document.createElement("a")

    a.href = URL.createObjectURL(blob)

    a.download = "result.json"

    a.click()
}



function detectDelimiter(line) {

    const candidates = [
        { name: ",", regex: /,/g },
        { name: ";", regex: /;/g },
        { name: "\t", regex: /\t/g },
        { name: "space", regex: /\s+/g }
    ]

    let best = ","
    let max = 0

    candidates.forEach(c => {

        const matches = line.match(c.regex)

        const count = matches ? matches.length : 0

        if (count > max) {
            max = count
            best = c.name
        }

    })

    return best
}



function parseCSV(text) {

    const lines = text
        .trim()
        .split(/\r?\n/)
        .filter(line => line.trim() !== "")


    let delimiter = document.getElementById("delimiter").value


    if (delimiter === "auto") {
        delimiter = detectDelimiter(lines[0])
    }


    if (delimiter === "space") {
        return lines.map(line =>
            line.trim().split(/\s+/)
        )
    }


    if (delimiter === "\\t" || delimiter === "\t") {
        return lines.map(line =>
            line.split(/\t/).map(v => v.trim())
        )
    }


    return lines.map(line =>
        line.split(delimiter).map(v => v.trim())
    )

}



function csvToMarkdown() {

    const text = document.getElementById("input").value

    if (!text) return

    const rows = parseCSV(text)

    const headers = rows[0]

    let md = ""

    md += "| " + headers.join(" | ") + " |\n"

    md += "| " + headers.map(() => "---").join(" | ") + " |\n"

    rows.slice(1).forEach(row => {
        md += "| " + row.join(" | ") + " |\n"
    })

    document.getElementById("output").value = md

}



function convert() {

    const text = document.getElementById("input").value.trim()

    if (!text) return

    const rows = parseCSV(text)

    const headers = rows[0]

    const result = rows.slice(1).map(row => {

        const obj = {}

        headers.forEach((h, i) => {
            obj[h] = row[i] ?? ""
        })

        return obj

    })

    document.getElementById("output").value =
        JSON.stringify(result, null, 2)

}


function jsonToString() {
    const input = document.getElementById("input").value

    try {
        const obj = JSON.parse(input)
        const str = JSON.stringify(obj)
        document.getElementById("output").value = JSON.stringify(str)
    } catch (e) {
        alert("Invalid JSON")
    }
}

function jsonPretty() {
    const input = document.getElementById("input").value

    try {
        const obj = JSON.parse(input)
        document.getElementById("output").value =
            JSON.stringify(obj, null, 2)
    } catch {
        alert("Invalid JSON")
    }
}

function stringToJson() {
    const input = document.getElementById("input").value

    try {
        const str = JSON.parse(input)
        const obj = JSON.parse(str)

        document.getElementById("output").value =
            JSON.stringify(obj, null, 2)
    } catch {
        alert("Invalid JSON String")
    }
}