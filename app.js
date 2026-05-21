// ─── DATA ───
let data = {
  katIn: ['Iuran Warga','Donasi','Dana RT','Sponsor','Lain-lain'],
  katOut: ['Dekorasi','Konsumsi','Hiburan','Perlengkapan','Administrasi','Lain-lain'],
  pemasukan: [
    {id:1,tgl:'2025-07-01',ket:'Iuran Warga Bulan Juli',kat:'Iuran Warga',jml:1500000,note:'Terkumpul dari 30 warga'},
    {id:2,tgl:'2025-07-05',ket:'Donasi Pak RT',kat:'Donasi',jml:500000,note:''},
    {id:3,tgl:'2025-07-10',ket:'Dana RT Tambahan',kat:'Dana RT',jml:750000,note:''},
    {id:4,tgl:'2025-07-12',ket:'Sponsor Toko Sumber Jaya',kat:'Sponsor',jml:300000,note:'Sponsor backdrop'},
  ],
  pengeluaran: [
    {id:1,tgl:'2025-07-08',ket:'Beli Bendera & Umbul-umbul',kat:'Dekorasi',jml:350000,note:''},
    {id:2,tgl:'2025-07-09',ket:'Konsumsi Rapat Panitia',kat:'Konsumsi',jml:120000,note:''},
    {id:3,tgl:'2025-07-11',ket:'Beli Hadiah Perlombaan',kat:'Perlengkapan',jml:400000,note:'Hadiah 10 jenis lomba'},
  ],
  warga: [
    {id:1,nama:'Budi Santoso',rt:'RT 07 / No. 1',nominal:50000,status:'paid'},
    {id:2,nama:'Siti Rahayu',rt:'RT 07 / No. 2',nominal:50000,status:'paid'},
    {id:3,nama:'Ahmad Fauzi',rt:'RT 07 / No. 3',nominal:50000,status:'unpaid'},
    {id:4,nama:'Dewi Puspita',rt:'RT 07 / No. 4',nominal:50000,status:'paid'},
    {id:5,nama:'Hendra Wijaya',rt:'RT 07 / No. 5',nominal:50000,status:'unpaid'},
    {id:6,nama:'Rina Kusuma',rt:'RT 07 / No. 6',nominal:50000,status:'paid'},
    {id:7,nama:'Doni Pratama',rt:'RT 07 / No. 7',nominal:50000,status:'unpaid'},
    {id:8,nama:'Yuli Astuti',rt:'RT 07 / No. 8',nominal:50000,status:'paid'},
    {id:9,nama:'Rudi Hartono',rt:'RT 07 / No. 9',nominal:50000,status:'paid'},
    {id:10,nama:'Mega Putri',rt:'RT 07 / No. 10',nominal:50000,status:'unpaid'},
    {id:11,nama:'Wahyu Setiawan',rt:'RT 07 / No. 11',nominal:50000,status:'paid'},
    {id:12,nama:'Laila Nurjanah',rt:'RT 07 / No. 12',nominal:50000,status:'unpaid'},
  ],
};
const TARGET_DANA = 5000000;
let idCtr = {p:5,e:4,w:13};
let currentPage = 'dashboard';

function saveData() {
  localStorage.setItem('kastaruna_data', JSON.stringify(data));
}

function loadData() {
  const stored = localStorage.getItem('kastaruna_data');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (parsed) {
        data = parsed;
        if (!data.pemasukan) data.pemasukan = [];
        if (!data.pengeluaran) data.pengeluaran = [];
        if (!data.warga) data.warga = [];
        if (!data.katIn) data.katIn = ['Iuran Warga','Donasi','Dana RT','Sponsor','Lain-lain'];
        if (!data.katOut) data.katOut = ['Dekorasi','Konsumsi','Hiburan','Perlengkapan','Administrasi','Lain-lain'];
      }
    } catch (e) {
      console.error("Gagal load data dari local storage:", e);
    }
  } else {
    saveData();
  }
  
  // Hitung kembali idCtr berdasarkan data
  idCtr.p = data.pemasukan && data.pemasukan.length ? Math.max(...data.pemasukan.map(x => x.id)) + 1 : 1;
  idCtr.e = data.pengeluaran && data.pengeluaran.length ? Math.max(...data.pengeluaran.map(x => x.id)) + 1 : 1;
  idCtr.w = data.warga && data.warga.length ? Math.max(...data.warga.map(x => x.id)) + 1 : 1;
}

loadData();

