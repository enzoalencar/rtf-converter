function convertRtfToString (rtf: any): string {
  let s = rtf.toString()

  s = s.replace(/\{\\fs\d+\s+(\d[^}]*)\}/gi, "$1");
  s = s.replace(/\\par[d]?/g, "")
  s = s.replace(/\{\*?\\[^{}]+}|[{}]|\\\n?[A-Za-z]+\n?(?:-?\d+)?[ ]?/g, "")

  const groupedEscRe = /(\\'(?:[0-9A-Fa-f]{2})+)/g
  const singleHexRe = /\\'([0-9A-Fa-f]{2})/g

  s = s.replace(groupedEscRe, (match: string) => {
    const hexes: string[] = []
    let m: RegExpExecArray | null
    while ((m = singleHexRe.exec(match)) !== null) hexes.push(m[1])

    if (hexes.length === 0) return match

    const bytes = Uint8Array.from(hexes.map(h => parseInt(h, 16)))
    const buf = Buffer.from(bytes)

    const asUtf8 = buf.toString('utf8')
    if (!asUtf8.includes('\uFFFD')) return asUtf8

    return buf.toString('latin1')
  })

  s = s.replace(/^\s*[A-Za-z0-9 ,.-]+;\s*/i, '')
  return s.trim()
}

let s = convertRtfToString('teste');

console.log(s);
