// ZIP files using the stored method, so the classroom download needs no CDN.
const encoder = new TextEncoder();
const crcTable = Uint32Array.from({ length: 256 }, (_, index) => {
  let value = index;
  for (let bit = 0; bit < 8; bit++) value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
  return value >>> 0;
});

function crc32(bytes) {
  let value = 0xffffffff;
  for (const byte of bytes) value = crcTable[(value ^ byte) & 255] ^ (value >>> 8);
  return (value ^ 0xffffffff) >>> 0;
}

export function createZip(files) {
  const chunks = [];
  const central = [];
  let offset = 0;
  for (const [path, content] of Object.entries(files)) {
    const name = encoder.encode(path);
    const bytes = typeof content === "string" ? encoder.encode(content) : content;
    const checksum = crc32(bytes);
    const local = new Uint8Array(30 + name.length);
    const header = new DataView(local.buffer);
    header.setUint32(0, 0x04034b50, true);
    header.setUint16(4, 20, true);
    header.setUint16(6, 0x0800, true);
    header.setUint32(14, checksum, true);
    header.setUint32(18, bytes.length, true);
    header.setUint32(22, bytes.length, true);
    header.setUint16(26, name.length, true);
    local.set(name, 30);
    chunks.push(local, bytes);

    const entry = new Uint8Array(46 + name.length);
    const record = new DataView(entry.buffer);
    record.setUint32(0, 0x02014b50, true);
    record.setUint16(4, 20, true);
    record.setUint16(6, 20, true);
    record.setUint16(8, 0x0800, true);
    record.setUint32(16, checksum, true);
    record.setUint32(20, bytes.length, true);
    record.setUint32(24, bytes.length, true);
    record.setUint16(28, name.length, true);
    record.setUint32(42, offset, true);
    entry.set(name, 46);
    central.push(entry);
    offset += local.length + bytes.length;
  }
  const centralSize = central.reduce((total, entry) => total + entry.length, 0);
  const end = new Uint8Array(22);
  const footer = new DataView(end.buffer);
  footer.setUint32(0, 0x06054b50, true);
  footer.setUint16(8, central.length, true);
  footer.setUint16(10, central.length, true);
  footer.setUint32(12, centralSize, true);
  footer.setUint32(16, offset, true);
  return new Blob([...chunks, ...central, end], { type: "application/zip" });
}