// ─── UTILS ───
const idr = n => 'Rp ' + parseInt(n||0).toLocaleString('id-ID');
const today = () => new Date().toISOString().split('T')[0];

function toast(msg, type='success') {
  const tc = document.getElementById('toastContainer');
  const t = document.createElement('div');
  t.className = 'toast ' + type;
  t.innerHTML = (type==='success'?'✓ ':'✕ ') + msg;
  tc.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

function formatDate(d) {
  if (!d) return '-';
  const [y,m,dd] = d.split('-');
  const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
  return parseInt(dd) + ' ' + months[parseInt(m)-1] + ' ' + y;
}

const totalPemasukan = () => data.pemasukan.reduce((s,x)=>s+x.jml,0);
const totalPengeluaran = () => data.pengeluaran.reduce((s,x)=>s+x.jml,0);
const saldo = () => totalPemasukan() - totalPengeluaran();
const totalIuranBayar = () => data.warga.filter(w=>w.status==='paid').reduce((s,w)=>s+w.nominal,0);

// ─── LOGIN ───
document.getElementById('btnLogin').addEventListener('click', doLogin);
document.getElementById('loginPass').addEventListener('keydown', e => { if(e.key==='Enter') doLogin(); });

function doLogin() {
  const u = document.getElementById('loginUser').value.trim();
  const p = document.getElementById('loginPass').value.trim();
  const err = document.getElementById('loginError');
  if (u === 'admin' && p === 'taruna2026') {
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('app').style.display = 'block';
    initApp();
  } else {
    err.style.display = 'block';
    setTimeout(() => err.style.display = 'none', 2500);
  }
}

document.getElementById('btnLogout').addEventListener('click', () => {
  if (confirm('Yakin ingin keluar?')) {
    document.getElementById('app').style.display = 'none';
    document.getElementById('loginPage').style.display = 'flex';
  }
});

// ─── SIDEBAR ───
document.getElementById('btnMenu').addEventListener('click', () => {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('sidebarOverlay').classList.toggle('open');
});
document.getElementById('sidebarOverlay').addEventListener('click', closeSidebar);

function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.remove('open');
}

// ─── BOTTOM NAV MORE MENU ───
function toggleMoreMenu() {
  document.getElementById('moreMenu').classList.toggle('open');
  document.getElementById('moreMenuOverlay').classList.toggle('open');
}
function closeMoreMenu() {
  document.getElementById('moreMenu').classList.remove('open');
  document.getElementById('moreMenuOverlay').classList.remove('open');
}

// ─── NAVIGATION ───
const pageTitles = {
  dashboard:'Dashboard', pemasukan:'Data Pemasukan', pengeluaran:'Data Pengeluaran',
  iuran:'Iuran Warga', riwayat:'Riwayat Transaksi', laporan:'Laporan Keuangan', kategori:'Kategori'
};
const bnavPages = ['dashboard','pemasukan','pengeluaran','iuran'];

function showPage(name) {
  currentPage = name;
  // Hide all pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-'+name).classList.add('active');

  // Sidebar nav
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const sn = document.getElementById('snav-'+name);
  if (sn) sn.classList.add('active');

  // Bottom nav
  document.querySelectorAll('.bn-item').forEach(b => b.classList.remove('active'));
  const bn = document.getElementById('bnav-'+name);
  if (bn) bn.classList.add('active');
  else document.getElementById('bnav-more').classList.add('active');

  // More menu items
  document.querySelectorAll('.more-menu-item').forEach(m => m.classList.remove('active'));
  const mn = document.getElementById('mnav-'+name);
  if (mn) mn.classList.add('active');

  // Topbar
  document.getElementById('topbarTitle').textContent = pageTitles[name] || name;

  // Close sidebar on mobile
  if (window.innerWidth < 768) closeSidebar();

  // Render
  const renders = {
    dashboard: renderDashboard, pemasukan: renderPemasukan,
    pengeluaran: renderPengeluaran, iuran: renderIuran,
    riwayat: renderRiwayat, laporan: renderLaporan, kategori: renderKategori
  };
  if (renders[name]) renders[name]();
}

// ─── INIT ───
function initApp() {
  const d = new Date();
  document.getElementById('topbarDate').textContent = d.toLocaleDateString('id-ID',{weekday:'long',year:'numeric',month:'long',day:'numeric'});
  document.getElementById('tglPemasukan').value = today();
  document.getElementById('tglPengeluaran').value = today();
  renderKategoriSelects();
  renderDashboard();
}

