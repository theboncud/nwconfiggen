function TrojanWsProxypr() {
    let subActionsDiv = document.createElement('div');
    subActionsDiv.id = 'subActionsDiv';
    subActionsDiv.style.display = 'flex';
    subActionsDiv.style.gap = '10px';
    subActionsDiv.style.flexWrap = 'wrap';
    subActionsDiv.style.margin = '10px 0';
    
    subActionsDiv.innerHTML = `
        <button style="padding:8px 15px; background:#27ae60; color:white; border:none; border-radius:5px; cursor:pointer;" 
            onclick="trojanwsmodesni()">🔒 Mode SNI</button>
        <button style="padding:8px 15px; background:#27ae60; color:white; border:none; border-radius:5px; cursor:pointer;" 
            onclick="trojanwsmodecdn()">🌐 Mode CDN</button>
        <button style="padding:8px 15px; background:#27ae60; color:white; border:none; border-radius:5px; cursor:pointer;" 
            onclick="trojanwsmodecampur()">🔄 Mode Mix</button>
        <button style="padding:8px 15px; background:#27ae60; color:white; border:none; border-radius:5px; cursor:pointer;" 
            onclick="trojanwsmodehost()">✏️ Custom Host</button>
        <button style="padding:8px 15px; background:#27ae60; color:white; border:none; border-radius:5px; cursor:pointer;" 
            onclick="trojanwsmodepath()">↔️ Custom Path</button>
    `;
    document.getElementById('details').appendChild(subActionsDiv);
    document.getElementById('trojanWS').remove();
    resetResults();
}

function trojanwsmodesni() {
    const { protocol, id, add, port, sni, type, host, path } = currentAccountConfig;
    const inputBugArray = document.getElementById('inputBug').value.split(/\n|,/).map(item => item.trim()).filter(Boolean);
    
    let outputText = '# WS SNI\nproxies:';
    inputBugArray.forEach((bug, index) => {
        outputText += `
- name: Bug-${index + 1}. ${bug}
  server: ${host || add}
  port: ${port}
  type: ${protocol}
  password: ${id}
  skip-cert-verify: true
  sni: ${bug}
  network: ${type}
  ws-opts:
      path: ${path}
      headers:
        Host: ${bug}
  udp: true\n `;
    });

    const detailsDiv = document.getElementById('details');
    detailsDiv.innerHTML = `
        <textarea id="resultTextarea" style="width:100%; height:200px; padding:10px; margin:10px 0; border-radius:5px; border:1px solid #ddd;">${outputText}</textarea>
        <button style="padding:10px 20px; background:#27ae60; color:white; border:none; border-radius:5px; cursor:pointer; display:block; margin:0 auto;" 
            onclick="copyResults()">📋 Copy All</button>
    `;
}

function trojanwsmodecdn() {
    const { protocol, id, add, port, sni, type, host, path } = currentAccountConfig;
    const inputBugArray = document.getElementById('inputBug2').value.split(/\n|,/).map(item => item.trim()).filter(Boolean);
    
    let outputText = '# WS CDN\nproxies:';
    inputBugArray.forEach((bug, index) => {
        outputText += `
- name: Bug-${index + 1}. ${bug}
  server: ${bug}
  port: ${port}
  type: ${protocol}
  password: ${id}
  skip-cert-verify: true
  sni: ${host || add}
  network: ${type}
  ws-opts:
      path: ${path}
      headers:
        Host: ${host || add}
  udp: true\n `;
    });

    const detailsDiv = document.getElementById('details');
    detailsDiv.innerHTML = `
        <textarea id="resultTextarea" style="width:100%; height:200px; padding:10px; margin:10px 0; border-radius:5px; border:1px solid #ddd;">${outputText}</textarea>
        <button style="padding:10px 20px; background:#27ae60; color:white; border:none; border-radius:5px; cursor:pointer; display:block; margin:0 auto;" 
            onclick="copyResults()">📋 Copy All</button>
    `;
}

