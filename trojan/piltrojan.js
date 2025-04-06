function functionTrojan(config) {
    const selectedConfig = document.getElementById('configType').value;

    let buttonHtml = '<div style="display:flex; justify-content:center; gap:10px; margin:10px 0; flex-wrap:wrap;">';
    if (config.type === 'ws') {
        if (selectedConfig === 'fakeip') {
            buttonHtml += `<button style="padding:8px 15px; background:#27ae60; color:white; border:none; border-radius:5px; cursor:pointer;" 
                onclick="TrojanWsFakeip()">🔄 Trojan WS Fake IP</button>`;
        } else if (selectedConfig === 'redirhost') {
            buttonHtml += `<button style="padding:8px 15px; background:#e67e22; color:white; border:none; border-radius:5px; cursor:pointer;" 
                onclick="TrojanWsRedir()">🔄 Trojan WS Redir Host</button>`;
        } else if (selectedConfig === 'proxypr') {
            buttonHtml += `<button id="trojanWS" style="padding:8px 15px; background:#2980b9; color:white; border:none; border-radius:5px; cursor:pointer;" 
                onclick="TrojanWsProxypr()">🔄 Trojan WS Proxy Provider</button>`;
        } 
    }

    if (config.type === 'grpc') {
        if (selectedConfig === 'fakeip') {
            buttonHtml += `<button style="padding:8px 15px; background:#8e44ad; color:white; border:none; border-radius:5px; cursor:pointer;" 
                onclick="TrojanGrpcFakeip()">🔄 Trojan GRPC Fake IP</button>`;
        } else if (selectedConfig === 'redirhost') {
            buttonHtml += `<button style="padding:8px 15px; background:#d35400; color:white; border:none; border-radius:5px; cursor:pointer;" 
                onclick="TrojanGrpcRedir()">🔄 Trojan GRPC Redir Host</button>`;
        } else if (selectedConfig === 'proxypr') {
            buttonHtml += `<button style="padding:8px 15px; background:#16a085; color:white; border:none; border-radius:5px; cursor:pointer;" 
                onclick="TrojanGrpcProxypr()">🔄 Trojan GRPC Proxy Provider</button>`;
        } else {
            buttonHtml += `<button id="trojanGRPC" style="padding:8px 15px; background:#7f8c8d; color:white; border:none; border-radius:5px; cursor:pointer;" 
                onclick="Trojangrpc()">🔄 Trojan GRPC</button>`;
        }
    }

    buttonHtml += '</div>';
    document.getElementById('details').innerHTML = buttonHtml;
    resetResults();
}