// ─── DASHBOARD ───
function renderDashboard() {
  const tin=totalPemasukan(), tout=totalPengeluaran(), sal=saldo();
  const bayar=data.warga.filter(w=>w.status==='paid').length;
  const belum=data.warga.filter(w=>w.status==='unpaid').length;
  document.getElementById('statSaldo').textContent = idr(sal);
  document.getElementById('statIn').textContent = idr(tin);
  document.getElementById('statOut').textContent = idr(tout);
  document.getElementById('statIuran').textContent = idr(totalIuranBayar());
  document.getElementById('statIuranSub').textContent = bayar+' dari '+data.warga.length+' warga';
  document.getElementById('dashBayar').textContent = bayar;
  document.getElementById('dashBelum').textContent = belum;
  document.getElementById('dashTotal').textContent = data.warga.length;
  document.getElementById('prgSaldo').textContent = idr(sal);
  document.getElementById('targetDana').textContent = idr(TARGET_DANA);
  const pct = Math.min(100, Math.round(sal/TARGET_DANA*100));
  document.getElementById('prgPct').textContent = pct+'%';
  setTimeout(()=>{ document.getElementById('prgBar').style.width = pct+'%'; }, 100);

  const all = [
    ...data.pemasukan.map(x=>({...x,jenis:'in'})),
    ...data.pengeluaran.map(x=>({...x,jenis:'out'}))
  ].sort((a,b)=>b.tgl.localeCompare(a.tgl)).slice(0,5);

  const el = document.getElementById('dashRecentTx');
  if (!all.length) { el.innerHTML='<div class="empty-state"><div class="es-icon">📭</div><p>Belum ada transaksi</p></div>'; return; }
  el.innerHTML = all.map(tx=>`
    <div class="tl-item">
      <div class="tl-dot ${tx.jenis}">${tx.jenis==='in'?'💵':'💸'}</div>
      <div class="tl-info"><div class="tl-name">${tx.ket}</div><div class="tl-meta">${formatDate(tx.tgl)} · ${tx.kat}</div></div>
      <div class="tl-amount ${tx.jenis==='in'?'amount-in':'amount-out'}">${tx.jenis==='in'?'+':'−'}${idr(tx.jml)}</div>
    </div>`).join('');
}

// ─── MODALS ───
function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }
document.querySelectorAll('.modal-overlay').forEach(mo => {
  mo.addEventListener('click', e => { if(e.target===mo) mo.classList.remove('open'); });
});

// ─── PEMASUKAN ───
function renderPemasukan() {
  const q = document.getElementById('searchPemasukan').value.toLowerCase();
  const fk = document.getElementById('filterKatPemasukan').value;
  let rows = data.pemasukan.filter(x=>(!q||x.ket.toLowerCase().includes(q)||x.kat.toLowerCase().includes(q))&&(!fk||x.kat===fk)).sort((a,b)=>b.tgl.localeCompare(a.tgl));
  const emojis=['💵','💰','🏦','🎁','💳'];
  const tbody = document.getElementById('bodyPemasukan');
  const list = document.getElementById('listPemasukan');
  if (!rows.length) {
    const emp = '<div class="empty-state"><div class="es-icon">📭</div><p>Tidak ada data pemasukan</p></div>';
    tbody.innerHTML = '<tr><td colspan="6">'+emp+'</td></tr>';
    list.innerHTML = emp; return;
  }
  tbody.innerHTML = rows.map((x,i)=>`<tr>
    <td style="color:var(--gray-400);font-size:12px">${i+1}</td>
    <td>${formatDate(x.tgl)}</td>
    <td><div style="font-weight:600;color:var(--gray-900)">${x.ket}</div>${x.note?'<div style="font-size:11px;color:var(--gray-400)">'+x.note+'</div>':''}</td>
    <td><span class="cat-tag">${x.kat}</span></td>
    <td class="amount-in">${idr(x.jml)}</td>
    <td><div class="action-btns" style="display:flex;gap:6px">
      <button class="btn-icon btn-edit" onclick="editPemasukan(${x.id})">✏️</button>
      <button class="btn-icon btn-del" onclick="delPemasukan(${x.id})">🗑️</button>
    </div></td></tr>`).join('');
  list.innerHTML = rows.map(x=>`
    <div class="tx-card">
      <div class="tx-card-icon" style="background:var(--green-light)">💵</div>
      <div class="tx-card-info">
        <div class="tx-card-name">${x.ket}</div>
        <div class="tx-card-meta">${formatDate(x.tgl)} · <span class="cat-tag">${x.kat}</span></div>
      </div>
      <div class="tx-card-right">
        <div class="tx-card-amount amount-in">+${idr(x.jml)}</div>
        <div class="tx-card-actions">
          <button class="btn-icon btn-edit" onclick="editPemasukan(${x.id})">✏️</button>
          <button class="btn-icon btn-del" onclick="delPemasukan(${x.id})">🗑️</button>
        </div>
      </div>
    </div>`).join('');
}

