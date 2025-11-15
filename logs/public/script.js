async function ping() {
  const res = await fetch('/api/ping');
  const data = await res.json();
  document.getElementById('out').innerText = JSON.stringify(data, null, 2);
}
