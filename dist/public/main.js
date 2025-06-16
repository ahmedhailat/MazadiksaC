console.log('Mazad KSA Platform Loading...');
fetch('/api/stats')
  .then(r => r.json())
  .then(data => {
    console.log('API Connected:', data);
    document.querySelector('#root').innerHTML += '<p style="color: green;">✅ API Connected - ' + data.activeAuctions + ' auctions available</p>';
  })
  .catch(e => {
    console.log('API Error:', e);
    document.querySelector('#root').innerHTML += '<p style="color: red;">⚠️ API Connection Issue</p>';
  });