function savePemasukan() {
  const id = document.getElementById('editIdPemasukan').value;
  const obj = {
    tgl:document.getElementById('tglPemasukan').value,
    ket:document.getElementById('ketPemasukan').value.trim(),
    kat:document.getElementById('katPemasukan').value,
    jml:parseInt(document.getElementById('jmlPemasukan').value)||0,
    note:document.getElementById('notePemasukan').value.trim()
  };
  if(!obj.tgl||!obj.ket||!obj.kat||!obj.jml){toast('Lengkapi semua field!','error');return;}
  if(id){const idx=data.pemasukan.findIndex(x=>x.id==id);data.pemasukan[idx]={...data.pemasukan[idx],...obj};toast('Pemasukan diperbarui!');}
  else{data.pemasukan.push({id:idCtr.p++,...obj});toast('Pemasukan ditambahkan!');}
  saveData();
  closeModal('modalPemasukan');resetFormPemasukan();renderPemasukan();renderDashboard();
}
function resetFormPemasukan(){document.getElementById('editIdPemasukan').value='';document.getElementById('titleModalPemasukan').textContent='Tambah Pemasukan';document.getElementById('tglPemasukan').value=today();['ketPemasukan','jmlPemasukan','notePemasukan'].forEach(id=>document.getElementById(id).value='');document.getElementById('katPemasukan').value='';}
function editPemasukan(id){const x=data.pemasukan.find(p=>p.id===id);document.getElementById('editIdPemasukan').value=id;document.getElementById('titleModalPemasukan').textContent='Edit Pemasukan';document.getElementById('tglPemasukan').value=x.tgl;document.getElementById('ketPemasukan').value=x.ket;document.getElementById('katPemasukan').value=x.kat;document.getElementById('jmlPemasukan').value=x.jml;document.getElementById('notePemasukan').value=x.note||'';openModal('modalPemasukan');}
function delPemasukan(id){if(!confirm('Hapus data ini?'))return;data.pemasukan=data.pemasukan.filter(x=>x.id!==id);saveData();toast('Data dihapus!','error');renderPemasukan();renderDashboard();}

// ─── PENGELUARAN ───
function renderPengeluaran() {
  const q=document.getElementById('searchPengeluaran').value.toLowerCase();
  const fk=document.getElementById('filterKatPengeluaran').value;
  let rows=data.pengeluaran.filter(x=>(!q||x.ket.toLowerCase().includes(q)||x.kat.toLowerCase().includes(q))&&(!fk||x.kat===fk)).sort((a,b)=>b.tgl.localeCompare(a.tgl));
  const tbody=document.getElementById('bodyPengeluaran');
  const list=document.getElementById('listPengeluaran');
  if(!rows.length){const emp='<div class="empty-state"><div class="es-icon">📭</div><p>Tidak ada data pengeluaran</p></div>';tbody.innerHTML='<tr><td colspan="6">'+emp+'</td></tr>';list.innerHTML=emp;return;}
  tbody.innerHTML=rows.map((x,i)=>`<tr>
    <td style="color:var(--gray-400);font-size:12px">${i+1}</td>
    <td>${formatDate(x.tgl)}</td>
    <td><div style="font-weight:600;color:var(--gray-900)">${x.ket}</div>${x.note?'<div style="font-size:11px;color:var(--gray-400)">'+x.note+'</div>':''}</td>
    <td><span class="cat-tag">${x.kat}</span></td>
    <td class="amount-out">${idr(x.jml)}</td>
    <td><div style="display:flex;gap:6px"><button class="btn-icon btn-edit" onclick="editPengeluaran(${x.id})">✏️</button><button class="btn-icon btn-del" onclick="delPengeluaran(${x.id})">🗑️</button></div></td></tr>`).join('');
  list.innerHTML=rows.map(x=>`
    <div class="tx-card">
      <div class="tx-card-icon" style="background:var(--red-light)">💸</div>
      <div class="tx-card-info">
        <div class="tx-card-name">${x.ket}</div>
        <div class="tx-card-meta">${formatDate(x.tgl)} · <span class="cat-tag">${x.kat}</span></div>
      </div>
      <div class="tx-card-right">
        <div class="tx-card-amount amount-out">−${idr(x.jml)}</div>
        <div class="tx-card-actions">
          <button class="btn-icon btn-edit" onclick="editPengeluaran(${x.id})">✏️</button>
          <button class="btn-icon btn-del" onclick="delPengeluaran(${x.id})">🗑️</button>
        </div>
      </div>
    </div>`).join('');
}

