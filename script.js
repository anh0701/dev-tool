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

    const candidates = [",", ";", "\t", " "]

    let best = ","
    let max = 0

    candidates.forEach(d => {
        const count = line.split(d).length
        if (count > max) {
            max = count
            best = d
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

    if (delimiter === "\\t") {
        delimiter = "\t"
    }

    const rows = lines.map(line =>
        line.split(delimiter).map(v => v.trim())
    )

    return rows
}

function csvToMarkdown() {

    const text = document.getElementById("input").value

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

        let obj = {}

        headers.forEach((h, i) => {
            obj[h] = row[i] ?? ""
        })

        return obj
    })

    document.getElementById("output").value =
        JSON.stringify(result, null, 2)

}

