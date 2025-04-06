var currentAccountConfig; 
// Tambahkan di bagian atas script.js setelah deklarasi variabel
document.getElementById('inputUrl').addEventListener('keydown', function(e) {
    // Blok tombol Enter
    if (e.key === 'Enter') {
        e.preventDefault();
        showCustomAlert('Hanya boleh memasukkan 1 URL', 'error');
    }
});

// Untuk menghapus newline yang sudah ada
document.getElementById('inputUrl').addEventListener('input', function() {
    this.value = this.value.replace(/\n/g, '');
});

function showCustomAlert(message, type) {
    const alertBox = document.createElement('div');
    alertBox.classList.add('custom-alert');
    alertBox.classList.add(type);
    alertBox.textContent = message;
    document.body.appendChild(alertBox);
    void alertBox.offsetWidth;
    alertBox.style.bottom = '5%'; 
    alertBox.style.opacity = '1'; 
    setTimeout(function() {
        alertBox.style.bottom = '-100px'; 
        alertBox.style.opacity = '0';
        setTimeout(function() {
            alertBox.remove(); 
        }, 500); 
    }, 3000);
}
function toggleAdvancedOptions() {
    const options = document.getElementById('advancedOptions');
    const button = document.getElementById('toggleAdvanced');
    
    if (options.style.display === 'none') {
        options.style.display = 'block';
        button.innerHTML = 'Sembunyikan Opsi Lanjutan ▲';
        button.style.backgroundColor = '#e74c3c';
    } else {
        options.style.display = 'none';
        button.innerHTML = 'Tampilkan Opsi Lanjutan ▼';
        button.style.backgroundColor = '#3498db';
    }
}