function savePengeluaran(){const id=document.getElementById('editIdPengeluaran').value;const obj={tgl:document.getElementById('tglPengeluaran').value,ket:document.getElementById('ketPengeluaran').value.trim(),kat:document.getElementById('katPengeluaran').value,jml:parseInt(document.getElementById('jmlPengeluaran').value)||0,note:document.getElementById('notePengeluaran').value.trim()};if(!obj.tgl||!obj.ket||!obj.kat||!obj.jml){toast('Lengkapi semua field!','error');return;}if(id){const idx=data.pengeluaran.findIndex(x=>x.id==id);data.pengeluaran[idx]={...data.pengeluaran[idx],...obj};toast('Pengeluaran diperbarui!');}else{data.pengeluaran.push({id:idCtr.e++,...obj});toast('Pengeluaran ditambahkan!');}saveData();closeModal('modalPengeluaran');resetFormPengeluaran();renderPengeluaran();renderDashboard();}
function resetFormPengeluaran(){document.getElementById('editIdPengeluaran').value='';document.getElementById('titleModalPengeluaran').textContent='Tambah Pengeluaran';document.getElementById('tglPengeluaran').value=today();['ketPengeluaran','jmlPengeluaran','notePengeluaran'].forEach(id=>document.getElementById(id).value='');document.getElementById('katPengeluaran').value='';}
function editPengeluaran(id){const x=data.pengeluaran.find(p=>p.id===id);document.getElementById('editIdPengeluaran').value=id;document.getElementById('titleModalPengeluaran').textContent='Edit Pengeluaran';document.getElementById('tglPengeluaran').value=x.tgl;document.getElementById('ketPengeluaran').value=x.ket;document.getElementById('katPengeluaran').value=x.kat;document.getElementById('jmlPengeluaran').value=x.jml;document.getElementById('notePengeluaran').value=x.note||'';openModal('modalPengeluaran');}
function delPengeluaran(id){if(!confirm('Hapus data ini?'))return;data.pengeluaran=data.pengeluaran.filter(x=>x.id!==id);saveData();toast('Data dihapus!','error');renderPengeluaran();renderDashboard();}

// ─── IURAN WARGA ───
const emojisW=['👨','👩','🧑','👦','👧','🧔','👴','👵','🙎','🙍'];
function renderIuran(){
  const q=document.getElementById('searchIuran').value.toLowerCase();
  const fs=document.getElementById('filterStatusIuran').value;
  let warga=data.warga.filter(w=>(!q||w.nama.toLowerCase().includes(q)||w.rt.toLowerCase().includes(q))&&(!fs||w.status===fs));
  const grid=document.getElementById('iuranGrid');
  if(!warga.length){grid.innerHTML='<div class="empty-state" style="grid-column:1/-1"><div class="es-icon">👥</div><p>Tidak ada data warga</p></div>';return;}
  grid.innerHTML=warga.map(w=>`
    <div class="warga-card">
      <div class="warga-avatar">${emojisW[w.id%emojisW.length]}</div>
      <div class="warga-info">
        <div class="wname">${w.nama}</div>
        <div class="wrt">${w.rt}</div>
        <div class="wnom">${idr(w.nominal)}</div>
      </div>
      <div style="display:flex;flex-direction:column;gap:6px;align-items:flex-end;flex-shrink:0">
        <button class="toggle-bayar ${w.status}" onclick="toggleBayar(${w.id})">${w.status==='paid'?'✓ Lunas':'✗ Belum'}</button>
        <div style="display:flex;gap:4px">
          <button class="btn-icon btn-edit" onclick="editWarga(${w.id})" style="width:28px;height:28px;font-size:13px">✏️</button>
          <button class="btn-icon btn-del" onclick="delWarga(${w.id})" style="width:28px;height:28px;font-size:13px">🗑️</button>
        </div>
      </div>
    </div>`).join('');
}
function toggleBayar(id){const w=data.warga.find(x=>x.id===id);w.status=w.status==='paid'?'unpaid':'paid';toast(w.status==='paid'?w.nama+' tandai lunas ✓':w.nama+' belum bayar');saveData();renderIuran();renderDashboard();}
function saveWarga(){const id=document.getElementById('editIdWarga').value;const obj={nama:document.getElementById('namaWarga').value.trim(),rt:document.getElementById('rtWarga').value.trim(),nominal:parseInt(document.getElementById('nominalWarga').value)||50000,status:document.getElementById('statusWarga').value};if(!obj.nama||!obj.rt){toast('Isi nama dan RT!','error');return;}if(id){const idx=data.warga.findIndex(x=>x.id==id);data.warga[idx]={...data.warga[idx],...obj};toast('Data warga diperbarui!');}else{data.warga.push({id:idCtr.w++,...obj});toast('Warga ditambahkan!');}saveData();closeModal('modalWarga');resetFormWarga();renderIuran();renderDashboard();}
function resetFormWarga(){document.getElementById('editIdWarga').value='';document.getElementById('titleModalWarga').textContent='Tambah Data Warga';['namaWarga','rtWarga','nominalWarga'].forEach(id=>document.getElementById(id).value='');document.getElementById('statusWarga').value='unpaid';}
function editWarga(id){const w=data.warga.find(x=>x.id===id);document.getElementById('editIdWarga').value=id;document.getElementById('titleModalWarga').textContent='Edit Data Warga';document.getElementById('namaWarga').value=w.nama;document.getElementById('rtWarga').value=w.rt;document.getElementById('nominalWarga').value=w.nominal;document.getElementById('statusWarga').value=w.status;openModal('modalWarga');}
function delWarga(id){if(!confirm('Hapus data warga ini?'))return;data.warga=data.warga.filter(x=>x.id!==id);saveData();toast('Data dihapus!','error');renderIuran();renderDashboard();}

