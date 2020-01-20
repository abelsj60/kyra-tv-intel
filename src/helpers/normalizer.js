export default function normalizer(text) {
  return text.replace(/\s+/g, '-').toLowerCase();
}