function aksi() {
    $('#details').html('<div class="loader"></div>');
    let teksInput = $('#inputUrl').val()
        .replaceAll('vmess://', '\nvmess://')
        .replaceAll('vless://', '\nvless://')
        .replaceAll('trojan://', '\ntrojan://')
        .replaceAll('trojan-go://', '\ntrojan://')
        .replace(/[;,\s\t]/gm, '\n')
        .replace(/\n+/gm, '\n');
    arrTeksInput = teksInput.split('\n');
    arrTeksInput = arrTeksInput.filter(a => a.startsWith('vmess://') || a.startsWith('vless://') || a.startsWith('trojan://') || a.startsWith('trojan-go://'));
    
    if (arrTeksInput.length > 1) {
        showCustomAlert('URL Terdeteksi Lebih Dari 1, Gunakan Hanya 1 URL Akun.', 'error');
        return;
    }
    
    let format = checkURLFormat(arrTeksInput[0]);
    if (format === 'Unknown') {
        alert('Unknown URL format. Please input a valid URL.');
        return;
    }
    
    setTimeout(function() {
        arrTeksDecode = arrTeksInput.map(a => {
            protocol = a.slice(0, a.indexOf(':'));
            if (a.startsWith('vmess://') == true) {
                a = a.replace('vmess://', '');
                try { a = atob(a) }
                catch(e) { console.log(e) }
                a = a.replace('{', '{"protocol":"vmess",');
                return JSON.parse(a);
            } else {
                return url2Json(a, protocol);
            }
        });
        
// Ganti output JSON dengan tabel HTML yang lebih jelas
let output = `
    <table style="width:100%; border-collapse:collapse; font-family:system-ui,-apple-system,sans-serif; font-size:14px; margin:8px 0; background:#fff; border-radius:6px; overflow:hidden; box-shadow:0 1px 3px rgba(0,0,0,0.05);">
        <thead>
            <tr style="background:#f8f9fa;">
                <th style="padding:8px 12px; text-align:left; border-bottom:1px solid #e1e4e8; font-weight:600; color:#24292e; width:35%;">PARAMETER</th>
                <th style="padding:8px 12px; text-align:left; border-bottom:1px solid #e1e4e8; font-weight:600; color:#24292e;">VALUE</th>
            </tr>
        </thead>
        <tbody>
`;

// Fungsi format value dengan kontras yang lebih baik
const formatValue = (value) => {
    if (value === null || value === undefined) return '<span style="color:#6a737d;">-</span>';
    if (typeof value === 'boolean') return `<span style="color:${value ? '#22863a' : '#cb2431'}">${value ? '✓' : '✗'} ${value}</span>`;
    if (typeof value === 'object') return `<div style="background:#f6f8fa; padding:6px 8px; border-radius:4px; font-family:monospace; font-size:13px; overflow-x:auto; color:#24292e;">${JSON.stringify(value, null, 2)}</div>`;
    if (typeof value === 'string' && (value.match(/^[0-9a-f]{8}-/) || value.length > 40)) 
        return `<code style="background:#f6f8fa; padding:2px 4px; border-radius:3px; word-break:break-all; display:inline-block; max-width:100%; color:#24292e;">${value}</code>`;
    return `<span style="color:#24292e;">${value}</span>`; // Tambahkan warna teks default
};

// Urutan parameter penting
const priorityParams = ['protocol', 'add', 'port', 'id', 'ps', 'host', 'path', 'type', 'security', 'tls', 'sni', 'net', 'alpn'];

// Generate baris tabel
Object.entries(arrTeksDecode[0])
    .sort(([a], [b]) => {
        const aIdx = priorityParams.indexOf(a);
        const bIdx = priorityParams.indexOf(b);
        return (aIdx === -1 ? Infinity : aIdx) - (bIdx === -1 ? Infinity : bIdx);
    })
    .forEach(([key, value]) => {
        if (value === undefined || value === '') return;
        
        const displayName = key
            .replace(/([A-Z])/g, ' $1')
            .replace(/_/g, ' ')
            .replace(/^./, str => str.toUpperCase())
            .trim();
            
        output += `
            <tr style="border-bottom:1px solid #eaecef;">
                <td style="padding:8px 12px; vertical-align:top; font-weight:500; color:#24292e;">${displayName}</td>
                <td style="padding:8px 12px; vertical-align:top; word-break:break-word; line-height:1.4; color:#24292e;">${formatValue(value)}</td>
            </tr>
        `;
    });

output += `
        </tbody>
    </table>
`;

$('#outputResult').html(output);
        
        if (arrTeksDecode.length > 0) {
            currentAccountConfig = arrTeksDecode[0];
            let protocol = currentAccountConfig.protocol;
            if (protocol === 'trojan') {
                functionTrojan(currentAccountConfig);
            } else if (protocol === 'vmess') {
                functionVmess(currentAccountConfig);
            } else if (protocol === 'vless') {
                functionVless(currentAccountConfig);
            }
        } else {
            $('#details').html('');
        }
    }, 500);
}

function checkURLFormat(url) {
    if (url.startsWith('vmess://')) {
        return 'VMess';
    } else if (url.startsWith('vless://')) {
        return 'VLess';
    } else if (url.startsWith('trojan://') || url.startsWith('trojan-go://')) {
        return 'Trojan';
    } else {
        return 'URL tidak dikenal';
    }
}

function url2Json(a, protocol) {
    a = a.replace(protocol + '://', '"id=')
        .replace('@', '","add=')
        .replace('#', '","ps=')
        .replace(/:(?!.*:)/, '","port=')
        .replace(/\?|&/g, '","')
        .replace(/=/g, '":"')
        .replace(/%2F/g, '/')
        .replace(/\\/g, '');
    a = a.replace(/"port":"(\d+)[^"]*"/, '"port":"$1"');
    a = '{"protocol":"' + protocol + '",' + a + '"}';
    return JSON.parse(a);
}

function setProtocol(protocol) {
    $('#details').html('<div class="loader"></div>');
    setTimeout(function() {
        $('#details').html('');
        if (protocol === 'trojan') {
            functionTrojan();
        } else if (protocol === 'vmess') {
            functionVmess();
        } else if (protocol === 'vless') {
            functionVless();
        }
    }, 500);
}

function resetResults() {
    document.getElementById('resultOutput').innerHTML = '';
    document.getElementById('downloadButtonContainer').innerHTML = '';
}

function copyResults() {
    const resultTextarea = document.getElementById('resultTextarea');
    resultTextarea.select();
    document.execCommand('copy');
    showCustomAlert('Text Sudah Tercopy','success');
}