// ─── RIWAYAT ───
function renderRiwayat(){
  const fj=document.getElementById('filterJenisTx').value;
  let all=[...data.pemasukan.map(x=>({...x,jenis:'in'})),...data.pengeluaran.map(x=>({...x,jenis:'out'}))].filter(x=>!fj||x.jenis===fj).sort((a,b)=>b.tgl.localeCompare(a.tgl));
  const el=document.getElementById('riwayatList');
  if(!all.length){el.innerHTML='<div class="empty-state"><div class="es-icon">📭</div><p>Belum ada riwayat</p></div>';return;}
  el.innerHTML=all.map(tx=>`
    <div class="tl-item">
      <div class="tl-dot ${tx.jenis}">${tx.jenis==='in'?'💵':'💸'}</div>
      <div class="tl-info"><div class="tl-name">${tx.ket}</div><div class="tl-meta">${formatDate(tx.tgl)} · <span class="cat-tag">${tx.kat}</span>${tx.note?' · '+tx.note:''}</div></div>
      <div style="text-align:right;flex-shrink:0">
        <div class="tl-amount ${tx.jenis==='in'?'amount-in':'amount-out'}">${tx.jenis==='in'?'+':'−'}${idr(tx.jml)}</div>
        <span class="badge ${tx.jenis==='in'?'badge-green':'badge-red'}" style="margin-top:4px">${tx.jenis==='in'?'Masuk':'Keluar'}</span>
      </div>
    </div>`).join('');
}

// ─── LAPORAN ───
function renderLaporan(){
  const tin=totalPemasukan(), tout=totalPengeluaran(), sal=saldo();
  document.getElementById('lIn').textContent=idr(tin);
  document.getElementById('lOut').textContent=idr(tout);
  document.getElementById('lSaldo').textContent=idr(sal);

  const katIn={};data.pemasukan.forEach(x=>{katIn[x.kat]=(katIn[x.kat]||0)+x.jml;});
  document.getElementById('laporanKatIn').innerHTML=Object.keys(katIn).length?Object.entries(katIn).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`
    <div style="margin-bottom:14px"><div style="display:flex;justify-content:space-between;font-size:13.5px;font-weight:600;margin-bottom:5px"><span>${k}</span><span class="amount-in">${idr(v)}</span></div>
    <div class="progress-bar"><div class="progress-fill" style="background:var(--green);width:${Math.round(v/tin*100)}%"></div></div></div>`).join(''):
    '<div class="empty-state"><div class="es-icon">📭</div></div>';

  const katOut={};data.pengeluaran.forEach(x=>{katOut[x.kat]=(katOut[x.kat]||0)+x.jml;});
  document.getElementById('laporanKatOut').innerHTML=Object.keys(katOut).length?Object.entries(katOut).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`
    <div style="margin-bottom:14px"><div style="display:flex;justify-content:space-between;font-size:13.5px;font-weight:600;margin-bottom:5px"><span>${k}</span><span class="amount-out">${idr(v)}</span></div>
    <div class="progress-bar"><div class="progress-fill" style="background:var(--red);width:${tout?Math.round(v/tout*100):0}%"></div></div></div>`).join(''):
    '<div class="empty-state"><div class="es-icon">📭</div></div>';

  const all=[...data.pemasukan.map(x=>({...x,jenis:'in'})),...data.pengeluaran.map(x=>({...x,jenis:'out'}))].sort((a,b)=>b.tgl.localeCompare(a.tgl));
  document.getElementById('bodyLaporan').innerHTML=all.map(tx=>`<tr>
    <td>${formatDate(tx.tgl)}</td>
    <td><span class="badge ${tx.jenis==='in'?'badge-green':'badge-red'}">${tx.jenis==='in'?'💵 Masuk':'💸 Keluar'}</span></td>
    <td>${tx.ket}</td><td><span class="cat-tag">${tx.kat}</span></td>
    <td class="${tx.jenis==='in'?'amount-in':'amount-out'}">${tx.jenis==='in'?'+':'−'}${idr(tx.jml)}</td></tr>`).join('');
}