function trojanwsmodecampur() {
    const { protocol, id, add, port, sni, type, host, path } = currentAccountConfig;
    const inputBugArray1 = document.getElementById('inputBug').value.split(/\n|,/).map(item => item.trim()).filter(Boolean);
    const inputBugArray2 = document.getElementById('inputBug2').value.split(/\n|,/).map(item => item.trim()).filter(Boolean);
    
    let outputText = '# SNI & CDN \nproxies:';
    
    inputBugArray1.forEach((bug, index) => {
        outputText += `
- name: Bug-${index + 1}. ${bug} (SNI)
  server: ${host || add}
  port: ${port}
  type: ${protocol}
  password: ${id}
  skip-cert-verify: true
  sni: ${bug}
  network: ${type}
  ws-opts:
      path: ${path}
      headers:
        Host: ${bug}
  udp: true\n `;
    });

    inputBugArray2.forEach((bug, index) => {
        outputText += `
- name: Bug-${inputBugArray1.length + index + 1}. ${bug} (CDN)
  server: ${bug}
  port: ${port}
  type: ${protocol}
  password: ${id}
  skip-cert-verify: true
  sni: ${host || add}
  network: ${type}
  ws-opts:
      path: ${path}
      headers:
        Host: ${host || add}
  udp: true\n `;
    });

    const detailsDiv = document.getElementById('details');
    detailsDiv.innerHTML = `
        <textarea id="resultTextarea" style="width:100%; height:200px; padding:10px; margin:10px 0; border-radius:5px; border:1px solid #ddd;">${outputText}</textarea>
        <button style="padding:10px 20px; background:#27ae60; color:white; border:none; border-radius:5px; cursor:pointer; display:block; margin:0 auto;" 
            onclick="copyResults()">📋 Copy All</button>
    `;
}
function trojanwsmodehost() {
    const ipt1 = document.getElementById('ipthost1').value.trim();
    const ipt2 = document.getElementById('ipthost2').value.trim();
    // Cek apakah ipthost1 atau ipthost2 kosong
    if (!ipt1 || !ipt2) {
        alert("Mohon isi kedua kolom 'Custom Host 1' dan 'Custom Host 2' terlebih dahulu!");
        return;
    }
    const { protocol, id, add, port, sni, type, host, path } = currentAccountConfig;
    const iba = document.getElementById('inputBug').value.split(/\n|,/).map(i => i.trim()).filter(Boolean);
    const iba2 = ipt1.split(/\n|,/).map(i => i.trim()).filter(Boolean);
    const iba3 = ipt2.split(/\n|,/).map(i => i.trim()).filter(Boolean);
    let output = '# Costume Host\nproxies:';
    iba.forEach((bug, i) => {
        const sniVal = iba2[i % iba2.length] || host || add;
        const hostVal = iba3[i % iba3.length] || host || add;
        output += `
- name: Bug-${i + 1}. ${bug}
  server: ${bug}
  port: ${port}
  type: ${protocol}
  password: ${id}
  skip-cert-verify: true
  sni: ${sniVal}
  network: ${type}
  ws-opts:
    path: ${path}
    headers:
      Host: ${hostVal}
  udp: true
`;
    });

    const detailsDiv = document.getElementById('details');
    detailsDiv.innerHTML = `
        <textarea id="resultTextarea" style="width:100%; height:200px; padding:10px; margin:10px 0; border-radius:5px; border:1px solid #ddd;">${outputText}</textarea>
        <button style="padding:10px 20px; background:#27ae60; color:white; border:none; border-radius:5px; cursor:pointer; display:block; margin:0 auto;" 
            onclick="copyResults()">📋 Copy All</button>
    `;
}

function trojanwsmodepath() {
    const iptp = document.getElementById('iptpath').value.trim();
    if (!iptp) {
        alert("Mohon isi kolom path terlebih dahulu!");
        return;
    }
    const { protocol, id, add, port, sni, type, host, path } = currentAccountConfig;
    const iba = document.getElementById('inputBug').value.split(/\n|,/).map(i => i.trim()).filter(Boolean);
    const iba2 = iptp.split(/\n|,/).map(i => i.trim()).filter(Boolean);
    let output = '# Costume Path\nproxies:';
    iba.forEach((bug, i) => {
        const pathVal = iba2[i % iba2.length] || host || add;
        output += `
- name: Bug-${i + 1}. ${bug}
  server: ${bug}
  port: ${port}
  type: ${protocol}
  password: ${id}
  skip-cert-verify: true
  sni: ${host || add}
  network: ${type}
  ws-opts:
    path: ${pathVal}
    headers:
      Host: ${host || add}
  udp: true
`;
    });

    const detailsDiv = document.getElementById('details');
    detailsDiv.innerHTML = `
        <textarea id="resultTextarea" style="width:100%; height:200px; padding:10px; margin:10px 0; border-radius:5px; border:1px solid #ddd;">${outputText}</textarea>
        <button style="padding:10px 20px; background:#27ae60; color:white; border:none; border-radius:5px; cursor:pointer; display:block; margin:0 auto;" 
            onclick="copyResults()">📋 Copy All</button>
    `;
}


function Trojangrpc() {
    showCustomAlert('TROJAN GRPC','success');
    let subActionsDiv = document.createElement('div');
    subActionsDiv.id = 'subActionsDiv';
    subActionsDiv.style.display = 'flex';
    subActionsDiv.style.gap = '10px';
    subActionsDiv.style.margin = '10px 0';
    
    subActionsDiv.innerHTML = `
        <button style="padding:8px 15px; background:#2ecc71; color:white; border:none; border-radius:5px; cursor:pointer;" 
            onclick="trojangrpcmodesni()">🔒 Mode SNI</button>
    `;
    document.getElementById('details').appendChild(subActionsDiv);
    document.getElementById('trojanGRPC').remove();
    resetResults();
}

function trojangrpcmodesni() {
    const { protocol, id, add, port, sni, type, host, path, serviceName } = currentAccountConfig;
    const inputBugArray = document.getElementById('inputBug').value.split(/\n|,/).map(item => item.trim()).filter(Boolean);

    let outputText = '# GRPC SNI\nproxies:';
    inputBugArray.forEach((bug, index) => {
        outputText += `
- name: Bug ${index + 1}. ${bug}
  server: ${host || add}
  port: ${port}
  type: ${protocol}
  password: ${id}
  skip-cert-verify: true
  sni: ${bug}
  network: ${type}
  ws-opts:
      path: ${serviceName || path}
      headers:
        Host: ${bug}
  udp: true\n `;
    });

    const detailsDiv = document.getElementById('details');
    detailsDiv.innerHTML = `
        <textarea id="resultTextarea" style="width:100%; height:200px; padding:10px; margin:10px 0; border-radius:5px; border:1px solid #ddd;">${outputText}</textarea>
        <button style="padding:10px 20px; background:#27ae60; color:white; border:none; border-radius:5px; cursor:pointer; display:block; margin:0 auto;" 
            onclick="copyResults()">📋 Copy All</button>
    `;
}