// ─── KATEGORI ───
function renderKategori(){
  document.getElementById('bodyKatIn').innerHTML=data.katIn.map((k,i)=>`<tr><td style="color:var(--gray-400);font-size:12px">${i+1}</td><td><span class="cat-tag">${k}</span></td><td><button class="btn-icon btn-del" onclick="delKatIn(${i})">🗑️</button></td></tr>`).join('');
  document.getElementById('bodyKatOut').innerHTML=data.katOut.map((k,i)=>`<tr><td style="color:var(--gray-400);font-size:12px">${i+1}</td><td><span class="cat-tag">${k}</span></td><td><button class="btn-icon btn-del" onclick="delKatOut(${i})">🗑️</button></td></tr>`).join('');
}
function saveKatIn(){const v=document.getElementById('namaKatIn').value.trim();if(!v){toast('Isi nama kategori!','error');return;}if(data.katIn.includes(v)){toast('Kategori sudah ada!','error');return;}data.katIn.push(v);document.getElementById('namaKatIn').value='';closeModal('modalKatIn');renderKategori();renderKategoriSelects();saveData();toast('Kategori ditambahkan!');}
function saveKatOut(){const v=document.getElementById('namaKatOut').value.trim();if(!v){toast('Isi nama kategori!','error');return;}if(data.katOut.includes(v)){toast('Kategori sudah ada!','error');return;}data.katOut.push(v);document.getElementById('namaKatOut').value='';closeModal('modalKatOut');renderKategori();renderKategoriSelects();saveData();toast('Kategori ditambahkan!');}
function delKatIn(i){if(!confirm('Hapus kategori ini?'))return;data.katIn.splice(i,1);renderKategori();renderKategoriSelects();saveData();toast('Kategori dihapus!','error');}
function delKatOut(i){if(!confirm('Hapus kategori ini?'))return;data.katOut.splice(i,1);renderKategori();renderKategoriSelects();saveData();toast('Kategori dihapus!','error');}
function renderKategoriSelects(){
  const kp=document.getElementById('katPemasukan');const curp=kp.value;
  kp.innerHTML='<option value="">Pilih Kategori</option>'+data.katIn.map(k=>`<option value="${k}">${k}</option>`).join('');kp.value=curp;
  const ke=document.getElementById('katPengeluaran');const cure=ke.value;
  ke.innerHTML='<option value="">Pilih Kategori</option>'+data.katOut.map(k=>`<option value="${k}">${k}</option>`).join('');ke.value=cure;
  document.getElementById('filterKatPemasukan').innerHTML='<option value="">Semua Kategori</option>'+data.katIn.map(k=>`<option value="${k}">${k}</option>`).join('');
  document.getElementById('filterKatPengeluaran').innerHTML='<option value="">Semua Kategori</option>'+data.katOut.map(k=>`<option value="${k}">${k}</option>`).join('');
}

// ─── SHARE / PRINT ───
function buildLaporanText(){
  const tin=totalPemasukan(),tout=totalPengeluaran(),sal=saldo();
  const now=new Date().toLocaleDateString('id-ID',{weekday:'long',year:'numeric',month:'long',day:'numeric'});
  const bayar=data.warga.filter(w=>w.status==='paid').length;
  const all=[...data.pemasukan.map(x=>({...x,jenis:'in'})),...data.pengeluaran.map(x=>({...x,jenis:'out'}))].sort((a,b)=>b.tgl.localeCompare(a.tgl));
  let txt='================================\n   LAPORAN KEUANGAN KAS TARUNA\n   Karang Taruna RT 05\n   Persiapan 17 Agustus 2025\n================================\n\nTanggal Cetak: '+now+'\n\n--- RINGKASAN ---\nTotal Pemasukan : '+idr(tin)+'\nTotal Pengeluaran: '+idr(tout)+'\nSaldo Akhir     : '+idr(sal)+'\nIuran Terkumpul : '+bayar+' dari '+data.warga.length+' warga\n\n--- DETAIL TRANSAKSI ---\n';
  all.forEach((tx,i)=>{txt+=(i+1)+'. '+formatDate(tx.tgl)+' ['+(tx.jenis==='in'?'MASUK':'KELUAR')+']\n   '+tx.ket+' ('+tx.kat+')\n   '+(tx.jenis==='in'?'+':'-')+idr(tx.jml)+'\n';});
  txt+='\n================================\nKasTaruna - Sistem Kas Karang Taruna\n================================\n';
  return txt;
}

function openShareModal(){document.getElementById('shareModal').classList.add('open');const el=document.getElementById('printDate');if(el)el.textContent=new Date().toLocaleDateString('id-ID',{year:'numeric',month:'long',day:'numeric'});}
function closeShareModal(){document.getElementById('shareModal').classList.remove('open');}
document.getElementById('shareModal').addEventListener('click',e=>{if(e.target===document.getElementById('shareModal'))closeShareModal();});

function shareWA(){
  const tin=totalPemasukan(),tout=totalPengeluaran(),sal=saldo();
  const bayar=data.warga.filter(w=>w.status==='paid').length;
  const now=new Date().toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'});
  const all=[...data.pemasukan.map(x=>({...x,jenis:'in'})),...data.pengeluaran.map(x=>({...x,jenis:'out'}))].sort((a,b)=>b.tgl.localeCompare(a.tgl)).slice(0,15);
  const msg='*LAPORAN KEUANGAN KAS TARUNA* 🇮🇩\nKarang Taruna RT 05 — Persiapan 17 Agustus 2025\n_Dicetak: '+now+'_\n\n💰 *Total Pemasukan:* '+idr(tin)+'\n💸 *Total Pengeluaran:* '+idr(tout)+'\n✅ *Saldo Akhir:* *'+idr(sal)+'*\n👥 *Iuran:* '+bayar+'/'+data.warga.length+' warga\n\n*Detail:*\n'+all.map((tx,i)=>(i+1)+'. '+(tx.jenis==='in'?'(+)':'(-)')+idr(tx.jml)+' — '+tx.ket).join('\n')+'\n\n_KasTaruna — Sistem Kas Karang Taruna_';
  window.open('https://wa.me/?text='+encodeURIComponent(msg),'_blank');
  closeShareModal();toast('Membuka WhatsApp...','success');
}
function copyLaporan(){
  const txt=buildLaporanText();
  if(navigator.clipboard){navigator.clipboard.writeText(txt).then(()=>toast('Laporan disalin!','success')).catch(()=>fallbackCopy(txt));}
  else{fallbackCopy(txt);}
  closeShareModal();
}
function fallbackCopy(txt){const ta=document.createElement('textarea');ta.value=txt;ta.style.cssText='position:fixed;opacity:0;';document.body.appendChild(ta);ta.select();try{document.execCommand('copy');toast('Laporan disalin!','success');}catch(e){toast('Gagal menyalin','error');}document.body.removeChild(ta);}
function shareNative(){if(navigator.share){navigator.share({title:'Laporan Kas Karang Taruna RT 05',text:buildLaporanText()}).then(()=>toast('Laporan dibagikan!','success')).catch(()=>{});}else{copyLaporan();}closeShareModal();}
function printLaporanDirect(){
  renderLaporan();
  const el=document.getElementById('printDate');
  if(el)el.textContent=new Date().toLocaleDateString('id-ID',{weekday:'long',year:'numeric',month:'long',day:'numeric'});
  setTimeout(()=>window.print(), 300);
}
function savePDF(){
  renderLaporan();
  const el=document.getElementById('printDate');
  if(el)el.textContent=new Date().toLocaleDateString('id-ID',{weekday:'long',year:'numeric',month:'long',day:'numeric'});
  toast('Pilih "Save as PDF" pada dialog cetak','success');
  setTimeout(()=>window.print(),600);
}
function printLaporan(){printLaporanDirect();}

